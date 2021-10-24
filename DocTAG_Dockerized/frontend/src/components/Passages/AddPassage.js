import Token, {TokenContext} from "../Report/Token";
import React, { Component } from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import {AppContext}  from "../../App";
import {LinkedContext, MentionContext} from '../../BaseIndex'
import {Container,Row,Col} from "react-bootstrap";
import { faTimesCircle,faEye, faTrash} from '@fortawesome/free-solid-svg-icons';


import { useState, useEffect, useContext } from "react";
// import { useForm } from "react-hook-form";
// import DjangoCSRFToken from 'django-react-csrftoken'
// import cookie from "react-cookies";
import LabelItem from "../Labels/LabelItem";
import {ReportContext} from "../../App";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faTimesCircle,faCheckCircle} from "@fortawesome/free-solid-svg-icons";
// import {Container,Row,Col} from "react-bootstrap";
import Mention from "../Mentions/Mention";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function AddPassage(props){
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
            <div className="add_mention">

                <div style={{marginBottom:'2%',color:'royalblue',fontWeight:'bold',fontSize:'1.1rem'}}>
                    {Text}

                    {/*<input type="hidden" value={JSON.stringify(MentionToAdd)}  name="mention_to_add"/>*/}

                </div>


                <div style={{marginBottom:'2%',textAlign:'end'}}>
                    <Button className="add_but" size="sm" variant ="danger" onClick={(e)=>handleDelete(e,MentionToAdd)} ><FontAwesomeIcon icon={faTrash} /></Button>
                </div>
            </div>
        </div>
    );


}

export default AddPassage