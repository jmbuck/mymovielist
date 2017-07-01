import Rebase from 're-base'
import firebase from 'firebase/app'
import database from 'firebase/database'
import 'firebase/auth'

const app = firebase.initializeApp({
    apiKey: "YOUR API KEY HERE",
    authDomain: "[YOUR APP NAME HERE].firebaseapp.com",
    databaseURL: "https://[YOUR APP NAME HERE].firebaseio.com",
    projectId: "[YOUR APP NAME HERE]",
    storageBucket: "",
    messagingSenderId: "YOUR MESSAGING SENDER ID HERE"
});


const db = database(app)

export const movieKey = "YOUR TMDB API KEY HERE"

export const auth = app.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider()
export const facebookProvider = new firebase.auth.FacebookAuthProvider()

export default Rebase.createClass(db)