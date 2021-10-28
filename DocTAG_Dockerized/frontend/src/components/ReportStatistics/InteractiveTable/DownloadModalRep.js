import React, {Component, useContext, useEffect, useRef,useState} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Button} from "react-bootstrap";
import '../../Report/report.css';
import {AppContext, MentionContext} from "../../../App";
import '../tables.css'
import './downloadreport.css'
import ReportListUpdated from "../../Report/ReportListUpdated";

import Spinner from "react-bootstrap/Spinner";


import Form from "react-bootstrap/Form";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import Mention from "../../Mentions/Mention";
import Badge from "react-bootstrap/Badge";
import {TableToShowContext} from "../TableToShow";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
function DownloadModalRep(props) {

    const { reportString } = useContext(AppContext);
    const { rowstodownload } = useContext(TableToShowContext);
    const [Reports,SetReports] = useState([])
    const [ReportString, setReportsString] = reportString;
    //Report sections
    const [RowsToDownload,SetRowsToDownload] = rowstodownload
    const [selectedFormatAll,SetselectedFormatAll] = useState('')
    const [selectedFormatMajor,SetselectedFormatMajor] = useState('')
    const [selectedActMajor,SetselectedActMajor] = useState('none')
    const [selectedActAll,SetselectedActAll] = useState('none')
    const [selectedModeAll,SetselectedModeAll] = useState('Human')
    const [selectedModeMajor,SetselectedModeMajor] = useState('Human')
    const [MissingParamsAll,SetMissingParamsAll] = useState(false)
    const [MissingParamsMajor,SetMissingParamsMajor] = useState(false)

    const [mentions_to_show, SetMentions_to_show] = useState([]);

    const [UsersList,SetUsersList] = useState([])
    const [AutoPresence,SetAutoPresence] = useState(false)
    const [ChosenUsers,SetChosenUsers] = useState([])
    const [EXAPresenceLabels,SetEXAPresenceLabels] = useState(false)
    const [EXAPresenceConcepts,SetEXAPresenceConcepts] = useState(false)

    const act = useRef('none')
    const mode = useRef()
    var FileDownload = require('js-file-download');

    useEffect(()=>{
        setReportsString('')
        SetMentions_to_show([])
        axios.get("http://0.0.0.0:8000/get_reports", {params: {all: 'all'}}).then(response => {
            SetReports(response.data['report']);})

        axios.get("http://0.0.0.0:8000/get_users_list")
            .then(response => {
                if(response.data.length>0){
                    SetUsersList(response.data)
                }})
            .catch(error=>{
                console.log(error)
            })


    },[])

    useEffect(()=>{
        if(RowsToDownload.length > 0){
            axios.post("http://0.0.0.0:8000/get_presence_robot_user", {reports:JSON.stringify(RowsToDownload)})
                .then(response => {
                    if(response.data['auto_annotation_count'] > 0){
                        SetAutoPresence(true)
                    }})
                .catch(error=>{
                    console.log(error)
                })
            axios.post("http://0.0.0.0:8000/check_presence_exa_conc_lab", {reports:JSON.stringify(RowsToDownload)})
                .then(response => {
                    if(response.data['labels'] === true){
                        SetEXAPresenceLabels(true)
                    }
                    else{
                        SetEXAPresenceLabels(false)

                    }
                    if(response.data['concepts'] === true){
                        SetEXAPresenceConcepts(true)
                    }
                    else{
                        SetEXAPresenceConcepts(false)

                    }})
                .catch(error=>{
                    console.log(error)
                })
        }
    },[RowsToDownload])

    function changeChosenList(e){
        var user = e.target.value
        e.preventDefault()
        // var arr_new_users = UsersList
        var chosen_users = []
        ChosenUsers.map(val=>{
            if(chosen_users.indexOf(val)){
                chosen_users.push(val)
            }
        })
        // console.log('chos',chosen_users)
        if (user !== ''){
            chosen_users.push(user)
            SetChosenUsers(chosen_users)
            // arr_new_users = arr_new_users.filter(username=>username!==user)
        }
        // SetUsersList(arr_new_users)

    }



    function changeUsersList(user){

        var back_arr = ChosenUsers
        back_arr = back_arr.filter(name=>name!==user)
        SetChosenUsers(back_arr)
    }
    function downloadAllReports(){
        if(selectedActAll !== 'none'  && selectedFormatAll !== '') {
            axios.post('http://0.0.0.0:8000/download_all_reports',
                {
                    report_list:RowsToDownload,
                    action: selectedActAll,
                    format: selectedFormatAll,
                    annotation_mode:selectedModeAll,

                })
                .then(function (response){
                    console.log('message', response.data);
                    SetselectedActAll('none')
                    SetselectedModeAll('Human')
                    SetselectedFormatAll('')
                    if (selectedFormatAll === 'json') {
                        if (selectedActAll === 'concept-mention') {
                            FileDownload(JSON.stringify(response.data), 'linking_json_ground_truth.json');

                        } else {
                            FileDownload(JSON.stringify(response.data), selectedActAll.toString() + '_json_ground_truth.json');

                        }


                    } else if (selectedActAll === 'csv') {
                        if (selectedActMajor === 'concept-mention') {
                            FileDownload((response.data), 'linking_csv_ground_truth.csv');
                        } else {
                            FileDownload((response.data), selectedActAll.toString() + '_csv_ground_truth.csv');

                        }



                    } else if (selectedFormatAll === 'biocxml') {
                        if (selectedActMajor === 'concept-mention') {
                            FileDownload((response.data), 'linking_bioc_ground_truth.xml');
                        } else {
                            FileDownload((response.data), 'mentions_bioc_ground_truth.xml');

                        }


                    } else if (selectedFormatAll === 'biocjson') {
                        if (selectedActMajor === 'concept-mention') {
                            FileDownload((JSON.stringify(response.data)), 'linking_bioc_ground_truth.json');
                        } else {
                            FileDownload((JSON.stringify(response.data)), 'mentions_bioc_ground_truth.json');
                        }
                    }

                })
                .catch(function (error) {
                    console.log('error message', error);
                });

        }
        else{
            SetMissingParamsAll(true)
        }
    }
    function downloadMajorityReports(){
        if(selectedActMajor !== 'none' && ChosenUsers.length > 1 && selectedFormatMajor !== '') {
            axios.post('http://0.0.0.0:8000/download_majority_reports',
                {
                    reports:RowsToDownload,
                    action: selectedActMajor,
                    format: selectedFormatMajor,
                    annotation_mode:selectedModeMajor,
                    chosen_users:ChosenUsers

                })
                .then(function (response){
                    console.log('message', response.data);
                    SetselectedFormatMajor('')
                    SetselectedModeMajor('Human')
                    SetselectedActMajor('none')
                    SetChosenUsers([])
                    if (selectedFormatMajor === 'json') {
                        if (selectedActMajor === 'concept-mention') {
                            FileDownload(JSON.stringify(response.data), 'linking_json_majority_ground_truth.json');

                        } else {
                            FileDownload(JSON.stringify(response.data), selectedActMajor.toString() + '_json_majority_ground_truth.json');

                        }


                    } else if (selectedFormatMajor === 'csv') {
                        if (selectedActMajor === 'concept-mention') {
                            FileDownload((response.data), 'linking_csv_majority_ground_truth.csv');
                        } else {
                            FileDownload((response.data), selectedActMajor.toString() + '_csv_majority_ground_truth.csv');

                        }



                    } else if (selectedFormatMajor === 'biocxml') {
                        if (selectedActMajor === 'concept-mention') {
                            FileDownload((response.data), 'linking_bioc_majority_ground_truth.xml');
                        } else {
                            FileDownload((response.data), 'mentions_bioc_majority_ground_truth.xml');

                        }


                    } else if (selectedFormatMajor === 'biocjson') {
                        if (selectedActMajor === 'concept-mention') {
                            FileDownload((JSON.stringify(response.data)), 'linking_bioc_majority_ground_truth.json');
                        } else {
                            FileDownload((JSON.stringify(response.data)), 'mentions_bioc_majority_ground_truth.json');
                        }
                    }

                })
                .catch(function (error) {
                    console.log('error message', error);
                });

        }
        else{
            SetMissingParamsMajor(true)
        }
    }


    return (
        <Container fluid className='container-modal'>

            <Row>
                <Col  md={6}>
                    <div className='modalContainer' >
                        <h4>Download all the ground-truths created for the selected documents</h4>
                        {MissingParamsAll === true && <div>
                            <h6>Please, select a file format, an annotation type.</h6>
                        </div>}

                        <div className='sel_class'>Select an annotation type</div>
                        <div className='sel_class'><Form.Control value={selectedActAll} ref ={act} className='selection all_sel'  as="select" onChange={(e)=>{act.current = e.target.value;SetMissingParamsAll(false);SetselectedActAll(e.target.value);SetselectedFormatAll('');SetselectedModeAll('Human')}}>
                            <option value="none">Select an annotation type...</option>
                            <option value='labels'>Labels</option>
                            <option value='mentions'>Passages</option>
                            <option value='concepts'>Concepts</option>
                            <option value='concept-mention'>Linking</option>
                        </Form.Control></div>
                        <hr/>
                        <div className='sel_class'>Select a file format</div>
                        <div className='sel_class'>
                        <Form.Control className='selection all_sel' value={selectedFormatAll} as="select" onChange={(option)=>{SetMissingParamsAll(false);SetselectedFormatAll(option.target.value)}}>
                            <option value="">Select a file format...</option>
                            <option value='json'>json</option>
                            <option value='csv'>csv</option>
                            {/*{(selectedActAll === 'mentions' || selectedActAll === 'concept-mention' ) && <option value='biocxml'>BioC XML</option>}*/}
                            {/*{(selectedActAll === 'mentions' || selectedActAll === 'concept-mention' ) && <option value='biocjson'>BioC JSON</option>}*/}
                        </Form.Control></div>
                        <hr/>
                        {/*{selectedActAll !== 'none' && <div><div  className='sel_class'>Select an Annotation Mode</div>*/}
                        {/*<div className='sel_class'><Form.Control value={selectedModeAll} className='selection all_sel' as="select" defaultValue="choose the annotation mode..." onChange={(e)=>{SetMissingParamsAll(false);SetselectedModeAll(e.target.value);mode.current = e.target.value}}>*/}
                        {/*    <option value = ''>Select an annotation mode...</option>*/}
                        {/*    <option value = 'Human'>Human</option>*/}
                        {/*    {AutoPresence === true && <option value ='Robot'>Automatic</option>}*/}
                        {/*    {(((EXAPresenceLabels === true && EXAPresenceConcepts === true) || (EXAPresenceLabels === true && selectedActAll === 'labels') || (EXAPresenceConcepts === true && selectedActAll !== 'none' && selectedActMajor !== 'labels')) && AutoPresence === true )&& <option value = 'both'>Human & Automatic</option>}*/}
                        {/*</Form.Control></div></div>}*/}
                        <hr/>
                        <Button onClick={()=>downloadAllReports()} variant='primary'>Download</Button>
                    </div>
                </Col>
                <Col  md={6}>
                    <div className='modalContainer'>
                        <h4>Download the ground-truths based on majority vote for the selected reports</h4>
                        {MissingParamsMajor === true && <div>
                            <h6>Please, select a file format, an annotation type, an annotation mode and at least two team mates.</h6>
                        </div>}

                        <div className='sel_class'>Select an annotation type</div>
                        <div className='sel_class'><Form.Control value={selectedActMajor} as="select" defaultValue="Select an action..." onChange={(e)=>{SetMissingParamsMajor(false);SetselectedActMajor(e.target.value);SetselectedModeMajor('Human');SetselectedFormatMajor('');act.current = e.target.value;console.log('act',act.current)}}>
                            <option value = 'none'>Select an annotation type...</option>
                            <option value = 'labels'>Labels</option>
                            <option value = 'mentions'>Passages</option>
                            <option value = 'concepts'>Concepts</option>
                            <option value = 'concept-mention'>Linking</option>
                        </Form.Control></div>
                        <hr/>
                        <div className='sel_class'>Select a file format</div>
                        <div className='sel_class'>
                            <Form.Control className='selection maj_sel' value={selectedFormatMajor} as="select" onChange={(option)=>{SetMissingParamsMajor(false);SetselectedFormatMajor(option.target.value)}}>
                                <option value="">Select a file format...</option>
                                <option value='json'>json</option>
                                <option value='csv'>csv</option>
                                {/*{(selectedActMajor === 'mentions' || selectedActMajor === 'concept-mention' ) && <option value='biocxml'>BioC XML</option>}*/}
                                {/*{(selectedActMajor === 'mentions' || selectedActMajor === 'concept-mention' ) && <option value='biocjson'>BioC JSON</option>}*/}
                            </Form.Control></div>
                        <hr/>
                        {/*{selectedActMajor !== 'none' && <div><div className='sel_class'>Select an Annotation Mode</div>*/}
                        {/*<div className='sel_class'><Form.Control value = {selectedModeMajor} className='selection maj_sel' as="select" defaultValue="choose the annotation mode..." onChange={(e)=>{SetMissingParamsMajor(false);SetselectedModeMajor(e.target.value);mode.current = e.target.value}}>*/}
                        {/*    <option value = ''>Select an annotation mode...</option>*/}
                        {/*    <option value = 'Human'>Human</option>*/}
                        {/*    {AutoPresence === true && <option value = 'Robot'>Automatic</option>}*/}
                        {/*    {(((EXAPresenceLabels === true && EXAPresenceConcepts === true) || (EXAPresenceLabels === true && selectedActMajor === 'labels') || (EXAPresenceConcepts === true && selectedActMajor !== 'none' && selectedActMajor !== 'labels')) && AutoPresence === true )&& <option value = 'both'>Human & Automatic</option>}*/}

                        {/*</Form.Control></div><hr/></div>}*/}
                        {selectedActMajor !== 'none'  && (UsersList.length > 0 || ChosenUsers.length > 0) &&<div style={{'padding-left':'1%','padding-right':'1%'}}>
                            {/*{selectedAct !== 'none' && selectedAnno !== false && <div>*/}
                            <div className='sel_class'>Select at least 2 users you want to consider to create the ground-truth based on majority vote </div>
                            <Form.Control as="select"  className='selection maj_sel' onChange={(e)=>changeChosenList(e)} defaultValue="choose the annotation mode..." >
                                <option value = ''>Select a user...</option>

                                {UsersList.map(user=>
                                    <option disabled={ChosenUsers.indexOf(user)!==-1} value={user}>{user}</option>
                                )}


                            </Form.Control>


                            <div>
                                The users the majority vote ground-truth will be based on are:
                                <ul>
                                    {ChosenUsers.map(user=><li>
                                        <span>{user}</span>
                                        <span><Button variant="Link" onClick={() => changeUsersList(user)}><FontAwesomeIcon icon={faTimesCircle} /></Button></span>
                                    </li>)}
                                </ul>
                            </div>
                            <Button disabled={ChosenUsers.length < 2} onClick={()=>downloadMajorityReports()} variant='primary'>Download</Button>

                            <hr/>
                        </div>}

                    </div>
                    </Col>



                    </Row>



        </Container>
    );
}


export default DownloadModalRep