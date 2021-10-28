import React, {createContext, useContext, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import Concept from "./Concept";
import {AppContext}  from "../../App";
import {ConceptContext} from '../../BaseIndex'

export const ListContext = createContext();

export default function ListSelectedConcepts(props){

    const { selectedconcepts, changeConceots,semanticArea} = useContext(AppContext);
    const [areas,SetAreas] = semanticArea;
    const [selectedConcepts, setSelectedConcepts] = selectedconcepts;





    //if(!selectedConcepts[props.semanticArea].length) return <div>No concepts selected (Click on a list item to add one)</div>
    if(props.area === 'All' ){
        return (
            <div>
            {areas.length > 0 && Object.keys(selectedConcepts).length > 0 && <div >
            {areas.map(area=>
                <div>{areas.length > 1 && <h6>{area}</h6>}
                    {(Object.keys(selectedConcepts)).indexOf(area) > -1 && <ul>
                        {selectedConcepts[area].map((concept,i) => <li><Concept concept_name={concept["concept_name"]} concept_url={concept["concept_url"]} semantic_area={concept["semantic_area"]} /></li>) }
                    </ul>}
                </div>

            )}
            </div>}</div>
        );

    }
    return (

            <ul>
                {selectedConcepts[props.area].map((concept,i) => (<li><Concept concept_name={concept["concept_name"]} concept_url={concept["concept_url"]} semantic_area={concept["semantic_area"]} /></li>)) }
            </ul>
            );

}

