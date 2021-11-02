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

function ReportSelection(props){
    const { reportArray,indexList, orderVar, insertionTimes } = useContext(AppContext);
    const { fieldsToAnn,userchosen,finalcount,language,username,showmember,showmajority,reached,showautoannotation,reportString,fields,annotation,report,usecase,concepts,semanticArea, disButton,labelsToInsert, selectedconcepts,linkingConcepts, radio, checks,save, userLabels, labelsList, mentionsList, action, reports, index, mentionSingleWord, allMentions, tokens, associations } = useContext(AppContext);

    const [AnnotatedIndexList,SetAnnotatedIndexList] = indexList;
    const [OrderVar, SetOrderVar] = orderVar;
    const [Reports,SetReports] = reports
    const [Action,SetAction] = action
    const [Index,SetIndex] = index
    const [Report,SetReport] = report
    const [ArrayInsertionTimes,SetArrayInsertionTimes] = insertionTimes;
    const [SelectOptions,SetSelectOptions] = reportArray;
    const [NotAnn,SetNotAnn] = useState(false)
    const [AlreadyAnn,SetAlreadyAnn] = useState(false)
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
    const [AllMentions, SetAllMentions] = allMentions;
    const [UserLabels, SetUserLables] = userLabels;
    const [Disabled,SetDisabled] = useState(true); //PER CLEAR
    const [ExaRobot,SetExaRobot] = useState(false)
    const [Concepts, SetConcepts] = concepts;
    // const [SelectedLang,SetSelectedLang] = selectedLang
    const [Username,SetUsername] = username
    const [SemanticArea, SetSemanticArea] = semanticArea;
    const [UserChosen,SetUserChosen] = userchosen
    const [Language, SetLanguage] = language;


    useEffect(()=>{
        // console.log('ACTION',Action)
        // console.log('Indice',Index)
        if(Reports.length > 0 && (Action === 'mentions' || Action === 'labels' || Action === 'concepts' || Action === 'concept-mention')){
            axios.get("http://0.0.0.0:8000/get_reports_from_action", {params: {action:Action}}).then(response => {
                var array_annotated = response.data['reports_presence']
                // SetAutomaticAnnotatedChecked(response.data['auto_checked'])
                console.log('arrayanno',array_annotated)
                // var array_bool = []
                var array_insert = []

                Reports.map(report=>{
                    var check = false
                    //var report = JSON.parse(report1)
                    array_annotated.map(element=>{
                        if(report['id_report'].toString() === element[0].toString()){ //Row modified by Ornella
                            check = true
                            var date = element[1].split('T')
                            var hour = date[1].split('.')
                            var temp = 'date: ' + date[0] + '  time: '+ hour[0] + '(GMT+1)'
                            // console.log('temp',temp)
                            // console.log('temp',hour)
                            // console.log('temp',date)
                            array_insert.push(temp)

                        }
                    })
                    if(check === false){

                        array_insert.push(0) // in questo caso non c'è groundtruth! Non ho nemmeno insertion date

                    }
                    // if(check === true){
                    //     array_bool.push(true)
                    // }
                    // else{
                    //     array_bool.push(false)
                    //     array_insert.push(0) // in questo caso non c'è groundtruth! Non ho nemmeno insertion date
                    //
                    // }
                })
                // SetArrayBool(array_bool);
                SetArrayInsertionTimes(array_insert);
            })
        }
        else{
            // var array_bool = new Array(reports.length).fill(false)
            console.log('ACTION NONE')
            var array_insert = new Array(Reports.length).fill(0)
            // SetArrayBool(array_bool);
            SetNotAnn(false)
            SetAlreadyAnn(false)
            SetArrayInsertionTimes(array_insert);

        }

    },[Action,Reports,SavedGT]) //C'era anche Index ma troppe chiamate

    const handleChange = (event) =>{
        var index = (event.target);
        console.log('INDEX!!',(index))
        SetIndex(Number(index))
        SetReport(Reports[Number(index)])
    }

    useEffect(()=>{
        var arr_to_opt = []
        var new_arr_to_opt = []
        var already_ann = []
        var already_ann_opt = []
        var not_ann = []
        var not_ann_opt = []
        var index_list_ann = []
        var index_list_not_ann = []
        var index_list = []
        // console.log('ordervar',OrderVar)
        if(Reports.length>0 && Annotation === 'Manual' && ArrayInsertionTimes.length>0  ){


            Reports.map((report,ind)=>
                {

                    console.log('insertion_times',ArrayInsertionTimes[ind])

                    var str = (ind+1).toString() +' - '+ Reports[ind].id_report.toString()
                    console.log('str',str)

                    if(ArrayInsertionTimes[ind] !== 0){
                        arr_to_opt.push({id:ind, label: str})
                        already_ann_opt.push({id:ind, label: str})
                        already_ann.push(ind)
                        index_list.push(ind)
                        // arr_to_opt.push(<option value={ind} style={{'font-size':'0.8rem'}}>{ind+1}&nbsp;-&nbsp;{Reports[ind].id_report}</option>)
                        // already_ann.push(<option value={ind} style={{'font-size':'0.8rem'}}>{ind+1}&nbsp;-&nbsp;{Reports[ind].id_report}</option>)
                        index_list_ann.push(ind)

                    }
                    else{
                        // arr_to_opt.push(<option value={ind} style={{'font-weight':'bold','font-size':'0.8rem'}}>{ind+1}&nbsp;-&nbsp;{Reports[ind].id_report}</option>)
                        // not_ann.push(<option value={ind} style={{'font-weight':'bold','font-size':'0.8rem'}}>{ind+1}&nbsp;-&nbsp;{Reports[ind].id_report}</option>)
                        arr_to_opt.push({id:ind, label: str})
                        not_ann_opt.push({id:ind, label: str})
                        index_list.push(ind)

                        not_ann.push(ind)
                        index_list_not_ann.push(ind)

                    }

                }

                )
            SetNotAnn(not_ann)
            SetAlreadyAnn(already_ann)
            SetAnnotatedIndexList(index_list)
        }

        if(OrderVar === 'annotation'){
            new_arr_to_opt = [...not_ann_opt,...already_ann_opt]
            index_list = [...index_list_not_ann,...index_list_ann]
            SetSelectOptions(new_arr_to_opt)
            SetAnnotatedIndexList(index_list)
            console.log('actual rep',index_list.indexOf(Index))
            // SetIndex(index_list.indexOf(Index))
            // SetReports(index_list)

        }
        else{
            SetSelectOptions(arr_to_opt)

        }


    },[ArrayInsertionTimes,OrderVar])

    // useEffect(()=>{
    //     console.log('notann',NotAnn)
    //     console.log('already',AlreadyAnn)
    // },[NotAnn,AlreadyAnn])
    const submit = (event,token) => {
        event.preventDefault();
        // if(Saved === false){
        //     SetSaved(true)
        if(Action === 'labels'){
            token = 'annotation'
        }
        if(Action === 'concept-mention'){
            token = 'linked'
        }
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

    return(


        <label style={{width:'15vw'}}>
            {SelectOptions.length > 0 && ((NotAnn.length === 0 && AlreadyAnn.length === SelectOptions.length) || (AlreadyAnn.length === 0 && NotAnn.length === SelectOptions.length) || (NotAnn.length > 0 && NotAnn.length < SelectOptions.length) || (AlreadyAnn.length > 0 && SelectOptions.length > AlreadyAnn.length)) &&
            <Autocomplete
                id="disable-clearable"
                disableClearable
                includeInputInList
                size = "small"
                options={SelectOptions}
                value={SelectOptions[AnnotatedIndexList.indexOf(Index)]}
                onChange={(event, newValue) => {
                    submit(event,Action)
                    if(OrderVar !== 'annotation'){
                        SetIndex(Number(newValue['id']))
                        SetReport(Reports[Number(newValue['id'])])
                    }
                    else{
                        SetIndex(Number(newValue['id']))
                        SetReport(Reports[Number(newValue['id'])])
                    }

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
                                        style={{fontSize: '0.8rem',fontWeight:(NotAnn.indexOf(option['id']) !==-1 ? 'bold':'normal')}}

                                    >{option['label']} </span>

                        </li>
                    );
                }}
            />

            }

        </label>

    );


}

export default ReportSelection


                // <Dropdown
                //     placeholder='Select'
                //     fluid
                //     search
                //     selection
                //     options={SelectOptions}
                // />



                // <select style={{'vertical-align':'bottom','font-size':'0.8rem'}} className='select_class'
                //         value = {Index}
                //         onChange={(e)=>handleChange(e)}>
                //     options = {SelectOptions}
                // </select>}
