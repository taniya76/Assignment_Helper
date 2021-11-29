import React, { useRef } from 'react';
import '../styles/SignUp.css';
import { useHistory } from "react-router-dom";

//firebase related imports
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { collection, addDoc } from "firebase/firestore";
import { getDatabase, ref, push, set } from "firebase/database";


//package for showing notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';


function SignUp() {

    const history = useHistory();

    const email = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);

    //this will be triggered when we submit the form of signUp
    function submitDetails(e) {
        e.preventDefault();
        console.log("in signup");
        let currentEmail = email.current.value;
        let currentPassword = password.current.value;
        let currentConfirmPassword = confirmPassword.current.value;

        console.log(currentEmail, currentPassword, currentConfirmPassword);

        //if any of the value is empty then show error
        if (currentPassword === "" || currentEmail === "" || currentConfirmPassword === "") {
            NotificationManager.error('Please enter all details', 'Error', 3000);
            return;
        }

        //if password length is small then show error
        if (currentPassword.length < 6) {
            NotificationManager.warning('Password length should contain atleast 6 characters', 'Error', 3000);
            return;
        }

        //if password doesn't match then show the error to the user
        if (currentPassword !== currentConfirmPassword) {
            console.log("wrong password");

            NotificationManager.error(`Password Doesn't match`, 'Error', 5000);
            return;
        }


        const auth = getAuth();
        createUserWithEmailAndPassword(auth, currentEmail, currentPassword)
            .then((userCredential) => {
                // console.log(userCredential);

                // NotificationManager.success('Created the Account', 'Success');
                const db = getDatabase();

                const postListRef = ref(db, 'users');
                const newPostRef = push(postListRef);
                set(newPostRef, {
                    email: userCredential.user.email,
                    uid: userCredential.user.uid
                });
                history.replace('/details');

            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                NotificationManager.warning(errorMessage, 'Warning', 3000);
                console.log(errorCode, errorMessage);
            });
    }

    return (

        <div id="signUp_ID">
            <div className="signUp">
                <div className="signUp-title">Sign Up</div>
                <form className="signUp-form" >
                    <div className="row">
                        <label>Email</label>
                        <input type="text" className="signUp_email" name="email" placeholder="Enter your Email" ref={email} autoComplete="off" />

                    </div>
                    <div className="row">
                        <label>Password</label>
                        <input type="password" className="signUp_password" name="password" placeholder="Enter your Password" ref={password} />

                    </div>
                    <div className="row">
                        <label>Confirm Password</label>
                        <input type="password" className="signUp_password" name="confirmPassword" placeholder="Confirm Password" ref={confirmPassword} />

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

export default SignUp;