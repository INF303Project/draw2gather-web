import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAImgHqxtqTzXj5VnLnn5O905jkGGScRMQ",
    authDomain: "draw2gather.firebaseapp.com",
    projectId: "draw2gather",
    storageBucket: "draw2gather.appspot.com",
    messagingSenderId: "593468951085",
    appId: "1:593468951085:web:35f36d68a80c9a7e1c46a4",
    measurementId: "G-YELRJZKX3E",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
auth.setPersistence(browserSessionPersistence);
