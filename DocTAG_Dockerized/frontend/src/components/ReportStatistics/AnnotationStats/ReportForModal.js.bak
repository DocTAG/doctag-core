import React, {Component, useContext, useEffect, useState} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col} from "react-bootstrap";
import '../../Report/report.css';
import {AppContext, MentionContext} from "../../../App";
import '../tables.css'
import ReportListUpdated from "../../Report/ReportListUpdated";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Spinner from "react-bootstrap/Spinner";
import Collapse from "@material-ui/core/Collapse";
import MentionList from "../../Mentions/MentionList";
import Mention from "../../Mentions/Mention";
import './reportsmodal.css'
import Badge from "react-bootstrap/Badge";
import {Divider} from "@material-ui/core";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
function ReportForModal(props) {

    const { index,institute,loadingMentions,color,tokens,fields,mentionsList,loadingColors,showannotations,finalcount,fieldsToAnn,reached,orderVar, errorSnack,reports, reportString, insertionTimes } = useContext(AppContext);
    const [Reports,SetReports] = useState([])
    const [ReportString, setReportsString] = reportString;
    //Report sections
    const [Children,SetChildren] = tokens;
    const [selectedStats,SetSelectedStata] = useState('none')
    const [ShowLabelsStats,SetShowLabelsStats] = useState(false)
    const [ShowMentionsStats,SetShowMentionsStats] = useState(false)
    const [ShowConceptsStats,SetShowConceptsStats] = useState(false)
    const [ShowLinkingStats,SetShowLinkingStats] = useState(false)
    const [newInd,SetNewInd] = useState(false)
    const [FinalCountReached, SetFinalCountReached] = reached;
    const [FinalCount, SetFinalCount] = finalcount;
    const [Fields, SetFields] = fields;
    const [FieldsToAnn, SetFieldsToAnn] = fieldsToAnn;
    const [ShowAnnotationsStats,SetShowAnnotationsStats] = showannotations;
    const [mentions_to_show, SetMentions_to_show] = useState([]);
    const [LoadingMentions, SetLoadingMentions] = loadingMentions;
    const [LoadingMentionsColor, SetLoadingMentionsColor] = loadingColors;
    const [Color, SetColor] = color
    const [EXAPresenceLabels,SetEXAPresenceLabels] = useState(false)
    const [EXAPresenceConcepts,SetEXAPresenceConcepts] = useState(false)

    // useEffect(()=>{
    //     if(props.stats !== false){
    //         var mentions = []
    //         var json_val = {}
    //         props.stats['Robot']['mentions']['mentions_list'].map((val,ind)=>{
    //             json_val['start'] = val.start
    //             json_val['stop'] = val.stop
    //             json_val['mention_text'] = val.mention
    //             if(mentions.indexOf(json_val) < 0){
    //                 mentions.push(json_val)
    //
    //             }
    //         })
    //         SetMentions_to_show(mentions)
    //         SetLoadingMentions(false)
    //     }
    // },[props.stats])

    useEffect(()=>{
        setReportsString('')
        SetMentions_to_show([])
        axios.get("http://0.0.0.0:8000/get_reports", {params: {all: 'all'}}).then(response => {
            SetReports(response.data['report']);})

        // axios.get("http://0.0.0.0:8000/check_presence_exa_conc_lab", {params: {id_report:props.id_report,language:props.language}})
        //     .then(response => {
        //     if(response.data['labels'] === true){
        //         SetEXAPresenceLabels(true)
        //     }
        //     else{
        //         SetEXAPresenceLabels(false)
        //
        //     }
        //     if(response.data['concepts'] === true){
        //         SetEXAPresenceConcepts(true)
        //     }
        //     else{
        //         SetEXAPresenceConcepts(false)
        //
        //     }})
        //     .catch(error=>{
        //         console.log(error)
        // })

    },[])

    useEffect(()=>{
        console.log('REPORT',ReportString)
    },[ReportString])

    useEffect(()=>{
        if(Reports.length > 0){
            console.log(Reports[newInd].id_report)
            console.log(newInd)
            if(newInd >= 0){
                axios.get("http://0.0.0.0:8000/report_start_end", {params: {report_id: Reports[newInd].id_report.toString()}}).then(response => {SetFinalCount(response.data['final_count']);
                    setReportsString(response.data['rep_string']); SetFinalCountReached(false);
                })
                axios.get("http://0.0.0.0:8000/get_fields",{params:{report:props.id_report}}).then(response => {SetFields(response.data['fields']);SetFieldsToAnn(response.data['fields_to_ann']);})

            }
        }


    },[newInd])



    useEffect(()=>{
        if(Reports.length > 0){

            if(props.id_report !== false){
                Reports.map((report,ind)=>{
                    if(report.id_report === props.id_report){

                        SetNewInd(ind)
                    }

                })
            }
        }



    },[props.id_report,Reports])



    useEffect(()=>{
        if(Reports.length>0){
            if(newInd===0){
                console.log('zero',Reports[newInd].id_report)
            }

        }
    },[newInd])




    return (
          <div className='container-fluid'>

            {(newInd !== false  && ReportString !== '' && (FieldsToAnn.length > 0 || Fields.length > 0) && props.stats !== false && ShowAnnotationsStats && Reports.length > 0) ? <Row>

                <Col md={6} style={{fontSize:'1rem'}}>
                    <div className='report_modal'>
                        <ReportListUpdated report_id = {Reports[newInd].id_report} report = {Reports[newInd].report_json} action={selectedStats}/>

                    </div>
                </Col>
                <Col  md={6}>
                    <div className='modalContainer'>
                        <div><h5 style={{display:'inline-block'}}>Labels  </h5><IconButton onClick={()=>{SetShowLabelsStats(prev=>!prev);SetSelectedStata('labels')}}><ExpandMoreIcon style={{marginLeft:'2px'}} /></IconButton></div>
                        <Collapse style={{marginTop:'0px'}} in={ShowLabelsStats}>
                        {<div>
                            <i>Below you can find the list of labels; next to each label you can see how many users chose that label for this document out of the total of users who annotated the labels for this document.</i>
                            <br/>
                            {props.stats['Human']['labels']['count'] > 0 &&
                            <div>

                                <h6 style={{textDecoration:'underline'}}>Your labels</h6>
                                <div>Users who annotated the labels for this document: <b>{props.stats['Human']['labels']['count']}  {props.stats['Human']['labels']['count'] > 0 && <i>({props.stats['Human']['labels']['users_list'].join(', ')})</i>}</b></div>

                                <ul>{props.stats['Human']['labels']['labels_list'].map((val,ind)=>

                                    <>{val.count > 0 &&
                                    <li className='annotations_li'>
                                        <div><i>{val.label}</i>
                                        </div>
                                        <div style={{'font-size':'0.9rem'}}><b>{val.count} </b>{val.count === 1 ? <>user</> : <>users</>} annotated this label : <i>{val.users_list.join(', ')}</i></div>
                                        </li>}</>

                                    // <Row>
                                    //     <Col md={9}>{val.label} </Col>
                                    //     <Col md={3}><b>{val.count} {val.count === 1 ? <>user</> : <>users</>}</b></Col>
                                    // </Row>}</>

                                )}</ul>



                            </div>}

                            </div>}
                        </Collapse><hr/>
                        <div><h5 style={{display:'inline-block'}}>Passages  </h5><IconButton onClick={()=>{SetShowMentionsStats(prev=>!prev);SetSelectedStata('mentions')}}><ExpandMoreIcon style={{marginLeft:'2px'}} /></IconButton></div>
                        <Collapse style={{marginTop:'0px'}} in={ShowMentionsStats}>

                        <div>
                            <i>Below you can find the list of passages associated to this document; next to each passage you can see how many users selected that passage for this document out of the total of users who annotated the passages for this document.</i>
                            <br/><br/>
                            {props.stats['Human']['mentions']['count'] > 0 && <>
                            <div>Users who annotated the passage for this document: <b>{props.stats['Human']['mentions']['count']}  {props.stats['Human']['mentions']['count']> 0 && <i>({props.stats['Human']['mentions']['users_list'].join(', ')})</i>}</b></div>
                            <ul>{props.stats['Human']['mentions']['mentions_list'].map((mention,index)=>
                                <div>{mention.count > 0 && <li className='annotations_li'>
                                        <div style={{'display':'block'}}><Mention id = {index} index = {index} text={mention['mention']} start={mention['start']}
                                                         stop={mention['stop']} mention_obj = {mention}/><br/>
                                        </div>
                                    <div style={{'clear':'both'}}>
                                    {mention.labels.map(lab=><div>
                                        <div>label: <b>{lab.label}</b></div>
                                        <div style={{'font-size':'0.9rem'}}><b>{lab.count} </b>{lab.count === 1 ? <>user</> : <>users</>} annotated this label : <i>{lab.users_list.join(', ')}</i>
                                        </div>
                                    </div>)}</div>
                                    </li>}<br/></div>)}
                            </ul>
                                </>}
                            <hr/>

                        </div>

                        </Collapse><hr/>


                        <div><h5 style={{display:'inline-block'}}>Concepts  </h5><IconButton onClick={()=>{SetShowConceptsStats(prev=>!prev);SetSelectedStata('concepts')}}><ExpandMoreIcon style={{marginLeft:'2px'}} /></IconButton></div>
                        <Collapse style={{marginTop:'0px'}} in={ShowConceptsStats}>
                        <div>
                            <i>Below you can find the list of concepts found for the document; next to each concept you can see how many users chose that concept for this document out of the total of users who annotated the concepts for this document.</i>
                            <br/><br/>
                            {props.stats['Human']['concepts']['count'] > 0 && <div>

                                {/*<h6 style={{textDecoration:'underline'}}>Concepts from manual annotation</h6>*/}
                                <div>Users who annotated the concepts for this document: <b>{props.stats['Human']['concepts']['count']} {props.stats['Human']['concepts']['count'] > 0 && <i>({props.stats['Human']['concepts']['users_list'].join(', ')})</i>}</b></div>
                                <ul>{props.stats['Human']['concepts']['concepts_list'].map((val,ind)=>
                                    <>{val.count > 0 && <li className='annotations_li'>
                                        <div>
                                        {val.concept_name} - <span style={{color:'black',fontSize:'0.9rem'}}><i><b>URL</b> {val.concept_url}</i></span>
                                        </div>
                                        <div style={{'font-size':'0.9rem'}}><b>{val.count} </b>{val.count === 1 ? <>user</> : <>users</>} annotated this concept : <i>{val.users_list.join(', ')}</i></div>
                                    </li>}</>)}</ul>

                            </div>}

                        </div>

                        </Collapse><hr/>
                        <div><h5 style={{display:'inline-block'}}>Linking  </h5><IconButton onClick={()=>{SetShowLinkingStats(prev=>!prev);SetSelectedStata('concept-mention')}}><ExpandMoreIcon style={{marginLeft:'2px'}} /></IconButton></div>
                        <Collapse style={{marginTop:'0px'}} in={ShowLinkingStats}>
                            <div>
                            <i>Below you can find the list of associations passage-concept found for this document; next to each association passage-concept you can see how many users chose that association for this document out of the total of users who annotated the associations for this document.</i>
                            <br/><br/>
                            {props.stats['Human']['linking']['count'] > 0 && <div>

                                {/*<h6 style={{textDecoration:'underline'}}>Associations from manual annotation</h6>*/}
                                <div>Users performed linking for this document: <b>{props.stats['Human']['linking']['count']} {props.stats['Human']['linking']['count'] > 0 && <i>({props.stats['Human']['linking']['users_list'].join(', ')})</i>}</b> </div>
                                <ul>{props.stats['Human']['linking']['linking_list'].map((val,ind)=>
                                    <>{val.count > 0 && <li className='annotations_li'>
                                        <div><Mention id = {index} index = {index} text={val['mention']} start={val['start']}
                                                      stop={val['stop']} mention_obj = {val}/><br/></div>

                                            <div style={{'clear':'both'}}>
                                                <Badge pill variant="dark" >
                                                    {val.concept_name}
                                                </Badge> - <span style={{color:'black',fontSize:'0.9rem'}}><i><b>URL</b> {val.concept_url}</i></span>
                                            </div>

                                        <div style={{'font-size':'0.9rem'}}><b>{val.count} </b>{val.count === 1 ? <>user</> : <>users</>} annotated this association : <i>{val.users_list.join(', ')}</i></div><br/>
                                    </li>}</>)}

                            </ul></div>}

                        </div>

                        </Collapse>
                    </div>


                </Col>
            </Row> : <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}


        </div>
    );
}


export default ReportForModal