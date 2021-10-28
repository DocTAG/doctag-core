import Token from "../Report/Token";
import React, { Component } from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle,faEdit, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import './mention.css';
import {AppContext}  from "../../App";
import {PassageContext}  from "../Passages/PassageLabelsList";
import {LinkedContext, MentionContext} from '../../Prova_BaseIndex'
import {Container,Row,Col} from "react-bootstrap";

// import { useForm } from "react-hook-form";
// import DjangoCSRFToken from 'django-react-csrftoken'

import cookie from "react-cookies";

import LabelItem from "../Labels/LabelItem";
import SnackBar from "../General/SnackBar";
import Token_DocTag from "../Report/Token_DocTag";
// import {Container,Row,Col} from "react-bootstrap";
//
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function Mention(props){
    const [WordsMention, SetWordsMention] = useState([])
    // const {showlabels} = useContext(PassageContext);
    const { tokens,language,showannotations,colorword,showlabels,labelsList,showmajoritymodal,showautoannotation,showmember,showSnackMessage,showSnackMention, disButton, highlightMention, color, showSnack, finalcount,reports, action,index,mentionSingleWord, mentionsList } = useContext(AppContext);
    //const [WordsMention, SetWordsMention] = mentionSingleWord;
    const [ShowSnackMention,SetShowSnackMention] = showSnackMention;
    const [SnackMessage,SetSnackMessage] = showSnackMessage;
    const [Disable_Buttons, SetDisable_Buttons] = disButton;
    const [Index, SetIndex] = index;
    const [Language, SetLanguage] = language;
    const [ShowAutoAnn,SetShowAutoAnn] = showautoannotation;
    const [ShowLabelsOpts,SetShowLabelsOpts] = showlabels
    const [ShowMemberGt,SetShowMemberGt] =showmember
    const [ShowMajorityModal,SetshowMajorityModal] = showmajoritymodal
    const [labels, setLabels] = labelsList

    //const { mentionsList } = useContext(MentionContext);
    // const [mentions_to_show, SetMentions_to_show] = mentions;
    // const [WordMention, SetWordMention] = mentionSingleWord;
    const [mentions_to_show,SetMentions_to_show] = mentionsList;
    const [Children, SetChildren] = tokens;
    const [HighlightMention, SetHighlightMention] = highlightMention;
    //var active_mentions = new Array(mentions_to_show.length).fill(false)
    //const [Active, SetActive] = useState(active_mentions)
    const [Color, SetColor] = color
    const [Reports, SetReports] = reports;
    // added by Ornella 26072021
    const [ShowAnnotationsStats,SetShowAnnotationsStats] = showannotations
    const [ColorWords,SetColorWords] = colorword



    const onDelete_Mention = (start,stop,text) => {
        //console.log('delete mention')
        SetShowSnackMention(true)


        SetDisable_Buttons(false)
        var array_to_show = []
        // var colors = Color
        // var col = colors[props.id]
        // //console.log('col',col)
        // colors.splice(props.id,1)
        // //colors.push(col)
        // if(mentions_to_show.length <= colors.length){
        //     colors.splice(mentions_to_show.length-1, 0, col);
        //
        // }
        // else{
        //     colors.push(col)
        // }
        //console.log('colors',colors)
        var arr_to_black = fromMentionToArray(text,start)
        Children.map(child=>{
            arr_to_black.map(word=>{
                if(child.id.toString() === word.startToken.toString()){
                    child.setAttribute('class','token')
                    child.removeAttribute('style')

                }

            })
        })
        mentions_to_show.map(mention =>{
            if((mention['start'] !== start) || (mention['stop'] !== stop)){
                array_to_show.push(mention)
            }

        })
        SetMentions_to_show(array_to_show)
        // SetColor(colors)

    }






    const handleHighlight = (e,WordsMention) =>{
        SetHighlightMention(false)
        // SetColorWords(false)
        // Children.map(child=>child.setAttribute('font-weight','normal'))

        var scroll = false
        Children.map(child=>{
            WordsMention.map(word=>{
                if(child.id.toString() === word.startToken.toString()){
                    if(scroll === false && (child.style.fontWeight === 'normal' || child.style.fontWeight === '')){

                        child.scrollIntoView({ behavior: 'smooth',block: "nearest"})
                        scroll = true
                    }

                    child.style.fontWeight === 'bold' ? child.style.fontWeight = '' : child.style.fontWeight = 'bold'


                }
            })
        })
        // e.target.style.fontWeight === 'bold' ? e.target.style.fontWeight = 'normal' : e.target.style.fontWeight = 'bold'
        var bottone_mention = Array.from(document.getElementsByClassName('butt_mention'))
        // var str = '#'+ WordsMention[0].start + '.butt_mention'
        // var bottone_mention =document.getElementById(WordsMention[0].startToken.toString()).getElementsByClassName("butt_mention")[0];
        bottone_mention.map(bottone=>{

            if(bottone.id.toString() === WordsMention[0].startToken.toString()){
                // console.log('1',bottone.id.toString())
                // console.log('2',WordsMention[0].startToken.toString())
                bottone.style.fontWeight === 'bold' ? bottone.style.fontWeight = '' : bottone.style.fontWeight = 'bold'

            }
        })
        // bottone_mention[props.id].style.fontWeight === 'bold' ? bottone_mention[props.id].style.fontWeight = '' : bottone_mention[props.id].style.fontWeight = 'bold'

    }


    function fromMentionToArray(text,start1){
        var array = []
        var words = []
        console.log('mention',text)

        var stringa = text.toString() //The age is considered an integer!!
        if(stringa.indexOf(' ')){
            words = stringa.split(' ')

        }
        else{
            words.push(stringa)
        }
        // console.log('startpassato',props.startSectionChar)
        var start = start1
        var last = words.slice(-1)[0]
        var chars = [',','.',':',';']
        words.map((word,index) =>{
            var apostrofo = false
            var end = start + word.length - 1
            word = word.replace(/[.,#!$%\^&\*;:{}=`~()]/g,"");
            if(word.includes("'") && Language === 'Italian'){
                apostrofo = true
                //word = word.split("'")[1]
            }

            var obj = {'word':word,'startToken':start,'stopToken':end}

            array.push(obj)
            start = end + 2 //tengo conto dello spazio
            // console.log('obj',obj)

        })

        return array
    }

    useEffect(()=>{
        var array = fromMentionToArray(props.text,props.start)
        SetWordsMention(array)

    },[props.text,props.start,props.stop])

    function mouseHover(e,mention,action){
        // GESTIONE HOVER NEL REPORTLISTUPDATED DELLE MODALI
        var token_list = fromMentionToArray(mention.mention,mention.start)
        var doc = document.getElementById(token_list[0].startToken)
        console.log('hover')
        if(action === 'hover'){
            doc.scrollIntoView()
            // var tokens_butt = Array.from(document.getElementById(mention.start))
            token_list.map((ment,ind)=>{

                var token_sel = document.getElementById(ment.startToken)
                token_sel.style.color = 'royalblue'
                token_sel.style.fontWeight = 'bold'
            })
        }
        else{
            console.log('out')

            // token_list[0].scrollIntoView({ behavior: 'smooth',block: "nearest"})
            // var tokens_butt = Array.from(document.getElementById(mention.start))
            token_list.map((ment,ind)=>{
                var token_sel = document.getElementById(ment.startToken)
                token_sel.style.color = 'black'
                token_sel.style.fontWeight = 'normal'
            })
        }

    }

    function show_lab(option){
        if(ShowLabelsOpts.length > 0){
            SetShowLabelsOpts([])
        }
        else{
            var arr = new Array(labels.length).fill(false);
            arr[option] = true
            SetShowLabelsOpts(arr)
        }

    }

    return(
        <>
            {(ShowAnnotationsStats === true || ShowMajorityModal === true) ?
                    <div style={{'text-align':'left'}} onMouseOver={(e)=>mouseHover(e,props.mention_obj,'hover')} onMouseOut={(e)=>mouseHover(e,props.mention_obj,'out')} className="butt_mention" >
                        {Color !== '' && WordsMention.map((word,index)=>

                            <div style={{'float':'left','margin':0}}><Token index_mention={props.id} action='mentionsList' words={WordsMention} start_token={word.startToken}
                                                                 stop_token={word.stopToken} word={word.word} index={index}/>&nbsp;</div>
                        )}

                    </div>
                 :

            <Row>
                <Col md={9} className='left_list'>

                    <button style={{'text-align':'left'}} className="butt_mention" id={props.start} name={props.index} type="button" onClick={(e)=>handleHighlight(e,WordsMention)} >
                        {Color !== '' && WordsMention.map((word,index)=>

                            <div style={{'float':'left'}}><Token_DocTag index_mention={props.id} action='mentionsList' words={WordsMention} start_token={word.startToken}
                                         stop_token={word.stopToken} word={word.word} index={index}/>&nbsp;</div>
                        )}

                    </button>

                </Col>

                <Col md={3} className='right_remove'>
                    {ShowAutoAnn === false && ShowMemberGt === false && <Button onClick={(e)=>{show_lab(props.index)}} className = "button_e_concept btn btn-link btn-lg" variant="Link" ><FontAwesomeIcon icon={faEdit} /></Button>}
                    {ShowAutoAnn === false && ShowMemberGt === false && <Button  className = "button_x_concept btn btn-link btn-lg" variant="Link" onClick={()=>onDelete_Mention(props.start,props.stop,props.text)}><FontAwesomeIcon icon={faTimesCircle} /></Button>}
                </Col>
            </Row>}
            </>

    );



}

export default Mention