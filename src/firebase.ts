// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
//初期化設定の内容
const firebaseConfig = {
  apiKey: "AIzaSyDKi-pAxSyRlRxMsz-0PFgU5CKODujShLw",
  authDomain: "household-2b2e6.firebaseapp.com",
  projectId: "household-2b2e6",
  storageBucket: "household-2b2e6.firebasestorage.app",
  messagingSenderId: "11365264710",
  appId: "1:11365264710:web:7263e153d10120a0bcc947"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export{db}