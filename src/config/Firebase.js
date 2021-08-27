import firebase from "firebase";

const config = {
  apiKey: "AIzaSyD-sxP7Levorbb7Z_PO-7CBcpdt350EW-k",
  authDomain: "crowdfunding-platform-ac169.firebaseapp.com",
  databaseURL: "https://crowdfunding-platform-ac169.firebaseio.com",
  projectId: "crowdfunding-platform-ac169",
  storageBucket: "crowdfunding-platform-ac169.appspot.com",
  messagingSenderId: "72156839102",
  appId: "1:72156839102:web:28416ff582c5791920f2ef",
  measurementId: "G-Q31F368B9F",
};

const fire = firebase.initializeApp(config);

export default fire;
