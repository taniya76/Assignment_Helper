import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import '../styles/Assignments.css';

import { reference } from '../firebase/firebase';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { getStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";


function SubmitAssignment() {
    const { id } = useParams();
    const history = useHistory();
    const auth = getAuth();
    const db = getDatabase();

    //required data which needs to be stored in database
    const [filePath, setFilePath] = useState(null);
    const [rollNumber, setRollNumber] = useState(null);
    const [name, setName] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [uploadButton, setUploadButton] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [percentage, setPercentage] = useState(0);

    const [isSubmitted, setIsSubmitted] = useState(false);


    function addUploadButton(event) {
        setUploadButton(true);
        setSelectedFile(event.target.files[0]);
    }

    function cancelUpload() {
        setUploadButton(false);
        history.replace("/home");
    }

    // On file upload (click the upload button)
    function uploadFile() {

        // console.log(selectedFile);
        const storage = getStorage();
        setIsUploading(true);

        const storageRef = reference(storage, 'SubmittedAssignments/' + id + '/' + selectedFile.name);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setPercentage(progress);

                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        console.log('Default Case');
                }
            },
            (error) => {
                console.log(error);
                // Handle unsuccessful uploads
            },
            () => {
                setTimeout(() => {
                    setPercentage(0);
                    setSelectedFile(null);
                    setUploadButton(false);
                    setIsUploading(false);
                }, 1000);

                let path;
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    path = downloadURL;
                    setFilePath(path);
                    console.log('File available at', downloadURL);
                });
            }
        );
    };

    async function getRollNumber() {

        const userRef = ref(db, 'users');
        await onValue(userRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().uid === auth.currentUser.uid) {
                    setRollNumber(childSnapshot.val().studentID);
                    setName(childSnapshot.val().userName);
                    return true;
                }
            })
        })
    }


    async function Submit(event) {
        event.preventDefault();

        //find the roll number of the current student
        let found = getRollNumber();
        // console.log(rollNumber);

        const postListRef = ref(db, 'studentAssignments');

        const newPostRef = push(postListRef);

        set(newPostRef, {
            File: selectedFile,
            Path: filePath,
            StudentID: rollNumber,
            StudentName: name,
            AssignmentNumber: id
        }).then(() => {
            // console.log()
            const userRef = ref(db, 'users');
            onValue(userRef, (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    // console.log(childSnapshot);

                    //mark as done of the current user

                    if (childSnapshot.val().uid === auth.currentUser.uid) {
                        const assignmentRef = ref(db, 'users/' + childSnapshot.key + '/assignments/' + id);
                        set(assignmentRef, {
                            isdone: true
                        })
                        setIsSubmitted(true);
                    }
                });
            }, {
                onlyOnce: true
            });

        });
    }


    function displayUploadedFiles() {
        return (
            this.state.uploadedFiles.map((file, index) => {
                console.log(file, this.state.selectedFile);
                return (
                    <div>
                        <span className="uploadedFilesData" key={index}>{file.fileName}</span>
                    </div>
                );
            }
            ));
    }
    return (
        <div className="assignmentModal">
            <form className="assignmentForm" onSubmit={Submit}>
                <br />
                <div className="fileSelection">
                    <input type="file" name="file" id="file" className="button inputfile" onChange={addUploadButton} />
                    <label htmlFor="file"><p style={{ "display": 'block' }}>&#8686; Choose a file</p></label>
                </div>
                {
                    uploadButton
                        ?
                        <div className="uploadFiles">
                            <button className="button upload" onClick={uploadFile}> Upload </button>
                            <span className="fileName"> {selectedFile ? selectedFile.name : ""} </span>
                            <button className="button cancel" onClick={cancelUpload}>Cancel</button>
                        </div> :
                        null
                }
                {
                    isUploading ?
                        <div>
                            <div className="percentage-uploaded">{percentage.toFixed(2)}% uploaded</div>
                        </div> :
                        null
                }
                <input type="submit" value="Submit Assignment" className="button submit create_cancle" />
            </form>
            <button className="button upload" onClick={() => { history.replace("/home") }}>Go back to Home</button>
            <p>Just Wait for few Seconds after Submitting the Assignment</p>
        </div>
    );
}
export default SubmitAssignment;



