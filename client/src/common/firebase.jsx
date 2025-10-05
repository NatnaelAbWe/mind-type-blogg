import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC3L3-s8t-U_e2t9VOm0GfKoxR8IKCGpZ8",
  authDomain: "mind-type-blogg-webapp.firebaseapp.com",
  projectId: "mind-type-blogg-webapp",
  storageBucket: "mind-type-blogg-webapp.firebasestorage.app",
  messagingSenderId: "53119241107",
  appId: "1:53119241107:web:26eecc5de7eba9cce93666",
  measurementId: "G-KE3VF86Q7S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// google Auth
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });
  return user;
};
