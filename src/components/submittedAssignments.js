import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import '../styles/submittedAssignments.css';

// firebase related imports 
import { getAuth} from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

import SubmitAssignmentCard from './SubmitAssignmentCard';

function SubmittedAssignments() {
    const history = useHistory();
    const auth = getAuth();
    const db = getDatabase();
    const dbRef = ref(db, 'studentAssignments');

    const [studentList, setStudentList] = useState([]);
    const [numberOfStudents, setNumberOfStudents] = useState(0);

    useEffect(() => {
        let students = [];
        console.log(dbRef);
        let count = 0;
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                if (count % 2 !== 0) {
                    students.push({
                        Path: childSnapshot.val().Path,
                        StudentID: childSnapshot.val().StudentID,
                        StudentName: childSnapshot.val().StudentName,
                        AssignmentNumber: childSnapshot.val().AssignmentNumber
                    });
                    console.log(students, Math.ceil(count / 2));
                }
                count += 1;
            });
            setStudentList(students);
            setNumberOfStudents(Math.ceil(count / 2));
            console.log(numberOfStudents);
        }, {
            onlyOnce: true
        });

        console.log(studentList, numberOfStudents);
        // console.log();
    }, [numberOfStudents!==studentList.length]);


    return (
        <div className="SubmittedAssignments">
            <div className="header">
                <button className="home" onClick={() => { history.replace("/home") }}>&larr; Go back Home</button>
            </div>
            <div>
                {
                    (studentList === []) ?
                        (
                            <div><h1>Nothing to show</h1></div>
                        ) :
                        (
                            <div>
                                {/* {console.log(Assignments)} */}
                                <h1>Submitted Assignments</h1>
                                {
                                    console.log(numberOfStudents,studentList.length),
                                    studentList.length !== numberOfStudents ?
                                        <h1>Nothing to show</h1> :
                                        (
                                            <div className="ShowContainer">
                                                {
                                                    studentList.map((userAssignment) => (
                                                        console.log(userAssignment),
                                                        <SubmitAssignmentCard
                                                            Path={userAssignment.Path}
                                                            StudentID={userAssignment.StudentID}
                                                            Name={userAssignment.StudentName}
                                                            AssignmentNumber={userAssignment.AssignmentNumber}
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
        </div>
    )
}
export default SubmittedAssignments;