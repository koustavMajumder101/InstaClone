import firebase from "firebase";

const firebaseApp = firebase.initializeApp(
   {
    apiKey: "AIzaSyAbsvU9le-3wrvW6RiOI1t0DiD7XoV2dUA",
    authDomain: "instagram-clone-react-4d17f.firebaseapp.com",
    databaseUrl:"https://instagram-clone-react.firebaseio.com ",
    projectId: "instagram-clone-react-4d17f",
    storageBucket: "instagram-clone-react-4d17f.appspot.com",
    messagingSenderId: "776668119839",
    appId: "1:776668119839:web:fb764b95dc1bc4c88de62a",
    measurementId: "G-JPJJ0N11X1"
   });


const auth = firebase.auth();
const db = firebaseApp.firestore();
const storage = firebase.storage();

export { db,auth,storage };
