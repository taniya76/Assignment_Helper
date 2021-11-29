import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import '../styles/home.css';
import Navbar from './Navbar.js';
import AssignmentCard from './AssignmentCard';

//firebase related imports
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";


function Home() {
    const history = useHistory();
    const [Assignments, setAssignment] = useState([]);
    const [count, setCount] = useState(0);


    const db = getDatabase();
    const dbRef = ref(db, 'assignments/');
    useEffect(() => {
        onValue(dbRef, (snapshot) => {
            const newMember = [];
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                newMember.push({
                    Description: childData.assignmentDescription,
                    Number: childData.assignmentNumber,
                    FileName: childData.assignmentFiles[0].fileName,
                    FilePath: childData.assignmentFiles[0].filePath
                });

            });
            setAssignment(newMember);
        }, {
            onlyOnce: true
        });

        setCount(Assignments.length);
    }, [count !== Assignments.length]);

    //first thing called when user signin/signup
    let userkey;
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = auth.currentUser.uid;
            const db = getDatabase();
            const dbRef = ref(db, 'users');
            // console.log(uid);

            onValue(dbRef, (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.val().uid === uid) {
                        userkey = childSnapshot.key;
                        // console.log(userkey);
                    }
                })
            }, {
                onlyOnce: true
            });
        } else {
            // console.log("logged out");
            history.replace("/");
        }
    });


    return (
        <div>
            <Navbar />
            {
                (Assignments === []) ?
                    (
                        <div><h1>Nothing to show</h1></div>
                    ) :
                    (
                        <div>
                            <h2>Assignments</h2>
                            {
                                Assignments.length !== { count }.count ?
                                    <h1>Nothing to show</h1> :
                                    (
                                        <div className="Assignment_Container">

                                            {
                                                Assignments.map((userAssignment) => (
                                                    <AssignmentCard
                                                        key={userAssignment.Number}
                                                        Description={userAssignment.Description}
                                                        Number={userAssignment.Number}
                                                        FileName={userAssignment.FileName}
                                                        FilePath={userAssignment.FilePath}
                                                    />

                                                ))
                                            }
                                        </div>
                                    )
                            }
                        </div>
                    )
            }
        </div>
    );
};

export default Home;