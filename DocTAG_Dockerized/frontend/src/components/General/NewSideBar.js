import React, {useContext} from 'react'
import Nav from "react-bootstrap/Nav";
import './sideBar.css';
import {AppContext} from "../../App";
import {faLocationArrow, faSignOutAlt, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactCSSTransitionGroup,TransitionGroup} from 'react-transition-group'; // ES6
import Slide from '@material-ui/core/Slide';




function NewSideBar(props){

    const { showbar,username } = useContext(AppContext);
    const [ShowBar, SetShowBar] = showbar;
    const [Username, SetUsername] = username;
    return (
        <Slide direction="right" in={ShowBar} mountOnEnter unmountOnExit>
            <Nav defaultActiveKey="/home" className="flex-column">

                    <button onClick={()=>SetShowBar(false)} className='closeButtonMenu'><FontAwesomeIcon icon={faTimes} size='2x'/></button>
                    <div style={{'width':'125px','height':'125px','margin-left':'75px','margin-top':'10%','border-radius':'50%','background-color':'white'}}></div>
                    <div style={{'text-align':'center','font-size':'1.25rem','font-weight':'bold'}}><span>{ Username }</span> </div>
                    <div style={{'text-align':'center','font-size':'1rem','font-weight':'bold'}}>Tech</div>
                    <div style={{'text-align':'center','font-size':'1rem','font-weight':'bold'}}><button
                        style={{'border':'none','background-color':'#E25886'}}
                        type='button' ><a style={{'font-size':'1rem','color':'black'}} href="http://0.0.0.0:8000/logout"> Logout <FontAwesomeIcon icon={faSignOutAlt}/></a></button></div>
                    <hr />
                <Nav.Link href="#">Tutorial</Nav.Link>
                <Nav.Link href="#">FAQ</Nav.Link>
                <Nav.Link href="#">Credits</Nav.Link>
                <Nav.Link href="#">Contact Us</Nav.Link>

            </Nav>



        </Slide>
    );
}

export default NewSideBar
