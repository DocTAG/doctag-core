import '../../App.css';
import {AppContext} from '../../App';
import React, {useState, useEffect, useContext, createContext} from "react";
import '../SideComponents/compStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import {Container,Row,Col} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import './conf.css';
import {
    BrowserRouter as Router,
    Switch,
    useRouteMatch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import '../General/first_row.css';

import SelectMenu from "../SelectMenu/SelectMenu";
import {
    faArrowLeft, faDownload, faTimes, faBars, faMagic
} from "@fortawesome/free-solid-svg-icons";
import SideBar from "../General/SideBar";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import ConfigureResult from "./ConfigureResult";
import {keys} from "@material-ui/core/styles/createBreakpoints";


export const ConfigureContext = createContext('')

function Configure() {


    const { admin,showbar,username,usecaseList,reports,languageList,instituteList } = useContext(AppContext);
    const [AutoUses,SetAutoUses] = useState([])
    const [ShowModalToComplete,SetShowModalToComplete] = useState(false)
    const [Username,SetUsername] = username;
    const [Reports,SetReports] = reports;
    const [Admin,SetAdmin] = admin;
    const [OnlyPub,SetOnlyPub] = useState(false)
    const [AutoDocTAGReports,SetAutoDocTAGReports] = useState(false)
    const [LoadingAnnoResp,SetLoadingAnnoResp] = useState(false)
    const [UsesInserted,SetUsesInserted] = useState([])
    const [PubMedUsesInserted,SetPubMedUsesInserted] = useState([])
    const [BackClick, SetBackClick] = useState(false)
    const [Keys, SetKeys] = useState([])
    const [WarningMessage, SetWarningMessage] = useState('')
    const [DisConfirm,SetDisConfirm] = useState(true)
    const [ShowModalAuto,SetShowModalAuto] = useState(false)
    const [CheckUsername,SetCheckUsername] = useState(0)
    const [CheckTfIdf,SetCheckTfIdf] = useState(0)
    const [CheckReport,SetCheckReport] = useState(0)
    const [CheckTopic,SetCheckTopic] = useState(0)
    const [CheckRuns,SetCheckRuns] = useState(0)
    const [CheckLabels,SetCheckLabels] = useState(0)
    const [CheckConcept,SetCheckConcept] = useState(0)
    const [CheckPubMed,SetCheckPubMed] = useState(0)
    const [CheckJsonDisp,SetCheckJsonDisp] = useState(0)
    const [CheckJsonAnn,SetCheckJsonAnn] = useState(0)
    const [LoadExaConcepts,SetLoadExaConcepts] = useState(false)
    const [AutoAnno,SetAutoAnno] = useState(false)
    // const [ShowExaConcepts,SetShowExaConcepts] = useState(true)
    // const [ShowExaLabels,SetShowExaLabels] = useState(true)
    const [FieldsUseCasesToExtract,SetFieldsUseCasesToExtract] = useState(false)
    const [LoadExaLabels,SetLoadExaLabels] = useState(false)
    const [Disabled,SetDisabled] = useState(true)
    const [Message, SetMessage] = useState('')
    const [ErrorMessage, SetErrorMessage] = useState('')
    const [AutoAnnoCompleted,SetAutoAnnoCompleted] = useState(false)
    const [LoadingResponse, SetLoadingResponse] = useState(false)
    const [SaveData, SetSaveData] = useState(false)
    const [ShowConfirm, SetShowConfirm] = useState(false)
    const [Missing,SetMissing] = useState('')
    const [FormToSend,SetFormToSend] = useState('')
    const [ShowConceptExample,SetShowConceptExample] = useState(false)
    const [ShowReportExample,SetShowReportExample] = useState(false)
    const [ShowLabelExample,SetShowLabelExample] = useState(false)
    const [ShowPubMedExample,SetShowPubMedExample] = useState(false)
    const [ShowDeletePubMed,SetShowDeletePubMed] = useState(false)
    const [PubMedMissingAuto,SetPubMedMissingAuto] = useState({})
    const [WarningReport,SetWarningReport] = useState(0)
    const [WarningTopic,SetWarningTopic] = useState(0)
    const [WarningRuns,SetWarningRuns] = useState(0)
    const [WarningPubMed,SetWarningPubMed] = useState(0)
    const [WarningLabels,SetWarningLabels] = useState(0)
    const [WarningConcept,SetWarningConcept] = useState(0)
    const [WarningJsonDisp,SetWarningJsonDisp] = useState('')
    const [WarningJsonAnn,SetWarningJsonAnn] = useState(0)
    const [AutoPub,SetAutoPub] = useState(0)
    const [ShowDeleteReports,SetShowDeleteReports] = useState(false)
    const [ShowDeleteLabels,SetShowDeleteLabels] = useState(false)
    const [ShowDeleteConcepts,SetShowDeleteConcepts] = useState(false)
    const [ShowDeleteRuns,SetShowDeleteRuns] = useState(false)
    const [ShowDeleteTopic,SetShowDeleteTopic] = useState(false)
    const [GeneralMessage,SetGeneralMessage] = useState('')
    const [FinalMessage,SetFinalMessage] = useState('')
    const [LoadingPubMedResp,SetLoadingPubMedResp] = useState(false)
    const [AutoPubMedCompleted,SetAutoPubMedCompleted] = useState(false)
    const [AutoMessage,SetAutoMessage] = useState('')
    const [PubMessage,SetPubMessage] = useState('')
    const [ErrorAutoMessage,SetErrorAutoMessage] = useState('')
    const [ErrorPubMessage,SetErrorPubMessage] = useState('')
    var FileDownload = require('js-file-download');


    function handleCloseToComplete(){
        SetShowModalToComplete(false)
        SetFinalMessage('')
        SetWarningReport(0)
        SetWarningPubMed(0)
        SetWarningLabels(0)
        SetWarningConcept(0)
        SetWarningRuns(0)
        SetWarningTopic(0)
        SetWarningJsonDisp('')
        SetGeneralMessage('')
        SetCheckJsonAnn(0)
        SetCheckJsonDisp(0)
        SetCheckLabels(0)
        SetCheckRuns(0)
        SetCheckTopic(0)
        SetCheckPubMed(0)
        SetCheckTfIdf(0)
        SetCheckConcept(0)
        SetCheckUsername(0)
        SetCheckReport(0)
        SetWarningJsonAnn(0)
    }
    useEffect(()=>{
        if(LoadingResponse === false){
            window.scrollTo(0,0)
        }
    },[LoadingResponse])

    useEffect(()=>{
        window.scrollTo(0, 0)
        SetCheckReport(0)
        SetCheckUsername(0)
        SetCheckPubMed(0)
        SetCheckLabels(0)
        SetCheckConcept(0)
        SetCheckRuns(0)
        SetCheckTfIdf(0)
        SetCheckTopic(0)
        SetMissing('')
        SetCheckJsonDisp(0)
        SetCheckJsonAnn(0)
        if(Admin !== '' && Username !== 'Test'){
            SetCheckUsername(true)
        }
    },[])

    function onCheckAll(e){
        e.preventDefault()
        SetGeneralMessage('')
        SetFinalMessage('')
        var input = ''
        var formData = new FormData();

        if(Admin === '' && Username === 'Test') {
            input = document.getElementById('formBasicUsername');
            // console.log('test input', input.value)
            var username = input.value
            formData.append('username', username);

            input = document.getElementById('formBasicPassword');
            // console.log('test input', input.value)
            var password = input.value
            formData.append('password', password);
        }
        input = document.getElementById('tfidf_form');
        // console.log('test input', input.value)
        var tfidf = input.value
        formData.append('tfidf', tfidf);

        input = document.getElementById('documents_form');
        // console.log('test input',input.files)
        if(input.files[0] !== undefined || input.files[0] !== null) {
            for (let ind = 0; ind < input.files.length; ind++) {
                var name = 'reports' + ind.toString()
                formData.append(name, input.files[ind]);
            }
        }
        input = document.getElementById('topic_form');
        // console.log('test input',input.files)
        if(input.files[0] !== undefined || input.files[0] !== null) {
            for (let ind = 0; ind < input.files.length; ind++) {
                var name = 'topic' + ind.toString()
                formData.append(name, input.files[ind]);
            }
        }
        input = document.getElementById('runs_form');
        // console.log('test input',input.files)
        if(input.files[0] !== undefined || input.files[0] !== null) {
            for (let ind = 0; ind < input.files.length; ind++) {
                var name = 'runs' + ind.toString()
                formData.append(name, input.files[ind]);
            }
        }
        input = document.getElementById('pubmed_form');
        // console.log('test input',input.files)
        if(input.files[0] !== undefined || input.files[0] !== null) {
            for (let ind = 0; ind < input.files.length; ind++) {
                var name = 'pubmed' + ind.toString()
                formData.append(name, input.files[ind]);
            }
        }

        input = document.getElementById('concepts_form');
        // if(ShowExaConcepts === false){
        if(input.files[0] !== undefined || input.files[0] !== null) {

            for (let ind = 0; ind < input.files.length; ind++) {
                var name = 'concepts' + ind.toString()
                formData.append(name, input.files[ind]);
            }
        }

        // }

       input = document.getElementById('labels_form');
        // if(ShowExaLabels === false){
        if(input.files[0] !== undefined || input.files[0] !== null) {
            for (let ind=0; ind<input.files.length; ind++) {
                var name = 'labels' + ind.toString()
                formData.append(name, input.files[ind]);
            }
            // }
        }

        // SetCheckJsonDisp(0)
        // SetCheckJsonAnn(0)
        var displayed = []
        var annotate = []
        if(Keys.length > 1){
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
        }
        else if(Keys.length === 1){
            annotate.push(Keys[0])
        }


        formData.append('json_disp', displayed);
        formData.append('json_ann', annotate);
        // if(LoadExaConcepts === true){
        //     formData.append('exa_concepts', [...new Set(UsesInserted.concat(PubMedUsesInserted))]);
        // }
        // if(LoadExaLabels === true){
        //     formData.append('exa_labels', [...new Set(UsesInserted.concat(PubMedUsesInserted))]);
        // }

        axios({
            method: "post",
            url: "check_input_files",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })

            .then(function (response) {
                var error = ''
                var err = false
                var gen = false
                var pub = false
                // console.log('message', response.data);
                // console.log('general_message',response.data['general_message'])
                if(!response.data['general_message'].startsWith('PUBMED') && (response.data['general_message'] !== '' && response.data['general_message'] !== 'Ok')){
                    SetFinalMessage(response.data['general_message'])
                    gen = true
                }

                if (response.data['general_message'].startsWith('PUBMED')){
                    pub = true
                }

                if (response.data['pubmed_message'] === 'Ok'  ) {
                    SetCheckPubMed(true)
                }
                else if (response.data['pubmed_message']===''){
                    SetCheckPubMed(0)
                }
                else if(response.data['pubmed_message'].includes('WARNING')){
                    SetWarningPubMed(response.data['pubmed_message'])
                }
                else {
                    error = response.data['pubmed_message']
                    SetCheckPubMed(error)
                    err = true
                    input = document.getElementById('pubmed_form');
                    if (input.files[0] !== undefined && input.files[0] !== null) {
                        input.value = null
                        SetShowDeletePubMed(false)
                        SetPubMedUsesInserted([])
                    }
                }
                if (response.data['report_message'] === 'Ok') {
                    SetCheckReport(true)
                }
                else if (response.data['report_message'] === ''){
                    SetCheckReport(0)
                }
                else if(response.data['report_message'].includes('WARNING')){
                    SetWarningReport(response.data['report_message'])
                }
                else {
                    error = response.data['report_message']
                    SetCheckReport(error)
                    err = true
                    input = document.getElementById('documents_form');
                    if (input.files[0] !== undefined && input.files[0] !== null) {
                        input.value = null
                        SetShowDeleteReports(false)
                        SetKeys([])
                        SetUsesInserted([])
                    }
                }
                if (response.data['username_message'] === 'Ok') {
                    SetCheckUsername(true)

                }
                else {
                    error = response.data['username_message']
                    SetCheckUsername(error)
                    err = true
                }

                if (response.data['concept_message'] === 'Ok') {
                    SetCheckConcept(true)
                }
                else if(response.data['concept_message'].includes('WARNING')){
                    SetWarningConcept(response.data['concept_message'])
                }
                else if (response.data['concept_message'] === '') {
                    SetCheckConcept(0)

                }
                else {
                    error = response.data['concept_message']
                    SetCheckConcept(error)
                    err = true
                    input = document.getElementById('concepts_form');
                    // if(ShowExaConcepts === false){
                    if(input.files[0] !== undefined && input.files[0] !== null) {
                        input.value = null
                        SetShowDeleteConcepts(false)

                    }
                }

                if (response.data['label_message'] === 'Ok') {
                    SetCheckLabels(true)

                }
                else if (response.data['label_message'] === '') {
                    SetCheckLabels(0)

                }
                else if(response.data['label_message'].includes('WARNING')){
                    // console.log('warninglabels')
                    SetWarningLabels(response.data['label_message'])
                }
                else {
                    error = response.data['label_message']
                    input = document.getElementById('labels_form');
                    // if(ShowExaLabels === false){
                    if(input.files[0] !== undefined && input.files[0] !== null) {
                        input.value = null
                        SetShowDeleteLabels(false)
                        // }
                    }
                    SetCheckLabels(error)
                    err = true
                }

                if (response.data['runs_message'] === 'Ok') {
                    SetCheckRuns(true)

                }
                else if (response.data['runs_message'] === '') {
                    SetCheckRuns(0)

                }
                else if(response.data['runs_message'].includes('WARNING')){
                    // console.log('warninglabels')
                    SetWarningRuns(response.data['runs_message'])
                }
                else {
                    error = response.data['runs_message']
                    input = document.getElementById('runs_form');
                    // if(ShowExaLabels === false){
                    if(input.files[0] !== undefined && input.files[0] !== null) {
                        input.value = null
                        SetShowDeleteRuns(false)
                        // }
                    }
                    SetCheckRuns(error)
                    err = true
                }
                if (response.data['topic_message'] === 'Ok') {
                    SetCheckTopic(true)

                }
                else if (response.data['topic_message'] === '') {
                    SetCheckTopic(0)

                }
                else if(response.data['topic_message'].includes('WARNING')){
                    // console.log('warninglabels')
                    SetWarningTopic(response.data['topic_message'])
                }
                else {
                    error = response.data['topic_message']
                    input = document.getElementById('topic_form');
                    // if(ShowExaLabels === false){
                    if(input.files[0] !== undefined && input.files[0] !== null) {
                        input.value = null
                        SetShowDeleteTopic(false)
                        // }
                    }
                    SetCheckTopic(error)
                    err = true
                }
                if (response.data['tfidf_message'] === 'Ok') {
                    SetCheckTfIdf(true)

                }
                else if (response.data['tfidf_message'] === '') {
                    SetCheckTfIdf(0)

                }

                else {
                    error = response.data['tfidf_message']

                    SetCheckTfIdf(error)
                    err = true
                }
                if (response.data['fields_message'] === 'Ok') {
                    SetWarningJsonDisp('')
                    SetWarningJsonAnn('')
                    SetCheckJsonDisp(true)
                    if (annotate.length > 0) {
                        SetCheckJsonAnn(true)

                    }
                } else if (response.data['fields_message'].includes('WARNING')) {
                    // if(token === 'json_fields'){
                    SetWarningJsonDisp(response.data['fields_message'])
                    // }
                } else if (response.data['fields_message']==='') {
                    SetCheckJsonDisp(0)
                    SetCheckJsonAnn(0)
                } else {
                    error = response.data['fields_message']
                    SetCheckJsonDisp(error)
                    SetCheckJsonAnn(error)
                    SetWarningJsonAnn('')
                    SetWarningJsonDisp('')
                    err = true
                }
                console.log('gen',gen)
                console.log('err',err)
                console.log('pub',pub)
                if(err === false && gen === false && pub === false){
                    SetFinalMessage('OK. All the files uploaded are compliant to the required format. You can proceed and confirm.')
                }
                else if(err === false && gen === false && pub === true){
                    SetFinalMessage('OK. You inserted PubMED files without concepts and labels. Keep in mind that only mention annotation will be available. You can proceed and confirm.')

                }

                else if((gen === false && err === true) || (gen === true && err === false)){
                    SetFinalMessage('ERROR. An error occurred. Check the message below the files you have inserted.')

                }


            })
            .catch(function (error) {
                console.log('error message', error);
            });



    }



    useEffect(()=>{
        if(FinalMessage === '' || !FinalMessage.includes('OK')){
            SetDisConfirm(true)
        }
        else{
            SetDisConfirm(false)
        }


    },[CheckUsername,CheckConcept,CheckLabels,CheckReport,CheckPubMed,CheckJsonAnn,CheckJsonDisp,FinalMessage])



    function onAdd(e){
        e.preventDefault()
        if(DisConfirm === true){
            SetShowModalToComplete(true)
        }

        else{
            // console.log('trying to add')
            var input = ''
            var input1 = ''
            var reports = ''
            var labels = ''
            var concepts = ''
            var usecase = ''
            var areas = ''
            var json_disp = ''
            var json_ann = ''
            var miss_files = []
            var miss_json = []
            var formData = new FormData();
            if(Admin === '' && Username === 'Test'){
                input = document.getElementById('formBasicUsername');
                // console.log('test input',input.value)
                var username = input.value
                formData.append('username', username);

                input = document.getElementById('formBasicPassword');
                // console.log('test input',input.value)
                var password = input.value

                formData.append('password', password);
            }
            input = document.getElementById('documents_form');
            // console.log('test input',input.files)
            for (let ind=0; ind<input.files.length; ind++) {
                var name = 'reports' + ind.toString()
                formData.append(name, input.files[ind]);

            }
            input = document.getElementById('topic_form');
            // console.log('test input',input.files)
            if(input.files[0] !== undefined || input.files[0] !== null) {
                for (let ind = 0; ind < input.files.length; ind++) {
                    var name = 'topic' + ind.toString()
                    formData.append(name, input.files[ind]);
                }
            }
            input = document.getElementById('runs_form');
            // console.log('test input',input.files)
            if(input.files[0] !== undefined || input.files[0] !== null) {
                for (let ind = 0; ind < input.files.length; ind++) {
                    var name = 'runs' + ind.toString()
                    formData.append(name, input.files[ind]);
                }
            }
            input1 = document.getElementById('pubmed_form');
            // console.log('test input',input.files)
            for (let ind=0; ind<input1.files.length; ind++) {
                var name = 'pubmed' + ind.toString()
                formData.append(name, input1.files[ind]);

            }
            if(input.files[0] === undefined || input.files[0] === null){
                miss_files.push('Reports')
            }
            if(input1.files[0] === undefined || input1.files[0] === null){
                miss_files.push('PubMed')
            }


            input = document.getElementById('concepts_form');
            for (let ind=0; ind<input.files.length; ind++) {
                var name = 'concepts' + ind.toString()
                formData.append(name, input.files[ind]);
            }
            if(LoadExaConcepts===false){

                if(input.files[0] === undefined || input.files[0] === null){
                    miss_files.push('Concepts')
                }
            }

            input = document.getElementById('labels_form');

            for (let ind=0; ind<input.files.length; ind++) {
                var name = 'labels' + ind.toString()
                formData.append(name, input.files[ind]);
            }
            if(LoadExaLabels===false){
                if(input.files[0] === undefined || input.files[0] === null){
                    miss_files.push('Labels')
                    //SetMissing('REPORT FILE')
                }
            }

            // console.log('input files', input.files)



            var displayed = []
            var annotate = []
            var hide = []
            if(Keys.length > 1){
                Keys.map(key=>{
                    hide.push(key)
                    var radios = document.getElementsByName(key);
                    for(let i = 0; i < radios.length; i++ ) {
                        if( radios[i].checked ) {
                            if(radios[i].value === 'display'){
                                displayed.push(key)
                            }
                            else if(radios[i].value === 'both'){
                                annotate.push(key)

                            }
                        }
                    }

                })
            }
            else if(Keys.length === 1){
                annotate.push(Keys[0])
            }

            if(displayed.length === 0 && Keys.length > 1){
                miss_json.push('fields to display')
            }
            if(annotate.length === 0 && Keys.length > 1){
                miss_json.push('fields to annotate')
            }
            // console.log('disp',displayed)
            // console.log('disp',annotate)
            formData.append('json_disp', displayed);
            formData.append('json_ann', annotate);
            formData.append('json_all', hide);
            input = document.getElementById('tfidf_form');
            // console.log('test input', input.value)
            var tfidf = input.value
            formData.append('tfidf', tfidf);            // if(LoadExaConcepts ===true){
            //     formData.append('exa_concepts', [...new Set(UsesInserted.concat(PubMedUsesInserted))])
            // }
            // if(LoadExaLabels===true){
            //     formData.append('exa_labels', [...new Set(UsesInserted.concat(PubMedUsesInserted))])
            // }
            SetFormToSend(formData)


            if(miss_json.length > 0 && miss_files.length>0){
                var new_json = miss_json.join(", ")
                var new_files = miss_files.join(", ")
                SetMissing('You did not inserted the: ' + new_json + ' and the: ' + new_files + ' files.')
                // SetMissing('You did not inserted the: ' + new_json + ' fields and the: ' + new_files + ' files.')
            }
            else if(miss_json.length > 0){
                var new_json = miss_json.join(", ")
                SetMissing('You did not inserted the: ' + new_json + ' files.')
            }
            else if(miss_files.length >0){
                var new_files = miss_files.join(", ")
                SetMissing('You did not inserted the: ' + new_files + ' files.')
                // SetMissing('You did not inserted the: ' + new_files + ' files.')
            }
            else if(miss_json.length === 0 && miss_files.length === 0){
                SetMissing(false)
            }


            if(miss_json.length > 0 || miss_files.length > 0){
                SetShowConfirm(true)

            }
            else if(miss_json.length === 0 && miss_files.length === 0){
                SetSaveData(true)
                SetShowConfirm(false)
            }

        }

    }

    function handleClose(){
        // console.log('logmissing',Missing)
        // console.log('logmissing',FormToSend)
        SetShowConfirm(false)
        SetFinalMessage('')
        SetWarningReport(0)
        SetWarningPubMed(0)
        SetWarningLabels(0)
        SetWarningConcept(0)
        SetWarningJsonDisp('')
        SetWarningJsonAnn(0)
        SetGeneralMessage('')
        SetCheckJsonAnn(0)
        SetCheckPubMed(0)
        SetCheckJsonDisp(0)
        SetCheckLabels(0)
        SetCheckConcept(0)
        SetCheckUsername(0)
        SetCheckReport(0)
    }


    useEffect(()=>{
        window.scroll(0,0)
        if(SaveData === true && DisConfirm === true ){
            SetShowModalToComplete(true)
        }
        else if(SaveData === true && FormToSend !== ''){
            SetLoadingResponse(true)

            axios({
                method: "post",
                url: "configure_db",
                data: FormToSend,
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(function (response) {
                    // console.log(response)
                    if(response.data['message'] !== undefined){
                        SetLoadingResponse(false)
                        SetMessage('DocTAG has been correctly configured.')
                        axios.get("get_usecase_inst_lang").then(response => {
                            var arr = []
                            response.data['usecase'].map(use=>{
                                if(use.toLowerCase() === 'colon' || use.toLowerCase() === 'lung' || use.toLowerCase().includes('uterine') || use.toLowerCase().includes('cervix')){
                                    arr.push(use)
                                }
                            });
                            if(arr.length>0){
                                SetShowModalAuto(true)
                                SetAutoUses(arr)
                            }


                        })

                    }
                    else if(response.data['warning'] !== undefined) {
                        SetLoadingResponse(false)
                        SetWarningMessage(response.data['warning'])
                    }

                    else if(response.data['error'] !== undefined){
                        SetLoadingResponse(false)
                        var message = response.data['error'] + ' If you checked the files and were correct, the problem might be related to the database; check that all the mandatory fields are correctly inserted. Check that all the use cases and semantic areas are correctly written in all the files which include them.'
                        SetErrorMessage(message)

                    }

                })
                .catch(function (error) {
                    console.log(error);


                });

        }
    },[SaveData])



    function onSaveExample(e,token){
        e.preventDefault()
        axios.get('download_examples', {params:{token:token}})
                .then(function (response) {

                    if(token === 'reports'){
                        FileDownload((response.data), 'reports_example.csv');
                    }
                    else if(token === 'pubmed'){
                        FileDownload((response.data), 'pubmed_example.csv');
                    }
                    else if(token === 'concepts'){
                        FileDownload((response.data), 'concepts_example.csv');
                    }
                    else if(token === 'labels'){
                        FileDownload((response.data), 'labels_example.csv');
                    }
                    else if(token === 'topic'){
                        FileDownload((response.data), 'labels_example.csv');
                    }
                    else if(token === 'runs'){
                        FileDownload((response.data), 'labels_example.csv');
                    }


                })
                .catch(function (error) {
                    console.log('error message', error);
                });

        }

    function deleteInput(e,token){
        e.preventDefault()
        SetGeneralMessage('')
        SetFinalMessage('')
        var input = ''
        if(token === 'concepts'){
            SetCheckConcept(0);
            input = document.getElementById('concepts_form');
            // console.log('current',input)
            // if(ShowExaConcepts===false){
            if(input.files[0] !== undefined && input.files[0] !== null){
                input.value = null
                SetWarningConcept(0)

                SetShowDeleteConcepts(false)
                // SetShowExaConcepts(true)
                // console.log('current',input)

            }
            // }
        }
        else if(token === 'topics'){
            SetCheckTopic(0);
            input = document.getElementById('topic_form');
            // console.log('current',input)
            // if(ShowExaConcepts===false){
            if(input.files[0] !== undefined && input.files[0] !== null){
                input.value = null
                SetWarningTopic(0)

                SetShowDeleteTopic(false)
                // SetShowExaConcepts(true)
                // console.log('current',input)

            }
            // }
        }
        else if(token === 'runs'){
            SetCheckRuns(0);
            input = document.getElementById('runs_form');
            // console.log('current',input)
            // if(ShowExaConcepts===false){
            if(input.files[0] !== undefined && input.files[0] !== null){
                input.value = null
                SetWarningTopic(0)

                SetShowDeleteTopic(false)
                // SetShowExaConcepts(true)
                // console.log('current',input)

            }
            // }
        }


        else if(token === 'labels'){
            SetCheckLabels(0);
            input = document.getElementById('labels_form');
            // console.log('current',input)
            // if(ShowExaLabels===false){
            if(input.files[0] !== undefined && input.files[0] !== null){
                input.value = null
                SetWarningLabels(0)

                SetShowDeleteLabels(false)
                // SetShowExaLabels(true)
                // console.log('current',input)

            }
            // }
        }
        else if(token === 'reports'){
            SetCheckReport(0);
            input = document.getElementById('documents_form');
            // console.log('current',input)

            if(input.files[0] !== undefined && input.files[0] !== null){
                input.value = null
                // console.log('current',input)
                SetShowDeleteReports(false)
                SetKeys([])
                SetCheckJsonAnn(0)
                SetCheckJsonDisp(0)
                SetWarningJsonDisp('')
                SetWarningJsonAnn(0)
                SetWarningReport(0)
                SetUsesInserted([])
            }

        }

        else if(token === 'pubmed'){
            SetCheckPubMed(0);
            input = document.getElementById('pubmed_form');
            // console.log('current',input)

            if(input.files[0] !== undefined && input.files[0] !== null){
                input.value = null
                // console.log('current',input)
                SetShowDeletePubMed(false)

                SetWarningPubMed(0)
                SetPubMedUsesInserted([])
            }

        }



    }



    function showKeys(){
        var formData = new FormData()
        var input = document.getElementById('documents_form');
        // console.log('current',input)
        for (let ind=0; ind<input.files.length; ind++) {
            var name = 'reports' + ind.toString()
            formData.append(name, input.files[ind]);

        }
        axios({
            method: "post",
            url: "get_keys_and_uses_from_csv",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                // console.log(response)
                SetKeys(response.data['keys'])
                // SetUsesInserted(response.data['uses'])

            })
            .catch(function (error) {
                console.log('error message', error);
            });

    }

    // function get_uses_pubmed(){
    //     var formData = new FormData()
    //     var input = document.getElementById('pubmed_form');
    //     // console.log('current',input)
    //     for (let ind=0; ind<input.files.length; ind++) {
    //         var name = 'pubmed' + ind.toString()
    //         formData.append(name, input.files[ind]);
    //
    //     }
    //     axios({
    //         method: "post",
    //         url: "get_keys_and_uses_from_csv",
    //         data: formData,
    //         headers: { "Content-Type": "multipart/form-data" },
    //     })
    //         .then(function (response) {
    //             // console.log(response)
    //             SetPubMedUsesInserted(response.data['uses'])
    //
    //         })
    //         .catch(function (error) {
    //             console.log('error message', error);
    //         });
    //
    // }

    function showDelete(event,token){
        event.preventDefault()
        if(token === 'reports'){
            var input = document.getElementById('documents_form');
            if(input.files[0] !== undefined && input.files[0] !== null){
                SetShowDeleteReports(true)

                SetCheckConcept(0)
                SetCheckLabels(0)
                SetCheckRuns(0)
                SetCheckTopic(0)
                SetWarningLabels(0)
                SetWarningConcept(0)
                SetWarningReport(0)
                SetWarningTopic(0)
                SetWarningRuns(0)
            }
        }
        else if(token === 'topics'){
            var input = document.getElementById('topic_form');
            if(input.files[0] !== undefined && input.files[0] !== null){
                SetShowDeleteTopic(true)
                SetWarningTopic(0)

            }
        }
        else if(token === 'runs'){
            var input = document.getElementById('runs_form');
            if(input.files[0] !== undefined && input.files[0] !== null){
                SetShowDeleteRuns(true)
                SetWarningRuns(0)

            }
        }
        else if(token === 'concepts'){
            var input = document.getElementById('concepts_form');
            // if(ShowExaConcepts === false){
            if(input.files[0] !== undefined && input.files[0] !== null){
                SetShowDeleteConcepts(true)
                SetWarningConcept(0)

            }
            // }

        }
        else if(token === 'labels'){
            var input = document.getElementById('labels_form');
            // if(ShowExaLabels===false){
            if(input.files[0] !== undefined && input.files[0] !== null){
                SetShowDeleteLabels(true)
                SetWarningLabels(0)
            }
            // }

        }
        else if(token === 'pubmed'){
            var input = document.getElementById('pubmed_form');
            if(input.files[0] !== undefined && input.files[0] !== null){
                SetShowDeletePubMed(true)
                SetCheckConcept(0)
                SetCheckLabels(0)
                SetCheckTopic(0)
                SetCheckRuns(0)
                SetCheckTfIdf(0)
                SetWarningLabels(0)
                SetWarningConcept(0)
                SetWarningReport(0)
                SetWarningTopic(0)
                SetWarningRuns(0)
            }

        }
    }

    return (
        <div className="App">
            <ConfigureContext.Provider value={{pubmedusesinserted:[PubMedUsesInserted,SetPubMedUsesInserted],fieldsextra:[FieldsUseCasesToExtract,SetFieldsUseCasesToExtract],usesinserted:[UsesInserted,SetUsesInserted],errormessage:[ErrorMessage,SetErrorMessage],message:[Message,SetMessage],loadingresponse:[LoadingResponse,SetLoadingResponse],warningmessage:[WarningMessage,SetWarningMessage]}}
            >

            {(LoadingResponse === false && Message === '' && ErrorMessage === '' && WarningMessage === '') ? <div >
                <Container fluid>
                    <Row>
                        <Col md={4}>
                            <Button className='back-button' onClick={(e)=>SetBackClick(true)}><FontAwesomeIcon icon={faArrowLeft} />Back to info</Button>
                        </Col>
                        <Col md={8}></Col>
                    </Row>
                    <div>
                    <h2 style={{'margin-top':'30px','margin-bottom':'30px','text-align':'center'}}>Configure DocTAG with your data</h2>
                    <div>
                        Please, provide us with all the files and information required to customize the application. <br/>
                        Follow these instructions:
                        <ul>
                            {/*<li>Click on <span><Button variant="info" size='sm'>Example</Button></span> to see an example of a file accepted by the database.</li>*/}
                            <li>Add the files required. You can add multiple files at once if they are in the same folder.</li>
                            <li>Click on <span><Button variant="primary" size='sm'>Check</Button></span> to control if the file (or information) you provided complies with the requirements.</li>
                            <li>Once you have checked all the files and information you want to insert, it will be displayed an “OK” under each file you provided if they are correct, or a warning, if there is something you should pay attention to. Click on <span><Button variant="success" size='sm'>Confirm</Button></span> to insert the data into the database. If some errors occurred, you will be informed. In this case, you have to correct the errors before confirm. <span style={{'font-weight':'bold'}}>If you did not insert the <i>Collection</i>,<i>Topic</i>,<i>Runs</i>, <i>Basic information</i> (if required) and <i>Labels</i>, you will not be able to confirm.</span></li>

                        </ul>

                        <hr/>

                        <div>
                            <Form>
                                {Admin === '' && Username === 'Test' && <div><Form.Group controlId="formBasicUsername">
                                    <div>
                                        <h3>Basic information</h3>
                                        <div>Select a username and a password, once you selected a username check it in
                                            order to see if it is available.
                                        </div>
                                    </div>
                                    <div>Username</div>
                                    <Form.Control type="text" placeholder="Select a username..."/>
                                </Form.Group>
                                    <Form.Group controlId="formBasicPassword">
                                        <div>Password</div>
                                        <Form.Control type="password" placeholder="Select a password..."/>
                                    </Form.Group>

                                    <div>You are the admin, this means that you are the only one who can change
                                        configuration files.
                                    </div>
                                    {CheckUsername !== 0 && <div>
                                        {(CheckUsername === true && CheckUsername !== 0) ?
                                            <div style={{'color': 'green'}}>The username and password are OK</div> :
                                            <div style={{'color': 'red'}}><span>The username and/or the password contain some errors: </span><span>{CheckUsername}</span>
                                            </div>}

                                    </div>}
                                    <hr/>
                                </div>}

                                    <div>
                                        <div><h3>Top k TF-IDF words</h3></div>
                                        <div>Select the top-k words with the highest TF-IDF score in the topic-document pairs. Clicking on the <FontAwesomeIcon icon={faMagic}/> above the document's corpus allows you to check what words had a high tf-idf score. <b>This function is available exclusively for the english language. <br/> PAY ATTENTION: setting this parameter will slow down the configuration process, if you do not want to set this parameter, put 0 and the process to find the top-k tf-idf words will be disabled.</b> </div>
                                        <Form.Group controlId="tfidf_form">
                                            <Form.Control type="text" placeholder="Select a number..." />
                                        </Form.Group>
                                        {CheckTfIdf !== 0 && <div>
                                            {(CheckTfIdf === true ) ? <div style={{'color':'green'}}>OK</div> : <div style={{'color':'red'}}><span>The file contains some errors: </span><span>{CheckTfIdf}</span></div>}

                                        </div>}
                                    </div>
                                    <hr/>




                                <div><h3>Topics <i style={{'font-size':'1rem'}}>(Mandatory)</i></h3></div>

                                <Form.Group style={{'margin-top':'20px','margin-bottom':'20px'}}>
                                    <div><span>Insert here the files with the topics.</span><br/>
                                        {/*<div className='conf-div'>*/}
                                        {/*    <Button onClick={()=>SetShowReportExample(prev=>!prev)} variant="info" size='sm'>Example</Button>*/}
                                        {/*</div>*/}
                                    </div>
                                    {/*<div style={{marginBottom:'2%',fontSize:'0.9rem'}}><i>Please, make sure the ids of the reports you insert do not start with "pubmed" and the institutes you insert are different from "pubmed".</i></div>*/}
                                    <Form.File id="topic_form" onClick={(e) => {(e.target.value = null);SetGeneralMessage('');SetFinalMessage('');SetShowDeleteTopic(false);SetCheckTopic(0);SetCheckRuns(0);SetWarningTopic(0);}} onChange={(e)=>{showDelete(e,'topics');}} multiple/>
                                    {ShowDeleteTopic === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e,'topics')}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}

                                </Form.Group>
                                {CheckTopic !== 0 && <div>
                                    {(CheckTopic === true ) ? <div style={{'color':'green'}}>OK</div> : <div style={{'color':'red'}}><span>The file contains some errors: </span><span>{CheckTopic}</span></div>}

                                </div>}

                                <hr/>
                                <div><h3>Runs <i style={{'font-size':'1rem'}}>(Mandatory)</i></h3></div>

                                <Form.Group style={{'margin-top':'20px','margin-bottom':'20px'}}>
                                    <div><span>Insert here the files with the runs (i.e. - the files containing for each topic the associated documents). The allowed formats are: TREC, csv, json, txt.</span><br/>
                                        <div><b>NOTE: If you are uploading a run file whose document_id are PUBMED IDS, please, before the pubmed id put "PUBMED_". For example if your PubMed id is 123, in the run this will be: PUBMED_123</b></div>
                                        <div><b>NOTE: If you are uploading a run file whose document_id are PUBMED IDS, defining a language is not allowed, the language considered is <i>english</i> and it is set by default.</b></div>
                                        {/*<div className='conf-div'><Button onClick={()=>SetShowReportExample(prev=>!prev)} variant="info" size='sm'>Example</Button>*/}
                                        {/*</div>*/}
                                    </div>
                                    {/*<div style={{marginBottom:'2%',fontSize:'0.9rem'}}><i>Please, make sure the ids of the reports you insert do not start with "pubmed" and the institutes you insert are different from "pubmed".</i></div>*/}
                                    <Form.File id="runs_form" onClick={(e) => {(e.target.value = null);SetGeneralMessage('');SetFinalMessage('');SetShowDeleteRuns(false);SetCheckRuns(0);SetWarningRuns(0);}} onChange={(e)=>{showDelete(e,'runs');}} multiple/>
                                    {ShowDeleteRuns === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e,'runs')}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}

                                </Form.Group>
                                {CheckRuns !== 0 && <div>
                                    {(CheckRuns === true ) ? <div style={{'color':'green'}}>OK</div> : <div style={{'color':'red'}}><span>The file contains some errors: </span><span>{CheckRuns}</span></div>}

                                </div>}

                                <hr/>

                                <div><h3>Documents collection <i style={{'font-size':'1rem'}}>(Mandatory)</i></h3></div>

                                <Form.Group style={{'margin-top':'20px','margin-bottom':'20px'}}>
                                    <div><span>Insert here the files with the documents.</span><br/>
                                    <div>You can upload one or more archives (<b>.zip</b> is allowed) containing json or csv files, one or more txt files, a flat json file or a csv</div>
                                        {/*<div className='conf-div'>*/}
                                        {/*    <Button onClick={()=>SetShowReportExample(prev=>!prev)} variant="info" size='sm'>Example</Button></div>*/}
                                    </div>
                                    {/*<div style={{marginBottom:'2%',fontSize:'0.9rem'}}><i>Please, make sure the ids of the reports you insert do not start with "pubmed" and the institutes you insert are different from "pubmed".</i></div>*/}
                                    <Form.File id="documents_form" onClick={(e) => {(e.target.value = null);SetGeneralMessage('');SetFinalMessage('');SetShowDeleteReports(false);SetCheckReport(0);SetCheckJsonAnn(0);SetWarningReport(0);SetCheckJsonDisp(0);SetWarningJsonDisp('');SetLoadExaConcepts(false);SetLoadExaLabels(false);SetCheckPubMed(0);SetUsesInserted([]);SetKeys([])}} onChange={(e)=>{showKeys();showDelete(e,'reports');}} multiple/>
                                    {ShowDeleteReports === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e,'reports')}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}

                                </Form.Group>
                                {CheckReport !== 0 && <div>
                                    {(CheckReport === true ) ? <div style={{'color':'green'}}>OK</div> : <div style={{'color':'red'}}><span>The file contains some errors: </span><span>{CheckReport}</span></div>}

                                </div>}
                                {WarningReport !== 0 && <div style={{'color':'orange'}}>{WarningReport}</div>}

                                <hr />

                                {Keys.length > 1 && <div><h5>CSV documents' fields <i style={{'font-size':'1rem'}}>(It is mandatory to set at least one field to display. It is optional to set at least one field to annotate )</i></h5>
                                    <div style={{'margin-bottom':'20px'}}>Below you can find all the fields which characterize your reports. For each key, you have to decide if you want to display, hide, or display and annotate the value corresponding to that key. Remember that to perform mentions annotation, you must select at least one field checking the button <i>Display and Annotate</i></div>
                                    {Keys.map((key,ind)=>
                                        <Row><Col md = {4}>
                                            {key}</Col>
                                            <Col md={8}>
                                                <label><input
                                                    value='hide'
                                                    type="radio"
                                                    name={key}
                                                    onChange={()=>{SetFinalMessage('');SetWarningJsonDisp('');SetCheckJsonDisp(0);SetCheckJsonAnn(0)}}

                                                />&nbsp;
                                                Hide</label>&nbsp;&nbsp;&nbsp;&nbsp;
                                                <label><input
                                                    value='display'
                                                    type="radio"
                                                    name={key}
                                                    onChange={()=>{SetFinalMessage('');SetCheckJsonDisp(0);SetWarningJsonDisp('');SetCheckJsonAnn(0)}}
                                                />&nbsp;
                                                Display</label>&nbsp;&nbsp;&nbsp;&nbsp;
                                                <label><input
                                                    name={key}
                                                    type="radio"
                                                    value='both'
                                                    onChange={()=>{SetFinalMessage('');SetCheckJsonDisp(0);SetCheckJsonAnn(0);SetWarningJsonDisp('');}}
                                                    defaultChecked={true}
                                                />&nbsp;
                                                Display and Annotate</label>

                                            </Col>

                                        </Row>
                                    )}
                                    {CheckJsonDisp !== 0 && WarningJsonDisp === '' && <div>
                                        {(CheckJsonDisp === true ) ? <div style={{'color':'green'}}>The fields are OK</div> : <div style={{'color':'red'}}><span>The fields contain some errors: </span><span>{CheckJsonDisp}</span></div>}

                                    </div>}
                                    {WarningJsonDisp !== '' && <div style={{'color':'orange'}}>JSON FIELDS - {WarningJsonDisp}</div>}


                                </div>}


                                <hr />
                                <div><h3>Pubmed collection <i style={{'font-size':'1rem'}}>(Mandatory <b>if you did non inserted other documents in the previous form</b>)</i></h3></div>

                                <Form.Group style={{'margin-top':'20px','margin-bottom':'20px'}}>
                                    <div><span>Insert here the files with the PUBMED articles' ids.</span></div><br/>
                                        {/*<div className='conf-div'><Button onClick={()=>SetShowReportExample(prev=>!prev)} variant="info" size='sm'>Example</Button></div></div>*/}
                                    {/*<div style={{marginBottom:'2%',fontSize:'0.9rem'}}><i>Please, make sure the ids of the reports you insert do not start with "pubmed" and the institutes you insert are different from "pubmed".</i></div>*/}
                                    <Form.File id="pubmed_form" onClick={(e) => {(e.target.value = null);SetGeneralMessage('');SetFinalMessage('');SetShowDeletePubMed(false);SetCheckPubMed(0);SetCheckJsonAnn(0);SetWarningPubMed(0);SetLoadExaConcepts(false);SetLoadExaLabels(false);SetCheckPubMed(0);}} onChange={(e)=>{showDelete(e,'pubmed');}} multiple/>
                                        {ShowDeletePubMed === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e,'reports')}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}

                                </Form.Group>

                                    {CheckPubMed !== 0 && <div>
                                        {(CheckPubMed === true ) ? <div style={{'color':'green'}}>OK</div> : <div style={{'color':'red'}}><span>The file contains some errors: </span><span>{CheckPubMed}</span></div>}

                                    </div>}
                                    {WarningPubMed !== 0 && <div style={{'color':'orange'}}>{WarningPubMed}</div>}
                                <hr/>

                                <div>
                                    <h3>Labels <i style={{'font-size':'1rem'}}>(Mandatory)</i></h3></div>


                                <Form.Group style={{'margin-top':'20px','margin-bottom':'20px'}}>
                                    <div><span>Insert here the file(s) with the annotation labels.</span>
                                        {/*<div className='conf-div'><Button onClick={()=>SetShowLabelExample(prev=>!prev)} variant="info" size='sm'>Example</Button></div>*/}
                                    </div>
                                    <Form.File id="labels_form" onClick={(e) => {SetShowDeleteLabels(false);SetWarningLabels(0);(e.target.value = null);SetGeneralMessage('');SetGeneralMessage('');SetFinalMessage(''); SetCheckLabels(0)}} onChange={(e)=>{showDelete(e,'labels');}} multiple/>
                                    {ShowDeleteLabels === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e,'labels')}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}
                                </Form.Group>

                                {CheckLabels !== 0 && WarningLabels === 0 &&  <div>
                                    {(CheckLabels === true && CheckLabels !== 0) ? <div style={{'color':'green'}}>OK</div> : <div style={{'color':'red'}}><span>The file contains some errors: </span><span>{CheckLabels}</span></div>}

                                </div>}
                                {WarningLabels !== 0 ? <div style={{'color':'orange'}}>{WarningLabels}</div> : <div></div>}
                                {ShowLabelExample && <div style={{'text-align':'center'}}>This is an example of labels file. <br/> Your file must contain the header row (the one in boldface) containing the name of each column. In each row the values must be comma separated.<br/> <span style={{'font-weight':'bold'}}>Null values are not allowed, for each row you must provide a label and a usecase</span>
                                    <br/><br/>
                                    <div>If you prefer you can download the csv file.
                                        <span> <Button size='sm' onClick={(e)=>onSaveExample(e,'labels')} variant='warning'> <FontAwesomeIcon icon={faDownload} /> Download</Button></span>
                                    </div>
                                    <hr/>
                                    <div className='examples'>
                                        <div style={{'display':'flex','justify-content':'center'}}>
                                            <div>
                                                <span style={{'font-weight':'bold'}}>label</span><br/>
                                                Relevant<br/>
                                                Not relevant<br/>

                                            </div>
                                        </div>
                                    </div>

                                </div>}<hr/>
                                <div><h3>Concepts <i style={{'font-size':'1rem'}}>(Optional)</i></h3>If you want to perform concepts identification and linking you must provide the concepts.</div>

                                <Form.Group style={{'margin-top':'20px','margin-bottom':'20px'}}>
                                    <div><span>Insert here the file(s) with the concepts.</span>
                                        {/*<div className='conf-div'>*/}
                                        {/*<Button onClick={()=>SetShowConceptExample(prev=>!prev)} variant="info" size='sm'>Example</Button></div>*/}
                                    </div>
                                    <Form.File id="concepts_form" onClick={(e) => {SetShowDeleteConcepts(false);SetGeneralMessage('');SetFinalMessage('');SetWarningConcept(0);SetCheckConcept(0);(e.target.value = null)}} onChange={(e)=>{showDelete(e,'concepts');}}  multiple/>
                                    {ShowDeleteConcepts === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e,'concepts')}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}
                                </Form.Group>

                                {CheckConcept !== 0 && WarningConcept === 0 &&  <div>
                                    {(CheckConcept === true && CheckConcept !== 0) ? <div style={{'color':'green'}}>OK</div> : <div style={{'color':'red'}}><span>The file contains some errors: </span><span>{CheckConcept}</span></div>}

                                </div>}
                                {WarningConcept !== 0 && <div style={{'color':'orange'}}>{WarningConcept}</div>}

                                {ShowConceptExample && <div style={{'text-align':'center'}}>This is an example of concepts file. <br/> Your file must contain the header row (the one in boldface) containing the name of each column. In each row the values must be comma separated.<br/> <span style={{'font-weight':'bold'}}>Null values are not allowed for concept_url, concept_name, usecase and area. </span>
                                    <br/><br/>
                                    <div>If you prefer you can download the csv file.
                                        <span> <Button size='sm' onClick={(e)=>onSaveExample(e,'concepts')} variant='warning'> <FontAwesomeIcon icon={faDownload} /> Download</Button></span>
                                    </div>

                                    <hr/>

                                </div>}
                                <hr />

                                <hr />
                                {FinalMessage !== '' ? <div style={{'margin-bottom':'20px'}}>
                                    {
                                        FinalMessage.includes('OK') ? <div style={{'color':'green','font-weight':'bold'}}>{FinalMessage}</div> : <div style={{'color':'red','font-weight':'bold'}}>{FinalMessage}</div>
                                    }

                                </div> : <div></div>}
                                <div style={{'text-align':'center'}}>
                                    <Button size='lg' variant="primary" onClick={(e)=>onCheckAll(e)}>
                                        Check
                                    </Button>&nbsp;&nbsp;
                                <Button size='lg' variant="success" onClick={(e)=>onAdd(e)}>
                                    Confirm
                                </Button>&nbsp;&nbsp;
                                    </div>

                            </Form>
                        </div>


                    </div>
                    </div>
                </Container>
            </div> : <ConfigureResult />}
            {BackClick === true && <Redirect to='./InfoAboutConfiguration'/>}
            {ShowModalToComplete === true && <Modal show={ShowModalToComplete} onHide={handleCloseToComplete}>
                <Modal.Header closeButton>
                    <Modal.Title>Attention</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {FinalMessage === '' && <div>Please, Check the files you provided before confirm.</div>}
                    {FinalMessage !== '' && <div>Correct the error(s) before confirm. If you did not inserted the minimum number of files required you will not be able to confirm.</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseToComplete}>
                        Ok
                    </Button>


                </Modal.Footer>
            </Modal>}
            {ShowConfirm === true && Missing !== '' && Missing !== false && <Modal show={ShowConfirm} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Attention</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div >{Missing}</div>
                    <div>Remember that without these files you will not be able to use all the functions this app provides.</div>
                    <div>Click on <i>Add more files</i> in order to add these fiels. Click on <i>Save anyway</i> to save the files you provided.</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Add more files
                    </Button>&nbsp;&nbsp;
                    <Button variant="secondary" onClick={()=>{SetSaveData(true);SetShowConfirm(false)}}>
                        Save anyway
                    </Button>

                </Modal.Footer>
            </Modal>}

            </ConfigureContext.Provider>


        </div>


    );
}




export default Configure;


