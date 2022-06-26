import React from 'react';
import { useHistory } from "react-router-dom";
import '../styles/StartPage.css';


function StartPage() {
    const history = useHistory();

    return (

        <div id="partition">
            <div class="start_img">

            </div>
            <div id="start">
                <div id="classroom-login-signup">
                    <div className="classroom-title">Classroom</div>
                    <button className="to-sign-in" onClick={() => history.push('/signin')}>Sign In</button>
                    <button className="to-sign-up" onClick={() => history.push('/signup')}>Sign Up</button>
                </div>
            </div>
        </div>
    )

}

export default StartPage;