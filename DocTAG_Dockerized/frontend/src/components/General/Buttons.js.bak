import React, {Component, useContext,useRef, useEffect, useState} from 'react'
import axios from "axios";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col} from "react-bootstrap";
import './buttons.css';
import './first_row.css';

import {AppContext} from "../../App";


function Buttons(props){
    const { language,fields,concepts,showautoannotation,showmember,showmajority,reportString,semanticArea,fieldsToAnn, disButton,labelsToInsert, selectedconcepts, radio, checks,save, userLabels, labelsList, mentionsList, action, reports, index, mentionSingleWord, allMentions, tokens, associations } = useContext(AppContext);
    const [associations_to_show,SetAssociations_to_show] = associations;
    const [labels, setLabels] = labelsList
    const [Checks, setChecks] = checks;
    const [Language, SetLanguage] = language;

    const [SavedGT,SetSavedGT] = save;
    const [LabToInsert,SetLabToInsert] = labelsToInsert;
    const [DisButtonLabels,SetDisButtonLabels] = useState(0)
    const [DisButtonMention,SetDisButtonMention] = useState(0)
    const [DisButtonConcept,SetDisButtonConcept] = useState(0)
    const [DisButtonConceptMention,SetDisButtonConceptMention] = useState(0)
    const [Disable_Buttons, SetDisable_Buttons] = disButton;
    const [Concepts, SetConcepts] = concepts;
    const [reportsString, setReportsString] = reportString;
    const [SemanticArea, SetSemanticArea] = semanticArea;

    const [RadioChecked, SetRadioChecked] = radio;
    const [selectedConcepts, setSelectedConcepts] = selectedconcepts;
    const [Children,SetChildren] = tokens;
    const [mentions_to_show,SetMentions_to_show] = mentionsList;
    const [Reports, setReports] = reports;
    const [Index, setIndex] = index;
    const [UserLabels, SetUserLables] = userLabels;
    const [Fields,SetFields] = fields;
    const [FieldsToAnn,SetFieldsToAnn] = fieldsToAnn;
    const [Action, SetAction] = action
    const [Clicked, SetClicked] = useState(false)
    const [WordMention, SetWordMention] = mentionSingleWord
    const [ID,SetID] = useState(false)
    const [ShowAutoAnn,SetShowAutoAnn] = showautoannotation;
    const [ShowMemberGt,SetShowMemberGt] =showmember
    const [ShowMajorityGt,SetShowMajorityGt] = showmajority
    const [NoLabels,SetNoLabels] = useState(0)
    const [NoConcepts,SetNoConcepts] = useState(0)
    const [NoMentions,SetNoMentions] = useState(0)
    const [NoLink,SetNoLink] = useState(0)
    const labels_but = useRef(null)
    const mentions_but = useRef(null)
    const concepts_but = useRef(null)
    const linking_but = useRef(null)

    function get_empty_concepts(){
        var empty = true
        var chiavi = Object.keys(Concepts);
        chiavi.forEach(function(key){
                if(Concepts[key].length !== 0){
                    empty = false
                }
        })
        return empty
    }

    useEffect(()=>{
        var empty = get_empty_concepts()
        // console.log(Concepts)
        // console.log(labels)
        // console.log('fields_to_ann_buttons',FieldsToAnn)
        if(labels.length === 0){
            SetNoLabels(true)
            SetDisButtonLabels(true)

        }
        else{
            SetNoLabels(false)

        }
        if(FieldsToAnn.length === 0){
            SetDisButtonMention(true)
            SetDisButtonConceptMention(true)
            SetNoMentions(true)
            SetNoLink(true)
        }
        else{
            SetNoMentions(false)
            SetNoLink(false)
        }
        if(empty === true){
            // console.log('entro qua in concept length 0')
            SetNoLink(true)
            SetNoConcepts(true)
            SetDisButtonConcept(true)
            SetDisButtonConceptMention(true)

        }
        else{
            if(FieldsToAnn.length > 0){
                SetNoLink(false)
            }
            SetNoConcepts(false)
        }
    },[])


    useEffect(()=>{
        var empty = get_empty_concepts()
        // console.log('start')
        // console.log(NoLabels)
        // console.log(NoMentions)
        // console.log(NoLink)
        // console.log(NoConcepts)
        // console.log(DisButtonLabels)
        // console.log(DisButtonConceptMention)
        // console.log(DisButtonConcept)
        // console.log(DisButtonMention)
        // console.log(FieldsToAnn)
        // console.log(Concepts)
        // console.log(Action)
        // console.log(empty)
        // console.log('stop')
        if(Action === 'labels' && labels.length > 0 && NoLabels === false){
            // console.log('disabilito labels')
            SetDisButtonLabels(true)
            if(NoConcepts === false){
                SetDisButtonConcept(false)

            }
            if(NoMentions === false){
                SetDisButtonMention(false)

            }
            if(NoLink === false){
                SetDisButtonConceptMention(false)

            }
        }
        else if(Action === 'mentions' && FieldsToAnn.length > 0 && NoMentions === false){
            if(NoLabels === false){
                SetDisButtonLabels(false)

            }
            if(NoConcepts === false){
                SetDisButtonConcept(false)
            }
            SetDisButtonMention(true)


            if(NoLink === false){
                SetDisButtonConceptMention(false)

            }
        }
        else if(Action === 'concepts' && empty === false && NoConcepts === false){
            if(NoLabels === false){
                SetDisButtonLabels(false)

            }
            SetDisButtonConcept(true)


            if(NoMentions === false){
                SetDisButtonMention(false)

            }
            if(NoLink === false){
                SetDisButtonConceptMention(false)

            }
        }
        else if(Action === 'concept-mention' && FieldsToAnn.length > 0 && empty === false && NoLink === false && NoConcepts === false){
            if(NoLabels === false){
                SetDisButtonLabels(false)

            }
            if(NoConcepts === false){
                SetDisButtonConcept(false)

            }
            if(NoMentions === false){
                SetDisButtonMention(false)

            }
            SetDisButtonConceptMention(true)

        }


    },[Action,NoLink,NoConcepts,NoLabels,NoMentions])

    const submit1 = (event,token) => {

        event.preventDefault();
        var id = event.target.id

        // console.log('ACTION123',Action)
        var arr = Array.from(document.getElementsByClassName('act'))
        arr.map(el=>{
            if(el.id !== id) {
                el.setAttribute('class', 'act btn btn-primary')
            }
        })

        document.getElementById(id).setAttribute('class','act btn btn-primary active_button')


        // if(Saved === false){
        //     SetSaved(true)
        if(ShowAutoAnn === false && ShowMajorityGt === false && ShowMemberGt === false) {
            if (token.startsWith('mentions')) {
                SetWordMention('')
                Children.map(child => {
                    if (child.getAttribute('class') === 'token-selected' || child.getAttribute('class') === 'token-adj-dx' || child.getAttribute('class') === 'token-adj-sx') {
                        child.setAttribute('class', 'token')
                    }
                })
                var data_to_ret = {'mentions': mentions_to_show.filter(x=>x.seq_number !== 0)}
                console.log('mentions: ', mentions_to_show)

                axios.post('http://127.0.0.1:8000/mention_insertion/insert', {
                    mentions: data_to_ret['mentions'],
                    language:Language,
                    report_id: Reports[Index].id_report
                })
                    .then(function (response) {
                        //alert('OK')

                        SetAction(id)

                        // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                        SetSavedGT(prevState => !prevState)
                        console.log('RISPOSTA', response);
                    })
                    .catch(function (error) {
                        //alert('ATTENTION')
                        console.log(error);
                    });

            } else if (token.startsWith('annotation')) {

                axios.post('http://127.0.0.1:8000/annotationlabel/insert', {
                    //labels: data.getAll('labels'),
                    labels: LabToInsert,
                    language:Language,
                    report_id: Reports[Index].id_report,
                })
                    .then(function (response) {
                        console.log(response);
                        SetAction(id)

                        if (LabToInsert.length === 0) {
                            SetRadioChecked(false)

                        }
                        // SetLabToInsert([]) added 30082021
                        // SetSavedGT(prevState => !prevState)
                    })
                    .catch(function (error) {

                        console.log(error);
                    });

            } else if (token.startsWith('linked')) {
                const data = new FormData(document.getElementById("linked-form"));
                //var data_to_ret = {'linked': data.getAll('linked')}


                data_to_ret = {'linked': associations_to_show}
                if (data_to_ret['linked'].length >= 0) {
                    axios.post('http://127.0.0.1:8000/insert_link/insert', {
                        linked: data_to_ret['linked'],language:Language,
                        report_id: Reports[Index].id_report
                    })
                        .then(function (response) {
                            // console.log(response);
                            // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                            SetWordMention('')
                            // console.log('aggiornato concepts');
                            SetAction(id)

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

                axios.post('http://127.0.0.1:8000/contains/update', {
                        concepts_list: concepts_list,language:Language,
                        report_id: Reports[Index].id_report,
                    },
                )
                    .then(function (response) {
                        // console.log(response);
                        // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                        SetSavedGT(prevState => !prevState)
                        SetAction(id)

                    })
                    .catch(function (error) {

                        console.log(error);
                    });
            }

            //





            // console.log('ID',id)
            //SetIndex(0)
            SetWordMention('')
            SetClicked(true)
        }
        else{
            SetAction(event.target.id)
        }

    }

    //
    useEffect(()=>{
        if(Action !== undefined && Action !== '' && Action !== 'none' && Action !== false){
            //document.getElementById(Action).focus()

            // console.log('ACTION123',Action)
            var arr = Array.from(document.getElementsByClassName('act'))
            arr.map(el=>{
                if(el.id !== Action) {
                    el.setAttribute('class', 'act btn btn-primary')
                }
            })

            document.getElementById(Action).setAttribute('class','act btn btn-primary active_button')
        }

    },[Action])




    const handleAction = (e) => {
        var id = e.target.id
        SetID(id)
        // console.log('bottone', e.target)

        if(Action === 'labels'){
            submit1(e,'annotation')
        }
        else if(Action === 'mentions'){
            submit1(e,'mentions')
        }
        else if(Action === 'concepts'){
            submit1(e,'concepts')
        }
        else if(Action === 'concept-mention'){
            submit1(e,'linked')
        }
        else{
            SetAction(id)
        }

        SetWordMention('')
        SetClicked(true)

    }


    return(

        <div className="first_row_container">

            <Button type='button' ref = {labels_but} disabled={DisButtonLabels} size='sm' style={{'padding':'0','height':'35px','width':'85px'}} id='labels' className="act" onClick={(e)=> {
                handleAction(e);
            }} >Labels</Button>

            <Button type='button' disabled={DisButtonMention} size='sm' style={{'padding':'0','height':'35px','width':'85px'}} id='mentions' className="act" onClick={(e)=> {
                handleAction(e);
            }}  >Passages</Button>

            <Button type='button' disabled={DisButtonConceptMention} size='sm' style={{'padding':'0','height':'35px','width':'85px'}} id='concept-mention' className="act" onClick={(e)=> {
                handleAction(e);
            }} >Linking</Button>

           <Button type='button' disabled={DisButtonConcept} size='sm' style={{'padding':'0','height':'35px','width':'85px'}} id='concepts' className="act" onClick={(e)=> {
               handleAction(e);
           }} >Concepts</Button>


    </div>
    );



}


export default Buttons