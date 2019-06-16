import React from 'react';
import { Link, Redirect } from "react-router-dom";

import {
    createExerciseLog,
    getUserExerciseLogs,
} from '../services/userService';

export class UserExerciseLogs extends React.Component {

    abortController = new window.AbortController();

    state = {
        formControls: {
            date: { value: (new Date()).toString() },
            exerciseName: { value: '' },
            type: { value: '' },
            progress: { value: '' },
        },
        messages: [],
        loginRedirect: false,
        /*
        logs: [
            {
                id:             1,
                date:           '6/6',
                exerciseName:   'Bench Press',
                type:           '5x5',
                progress:       'weight: 225, reps: 5/5/5/5/5',
            },
            {
                id:             2,
                date:           '6/6',
                exerciseName:   'Lying Tricep Extensions',
                type:           '3x10',
                progress:       'weight: 85/85/75, reps: 10/7/10',
            },
        ]*/
        logs: []
    }

    componentDidMount() {
        this.updatePageExerciseLogs();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    handleChange = (event) => {
        const field = event.target.name;
        const value = event.target.value;

        this.setState({
            formControls: {
                ...this.state.formControls,
                [field]: {
                    ...this.state.formControls[field],
                    value
                }
            }
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.logExercise();
    }

    logExercise = () => {
        // TODO: implement clientside validation
        createExerciseLog(this.state.formControls.date.value,
                          this.state.formControls.exerciseName.value,
                          this.state.formControls.type.value,
                          this.state.formControls.progress.value)
            .then(res => {
                // TODO: maybe add the returned log to the list client-side?
                if(res.error) return this.handleErrorResponse(res.error);
                this.updatePageExerciseLogs();
            })
            .catch(err => {
                this.handleError(err)
                this.updatePageExerciseLogs();
            });
    }

    updatePageExerciseLogs() {
        getUserExerciseLogs()
            .then(res => {
                if(res.error) return this.handleErrorResponse(res.error);

                if(res.exerciseLogs){
                    this.setState({ logs: res.exerciseLogs })
                } else {
                    console.error('no logs found. this shouldn\'t happen');
                }
            })
            .catch(this.handleError);
    }

    handleErrorResponse(error){
        if(error.code === 1008) return this.setState({ loginRedirect: true });

        this.setState({
            messages: [error.detail]
        })
    }

    handleError(error){
        if(error.name === 'AbortError') return;
        console.log(error);
    }

    render() {

        if (this.state.loginRedirect) return <Redirect to='/login' />;

        var messages = this.state.messages.map(msg => <p key={msg}>{msg}</p>);

        var tableData = this.state.logs.map(log => (
            <tr key={log.id}>
                <td>{log.date}</td>
                <td>{log.exerciseName}</td>
                <td>{log.type}</td>
                <td>{log.progress}</td>
            </tr>
        ));

        return (
            <>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Date:
                        <input name="date" type="text" value={this.state.formControls.date.value} onChange={this.handleChange}/>
                    </label>
                    <label>
                        Exercise Name:
                        <input name="exerciseName" type="text" value={this.state.formControls.exerciseName.value} onChange={this.handleChange}/>
                    </label>
                    <label>
                        Type:
                        <input name="type" type="text" value={this.state.formControls.type.value} onChange={this.handleChange}/>
                    </label>
                    <label>
                        Progress:
                        <input name="progress" type="text" value={this.state.formControls.progress.value} onChange={this.handleChange}/>
                    </label>
                    <input type="submit" value="Log Exercise" />
                </form>

                {messages}

                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Exercise</th>
                            <th>Type</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData}
                    </tbody>
                </table>
                <Link to="/">Back Home</Link>
            </>
        )
    }
}

export default UserExerciseLogs;