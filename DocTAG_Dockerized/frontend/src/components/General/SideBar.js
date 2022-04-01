import React, {useContext, useEffect} from 'react'
import Nav from "react-bootstrap/Nav";
import Figure from "react-bootstrap/Figure";
import './sideBar.css';
import {AppContext} from "../../App";
import {faLocationArrow, faSignOutAlt, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactCSSTransitionGroup,TransitionGroup} from 'react-transition-group'; // ES6
import Slide from '@material-ui/core/Slide';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Badge from "react-bootstrap/Badge";
// import Logo from './doctag_logo_white.png'

function SideBar(props){

    const { showbar,username,admin,profile } = useContext(AppContext);
    const [Username, SetUsername] = username;
    const [Admin, SetAdmin] = admin;
    const [ShowBar, SetShowBar] = showbar;

    const [Profile, SetProfile] = profile;
    const height = document.documentElement.scrollHeight

    useEffect(()=>{
        const height = document.documentElement.scrollHeight
        // console.log('height',height)
        // console.log('height123',ShowBar)

        if(document.getElementById('sidenav') !== null){
            document.getElementById('sidenav').style.height = height.toString() + 'px'

        }
    },[ShowBar])


    return (
        <Slide direction="right" in={ShowBar} mountOnEnter unmountOnExit>

                <div className="sidenav" id='sidenav' style={{'text-align':'center'}}>
                    <button onClick={()=>SetShowBar(false)} className='closeButtonMenu'><FontAwesomeIcon icon={faTimes} color='white' size='2x'/></button>
                        {/*<div style={{'width':'125px','height':'125px','margin-left':'75px','margin-top':'10%','border-radius':'50%','background-color':'white'}}></div>*/}

                    <div style={{'text-align':'center','margin-top':'20%','margin-bottom':'10%','color':'white'}} ><img src={require('../../../dist/assets/doctag_logo_white.png').default} width="150"/>
                    </div>
                    <div style={{'text-align':'center','font-size':'1.25rem','font-weight':'bold','color':'white'}}><span>{ Username }</span> </div>
                    <div style={{'text-align':'center','font-size':'1rem','font-weight':'bold','color':'white'}}>{ Profile }</div>
                    <div style={{'text-align':'center','font-size':'1rem','font-weight':'bold','color':'white'}}><button
                        style={{'border':'none','background-color':'#0093c4'}}
                     type='button' ><a className='logout_a' style={{'font-size':'1rem'}} href="http://127.0.0.1:8000/logout"> <Badge pill variant="dark">
                                            Logout <FontAwesomeIcon icon={faSignOutAlt}/></Badge></a></button></div>
                <hr />
                    {/*<Link onClick={()=>SetShowBar(false)} to="/exatag/index">Home</Link>*/}
                    {/*<Link onClick={()=>SetShowBar(false)} to="/exatag/about">About</Link>*/}
                    {/*<Link onClick={()=>SetShowBar(false)} to="/exatag/tutorial">Tutorial</Link>*/}
                    {/*<Link onClick={()=>SetShowBar(false)} to="/exatag/credits">Credits</Link>*/}

                    <Link onClick={()=>SetShowBar(false)} to="/index">Home</Link>
                    <Link onClick={()=>SetShowBar(false)} to="/my_stats">My stats</Link>
                    {/*<Link onClick={()=>SetShowBar(false)} to="/about">About</Link>*/}
                    <Link onClick={()=>SetShowBar(false)} to="/tutorial">Tutorial</Link>
                    <Link onClick={()=>SetShowBar(false)} to="/credits">Credits</Link>
                    <Link onClick={()=>SetShowBar(false)} to="/uploadFile">Upload/Transfer annotations</Link>
                    <hr/>
                    {(Admin === Username || (Admin === '' && Username === 'Test') || Username === 'Test') &&<div> <Link onClick={()=>SetShowBar(false)} to="/infoAboutConfiguration">Configure</Link>

                        <Link onClick={()=>SetShowBar(false)} to="/reports_stats">DocTAG stats</Link>
                        <Link onClick={()=>SetShowBar(false)} to="/team_members_stats">Members stats</Link>
                    </div>}


                </div>
        </Slide>

    );
}

export default SideBar
