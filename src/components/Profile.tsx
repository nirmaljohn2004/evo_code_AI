"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Profile.css";

import { User as FirebaseUser } from "firebase/auth";
import { db } from "../firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface UserProfileData {
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  bio?: string;
  location?: string;
  psychometricScore?: number | null;
}

interface ProfileProps {
  user: FirebaseUser | null;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<Partial<UserProfileData>>({});

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const userDocRef = doc(db, "users", user.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfileData;
          if (data.psychometricScore === undefined) data.psychometricScore = null;
          setProfileData(data);
          setEditForm(data);
        } else {
          const newProfile: UserProfileData = {
            name: user.displayName || "New User",
            email: user.email || "",
            level: 1,
            xp: 0,
            streak: 0,
            bio: "",
            location: "",
            psychometricScore: null,
          };
          await setDoc(userDocRef, newProfile);
          setProfileData(newProfile);
          setEditForm(newProfile);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    try {
      await setDoc(userDocRef, editForm, { merge: true });
      setProfileData((prev) => {
        const base: UserProfileData =
          prev ??
          ({
            name: "",
            email: "",
            level: 1,
            xp: 0,
            streak: 0,
            bio: "",
            location: "",
            psychometricScore: null,
          } as UserProfileData);
        return { ...base, ...(editForm as UserProfileData) };
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleSavePsychometric = async (newScore: number | null) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    try {
      await setDoc(userDocRef, { psychometricScore: newScore }, { merge: true });
      setProfileData((prev) => (prev ? { ...prev, psychometricScore: newScore } : prev));
      setEditForm((prev) => ({ ...prev, psychometricScore: newScore ?? null }));
    } catch (err) {
      console.error("Error saving psychometric score:", err);
    }
  };

  const handleStartPsychometric = () => {
    navigate("/psychometric-test");
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!profileData) return <div>No profile to display.</div>;

  const displayName = profileData.name || user?.displayName || "User";
  const displayEmail = profileData.email || user?.email || "";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const scoreText =
    profileData.psychometricScore === null || profileData.psychometricScore === undefined
      ? "Not taken yet"
      : String(profileData.psychometricScore);

  return (
    <div className="profile">
      {/* Header row: avatar + info + edit actions */}
      <div className="profile-header">
        <motion.div
          className="profile-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="profile-main">
            <div className="profile-picture-container">
              <div className="profile-picture">
                <div className="default-avatar">
                  <span>{avatarInitial}</span>
                </div>
              </div>
              <div className="level-badge">
                <span>Level {profileData.level}</span>
              </div>
            </div>

            <div className="profile-info">
              {isEditing ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editForm.name ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="edit-input name-input"
                    placeholder="Your name"
                  />
                  <textarea
                    value={editForm.bio ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="edit-textarea"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              ) : (
                <div className="profile-details">
                  <h1>{displayName}</h1>
                  <p className="email">{displayEmail}</p>
                  <p className="bio">{profileData.bio || "No bio yet."}</p>
                </div>
              )}

              <section className="profile-actions">
                {isEditing ? (
                  <div>
                    <button onClick={handleSave} className="save-btn">Save</button>
                    <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="edit-btn">
                    ✏️ Edit Profile
                  </button>
                )}
              </section>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Separate full-width psychometric card BELOW the header row */}
      <section className="psychometric-large-card">
        <header className="psychometric-large-header">
          <div className="psychometric-title">
            <h3>Psychometric Score</h3>
            <p className="psychometric-subtitle">
              Use this score to tailor explanation style and difficulty in the tutor.
            </p>
          </div>
          <div className="psychometric-score-display">
            <span className="psychometric-score-number">{scoreText}</span>
          </div>
        </header>

        <div className="psychometric-large-actions">
          <button onClick={handleStartPsychometric} className="start-psychometric-btn">
            Take / Retake Psychometric Test
          </button>

          {/* Optional quick-set for testing only
          <button
            onClick={() => handleSavePsychometric(82)}
            className="save-psychometric-btn"
          >
            Set demo score 82
          </button> */}
        </div>
      </section>

      {/* Tabs / other content can use profileData */}
    </div>
  );
};

export default Profile;
