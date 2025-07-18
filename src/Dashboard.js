import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from "./firebase"; // Import your auth instance

// The 'user' prop will contain the logged-in user's data
const Dashboard = ({ user }) => {

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      // The onAuthStateChanged listener in App.js will handle the redirect
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Welcome to evo<span style={{color: '#7f5af0'}}>Code</span>, {user.displayName || 'Coder'}!</h1>
      <p>Your email is: {user.email}</p>
      {/* This is where your main app content like lessons, profile, etc. will go */}
      <br />
      <button 
        onClick={handleLogout} 
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;