import {Col, OverlayTrigger, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight, faProjectDiagram} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AppContext} from "../../App";
import { confirm } from '../Dialog/confirm'
import regeneratorRuntime from "regenerator-runtime";
import Tooltip from "react-bootstrap/Tooltip";
import {
faRobot,faUsers,faUser
} from '@fortawesome/free-solid-svg-icons';
import ChangeMemberGT from "./ChangeMemberGT";

function SubmitButtons(props){

    const { fieldsToAnn,userchosen,finalcount,language,username,showmember,showmajority,reached,showautoannotation,reportString,fields,annotation,report,usecase,concepts,semanticArea, disButton,labelsToInsert, selectedconcepts,linkingConcepts, radio, checks,save, userLabels, labelsList, mentionsList, action, reports, index, mentionSingleWord, allMentions, tokens, associations } = useContext(AppContext);
    const [associations_to_show,SetAssociations_to_show] = associations;
    const [labels, setLabels] = labelsList
    const [Checks, setChecks] = checks;
    const [Fields,SetFields] = fields;
    const [FieldsToAnn,SetFieldsToAnn] = fieldsToAnn;
    const [SavedGT,SetSavedGT] = save;
    const [LabToInsert,SetLabToInsert] = labelsToInsert;
    const [Annotation,SetAnnotation] = annotation
    const [UseCase,SetUseCase] = usecase;
    const [reportsString, setReportsString] = reportString;
    const [FinalCount, SetFinalCount] = finalcount;
    const [FinalCountReached, SetFinalCountReached] = reached;
    const [ShowAutoAnn,SetShowAutoAnn] = showautoannotation;
    const [ShowMemberGt,SetShowMemberGt] =showmember
    const [ShowMajorityGt,SetShowMajorityGt] = showmajority
    const [Disable_Buttons, SetDisable_Buttons] = disButton;
    const [labels_to_show, setLabels_to_show] = userLabels;
    const [RadioChecked, SetRadioChecked] = radio;
    const [selectedConcepts, setSelectedConcepts] = selectedconcepts;
    const [Children,SetChildren] = tokens;
    const [mentions_to_show,SetMentions_to_show] = mentionsList;
    const [WordMention, SetWordMention] = mentionSingleWord;
    const [Report, setReport] = report;
    const [AllMentions, SetAllMentions] = allMentions;
    const [Reports, setReports] = reports;
    const [Index, setIndex] = index;
    const [UserLabels, SetUserLables] = userLabels;
    const [Action, SetAction] = action;
    const [Disabled,SetDisabled] = useState(true); //PER CLEAR
    const [ExaRobot,SetExaRobot] = useState(false)
    const [Concepts, SetConcepts] = concepts;
    // const [SelectedLang,SetSelectedLang] = selectedLang
    const [Username,SetUsername] = username
    const [SemanticArea, SetSemanticArea] = semanticArea;
    const [UserChosen,SetUserChosen] = userchosen
    const [Language, SetLanguage] = language;


    // useEffect(()=>{
    //     axios.get('http://127.0.0.1:8000/get_post_fields_for_auto').then(function(response){
    //         if(Object.keys(response.data['extract_fields']).indexOf(UseCase) >=0){
    //             if(response.data['extract_fields'][UseCase].length >0){
    //                 SetExaRobot(true)
    //             }
    //
    //         }
    //
    //
    //     }).catch(function(error){
    //         console.log('error: ',error)
    //     })
    // },[UseCase])





    useEffect(()=>{
        if(ShowAutoAnn){
            axios.get("http://127.0.0.1:8000/get_fields").then(response => {SetFields(response.data['fields']);SetFieldsToAnn(response.data['fields_to_ann']);})
            SetShowAutoAnn(false)
        }
    },[Report])

    useEffect(()=>{
        SetDisabled(true)
        var conc = false
        SemanticArea.map(area=>{
            if(selectedConcepts[area] !== undefined){
                if(selectedConcepts[area].length > 0){
                    conc = true
                }
            }
        })
        // console.log('radio',RadioChecked)
        // console.log('disabledbutt',Disable_Buttons)

        if(Action === 'labels' && RadioChecked){

            SetDisabled(false)

        }
        else if(Action === 'mentions' && (mentions_to_show.length > 0 )){
            SetDisabled(false)
        }
        else if(Action === 'concepts' && conc === true){
            SetDisabled(false)
        }
        else if(Action === 'concept-mention' && (associations_to_show.length > 0)){
            SetDisabled(false)

        }

    },[associations_to_show,mentions_to_show,selectedConcepts,RadioChecked])



    const submit = (event,token) => {
        event.preventDefault();
        // if(Saved === false){
        //     SetSaved(true)
        if (token.startsWith('mentions')) {
            SetWordMention('')
            Children.map(child=>{
                if(child.getAttribute('class') === 'token-selected' || child.getAttribute('class') === 'token-adj-dx' ||child.getAttribute('class') === 'token-adj-sx'){
                    child.setAttribute('class','token')
                }
            })
            var data_to_ret = {'mentions': mentions_to_show.filter(x=>x.seq_number !== 0)}
            // console.log('mentions: ' ,mentions_to_show)

            axios.post('http://127.0.0.1:8000/mention_insertion/insert', {
                mentions: data_to_ret['mentions'],language:Language,
                report_id: Reports[Index].id_report
            })
                .then(function (response) {

                    SetSavedGT(prevState => !prevState)
                    // console.log('RISPOSTA',response);
                })
                .catch(function (error) {
                    //alert('ATTENTION')
                    console.log(error);
                });

        }else if (token.startsWith('annotation')) {
            //const data = new FormData(document.getElementById("annotation-form"));
            // console.log('labtoinsert',LabToInsert)
            axios.post('http://127.0.0.1:8000/annotationlabel/insert', {
                //labels: data.getAll('labels'),
                labels: LabToInsert,language:Language,
                report_id: Reports[Index].id_report,
            })
                .then(function (response) {
                    // console.log(response);

                    // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                    if (LabToInsert.length === 0) {
                        SetRadioChecked(false)

                    }
                    // SetLabToInsert([])
                    SetSavedGT(prevState => !prevState)
                })
                .catch(function (error) {

                    console.log(error);
                });

        } else if (token.startsWith('linked')) {
            const data = new FormData(document.getElementById("linked-form"));
            //var data_to_ret = {'linked': data.getAll('linked')}


            data_to_ret = {'linked': associations_to_show}
            if (data_to_ret['linked'].length >= 0) {
                axios.post('http://127.0.0.1:8000/insert_link/insert', {
                    linked: data_to_ret['linked'],language:Language,
                    report_id: Reports[Index].id_report
                })
                    .then(function (response) {
                        // console.log(response);
                        // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                        SetWordMention('')
                        // console.log('aggiornato concepts');

                        SetSavedGT(prevState => !prevState)
                    })
                    .catch(function (error) {

                        console.log(error);
                    });
            }
        } else if (token.startsWith('concepts')) {
            // console.log(selectedConcepts);

            let concepts_list = []

            for (let area of SemanticArea) {
                for (let concept of selectedConcepts[area]) {
                    concepts_list.push(concept);
                }
            }

            // console.log(concepts_list);

            axios.post('http://127.0.0.1:8000/contains/update', {
                    concepts_list: concepts_list,language:Language,
                    report_id: Reports[Index].id_report,
                },
            )
                .then(function (response) {
                    // console.log(response);
                    // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                    SetSavedGT(prevState => !prevState)

                })
                .catch(function (error) {

                    console.log(error);
                });
        }



    }


    useEffect(()=>{
        // console.log('lab_to',LabToInsert)
        if(LabToInsert.length === 0){
            SetRadioChecked(false)
        }
        else{
            SetRadioChecked(true)
        }
    },[LabToInsert])

    const deleteEntries = (event,token)=>{
        event.preventDefault()
        if(token === 'mentions'){
            // console.log('WORD',WordMention)

            axios.post('http://127.0.0.1:8000/mention_insertion/delete', {language:Language,report_id: Reports[Index].id_report})
                .then (function (response) {
                    // console.log(response);
                    //SetSavedGT(false)
                    SetSavedGT(prevState => !prevState)
                    SetMentions_to_show([]);
                    SetWordMention('')
                    Children.map(child =>{

                        child.setAttribute('class', 'token')
                        child.removeAttribute('style')



                    })
                })
                .catch(function (error) {

                    console.log(error);
                });
            // console.log('delete')
        }
        else if(token === 'annotation') {
            axios.post('http://127.0.0.1:8000/annotationlabel/delete', {language:Language,report_id: Reports[Index].id_report})
                .then(function (response) {
                    // console.log(response);
                    //SetSavedGT(false)
                    SetRadioChecked(false)
                    SetSavedGT(prevState => !prevState)
                    const newItemsArr = new Array(labels.length).fill(false)
                    setChecks(newItemsArr);
                    SetLabToInsert([]) //added 30082021
                })
                .catch(function (error) {

                    console.log(error);
                });
            // console.log('delete')

        }
        else if(token === 'linked'){
            axios.post('http://127.0.0.1:8000/insert_link/delete', {language:Language,report_id: Reports[Index].id_report})
                .then (function (response) {
                    // console.log(response);
                    //SetSavedGT(false)
                    SetSavedGT(prevState => !prevState)
                    SetAssociations_to_show([]);
                })
                .catch(function (error) {

                    console.log(error);
                });
            // console.log('delete')
        }
        else if(token === 'concepts'){
            axios.post('http://127.0.0.1:8000/contains/delete', {language:Language,report_id: Reports[Index].id_report})
                .then (function (response) {
                    // console.log(response);
                    // SetSavedGT(false)
                    SetSavedGT(prevState => !prevState)
                    var arr = {}
                    SemanticArea.map(area=>{
                        arr[area] = []
                    })
                    setSelectedConcepts(arr);

                })
                .catch(function (error) {

                    console.log(error);
                });
            // console.log('delete')
        }

    }

    const ClickForDelete = async (e,token) => {
        var confirm_string = ''
        if(token === 'annotation'){
            confirm_string = 'This action will remove ALL the selected labels. This is irreversible. Are you sure?'
        }
        else if(token === 'mentions'){
            confirm_string = 'This action will remove ALL the selected mentions. If you linked these mentions with some concepts they will be removed as well. This is irreversible. Are you sure?'

        }
        else if(token === 'concepts'){
            confirm_string = 'This action will remove ALL the selected concepts. This is irreversible. Are you sure?'

        }
        else if(token === 'linked'){
            confirm_string = 'This action will remove ALL the linked concepts. This is irreversible. Are you sure?'

        }

        if (await confirm({
            confirmation: confirm_string
        })) {
            deleteEntries(e,token)
            console.log('yes');
        } else {
            console.log('no');
        }
    }
    return(

        // <div style={{'position':'absolute', 'width':'100%','padding':'10px','bottom':'0%'}}>
        <div style={{'position':'absolute','text-align':'center', 'width':'100%','padding':'0px','bottom':'0%'}}>
            <div className='two_buttons_div' >
                {ShowMemberGt === false && ShowAutoAnn === false && <><span style={{'float': 'left', 'width': '24.5%'}}>
                    <Button size='sm' disabled={Disabled} style={{'width': '80%'}} className="btn save"
                            onClick={(e) => ClickForDelete(e, props.token)} type="submit"
                            variant="danger">Clear</Button>
                </span>
                    <span style={{'float':'right','width':'24.5%'}}> <Button size='sm' disabled={Disable_Buttons}   style={{'width':'80%'}} className="btn clear" type="submit"  onClick={(e)=>submit(e,props.token)} variant="success">Save</Button>
                    </span></>}

                {UserChosen && <ChangeMemberGT />}
            </div>
        </div>


    );
}


export default SubmitButtons
