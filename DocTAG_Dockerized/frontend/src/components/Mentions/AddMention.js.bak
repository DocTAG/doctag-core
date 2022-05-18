import Token, {TokenContext} from "../Report/Token";
import React, { Component } from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import {AppContext}  from "../../App";
import {LinkedContext, MentionContext} from '../../Prova_BaseIndex'
import {Container,Row,Col} from "react-bootstrap";


import { useState, useEffect, useContext } from "react";
// import { useForm } from "react-hook-form";
// import DjangoCSRFToken from 'django-react-csrftoken'
// import cookie from "react-cookies";
import LabelItem from "../Labels/LabelItem";
import {ReportContext} from "../../App";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle,faCheckCircle} from "@fortawesome/free-solid-svg-icons";
// import {Container,Row,Col} from "react-bootstrap";
import Mention from "./Mention";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function AddMention(props){
    const [Text, SetText] = useState('')

    const { tokens,disButton, language,mentionsList, reports, index,  mentionSingleWord,highlightMention, action, mentionToAdd, allMentions } = useContext(AppContext);
    const [mentions_to_show, SetMentions_to_show] = mentionsList;
    const [AllMentions, SetAllMentions] = allMentions
    const [Action, SetAction] = action;
    const [Reports, SetReports] = reports;
    const [Index, SetIndex] = index;
    const [Language, SetLanguage] = language;
    const [MentionToAdd,SetMentionToAdd] = mentionToAdd
    const [WordMention, SetWordMention] = mentionSingleWord;
    const [Children, SetChildren] = tokens;
    const [HighlightMention, SetHighlightMention] = highlightMention;
    // const [mentions_to_show,SetMentions_to_show] = useContext(AppContext)
    const [Disable_Buttons, SetDisable_Buttons] = disButton;



    function order_array(mentions){
        var ordered = []
        var texts = []
        var starts = []
        mentions.map((item,i)=>{
            texts.push(item.mention_text)
        })
        texts.sort()
        // console.log('testi',texts)
        texts.map((start,ind)=>{
            mentions.map((ment,ind1)=>{
                if(start === ment.mention_text){
                    if(ordered.indexOf(ment) === -1){
                        ordered.push(ment)

                    }
                }
            })
        })
        return ordered
    }



    const handleClick=(event,mention)=> {
        SetWordMention([])
        SetMentionToAdd('')
        if (Action === 'mentions') {
            SetDisable_Buttons(false)

            var bool = false // controllo se nelle mention to show c'è già ciò che voglio inserire
            mentions_to_show.map(ment => {
                // console.log('mentions_current',ment.start)
                // console.log('mentions_current',mention.start)
                if ((ment.start === mention.start) && (ment.stop === mention.stop)) {
                    bool = true
                }
            })
            if (bool === true) {
                alert('this mention has been already inserted in the list!')
            } else {
                var mentions = mentions_to_show
                // console.log('mentions_current',mentions)
                mentions.push(mention)
                // console.log('mentions_current',mentions)

                var ordered = order_array(mentions)
                console.log('mentions_current',ordered)

                // SetMentions_to_show([...mentions_to_show, mention])
                SetMentions_to_show(ordered)
            }
        } else if (Action === 'concept-mention') {
            SetDisable_Buttons(false)
            // var mentions = AllMentions
            // mentions.push(mention)
            // var ordered = order_array(mentions)
            // SetAllMentions(ordered)
            //SetAllMentions([...AllMentions, mention])

            // console.log(JSON.stringify(mention))
            var ment = JSON.stringify(mention)
            var ment_to_add = document.getElementsByName('mention_to_add')
            var array_to_ret = []
            array_to_ret.push(MentionToAdd)
            //array_to_ret.push(JSON.stringify(mention))
            //SetAllMentions([...AllMentions, mention])
            axios.post("http://127.0.0.1:8000/insert_link/insert_mention", {

                mentions: array_to_ret,language:Language,
                report_id: Reports[Index].id_report.toString()

            })
                .then(function (response) {
                    var mentions = AllMentions
                    mention['label'] = ''
                    mention['seq_number'] = 0
                    mentions.push(mention)
                    var ordered = order_array(mentions)
                    SetAllMentions(ordered)
                    // SetAllMentions([...AllMentions, mention])
                    //alert('OK')
                    // console.log(response);
                })
                .catch(function (error) {
                    //alert('ATTENTION')
                    console.log(error);
                });




        }
        Children.forEach(function (child) {
            child.setAttribute('class', 'token')
        });
        SetHighlightMention(false)
        // document.getElementById('select_all_butt').style.fontWeight = ''
        // document.getElementById('select_all_butt').style.textDecoration = ''
    }

    const handleDelete = (event,mention)=>{
        // console.log('delete')
        // console.log('delete',Children)

        SetWordMention([])
        SetMentionToAdd('')
        Children.forEach(function(child) {
            if(child.getAttribute('class') !== 'notSelectedMention'){
                child.setAttribute('class','token')
                child.style.cursor = 'pointer';
            }



        });

    }



    useEffect(()=>{
        var text = ''
        var start = 0
        var stop = 0
        if (WordMention.length >0){
            // console.log('toadd',WordMention)

            WordMention.map(mention =>{
                //props.mention_to_add.map(mention =>{
                // console.log('mnt',mention)
                if(text === ''){
                    start  = mention.startToken
                    text = mention.word
                }
                else{
                    start = start < mention.startToken ? start : mention.startToken
                    text = text + ' ' + mention.word

                }
                stop = stop > mention.stopToken ? stop : mention.stopToken
            })
        }

        SetText(text)
        SetMentionToAdd({'mention_text':text,'start':start,'stop':stop})
        // console.log('txt',text)

    },[WordMention])




    return(
        <div>
            <h6>You are adding the mention:</h6>
            <div className="add_mention">

                <div>
                    {Text}

                    {/*<input type="hidden" value={JSON.stringify(MentionToAdd)}  name="mention_to_add"/>*/}

                </div>


                <div>
                    <Button className="add_but" size="sm" variant="primary" onClick={(e)=>handleClick(e,MentionToAdd)} >Add</Button>
                    <Button className="add_but" size="sm" variant ="danger" onClick={(e)=>handleDelete(e,MentionToAdd)} >Remove</Button>
                </div>
            </div>
        </div>
    );


}

export default AddMention