import React, { useEffect, useState } from 'react'
import AuthContext from './AuthContext'
import { auth } from '../firebase/firebase.config'
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth'
const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  // create user
  const userRegister = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }
  // update user
  const userUpdate = async (info) => {
    return updateProfile(auth.currentUser, info)
  }
  // google login
  const googleLogin = async () => {
    return signInWithPopup(auth, googleProvider)
  }
  // userlogin
  const userLogin = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }
    // Logout
  const userLogout = () => {
    setLoading(true);
    return signOut(auth);
  };
  // user observe
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const authInfo = {
    userRegister,
    userUpdate,
    googleLogin,
    userLogin,
    loading,
    setLoading,
    user,
    userLogout
  }
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider