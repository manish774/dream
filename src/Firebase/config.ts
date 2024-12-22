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
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
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
  udupi: {
    apiKey: "AIzaSyCohE_EzDtV5n3znDGBy3G3UDjmJOiiPtY",
    authDomain: "udupiexpense.firebaseapp.com",
    projectId: "udupiexpense",
    storageBucket: "udupiexpense.firebasestorage.app",
    messagingSenderId: "106708082420",
    appId: "1:106708082420:web:f8917e7dbf9dafa98bc8a1",
    measurementId: "G-JTWN2E7KH1",
  },
};

export const firebaseUsers = Object.keys(firebaseConfigs);
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

export const addAttributeToCollection = async (
  projectKey: keyof typeof firebaseConfigs = "manish",
  collectionName: string,
  attributeName: string,
  attributeValue: any
) => {
  try {
    const { db } = getFirebaseServices(projectKey);
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);

    const updatePromises = snapshot.docs.map((docSnap) => {
      const docRef = doc(db, collectionName, docSnap.id);
      return updateDoc(docRef, { [attributeName]: attributeValue });
    });

    await Promise.all(updatePromises);
    console.log(
      `Attribute '${attributeName}' added to all documents in '${collectionName}' collection.`
    );
  } catch (error) {
    console.error("Error adding attribute to collection:", error);
  }
};

// Example usage
// addAttributeToCollection("priya", "Items", "pmode", "PhonePe");
