import React, {Component, useEffect, useState, useContext} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col} from "react-bootstrap";
import {
    faLanguage,
    faUser,
    faSignOutAlt,
    faMicroscope,
    faCogs,
    faHospital,
    faBars,
    faDownload,
    faRobot,faListOl
} from '@fortawesome/free-solid-svg-icons';
import {AppContext} from "../../App";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import './selectMenu.css';
import OptionsModal from "./OptionsModal";
import Modal from "react-bootstrap/Modal";
import DownloadGT from "./DownloadGT";
import DownloadGTUser from "./DownloadGTUser";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function SelectMenu(props){
    const { reports,report_type,batchNumber,save,topicindex,updateSingle,updateMenu,usecaseList,instituteList,languageList,annotation, index,username,showbar, report,action,showOptions,showDownload, insertionTimes,institute,language,usecase } = useContext(AppContext);
    const [ShowModalDownload, SetShowModalDownload] = showDownload;
    const [Annotation, SetAnnotation] = annotation
    const [ReportType, SetReportType] = report_type
    const [UseCase,SetUseCase] = usecase;
    const [BatchNumber,SetBatchNumber] = batchNumber
    const [BatchList,SetBatchList] = useState([])
    const [TopicIndex, SetTopicIndex] = topicindex

    const [Username,SetUsername] = username;
    const [ShowBar,SetShowBar] = showbar;
    const [ShowModal, SetShowModal] = showOptions;
    const [Institute,SetInstitute] = institute;
    const [Language,SetLanguage] = language;
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [Reports,SetReports] = reports
    const [Action,SetAction] = action
    const [Inst,SetInst] = useState('')
    const [Use,SetUse] = useState('')
    const [Lang,SetLang] = useState('')
    const [Rep,SetRep] = useState('')
    const [Batch,SetBatch] = useState('')
    const [Total,SetTotal] = useState(false)
    const [Annotated,SetAnnotated] = useState(false)
    const [Index,SetIndex] = index
    const [Report,SetReport] = report
    const [IndexSel, SetIndexSel] = useState(0)
    const [ArrayBool,SetArrayBool] = useState([])
    const [ArrayInsertionTimes,SetArrayInsertionTimes] = insertionTimes;
    const [LangFlag,SetLangFlag] = useState('')
    const [UpdateSingleReport,SetUpdateSingleReport] = updateSingle
    const [UpdateMenu, SetUpdateMenu] = updateMenu;
    const [SavedGT,SetSavedGT] = save;

    useEffect(()=>{

        if(Language !== '' && UseCase !== '' && Institute !== '' && BatchNumber !== ''){

            SetLang(Language)
            SetInst(Institute)
            SetUse(UseCase)
            SetBatch(BatchNumber)
        }

    },[])

    useEffect(()=>{


            axios.get('get_number_of_annotations',{params:{action:Action}}).then(response=>{
                SetTotal(response.data['tot'])
                SetAnnotated(response.data['annotations'])
            })
                .catch(error=>{
                    console.log(error)
                })



    },[Action,TopicIndex,Index])

    useEffect(()=>{
        if(UseCase !== ''){
            SetUse(UseCase)

        }
    },[UseCase])
    useEffect(()=>{

        if(Use !== '' ) {
            if(ReportType === 'reports'){
                axios.get('get_batch_list', {params: {usecase: Use}}).then(response => {
                    SetBatchList(response.data['batch_list']);
                })
            }
            else if(ReportType === 'pubmed'){
                axios.get('get_PUBMED_batch_list', {params: {usecase: Use}}).then(response => {
                    SetBatchList(response.data['batch_list']);
                })
            }

        }
    },[Use,Inst,Institute,ReportType])


    function handleChange(e){
        SetShowModal(prevState => !prevState)
    }
    function handleChangeDownload(e){
        SetShowModalDownload(prevState => !prevState)
    }
    function handleBar(e){
        SetShowBar(prevState => !prevState)
    }
    function handleChangeLanguage(e){
        SetLanguage(e.target.value)
        axios.post("new_credentials", {
            usecase: UseCase, language: e.target.value, institute: Institute, annotation: Annotation,report_type: ReportType,batch:1
        })
            .then(function (response) {
                SetLanguage(e.target.value)
                SetUpdateMenu(true)

                // SetUpdateSingleReport(true)

            })
            .catch(function (error) {

                console.log('ERROR', error);
            });


    }

    function handleChangeInstitute(e){
        SetInstitute(e.target.value)
        // console.log('batch',BatchList[0])
        if(e.target.value === 'PUBMED'){
            var r = ('pubmed')

        }
        else{
            var r = ('reports')

        }
        axios.post("new_credentials", {
            usecase: '', language: Language, institute: e.target.value, annotation: Annotation,report_type: r,batch:1
        })
            .then(function (response) {
                // SetInstitute(e.target.value)
                SetUpdateMenu(true)
                SetReportType(r)
                // SetBatch(1)
                // SetBatchNumber(1)

            })
            .catch(function (error) {

                console.log('ERROR', error);
            });


    }


    function handleChangeBatch(e){
        SetBatch(e.target.value)
        axios.post("new_credentials", {
            usecase: UseCase, language: Language, institute: Institute, annotation: Annotation,report_type: ReportType,batch:e.target.value
        })
            .then(function (response) {
                SetBatchNumber(e.target.value)
                SetUpdateMenu(true)

            })
            .catch(function (error) {
                console.log('ERROR', error);
            });


    }
    useEffect(()=>{
        // console.log('prima entrata in parametri')
        axios.get("get_session_params").then(response => {
            SetInstitute(response.data['institute']);
            SetLanguage(response.data['language']);
            SetUseCase(response.data['usecase']);



        })


    },[ReportType])




    return(
        <div className='selection_menu'>
            <Row>
                <Col md={1}>
                    <span> <button className='menuButton' onClick={(e)=>handleBar(e)}><FontAwesomeIcon icon={faBars} size='2x' /></button></span>

                </Col>

                <Col md={8} style={{'text-align':'center'}}>
                    <div>
                        {(LanguageList.length > 1 || BatchList.length > 1 || InstituteList.length > 1) && <>
                                {BatchList.length > 1 && Batch !== '' && <span>
                                    <span className='configuration'><b>Batch:</b></span>&nbsp;
                                    <select style={{'vertical-align':'bottom','font-size':'0.8rem'}} className='select_class'
                                            value = {Batch}
                                            onChange={(e)=>handleChangeBatch(e)}>
                                        {BatchList.map(use=>
                                            <option value = {use}>{use}</option>
                                        )}
                                    </select>
                                </span>
                                }



                                {Language !== '' && LanguageList.length > 1 && <span>
                                    <span className='configuration'><b>Language:</b></span>&nbsp;
                                    {(LanguageList.length > 0) ?
                                        <select style={{'vertical-align':'bottom','font-size':'0.8rem'}} className='select_class'
                                                value = {Language}
                                                onChange={(e)=>handleChangeLanguage(e)}>
                                            {LanguageList.map(lang=>
                                                <option value = {lang}>{lang}</option>
                                            )}
                                        </select> :
                                        <span>{Language}</span>}
                                </span>}
                            {Institute !== '' && InstituteList.length > 1 && <span>
                                    <span className='configuration'><b>Institute:</b></span>&nbsp;

                                    <select style={{'vertical-align':'bottom','font-size':'0.8rem'}} className='select_class'
                                            value = {Institute}
                                            onChange={(e)=>handleChangeInstitute(e)}>
                                        {InstituteList.map(ins=>
                                            <option value = {ins}>{ins}</option>
                                        )}
                                    </select>
                                </span>}




                            &nbsp;&nbsp; -- </>}



                        <span className='configuration' style={{'font-weight':'bold'}}>Topic: </span>
                        <span  >{UseCase}</span>&nbsp;
                        {Total !== false && <><span className='configuration' style={{'font-weight':'bold'}}>Annotated: </span>
                        <span >{Annotated}</span>&nbsp;</>}
                            {/*<span >12</span>&nbsp;</>}*/}

                        {Annotated !== false && <><span className='configuration' style={{'font-weight':'bold'}}>Total: </span>
                        <span  >{Total}</span>&nbsp;</>}
                            {/*<span  >100</span>&nbsp;</>}*/}

                        {Action !== 'none' && Action !== 'concept-mention' && Action !== false && <><span className='configuration' style={{'font-weight': 'bold'}}>Type: </span>
                            <span >{Action === 'mentions' ? 'passages' : Action}</span>&nbsp;&nbsp;</>}
                        {Action  === 'concept-mention' && Action !== false && <><span className='configuration' style={{'font-weight': 'bold'}}>Type: </span>
                            <span >Linking</span>&nbsp;&nbsp;</>}

                        {/*    <span className='configuration' style={{'font-weight':'bold'}}>Configuration:</span>*/}

                    {/*    <span className='configuration'><FontAwesomeIcon icon={faMicroscope} /></span>&nbsp;*/}
                    {/*    {UseCaseList.length > 0 && Use !== '' &&*/}
                    {/*    <select style={{'vertical-align':'bottom','font-size':'0.8rem'}} className='select_class'*/}
                    {/*            value = {Use}*/}
                    {/*            onChange={(e)=>handleChangeUseCase(e)}>*/}
                    {/*        {UseCaseList.map(use=>*/}
                    {/*            <option value = {use}>{use}</option>*/}
                    {/*        )}*/}
                    {/*    </select>}*/}
                    {/*    {BatchList.length > 1 && Use !== '' && Batch !== '' && <span>*/}
                    {/*        <span className='configuration'><FontAwesomeIcon icon={faListOl} /></span>&nbsp;*/}
                    {/*        <select style={{'vertical-align':'bottom','font-size':'0.8rem'}} className='select_class'*/}
                    {/*                value = {Batch}*/}
                    {/*                onChange={(e)=>handleChangeBatch(e)}>*/}
                    {/*            {BatchList.map(use=>*/}
                    {/*                <option value = {use}>{use}</option>*/}
                    {/*            )}*/}
                    {/*        </select>*/}
                    {/*    </span>*/}
                    {/*    }*/}


                    {/*    {Language !== '' &&*/}
                    {/*    <span className='configuration'><FontAwesomeIcon icon={faLanguage} />&nbsp;*/}
                    {/*        {(LanguageList.length > 1) ?*/}
                    {/*            <select style={{'vertical-align':'bottom','font-size':'0.8rem'}} className='select_class'*/}
                    {/*                                                               value = {Language}*/}
                    {/*                                                               onChange={(e)=>handleChangeLanguage(e)}>*/}
                    {/*            {LanguageList.map(lang=>*/}
                    {/*                <option value = {lang}>{lang}</option>*/}
                    {/*            )}*/}
                    {/*            </select> :*/}
                    {/*            <span>{Language}</span>*/}

                    {/*    }*/}
                    {/*    </span>}&nbsp;&nbsp;&nbsp;&nbsp;*/}
                        <span > <Button id='conf' onClick={(e)=>handleChangeDownload(e)} style={{'padding':'0','font-size':'10px','height':'25px','width':'76px'}} variant='info'> <FontAwesomeIcon icon={faDownload} /> Download</Button></span>

                        {ShowModalDownload ? <DownloadGTUser show={ShowModalDownload}/> : <div></div>}
                    </div>

                </Col>
                <Col md={3} style={{'text-align':'right'}}>
                    <span className='userInfo'><span > {Username} &nbsp;&nbsp;</span><FontAwesomeIcon icon={faUser} size='2x'/> <a  href="logout" className="badge badge-secondary" >Logout <FontAwesomeIcon icon={faSignOutAlt}/></a></span>

                </Col>

            </Row>
        </div>


    );




}
export default SelectMenu