import React, {useContext, useEffect} from 'react'
import Nav from "react-bootstrap/Nav";
import {AppContext} from "../../App";
import {faLocationArrow, faSignOutAlt, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactCSSTransitionGroup,TransitionGroup} from 'react-transition-group'; // ES6
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';


function ErrorSnack(props){
    const { errorSnack } = useContext(AppContext);
    const [errSnack,SetErrSnack] = errorSnack;

    const [state, setState] = React.useState({
        vertical: 'bottom',
        horizontal: 'left',
    });

    const { vertical, horizontal } = state;




    const handleClose = () => {
        SetErrSnack(false)
    };

    return (
        <div style={{'width':'20%'}}>

            <Snackbar style={{'width':'inherit'}} anchorOrigin={{ vertical, horizontal }} open={errSnack} onClose={handleClose}
                     message={props.error === false ? 'Thank you, your notification has just been sent' : 'An error occurred, if you want ' +
                             'send us an email.'}
                      key={vertical + horizontal}
            />
        </div>
    );

}

export default ErrorSnack
