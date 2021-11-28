import React, { useRef } from 'react';
import '../styles/SignIn.css';
import { useHistory } from "react-router-dom";

//firebase related imports
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

//package for showing notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';



function SignIn() {

    const history = useHistory();
    const email = useRef(null);
    const password = useRef(null);

    //this will be triggered when we submit the form of signUp
    function submitDetails(e) {
        e.preventDefault();
        console.log("in signIn");
        let currentEmail = email.current.value;
        let currentPassword = password.current.value;

        console.log(currentEmail, currentPassword);

        //if any of the value is empty then show error
        if (currentEmail === "" || currentPassword === "") {
            NotificationManager.error('Please enter all details', 'Error', 3000);
            return;
        }

        //if password length is small then show error
        if (currentPassword.length < 6) {
            NotificationManager.warning('Password length should contain atleast 6 characters', 'Error', 3000);
            return;
        }

        const auth = getAuth();
        signInWithEmailAndPassword(auth, currentEmail, currentPassword)
            .then((userCredential) => {
                console.log(userCredential);
                // NotificationManager.success('Login Credentials are correct', 'Success');
                
                history.replace('/home');

            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode === "auth/user-not-found") {
                    //if error if because of user not existed then show this
                    NotificationManager.error(`User doesn't exists`, 'Error', 3000);

                } else if (errorCode === "auth/wrong-password") {
                    //if error if because of password is not correct then show this
                    NotificationManager.warning('Password is not correct', 'Warning', 3000);
                }
                console.log(errorMessage);
            });
    }

    return (

        <div id="signUp_ID">
            <div className="signUp">
                <div className="signUp-title">Sign In</div>
                <form className="signUp-form" >
                    <div className="row">
                        <label>Email</label>
                        <input type="text" className="signUp_email" name="email" placeholder="Enter your Email" ref={email} autoComplete="off"/>
                    </div>
                    <div className="row">
                        <label>Password</label>
                        <input type="password" className="signUp_password" name="password" placeholder="Enter your Password" ref={password} />
                    </div>

                    <div id="button" className="button_submit">
                        <input type="submit" className="signUp_submit" onClick={submitDetails} />
                        <input type="button" className="signUp_cancel" value="Cancle" onClick={() => { history.replace("/"); }} />
                    </div>

                </form>
                <NotificationContainer />
            </div>
        </div>
    );

}


export default SignIn;