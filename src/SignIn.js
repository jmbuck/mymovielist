import React from 'react'

import { auth, googleProvider, facebookProvider } from './keys'
import './SignIn.css'

const SignIn = () => {
    const authenticate = (provider) => {
        auth
            .signInWithPopup(provider)
    }

    return (
        <div className="SignIn">
            <div className="main-content">
                <h1 className="title">MyMovieList</h1>
                <button className="google" onClick={() => authenticate(googleProvider)}>
                     <span className="fa fa-google icon"></span>Sign in with Google
                </button>
                <button className="facebook" onClick={() => authenticate(facebookProvider)}>
                     <span className="fa fa-facebook icon"></span>Sign in with Facebook
                </button>
            </div>    
        </div>               
    )
}

export default SignIn