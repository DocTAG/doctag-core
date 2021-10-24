import '../../App.css';
import {AppContext} from '../../App';
import React, {useState, useEffect, useContext, useRef,createContext} from "react";
import '../SideComponents/compStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';

import {Container,Row,Col} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import './conf.css';
import '../General/first_row.css';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SelectMenu from "../SelectMenu/SelectMenu";

import SideBar from "../General/SideBar";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import {faArrowLeft, faDownload, faTimes, faRobot} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import {Link,Redirect} from "react-router-dom";
import Select from "react-select";
import {ConfigureContext} from "./Configure";

function UpdateConfiguration() {


    const { admin,username,fields,fieldsToAnn,report_type,usecaseList,reports,languageList,instituteList } = useContext(AppContext);
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [Aux,SetAux] = useState(false)
    const [Username,SetUsername] = username;
    const [Admin,SetAdmin] = admin;
    const [LoadExaConcepts,SetLoadExaConcepts] = useState(false)
    const [LoadExaLabels,SetLoadExaLabels] = useState(false)
    const [CommitPossible,SetCommitPossible] = useState(true)
    const [showAutoSection,SetShowAutoSection] = useState(false)
    const [showAddSection,SetShowAddSection] = useState(false)
    const [Fields,SetFields] = fields;
    const [FieldsToAnn,SetFieldsToAnn] = fieldsToAnn;
    const [ShowDeletePubMed,SetShowDeletePubMed] = useState(false)
    const [SelectedFields,SetSelectedFields] = useState({})
    const [NoSelected,SetNoSelected] = useState(false)
    const [ShowIrreversibleModal,SetShowIrreversibleModal] = useState(false)
    const [ReportsMissingAuto, SetReportsMissingAuto] = useState({})
    const [ShowLabelsExamples,SetShowLabelsExamples] = useState(false)
    const [ShowReportsExamples,SetShowReportsExamples] = useState(false)
    const [ShowConceptsExamples,SetShowConceptsExamples] = useState(false)
    const [ShowPubmedExamples,SetShowPubmedExamples] = useState(false)
    const [UpdateConfirm,SetUpdateConfirm] = useState(true)
    const [Warning,SetWarning] = useState('')
    const [ShowExaConcepts,SetShowExaConcepts] = useState(true)
    const [ShowExaLabels,SetShowExaLabels] = useState(true)
    const [UsesMissingExaConcepts,SetUsesMissingExaConcepts] = useState([])
    const [UsesMissingExaLabels,SetUsesMissingExaLabels] = useState([])
    const [UsesPresentExaLabels,SetUsesPresentExaLabels] = useState([])
    const [UsesPresentExaConcepts,SetUsesPresentExaConcepts] = useState([])
    const [UsesInserted,SetUsesInserted] = useState([])
    const [PubMedUsesInserted,SetPubMedUsesInserted] = useState([])
    const [ConceptsUsesInserted,SetConceptsUsesInserted] = useState([]) //Needed for exalabels and exaconcepts
    const [LabelsUsesInserted,SetLabelsUsesInserted] = useState([]) //Needed for exalabels and exaconcepts
    const [ShowDeleteReports,SetShowDeleteReports] = useState(false)
    const [ShowDeleteLabels,SetShowDeleteLabels] = useState(false)
    const [ShowDeleteConcepts,SetShowDeleteConcepts] = useState(false)
    const [ShowDeleteTopic,SetShowDeleteTopic] = useState(false)
    const [ShowDeleteRuns,SetShowDeleteRuns] = useState(false)
    const [ShowModalConfirm,SetShowModalConfirm] = useState(false)
    const [ReportType,SetReportType] = useState('reports')
    // const [ConfirmExtractFields,SetConfirmExtractFields] = useState(false)
    const [Checked,SetChecked] = useState(0)
    const [Batch,SetBatch] = useState('')
    const [Added,SetAdded] = useState(false)
    const [Message, SetMessage] = useState('')
    const [ErrorMessage, SetErrorMessage] = useState('')
    const [LoadingResponse, SetLoadingResponse] = useState(false)
    const [Missing,SetMissing] = useState('')
    const [BackClick, SetBackClick] = useState(false)
    const [InBatch, SetInBatch] = useState(true)
    const [AgentPresence, setAgentPresence] = useState(0)
    const [UsesUpdate, SetUsesUpdate] = useState([])
    const [PubMedUsesUpdate, SetPubMedUsesUpdate] = useState([])
    const [Selected,SetSelected] = useState('reports')
    const [Keys,SetKeys] = useState([])
    const [KeysUpdate,SetKeysUpdate] = useState([])
    const [FieldsUseCasesToExtract,SetFieldsUseCasesToExtract] = useState(false)
    const [FieldsAlreadyExtracted,SetFieldsAlreadyExtracted] = useState(false)
    const [AutoOpt, SetAutoOpt] = useState('')
    const [OptionsUsecasesAuto, setOptionsUsecasesAuto] = useState([])
    var FileDownload = require('js-file-download');
    const [showModalAuto, setShowModalAuto] = useState(false)
    const [InputChange,SetInputChange] = useState([])
    const [UpdateFields,SetUpdateFields] = useState(false)
    const [LoadingAuto, SetLoadingAuto] = useState(false)
    const [ErrorAuto,SetErrorAuto] = useState(0)
    const [PubMedMissingAuto,SetPubMedMissingAuto] = useState({})
    const [ShowPubMedModal,SetShowPubMedModal] = useState(false)
    const optref = useRef('');
    const [OptionsBatches,SetOptionsBatches] = useState(false)
    const [PubMedAutoOpt,SetPubMedAutoOpt] = useState('')
    const [PubMedBatch,SetPubMedBatch] = useState('')
    const [PubMedOptionsBatches,SetPubMedOptionsBatches] = useState([])
    const [PubMedOptionsUsecasesAuto,SetPubMedOptionsUsecasesAuto] = useState([])

    useEffect(()=>{
        window.scrollTo(0, 0)
        // axios.get('http://0.0.0.0:8000/get_uses_missing_exa').then(response=>{
        //     SetUsesMissingExaConcepts(response.data['concepts_missing']);
        //     SetUsesPresentExaConcepts(response.data['concepts_present']);
        //     SetUsesMissingExaLabels(response.data['labels_missing'])
        //     SetUsesPresentExaLabels(response.data['labels_present'])
        // })
        axios.get("http://0.0.0.0:8000/get_fields",{params:{all:'all'}}).then(response => {SetFields(response.data['fields']);SetFieldsToAnn(response.data['fields_to_ann']);})
        SetMissing('')
        SetWarning('')


        axios.get("http://0.0.0.0:8000/get_usecase_inst_lang").then(response => {
            SetUseCaseList(response.data['usecase']);
            SetLanguageList(response.data['language']);
            SetInstituteList(response.data['institute']);

        })

        // axios.get("http://0.0.0.0:8000/pubmed_missing_auto").then(response => {
        //     SetPubMedMissingAuto(response.data);
        //
        //     SetPubMedUsesInserted(response.data['usecase'])
        //     var arr = {}
        //     Object.keys(response.data).map(key=>{
        //         arr[key] = []
        //     })
        //     SetCommitPossible(true)
        // }).catch(function (error){console.log(error)})

    },[])

    useEffect(()=>{
        // axios.get("http://0.0.0.0:8000/pubmed_missing_auto").then(response => {
        //     SetPubMedMissingAuto(response.data);
        //     SetPubMedUsesInserted(response.data['usecase'])
        //     var arr = {}
        //     Object.keys(response.data).map(key=>{
        //         arr[key] = []
        //     })
        //     SetCommitPossible(true)
        // }).catch(function (error){console.log(error)})

        // axios.get("http://0.0.0.0:8000/report_missing_auto").then(response => {
        //     SetReportsMissingAuto(response.data);
        //     setOptionsUsecasesAuto(Object.keys(response.data))
        //     var arr = {}
        //     Object.keys(response.data).map(key=>{
        //         arr[key] = []
        //     })
        //     SetCommitPossible(true)
        //     SetSelectedFields(arr)
        // }).catch(function (error){console.log(error)})
        //
        // axios.get("http://0.0.0.0:8000/pubmed_missing_auto").then(response => {
        //     SetPubMedMissingAuto(response.data);
        //     SetPubMedUsesInserted(response.data['usecase'])
        //     var arr = {}
        //     Object.keys(response.data).map(key=>{
        //         if(['usecase','tot','annotated'].indexOf(key) === -1){
        //             arr[key] = []
        //
        //         }
        //     })
        //     SetCommitPossible(true)
        //     SetSelectedFields(arr)
        // }).catch(function (error){console.log(error)})


        // axios.get('http://0.0.0.0:8000/get_post_fields_for_auto').then(function(response){
        //     SetFieldsUseCasesToExtract(response.data['total_fields'])
        //     SetFieldsAlreadyExtracted(response.data['extract_fields'])
        //
        // }).catch(function(error){
        //     console.log('error: ',error)
        // })

        SetUpdateFields(false)
        // SetCommitPossible(true)
    },[UpdateFields])

    // },[UpdateFields,AutoOpt])


    function handleCloseModal(){
        SetShowModalConfirm(false)
    }
    useEffect(()=>{
        if(Message !== '' || ErrorMessage !== '') {
            window.scrollTo(0, 0)
        }
    },[ErrorMessage,Message])



    function onCheck(e){
        e.preventDefault()
        var input = ''
        var input_1 = ''
        var input_2 = ''
        SetChecked(0)
        SetUpdateConfirm(true)
        var formData = new FormData();
        input = document.getElementById('ControlSelect1');
        console.log('test input',input.value)
        var type = input.value
        formData.append('type', input.value);
        if(type === 'labels'){
            if(ShowExaLabels === false){
                input = document.getElementById('exampleFormControlFile0');
                for (let ind=0; ind<input.files.length; ind++) {
                    var name = 'labels' + ind.toString()
                    formData.append(name, input.files[ind]);

                }
            }

            if(LoadExaLabels){
                formData.append('exa_labels', UsesMissingExaLabels);
            }

        }

        if(type === 'reports'){
            input = document.getElementById('exampleFormControlFile1');
            for (let ind=0; ind<input.files.length; ind++) {
                var name = 'reports' + ind.toString()
                formData.append(name, input.files[ind]);
            }
            if(KeysUpdate.length > 0){
                var displayed_update = []
                var annotate_update = []
                var all_update = []
                KeysUpdate.map(key=>{
                    all_update.push(key)

                    var radios = document.getElementsByName(key);
                    for(let i = 0; i < radios.length; i++ ) {

                        if( radios[i].checked ) {
                            // console.log('value',radios[i].value)

                            if(radios[i].value === 'display'){
                                displayed_update.push(key)
                            }
                            else if(radios[i].value === 'both'){
                                annotate_update.push(key)

                            }


                        }
                    }

                })

                formData.append('json_disp_update', displayed_update);
                formData.append('json_ann_update', annotate_update);
                formData.append('json_all_update', all_update);
            }
        }
        if(type === 'concepts'){
            if(ShowExaConcepts === false){
                input = document.getElementById('exampleFormControlFile2');
                for (let ind=0; ind<input.files.length; ind++) {
                    var name = 'concepts' + ind.toString()
                    formData.append(name, input.files[ind]);
                }
            }
            if(LoadExaConcepts){
                formData.append('exa_concepts', UsesMissingExaConcepts);
            }
        }
        if(type === 'pubmed'){
            input = document.getElementById('exampleFormControlFile5');
            for (let ind=0; ind<input.files.length; ind++) {
                var name = 'pubmed' + ind.toString()
                formData.append(name, input.files[ind]);
            }


        }

        else if(type === 'json_fields'){
            var displayed = []
            var annotate = []
            Keys.map(key=>{

                var radios = document.getElementsByName(key);
                for(let i = 0; i < radios.length; i++ ) {
                    if( radios[i].checked ) {
                        // console.log('value',radios[i].value)

                        if(radios[i].value === 'display'){
                            displayed.push(key)
                        }
                        else if(radios[i].value === 'both'){
                            annotate.push(key)

                        }
                    }
                }

            })
            // console.log('disp',displayed)
            // console.log('disp',annotate)
            formData.append('json_disp', displayed);
            formData.append('json_ann', annotate);

        }

        // console.log('test input',input.files[0])
        // var file = input.files[0]
        // formData.append('file', file);


        axios({
            method: "post",
            url: "http://0.0.0.0:8000/check_files_for_update",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })

            .then(function (response) {
                // console.log('message', response.data);
                if(response.data['message'] === ''){
                    // console.log(response.data)
                    SetChecked(true)
                    SetUpdateConfirm(false)

                }
                else if(response.data['message'].includes('WARNING')){
                    var error = response.data['message']
                    SetChecked(true)
                    SetUpdateConfirm(false)
                    SetWarning(error)
                }

                else{
                    console.log('error message', response.data['message']);
                    var error = response.data['message']
                    SetChecked(error)
                    SetAdded(false)
                    if(type === 'concepts') {
                        if(LoadExaConcepts === false){
                            input = document.getElementById('exampleFormControlFile2');
                            if (input.files[0] !== undefined && input.files[0] !== null) {
                                input.value = null
                                SetShowDeleteConcepts(false)
                            }
                        }

                    }
                    else if(type === 'labels'){
                        if(LoadExaLabels === false){
                            input = document.getElementById('exampleFormControlFile0');
                            if (input.files[0] !== undefined && input.files[0] !== null) {
                                input.value = null
                                SetShowDeleteLabels(false)
                            }
                        }

                    }
                    else if(type === 'reports'){
                        input = document.getElementById('exampleFormControlFile1');
                        // console.log(input.files[0])
                        if (input.files[0] !== undefined && input.files[0] !== null && response.data['message'].includes('REPORT FIELDS') === false) {
                            input.value = null
                            SetShowDeleteReports(false)
                            SetKeysUpdate([])

                        }
                    }

                }


            })
            .catch(function (error) {
                console.log('error message', error);
            });



    }


    function onAdd(e){
        e.preventDefault()
        window.scroll(0,0)
        SetUpdateFields(true)

        console.log('updateconfirm',UpdateConfirm)
        if(UpdateConfirm === true){
            SetShowModalConfirm(true)
        }
        else{
            SetLoadingResponse(true)
            var input = ''

            var formData = new FormData();
            input = document.getElementById('ControlSelect1');
            console.log('test input',input.value)
            var type = input.value
            formData.append('type', input.value);
            if(InBatch === true){
                formData.append('batch','batch')

            }
            else{
                formData.append('batch','no batch')

            }
            if(LoadExaConcepts){
                formData.append('exa_concepts', UsesMissingExaConcepts);
            }
            if(LoadExaLabels){
                formData.append('exa_labels', UsesMissingExaLabels);
            }
            if(type === 'labels'){
                if(LoadExaLabels === false){
                    input = document.getElementById('exampleFormControlFile0');
                    for (let ind=0; ind<input.files.length; ind++) {
                        var name = 'labels' + ind.toString()
                        formData.append(name, input.files[ind]);

                    }
                }

            }
            if(type === 'tfidf'){
                input = document.getElementById('tfidf_form');
                formData.append('tfidf', input.value);


            }
            if(type === 'concepts'){
                if(LoadExaConcepts === false){
                    input = document.getElementById('exampleFormControlFile2');
                    for (let ind=0; ind<input.files.length; ind++) {
                        var name = 'concepts' + ind.toString()
                        formData.append(name, input.files[ind]);
                    }
                }

            }




            if(type === 'reports' && KeysUpdate.length > 0){
                var displayed_update = []
                var annotate_update = []
                var all_update = []
                KeysUpdate.map(key=>{
                    all_update.push(key)
                    var radios = document.getElementsByName(key);
                    for(let i = 0; i < radios.length; i++ ) {
                        if( radios[i].checked ) {
                            // console.log('value',radios[i].value)

                            if(radios[i].value === 'display'){
                                displayed_update.push(key)
                            }
                            else if(radios[i].value === 'both'){
                                annotate_update.push(key)

                            }

                        }
                    }

                })
                // console.log('disp',displayed_update)
                // console.log('disp',annotate_update)
                formData.append('json_disp_update', displayed_update);
                formData.append('json_ann_update', annotate_update);
                formData.append('json_all_update', all_update);


            }
            if(type === 'reports'){
                input = document.getElementById('exampleFormControlFile1');
                for (let ind=0; ind<input.files.length; ind++) {
                    var name = 'reports' + ind.toString()
                    formData.append(name, input.files[ind]);
                }
            }
            if(type === 'pubmed'){
                input = document.getElementById('exampleFormControlFile5');
                for (let ind=0; ind<input.files.length; ind++) {
                    var name = 'pubmed' + ind.toString()
                    formData.append(name, input.files[ind]);
                }
            }
            if(type === 'json_fields' ){
                var displayed = []
                var annotate = []
                Keys.map(key=>{

                    var radios = document.getElementsByName(key);
                    for(let i = 0; i < radios.length; i++ ) {
                        if( radios[i].checked ) {
                            // console.log('value',radios[i].value)

                            if(radios[i].value === 'display'){
                                displayed.push(key)
                            }
                            else if(radios[i].value === 'both'){
                                annotate.push(key)

                            }
                        }
                    }

                })
                // console.log('disp',displayed)
                // console.log('disp',annotate)
                formData.append('json_disp', displayed);
                formData.append('json_ann', annotate);

            }
            axios({
                method: "post",
                url: "http://0.0.0.0:8000/update_db",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    // console.log(response)
                    SetLoadingResponse(false)
                    // axios.get("http://0.0.0.0:8000/report_missing_auto").then(response => {
                    //     SetReportsMissingAuto(response.data);
                    //
                    // }).catch(function (error){console.log(error)})
                    // axios.get("http://0.0.0.0:8000/pubmed_missing_auto").then(response => {
                    //     SetPubMedMissingAuto(response.data);
                    //
                    // }).catch(function (error){console.log(error)})

                    if(response.data['message'] !== undefined){
                        SetLoadingResponse(false)
                        SetMessage('DocTAG has been correctly updated.')

                    }
                    else if(response.data['error'] !== undefined){
                        SetLoadingResponse(false)
                        if(type === 'pubmed'){
                            var message = response.data['error']
                        }
                        else{
                            var message = 'An error occurred: '+response.data['error'] + ' If you checked the files and they were correct, The problem might be related to the database, check that all the mandatory fields are correctly inserted. Check that all the use cases and semantic areas are correctly written in all the files which include them.'

                        }
                        SetErrorMessage(message)

                    }

                })
                .catch(function (error) {
                    console.log(error);
                    SetLoadingResponse(false)

                });
        }

    }

    function handleSelect(e){
        e.preventDefault()
        SetWarning('')
        SetInBatch(false)
        SetUpdateConfirm(true)
        SetKeysUpdate([])
        SetChecked(0)
        SetShowDeleteReports(false)
        SetShowDeleteConcepts(false)
        SetShowDeleteLabels(false)
        var input = document.getElementById('ControlSelect1');
        // console.log('test input',input.value)
        var type = input.value
        SetSelected(type)
        if(type === 'json_fields'){
            axios.get('http://0.0.0.0:8000/get_keys').then(response=>SetKeys(response.data['keys']))
        }
    }


    function showKeys_setUseCase(){
        var formData = new FormData()
        if(Selected === 'reports'){
            var input = document.getElementById('exampleFormControlFile1');
            // console.log('current',input)
            for (let ind=0; ind<input.files.length; ind++) {
                var name = 'reports' + ind.toString()
                formData.append(name, input.files[ind]);

            }
            axios({
                method: "post",
                url: "http://0.0.0.0:8000/get_keys_from_csv_update",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    // console.log(response)
                    SetKeysUpdate(response.data['keys']);
                    SetUsesUpdate(response.data['uses']);


                })
                .catch(function (error) {
                    console.log('error message', error);
                });

        }
        else if(Selected === 'pubmed'){
            var input = document.getElementById('exampleFormControlFile5');
            // console.log('current',input)
            for (let ind=0; ind<input.files.length; ind++) {
                var name = 'pubmed' + ind.toString()
                formData.append(name, input.files[ind]);


            }
            axios({
                method: "post",
                url: "http://0.0.0.0:8000/get_keys_from_csv_update",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    console.log('resp',response)
                    SetPubMedUsesUpdate(response.data['uses']);


                })
                .catch(function (error) {
                    console.log('error message', error);
                });

        }
        else if(Selected === 'concepts'){
            var input = document.getElementById('exampleFormControlFile2');
            // console.log('current',input)
            for (let ind=0; ind<input.files.length; ind++) {
                var name = 'concepts' + ind.toString()
                formData.append(name, input.files[ind]);

            }

        }
        else if(Selected === 'labels'){
            var input = document.getElementById('exampleFormControlFile0');
            // console.log('current',input)
            for (let ind=0; ind<input.files.length; ind++) {
                var name = 'labels' + ind.toString()
                formData.append(name, input.files[ind]);

            }

        }

        axios({
            method: "post",
            url: "http://0.0.0.0:8000/get_keys_and_uses_from_csv",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                // console.log(response)
                SetUsesInserted(response.data['usecases'])

            })
            .catch(function (error) {
                console.log('error message', error);
            });




    }

    function onSaveExample(e,token){
        e.preventDefault()
        axios.get('http://0.0.0.0:8000/download_examples', {params:{token:token}})
            .then(function (response) {
                if(token === 'reports'){
                    FileDownload((response.data), 'reports_example.csv');
                }
                else if(token === 'concepts'){
                    FileDownload((response.data), 'concepts_example.csv');
                }
                else if(token === 'labels'){
                    FileDownload((response.data), 'labels_example.csv');
                }
                else if(token === 'pubmed'){
                    FileDownload((response.data), 'pubmed_example.csv');
                }


            })
            .catch(function (error) {
                console.log('error message', error);
            });

    }
    function deleteInput(e,token){
        e.preventDefault()
        SetAdded(false)
        SetUpdateConfirm(true)
        SetChecked(0)
        SetWarning('')
        SetKeysUpdate([])
        var input = ''
        if(token === 'concepts'){
            input = document.getElementById('exampleFormControlFile2');
            // console.log('current',input)
            if(ShowExaConcepts === false){
                if(input.files[0] !== undefined && input.files[0] !== null){
                    input.value = null
                    SetShowExaConcepts(true)
                    SetShowDeleteConcepts(false)
                    // console.log('current',input)

                }
            }


        }

        else if(token === 'labels'){
            input = document.getElementById('exampleFormControlFile0');
            // console.log('current',input)
            if(ShowExaLabels===false){
                if(input.files[0] !== undefined && input.files[0] !== null){
                    input.value = null
                    SetShowExaLabels(true)
                    SetShowDeleteLabels(false)
                    // console.log('current',input)

                }
            }


        }
        else if(token === 'reports'){
            input = document.getElementById('exampleFormControlFile1');
            // console.log('current',input)
            SetUsesUpdate([])
            if(input.files[0] !== undefined && input.files[0] !== null){
                input.value = null
                // console.log('current',input)
                SetShowDeleteReports(false)


            }

        }
        else if(token === 'pubmed'){
            input = document.getElementById('exampleFormControlFile5');
            // console.log('current',input)

            if(input.files[0] !== undefined && input.files[0] !== null){
                input.value = null
                // console.log('current',input)
                SetShowDeletePubMed(false)


            }

        }



    }
    useEffect(()=>{
        console.log('pubmedupdate',PubMedUsesUpdate)
    },[PubMedUsesUpdate])

    function showDelete(event,token){
        event.preventDefault()
        SetChecked(0)
        SetWarning('')
        if(token === 'reports'){
            var input = document.getElementById('exampleFormControlFile1');

            if(input.files[0] !== undefined && input.files[0] !== null){
                SetShowDeleteReports(true)

            }
        }
        else if(token === 'pubmed'){
            var input = document.getElementById('exampleFormControlFile5');

            if(input.files[0] !== undefined && input.files[0] !== null){
                SetShowDeletePubMed(true)

            }
        }
        else if(token === 'concepts'){
            if(ShowExaConcepts === false){
                var input = document.getElementById('exampleFormControlFile2');

                if(input.files[0] !== undefined && input.files[0] !== null){
                    SetShowDeleteConcepts(true)

                }
            }


        }
        else if(token === 'labels'){
            if(ShowExaLabels === false){
                var input = document.getElementById('exampleFormControlFile0');

                if(input.files[0] !== undefined && input.files[0] !== null){
                    SetShowDeleteLabels(true)


                }
            }

        }
    }
    function handleChangeAutoOpt(e){
        e.preventDefault()
        SetAutoOpt('')
        var input = document.getElementById('control_auto');

        SetAutoOpt(input.value)
        SetInputChange([])
        SetNoSelected([])
        SetBatch('')
        SetOptionsBatches([])

    }
    function handleChangeBatch(e){
        e.preventDefault()
        var input = document.getElementById('control_batch');

        SetBatch(input.value)


    }
    function handleChangePubMedAutoOpt(e){
        e.preventDefault()
        var input = document.getElementById('control_auto_pubmed');
        console.log('pubmed autopt',input.value)
        SetPubMedAutoOpt(input.value)
        SetInputChange([])
        SetNoSelected([])
        SetPubMedBatch('')
        SetPubMedOptionsBatches([])

    }
    function handleChangePubMedBatch(e){
        e.preventDefault()
        var input = document.getElementById('control_batch_pubmed');
        console.log('pubmed batch',input.value)

        SetPubMedBatch(input.value)


    }
    useEffect(()=>{
        var opt = []

        if(PubMedAutoOpt !== ''){
            axios.get('http://0.0.0.0:8000/get_auto_anno_PUBMED_batch_list',{params:{usecase:PubMedAutoOpt}}).then(response=>{
                // SetBa(response.data['batch_list'])
                SetPubMedOptionsBatches(response.data['batch_list'])
                response.data['batch_list'].map(el=>{
                    if(opt.indexOf(el) === -1){
                        opt.push(el)

                    }
                })
                if(response.data['batch_list'].length === 1){
                    SetPubMedBatch(1)
                }
            })

        }



    },[PubMedAutoOpt])

    useEffect(()=>{
        var opt = []
        if(AutoOpt !== ''){
            var els = document.getElementsByName(AutoOpt)

            axios.get('http://0.0.0.0:8000/get_auto_anno_batch_list',{params:{usecase:AutoOpt}}).then(response=>{
                // SetBa(response.data['batch_list'])
                console.log('resp',response.data['batch_list'])
                SetOptionsBatches(response.data['batch_list'])
                response.data['batch_list'].map(el=>{
                    if(opt.indexOf(el) === -1){
                        opt.push(el)

                    }
                })
                if(response.data['batch_list'].length === 1){
                    SetBatch(1)
                }
            })





            Array.from(els).map(el=>{
                el.disabled = false
                el.checked = false
                if(FieldsAlreadyExtracted[AutoOpt].length > 0){
                    FieldsAlreadyExtracted[AutoOpt].map(elem=>{

                        if(el.value === elem){
                            el.checked = true
                        }
                    })
                    el.disabled = true

                }
                else{
                    console.log('ENTRO4')
                    el.disabled = false
                    el.checked = false
                }

            })
        }




    },[AutoOpt])

    function handleCloseModalAuto() {
        setShowModalAuto(false)
    }

    function handleCloseIrrModal(){
        SetShowIrreversibleModal(false)
    }

    function handleChangeInputLabel(field,use){
        // console.log('use',use)
        // console.log('field',field)
        var arr = {}
        var inputs_change = InputChange
        inputs_change.push(use)
        SetInputChange(inputs_change)
        OptionsUsecasesAuto.flatMap(usec=>{
            if(usec !== use){
                // console.log('usec',usec)
                // console.log('usec',SelectedFields[usec])
                arr[usec] = SelectedFields[usec]
            }
        })
        var arr_new =SelectedFields[use]
        var elems = document.getElementsByName(use)
        // var arr = []
        Array.from(elems).map(el=>{
            if(el.checked === true){
                if(el.value === field){
                    // console.log('elemento',el)
                    if(arr_new.indexOf(el) === -1){
                        arr_new.push(el.value)

                    }
                }
            }
            else{
                if(el.value === field) {
                    arr_new = arr_new.filter(elem => elem !== el.value)
                }
            }
        })
        arr[use] = arr_new
        console.log('ARR',arr)
        SetSelectedFields(arr)

    }


    function handleClear(){
        SetShowIrreversibleModal(false)
        var opt = ''

        var elems = document.getElementsByName(AutoOpt)
        var tochange = FieldsAlreadyExtracted
        tochange[AutoOpt] = []
        SetFieldsAlreadyExtracted(tochange)
        SetCommitPossible(false)
        opt = AutoOpt

        Array.from(elems).map(el=>{
            el.disabled = false
            el.checked = false
        })

    }

    function handleStartAutoAnnoPubMed(){
        // var auto_ann = true
        var selected_obj = {}
        InputChange.map(el=>{
            selected_obj[el] = SelectedFields[el]
        })


        window.scroll(0,0)
        PubMedUsesInserted.map(el=>{
            selected_obj[el] = []

            selected_obj[el].push('abstract')
            selected_obj[el].push('title')
        })
        setShowModalAuto(false)
        SetShowPubMedModal(false)
        axios.post('http://0.0.0.0:8000/create_auto_annotations',{usecase:[PubMedAutoOpt],batch:PubMedBatch,report_type:'pubmed',selected:selected_obj}).then(function(response){
            console.log(response.data)
            // setShowModalAuto(false)
            SetUpdateFields(true)
            SetShowAutoSection(false)
            SetLoadingAuto(false)
            SetErrorAuto(false)
            SetAutoOpt('')
            SetBatch('')
            SetOptionsBatches([])
            SetPubMedAutoOpt('')
            SetPubMedBatch('')
            SetPubMedOptionsBatches([])
            SetInputChange([])
            SetCommitPossible(true)
            window.scroll(0,0)


        }).catch(function (error) {
            //alert('ATTENTION')
            SetLoadingAuto(false)
            SetErrorAuto(true)
            SetAutoOpt('')
            SetInputChange([])

            console.log(error);
        });

    }


    function handleStartAutoAnno(){
        // var auto_ann = true
        var selected_obj = {}
        InputChange.map(el=>{
            selected_obj[el] = SelectedFields[el]
        })


        window.scroll(0,0)

        setShowModalAuto(false)
        SetShowPubMedModal(false)
        axios.post('http://0.0.0.0:8000/create_auto_annotations',{usecase:[AutoOpt],batch:Batch,report_type:'reports',selected:selected_obj}).then(function(response){
            console.log(response.data)
            // setShowModalAuto(false)
            SetUpdateFields(true)
            SetShowAutoSection(false)
            SetLoadingAuto(false)
            SetErrorAuto(false)
            SetAutoOpt('')
            SetBatch('')
            SetOptionsBatches([])
            SetPubMedAutoOpt('')
            SetPubMedBatch('')
            SetPubMedOptionsBatches([])
            SetInputChange([])
            SetCommitPossible(true)
            window.scroll(0,0)


        }).catch(function (error) {
            //alert('ATTENTION')
            SetLoadingAuto(false)
            SetErrorAuto(true)
            SetAutoOpt('')
            SetInputChange([])

            console.log(error);
        });

    }
    useEffect(()=>{
        console.log('uses',UsesUpdate)
    },[UsesUpdate])
    function downloadAllAuto(){
        axios.get('http://0.0.0.0:8000/download_all_ground_truths',{params:{gt_mode:'automatic'}})
            .then(function (response) {
                FileDownload(JSON.stringify(response.data['ground_truth']), 'all_automatic_json_ground_truth.json');


            })
            .catch(function (error) {

                console.log('error message', error);
            });
    }
    function checkemptyuses(use){
        var uses = []

        if (SelectedFields[use].length === 0 && FieldsAlreadyExtracted[use].length === 0){
            uses.push(use)
        }
        SetNoSelected(uses)
        if(uses.length === 0){
            setShowModalAuto(true)
        }
    }
    function handleCloseModalPubmed(){
        SetShowPubMedModal(false)
    }


    return (
        <div className="App">

            <Modal show={ShowIrreversibleModal} onHide={handleCloseIrrModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Pay attention!</Modal.Title>
                </Modal.Header>
                <Modal.Body>This action is <b>irreversible</b>, setting new fields to extract annotations from will remove all the reports already automatically annotated for {AutoOpt} use case together with the automatic annotations checked by your colleagues. If you want to save all the ground-truths created by the automatic user and those checked by the colleagues click on <i>Save</i>, otherwise click on <i>Yes</i>.</Modal.Body>
                <Modal.Footer>
                    <Button style={{float:'left'}}  variant="info" onClick={()=>downloadAllAuto()}>
                        Download
                    </Button>
                    <Button variant="secondary" onClick={handleCloseIrrModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={(e)=>handleClear()}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={ShowPubMedModal} onHide={handleCloseModalPubmed} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Automatic annotation of PubMed articles</Modal.Title>
                </Modal.Header>
                <Modal.Body>The articles belonging to PubMed are going to be automatically annotated. The algorithm will annotate <i>title</i> and <i>abstract</i> sections.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalPubmed}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={()=>{SetLoadingAuto(true);handleStartAutoAnnoPubMed()}}>
                        START
                        {/*(setto fieldstoextract a select fields e e selectfields a [])*/}
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showModalAuto && AutoOpt !== ''} onHide={handleCloseModalAuto} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Automatic annotation: ATTENTION</Modal.Title>
                </Modal.Header>
                <Modal.Body>You selected: <b>{AutoOpt}</b> usecase to be automatically annotated. It might take a lot of time (especially if you have a lot of reports). Make sure your machine satisfies the following requirements:
                    <ul>
                        <li>10GB RAM</li>
                    </ul>
                    Bare in mind that the fields you select for the automatic annotation process are not modifiable once you confirm. Click on <i>Cancel</i> if you want to make changes to the current selection, otherwise click on <i>Save</i> and the process of automatic annotation will start.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalAuto}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={()=>{SetLoadingAuto(true);handleStartAutoAnno()}}>
                        START
                        {/*(setto fieldstoextract a select fields e e selectfields a [])*/}
                    </Button>
                </Modal.Footer>
            </Modal>
            {(LoadingAuto === true) ?  <div className='spinnerDiv'><Spinner animation="border" role="status"/><br/>Please wait, the automatic annotation might take some time. </div>: <div style={{textAlign:'center',marginTop:'2%'}}>
                {ErrorAuto === false && <div>
                    <h3>GREAT</h3>
                    <div>
                        The automatic annotations have been correctly created.
                    </div>
                    <hr/>
                    <div><Link to="/updateConfiguration"><Button onClick={()=>SetErrorAuto(0)} variant='success'>Back to Update</Button></Link></div>

                </div>}
                {ErrorAuto === true && <div>
                    <h3>ERROR</h3>
                    <div>
                        Something went wrong with the automatic configuration. Try to do it again or drop us an email (section: <a href='http://0.0.0.0:8000/credits'>Credits</a>)
                    </div>
                    <hr/>
                    <div><Link to="/updateConfiguration"><Button onClick={()=>SetErrorAuto(0)} variant='success'>Back to Update</Button></Link></div>
                </div>
                }

            </div>}
            {(LoadingResponse === true) ? <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>:
                <div>
                    {Message !== '' &&
                    <Container fluid>
                        <div>
                            <div>
                                <h2>Your new configuration is ready</h2>
                                <div>{Message}</div>
                                <hr/>
                                {((Selected === 'reports' && ReportsMissingAuto !== {}) || (Selected === 'pubmed' && PubMedMissingAuto !== {})) && <div>
                                    There are some reports that have not been automatically annotated yet.
                                    {Object.keys(ReportsMissingAuto).length > 0 && <ul>
                                        {Object.keys(ReportsMissingAuto).map(k=>
                                            <li>the use case {k} has {ReportsMissingAuto[k]['all']['annotated']} automatically annotated reports over {ReportsMissingAuto[k]['all']['tot']}</li>
                                        )}
                                    </ul>}
                                    {Object.keys(PubMedMissingAuto).length > 0 &&
                                    <div>There are {PubMedMissingAuto['annotated']} PubMed articles that have been automatically annotated, while {PubMedMissingAuto['tot'] - PubMedMissingAuto['annotated']} have not</div>}

                                    {/*clicking on <Button variant='warning'><FontAwesomeIcon icon={faRobot}/> Update now</Button><br/> You can also do it later*/}
                                    <div>If you have not done the automatic annotation yet, We strongly suggest you to automatically annotate these reports going on <i>Configure -> Update Configuration -> Get the automatic annotations</i>.</div></div>}
                                <hr/>
                                <div>Log in with your credentials, or go back to the update page.</div>

                            </div>

                        </div>
                        <div style={{'text-align':'center'}}>
                            <span><a href="http://0.0.0.0:8000/logout"><Button variant = 'primary'>Login</Button></a>&nbsp;&nbsp;<a href="http://0.0.0.0:8000/updateConfiguration"><Button variant = 'primary'>Update configuration</Button></a></span>
                        </div>
                    </Container>
                    }

                    {ErrorMessage !== '' &&
                    <Container fluid>
                        <div>
                            <h2>An error occurred</h2>
                            <div>{ErrorMessage}</div>
                            <hr/>
                            <div>Please, do the configuration again</div>

                        </div>
                        <div style={{'text-align':'center'}}>
                            <span><Link to="/infoAboutConfiguration"><Button variant='success'>Back to configure</Button></Link></span>&nbsp;&nbsp;
                        </div>
                    </Container>
                    }

                </div>}

            {LoadingResponse === false && LoadingAuto === false && Message === '' &&  ErrorMessage === '' && ErrorAuto === 0 && <div>

                <Container fluid>
                    <Row>
                        <Col md={4}>
                            <Button className='back-button' onClick={(e)=>SetBackClick(true)}><FontAwesomeIcon icon={faArrowLeft} />Back to info</Button>
                        </Col>
                        <Col md={8}></Col>
                    </Row>
                    <div>
                        <h2 style={{'margin-top':'30px','margin-bottom':'30px','text-align':'center'}}>Update your DocTAG configuration</h2>
                        <div>
                            Please, provide us with all the files and information required to customize the application. You can get the automatic annotations for your reports (available only for <i>colon, uterine cervix, lung</i> use cases), or add some data (report,s labels, concepts) to the current configuration.<br/>
                            <hr/>
                            {/*<div><h5 style={{display:'inline-block'}}>Get the automatic annotations</h5><IconButton onClick={()=>SetShowAutoSection(prev=>!prev)}><ExpandMoreIcon style={{marginLeft:'2px'}} /></IconButton></div>*/}
                            {/*<div>*/}
                            {/*    <Collapse style={{marginTop:'0px'}} in={showAutoSection}>*/}
                            {/*        {(UseCaseList.length > 0 && (UseCaseList.indexOf('colon') !== -1 || UseCaseList.indexOf('uterine cervix') !== -1 || UseCaseList.indexOf('lung') !== -1)) ? <div>*/}
                            {/*        <div style={{'margin-bottom':'1%','margin-top':'0px'}}>The automatic annotation of the reports allows you to be provided with a ready to use annotations. The ground truths created by the algorithms will be available to be checked and modified by users.</div>*/}
                            {/*        <h6>Attention</h6>*/}
                            {/*        <div>Automatic annotation algorithm:</div>*/}
                            {/*        <ul>*/}
                            {/*            <li>is available for <i>Lung, Colon, Uterine Cervix</i> use cases.</li>*/}
                            {/*            <li>is available for <i>english</i> language</li>*/}
                            {/*            <li>relies on a set of labels we provide.</li>*/}
                            {/*            <li>relies on the concepts of the EXAMODE ontology (see the <a href={'http://examode.dei.unipd.it/ontology/'}>EXAMODE ontology website</a>).</li>*/}
                            {/*        </ul>*/}
                            {/*        <div>The algorithm can be run on machines that have at least 10GB of RAM, if you are not sure you have such a machine, please, do not run this process, it will fill all your memory ending up with an error.*/}
                            {/*        </div><hr/>*/}
                            {/*        <div>*/}
                            {/*            {PubMedMissingAuto['tot'] !== 0  && <div><h6>Get the automatic annotations of PubMed articles</h6>*/}
                            {/*            <div>*/}
                            {/*                You can get the automatic annotations of PubMed articles.*/}
                            {/*                Remember that <i>title</i> and <i>abstract</i> sections will be annotated.*/}


                            {/*                <Form.Group >*/}
                            {/*                    <Row>*/}
                            {/*                        <Col md = {6}><Form.Control id="control_auto_pubmed" as="select" defaultValue="Select..." onChange={(e)=>handleChangePubMedAutoOpt(e)}>*/}
                            {/*                            <option value=''>Select a use case</option>*/}

                            {/*                            {PubMedUsesInserted.map(use=>*/}
                            {/*                                <option value={use}>{use}</option>*/}
                            {/*                            )}*/}
                            {/*                        </Form.Control></Col>*/}
                            {/*                        {PubMedOptionsBatches.length > 1 && PubMedAutoOpt !== '' && <Col md = {3}>*/}
                            {/*                            <Form.Control as="select"  id="control_batch_pubmed" defaultValue="Select a batch" onChange={(e)=>handleChangePubMedBatch(e)}>*/}
                            {/*                                <option value=''>Select a batch</option>*/}
                            {/*                                {PubMedOptionsBatches.map(batch=>*/}
                            {/*                                    // console.log('opt',batch)*/}
                            {/*                                    <option value={batch}>{batch}</option>*/}
                            {/*                                )}*/}
                            {/*                                <option value = 'all'>All</option>*/}
                            {/*                            </Form.Control>*/}
                            {/*                        </Col>}*/}
                            {/*                    </Row>*/}
                            {/*                </Form.Group>*/}
                            {/*                {PubMedAutoOpt !== '' && PubMedBatch !== '' &&*/}
                            {/*                <div>*/}
                            {/*                    <div>Use case <b>{PubMedAutoOpt}</b> {PubMedOptionsBatches.length > 1 && <>batch <b>{Batch}</b></>}: <b>{PubMedMissingAuto[PubMedAutoOpt][PubMedBatch]['annotated']}</b> reports have been automatically annotated, while <b>{PubMedMissingAuto[PubMedAutoOpt][PubMedBatch]['tot'] - PubMedMissingAuto[PubMedAutoOpt][PubMedBatch]['annotated']}</b> have not. </div>*/}


                            {/*                    <div style={{'text-align':'center','margin':'2% 0 0 2%'}}>*/}
                            {/*                    <Button id='commit_extracted' size='lg' variant='success' onClick={()=>{SetShowPubMedModal(true);SetReportType('pubmed')}}>Get the automatic annotations of PubMed articles</Button>*/}
                            {/*                    </div>*/}
                            {/*                </div>}*/}

                            {/*                </div><hr/></div>}*/}




                            {/*            <h6>Get the automatic annotations of reports you uploaded</h6>*/}
                            {/*        </div>*/}
                            {/*        <div>*/}
                            {/*            <div >*/}
                            {/*                <Form.Group >*/}
                            {/*                    <Row>*/}
                            {/*                        <Col md = {6}><Form.Control id="control_auto" as="select" defaultValue="Select..." onChange={(e)=>handleChangeAutoOpt(e)}>*/}
                            {/*                            <option value=''>Select a use case</option>*/}

                            {/*                            {OptionsUsecasesAuto.map(use=>*/}
                            {/*                                <option value={use}>{use}</option>*/}
                            {/*                            )}*/}
                            {/*                        </Form.Control></Col>*/}
                            {/*                        {OptionsBatches.length > 1 && <Col md = {3}>*/}
                            {/*                           <Form.Control as="select"  id="control_batch" defaultValue="Select a batch" onChange={(e)=>handleChangeBatch(e)}>*/}
                            {/*                                <option value=''>Select a batch</option>*/}
                            {/*                                {OptionsBatches.map(batch=>*/}
                            {/*                                    // console.log('opt',batch)*/}
                            {/*                                    <option value={batch}>{batch}</option>*/}
                            {/*                                )}*/}
                            {/*                               <option value = 'all'>All</option>*/}
                            {/*                            </Form.Control>*/}
                            {/*                        </Col>}*/}
                            {/*                    </Row></Form.Group>*/}
                            {/*                {AutoOpt !== '' && Batch !== '' && <div>*/}
                            {/*                    <div>Use case <b>{AutoOpt}</b> {OptionsBatches.length > 1 && <>batch <b>{Batch}</b></>}: <b>{ReportsMissingAuto[AutoOpt][Batch]['annotated']}</b> reports have been automatically annotated, while <b>{ReportsMissingAuto[AutoOpt][Batch]['tot'] - ReportsMissingAuto[AutoOpt][Batch]['annotated']}</b> have not. </div>*/}


                            {/*                    <hr/>*/}
                            {/*                    {FieldsAlreadyExtracted && FieldsUseCasesToExtract && AutoOpt !== '' && <div>*/}
                            {/*                        <div>Please select the fields you want to extract the mentions and concepts from. <b>Remember that once you have chosen the fields for a use case, these will not be modifiable. If you want to modify the fields you want to extract automatic concepts from, you will have to extract the concepts from every report again. This will remove the ground-truths automatically created before and those the users revised.</b> </div>*/}

                            {/*                        <div style={{marginTop:'1%'}}>*/}
                            {/*                                <h5>{AutoOpt}</h5>*/}
                            {/*                                <div style={{'margin-bottom':'2%'}}>*/}
                            {/*                                    {FieldsAlreadyExtracted[AutoOpt].length === 0 ? <div style={{'margin-bottom':'2%'}}><i>Select <b>at least</b> a field</i></div> : <div style={{'margin-bottom':'2%'}}><i>These are the fields you used to automatically annotate {ReportsMissingAuto[AutoOpt][Batch]['annotated']} reports. If you want to change them, click on CLEAR and select a new set of fields. All the reports for that use case will be annotated again. </i></div>}*/}
                            {/*                                    {FieldsUseCasesToExtract[AutoOpt].map(field=>*/}
                            {/*                                        <label>*/}
                            {/*                                            <input name={AutoOpt} disabled={FieldsAlreadyExtracted[AutoOpt].length > 0} defaultChecked={FieldsAlreadyExtracted[AutoOpt].indexOf(field) !== -1} value={field} type="checkbox"  onChange={()=>handleChangeInputLabel(field,AutoOpt)}/>{' '}*/}
                            {/*                                            {field}&nbsp;&nbsp;&nbsp;&nbsp;*/}
                            {/*                                        </label>*/}
                            {/*                                    )}*/}
                            {/*                                </div>*/}




                            {/*                                /!*{FieldsAlreadyExtracted[AutoOpt].length === 0 ?<Button onClick={()=>SetConfirmExtractFields(prev=>!prev)}>Confirm</Button> : <Button variant='danger' onClick={()=>SetShowIrreversibleModal(true)} size='sm'>Clear</Button>}*!/*/}
                            {/*                                {FieldsAlreadyExtracted[AutoOpt].length > 0 && <Button variant='danger' onClick={()=>SetShowIrreversibleModal(true)} size='sm'>Clear</Button>}*/}
                            {/*                                {NoSelected.length > 0 && <div>Select <b>at least</b> a field for {NoSelected.join(', ')}</div>}*/}

                            {/*                                <div style={{'text-align':'center','margin-top':'2%'}}>*/}
                            {/*                                    {(ReportsMissingAuto[AutoOpt][Batch]['annotated']===ReportsMissingAuto[AutoOpt][Batch]['tot'] && CommitPossible) ? <div style={{'color':'green','font-weight':'bold'}}>All the reports for this configuration have been automatically annotated. </div> : <Button id='commit_extracted' disabled={FieldsAlreadyExtracted[AutoOpt].length === 0 && SelectedFields[AutoOpt].length === 0} size='lg' variant='success' onClick={()=>checkemptyuses(AutoOpt)}>Get the automatic annotations</Button>}*/}
                            {/*                                </div>*/}

                            {/*                            </div>*/}


                            {/*                    </div>}*/}
                            {/*                </div>}*/}

                            {/*            </div>*/}
                            {/*        </div></div>*/}
                            {/*        : <div>Sorry. The automatic annotations are available only for <i>Colon, Lung, Uterine cervix</i> use cases.</div>}*/}
                            {/*        <hr/><hr/>*/}
                            {/*    </Collapse>*/}
                            {/*</div>*/}


                            <div><h5 style={{display:'inline-block'}}>Add some data to the current configuration</h5><IconButton onClick={()=>SetShowAddSection(prev=>!prev)}><ExpandMoreIcon style={{marginLeft:'2px'}} /></IconButton></div>
                            <Collapse style={{marginTop:'0px'}} in={showAddSection}>
                                {(!(Admin === '' && Username === 'Test')) ? <div>
                                <div style={{'margin-bottom':'1%','margin-top':'0px'}}>Follow the instructions below to add some reports, labels and concepts:</div>
                                <ul>
                                    <li><span>Select the type of file you want to add (the choices are: <i>labels, reports, concepts, fields to display and annotate).</i></span></li>
                                    <li><span>Select the file(s).</span></li>
                                    <li>Click on <span><Button variant="info" size='sm'>Example</Button></span> to see an example of file accepted by the database.</li>
                                    <li>Click on <span><Button variant="primary" size='sm'>Check</Button></span> to control if the file (or information) you provided complies with the requirements.</li>
                                    <li>Click on <span><Button variant="success" size='sm'>Confirm</Button></span> to insert the data in the database. If some errors occurred you will be informed.</li>
                                </ul>
                                <hr/>
                                <div>
                                    {/*<div>*/}
                                    {/*    <h4>Examples</h4>*/}
                                    {/*    <ul>*/}
                                    {/*        <li><Row><Col md={4}>Label file:</Col><Col md={8}><Button variant='info' size='sm' onClick={(e)=>SetShowLabelsExamples(prev=>!prev)}>Example</Button></Col></Row>*/}
                                    {/*            {ShowLabelsExamples && <div style={{'text-align':'center'}}>This is an example of labels file. <br/> Your file must contain the header row (the one in boldface) containing the name of each column. In each row the values must be comma separated.<br/> <span style={{'font-weight':'bold'}}>Null values are not allowed, for each row you must provide a label and a usecase.</span>*/}
                                    {/*                <br/><br/>*/}
                                    {/*                /!*<div>If you prefer you can download the csv file.*!/*/}
                                    {/*                /!*    <span> <Button size='sm' onClick={(e)=>onSaveExample(e,'labels')} variant='warning'> <FontAwesomeIcon icon={faDownload} /> Download</Button></span>*!/*/}
                                    {/*                /!*</div>*!/*/}
                                    {/*                <hr/>*/}
                                    {/*                /!*<div className='examples'>*!/*/}
                                    {/*                /!*    <div style={{'display':'flex','justify-content':'center'}}>*!/*/}
                                    {/*                /!*        <div>*!/*/}
                                    {/*                /!*            <span style={{'font-weight':'bold'}}>usecase,label</span><br/>*!/*/}
                                    {/*                /!*            /!*name,seq_number,label<br/>*!/*!/*/}
                                    {/*                /!*            Colon,Cancer<br/>*!/*/}
                                    {/*                /!*            Colon,Adenomatous polyp - high grade dysplasia<br/>*!/*/}
                                    {/*                /!*            Colon,Adenomatous polyp - low grade dysplasia<br/>*!/*/}
                                    {/*                /!*            Colon,Hyperplastic polyp<br/>*!/*/}
                                    {/*                /!*            Colon,Non-informative<br/>*!/*/}
                                    {/*                /!*        </div>*!/*/}
                                    {/*                /!*    </div></div><hr/>*!/*/}

                                    {/*            </div>}*/}
                                    {/*        </li>*/}
                                    {/*        <li><Row><Col md={4}>PubMed ids file:</Col><Col md={8}><Button variant='info' size='sm' onClick={(e)=>SetShowPubmedExamples(prev=>!prev)}>Example</Button></Col></Row>*/}
                                    {/*            {ShowPubmedExamples && <div style={{'text-align':'center'}}>This is an example of file containing PubMed ids. <br/> Your file must contain the header row (the one in boldface) containing the name of each column. In each row the values must be comma separated.<br/> <span style={{'font-weight':'bold'}}>Null values are not allowed, for each row you must provide a ID and a usecase.</span>*/}
                                    {/*                <br/><br/>*/}
                                    {/*                /!*<div>If you prefer you can download the csv file.*!/*/}
                                    {/*                /!*    <span> <Button size='sm' onClick={(e)=>onSaveExample(e,'pubmed')} variant='warning'> <FontAwesomeIcon icon={faDownload} /> Download</Button></span>*!/*/}
                                    {/*                /!*</div>*!/*/}
                                    {/*                <hr/>*/}
                                    {/*                /!*<div className='examples'>*!/*/}
                                    {/*                /!*    <div style={{'display':'flex','justify-content':'center'}}>*!/*/}
                                    {/*                /!*        <div>*!/*/}
                                    {/*                /!*            <span style={{'font-weight':'bold'}}>ID,usecase</span><br/>*!/*/}
                                    {/*                /!*            /!*name,seq_number,label<br/>*!/*!/*/}
                                    {/*                /!*            29691659,Colon<br/>*!/*/}
                                    {/*                /!*            20138539,Colon<br/>*!/*/}
                                    {/*                /!*            25918287,Colon<br/>*!/*/}

                                    {/*                /!*        </div>*!/*/}
                                    {/*                /!*    </div></div>*!/*/}
                                    {/*                /!*<hr/>*!/*/}

                                    {/*            </div>}*/}
                                    {/*        </li>*/}
                                    {/*        <li><Row><Col md={4}>Reports file:</Col><Col md={8}> <Button variant='info' size='sm' onClick={(e)=>SetShowReportsExamples(prev=>!prev)}>Example</Button></Col></Row>*/}
                                    {/*            {ShowReportsExamples && <div style={{'text-align':'center'}}>This is an example of reports file. <br/> Your file must contain the header row (the one in boldface) containing the name of each column. In each row the values must be comma separated.<br/> <span style={{'font-weight':'bold'}}>Null values are not allowed for id_report, usecase, institute, language. </span>*/}
                                    {/*                <br/><br/>*/}
                                    {/*                /!*<div>If you prefer you can download the csv file.*!/*/}
                                    {/*                /!*    <span> <Button size='sm' onClick={(e)=>onSaveExample(e,'reports')} variant='warning'> <FontAwesomeIcon icon={faDownload} /> Download</Button></span>*!/*/}
                                    {/*                /!*</div>*!/*/}
                                    {/*                <hr/>*/}
                                    {/*                /!*<div className='examples'>*!/*/}
                                    {/*                /!*    <div >*!/*/}
                                    {/*                /!*        <span style={{'font-weight':'bold'}}>id_report,language,institute,usecase,age,target_diagnosis</span><br/>*!/*/}
                                    {/*                /!*        024904af0078ed89be428dd5868803ce,English,default_hospital,Colon,63,right colon polyps: tubular adenoma with mild dysplasia glandular epithelium.<br/>*!/*/}
                                    {/*                /!*        d857a9f16b239c8b0321e0f3245809ec,English,default_hospital,Colon65,villous adenoma tubule with moderate dysplasia glandular epithelium. pseudoinvasione axis.<br/>*!/*/}
                                    {/*                /!*        369093624905afbb0ef2d5b530ca210e,English,default_hospital,Colon59,"adenoma tightened with mild dysplasia. the lesion spread over hemorrhoidal nodule."<br/>*!/*/}
                                    {/*                /!*        fc4988c5312da8c65282fdf7f1999af6,English,default_hospital,Colon68,right colon polyps: tubular adenomas with mild dysplasia glandular epithelium.<br/>*!/*/}

                                    {/*                /!*    </div></div><hr/>*!/*/}

                                    {/*            </div>}*/}
                                    {/*        </li>*/}
                                    {/*        <li>*/}
                                    {/*            <Row><Col md={4}>Concepts file:</Col><Col md={8}>*/}
                                    {/*            <Button variant='info' size='sm' onClick={(e)=>SetShowConceptsExamples(prev=>!prev)}>Example</Button></Col>*/}
                                    {/*            </Row>*/}
                                    {/*            /!*{ShowConceptsExamples && <div style={{'text-align':'center'}}>This is an example of concepts file. <br/> Your file must contain the header row (the one in boldface) containing the name of each column. In each row the values must be comma separated.<br/> <span style={{'font-weight':'bold'}}>Null values are not allowed, you must provide a value for concept_url, concept_name, usecase and area. </span>*!/*/}
                                    {/*            /!*    <br/><br/>*!/*/}
                                    {/*            /!*    <div>If you prefer you can download the csv file.*!/*/}
                                    {/*            /!*        <span> <Button size='sm' onClick={(e)=>onSaveExample(e,'concepts')} variant='warning'> <FontAwesomeIcon icon={faDownload} /> Download</Button></span>*!/*/}
                                    {/*            /!*    </div>*!/*/}

                                    {/*            /!*    <hr/>*!/*/}
                                    {/*            /!*    <div className='examples'>*!/*/}
                                    {/*            /!*        <div style={{'display':'flex','justify-content':'center'}}>*!/*/}
                                    {/*            /!*            <div>*!/*/}
                                    {/*            /!*                <span style={{'font-weight':'bold'}}>concept_url,concept_name,usecase,area</span><br/>*!/*/}
                                    {/*            /!*                /!*concept_url,name,json_concept,usecase,area<br/>*!/*!/*/}
                                    {/*            /!*                http://purl.obolibrary.org/obo/UBERON_0003346,Rectal mucous membrane,Colon,Anatomical Location<br/>*!/*/}
                                    {/*            /!*                http://purl.obolibrary.org/obo/UBERON_0001157,Transverse Colon,Colon,Anatomical Location<br/>*!/*/}
                                    {/*            /!*                http://purl.obolibrary.org/obo/UBERON_0001052,"Rectum, NOS",Colon,Anatomical Location<br/>*!/*/}
                                    {/*            /!*                http://purl.obolibrary.org/obo/UBERON_0001158,Descending colon,Colon,Anatomical Location<br/>*!/*/}
                                    {/*            /!*                http://purl.obolibrary.org/obo/UBERON_0001153,Caecum,Colon,Anatomical Location<br/>*!/*/}
                                    {/*            /!*            </div>*!/*/}
                                    {/*            /!*        </div></div><hr/>*!/*/}

                                    {/*            /!*</div>*!/*/}
                                    {/*            </li>*/}
                                    {/*    </ul>*/}
                                    {/*</div>*/}
                                    <Form>
                                        <Form.Group controlId="ControlSelect1">
                                            <Form.Label>Select the type of your file</Form.Label>
                                            <Form.Control style={{width: '30%'}} as="select" defaultValue="reports" onChange={(e)=>handleSelect(e)}>
                                                <option value='labels'>Labels</option>
                                                <option value='reports'>Collection, topics, runs</option>
                                                {/*<option value='pubmed'>PubMED IDs</option>*/}
                                                <option value='concepts'>Concepts</option>
                                                <option value='json_fields'>Fields to display and annotate</option>
                                                <option value='tfidf'>tf-idf top-k words</option>
                                            </Form.Control>
                                        </Form.Group>



                                        {/*{Selected === 'pubmed' && <div>*/}
                                        {/*    <Form.Group>*/}
                                        {/*        <Form.File  multiple id="exampleFormControlFile5" onClick={(e) => {SetShowDeletePubMed(false);(e.target.value = null);SetAdded(false);SetWarning('');SetChecked(0)}} onChange={(e)=>{SetAdded(true);showKeys_setUseCase();showDelete(e,'pubmed')}} label="Select the pubmed file" />*/}
                                        {/*    </Form.Group>*/}
                                        {/*    {ShowDeletePubMed === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e,'pubmed')}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}*/}
                                        {/*    {PubMedUsesUpdate.length > 0 && <div>*/}
                                        {/*        You are uploading reports for {PubMedUsesUpdate.join(', ')}: you have already uploaded reports for these use cases. You can upload these reports as a different <b>batch</b>, that means that you can upload the reports keeping track of the insertion date. This allows users to choose what batch to annotate and allows you to choose what batch to automatically annotate. If you do not want to keep reports in different batches, all the reports belonging to a specific use case will be loaded independetly of when they have been inserted.*/}
                                        {/*        Do you want to add reports for {PubMedUsesUpdate.join(', ')} in a new batch? If you do not want to and there is more than one batch in the database for that use case, then, the reports will be added to the last inserted batch.&nbsp;&nbsp;*/}
                                        {/*        <span>*/}
                                        {/*                <label>*/}
                                        {/*                    <input name='pubmed' value='yes' defaultChecked={true} onChange={()=>SetInBatch(true)} type="radio" />{' '}*/}
                                        {/*                    Yes&nbsp;&nbsp;&nbsp;&nbsp;*/}
                                        {/*                </label>*/}
                                        {/*                <label>*/}
                                        {/*                <input name='pubmed' value='no' onChange={()=>SetInBatch(false)} type="radio" />{' '}*/}
                                        {/*                    No&nbsp;&nbsp;&nbsp;&nbsp;*/}
                                        {/*            </label>*/}
                                        {/*            </span>*/}
                                        {/*    </div>}*/}

                                        {/*</div>*/}
                                        {/*}*/}
                                        {Selected === 'reports' && <div>
                                            <Form.Group style={{'margin-top':'20px','margin-bottom':'20px'}}>
                                                <div><span>Insert here the files with the topics.</span><br/>
                                                    {/*<div className='conf-div'>*/}
                                                    {/*    <Button onClick={()=>SetShowReportExample(prev=>!prev)} variant="info" size='sm'>Example</Button>*/}
                                                    {/*</div>*/}
                                                </div>
                                                {/*<div style={{marginBottom:'2%',fontSize:'0.9rem'}}><i>Please, make sure the ids of the reports you insert do not start with "pubmed" and the institutes you insert are different from "pubmed".</i></div>*/}
                                                <Form.File id="topic_form" onClick={(e) => {(e.target.value = null);SetShowDeleteTopic(false);}} onChange={(e)=>{showDelete(e,'topics');}} multiple/>
                                                {ShowDeleteTopic === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e,'topics')}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}

                                            </Form.Group>
                                            <hr/>

                                            <Form.Group >
                                                <div><span>Insert here the files with the runs (i.e. - tha files containing for each topic the associated documents). The allowed formats are: TREC, csv, json, txt.</span><br/>
                                                    {/*<div className='conf-div'><Button onClick={()=>SetShowReportExample(prev=>!prev)} variant="info" size='sm'>Example</Button>*/}
                                                    {/*</div>*/}
                                                </div>
                                                {/*<div style={{marginBottom:'2%',fontSize:'0.9rem'}}><i>Please, make sure the ids of the reports you insert do not start with "pubmed" and the institutes you insert are different from "pubmed".</i></div>*/}
                                                <Form.File id="runs_form" onClick={(e) => {(e.target.value = null);SetShowDeleteRuns(false);}} onChange={(e)=>{showDelete(e,'runs');}} multiple/>
                                                {ShowDeleteRuns === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e,'runs')}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}

                                            </Form.Group>


                                            <hr/>
                                            <Form.Group>
                                                <Form.File  multiple id="exampleFormControlFile5" onClick={(e) => {SetShowDeletePubMed(false);(e.target.value = null);SetAdded(false);SetWarning('');SetChecked(0)}} onChange={(e)=>{SetAdded(true);showKeys_setUseCase();showDelete(e,'pubmed')}} label="Select the pubmed files" />
                                            </Form.Group>
                                            {ShowDeletePubMed === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e,'pubmed')}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}
                                            <hr/>
                                            <Form.Group>
                                                <Form.File  multiple id="exampleFormControlFile1" onClick={(e) => {SetKeysUpdate([]);SetShowDeleteReports(false);(e.target.value = null);SetAdded(false);SetWarning('');SetChecked(0);SetUsesUpdate([])}} onChange={(e)=>{SetAdded(true);showKeys_setUseCase();showDelete(e,'reports')}} label="Select the reports files" />
                                            </Form.Group>
                                            {ShowDeleteReports === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e,'reports')}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}
                                            {UsesUpdate.length > 0 && <div>
                                                You are uploading reports for {UsesUpdate.join(', ')}: you have already uploaded reports for these use cases. You can upload these reports as a different <b>batch</b>, that means that you can upload the reports keeping track of the insertion date. This allows users to choose what batch to annotate and allows you to choose what batch to automatically annotate. If you do not want to keep reports in different batches, all the reports belonging to a specific use case will be loaded independetly of when they have been inserted.
                                                Do you want to add reports for {UsesUpdate.join(', ')} in a new batch? If you do not want to and there is more than one batch in the database for that use case, then, the reports will be added to the last inserted batch.&nbsp;&nbsp;
                                                    <span>
                                                        <label>
                                                            <input name='pubmed' value='yes' defaultChecked={true} onChange={()=>SetInBatch(true)} type="radio" />{' '}
                                                            Yes&nbsp;&nbsp;&nbsp;&nbsp;
                                                        </label>
                                                        <label>
                                                        <input name='pubmed' value='no' onChange={()=>SetInBatch(false)} type="radio" />{' '}
                                                        No&nbsp;&nbsp;&nbsp;&nbsp;
                                                    </label>
                                                    </span>
                                            </div>}

                                        </div>
                                        }

                                        {(Selected === 'reports' && KeysUpdate.length > 0) && <div>
                                            <div>In the reports file(s) you have just uploaded there are some fields that have never been seen before. Please notify us if you want to hide, display or annotate them.</div>
                                            <div style = {{'font-weight':'bold'}}>Remember that if you have found some mentions in one or more reports, the fields that you annotated can not turned into Display or Hide, you can add fields to annotate but not remove them. </div>
                                            {KeysUpdate.map((key,ind)=>
                                                <Row><Col md = {4}>{key}</Col>
                                                    <Col md={8}>
                                                        <label>
                                                        <input
                                                            // disabled={FieldsToAnn.indexOf(key) !== -1}
                                                            value='hide'
                                                            type="radio"
                                                            name={key}
                                                            onChange={()=>{SetChecked(0);SetWarning('')}}
                                                            // defaultChecked={FieldsToAnn.indexOf(key) === -1 && Fields.indexOf(key) === -1}

                                                        />&nbsp;
                                                        Hide</label>&nbsp;&nbsp;&nbsp;&nbsp;
                                                        <label>
                                                        <input
                                                            // disabled={FieldsToAnn.indexOf(key) !== -1}
                                                            value='display'
                                                            type="radio"
                                                            name={key}
                                                            onChange={()=>{SetChecked(0);SetWarning('')}}
                                                        />&nbsp;
                                                        Display</label>&nbsp;&nbsp;&nbsp;&nbsp;
                                                        <label>
                                                        <input
                                                            // disabled={FieldsToAnn.indexOf(key) !== -1}
                                                            name={key}
                                                            type="radio"
                                                            value='both'
                                                            onChange={()=>{SetChecked(0);SetWarning('')}}
                                                            defaultChecked={true}

                                                            // defaultChecked={FieldsToAnn.indexOf(key) !== -1}

                                                        />&nbsp;
                                                        Display and Annotate</label>

                                                    </Col>

                                                </Row>
                                            )}

                                        </div>

                                        }
                                        {Selected === 'concepts' && <div>
                                        {UsesPresentExaConcepts.length > 0 && <div style={{color:'royalblue',fontWeight:'bold'}}>For <span style={{color:'midnightblue'}}>{UsesPresentExaConcepts.join(', ')}</span> use cases you are using EXAMODE ontology<hr/></div>}
                                        {UsesMissingExaConcepts.length > 0 && ShowExaConcepts === true &&<div>
                                            You inserted reports for: <b>{UsesMissingExaConcepts.join(', ')}</b>; EXAMODE ontology is available for these secases. You can use its concepts or combine them with those you upload. <b>You can choose to insert OR the EXAMODE ontology OR you can update your own concepts.</b>
                                        {LoadExaConcepts === false ? <Button variant='primary' size = 'sm' onClick={()=>{SetAdded(false);SetChecked(0);SetWarning('');SetLoadExaConcepts(true)}}>Get EXAMODE concepts</Button> : <div style={{fontWeight:'bold',color:'royalblue'}}>You decided to add concepts of EXAMODE ontology <Button className='delete-button' onClick={()=>{SetAdded(false);SetChecked(0);SetWarning('');SetLoadExaConcepts(false)}}><FontAwesomeIcon icon={faTimes} /></Button></div>}
                                            </div>}
                                        {LoadExaConcepts !== true && <Form.Group>
                                            <Form.File multiple id="exampleFormControlFile2" onClick={(e) => {SetShowExaConcepts(false);SetShowDeleteConcepts(false);(e.target.value = null);SetAdded(false);SetChecked(0);SetWarning('')}} onChange={(e)=>{SetShowExaConcepts(false);SetAdded(true);showDelete(e,'concepts')}} label="Select the concepts file" />
                                        {ShowDeleteConcepts === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e,'concepts')}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}
                                            </Form.Group>}


                                            </div>}
                                        {Selected === 'labels' &&
                                        <div>
                                            {UsesPresentExaLabels.length > 0 && <div style={{color:'royalblue',fontWeight:'bold'}}>For <span style={{color:'midnightblue'}}>{UsesPresentExaLabels.join(', ')}</span> use cases you are using EXAMODE labels<hr/></div>}
                                            {UsesMissingExaLabels.length > 0 && ShowExaLabels === true && <div>
                                                You inserted reports for: <b>{UsesMissingExaLabels.join(', ')}</b>; EXAMODE labels are available for these usecases. You can use its concepts or combine them with those you upload. <b>You can choose to insert these labels or those you upload.</b>
                                                {LoadExaLabels === false ? <Button variant='primary' size = 'sm' onClick={()=>{SetAdded(false);SetChecked(0);SetWarning('');SetLoadExaLabels(true)}}>Get EXAMODE labels</Button> : <div style={{fontWeight:'bold',color:'royalblue'}}>You decided to add EXAMODE labels <Button className='delete-button' onClick={()=>{SetAdded(false);SetChecked(0);SetWarning('');SetLoadExaLabels(false)}}><FontAwesomeIcon icon={faTimes} /></Button></div>}
                                            </div>}
                                            {LoadExaLabels !== true  && <Form.Group>
                                                <Form.File multiple onChange={(e)=>{SetShowExaLabels(false);SetAdded(true);showDelete(e,'labels')}} id="exampleFormControlFile0" onClick={(e) => {SetShowExaLabels(false);SetShowDeleteLabels(false);SetAdded(false);SetWarning('');(e.target.value = null);SetChecked(0)}} label="Select the labels file" />
                                                {ShowDeleteLabels === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e,'labels')}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}
                                            </Form.Group>}


                                        </div>
                                        }
                                        {Selected === 'tfidf' && <div>
                                            <div>
                                                <div>Select the top-k words with the highest TF-IDF score in the topic-document pairs. </div>
                                                <Form.Group controlId="tfidf_form">
                                                    <Form.Control type="text" placeholder="Select a number..." />
                                                </Form.Group>

                                            </div>
                                            <hr/>
                                        </div>}
                                        {((Selected === 'json_fields' && Keys.length > 0)) && <div>
                                            <div style={{'margin-bottom':'20px'}}>Below you can find all the keys detected in your json reports. For each key you have to decide if you want to display, hide or both display and annotate the value corresponding to that key.</div>
                                            <div style = {{'font-weight':'bold'}}>Remember that if you have found some mentions in one or more reports, the fields that you annotated can not turned into Display or Hide, you can add fields to annotate but not remove them.</div>
                                            {Keys.map((key,ind)=>
                                                <Row><Col md = {4}>
                                                    {key}</Col>
                                                    <Col md={8}>
                                                        <input
                                                            disabled={FieldsToAnn.indexOf(key) !== -1}
                                                            value='hide'
                                                            type="radio"
                                                            name={key}
                                                            defaultChecked={FieldsToAnn.indexOf(key) === -1 && Fields.indexOf(key) === -1}
                                                            onChange={()=>{SetAdded(true);SetChecked(0);SetWarning('')}}

                                                        />&nbsp;
                                                        <label>Hide</label>&nbsp;&nbsp;&nbsp;&nbsp;
                                                        <input
                                                            disabled={FieldsToAnn.indexOf(key) !== -1}
                                                            value='display'
                                                            type="radio"
                                                            name={key}
                                                            onChange={()=>{SetAdded(true);SetChecked(0);SetWarning('')}}

                                                            defaultChecked={Fields.indexOf(key) !== -1}
                                                        />&nbsp;
                                                        <label>Display</label>&nbsp;&nbsp;&nbsp;&nbsp;
                                                        <input
                                                            disabled={FieldsToAnn.indexOf(key) !== -1}
                                                            name={key}
                                                            type="radio"
                                                            value='both'
                                                            onChange={()=>{SetAdded(true);SetChecked(0);SetWarning('')}}

                                                            defaultChecked={FieldsToAnn.indexOf(key) !== -1}

                                                        />&nbsp;
                                                        <label>Display and Annotate</label>

                                                    </Col>

                                                </Row>
                                            )}
                                        </div>
                                        }
                                        {Warning !== '' && <div style={{'color':'orange'}}>{Warning}</div>}
                                        {Checked !== 0 && Warning === '' && <div>
                                            {(Checked === true && Checked !== 0) ? <div style={{'color':'green'}}>OK</div> : <div style={{'color':'red'}}><span>There are some errors: </span><span>{Checked}</span></div>}

                                        </div>}
                                        {/*{ Checked !== true && Checked !== 0 && <div>Please, provide a correct file to confirm.</div>}*/}
                                        {/*{UpdateConfirm === true && <div style={{'color':'red'}}>Please, insert a file to confirm</div>}*/}
                                        <div style={{'margin-top':'40px'}}>
                                            <Button variant="primary"  onClick={(e)=>onCheck(e)}>
                                                Check
                                            </Button>&nbsp;&nbsp;
                                            <Button  variant="success" onClick={(e)=>onAdd(e)}>
                                                Confirm
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </div> : <div>You are in the Test mode, this means that you are using the configuration we provided to test DocTAG. You can not add data to the data we provided, you have to create your own configuration going at the previous page and clicking on <i>Configure without saving</i> or <i>Save the json ground truths and configure</i>.</div>}
                            </Collapse>




                        </div>
                    </div>
                </Container>
                {ShowModalConfirm === true && <Modal show={ShowModalConfirm} onHide={handleCloseModal} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Attention</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {Added && Checked === 0 && <div>Please, click on Check before confirm</div>}
                        {!Added && Selected === 'json_fields' && Checked === 0 && <div>Please, change the configuration and then check it before confirm.</div>}
                        {!Added && Selected !== 'json_fields' && Checked === 0 && <div>Please, insert a file</div>}
                        {Checked !== 0 && Checked !== true && <div>Please, correct the errors before confirm.</div>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleCloseModal}>
                            Ok
                        </Button>


                    </Modal.Footer>
                </Modal>}
            </div>}
            {BackClick === true && <Redirect to='./InfoAboutConfiguration'/>}

        </div>



    );
}


export default UpdateConfiguration;


