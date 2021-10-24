import React, {useContext, useEffect} from 'react'
import Nav from "react-bootstrap/Nav";
import './sideBar.css';
import {AppContext} from "../../App";
import {faLocationArrow, faSignOutAlt, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactCSSTransitionGroup,TransitionGroup} from 'react-transition-group'; // ES6
import Snackbar from '@material-ui/core/Snackbar';

function SnackBarMention(props){
    const { showSnackMention, showSnackMessageMention } = useContext(AppContext);
    const [ShowSnackMention,SetShowSnackMention] = showSnackMention;
    const [SnackMessageMention,SetSnackMessageMention] = showSnackMessageMention;

    const [state, setState] = React.useState({
        vertical: 'top',
        horizontal: 'right',
    });

    const { vertical, horizontal } = state;

    // useEffect(()=>{
    //     console.log('messaggio',showSnackMention)
    //     console.log('messaggio',props.message)
    // },[showSnackMention])


    const handleClose = () => {
        SetShowSnackMention(false)
    };

    return (
        <div style={{'width':'20%'}}>
            {/*{props.message}*/}
            <Snackbar style={{'width':'inherit'}}
                      anchorOrigin={{ vertical, horizontal }}
                      open={ShowSnackMention}

                      onClose={handleClose}
                      message={SnackMessageMention}
                      key={vertical + horizontal}
            />
        </div>
    );

}

export default SnackBarMention
