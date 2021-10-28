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
import {ConceptContext} from '../../BaseIndex'
import cookie from "react-cookies";
import LabelItem from "../Labels/LabelItem";
import './concept.css';
import {Modal} from "react-bootstrap";
import {ListContext} from "./ListSelectedConcepts";
import {Col, Row} from "react-bootstrap";
import ConceptInfoModal from "./ConceptInfoModal";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

 
function Concept(props){
    const { selectedconcepts,removedConcept, action, disButton,changeConceots, associations,semanticArea, conceptModal } = useContext(AppContext);
    const [Disable_Buttons, SetDisable_Buttons] = disButton;
    const [show, setShow] = useState(false);
    const [Action, setAction] = action;
    const [RemovedConcept,SetRemovedConcept] = removedConcept;
    const [SemanticArea, SetSemanticArea] = semanticArea;

    const [associations_to_show,SetAssociations_to_show] = associations;
    // console.log('name',props.concept_name)
    // console.log('url',props.concept_url)
    // console.log('area',props.semantic_area)
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [change, setChange] = changeConceots;

    const [selectedConcepts, setSelectedConcepts] = selectedconcepts

    function show_Modal(concept_url, semantic_area){
        console.log(`concept_url ${concept_url}, semantic_area:${semantic_area}`);
        handleShow();
    }

    function checkConcept(concept) {
        return concept["concept_url"] !== props.concept_url;
    }


    function removeConceptFromList(){
        SetDisable_Buttons(false)
        SetRemovedConcept(true)
        if(Action === 'concepts'){
            let tempConcepts = selectedConcepts;
            let tempConcepts_semArea = selectedConcepts[props.semantic_area].filter(checkConcept);
            // console.log(tempConcepts_semArea);
            // console.log("Concept removed");

            tempConcepts[props.semantic_area] = tempConcepts_semArea;
            // console.log(tempConcepts);

            //setSelectedConcepts(tempConcepts);

            var sem_area = SemanticArea
            var array = {}
            sem_area.map(area=>{
                array[area] = selectedConcepts[area]
                if(area === props.semantic_area){
                    array[area].filter(checkConcept)
                }

            })
            setSelectedConcepts(array)
            setChange(true);
        }



    }


        return(
                <>
                    <Row>
                        <Col md={9}>
                            <Badge className="clickable" pill variant="dark" onClick={() => show_Modal(props.concept_url,props.semantic_area)}>
                                {props.concept_name}
                            </Badge>
                        </Col>
                        <Col md={3}>
                        <span>
                            {/*<Button size="lg" className = "button_info_concept" variant="Link" onClick={() => showModal(concept_url,semantic_area)}><FontAwesomeIcon icon={faInfoCircle} /></Button>*/}
                            <Button size="lg" className = "button_x_concept" variant="Link" onClick={() => removeConceptFromList()}><FontAwesomeIcon icon={faTimesCircle} /></Button>
                        </span>
                        </Col>
                    </Row>
                    {/*{show && <ConceptInfoModal concept_name={concept_name} concept_url={concept_url} semantic_area={semantic_area} />}*/}
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Concept Information</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p><b>Concept name</b>: {props.concept_name}</p>
                            <p><b>Concept URL</b>: <a href={props.concept_url}>{props.concept_url}</a></p>
                            <p><b>Semantic area</b>: {props.semantic_area}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
        );


    }

export default Concept