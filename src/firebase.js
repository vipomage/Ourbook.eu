import firebase from 'firebase'
const config = {
  apiKey: "AIzaSyBBWbNtJSD4oFDevQXdC6DXCb3B3YmOVXE",
  authDomain: "sample-book-c9188.firebaseapp.com",
  databaseURL: "https://sample-book-c9188.firebaseio.com",
  projectId: "sample-book-c9188",
  storageBucket: "sample-book-c9188.appspot.com",
  messagingSenderId: "31103902416"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;