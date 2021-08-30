import React from "react";
import { authService, firebaseInstance } from "fbase";

const Auth = () => {
    const onSocialClick = async () => {
        let provider;
        provider = new firebaseInstance.auth.GoogleAuthProvider();
        await authService.signInWithPopup(provider);
      };

    return (
      <div className="authContainer">
        <div className="authBtns">
            <button onClick={onSocialClick} name="google" className="authBtn">구글 로그인</button>
        </div>
      </div>
    );
  };
export default Auth;