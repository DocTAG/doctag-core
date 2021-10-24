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

// import { easeQuadInOut } from "d3-ease";
// import AnimatedProgressProvider from "./AnimatedProgressProvider";
import ChangingProgressProvider from "./ChangingProgressProvider";

import SelectMenu from "../SelectMenu/SelectMenu";

import SideBar from "../General/SideBar";
import ProgressiveComponent from "./ProgressiveComponent";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

function MyStats() {


    const { showbar,username,usecaseList,annotation,reports,languageList,instituteList } = useContext(AppContext);
    const [Annotation,SetAnnotation] = annotation;
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [Aux,SetAux] = useState(false)
    const [ShowBar,SetShowBar] = showbar;
    const [Username,SetUsername] = username;
    const [Reports,SetReports] = reports;
    // const [ShowStats,SetShowStats] = useState(new Array(usecaseList.length+1).fill(false))
    const [StatsArray,SetStatsArray] = useState(false)
    const [StatsArrayPubMed,SetStatsArrayPubMed] = useState(false)
    const [StatsArrayPercent,SetStatsArrayPercent] = useState(false)
    const [StatsArrayPercentPubMed,SetStatsArrayPercentPubMed] = useState(false)
    const [Actions,SetActions] = useState(['labels','mentions','concepts','concept-mention'])

    const [StatsAuto,SetStatsAuto] = useState(0)
    const [ChosenStats,SetChosenStats] = useState('Human')
    const [UsesExtraxcted,SetUsesExtracted] = useState([])
    useEffect(()=>{
        console.log('entro qua')
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
        // axios.get('http://0.0.0.0:8000/get_presence_robot_user').then(function(response){
        //     if(response.data['auto_annotation_count'] > 0){
        //         SetStatsAuto(true)
        //     }
        //     else{
        //         SetStatsAuto(false)
        //         SetChosenStats('Human')
        //     }
        //
        //
        // }).catch(function(error){
        //     console.log('error: ',error)
        // })
    },[])


    useEffect(()=>{
        if(ChosenStats !== ''){
            SetStatsArray(false)
            SetStatsArrayPercent(false)
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
            //         SetUsesExtracted(UseCaseList)
            //     }

            axios.get("http://0.0.0.0:8000/get_stats_array_per_usecase",{params:{mode:ChosenStats}}).then(response => {
                SetStatsArrayPercent(response.data['medtag']['percent'])
                SetStatsArray(response.data['medtag']['original'])
                SetStatsArrayPercentPubMed(response.data['pubmed']['percent'])
                SetStatsArrayPubMed(response.data['pubmed']['original'])
            })
                .catch(function(error){
                    console.log('error: ',error)
                })
        }

    },[ChosenStats])

    useEffect(()=>{
        console.log('stat',StatsArray)
        console.log('stat',StatsArrayPubMed)
        console.log('stat',StatsArrayPercent)
        console.log('stat',StatsArrayPercentPubMed)

    },[StatsArrayPercent,StatsArrayPercent,StatsArrayPubMed,StatsArray])

    useEffect(()=>{
        if(StatsAuto !== 0){
            console.log('stat',StatsAuto)
        }
    },[StatsAuto])


    function changeStatsChosen(){
        var prev = ChosenStats
        SetChosenStats('')

        if(prev === 'Human'){
            SetChosenStats('Robot')
        }
        else{
            SetChosenStats('Human')
        }
    }
    return (
        <div className="App">
            <div>
                <Container fluid>
                    {ShowBar && <SideBar />}
                    {(InstituteList.length >= 0 && LanguageList.length >=0 && UseCaseList.length >= 0) && <div><SelectMenu />
                        <hr/></div>}


                        <div style={{'text-align':'center', 'margin-bottom':'3%'}}><h2>MY STATISTICS</h2></div>

                        {/*<div style={{'margin-bottom':'3%'}}>In this section you can check how many reports you have annotated so far for each action and use case.<br/> Click <Button variant='info' size='sm'>here</Button> to check your statistics concerning the automatic annotations.</div>*/}
                    {StatsAuto === true && <div style={{'text-align':'center'}}>
                        {StatsAuto === true && ChosenStats === '' && <div >
                            <div style={{marginBottom:'5%',marginTop:'5%'}}><h5>Select what type of annotations you desire to check the statistics of.</h5></div>
                            <Row>
                                <Col md={2}></Col>
                                <Col md={4}><Button size='lg' variant='success' onClick={()=>SetChosenStats('Human')}><b>Manual</b></Button></Col>
                                <Col md={4}><Button size='lg' variant='primary' onClick={()=>SetChosenStats('Robot')}><b>Autoamtic</b></Button></Col>
                                <Col md={2}></Col>
                            </Row>
                        </div>}


                        </div>}
                    {(ChosenStats !== '' || StatsAuto === false) && <div style={{'text-align':'center'}}>
                        {(StatsArray && StatsArrayPercent && StatsArrayPubMed && StatsArrayPercentPubMed) ? <div>
                            {StatsAuto === true && <div style={{marginTop:'2%',marginBottom:'2%'}}>Check the <Button size = 'sm' variant='info' onClick={()=>changeStatsChosen()}>{ChosenStats === 'Human' ? <b>Automatic</b> : <b>Manual</b>} annotations</Button><hr/></div>}
                            <div>{UsesExtraxcted.map((usecase,ind)=>
                                <div>
                                    {StatsArray[usecase]['all_reports'] > 0 && <div>
                                        <div style={{'font-size':'1.5rem','margin':'5px'}}>TOPIC <span style={{'font-weight':'bold'}}>{usecase}</span>: {StatsArray[usecase]['all_reports']} documents</div>
                                        {/*<div style={{'font-size':'1.5rem','margin':'5px'}}>TOPIC <span style={{'font-weight':'bold'}}>{usecase}</span>: 100 documents</div>*/}
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
                                    <div style={{'font-size':'1.5rem','margin':'5px'}}><span style={{color:'royalblue'}}><b>PUBMED</b></span> - TOPIC <span style={{'font-weight':'bold'}}>{usecase}</span>: {StatsArrayPubMed[usecase]['all_reports']} documents</div>
                                    <div style={{'text-align':'center'}}>
                                        <Row>
                                            {
                                                Actions.map((o,indice)=>
                                                    <Col md={3}>
                                                        <ProgressiveComponent stats_array_percent={StatsArrayPubMed[usecase]} stats_array={StatsArrayPubMed[usecase]} action={o} index={indice}/>
                                                    </Col>
                                                )
                                            }

                                        </Row>
                                        <hr/></div></div>}

                            </div>
                        )}</div>
                        </div> :  <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}
                    </div>}
                    {/*{(ChosenStats === '' && StatsAuto === 0) && <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}*/}

                </Container>

            </div>


        </div>



    );
}


export default MyStats;
