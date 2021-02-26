import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyD6OjuY-BIy5VY2n7cKL0f3tOFxpeI14IM",
    authDomain: "imessage-clone-24578.firebaseapp.com",
    projectId: "imessage-clone-24578",
    storageBucket: "imessage-clone-24578.appspot.com",
    messagingSenderId: "113223925035",
    appId: "1:113223925035:web:b4811ddda2ace1c4e2196e"
  };

 firebase.initializeApp(firebaseConfig);

  const auth=firebase.auth();
  const provider=new firebase.auth.GoogleAuthProvider();


  export {auth,provider};
