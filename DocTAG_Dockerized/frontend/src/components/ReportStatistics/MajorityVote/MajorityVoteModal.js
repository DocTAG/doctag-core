import React, {Component, useContext, useEffect, useRef,useState} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Button} from "react-bootstrap";
import '../../Report/report.css';
import './majoritymodal.css'
import {AppContext, MentionContext} from "../../../App";
import '../tables.css'
import '../AnnotationStats/reportsmodal.css'

import ReportListUpdated from "../../Report/ReportListUpdated";

import Spinner from "react-bootstrap/Spinner";


import Form from "react-bootstrap/Form";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import Mention from "../../Mentions/Mention";
import Badge from "react-bootstrap/Badge";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
function MajorityVoteModal(props) {

    const { index,username,loadingMentions,color,tokens,fields,mentionsList,loadingColors,showannotations,finalcount,fieldsToAnn,reached,orderVar, errorSnack,reports, reportString, insertionTimes } = useContext(AppContext);
    const [Reports,SetReports] = useState([])
    const [ReportString, setReportsString] = reportString;
    //Report sections
    const [selectedAct,SetselectedAct] = useState('none')
    const [selectedMode,SetselectedMode] = useState('Human')
    const [SelectedFormat,SetSelectedFormat] = useState('')

    const [newInd,SetNewInd] = useState(false)
    const [FinalCountReached, SetFinalCountReached] = reached;
    const [FinalCount, SetFinalCount] = finalcount;
    const [Fields, SetFields] = fields;
    const [FieldsToAnn, SetFieldsToAnn] = fieldsToAnn;
    const [mentions_to_show, SetMentions_to_show] = useState([]);
    const [Username,SetUsername] = username
    const [UsersList,SetUsersList] = useState([])
    const [AutoPresence,SetAutoPresence] = useState(false)
    const [ChosenUsers,SetChosenUsers] = useState([])
    const [EXAPresenceLabels,SetEXAPresenceLabels] = useState(false)
    const [EXAPresenceConcepts,SetEXAPresenceConcepts] = useState(false)
    const [MajorGT,SetMajorGT] = useState(false)
    const [ToDownload,SetToDownload] = useState(false)
    const [ShowDownload,SetShowDownload] = useState(false)
    const act = useRef('none')
    const mode = useRef()
    var FileDownload = require('js-file-download');



    useEffect(()=>{
        setReportsString('')
        SetMentions_to_show([])
        axios.get("http://0.0.0.0:8000/get_reports", {params: {all: 'all'}}).then(response => {
            SetReports(response.data['report']);})

        axios.get("http://0.0.0.0:8000/check_presence_exa_conc_lab", {params: {id_report:props.id_report,language:props.language}})
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

        axios.get("http://0.0.0.0:8000/get_users_list", {params: {id_report:props.id_report,language:props.language}})
            .then(response => {
                if(response.data.length>0){
                    SetUsersList(response.data)
                }})
            .catch(error=>{
                console.log(error)
            })
        axios.get("http://0.0.0.0:8000/get_presence_robot_user", {params: {id_report:props.id_report,language:props.language}})
            .then(response => {
                if(response.data['auto_annotation_count'] > 0){
                    SetAutoPresence(true)
                }})
            .catch(error=>{
                console.log(error)
            })

    },[])

    useEffect(()=>{
        if(Reports.length > 0){
            // console.log('id_rep1',props.id_report)
            // console.log('id_rep1',Reports)
            if(props.id_report !== false){
                Reports.map((report,ind)=>{
                    if(report.id_report === props.id_report){
                        // console.log('id_rep',props.id_report)
                        //
                        // console.log('annot',props.id_report)
                        // console.log('annot',report.id_report)
                        // console.log('annot',ind)
                        SetNewInd(ind)
                    }

                })
            }
        }



    },[props.id_report,Reports])


    useEffect(()=>{
        if(Reports.length > 0){

            if(newInd >= 0){
                axios.get("http://0.0.0.0:8000/report_start_end", {params: {report_id: Reports[newInd].id_report.toString()}}).then(response => {SetFinalCount(response.data['final_count']);
                    setReportsString(response.data['rep_string']); SetFinalCountReached(false);
                })
                axios.get("http://0.0.0.0:8000/get_fields",{params:{report:props.id_report}}).then(response => {SetFields(response.data['fields']);SetFieldsToAnn(response.data['fields_to_ann']);})

            }
        }


    },[newInd])



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

    function createGT(e){
        e.preventDefault()
        axios.post('http://0.0.0.0:8000/create_majority_vote_groundtruth',{action:selectedAct,topic:props.topic, mode:selectedMode,users:ChosenUsers,id_report:props.id_report,language:props.language})
            .then(response=>{
                if(Object.keys(response.data).indexOf('error') === -1){
                    console.log('result',response.data)
                    SetMajorGT(response.data)
                }
            })
            .catch(error=>console.log(error))
    }
    function download_majority_report(){
        if(SelectedFormat !== ''){
            console.log('OPTION',SelectedFormat)
            axios.post('http://0.0.0.0:8000/download_majority_reports',
                {
                    reports: [props.report],
                    action: selectedAct,
                    format: SelectedFormat,
                    annotation_mode:selectedMode,
                    chosen_users:ChosenUsers

                })
                .then(function (response){
                    console.log('message', response.data);

                    if (SelectedFormat === 'json') {
                        if (selectedAct === 'concept-mention') {
                            FileDownload(JSON.stringify(response.data), 'linking_json_majority_ground_truth.json');

                        } else {
                            FileDownload(JSON.stringify(response.data), selectedAct.toString() + '_json_majority_ground_truth.json');

                        }


                    } else if (SelectedFormat === 'csv') {
                        if (selectedAct === 'concept-mention') {
                            FileDownload((response.data), 'linking_csv_majority_ground_truth.csv');
                        } else {
                            FileDownload((response.data), selectedAct.toString() + '_csv_majority_ground_truth.csv');

                        }



                    } else if (SelectedFormat === 'biocxml') {
                        if (selectedAct === 'concept-mention') {
                            FileDownload((response.data), 'linking_bioc_majority_ground_truth.xml');
                        } else {
                            FileDownload((response.data), 'mentions_bioc_majority_ground_truth.xml');

                        }


                    } else if (SelectedFormat === 'biocjson') {
                        if (selectedAct === 'concept-mention') {
                            FileDownload((JSON.stringify(response.data)), 'linking_bioc_majority_ground_truth.json');
                        } else {
                            FileDownload((JSON.stringify(response.data)), 'mentions_bioc_majority_ground_truth.json');
                        }
                    }

                })
                .catch(function (error) {
                    console.log('error message', error);
                });
            SetSelectedFormat('')

        }



    }


    return (
        <div className='container-fluid'>

            {(newInd !== false  && ReportString !== ''  && Reports.length > 0) ? <Row>
                <Col md={6} style={{fontSize:'1rem'}}>
                    <div className='report_modal'>
                        <ReportListUpdated report_id = {Reports[newInd].id_report} report = {Reports[newInd].report_json} action={selectedAct}/>

                    </div>
                </Col>
                <Col  md={6}>
                    {MajorGT === false ? <div className='modalContainer'>
                        <div style={{'margin-bottom':'1%'}}>Select an Annotation Type</div>
                        <div style={{'padding-left':'1%','padding-right':'1%'}}><Form.Control as="select" defaultValue="Select an annotation type..." onChange={(e)=>{SetselectedAct(e.target.value);act.current = e.target.value;console.log('act',act.current)}}>
                            <option value = 'none'>Select an annotation type...</option>
                            <option value = 'labels'>Labels</option>
                            <option value = 'mentions'>Passages</option>
                            <option value = 'concepts'>Concepts</option>
                            <option value = 'concept-mention'>Linking</option>
                        </Form.Control></div>
                        <hr/>
                        {/*{selectedAct !== 'none' && <div><div style={{'margin-bottom':'1%','margin-top':'1%'}}>Select an Annotation Mode</div>*/}
                        {/*<div style={{'padding-left':'1%','padding-right':'1%'}}><Form.Control as="select" defaultValue="choose the annotation mode..." onChange={(e)=>{SetselectedMode(e.target.value);mode.current = e.target.value}}>*/}
                        {/*    <option value = ''>Select an annotation mode...</option>*/}
                        {/*    <option value = 'Human'>Manual</option>*/}
                        {/*    {AutoPresence === true && <option value = 'Robot'>Automatic</option>}*/}
                        {/*    {(((EXAPresenceLabels === true && EXAPresenceConcepts === true) || (EXAPresenceLabels === true && selectedAct === 'labels') || (EXAPresenceConcepts === true && selectedAct !== 'none' && selectedAct !== 'labels')) && AutoPresence === true )&& <option value = 'both'>Manual & Automatic</option>}*/}

                        {/*</Form.Control></div><hr/></div>}*/}
                        {selectedAct !== 'none'  && (UsersList.length > 0 || ChosenUsers.length > 0 || Username === 'Test') &&<div style={{'padding-left':'1%','padding-right':'1%'}}>
                            <div>Select at least two users you want to consider to create the ground-truth based on majority vote </div>
                            {UsersList.length > 0 &&<Form.Control as="select" onChange={(e)=>changeChosenList(e)} defaultValue="choose the annotation mode..." >
                                 <option value = ''>Select a user...</option>

                                {UsersList.map(user=>
                                    <option disabled={ChosenUsers.indexOf(user)!==-1} value={user}>{user}</option>
                                )}


                            </Form.Control>}
                            {ChosenUsers.length > 0 && <div>
                                The users the majority vote ground-truth will be based on are:
                                <ul>
                                    {ChosenUsers.map(user=><li>
                                        <span>{user}</span>
                                        <span><Button variant="Link" onClick={() => changeUsersList(user)}><FontAwesomeIcon icon={faTimesCircle} /></Button></span>
                                    </li>)}
                                </ul>

                            <Button style={{marginBottom:'2%'}} disabled={ChosenUsers.length < 2 || selectedAct === 'none' } onClick={(e)=>createGT(e)} variant='primary'>Confirm</Button>
                            </div>}
                        <hr/>
                        </div>}

                    </div> : <div className='modalContainer' style={{height:'60vh'}}>
                        {selectedAct === 'labels' &&
                        <div>
                            <i>Below you can find the labels belonging to the majority vote ground truth.</i>
                            {/*<br/><i style={{fontSize:'0.8rem'}}>The labels annotated by the algorithm are highlighted in  <span style={{color:'royalblue'}}>blue</span></i><br/>*/}
                            <br/>
                            <div>
                                {/*{selectedMode === 'both' ? <>{<div>{MajorGT[selectedMode].length === 0 ? <>0</> :  <>{MajorGT[selectedMode][0]['total_human_gt']}</>} <b>manual</b> annotations</div>}*/}
                                        {/*{<div>{MajorGT[selectedMode].length === 0 ? <>0</> :  <>{MajorGT[selectedMode][0]['total_robot_gt']}</>} <b>automatic</b> annotations</div>}</> :*/}
                                    {/*<div>{MajorGT[selectedMode].length === 0 ? <>0</> :  <>{MajorGT[selectedMode][0]['total_gt']}</>} {selectedMode === 'Robot' ? <b>automatic</b> : <b>manual</b>} annotations</div>}*/}
                                <hr/>
                                {MajorGT[selectedMode].length > 0 ? <ul>{MajorGT[selectedMode].map((val,ind)=>
                                    <>
                                        {val.count > (val.total_gt / 2) && <li>
                                            <div>
                                                <div style={{color:(val.users_list.indexOf('Robot_user') !==-1 ? 'royalblue':'black')}}>{val.label}</div>
                                                <div style={{fontSize:'0.9rem'}}>This label occurred in:</div>
                                                {selectedMode === 'Human' && <i style={{fontSize:'0.9rem'}}>{val.count} / {val.total_gt} manual annotations - users: {val.users_list.filter(name=>name!=='Robot_user').join(', ')}</i>}
                                                {/*{selectedMode === 'Robot' && <i style={{fontSize:'0.9rem'}}> {val.count} / {val.total_gt} automatic annotations - users: {val.users_list.filter(name=>name!=='Robot_user').join(', ')}</i>}*/}
                                                {/*{selectedMode === 'both' && <ul>*/}
                                                {/*    {val.manual_annotators.length > 0 && <li><i style={{fontSize:'0.9rem'}}>{val.manual_annotators.length} / {val.total_human_gt} manual annotations - users: {val.manual_annotators.filter(name=>name!=='Robot_user').join(', ')}</i>*/}
                                                {/*    </li>}*/}
                                                {/*    {val.robot_annotators.filter(name=>name!=='Robot_user').length > 0&& <li><i style={{fontSize:'0.9rem'}}>{val.robot_annotators.filter(name=>name!=='Robot_user').length} / {val.total_robot_gt} automatic annotations - users: {val.robot_annotators.filter(name=>name!=='Robot_user').join(', ')}</i>*/}
                                                {/*    </li>}*/}
                                                {/*</ul>}*/}
                                            </div></li>}
                                    </>)}
                                </ul>: <div>There are not labels that have been annotated enough times to take part in the majority vote based ground-truth </div>}


                                <div>
                                </div>
                            </div>
                        </div>}
                        {selectedAct === 'mentions' &&
                        <div>
                            <i>Below you can find the mentions belonging to the majority vote ground truth.</i>
                            {/*<br/><i style={{fontSize:'0.8rem'}}>The mentions annotated by the algorithm are highlighted in  <span style={{color:'royalblue'}}>blue</span></i><br/>*/}
                            <br/>
                            <div>
                                {selectedMode === 'both' ? <>{<div>{MajorGT[selectedMode].length === 0 ? <>0</> :  <>{MajorGT[selectedMode][0]['total_human_gt']}</>} <b>manual</b> annotations</div>}
                                        {<div>{MajorGT[selectedMode].length === 0 ? <>0</> :  <>{MajorGT[selectedMode][0]['total_robot_gt']}</>} <b>automatic</b> annotations</div>}</> :
                                    <div>{MajorGT[selectedMode].length === 0 ? <>0</> :  <>{MajorGT[selectedMode][0]['total_gt']}</>} {selectedMode === 'Robot' ? <b>automatic</b> : <b>manual</b>} annotations</div>}
                                <hr/>
                                {MajorGT[selectedMode].length > 0 ? <ul>{MajorGT[selectedMode].map((val,index)=>
                                    <>
                                        {val.count > (val.total_gt / 2) && <li><div>
                                            <div style={{color:(val.users_list.indexOf('Robot_user') !==-1 ? 'royalblue':'black')}}>
                                                <Mention id = {index} index = {index} text={val['mention']} start={val['start']} stop={val['stop']} mention_obj = {val}/>
                                            </div><br/>
                                            <div style={{fontSize:'0.9rem'}}>This mention occurred in:</div>
                                            {selectedMode === 'Human' && <i style={{fontSize:'0.9rem'}}>{val.count} / {val.total_gt} manual annotations - users: {val.users_list.filter(name=>name!=='Robot_user').join(', ')}</i>}
                                            {/*{selectedMode === 'Robot' && <i style={{fontSize:'0.9rem'}}> {val.count} / {val.total_gt} automatic annotations - users: {val.users_list.filter(name=>name!=='Robot_user').join(', ')}</i>}*/}
                                            {/*{selectedMode === 'both' && <ul>*/}
                                            {/*    {val.manual_annotators.length > 0 && <li><i style={{fontSize:'0.9rem'}}>{val.manual_annotators.length} / {val.total_human_gt} manual annotations - users: {val.manual_annotators.filter(name=>name!=='Robot_user').join(', ')}</i>*/}
                                            {/*    </li>}*/}
                                            {/*    {val.robot_annotators.filter(name=>name!=='Robot_user').length > 0&& <li><i style={{fontSize:'0.9rem'}}>{val.robot_annotators.filter(name=>name!=='Robot_user').length} / {val.total_robot_gt} automatic annotations - users: {val.robot_annotators.filter(name=>name!=='Robot_user').join(', ')}</i>*/}
                                            {/*    </li>}*/}
                                            {/*</ul>}*/}
                                        </div></li>}
                                    </>)}
                                </ul> : <div>There are not mentions that have been annotated enough times to take part in the majority vote based ground-truth </div>}


                                <div>
                                </div>
                            </div>
                        </div>}

                        {selectedAct === 'concepts' && <div>
                            <i>Below you can find the concepts belonging to the majority vote ground truth.</i>
                            {/*<br/><i style={{fontSize:'0.8rem'}}>The concepts annotated by the algorithm are highlighted in  <span style={{color:'royalblue'}}>blue</span></i><br/>*/}
                            <br/>
                            <div>
                                {selectedMode === 'both' ? <>{<div>{MajorGT[selectedMode].length === 0 ? <>0</> :  <>{MajorGT[selectedMode][0]['total_human_gt']}</>} <b>manual</b> annotations</div>}
                                        {<div>{MajorGT[selectedMode].length === 0 ? <>0</> :  <>{MajorGT[selectedMode][0]['total_robot_gt']}</>} <b>automatic</b> annotations</div>}</> :
                                    <div>{MajorGT[selectedMode].length === 0 ? <>0</> :  <>{MajorGT[selectedMode][0]['total_gt']}</>} {selectedMode === 'Robot' ? <b>automatic</b> : <b>manual</b>} annotations</div>}
                                <hr/>
                                {/*<div>{MajorGT[selectedMode].length > 1</div>*/}
                                {MajorGT[selectedMode].length > 0 ? <ul>{MajorGT[selectedMode].map((val,ind)=>
                                    <>
                                        {val.count > (val.total_gt / 2) && <li>
                                            <div>
                                                <div style={{color: (val.users_list.indexOf('Robot_user') !==-1) ? 'royalblue':'black'}}>
                                                    {val.concept_name} - <span style={{color:'black',fontSize:'0.9rem'}}><i><b>URL</b> {val.concept_url}</i></span>
                                                </div>
                                                <div style={{fontSize:'0.9rem'}}>This concept occurred in:</div>
                                                {selectedMode === 'Human' && <i style={{fontSize:'0.9rem'}}>{val.count} / {val.total_gt} manual annotations - users: {val.users_list.filter(name=>name!=='Robot_user').join(', ')}</i>}
                                                {/*{selectedMode === 'Robot' && <i style={{fontSize:'0.9rem'}}> {val.count} / {val.total_gt} automatic annotations - users: {val.users_list.filter(name=>name!=='Robot_user').join(', ')}</i>}*/}
                                                {/*{selectedMode === 'both' && <ul>*/}
                                                {/*    {val.manual_annotators.length > 0 && <li><i style={{fontSize:'0.9rem'}}>{val.manual_annotators.length} / {val.total_human_gt} manual annotations - users: {val.manual_annotators.filter(name=>name!=='Robot_user').join(', ')}</i>*/}
                                                {/*    </li>}*/}
                                                {/*    {val.robot_annotators.filter(name=>name!=='Robot_user').length > 0&& <li><i style={{fontSize:'0.9rem'}}>{val.robot_annotators.filter(name=>name!=='Robot_user').length} / {val.total_robot_gt} automatic annotations - users: {val.robot_annotators.filter(name=>name!=='Robot_user').join(', ')}</i>*/}
                                                {/*    </li>}*/}
                                                {/*</ul>}*/}
                                            </div></li>}
                                    </>)}
                                </ul> : <div>There are not concepts that have been annotated enough times to take part in the majority vote based ground-truth </div>}


                                <div>
                                </div>
                            </div>
                        </div>}
                        {selectedAct === 'concept-mention' && <div>
                            <i>Below you can find the concepts belonging to the majority vote ground truth.</i>
                            {/*<br/><i style={{fontSize:'0.8rem'}}>The associations annotated by the algorithm are highlighted in  <span style={{color:'royalblue'}}>blue</span></i><br/>*/}
                            <div>
                                {selectedMode === 'both' ? <>{<div>{MajorGT[selectedMode].length === 0 ? <>0</> :  <>{MajorGT[selectedMode][0]['total_human_gt']}</>} <b>manual</b> annotations</div>}
                                        {<div>{MajorGT[selectedMode].length === 0 ? <>0</> :  <>{MajorGT[selectedMode][0]['total_robot_gt']}</>} <b>automatic</b> annotations</div>}</> :
                                    <div>{MajorGT[selectedMode].length === 0 ? <>0</> :  <>{MajorGT[selectedMode][0]['total_gt']}</>} {selectedMode === 'Robot' ? <b>automatic</b> : <b>manual</b>} annotations</div>}
                                <hr/>
                                {MajorGT[selectedMode].length>0 ? <ul>{MajorGT[selectedMode].map((val,ind)=>
                                    <>
                                        {val.count > (val.total_gt / 2) && <li>
                                            <div>
                                                <div style={{color: (val.users_list.indexOf('Robot_user') !==-1) ?'royalblue':'black'}}><div><Mention id = {index} index = {index} text={val['mention']} start={val['start']}
                                                                                                                                                       stop={val['stop']} mention_obj = {val}/></div>
                                                    <div>
                                                        <br/><Badge pill variant="dark" >
                                                        {val.concept_name}
                                                    </Badge> - <span style={{color:'black',fontSize:'0.9rem'}}><i><b>URL</b> {val.concept_url}</i></span>
                                                    </div>
                                                </div>
                                                <div style={{fontSize:'0.9rem'}}>This concept occurred in:</div>
                                                {selectedMode === 'Human' && <i style={{fontSize:'0.9rem'}}>{val.count} / {val.total_gt} annotations - users: {val.users_list.filter(name=>name!=='Robot_user').join(', ')}</i>}
                                                {/*{selectedMode === 'Robot' && <i style={{fontSize:'0.9rem'}}> {val.count} / {val.total_gt} automatic annotations - users: {val.users_list.filter(name=>name!=='Robot_user').join(', ')}</i>}*/}
                                                {/*{selectedMode === 'both' && <ul>*/}
                                                {/*    {val.manual_annotators.length > 0 && <li><i style={{fontSize:'0.9rem'}}>{val.manual_annotators.length} / {val.total_human_gt} manual annotations - users: {val.manual_annotators.filter(name=>name!=='Robot_user').join(', ')}</i>*/}
                                                {/*    </li>}*/}
                                                {/*    {val.robot_annotators.filter(name=>name!=='Robot_user').length > 0&& <li><i style={{fontSize:'0.9rem'}}>{val.robot_annotators.filter(name=>name!=='Robot_user').length} / {val.total_robot_gt} automatic annotations - users: {val.robot_annotators.filter(name=>name!=='Robot_user').join(', ')}</i>*/}
                                                {/*    </li>}*/}
                                                {/*</ul>}*/}
                                            </div></li>}
                                    </>)}
                                </ul> : <div>There are not associations that has been annotated enough times to take part in the majority vote based ground-truth </div>}

                                <div>
                                </div>
                            </div>
                        </div>}
                        <div style={{position:'absolute',bottom:0}}>
                            <div>
                                <span><Button variant='success' size='sm' onClick={()=>{SetSelectedFormat('');SetselectedMode('');SetselectedAct('none');SetToDownload(false);SetMajorGT(false)}}>Change configuration</Button>
                                </span>&nbsp;&nbsp;
                                <div>

                                    <span style={{'margin':'2%','display':'inline-block','width':'80%','padding-left':'1%','padding-right':'1%'}}><Form.Control value={SelectedFormat} as="select" defaultValue="Select a format..." onChange={(e)=>{SetSelectedFormat(e.target.value)}}>&nbsp;&nbsp;
                                        <option value = ''>Select a format...</option>
                                        <option value = 'json'>json</option>
                                        <option value = 'csv'>csv</option>
                                        {/*{(selectedAct === 'mentions' || selectedAct === 'concept-mention') && <option value = 'biocxml'>BioC XML</option>}*/}
                                        {/*{(selectedAct === 'mentions' || selectedAct === 'concept-mention') && <option value = 'biocjson'>BioC JSON</option>}*/}
                                    </Form.Control>
                                    </span>


                                    <span><Button variant='primary' size='sm' disabled={SelectedFormat === ''} onClick={()=>download_majority_report()}>Download</Button></span>&nbsp;&nbsp;
                                </div>
                            </div>


                        </div>

                        </div>}






                </Col>
            </Row> : <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}


        </div>
    );
}



export default MajorityVoteModal