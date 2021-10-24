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
    const { reportArray,reports,annotation,indexList,reportString, orderVar,index, report,action, save, insertionTimes } = useContext(AppContext);
    const [AnnotatedIndexList,SetAnnotatedIndexList] = indexList;
    const [OrderVar, SetOrderVar] = orderVar;
    const [Reports,SetReports] = reports
    const [Annotation,SetAnnotation] = annotation
    const [Action,SetAction] = action
    const [Index,SetIndex] = index
    const [Report,SetReport] = report
    const [SavedGT,SetSavedGT] = save;
    const [ArrayInsertionTimes,SetArrayInsertionTimes] = insertionTimes;
    const [SelectOptions,SetSelectOptions] = reportArray;
    const [NotAnn,SetNotAnn] = useState(false)
    const [AlreadyAnn,SetAlreadyAnn] = useState(false)


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
