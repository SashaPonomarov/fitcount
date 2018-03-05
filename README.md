# <img src="https://raw.githubusercontent.com/SashaPonomarov/fitcount/master/public/apple-touch-icon.png" width="120"> Fitcount

This is a little app to keep track of your fitness routines, specifically the number of certain excercises you do per day. It uses React and Material-UI for rendering and Firebase database for data storage.

Demo app is hosted [here](https://fitcount-9603f.firebaseapp.com/).

If you'd like to host the app yourself, clone the repo and add your firebase credentials at `src/config/firebase.js`. The file should look like this:

```javascript
import firebase from 'firebase';
const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};
firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;
```

Use `npm run build` for production build.

To use the app, log in with your Google account. You can save the page to your home screen for more app-like experience.

Todo:
- Adding new types of activities 
- Monthly statistics