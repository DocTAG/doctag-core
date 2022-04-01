import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {confirmable, createConfirmation} from 'react-confirm';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {
    faLink,
    faEye,
    faProjectDiagram,
    faMicroscope,
    faListOl,
    faLanguage, faRobot,
    faLocationArrow,
    faCogs,
    faHospital,
    faFileAlt, faStickyNote
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AppContext} from "../../App";
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../Linking/linked.css';
import Select from 'react-select';
import axios from "axios";
import './selectMenu.css'
import {Col, Container, Row} from "react-bootstrap";

function DownloadGTUser(props){
    const { showDownload,action,reportString,institute,language,usecase,updateMenu,usecaseList,languageList,instituteList } = useContext(AppContext);
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [BatchList,SetBatchList] = useState([]);
    // const [UpdateMenu, SetUpdateMenu] = updateMenu;
    const [ShowModalDownload, SetShowModalDownload] = showDownload;

    const [Ins,SetIns] = useState('default')
    const [Language,SetLanguage] = language
    const [Rep,SetRep] = useState('')
    const [Use,SetUse] = useState('')
    const [PubMedPresence,SetPubMedPresence] = useState(0)
    const [Lang,SetLang] = useState('')
    const [Act,SetAct] = useState('')

    const [Anno,SetAnno] = useState('Human')
    const [Batch,SetBatch] = useState('')
    const [Format,SetFormat] = useState('')
    const [ShowNotDownload,SetShowNotDownload] = useState(false)
    const [ShowError,SetShowError] = useState(false)
    const handleClose = () => SetShowModalDownload(false);
    const [Options_usecases, Setoptions_usecases] = useState([])
    const [Options_batch, Setoptions_batch] = useState([])
    const [Options_language, Setoptions_language] = useState([])
    const [Options_institute, Setoptions_institute] = useState([])
    const [Options_actions, Setoptions_actions] = useState([])
    const [Options_reduced, Setoptions_reduced] = useState([])
    const [Options_format, Setoptions_format] = useState([])
    const [Options_format_red, Setoptions_format_red] = useState([])
    const [ShowFormat,SetShowFormat] = useState(false)
    const [BiocError, SetBiocError] = useState(false)
    var FileDownload = require('js-file-download');
    const [Options_annotation, SetOptions_annotation] = useState([])
    const [FieldsUseCasesToExtract,SetFieldsUseCasesToExtract] = useState(false)
    const [FieldsAlreadyExtracted,SetFieldsAlreadyExtracted] = useState(false)
    const [EXAPresenceConcepts,SetEXAPresenceConcepts] = useState(false)
    const [EXAPresenceLabels,SetEXAPresenceLabels] = useState(false)
    const [AutoPresence,SetAutoPresence] = useState(false)
    const [DocTAGPresence,SetDocTAGPresence] = useState(false)
    useEffect(()=>{

        if(UseCaseList.length > 0 && InstituteList.length > 0 && LanguageList.length > 0){
            // var options_usecases = []
            var options_institute = []
            var options_language = []
            // UseCaseList.map((uc)=>{
            //     options_usecases.push({value: uc, label: uc})
            // })
            InstituteList.map((inst)=>{
                if(inst !== 'PUBMED') {
                    options_institute.push({value: inst, label: inst})
                }
            })
            LanguageList.map((lang)=>{

                options_language.push({value: lang, label: lang})
            })
            if(LanguageList.length === 1){
                SetLang(Language)
            }

            Setoptions_institute(options_institute)
            Setoptions_language(options_language)
            // Setoptions_usecases(options_usecases)
            var options_actions = [{value:'labels',label:'Labels'},{value:'concepts',label:'Concepts'},{value:'mentions',label:'Passages'},{value:'concept-mention',label:'Linking'}]
            var options_actions_red = [{value:'mentions',label:'Passages'},{value:'concept-mention',label:'Linking'}]
            Setoptions_actions(options_actions)
            Setoptions_reduced(options_actions_red)
            // var options_form=[{value:'json',label:'json'},{value:'csv',label:'csv'},{value:'biocxml',label:'BioC XML'},{value:'biocjson',label:'BioC JSON'}]
            var options_form=[{value:'json',label:'json'},{value:'csv',label:'csv'}]
            var options_form_red=[{value:'json',label:'json'},{value:'csv',label:'csv'}]
            Setoptions_format(options_form)
            Setoptions_format_red(options_form_red)
        }
        // axios.get('http://0.0.0.0:8000/get_post_fields_for_auto').then(function(response){
        //     SetFieldsUseCasesToExtract(response.data['total_fields'])
        //     SetFieldsAlreadyExtracted(response.data['extract_fields'])
        //
        // }).catch(function(error){
        //     console.log('error: ',error)
        // })
        axios.get('http://0.0.0.0:8000/check_PUBMED_reports').then(function(response){
            if(response.data['count'] > 0){
                SetPubMedPresence(true)
            }
            else{
                SetPubMedPresence(false)
                SetRep('reports')
            }

        }).catch(function(error){
            console.log('error: ',error)
        })
        axios.get('http://0.0.0.0:8000/check_doctag_reports').then(function(response){
            if(response.data['count'] > 0){
                SetDocTAGPresence(true)
            }
            else{
                SetDocTAGPresence(false)

            }

        }).catch(function(error){
            console.log('error: ',error)
        })


    },[])

    useEffect(()=>{
        var options_usecases = []

        if(Rep==='pubmed'){
            SetIns('PUBMED')
            SetLang('english')
            axios.get("http://0.0.0.0:8000/pubmed_missing_auto").then(response => {
                (response.data['usecase'].map(el=>{
                    options_usecases.push({value:el,label:el})

                }));

            }).catch(function (error){console.log(error)})
        }
        else{
            UseCaseList.map(el=>{
                options_usecases.push({value:el,label:el})
            })
        }
        Setoptions_usecases(options_usecases)

    },[Rep])


    function onSave(e,token){
        // console.log('FORMAT',Format)
        // console.log('ACTION',Act)
        // console.log(Ins)
        // console.log(Lang)
        SetShowError(false)
        SetBiocError(false)
        SetShowNotDownload(false)
        SetShowFormat(false)
        if((Format === '' || Act === '' || Use === '' ) && token !== 'all' ){
            SetShowFormat(true)
        }
        else if((Format === 'biocxml' || Format === 'biocjson') && token !== 'all' && (Act === 'labels' || Act === 'concepts')){
            SetBiocError(true)
        }
        else if(Format !== '' || token === 'all') {
            axios.get('http://0.0.0.0:8000/get_gt_list',{params:{reptype:Rep,token:token,action:Act,inst:Ins,lang:Lang,use:Use,annotation_mode:Anno}})
                .then(response => {
                    if (response.data['ground_truths'] === 0) {
                        SetShowNotDownload(true)
                    } else {

                        if (token === 'conf') {


                            axios.get('http://0.0.0.0:8000/download_ground_truths', {
                                params: {
                                    institute: Ins,
                                    usec: Use,
                                    lang: Lang,
                                    action: Act,
                                    format: Format,
                                    mode: Anno,
                                    report_type: Rep,
                                    batch:Batch
                                }
                            })
                                .then(function (response) {
                                    console.log('message', response.data);

                                    if (Format === 'json' && Act !== '') {
                                        if(Act === 'concept-mention'){
                                            FileDownload(JSON.stringify(response.data), 'linking_json_ground_truth.json');

                                        }else{
                                            FileDownload(JSON.stringify(response.data), Act.toString() + '_json_ground_truth.json');

                                        }
                                        // SetShowNotDownload(false)
                                        // SetShowFormat(false)
                                        // SetShowModalDownload(false)
                                        // SetIns('')
                                        // SetUse('')
                                        // SetLang('')
                                        // SetAct('')
                                        // SetAnno('Human')
                                        // SetRep('')

                                    } else if (Format === 'csv' && Act !== '') {
                                        if(Act === 'concept-mention'){
                                            FileDownload((response.data), 'linking_csv_ground_truth.csv');
                                        }
                                        else{
                                            FileDownload((response.data), Act.toString() + '_csv_ground_truth.csv');

                                        }
                                        // SetShowNotDownload(false)
                                        // SetShowFormat(false)
                                        // SetShowModalDownload(false)
                                        // SetIns('')
                                        // SetUse('')
                                        // SetLang('')
                                        // SetAct('')
                                        // SetAnno('Human')
                                        // SetRep('')

                                    } else if (Format === 'biocxml' && Act !== '') {
                                        if(Act === 'concept-mention') {
                                            FileDownload((response.data), 'linking_bioc_ground_truth.xml');
                                        }
                                        else{
                                            FileDownload((response.data), 'mentions_bioc_ground_truth.xml');

                                        }
                                        // SetShowNotDownload(false)
                                        // SetShowFormat(false)
                                        // SetShowModalDownload(false)
                                        // SetIns('')
                                        // SetUse('')
                                        // SetLang('')
                                        // SetAct('')
                                        // SetAnno('Human')
                                        // SetRep('')


                                    } else if (Format === 'biocjson' && Act !== '') {
                                        if(Act === 'concept-mention') {
                                            FileDownload((JSON.stringify(response.data)), 'linking_bioc_ground_truth.json');
                                        }
                                        else{
                                            FileDownload((JSON.stringify(response.data)), 'mentions_bioc_ground_truth.json');

                                        }
                                        // SetShowNotDownload(false)
                                        // SetShowFormat(false)
                                        // SetShowModalDownload(false)
                                        // SetIns('')
                                        // SetUse('')
                                        // SetLang('')
                                        // SetAct('')
                                        // SetAnno('Human')
                                        // SetRep('')

                                    }

                                })
                                .catch(function (error) {

                                    console.log('error message', error);
                                });

                        }



                        else if (token === 'all') {
                            SetShowError(false)

                            axios.get('http://0.0.0.0:8000/download_ground_truths', {params: {all_gt: 'all'}})
                                .then(function (response) {
                                    console.log('message', response.data);
                                    FileDownload(JSON.stringify(response.data), 'all_json_ground_truth.json');


                                    SetShowNotDownload(false)
                                    SetShowFormat(false)
                                    SetShowModalDownload(false)
                                    SetIns('')
                                    SetUse('')
                                    SetLang('')
                                    SetAct('')
                                    SetAnno('Human')
                                    SetRep('')




                                })
                                .catch(function (error) {

                                    console.log('error message', error);
                                });

                        } else {
                            SetShowFormat(true)
                        }


                    }
                })
                .catch(function (error) {

                    console.log('error message', error);
                });


        }


    }
    function handleChangeLanguage(option){
        console.log(`Option selected:`, option.target.value);
        SetLang(option.target.value.toString())
    }

    function handleChangeUseCase(option){
        SetBatch('')
        SetUse('')
        console.log(`Option selected:`, option.target.value);
        SetUse(option.target.value.toString())
    }

    function handleChangeInstitute(option){
        console.log(`Option selected:`, option.target.value);
        SetIns(option.target.value.toString())
    }
    function handleChangeAction(option){
        console.log(`Option selected:`, option.target.value);
        SetAct(option.target.value.toString())
    }
    function handleChangeFormat(option){
        console.log(`Option selected:`, option.target.value);
        SetFormat(option.target.value.toString())
    }
    function handleChangeMode(option){
        console.log(`Option selected:`, option.target.value);
        SetAnno(option.target.value.toString())
        if(option.target.value === 'automatic'){

        }
    }
    function handleChangeBatch(option){
        console.log(`Option selected:`, option.target.value);
        SetBatch(option.target.value.toString())

    }
    function handleChangeReportType(option){
        SetAct('none')
        SetFormat('')
        SetAnno('Human')
        SetUse('')
        SetLang('')
        SetIns('')
        SetBatch('')
        console.log(`Option selected:`, option.target.value);
        SetRep(option.target.value.toString())

    }
    function onSaveKeyFiles(e,type_key){
        e.preventDefault()
        if(type_key === 'mentions'){
            axios.get('http://0.0.0.0:8000/download_key_files', {params:{type_key:'mentions'}})
                .then(function (response) {
                    console.log('message', response.data);
                    FileDownload((response.data), 'mentions.key');
                })
                .catch(function (error) {

                    console.log('error message', error);
                });
        }
        else if(type_key === 'concept-mention') {

            axios.get('http://0.0.0.0:8000/download_key_files', {params: {type_key: 'linking'}})
                .then(function (response) {
                    console.log('message', response.data);
                    FileDownload((response.data), 'linking.key');
                })
                .catch(function (error) {

                    console.log('error message', error);
                });
        }
    }
    // useEffect(()=>{
    //     if(Use !== '' && Rep !== ''){
    //         axios.get("http://0.0.0.0:8000/get_presence_robot_user", {params: {usecase:Use,report_type:Rep}})
    //             .then(response => {
    //                 if(response.data['auto_annotation_count'] > 0){
    //                     SetAutoPresence(true)
    //                 }
    //                 else{SetAutoPresence(false)}
    //             })
    //             .catch(error=>{
    //                 console.log(error)
    //             })
    //
    //     }
    //
    // },[Rep,Use])

    useEffect(()=>{
        if(Use !== ''){
            var opt = []
            var batch = []
            axios.get('http://0.0.0.0:8000/get_batch_list',{params:{usecase:Use}}).then(response=>{

                response.data['batch_list'].map(el=>{
                    console.log('value',el)
                    opt.push({value:el,label:el})
                })
                batch = response.data['batch_list']
                Setoptions_batch(opt)
                SetBatchList(response.data['batch_list'])
            })
            if(batch.length === 1){
                SetBatch(1)
            }
            var opt = []
            if(Rep === 'pubmed'){
                axios.get('http://0.0.0.0:8000/get_PUBMED_batch_list',{params:{usecase:Use}}).then(response=>{

                    response.data['batch_list'].map(el=>{
                        console.log('value',el)
                        opt.push({value:el,label:el})
                    })
                    batch = response.data['batch_list']
                    Setoptions_batch(opt)
                    SetBatchList(response.data['batch_list'])
                })
                if(batch.length === 1){
                    SetBatch(1)
                }
            }




        }
    },[Use,Rep])

    useEffect(()=>{
        console.log('batch',Options_batch)
    },[Options_batch])

    return(
        <Modal show={ShowModalDownload} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Download your ground-truths</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <Container >
                    {(ShowFormat === true) && <h6>Select a format, a topic, an annotation type, a language (if required) before confirm.</h6>}
                    {/*{ShowError === true && <div style={{'font-size':'18px','color':'red'}}><FontAwesomeIcon icon={faTimesCircle}/> Please fill all the fields <FontAwesomeIcon icon={faTimesCircle}/></div>}*/}
                    {ShowNotDownload === true && <h6>You have not any ground-truth for the required configuration. </h6>}
                    {BiocError === true && <h6>BioC is allowed only with mentions and linking. </h6>}
                    <div>
                        {PubMedPresence !== 0 && <Row>
                            <Col md={12}>

                                <div >
                                    {PubMedPresence === true && DocTAGPresence === true && <>
                                        <div>Report type</div>
                                        <Form.Control value ={Rep} className='selection' as="select" onChange={(option)=>handleChangeReportType(option)}>
                                            <option value="">Select a report type...</option>
                                            <option value='reports'>DocTAG documents</option>
                                            <option value='pubmed'>PubMed articles</option>

                                        </Form.Control>

                                        <hr/>


                                    </>}
                                    {/*<div>Report type <i>(Mandatory)</i></div>*/}
                                    {/*<Form.Control value ={Rep} className='selection' as="select" onChange={(option)=>handleChangeReportType(option)}>*/}
                                    {/*    <option value="">Select a report type...</option>*/}
                                    {/*    <option value='reports'>DocTAG documents</option>*/}
                                    {/*    {PubMedPresence === true && <option value='pubmed'>PubMed articles</option>}*/}

                                    {/*</Form.Control>*/}

                                    {/*<hr/>*/}

                                </div>
                                <div> Annotation types </div>
                                <Form.Control value={Act} className='selection' as="select" onChange={(option)=>handleChangeAction(option)} placeholder="Select an action...">
                                    <option value="">Select an annotation type...</option>
                                    {Options_actions.map((option)=>
                                        <option value={option.value}>{option.label}</option>
                                    )}
                                </Form.Control>

                                <hr/>
                                <div>File format</div>
                                <Form.Control value = {Format} className='selection' as="select" onChange={(option)=>handleChangeFormat(option)}>
                                    <option value="">Select a file format...</option>
                                    {(Act === 'labels' || Act === 'concepts') && Act !== 'none' && <>
                                        {Options_format_red.map((option)=>
                                            <option value={option.value}>{option.label}</option>)}
                                    </>}
                                    {(Act === 'mentions' || Act === 'concept-mention') && Act !== 'none' && <>
                                        {Options_format.map((option)=>
                                            <option value={option.value}>{option.label}</option>)}
                                    </>}
                                </Form.Control>
                                {/*{(Format === 'biocxml' || Format === 'biocjson') && Act === 'mentions' && <div className='selection'><a className='bioc_down' onClick={(e)=>onSaveKeyFiles(e,'mentions')}>Download BioC key file for mentions</a></div>}*/}
                                {/*{(Format === 'biocxml' || Format === 'biocjson') && Act === 'concept-mention' && <div className='selection'><a  className='bioc_down' onClick={(e)=>onSaveKeyFiles(e,'concept-mention')}>Download BioC key file for linking</a></div>}*/}

                                <hr/>

                                <div>Topic </div>
                                <Form.Control value = {Use} className='selection' as="select" onChange={(option)=>handleChangeUseCase(option)} placeholder="Select a topic...">
                                    <option value="">Select a topic...</option>
                                    {Options_usecases.map((option)=>
                                        <option value={option.value}>{option.label}</option>
                                    )}
                                </Form.Control>

                                <hr/>
                                {BatchList.length > 1 && <div>
                                    <div>Batch number </div>
                                    <Form.Control value = {Batch} className='selection' as="select" onChange={(option)=>handleChangeBatch(option)} placeholder="Select a batch number...">
                                        <option value="">Select the batch...</option>
                                        {Options_batch.map((option)=>
                                            <option value={option.value}>{option.label}</option>
                                        )}
                                        <option value='all'>All</option>
                                    </Form.Control>

                                    <hr/>
                                </div>}
                                {(Rep === 'reports' || PubMedPresence === false) && LanguageList.length > 1 && <div>
                                    <div>Language </div>
                                    <Form.Control value={Lang} className='selection' as="select"
                                                  onChange={(option) => handleChangeLanguage(option)}
                                                  placeholder="Select a language...">
                                        <option value="">Select a language...</option>
                                        {Options_language.map((option) =>
                                            <option value={option.value}>{option.label}</option>
                                        )}
                                    </Form.Control>

                                    <hr/>


                                    {/*<div><FontAwesomeIcon icon={faHospital} /> Institute <i>(Optional)</i></div>*/}
                                    {/*<Form.Control value = {Ins} className='selection' as="select" onChange={(option)=>handleChangeInstitute(option)} placeholder="Select an institute...">*/}
                                    {/*    <option value="">Select an institute...</option>*/}
                                    {/*    {Options_institute.map((option)=>*/}
                                    {/*        <option value={option.value}>{option.label}</option>*/}
                                    {/*    )}*/}
                                    {/*</Form.Control>*/}

                                    {/*<hr/>*/}


                                </div>}
                                {/*{Rep !== '' && Use !== '' && <div><div><FontAwesomeIcon icon={faRobot} /> Annotation mode <i>(Mandatory)</i></div>*/}
                                {/*    <Form.Control value = {Anno} className='selection' as="select" onChange={(option)=>handleChangeMode(option)} placeholder="Select an annotation mode...">*/}
                                {/*        <option value="">Select an annotation mode...</option>*/}
                                {/*        <option value = "Human">Manual</option>*/}
                                {/*        {AutoPresence === true && <option value = "Robot">Automatic</option>}*/}

                                {/*    </Form.Control>*/}

                                {/*    <hr/>*/}
                                {/*</div>}*/}
                            </Col>
                            {/*{LanguageList.length > 1 && <Col md={12}>*/}
                            {/*    {(Rep === 'reports' || PubMedPresence === false) && <div>*/}
                            {/*        <div><FontAwesomeIcon icon={faLanguage}/> Language <i>(Optional)</i></div>*/}
                            {/*        <Form.Control value={Lang} className='selection' as="select"*/}
                            {/*                      onChange={(option) => handleChangeLanguage(option)}*/}
                            {/*                      placeholder="Select a language...">*/}
                            {/*            <option value="">Select a language...</option>*/}
                            {/*            {Options_language.map((option) =>*/}
                            {/*                <option value={option.value}>{option.label}</option>*/}
                            {/*            )}*/}
                            {/*        </Form.Control>*/}

                            {/*        <hr/>*/}


                            {/*        /!*<div><FontAwesomeIcon icon={faHospital} /> Institute <i>(Optional)</i></div>*!/*/}
                            {/*        /!*<Form.Control value = {Ins} className='selection' as="select" onChange={(option)=>handleChangeInstitute(option)} placeholder="Select an institute...">*!/*/}
                            {/*        /!*    <option value="">Select an institute...</option>*!/*/}
                            {/*        /!*    {Options_institute.map((option)=>*!/*/}
                            {/*        /!*        <option value={option.value}>{option.label}</option>*!/*/}
                            {/*        /!*    )}*!/*/}
                            {/*        /!*</Form.Control>*!/*/}

                            {/*        /!*<hr/>*!/*/}


                            {/*    </div>}*/}

                            {/*</Col>}*/}
                        </Row>}




                    </div>


                </Container>


            </Modal.Body>

            <Modal.Footer>

                <Button onClick={(e)=>onSave(e,'all')} variant="warning" >
                    Download All (JSON)
                </Button>

                <Button  onClick={(e)=>onSave(e,'conf')} variant="primary" >
                    Download
                </Button>
            </Modal.Footer>





        </Modal>


    );




}

export default (DownloadGTUser);