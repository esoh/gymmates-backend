import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch, Redirect } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash, faUser, faKey, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';

import './App.css';
import Navbar from './common/navbar/Navbar';
import Home from './home/Home';
import Programs from './programs/Programs';
import Exercises from './exercises/Exercises';
import Profile from './profile/Profile';
import { Login, Signup } from './auth/Entry';
import Password from './auth/Password';
import ModalContainer from './common/modal/ModalContainer';

library.add(faEye, faEyeSlash, faUser, faKey, faEnvelope, faTimesCircle);

class App extends Component {
    render() {
        return (
            <Router className="App">
                <div className="app-container">
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/signup" component={Signup}/>
                        <Route>
                            <div className="nav-container">
                                <Navbar/>
                                <Switch>
                                    <Route exact path="/" component={Home}/>
                                    <Route path="/programs" component={Programs}/>
                                    <Route path="/exercises" component={Exercises}/>
                                    <Route path="/profile" component={Profile}/>
                                    <Route path="/password" component={Password}/>
                                    <Route path="*" render={() => <Redirect to="/"/>}/>
                                </Switch>
                            </div>
                        </Route>
                    </Switch>
                    <ModalContainer />
                </div>
            </Router>
        );
    }
}

export default App;
