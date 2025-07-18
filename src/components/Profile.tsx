"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import "./Profile.css" // Assuming this file exists and is styled

// --- CHANGED ---
// 1. Import Firebase types and Firestore functions
import { User as FirebaseUser } from "firebase/auth"
import { db } from "../firebase.js"
import { doc, getDoc, setDoc } from "firebase/firestore"

// This is the structure of the data we expect from our Firestore database
interface UserProfileData {
  name: string
  email: string
  level: number
  xp: number
  streak: number
  bio?: string
  location?: string
  // ... any other fields you store in Firestore
}

// The Profile component now receives the basic FirebaseUser from props
interface ProfileProps {
  user: FirebaseUser | null
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  // --- CHANGED ---
  // 2. State to hold the full profile data fetched from Firestore
  const [profileData, setProfileData] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for editing, etc. remains the same
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<UserProfileData>>({})

  // --- CHANGED ---
  // 3. useEffect to fetch data from Firestore when the component loads
  useEffect(() => {
    // Only fetch data if we have a logged-in user
    if (user) {
      const fetchProfileData = async () => {
        setLoading(true)
        const userDocRef = doc(db, "users", user.uid)
        try {
          const docSnap = await getDoc(userDocRef)

          if (docSnap.exists()) {
            // If the document exists, set the profile data state
            const data = docSnap.data() as UserProfileData
            setProfileData(data)
            setEditForm(data) // Pre-fill the edit form
          } else {
            // --- NEW LOGIC ---
            // If the document doesn't exist, create it on the fly
            console.log("No profile document found. Creating a new one...");
            const newProfile: UserProfileData = {
              name: user.displayName || "New User",
              email: user.email || "",
              level: 1,
              xp: 0,
              streak: 0,
              bio: "",
              location: "",
            };
            // Save the new profile to Firestore
            await setDoc(userDocRef, newProfile);
            // Set the state with the new profile data
            setProfileData(newProfile);
            setEditForm(newProfile);
          }
        } catch (err) {
          setError("Failed to fetch profile data.")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }

      fetchProfileData()
    } else {
      // If there's no user, stop loading and show nothing
      setLoading(false)
    }
  }, [user]) // This effect re-runs if the user object changes

  // --- CHANGED ---
  // 4. Handle Save to update the Firestore document
  const handleSave = async () => {
    if (!user) return; // Should not happen, but good practice

    const userDocRef = doc(db, "users", user.uid);
    try {
      await setDoc(userDocRef, editForm, { merge: true }); // 'merge: true' updates fields without overwriting the whole doc
      setProfileData(editForm as UserProfileData);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      // Optionally, show an error message to the user
    }
  };

  // --- UI RENDER LOGIC ---
  if (loading) {
    return <div>Loading profile...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!profileData) {
    return <div>No profile to display.</div>
  }

  // --- CHANGED ---
  // 5. Safely access data using optional chaining and providing fallbacks
  const displayName = profileData.name || user?.displayName || "User"
  const displayEmail = profileData.email || user?.email || ""
  const avatarInitial = displayName.charAt(0).toUpperCase()

  return (
    <div className="profile">
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
                    value={editForm.name || ""}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="edit-input name-input"
                    placeholder="Your name"
                  />
                  <textarea
                    value={editForm.bio || ""}
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
              <div className="profile-actions">
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
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* You can add back your tabs and other content here, using `profileData` */}
    </div>
  )
}

export default Profile
