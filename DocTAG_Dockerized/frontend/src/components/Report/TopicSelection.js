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
    const { reportArray,reports,topicindex,batchNumber,institute,updateMenu,report_type,usecase,language,usecaseList,annotation,indexList,reportString, orderVar,index, report,action, save, insertionTimes } = useContext(AppContext);
    const [AnnotatedIndexList,SetAnnotatedIndexList] = indexList;
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
            UseCaseList.map((use,ind)=>{
                var str = (ind+1).toString() +' - '+ UseCaseList[ind].toString()
                arr_to_opt.push({id:ind, label: str})
            })
            console.log('options',arr_to_opt)
            SetSelectOptions(arr_to_opt)
        }



    },[UseCaseList])

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

                    SetTopicIndex(Number(newValue['id']))
                    SetUseCase(UseCaseList[Number(newValue['id'])])
                    axios.post("http://0.0.0.0:8000/new_credentials", {
                        usecase: UseCaseList[Number(newValue['id'])], language: Language, institute: Institute, annotation: Annotation,report_type: ReportType,batch:BatchNumber
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