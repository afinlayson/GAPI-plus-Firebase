import firebase from 'firebase';
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

export class Firebase {

    static fbObj = app.initializeApp(config);  

    constructor() {
        
        this.fb = Firebase.fbObj;                        
        this.googleProvider = new app.auth.GoogleAuthProvider();
        this.facebookProvider = new app.auth.FacebookAuthProvider();
        this.twitterProvider = new app.auth.TwitterAuthProvider();        
        this.emailAuthProvider = app.auth.EmailAuthProvider;
        this.serverValue = app.database.ServerValue;
        this.auth = app.auth();
        this.db = app.database();
    }

    signinFromGAPI = (currentUser) => {
        const authResponse = currentUser.getAuthResponse(true)
        const credential = firebase.auth.GoogleAuthProvider.credential(
          authResponse.id_token,
          authResponse.access_token
        )
        this.fb.auth().signInWithCredential(credential)
          .then((output) => {
            let user = output.user
              
            if (user) {
                let fbUser = {
                    username: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                    roles: {},
                    created: (new Date()).toISOString()
                }
                console.log('firebase: user signed in!', fbUser)
                // debugger

                this.user(user.uid).get().then((obj) => {
                    // if (obj === )
                    let val = obj.val();
                    if (val === undefined) {
                        this.user(user.uid).set(fbUser)
                    } else {
                        console.log("FB", val)
                    }
                    
                });
            }
        });        
    }

    signOut = () => this.auth.signOut();
    user = uid => this.db.ref(`users/${uid}`);
}
