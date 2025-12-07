import React from 'react'
import AuthContext from './AuthContext'
import { auth } from '../firebase/firebase.config'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
  // create user
  const userRegister = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }
  // update user
  const userUpdate = async (info) => {
    return updateProfile(auth.currentUser,info)
  }
  // google login
  const googleLogin = async () => {
    return signInWithPopup(auth,googleProvider)
  }
  // userlogin
  const userLogin = async (email,password)=>{
    return signInWithEmailAndPassword(auth,email,password)
  }
  const authInfo = {
    userRegister,
    userUpdate,
    googleLogin,
    userLogin
  }
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider