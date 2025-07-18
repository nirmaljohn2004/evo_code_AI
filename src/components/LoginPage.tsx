import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import "./LoginPage.css"; // Assumes this file exists in the same folder

// Firebase
import { auth } from "../firebase.js"; // Correct path
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

interface FormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        // Set the user's display name after they sign up
        await updateProfile(userCredential.user, {
          displayName: formData.name,
        });
      } catch (err: any) {
        setError(err.message);
      }
    } else { // Sign In Logic
      try {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      } catch (err: any) {
        setError("Failed to sign in. Please check your credentials.");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  return (
    <div className="login-container">
      {/* ... your decorative JSX ... */}
      <motion.div className="login-card" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
        <div className="login-header">
           <h1 className="logo">evo<span className="logo-accent">Code</span></h1>
           <p className="tagline">Master coding with AI-powered learning</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
             <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required className="form-group" />
          )}
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required className="form-group" />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required className="form-group" />
          {isSignUp && (
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} required className="form-group" />
          )}
          {error && <p className="error-message">{error}</p>}
          <motion.button type="submit" className="login-btn">
            {isSignUp ? "Start Learning" : "Continue Learning"}
          </motion.button>
        </form>
        <div className="login-footer">
          <p>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button type="button" className="toggle-btn" onClick={toggleMode}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;