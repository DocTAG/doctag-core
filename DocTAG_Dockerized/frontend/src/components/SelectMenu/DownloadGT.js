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
    faTimesCircle,
    faLanguage,faRobot,
    faLocationArrow,
    faCogs,
    faHospital,
    faFileAlt
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AppContext} from "../../App";
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../Linking/linked.css';
import Select from 'react-select';
import axios from "axios";
import './selectMenu.css'

function DownloadGT(props){
    const { showDownload,action,reportString,institute,language,usecase,updateMenu,usecaseList,languageList,instituteList } = useContext(AppContext);
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    // const [UpdateMenu, SetUpdateMenu] = updateMenu;
    const [ShowModalDownload, SetShowModalDownload] = showDownload;
    // const [Institute, SetInstitute] = institute;
    // const [Language, SetLanguage] = language;
    // const [UseCase, SetUseCase] = usecase;
    // const [Action,SetAction] = action;
    // const [ShowErrorReports,SetShowErrorReports] = useState(false)
    // const [repString,SetRepString] = reportString;
    const [Ins,SetIns] = useState('')
    const [Use,SetUse] = useState('')
    const [Lang,SetLang] = useState('')
    const [Act,SetAct] = useState('')
    const [Anno,SetAnno] = useState('')
    const [Format,SetFormat] = useState('')
    const [ShowNotDownload,SetShowNotDownload] = useState(false)
    const [ShowError,SetShowError] = useState(false)
    const handleClose = () => SetShowModalDownload(false);
    const [Options_usecases, Setoptions_usecases] = useState([])
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


    useEffect(()=>{

        if(UseCaseList.length > 0 && InstituteList.length > 0 && LanguageList.length > 0){
            var options_usecases = []
            var options_institute = []
            var options_language = []
            UseCaseList.map((uc)=>{
                options_usecases.push({value: uc, label: uc})
            })
            InstituteList.map((inst)=>{
                options_institute.push({value: inst, label: inst})
            })
            LanguageList.map((lang)=>{

                options_language.push({value: lang, label: lang})
            })
            // options_usecases.push({value: 'Lung', label: 'Lung'})
            // options_language.push({value: 'Italian', label: 'English'})
            Setoptions_institute(options_institute)
            Setoptions_language(options_language)
            Setoptions_usecases(options_usecases)
            var options_actions = [{value:'labels',label:'Labels'},{value:'concepts',label:'Concepts'},{value:'mentions',label:'Mentions'},{value:'concept-mention',label:'Linking'}]
            var options_actions_red = [{value:'mentions',label:'Mentions'},{value:'concept-mention',label:'Linking'}]
            Setoptions_actions(options_actions)
            Setoptions_reduced(options_actions_red)
            var options_form=[{value:'json',label:'json'},{value:'csv',label:'csv'},{value:'biocxml',label:'BioC XML'},{value:'biocjson',label:'BioC JSON'}]
            var options_form_red=[{value:'json',label:'json'},{value:'csv',label:'csv'}]
            Setoptions_format(options_form)
            Setoptions_format_red(options_form_red)
        }
        axios.get('get_post_fields_for_auto').then(function(response){
            SetFieldsUseCasesToExtract(response.data['total_fields'])
            SetFieldsAlreadyExtracted(response.data['extract_fields'])

        }).catch(function(error){
            console.log('error: ',error)
        })

    },[])


    function onSave(e,token){
        console.log('FORMAT',Format)
        console.log('ACTION',Act)
        // console.log(Ins)
        // console.log(Lang)
        SetShowError(false)
        SetBiocError(false)
        SetShowNotDownload(false)
        SetShowFormat(false)
        if((Format === '' || Act === '') && token !== 'all' ){
            SetShowFormat(true)
        }
        else if((Format === 'biocxml' || Format === 'biocjson') && token !== 'all' && (Act === 'labels' || Act === 'concepts')){
            SetBiocError(true)
        }
        else if(Format !== '' || token === 'all') {
            axios.get('get_gt_list',{params:{token:token,action:Act,inst:Ins,lang:Lang,use:Use}})
                .then(response => {
                    if (response.data['ground_truths'] === 0) {
                        SetShowNotDownload(true)
                    } else {

                        if (token === 'conf') {


                            axios.get('download_ground_truths', {
                                params: {
                                    institute: Ins,
                                    usec: Use,
                                    lang: Lang,
                                    action: Act,
                                    format: Format
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
                                        SetShowNotDownload(false)
                                        SetShowFormat(false)
                                        SetShowModalDownload(false)
                                        SetIns('')
                                        SetUse('')
                                        SetLang('')
                                        SetAct('')

                                    } else if (Format === 'csv' && Act !== '') {
                                        if(Act === 'concept-mention'){
                                            FileDownload((response.data), 'linking_csv_ground_truth.csv');
                                        }
                                        else{
                                            FileDownload((response.data), Act.toString() + '_csv_ground_truth.csv');

                                        }
                                        SetShowNotDownload(false)
                                        SetShowFormat(false)
                                        SetShowModalDownload(false)
                                        SetIns('')
                                        SetUse('')
                                        SetLang('')
                                        SetAct('')

                                    } else if (Format === 'biocxml' && Act !== '') {
                                        if(Act === 'concept-mention') {
                                            FileDownload((response.data), 'linking_bioc_ground_truth.xml');
                                        }
                                        else{
                                            FileDownload((response.data), 'mentions_bioc_ground_truth.xml');

                                        }
                                        SetShowNotDownload(false)
                                        SetShowFormat(false)
                                        SetShowModalDownload(false)
                                        SetIns('')
                                        SetUse('')
                                        SetLang('')
                                        SetAct('')


                                    } else if (Format === 'biocjson' && Act !== '') {
                                        if(Act === 'concept-mention') {
                                            FileDownload((JSON.stringify(response.data)), 'linking_bioc_ground_truth.json');
                                        }
                                        else{
                                            FileDownload((JSON.stringify(response.data)), 'mentions_bioc_ground_truth.json');

                                        }
                                        SetShowNotDownload(false)
                                        SetShowFormat(false)
                                        SetShowModalDownload(false)
                                        SetIns('')
                                        SetUse('')
                                        SetLang('')
                                        SetAct('')

                                    }

                                })
                                .catch(function (error) {

                                    console.log('error message', error);
                                });

                        }



                        else if (token === 'all') {
                            SetShowError(false)

                            axios.get('download_ground_truths', {params: {all_gt: 'all'}})
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
        console.log(`Option selected:`, option.value);
        SetAnno(option.value.toString())
        if(option.value === 'automatic'){

        }
    }
    function onSaveKeyFiles(e,type_key){
        e.preventDefault()
        if(type_key === 'mentions'){
            axios.get('download_key_files', {params:{type_key:'mentions'}})
                .then(function (response) {
                    console.log('message', response.data);
                    FileDownload((response.data), 'mentions.key');
                })
                .catch(function (error) {

                    console.log('error message', error);
                });
        }
        else if(type_key === 'concept-mention') {

            axios.get('download_key_files', {params: {type_key: 'linking'}})
                .then(function (response) {
                    console.log('message', response.data);
                    FileDownload((response.data), 'linking.key');
                })
                .catch(function (error) {

                    console.log('error message', error);
                });
        }
    }
    useEffect(()=>{
        if(Use !== ''){
            if(FieldsAlreadyExtracted[Use].length > 0){
                var arr = []
                arr.push({value:'Manual',label:'Manual'})
                arr.push({value:'Automatic',label:'Automatic'})
                SetOptions_annotation(arr)

            }
            else{
                var arr = []
                arr.push({value:'Manual',label:'Manual'})
                SetOptions_annotation(arr)
            }
        }

    },[Use])



    return(
        <Modal size = 'md' show={ShowModalDownload} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Download your ground-truths</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(ShowFormat === true) && <h6>Select a format and an action before confirm.</h6>}
                {/*{ShowError === true && <div style={{'font-size':'18px','color':'red'}}><FontAwesomeIcon icon={faTimesCircle}/> Please fill all the fields <FontAwesomeIcon icon={faTimesCircle}/></div>}*/}
                {ShowNotDownload === true && <h6>You have not any ground-truth for the required configuration. </h6>}
                {BiocError === true && <h6>BioC is allowed only with mentions and linking. </h6>}

                <div>


                    <div>
                        <div><FontAwesomeIcon icon={faFileAlt} /> File format <i>(Mandatory)</i></div>
                        <Form.Control className='selection' size="sm" as="select" onChange={(option)=>handleChangeFormat(option)}>
                            <option value="">Choose a file format...</option>
                            {(Act === 'labels' || Act === 'concepts') && Act !== 'none' && <>
                            {Options_format_red.map((option)=>
                                <option value={option.value}>{option.label}</option>)}
                            </>}
                            {(Act === 'mentions' || Act === 'concept-mention') && Act !== 'none' && <>
                                {Options_format.map((option)=>
                                    <option value={option.value}>{option.label}</option>)}
                            </>}

                        )}
                        </Form.Control>


                        <hr/>

                            <div><FontAwesomeIcon icon={faProjectDiagram} /> Annotation types <i>(Mandatory)</i></div>
                            <Form.Control className='selection' size="sm" as="select" onChange={(option)=>handleChangeAction(option)} placeholder="Select an action...">
                                <option value="">Choose an action...</option>
                                {Options_actions.map((option)=>
                                    <option value={option.value}>{option.label}</option>
                                )}
                            </Form.Control>

                        {(Format === 'biocxml' || Format === 'biocjson') && Act === 'mentions' && <div className='selection'><a className='bioc_down' onClick={(e)=>onSaveKeyFiles(e,'mentions')}>Download BioC key file for mentions</a></div>}
                        {(Format === 'biocxml' || Format === 'biocjson') && Act === 'concept-mention' && <div className='selection'><a  className='bioc_down' onClick={(e)=>onSaveKeyFiles(e,'concept-mention')}>Download BioC key file for linking</a></div>}

                        <hr/>
                        <div><FontAwesomeIcon icon={faLanguage}  /> Language <i>(Optional)</i></div>
                        <Form.Control className='selection' size="sm" as="select" onChange={(option)=>handleChangeLanguage(option)} placeholder="Select a language...">
                            <option value="">Choose a language...</option>
                            {Options_language.map((option)=>
                                <option value={option.value}>{option.label}</option>
                            )}
                        </Form.Control>

                        <hr/>
                        <div><FontAwesomeIcon icon={faMicroscope}  /> Use Case <i>(Optional)</i></div>
                        <Form.Control className='selection' size="sm" as="select" onChange={(option)=>handleChangeUseCase(option)} placeholder="Select a use case...">
                            <option value="">Choose a use case...</option>
                            {Options_usecases.map((option)=>
                                <option value={option.value}>{option.label}</option>
                            )}
                        </Form.Control>

                        <hr/>

                        <div><FontAwesomeIcon icon={faHospital} /> Institute <i>(Optional)</i></div>
                        <Form.Control className='selection' size="sm" as="select" onChange={(option)=>handleChangeInstitute(option)} placeholder="Select an institute...">
                            <option value="">Choose an institute...</option>
                            {Options_institute.map((option)=>
                                <option value={option.value}>{option.label}</option>
                            )}
                        </Form.Control>

                        <hr/>
                        {Use !== '' && Options_annotation.length>0 &&<div><div><FontAwesomeIcon icon={faRobot} /> Mode <i>(Optional)</i></div>
                        <Form.Control className='selection' size="sm" as="select" onChange={(option)=>handleChangeMode(option)} placeholder="Select an institute...">
                            <option value="">Choose an annotation mode...</option>
                            {Options_annotation.map((option)=>
                                <option value={option.value}>{option.label}</option>
                            )}
                        </Form.Control></div>}

                    </div>
                </div>

            </Modal.Body>

            <Modal.Footer>
                <Button onClick={(e)=>onSave(e,'pubmed')} variant="warning" >
                    Download PubMed Annotations
                </Button>
                <Button onClick={(e)=>onSave(e,'robot')} variant="warning" >
                    Download algorithm's Annotations
                </Button>
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

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
// export default confirmable(LinkDialog);
export default (DownloadGT);