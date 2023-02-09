import '../../App.css';
import {AppContext} from '../../App';
import React, {useState, useEffect, useContext, createContext} from "react";
import './compStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import {Container,Row,Col} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import '../General/first_row.css';
import {
    CircularProgressbar,ProgressProvider,
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {Collapse} from "@mui/material";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import { easeQuadInOut } from "d3-ease";
// import AnimatedProgressProvider from "./AnimatedProgressProvider";

import SelectMenu from "../SelectMenu/SelectMenu";

import SideBar from "../General/SideBar";
import ProgressiveComponent from "./ProgressiveComponent";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";





function MembersStats() {


    const { showbar,username,admin,usecaseList,institute,batchNumber,language,annotation,reports,languageList,instituteList } = useContext(AppContext);
    const [Annotation,SetAnnotation] = annotation;
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [Aux,SetAux] = useState(false)
    const [ShowBar,SetShowBar] = showbar;
    const [Username,SetUsername] = username;
    const [Reports,SetReports] = reports;
    const [Member,SetMember] = useState('')
    // const [ShowStats,SetShowStats] = useState(new Array(usecaseList.length+1).fill(false))
    const [StatsArray,SetStatsArray] = useState(false)
    const [StatsArrayPubMed,SetStatsArrayPubMed] = useState(false)
    const [StatsArrayPercent,SetStatsArrayPercent] = useState(false)
    const [StatsArrayPercentPubMed,SetStatsArrayPercentPubMed] = useState(false)
    const [Actions,SetActions] = useState(['labels','mentions','concepts','concept-mention'])
    const [FieldsUseCasesToExtract,SetFieldsUseCasesToExtract] = useState([])
    const [FieldsAlreadyExtracted,SetFieldsAlreadyExtracted] = useState([])
    const [StatsAuto,SetStatsAuto] = useState(0)
    const [ChosenStats,SetChosenStats] = useState('Human')
    const [UsesExtraxcted,SetUsesExtracted] = useState([])
    const [Options_users,SetOptions_users] = useState([])
    const [ShowSelectUser,SetShowSelectUser] = useState(false)
    const [Admin, SetAdmin] = admin;
    const [SelectedLang,SetSelectedLang] = useState('')
    const [SelectedInstitute,SetSelectedInstitute] = useState('')
    const [Language,SetLanguage] = language;
    const [Institute,SetInstitute] = institute;
    const [BatchNumber,SetBatchNumber] = batchNumber;
    const [SelectedBatch,SetSelectedBatch] = useState('');
    const [BatchList,SetBatchList] = useState([]);
    const [ShowOptions,SetShowOptions] = useState(true);

    useEffect(()=>{
        if(SelectedLang === '') {
            SetSelectedLang(Language)
        }
    },[Language])

    useEffect(()=>{
        if(SelectedInstitute === ''){
            SetSelectedInstitute(Institute)
        }
    },[Institute])

    useEffect(()=>{
        if(SelectedBatch === ''){
            SetSelectedBatch(BatchNumber)
        }
    },[BatchNumber])

    useEffect(()=>{
        // console.log('entro qua')
        axios.get('http://0.0.0.0:8000/get_users_list').then(response=>{
            var opt = []
            response.data.map((val,i)=>{
                opt.push({value:val,label:val})
            })
            SetOptions_users(opt)
        })
        axios.get("http://0.0.0.0:8000/get_usecase_inst_lang").then(response => {
            SetUseCaseList(response.data['usecase']);
            SetUsesExtracted(response.data['usecase']);
            SetLanguageList(response.data['language']);
            SetInstituteList(response.data['institute']);

        })
            .catch(function(error){
                console.log('error: ',error)
            })



        // axios.get("http://0.0.0.0:8000/get_stats_array_per_usecase").then(response => {
        //     // console.log('stats: ',response.data['array_stats'])
        //     SetStatsArray(response.data['array_stats'])
        //
        // })
        //     .catch(function(error){
        //         console.log('error: ',error)
        //     })

        var username = window.username
        // console.log('username', username)
        SetUsername(username)

        axios.get('http://0.0.0.0:8000/get_batch_list').then(response=>SetBatchList(response.data['batch_list']))

    },[])

    useEffect(()=>{
        if(ChosenStats !== '' && Member !== '' && SelectedLang !== '' && SelectedInstitute !== ''){
            SetStatsArray(false)
            SetStatsArrayPercent(false)
            SetShowSelectUser(false)
            // if (ChosenStats === 'Robot'){
            //     var uses = []
            //     axios.get('http://0.0.0.0:8000/get_post_fields_for_auto').then(function(response){
            //
            //         Object.keys(response.data['extract_fields']).map(elem=>{
            //             if(response.data['extract_fields'][elem].length > 0){
            //                 uses.push(elem)
            //             }
            //         })
            //         SetUsesExtracted(uses)
            //
            //     }).catch(function(error){
            //         console.log('error: ',error)
            //     })
            // }
            // else{
            //     SetUsesExtracted(UseCaseList)
            // }
            axios.get("http://0.0.0.0:8000/get_stats_array_per_usecase",{params:{mode:ChosenStats,member:Member,language:SelectedLang,institute:SelectedInstitute}}).then(response => {
                SetStatsArrayPercent(response.data['medtag']['percent'])
                SetStatsArray(response.data['medtag']['original'])
                SetStatsArrayPercentPubMed(response.data['pubmed']['percent'])
                SetStatsArrayPubMed(response.data['pubmed']['original'])
            })
                .catch(function(error){
                    console.log('error: ',error)
                })
        }

    },[ChosenStats,Member,SelectedLang,SelectedInstitute])

    // useEffect(()=>{
    //     if(StatsAuto !== 0){
    //         console.log('stat',StatsAuto)
    //
    //     }
    // },[StatsAuto])
    //
    // useEffect(()=>{
    //     if(StatsArray && StatsArrayPercent) {
    //         console.log('statsarray', ChosenStats)
    //         console.log('statsarray', StatsArray)
    //         console.log('statsarray', StatsArrayPercent)
    //     }
    //
    // },[StatsArrayPercent,StatsArray])

    // function changeStatsChosen(){
    //     var prev = ChosenStats
    //     SetChosenStats('')
    //
    //     if(prev === 'Human'){
    //         SetChosenStats('Robot')
    //     }
    //     else{
    //         SetChosenStats('Human')
    //     }
    // }

    function handleChangeUser(option){
        console.log(`Option selected:`, option.target.value);
        SetMember(option.target.value.toString())
    }

    function handleChangeLangSelected(option){
        console.log('selected_lang',SelectedLang)
        SetSelectedLang(option.target.value)
    }


    function handleChangeInstSelected(option){
        console.log('selected_lang',SelectedLang)
        SetSelectedInstitute(option.target.value)
    }

    function handleChangeBatchSelected(option){
        SetSelectedBatch(option.target.value)
    }

    return (

        <div className="App">
            {(Username !== Admin && Username !== 'Test') ?
                <div><h1>FORBIDDEN</h1>
                    <div>
                        <a href="http://0.0.0.0:8000/index">
                            Back
                        </a>
                    </div>
                </div>:
                <div>
                    <Container fluid>
                        {ShowBar && <SideBar />}
                        {(InstituteList.length >= 0 && LanguageList.length >=0 && UseCaseList.length >= 0) && <div><SelectMenu />
                            <hr/></div>}


                        <div style={{'text-align':'center', 'margin-bottom':'3%'}}><h2>TEAM MEMBERS' STATISTICS</h2></div>


                        {Member === '' && <><div style={{marginBottom:'5%',marginTop:'5%',textAlign:'center'}}><h5>Select the member you desire to check the statistics of.</h5></div>
                            <div>
                                <Row>
                                    <Col md={3}></Col>
                                    <Col md={6}>
                                        <Form.Control style={{'text-align':'center'}}  as="select" onChange={(option)=>handleChangeUser(option)} placeholder="Select amember...">
                                            <option value="">Select amember</option>
                                            {Options_users.map((option)=>
                                                <option value={option.value}>{option.label}</option>
                                            )}
                                        </Form.Control>
                                    </Col>
                                    <Col md={3}></Col>

                                </Row>
                            </div></>}


                        {/*<div style={{'margin-bottom':'3%'}}>In this section you can check how many reports you have annotated so far for each action and use case.<br/> Click <Button variant='info' size='sm'>here</Button> to check your statistics concerning the automatic annotations.</div>*/}
                        {/*{StatsAuto === true && <div style={{'text-align':'center'}}>*/}
                        {/*    {StatsAuto && ChosenStats === '' && Member !== '' &&<div >*/}
                        {/*        <div style={{marginBottom:'5%',marginTop:'5%'}}><h5>Select what type of annotations you desire to check the statistics of.</h5></div>*/}
                        {/*        <Row>*/}
                        {/*            <Col md={2}></Col>*/}
                        {/*            <Col md={4}><Button size='lg' variant='success' onClick={()=>SetChosenStats('Human')}><b>Manual</b></Button></Col>*/}
                        {/*            <Col md={4}><Button size='lg' variant='primary' onClick={()=>SetChosenStats('Robot')}><b>Automatic</b></Button></Col>*/}
                        {/*            <Col md={2}></Col>*/}
                        {/*        </Row>*/}
                        {/*    </div>}*/}


                        {/*</div>}*/}
                        {(ChosenStats !== '' ) && Member !== '' && <div style={{'text-align':'center'}}>
                            <div>You are checking the statistics of: <span><b>{Member}</b></span></div>
                            <Row><Col md={4}></Col>
                                <Col md={4}><Form.Control value={Member} style={{'text-align':'center'}}  as="select" onChange={(option)=>handleChangeUser(option)} placeholder="Select amember...">
                                    <option value = "">Select a member</option>
                                    {Options_users.map((option)=>
                                        <option value={option.value}>{option.label}</option>
                                    )}
                                </Form.Control></Col><Col md={4}></Col></Row><hr/>
                            {(StatsArray && StatsArrayPercent && StatsArrayPubMed && StatsArrayPercentPubMed) ?
                                <div>
                                    <div style={{textAlign:'center'}}><Button size='sm' onClick={()=>SetShowOptions(prev=>!prev)}>Options <FontAwesomeIcon icon={ShowOptions ? faChevronDown : faChevronUp}/></Button></div>
                                    <Collapse in={ShowOptions}>
                                        <>
                                            {SelectedLang !== ''  &&
                                            <><div>Select the language of the reports you want to check the statistics of</div>
                                                <Row><Col md={4}></Col>
                                                    <Col md={4}><Form.Control style={{'text-align':'center'}} value={SelectedLang} as="select" onChange={(option)=>handleChangeLangSelected(option)} placeholder="Select a language...">
                                                        {/*<option value="">Choose a language</option>*/}
                                                        {LanguageList.map((language)=>
                                                            <option value={language}>{language}</option>
                                                        )}
                                                    </Form.Control>
                                                    </Col><Col md={4}></Col></Row><hr/></>}
                                            {SelectedInstitute !== ''  &&
                                            <><div>Select the institute of the reports you want to check the statistics of</div>
                                                <Row><Col md={4}></Col>
                                                    <Col md={4}><Form.Control style={{'text-align':'center'}} value={SelectedInstitute} as="select" onChange={(option)=>handleChangeInstSelected(option)} placeholder="Select a institute...">
                                                        {InstituteList.map((institute)=>
                                                            <option value={institute}>{institute}</option>
                                                        )}
                                                    </Form.Control>
                                                    </Col><Col md={4}></Col></Row><hr/></>}
                                            {SelectedBatch !== ''  && BatchList.length > 1 &&
                                            <><div>Select the batch of the reports you want to check the statistics of</div>
                                                <Row><Col md={4}></Col>
                                                    <Col md={4}><Form.Control style={{'text-align':'center'}} value={SelectedBatch} as="select" onChange={(option)=>handleChangeBatchSelected(option)} placeholder="Select a batch...">
                                                        {/*<option value="">Choose an institute</option>*/}
                                                        {BatchList.map((batch)=>
                                                            <option value={batch}>{batch}</option>
                                                        )}
                                                    </Form.Control>
                                                    </Col><Col md={4}></Col></Row><hr/></>}
                                        </>
                                    </Collapse>
                                    {/*{StatsAuto === true && <div style={{marginTop:'2%',marginBottom:'2%'}}>Check the <Button size = 'sm' variant='info' onClick={()=>changeStatsChosen()}>{ChosenStats === 'Human' ? <b>Automatic</b> : <b>Manual</b>} annotations</Button><hr/></div>}*/}

                                    <div>{UsesExtraxcted.map((usecase,ind)=>
                                        <div>
                                            {StatsArray[usecase]['all_reports'] > 0 && <div>
                                                <div style={{'font-size':'1.5rem','margin':'5px'}}>Topic <span style={{'font-weight':'bold'}}>{usecase}</span>: {StatsArray[usecase]['all_reports']} reports</div>
                                                {ChosenStats === 'Human' ? <div><b>Language: <i style={{color: 'royalblue'}}>{SelectedLang}</i></b></div> : <div><b>Language: <i style={{color: 'royalblue'}}>english</i></b></div>}
                                                <div><b>Institute: <i style={{color: 'royalblue'}}>{SelectedInstitute}</i></b></div>
                                                <div style={{'text-align':'center'}}>
                                                    <Row>
                                                        {
                                                            Actions.map((o,indice)=>
                                                                <Col md={3}>
                                                                    <ProgressiveComponent stats_array_percent={StatsArrayPercent[usecase]} stats_array={StatsArray[usecase]} action={o} index={indice}/>
                                                                </Col>
                                                            )
                                                        }

                                                    </Row>
                                                    <hr/></div></div>}

                                        </div>
                                    )}</div>
                                    <div>
                                        {UsesExtraxcted.map((usecase,ind)=>
                                            <div>
                                                {StatsArrayPubMed[usecase]['all_reports'] > 0 && <div>

                                                    <div style={{'font-size':'1.5rem','margin':'5px'}}><span style={{color:'royalblue'}}><b>PUBMED</b></span> - Topic <span style={{'font-weight':'bold'}}>{usecase}</span>: {StatsArrayPubMed[usecase]['all_reports']} reports</div>
                                                    <div><b>Language: <i style={{color: 'royalblue'}}> english</i></b></div>
                                                    <div><b>Institute: <i style={{color: 'royalblue'}}> PUBMED</i></b></div>

                                                    <div style={{'text-align':'center'}}>
                                                        <Row>
                                                            {
                                                                Actions.map((o,indice)=>
                                                                    <Col md={3}>
                                                                        <ProgressiveComponent stats_array_percent={StatsArrayPercentPubMed[usecase]} stats_array={StatsArrayPubMed[usecase]} action={o} index={indice}/>
                                                                    </Col>
                                                                )
                                                            }

                                                        </Row>
                                                        <hr/></div></div>}

                                            </div>
                                        )}</div>
                                </div> :  <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}
                        </div>}
                        {(ChosenStats === '' ) && <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}

                    </Container>

                </div>}


        </div>



    );
}



export default MembersStats;





// function MembersStats() {
//
//
//     const { showbar,username,usecaseList,annotation,reports,languageList,instituteList } = useContext(AppContext);
//     const [Annotation,SetAnnotation] = annotation;
//     const [UseCaseList,SetUseCaseList] = usecaseList;
//     const [LanguageList,SetLanguageList] = languageList;
//     const [InstituteList,SetInstituteList] = instituteList;
//     const [Aux,SetAux] = useState(false)
//     const [ShowBar,SetShowBar] = showbar;
//     const [Username,SetUsername] = username;
//     const [Reports,SetReports] = reports;
//     const [Member,SetMember] = useState('')
//     // const [ShowStats,SetShowStats] = useState(new Array(usecaseList.length+1).fill(false))
//     const [StatsArray,SetStatsArray] = useState(false)
//     const [StatsArrayPubMed,SetStatsArrayPubMed] = useState(false)
//     const [StatsArrayPercent,SetStatsArrayPercent] = useState(false)
//     const [StatsArrayPercentPubMed,SetStatsArrayPercentPubMed] = useState(false)
//     const [Actions,SetActions] = useState(['labels','mentions','concepts','concept-mention'])
//     const [FieldsUseCasesToExtract,SetFieldsUseCasesToExtract] = useState([])
//     const [FieldsAlreadyExtracted,SetFieldsAlreadyExtracted] = useState([])
//     const [StatsAuto,SetStatsAuto] = useState(0)
//     const [ChosenStats,SetChosenStats] = useState('Human')
//     const [UsesExtraxcted,SetUsesExtracted] = useState([])
//     const [Options_users,SetOptions_users] = useState([])
//     const [ShowSelectUser,SetShowSelectUser] = useState(false)
//
//     useEffect(()=>{
//         console.log('entro qua')
//         axios.get('http://0.0.0.0:8000/get_users_list').then(response=>{
//             var opt = []
//             response.data.map((val,i)=>{
//                 opt.push({value:val,label:val})
//             })
//             SetOptions_users(opt)
//         })
//         axios.get("http://0.0.0.0:8000/get_usecase_inst_lang").then(response => {
//             SetUseCaseList(response.data['usecase']);
//             SetUsesExtracted(response.data['usecase']);
//             SetLanguageList(response.data['language']);
//             SetInstituteList(response.data['institute']);
//
//         })
//             .catch(function(error){
//                 console.log('error: ',error)
//             })
//
//
//
//         // axios.get("http://0.0.0.0:8000/get_stats_array_per_usecase").then(response => {
//         //     // console.log('stats: ',response.data['array_stats'])
//         //     SetStatsArray(response.data['array_stats'])
//         //
//         // })
//         //     .catch(function(error){
//         //         console.log('error: ',error)
//         //     })
//
//         var username = window.username
//         // console.log('username', username)
//         SetUsername(username)
//         // axios.get('http://0.0.0.0:8000/get_presence_robot_user').then(function(response){
//         //     if(response.data['auto_annotation_count'] > 0){
//         //         SetStatsAuto(true)
//         //     }
//         //     else{
//         //         SetStatsAuto(false)
//         //         SetChosenStats('Human')
//         //     }
//         //
//         //
//         // }).catch(function(error){
//         //     console.log('error: ',error)
//         // })
//     },[])
//
//     useEffect(()=>{
//         if(ChosenStats !== '' && Member !== ''){
//             SetStatsArray(false)
//             SetStatsArrayPercent(false)
//             SetShowSelectUser(false)
//             // if (ChosenStats === 'Robot'){
//             //     var uses = []
//             //     axios.get('http://0.0.0.0:8000/get_post_fields_for_auto').then(function(response){
//             //
//             //         Object.keys(response.data['extract_fields']).map(elem=>{
//             //             if(response.data['extract_fields'][elem].length > 0){
//             //                 uses.push(elem)
//             //             }
//             //         })
//             //         SetUsesExtracted(uses)
//             //
//             //     }).catch(function(error){
//             //         console.log('error: ',error)
//             //     })
//             // }
//             // else{
//             //     SetUsesExtracted(UseCaseList)
//             // }
//             axios.get("http://0.0.0.0:8000/get_stats_array_per_usecase",{params:{mode:ChosenStats,member:Member}}).then(response => {
//                 SetStatsArrayPercent(response.data['medtag']['percent'])
//                 SetStatsArray(response.data['medtag']['original'])
//                 SetStatsArrayPercentPubMed(response.data['pubmed']['percent'])
//                 SetStatsArrayPubMed(response.data['pubmed']['original'])
//             })
//                 .catch(function(error){
//                     console.log('error: ',error)
//                 })
//         }
//
//     },[ChosenStats,Member])
//
//     // useEffect(()=>{
//     //     if(StatsAuto !== 0){
//     //         console.log('stat',StatsAuto)
//     //
//     //     }
//     // },[StatsAuto])
//     //
//     // useEffect(()=>{
//     //     if(StatsArray && StatsArrayPercent) {
//     //         console.log('statsarray', ChosenStats)
//     //         console.log('statsarray', StatsArray)
//     //         console.log('statsarray', StatsArrayPercent)
//     //     }
//     //
//     // },[StatsArrayPercent,StatsArray])
//
//     // function changeStatsChosen(){
//     //     var prev = ChosenStats
//     //     SetChosenStats('')
//     //
//     //     if(prev === 'Human'){
//     //         SetChosenStats('Robot')
//     //     }
//     //     else{
//     //         SetChosenStats('Human')
//     //     }
//     // }
//
//     function handleChangeUser(option){
//         console.log(`Option selected:`, option.target.value);
//         SetMember(option.target.value.toString())
//     }
//
//     return (
//         <div className="App">
//             <div>
//                 <Container fluid>
//                     {ShowBar && <SideBar />}
//                     {(InstituteList.length >= 0 && LanguageList.length >=0 && UseCaseList.length >= 0) && <div><SelectMenu />
//                         <hr/></div>}
//
//
//                     <div style={{'text-align':'center', 'margin-bottom':'3%'}}><h2>TEAM MEMBERS' STATISTICS</h2></div>
//
//
//                     {Member === '' && <><div style={{marginBottom:'5%',marginTop:'5%',textAlign:'center'}}><h5>Select the member you desire to check the statistics of.</h5></div>
//                     <div>
//                         <Row>
//                             <Col md={3}></Col>
//                             <Col md={6}>
//                                 <Form.Control style={{'text-align':'center'}}  as="select" onChange={(option)=>handleChangeUser(option)} placeholder="Select a member...">
//                                     <option value="">Choose a member</option>
//                                     {Options_users.map((option)=>
//                                         <option value={option.value}>{option.label}</option>
//                                     )}
//                                 </Form.Control>
//                             </Col>
//                             <Col md={3}></Col>
//
//                         </Row>
//                     </div></>}
//
//
//                     {/*<div style={{'margin-bottom':'3%'}}>In this section you can check how many reports you have annotated so far for each action and use case.<br/> Click <Button variant='info' size='sm'>here</Button> to check your statistics concerning the automatic annotations.</div>*/}
//                     {StatsAuto === true && <div style={{'text-align':'center'}}>
//                         {StatsAuto && ChosenStats === '' && Member !== '' &&<div >
//                             <div style={{marginBottom:'5%',marginTop:'5%'}}><h5>Select what type of annotations you desire to check the statistics of.</h5></div>
//                             <Row>
//                                 <Col md={2}></Col>
//                                 <Col md={4}><Button size='lg' variant='success' onClick={()=>SetChosenStats('Human')}><b>Manual</b></Button></Col>
//                                 <Col md={4}><Button size='lg' variant='primary' onClick={()=>SetChosenStats('Robot')}><b>Autoamtic</b></Button></Col>
//                                 <Col md={2}></Col>
//                             </Row>
//                         </div>}
//
//
//                     </div>}
//                     {(ChosenStats !== '' || StatsAuto === false) && Member !== '' && <div style={{'text-align':'center'}}>
//                         <div>You are checking the statistics of: <span><b>{Member}</b></span></div>
//                         <Row><Col md={4}></Col><Col md={4}><Form.Control style={{'text-align':'center'}}  as="select" onChange={(option)=>handleChangeUser(option)} placeholder="Select a member...">
//                             <option value="">Choose a member</option>
//                             {Options_users.map((option)=>
//                                 <option value={option.value}>{option.label}</option>
//                             )}
//                         </Form.Control></Col><Col md={4}></Col></Row><hr/>
//                         {(StatsArray && StatsArrayPercent && StatsArrayPubMed && StatsArrayPercentPubMed) ?
//                             <div>
//                             {/*{StatsAuto === true && <div style={{marginTop:'2%',marginBottom:'2%'}}>Check the <Button size = 'sm' variant='info' onClick={()=>changeStatsChosen()}>{ChosenStats === 'Human' ? <b>Automatic</b> : <b>Manual</b>} annotations</Button><hr/></div>}*/}
//                             <div>{UsesExtraxcted.map((usecase,ind)=>
//                                 <div>
//                                     {StatsArray[usecase]['all_reports'] > 0 && <div>
//                                         {/*<div style={{'font-size':'1.5rem','margin':'5px'}}>TOPIC <span style={{'font-weight':'bold'}}>{usecase}</span>: {StatsArray[usecase]['all_reports']} documents</div>*/}
//                                         <div style={{'font-size':'1.5rem','margin':'5px'}}>TOPIC <span style={{'font-weight':'bold'}}>{usecase}</span>: 100 documents</div>
//                                         <div style={{'text-align':'center'}}>
//                                             <Row>
//                                                 {
//                                                     Actions.map((o,indice)=>
//                                                         <Col md={3}>
//                                                             <ProgressiveComponent stats_array_percent={StatsArrayPercent[usecase]} stats_array={StatsArray[usecase]} action={o} index={indice}/>
//                                                         </Col>
//                                                     )
//                                                 }
//
//                                             </Row>
//                                             <hr/></div></div>}
//
//                                 </div>
//                             )}</div>
//                             <div>
//                                 {UsesExtraxcted.map((usecase,ind)=>
//                                     <div>
//                                         {StatsArrayPubMed[usecase]['all_reports'] > 0 && <div>
//                                             <div style={{'font-size':'1.5rem','margin':'5px'}}><span style={{color:'royalblue'}}><b>PUBMED</b></span> - USE CASE <span style={{'font-weight':'bold'}}>{usecase}</span>: {StatsArrayPubMed[usecase]['all_reports']} reports</div>
//                                             <div style={{'text-align':'center'}}>
//                                                 <Row>
//                                                     {
//                                                         Actions.map((o,indice)=>
//                                                             <Col md={3}>
//                                                                 <ProgressiveComponent stats_array_percent={StatsArrayPercentPubMed[usecase]} stats_array={StatsArrayPubMed[usecase]} action={o} index={indice}/>
//                                                             </Col>
//                                                         )
//                                                     }
//
//                                                 </Row>
//                                                 <hr/></div></div>}
//
//                                     </div>
//                                 )}</div>
//                         </div> :  <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}
//                     </div>}
//                     {/*{(ChosenStats === '' && StatsAuto === 0) && <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}*/}
//
//                 </Container>
//
//             </div>
//
//
//         </div>
//
//
//
//     );
// }
//
//
// export default MembersStats;
