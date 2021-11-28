import React, { useState } from "react";
import "../styles/SubmitAssignmentCard.css";

function SubmitAssignmentCard({ Path, StudentID, Name, AssignmentNumber }) {

    return (
            <div className="SubmittedAssignment" >
                <div className="Details">
                    <p>Assignment Number: {AssignmentNumber}</p>
                    <p className="StudentName">Student Name: {Name}</p>
                    <p className="StudentID">Student ID: {StudentID}</p>
                </div>
                <div className="btn">
                    <button className="SubmitAssignmentLink"><a style={{"color":"white"}} href={Path}>View</a></button>
                </div>
            </div>
    );

}

export default SubmitAssignmentCard;