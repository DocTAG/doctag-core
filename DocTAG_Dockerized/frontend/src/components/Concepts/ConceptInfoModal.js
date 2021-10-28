import Token from "../Report/Token";
import React, { Component } from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from "react-bootstrap/Badge";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useContext } from "react";
import { faTimesCircle,faSearch, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import {AppContext}  from "../../App";
import {ConceptContext} from '../../Prova_BaseIndex'
import cookie from "react-cookies";
import LabelItem from "../Labels/LabelItem";
import './concept.css';
import {Modal} from "react-bootstrap";
import {ListContext} from "./ListSelectedConcepts";
import {Col, Row} from "react-bootstrap";


axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";


function ConceptInfoModal({concept_name,concept_url,semantic_area}){
    const { conceptModal } = useContext(AppContext);
    const [show, setShow] = conceptModal;

    const handleClose = () => setShow(false);

    // console.log('area1',semantic_area)
    // console.log('name1',concept_name)
    // console.log('url1',concept_url)


    return(

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Concept Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>Concept name</b>: {concept_name}</p>
                    <p><b>Concept URL</b>: <a href={concept_url}>{concept_url}</a></p>
                    <p><b>Semantic area</b>: {semantic_area}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

    );


}

export default ConceptInfoModal