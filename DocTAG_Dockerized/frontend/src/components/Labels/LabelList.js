import React, { Component } from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
// import Button from 'react-bootstrap/Button';
import { useState, useEffect, useContext } from "react";
import {
    faInfoCircle,faCheckSquare,
    faEye,
    faMicroscope,
    faTimesCircle,
    faLanguage,
    faLocationArrow,
    faCogs,
    faHospital,
    faGlasses, faList, faPlusCircle, faPencilAlt, faPalette, faExclamationTriangle, faSave
} from '@fortawesome/free-solid-svg-icons';

import LabelItem from "./LabelItem";
// import { useForm } from "react-hook-form";
// import DjangoCSRFToken from 'django-react-csrftoken'
import cookie from "react-cookies";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import {Col, OverlayTrigger, Row} from "react-bootstrap";
import {AppContext,LabelContext} from "../../App";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SubmitButtons from "../General/SubmitButtons";
import Slide from '@material-ui/core/Slide';
import Zoom from '@material-ui/core/Zoom';
import Tooltip from "react-bootstrap/Tooltip";

// import {Container,Row,Col} from "react-bootstrap";
// axios.defaults.xsrfHeaderName = "X-CSRFToken";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
function LabelList(props){
    const { report, reports, action,showmember,showmajority, index, checks, userLabels, labelsList } = useContext(AppContext);
    const [labels_to_show, setLabels_to_show] = userLabels
    const [labels, setLabels] = labelsList
    const [Checks, setChecks] = checks;
    const [Report, setReport] = report;
    const [Reports, setReports] = reports;
    const [Index, setIndex] = index;
    const [Action, setAction] = index;
    const [Saved,SetSaved] = useState(false)
    const [ShowInfo,SetShowInfo] = useState(false)
    const [ShowMemberGt,SetShowMemberGt] =showmember
    const [ShowMajorityGt,SetShowMajorityGt] = showmajority
    useEffect(()=>{
        SetShowInfo(false)
    },[Action,Index])

    function changeInfo(e){
        e.preventDefault()
        if(ShowInfo){
            SetShowInfo(false)

        }else{SetShowInfo(true)}
    }


    return(

        <div>
            {/*<h2>LABELS</h2>*/}
               <div className='labels_list'>
                <form id = "annotation-form" className="annotation-form" >
                    {/*{ShowMajorityGt === true && <div><i>The ground-truth based on majority vote is <b>READ ONLY</b></i></div>}*/}
                    {/*{ShowMemberGt === true && <div><i>The ground-truth of other team members are <b>READ ONLY</b></i></div>}*/}
                <div style={{'fontWeight':'bold','fontStyle':'italic'}}>Choose a label:&nbsp;&nbsp;
                    <OverlayTrigger
                        key='bottom'
                        placement='bottom'
                        overlay={
                            <Tooltip id={`tooltip-bottom'`}>
                                Quick tutorial
                            </Tooltip>
                        }
                    >
                    <button className='butt_info' onClick={(e)=>changeInfo(e)}><FontAwesomeIcon icon={faInfoCircle} color='blue'/></button>
                    </OverlayTrigger>
                </div>
                    {ShowInfo && <Zoom in={ShowInfo}>
                        <div className='quick_tutorial'>
                            <h5>Labels: quick tutorial</h5>
                            <div>
                                You can identify a list of labels.
                                <div>
                                    <ul className="fa-ul">
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faGlasses}/></span>
                                            Read the document on your left.
                                        </li>
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faList}/></span> On your right the list of labels is displayed.
                                        </li>
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faCheckSquare}/></span>Click on the label that fits the document on your left best.
                                        </li>
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>The <span style={{'color':'red'}}>CLEAR</span> button will remove the label you assigned.
                                        </li>
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faSave}/></span>Your changes will be saved clicking on <span style={{'color':'green'}}>SAVE</span> button, changing annotation type or
                                            going to the previous or next document or topic.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div></Zoom>}

                    {!ShowInfo && <div className='container_list'>
                    {labels.length > 0 && labels.map((label,ind) => <LabelItem key ={label.seq_number} label={label.label} index_number={ind} seq_number={label.seq_number} checks={Checks}  />)}
                    </div>}
                </form>
               </div>

        </div>

    );


}
export default LabelList