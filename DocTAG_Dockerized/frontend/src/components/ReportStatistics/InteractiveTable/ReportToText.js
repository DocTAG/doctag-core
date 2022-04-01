import React, {Component, useContext, useEffect, useState} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col} from "react-bootstrap";
import '../../Report/report.css';
import {AppContext} from "../../../App";
import './reportText.css'
import '../tables.css'
import ReportListUpdated from "../../Report/ReportListUpdated";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Spinner from "react-bootstrap/Spinner";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
function ReportToText(props) {

    const { index,institute,showreporttext,loadingMentions,color,tokens,fields,mentionsList,loadingColors,showannotations,finalcount,fieldsToAnn,reached,orderVar, errorSnack,reports, reportString, insertionTimes } = useContext(AppContext);
    const [Reports,SetReports] = useState([])
    const [ReportString, setReportsString] = reportString;
    //Report sections
    const [newInd,SetNewInd] = useState(false)
    const [FinalCountReached, SetFinalCountReached] = reached;
    const [FinalCount, SetFinalCount] = finalcount;
    const [Fields, SetFields] = fields;
    const [FieldsToAnn, SetFieldsToAnn] = fieldsToAnn;

    const [showReportText,SetshowReportText] = showreporttext;


    useEffect(()=>{
        setReportsString('')
        axios.get("http://127.0.0.1:8000/get_reports", {params: {all: 'all'}}).then(response => {
            SetReports(response.data['report']);})

    },[])



    useEffect(()=>{
        if(Reports.length > 0){

            if(newInd >= 0){
                axios.get("http://127.0.0.1:8000/report_start_end", {params: {report_id: Reports[newInd].id_report.toString()}}).then(response => {SetFinalCount(response.data['final_count']);
                    setReportsString(response.data['rep_string']); SetFinalCountReached(false);
                })
                axios.get("http://127.0.0.1:8000/get_fields",{params:{report:props.id_report}}).then(response => {SetFields(response.data['fields']);SetFieldsToAnn(response.data['fields_to_ann']);})

            }
        }


    },[newInd])



    useEffect(()=>{
        if(Reports.length > 0){

            if(props.id_report !== false){
                Reports.map((report,ind)=>{
                    if(report.id_report === props.id_report){

                        SetNewInd(ind)
                    }

                })
            }
        }



    },[props.id_report,Reports])



    useEffect(()=>{
        if(Reports.length>0){
            if(newInd===0){
                console.log('zero',Reports[newInd].id_report)
            }
        }
    },[newInd])






    return (
        <Container className='container-modal'>
            <div>
            {(newInd !== false && ReportString !== '' && Reports.length > 0 &&  showReportText === true) ? <div className='report_text'>
                <ReportListUpdated report_id = {Reports[newInd].id_report} report = {Reports[newInd].report_json} action='none'/>

            </div>


             : <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}
            </div>

        </Container>
    );

}


export default ReportToText