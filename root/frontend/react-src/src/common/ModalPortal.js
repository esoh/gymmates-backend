import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './Modal.css'

// since 3rd party apps like to render to body, we don't want to render to body.
// Everything renders to body and if we render to body, it could break our app.
// We want to render to a div that is a child of body (root).

const appRoot = document.getElementById('root');
const fadeDuration = 150;
const modalDuration = 300;
const fadeClasses = {
    enter: 'fade-enter',
    enterActive: 'fade-enter-active',
    enterDone: 'fade-enter-done',
    exit: 'fade-exit',
    exitActive: 'fade-exit-active',
    exitDone: 'fade-exit-done',
    appear: 'fade-appear',
    appearActive: 'fade-appear-active',
};

class ModalPortal extends React.Component {
    constructor(){
        super();
        this.state = {
            in: false,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.in && !prevState.in){
            return {in: nextProps.in};
        } else {
            return null;
        }
    }

    //TODO: attach onClosed to modal, not modal-backdrop
    onClosed = () => {
        this.setState({ in: false })
    }

    render(){
        const ModalContent = this.props.content;
        if(this.state.in){
            return ReactDOM.createPortal(
                (
                    <div>
                        {/* modal window */}
                        <CSSTransition
                            in={this.props.in}
                            timeout={modalDuration}
                            onExited={this.onClosed}
                            classNames={fadeClasses}
                            appear
                        >
                            <div className="modal" role="dialog">
                                <div className="modal-dialog" role="document">
                                    {/* TODO: make modalcontent persist */}
                                    {!!ModalContent ? (
                                        <ModalContent/>
                                    ) : (
                                        null
                                    )}
                                </div>
                            </div>
                        </CSSTransition>

                        {/* backdrop */}
                        <CSSTransition
                            in={this.props.in}
                            timeout={fadeDuration}
                            classNames="modal-backdrop"
                            appear
                        >
                            {(state) => (
                                <div className="modal-backdrop"/>
                            )}
                        </CSSTransition>
                    </div>
                ),
                appRoot
            );
        } else {
            return null;
        }
    }
}

export default ModalPortal;
