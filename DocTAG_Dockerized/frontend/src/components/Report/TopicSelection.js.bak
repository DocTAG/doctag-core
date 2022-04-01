import React, {Component, useEffect, useState, useContext} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './report.css';
import {AppContext} from "../../App";
import { makeStyles} from "@material-ui/core";
import Select from 'react-select';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './search_select.css'

function TopicSelection(props){
    const { reportArray,topicindex,batchNumber,institute,updateMenu,report_type,usecaseList,indexList, orderVar, insertionTimes } = useContext(AppContext);
    const [AnnotatedIndexList,SetAnnotatedIndexList] = indexList;
    const { fieldsToAnn,userchosen,finalcount,language,username,showmember,showmajority,reached,showautoannotation,reportString,fields,annotation,report,usecase,concepts,semanticArea, disButton,labelsToInsert, selectedconcepts,linkingConcepts, radio, checks,save, userLabels, labelsList, mentionsList, action, reports, index, mentionSingleWord, allMentions, tokens, associations } = useContext(AppContext);

    const [OrderVar, SetOrderVar] = orderVar;
    const [Reports,SetReports] = reports
    const [Annotation,SetAnnotation] = annotation
    const [Action,SetAction] = action
    const [Index,SetIndex] = index
    const [Report,SetReport] = report
    const [SavedGT,SetSavedGT] = save;
    const [ArrayInsertionTimes,SetArrayInsertionTimes] = insertionTimes;
    const [SelectOptions,SetSelectOptions] = useState([]);
    const [NotAnn,SetNotAnn] = useState(false)
    const [AlreadyAnn,SetAlreadyAnn] = useState(false)
    const [useCase,SetUseCase] = usecase;
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [TopicIndex,SetTopicIndex] = topicindex;
    const [Language,SetLanguage] = language
    const [Institute,SetInstitute] = institute
    const [BatchNumber,SetBatchNumber] = batchNumber
    const [ReportType,SetReportType] = report_type
    const [UpdateMenu,SetUpdateMenu] = updateMenu
    const [associations_to_show,SetAssociations_to_show] = associations;
    const [labels, setLabels] = labelsList
    const [Checks, setChecks] = checks;
    const [Fields,SetFields] = fields;
    const [FieldsToAnn,SetFieldsToAnn] = fieldsToAnn;
    const [LabToInsert,SetLabToInsert] = labelsToInsert;
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
    const [AllMentions, SetAllMentions] = allMentions;
    const [UserLabels, SetUserLables] = userLabels;
    const [Disabled,SetDisabled] = useState(true); //PER CLEAR
    const [ExaRobot,SetExaRobot] = useState(false)
    const [Concepts, SetConcepts] = concepts;
    // const [SelectedLang,SetSelectedLang] = selectedLang
    const [Username,SetUsername] = username
    const [SemanticArea, SetSemanticArea] = semanticArea;
    const [UserChosen,SetUserChosen] = userchosen

    //
    // const handleChange = (event) =>{
    //     var index = (event.target);
    //     console.log('INDEX!!',(index))
    //     SetIndex(Number(index))
    //     SetReport(Reports[Number(index)])
    // }

    useEffect(()=>{
        if(UseCaseList.length > 0){
            var arr_to_opt = []
            // if(ReportType==='pubmed'){
            //
            //
            //     axios.get("http://0.0.0.0:8000/pubmed_reports").then(response => {
            //         (response.data['usecase'].map((uc,ind)=>{
            //             var str = (ind+1).toString() +' - '+ uc.toString()
            //             arr_to_opt.push({id:ind, label: str})
            //
            //         }));
            //
            //     }).catch(function (error){console.log(error)})
            // }
            // else if(ReportType==='reports'){
            //
            //     axios.get("http://0.0.0.0:8000/doctag_reports").then(response => {
            //         (response.data['usecase'].map((uc,ind)=>{
            //             var str = (ind+1).toString() +' - '+ uc.toString()
            //             arr_to_opt.push({id:ind, label: str})
            //
            //         }));
            //
            //     }).catch(function (error){console.log(error)})
            // }
            UseCaseList.map((use,ind)=>{

                if((ReportType === 'pubmed' && use.toLowerCase().startsWith('pubmed') ) || (ReportType === 'reports' && !(use.toLowerCase().startsWith('pubmed')))){
                    var str = (ind+1).toString() +' - '+ UseCaseList[ind].toString()
                    arr_to_opt.push({id:ind, label: str})
                }

            })
            console.log('options',arr_to_opt)
            SetSelectOptions(arr_to_opt)
        }

    },[UseCaseList])

    const submit = (event,token) => {
        event.preventDefault();

        if(Action === 'labels'){
            token = 'annotation'
        }
        if(Action === 'concept-mention'){
            token = 'linked'
        }
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

            axios.post('http://0.0.0.0:8000/mention_insertion/insert', {
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
            axios.post('http://0.0.0.0:8000/annotationlabel/insert', {
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
                axios.post('http://0.0.0.0:8000/insert_link/insert', {
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

            axios.post('http://0.0.0.0:8000/contains/update', {
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
    // useEffect(()=>{
    //     console.log('notann',NotAnn)
    //     console.log('already',AlreadyAnn)
    // },[NotAnn,AlreadyAnn])

    return(


        <label style={{width:'15vw'}}>
            {SelectOptions.length > 0 &&
            <Autocomplete
                id="disable-clearable"
                disableClearable
                includeInputInList
                size = "small"
                options={SelectOptions}
                value={SelectOptions[TopicIndex]}
                onChange={(event, newValue) => {
                    submit(event,Action);
                    SetTopicIndex(Number(newValue['id']))
                    SetUseCase(UseCaseList[Number(newValue['id'])])
                    axios.post("http://0.0.0.0:8000/new_credentials", {
                        usecase: UseCaseList[Number(newValue['id'])], language: Language, institute: Institute, annotation: Annotation,report_type: ReportType,batch:1
                    })
                        .then(function (response) {
                            SetUpdateMenu(true)


                        })
                        .catch(function (error) {
                            console.log('ERROR', error);
                        });
                }}

                renderInput={(params) => (

                    <TextField {...params} variant="standard" />
                )}


                renderOption={(props, option) => {
                    // console.log('option1',option['id'])
                    // console.log('option2',NotAnn)
                    // console.log('option3',NotAnn.indexOf(option['id']) !==-1)

                    return (
                        <li {...props}>
                                    <span
                                        key={index}
                                        style={{fontSize: '0.8rem'}}

                                    >{option['label']} </span>

                        </li>
                    );
                }}
            />

            }

        </label>

    );


}

export default TopicSelection
