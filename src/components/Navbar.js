import React, { useRef, useState } from 'react';
import '../styles/Navbar.css';
import { useHistory } from "react-router-dom";
import logo from '../images/logo.png';


//firebase related imports.
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";


function Navbar() {
    const history = useHistory();
    const auth = getAuth();
    const [isTeacher, setTeacher] = useState(false);
    const [name, setName] = useState(null);

    function toHome(e) {
        history.replace("/home");
    }
    function Logout(e) {
        auth.signOut();
        console.log("Sign Out Successfully");
        //going to initial page
        history.replace("/");
    }
    function Assignment() {
        history.replace("/assignment");
    }

    function submittedAssignments() {
        history.replace("/submittedAssignments");
    }

    //if current user is teacher then only show the create Assignment option
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = auth.currentUser.uid;
            const db = getDatabase();
            const dbRef = ref(db, 'users');
            // console.log(uid);

            onValue(dbRef, (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.val().uid === uid) {
                        if (childSnapshot.val().userType === "Teacher") {
                            setTeacher(true);
                        }
                        setName(childSnapshot.val().userName);
                    }
                })
            }, {
                onlyOnce: true
            });
        } else {
            auth.signOut();
            history.replace("/");
        }
    })
    return (
        <div>
            <div className="Navbar">
                <button className="homeButton" onClick={toHome}><img src={logo}  alt="Home" width={"42px"} height={"40px"}/></button>
                <button className="logoutButton right" onClick={Logout}>Logout</button>
                {
                    isTeacher ?
                        <div className="teacherOptions">
                            <button className="logoutButton right" onClick={Assignment}>Create Assignment</button>
                         </div> :
                        <div></div>
                }
            </div>
            <div className="user"><strong>Hello {name}</strong></div>
        </div>

    );
}
export default Navbar;