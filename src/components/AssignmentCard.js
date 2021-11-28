import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../styles/AssignmentCard.css";

function AssignmentCard({ Description, Number, FileName, FilePath }) {
    const history = useHistory();

    const [submit, setSubmit] = useState(false);

    async function Submit() {
        await setSubmit(true);
        // console.log(submit);
        history.replace('/SubmitAssignment/'+{Number}.Number);
    }

    return (
        <div>
            <span className="Assignment" >
                <div className="Assignment_Description">
                    <p>Assignment No.: {Number} </p>
                </div>
                <div className="Assignment_name"><strong>File Name: </strong>{FileName}</div>
                <div ><strong>Description:</strong> {Description}</div>
                <h5>Click the button below to open the Assignment</h5>
                <div className="buttons">
                    <button className="Assignment_Link"><a className="Link" href={FilePath}>Assignment</a></button>
                    <button className="Submit_Assignment" onClick={Submit}>Submit</button>
                </div>
            </span>
        </div>
    );
}

export default AssignmentCard;

