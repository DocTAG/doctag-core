import React, {Component, useEffect, useState} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col} from "react-bootstrap";
import './report.css';
import TokenList from "./TokenList";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function ReportSection(props){

    return(

        <div>
            <TokenList key = {props.start} action = {props.action} testo = {props.text} startSectionChar = {props.start} />
        </div>
    );


}
export default ReportSection