import React, {useContext, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import WindowedSelect from "react-windowed-select";
import ListSelectedConcepts from "./ListSelectedConcepts";
import {AppContext}  from "../../App";
import {ConceptContext} from '../../Prova_BaseIndex'
import {Col, Modal, OverlayTrigger, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ConceptList from "./ConceptList";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle,faSave,faGlasses,faPlusCircle,faList,faMousePointer,faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import Zoom from "@material-ui/core/Zoom";
import './concept.css'
import Tooltip from "react-bootstrap/Tooltip";

export default function ConceptsContainer(props) {

    const {currentSemanticArea, setCurrentSemanticArea} = useContext(ConceptContext);
    const { index, action,semanticArea,conceptOption,showautoannotation,concepts,showmember,showmajority } = useContext(AppContext);
    const [Index, setIndex] = index;
    const [ShowAutoAnn,SetShowAutoAnn] = showautoannotation;

    const [selectedOption, setSelectedOption] = conceptOption;
    const [Action, setAction] = action;
    const [SemanticArea, SetSemanticArea] = semanticArea;
    const [Concepts, SetConcepts] = concepts;
    const [ShowInfoConcepts,SetShowInfoConcepts] = useState(false);
    const [options_array,SetOptions_array] = useState([])
    const [ShowMemberGt,SetShowMemberGt] =showmember
    const [ShowMajorityGt,SetShowMajorityGt] = showmajority
    useEffect(()=>{
        setCurrentSemanticArea('All')
        setSelectedOption('')
    },[Index,Action])

    useEffect(()=>{
        var opt = []
        console.log('aree',SemanticArea)
        console.log('aree',Concepts)
        SemanticArea.map(val=>{
            opt.push(<option value={val} disabled={Concepts[val] === undefined || Concepts[val].length === 0}>{val}</option>)
        })
        opt.push(<option value='All'>All</option>)
        // console.log(options_array)
        // console.log(SemanticArea)
        SetOptions_array(opt)
    },[SemanticArea])


    function changeInfoConcepts(e){
        e.preventDefault()
        if(ShowInfoConcepts){
            SetShowInfoConcepts(false)

        }else{SetShowInfoConcepts(true)}

    }
    return (
        <>

            <div style={{'fontWeight':'bold','fontStyle':'italic'}}>Choose one or more concepts:&nbsp;&nbsp;
                <OverlayTrigger
                    key='bottom'
                    placement='bottom'
                    overlay={
                        <Tooltip id={`tooltip-bottom'`}>
                            Quick tutorial
                        </Tooltip>
                    }
                >
            <button className='butt_info' onClick={(e)=>changeInfoConcepts(e)}><FontAwesomeIcon icon={faInfoCircle} color='blue'/></button>
            </OverlayTrigger>
            </div>
            {ShowInfoConcepts && <Zoom in={ShowInfoConcepts}>
                <div className='quick_tutorial'>
                    <h5>Concepts: quick tutorial</h5>
                    <div>
                        You can associate to the report you are reading one (or more) concepts.
                        <div>
                            <ul className="fa-ul">
                                <li><span className="fa-li"><FontAwesomeIcon icon={faGlasses}/></span>
                                    Read the document on your left.
                                </li>

                                <li><span className="fa-li"><FontAwesomeIcon icon={faPlusCircle}/></span>Choose a concept.
                                </li>

                                <li><span className="fa-li"><FontAwesomeIcon icon={faMousePointer}/></span>Click on a concept of the list to have more information about it.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faSave}/></span>Your changes will be saved clicking on <span style={{'color':'green'}}>SAVE</span> button, changing annotation type or
                                    going to the previous or next document or topic.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>Click on the <FontAwesomeIcon icon={faTimesCircle}/> next to the concept to remove it from the list.
                                    Click on <span style={{'color':'red'}}>CLEAR</span> to remove the entire list instead.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div></Zoom>}
            {!ShowInfoConcepts && options_array.length > 0 &&  <div>
            {/*    {(ShowAutoAnn === false && ShowMemberGt === false ) && <Row>*/}
            {/*    <Col md="5">*/}
            {/*        <label className="label" htmlFor="semanticAreaSelect">Semantic Area:</label>*/}
            {/*    </Col>*/}
            {/*    <Col md="7">*/}
            {/*        <select id="semanticAreaSelect" style={{'width': '90%'}} className="form-control selectArea"*/}
            {/*                value={currentSemanticArea} onChange={(e) => {*/}
            {/*            console.log(e.target.value);*/}
            {/*            setCurrentSemanticArea(e.target.value);*/}
            {/*        }}>*/}
            {/*            options={options_array}*/}
            {/*            /!*<option value="Diagnosis">Diagnosis</option>*!/*/}
            {/*            /!*<option value="Anatomical Location">Anatomical Location</option>*!/*/}
            {/*            /!*<option value="Procedure">Procedure</option>*!/*/}
            {/*            /!*<option value="Test">Test</option>*!/*/}
            {/*            /!*<option value="General Entity">General Entity</option>*!/*/}
            {/*            /!*<option value="All">All</option>*!/*/}
            {/*        </select>*/}
            {/*    </Col>*/}
            {/*</Row>}*/}



            {/*{currentSemanticArea === 'Diagnosis' && <ConceptList semanticArea="Diagnosis"/>}*/}

            {/*{currentSemanticArea === 'Anatomical Location' && <ConceptList semanticArea="Anatomical Location"/>}*/}

            {/*{currentSemanticArea === 'Procedure' && <ConceptList semanticArea="Procedure"/>}*/}

            {/*{currentSemanticArea === 'Test' && <ConceptList semanticArea="Test"/>}*/}

            {/*{currentSemanticArea === 'General Entity' && <ConceptList semanticArea="General Entity"/>}*/}

            {/*{currentSemanticArea === 'All' && <ConceptList semanticArea="All"/>}*/}

            <ConceptList area={currentSemanticArea}/>

            </div>}


        </>
    );

}

