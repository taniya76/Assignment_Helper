import React from 'react';
import ReactModal from 'react-modal';
import '../styles/Assignments.css';
import Navbar from './Navbar';

import { reference } from '../firebase/firebase';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { getStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";

class CreateAssignment extends React.Component {

    constructor() {
        super();
        this.state = {
            selectedFile: null,
            uploadedFiles: [],
            isUploading: false,
            isTeacher: false,
            userkey: null,
            allAssignments: [],
            showModal: false,
            uploadButton: false,
            percentage: 0
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addUploadButton = this.addUploadButton.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.cancelUpload = this.cancelUpload.bind(this);
        this.createAssignment = this.createAssignment.bind(this);
        this.displayUploadedFiles = this.displayUploadedFiles.bind(this);
    }

    componentDidMount() {

        const auth = getAuth();
        if (auth.currentUser === null) {
            auth.signOut();
            return;
        }
        const uid = auth.currentUser.uid;
        const db = getDatabase();
        const dbRef = ref(db, 'users');
        console.log(uid);

        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().uid === uid) {
                    this.setState({ userkey: childSnapshot.key });
                    console.log(this.state.userkey);
                }
                if (childSnapshot.val().userType === "Teacher") {
                    this.setState({ isTeacher: true });
                }
            })
        }, {
            onlyOnce: true
        });

        let allAssignments = [];

        const assignmentList = ref(db, 'assignment/');
        onValue(assignmentList, (snapshot) => {
            snapshot.forEach((child) => {
                allAssignments.push({ ...child.val() });
            });
            this.setState({ allAssignments });
            allAssignments = [];
        });
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({
            showModal: false,
            selectedFile: null,
            uploadedFiles: []
        });
    }

    handleChange(date) {
        this.setState({
            date: date
        });
    }

    addUploadButton(event) {
        this.setState({
            uploadButton: true,
            selectedFile: event.target.files[0]
        });
    }

    cancelUpload() {
        this.setState({ uploadButton: false });
    }


    createAssignment(event) {
        event.preventDefault();

        const db = getDatabase();
        const postListRef = ref(db, 'assignments');
        let assignNumber = this.refs.title.value;

        const newPostRef = push(postListRef);

        set(newPostRef, {
            assignmentNumber: this.refs.title.value,
            assignmentDescription: this.refs.description.value,
            assignmentFiles: this.state.uploadedFiles
        }).then(() => {
            // console.log()
            const userRef = ref(db, 'users');
            onValue(userRef, (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    // console.log(childSnapshot);
                    const assignmentRef = ref(db, 'users/' + childSnapshot.key + '/assignments/' + assignNumber);

                    console.log(userRef);
                    set(assignmentRef, {
                        isdone: false
                    })

                });
                this.setState({
                    uploadedFiles: [],
                    showModal: false
                });
            }, {
                onlyOnce: true
            });
        });
    }

    // On file upload (click the upload button)
    uploadFile = () => {

        const storage = getStorage();
        const { selectedFile } = this.state;
        const assignmentNumber = this.refs.title.value;
        let uploadedFiles = [...this.state.uploadedFiles];

        this.setState({ isUploading: true });

        const storageRef = reference(storage, 'assignments/' + assignmentNumber + '/' + selectedFile.name);
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
                this.setState({ percentage: progress });

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
                    this.setState({
                        percentage: 0,
                        selectedFile: null,
                        uploadButton: false,
                        isUploading: false
                    });
                }, 1000);

                let path;
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    path = downloadURL;
                    uploadedFiles.push({
                        filePath: path,
                        fileName: selectedFile.name
                    });
                    this.setState({ uploadedFiles });
                    console.log(this.state.uploadedFiles);
                    console.log('File available at', downloadURL);
                });
            }
        );
    };

    displayUploadedFiles() {
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

    render() {
        let button = this.state.uploadButton ?
            <div>
                {
                    this.state.isUploading ?
                        <div>
                            <div className="percentage-uploaded">{this.state.percentage.toFixed(2)}% uploaded</div>
                        </div> :
                        null
                }
                {
                    this.state.isUploading ?
                        null :
                        <div className="uploadFiles">
                            <button className="button upload" onClick={this.uploadFile}>Upload</button>
                            <span className="fileName">{this.state.selectedFile.name}</span>
                            <button className="button cancel" onClick={this.cancelUpload}>Cancel</button>
                        </div>
                }
            </div> :
            <div className="fileSelection">
                <input type="file" name="file" id="file" className="button inputfile" onChange={this.addUploadButton} />
                <label htmlFor="file"><p style={{"display":'block'}}>&#8686; Choose a file</p></label>
            </div>;

        //if Uploader is a Teacher then this button will be shown 
        let createAssignments = this.state.isTeacher ? <button className="button create" onClick={this.handleOpenModal}>Create a new Assignment</button> : null;

        return (
            <div>
                <Navbar />
                <div className="assignments">
                    <h1>Assignments</h1>
                    {createAssignments}
                    <ReactModal isOpen={this.state.showModal} contentLabel="Add Assignment" ariaHideApp={false} className="assignmentModal">
                        <form className="assignmentForm" onSubmit={this.createAssignment}>
                            <div>Assignment Number</div>
                            <textarea type="number" className="textarea" ref="title" required></textarea>
                            <div>Assignment Description</div>
                            <textarea type="text" className="textarea description" ref="description"></textarea>
                            <br />
                            {this.displayUploadedFiles()}
                            {/* <br /> */}
                            {button}
                            <br />
                            <div className="create_cancle">
                                <input type="submit" value="Create Assignment" className="button create" />
                                <button className="button cancel" onClick={this.handleCloseModal}>Cancel</button>
                            </div>
                        </form>
                    </ReactModal>
                </div>
            </div>
        );
    }
}

export default CreateAssignment;