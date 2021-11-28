import React, { useRef } from 'react';
import { useHistory } from "react-router-dom";

import { getAuth, updateProfile, deleteUser } from "firebase/auth";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";

import '../styles/details.css';
//package for showing notifications
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

function Details() {

    const history = useHistory();
    const auth = getAuth();

    const userName = useRef(null);
    const teacher = useRef(false);
    const student = useRef(true);
    const studentID = useRef(null);
    const branch = useRef(null);


    function cancelSignUp() {
        const uid = auth.currentUser.uid;
        const currentUser = auth.currentUser;
        let userkey = null;
        const db = getDatabase();
        const dbRef = ref(db, 'users');

        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().uid === uid) {
                    userkey = childSnapshot.key;
                }
                if (userkey) {
                    //delete 
                    const objRef = ref(db, 'users/' + userkey);
                    //if user press cancle it means we have to delete the data from realtime storage and also from authentication
                    remove(objRef).then(() => {
                        deleteUser(currentUser).then(() => {
                            // User deleted.
                        }).catch((error) => {
                            // An error ocurred
                            console.log(error);
                        });
                    })

                    //going back
                    history.replace('/');
                }
            })
        });
    }

    function submitDetails(event) {
        event.preventDefault();

        const uid = auth.currentUser.uid;
        const isTeacher = teacher.current.checked;
        const isStudent = student.current.checked;
        const name = userName.current.value;

        const usertype = (isTeacher) ? "Teacher" : "Student";

        console.log(uid, name);

        let userKey = null;

        //update the username
        updateProfile(auth.currentUser, {
            displayName: name
        }).then(() => {
            // Profile updated!
        }).catch((error) => {
            // An error occurred
            console.log(error);
        });

        const db = getDatabase();

        const dbRef = ref(db, 'users');
        //finding the user and adding all the values to it
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().uid === uid) {
                    userKey = childSnapshot.key;
                }

                if (userKey) {
                    console.log(childSnapshot);
                    if (usertype === "Student") {

                        if (studentID.current.value === "" || branch.current.value === "") {
                            NotificationManager.error('Please enter all details', 'Error', 3000);
                            return;
                        }
                        set(ref(db, 'users/' + userKey), {
                            userName: name,
                            userType: usertype,
                            studentID: studentID.current.value,
                            branch: branch.current.value,
                            uid:uid,
                            email:auth.currentUser.email
                        }).then(() => {
                            // Data saved successfully!
                        }).catch((error) => {
                            console.log(error);
                            // The write failed...
                        });
                    } else {
                        set(ref(db, 'users/' + userKey), {
                            userName: name,
                            userType: usertype, 
                            uid:uid,
                            email:auth.currentUser.email
                        }).then(() => {
                            // Data saved successfully!
                        }).catch((error) => {
                            console.log(error);
                            // The write failed...
                        });
                    }
                    console.log(auth.currentUser);
                    history.replace("/home");
                }
            })
        }, {
            onlyOnce: true
        });

    }

    return (
        <div id="details-page">
            <div className="details" onSubmit={submitDetails}>
                <div className="details-title">Details</div>
                <form className="details-form">
                    <div>Name</div>
                    <input type="text" className="details-name" ref={userName} required />
                    <div>You are a...</div>
                    <div>
                        <label><input type="radio" name="user" value="Teacher" ref={teacher} /> Teacher </label>
                        <label><input type="radio" name="user" value="Student" ref={student} /> Student </label>
                    </div>
                    <strong><p>IF YOU ARE A STUDENT PLEASE FILL THE ID AND BRANCH</p></strong>
                    <div>
                        <div>ID</div>
                        <input type="text" className="details-id" ref={studentID} />
                        <div>Branch</div>
                        <input type="text" name="branch" ref={branch} />
                    </div>
                    <input type="submit" className="details-submit" />
                    <input type="button" value="Cancel" className="details-cancel-button" onClick={cancelSignUp} />
                </form>
                <NotificationContainer />
            </div>
        </div>
    );

}

export default Details;
