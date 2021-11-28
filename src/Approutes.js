import React from 'react';
import { Router, Route, Switch } from "react-router-dom";
import './App.css';
import history from './components/history';

//improting components
import StartPage from './components/StartPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Details from './components/details';
import Home from './components/home';
import CreateAssignment from './components/createAssignments';
import SubmitAssignment from './components/SubmitAssignment';
import SubmittedAssignments from './components/submittedAssignments';

function Approutes() {
    return (
        <div className="App">
            <Router history={history}>
                <Switch>
                    <Route exact path='/'>
                        <StartPage />
                    </Route>

                    <Route exact path='/signin'>
                        <SignIn />
                    </Route>

                    <Route exact path='/signup'>
                        <SignUp />
                    </Route>

                    <Route exact path='/details'>
                        <Details />
                    </Route>

                    <Route exact path='/home'>
                        <Home />
                    </Route>

                    <Route path='/assignment'>
                        <CreateAssignment />
                    </Route >

                    <Route path='/submitAssignment/:id'>
                        <SubmitAssignment />
                    </Route >

                    <Route path='/submittedAssignments'>
                        <SubmittedAssignments />
                    </Route >

                </Switch>
            </Router>
        </div>
    );
}
export default Approutes;