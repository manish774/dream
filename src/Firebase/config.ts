// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyAHtUDArOfWP1H4OskMNe1sLnUlaP8svJ4",
//   authDomain: "mydream-6c77f.firebaseapp.com",
//   projectId: "mydream-6c77f",
//   storageBucket: "mydream-6c77f.appspot.com",
//   messagingSenderId: "134199548045",
//   appId: "1:134199548045:web:51e0463f8f43a8b7116ac4",
//   measurementId: "G-09V3TWQDXQ",
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();

// export const db = getFirestore(app);

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const firebaseConfigs: Record<string, FirebaseConfig> = {
  manish: {
    apiKey: "AIzaSyAHtUDArOfWP1H4OskMNe1sLnUlaP8svJ4",
    authDomain: "mydream-6c77f.firebaseapp.com",
    projectId: "mydream-6c77f",
    storageBucket: "mydream-6c77f.appspot.com",
    messagingSenderId: "134199548045",
    appId: "1:134199548045:web:51e0463f8f43a8b7116ac4",
    measurementId: "G-09V3TWQDXQ",
  },
  priya: {
    apiKey: "AIzaSyDVgbIfcHrd4Zwa_4O5LQsw4CRzfb9wvgo",
    authDomain: "mydream-91333.firebaseapp.com",
    projectId: "mydream-91333",
    storageBucket: "mydream-91333.appspot.com",
    messagingSenderId: "674773976291",
    appId: "1:674773976291:web:1eb2f3957c5568160f31d6",
    measurementId: "G-2NHC9CBNR2",
  },
};

// Store initialized apps
const firebaseInstances: Record<string, any> = {};

// Function to get or initialize a Firebase app
export const getFirebaseApp = (
  projectKey: keyof typeof firebaseConfigs = "manish"
) => {
  if (!firebaseInstances[projectKey]) {
    const apps = getApps();
    if (apps.some((app) => app.name === projectKey)) {
      firebaseInstances[projectKey] = getApp(projectKey);
    } else {
      firebaseInstances[projectKey] = initializeApp(
        firebaseConfigs[projectKey],
        projectKey
      );
    }
  }
  return firebaseInstances[projectKey];
};

// Function to get Firebase services for a specific app
export const getFirebaseServices = (
  projectKey: keyof typeof firebaseConfigs = "manish"
) => {
  const app = getFirebaseApp(projectKey);
  return {
    auth: getAuth(app),
    googleProvider: new GoogleAuthProvider(),
    db: getFirestore(app),
  };
};
