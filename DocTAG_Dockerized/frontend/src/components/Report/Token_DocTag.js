import React, {Component, useEffect,useRef, useState, useContext} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, OverlayTrigger} from "react-bootstrap";
import './report.css';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
// import Tooltip from "react-bootstrap/Tooltip";
import Overlay from 'react-bootstrap/Overlay';
import {AppContext} from "../../App";

import Tooltip from '@mui/material/Tooltip';


function Token_DocTag(props){
    const { tokens,mentionSingleWord,index,tokentocolor,colorword,language,selectedLang,reportString,mentionToAdd,allMentions,action,mentionsList,color,report,finalcount,reached } = useContext(AppContext);
    const [Color,SetColor] = color
    const [ReportString, SetReportString] = reportString;
    const [Action,SetAction] = action
    const [Report,SetReport] = report
    const [ColorWords,SetColorWords] = colorword
    const [ShowAlert1,SetShowAlert1] = useState(false)
    const [ShowAlert2,SetShowAlert2] = useState(false)
    const [ShowAlert3,SetShowAlert3] = useState(false)
    const [FinalCount, SetFinalCount] = finalcount;
    const [Reached,SetReached] = reached;
    const [AllMentions,SetAllMentions] = allMentions
    const [MentionWordsList,SetMentionWordsList] = mentionSingleWord // questo è un array con le singole parole della mention! Nome un po' infelice
    const [ReportWords, SetReportWords] = tokens; //buttons che sono le singole parole del report
    const target = useRef(null);
    const [MentionToAdd, SetMentionToAdd] = mentionToAdd;
    const [LastWordMention, SetLastWordMention] = useState(true);
    const [LastWord, SetLastWord] = useState('');
    const [SelectedLang,SetSelectedLang] = selectedLang
    const [Language,SetLanguage] = language
    const [Index,SetIndex] = index
    const [TokenToColor,SetTokenToColor] = tokentocolor
    const [TokenWords, SetTokenWords] = useState([]);
    const [TokenScores, SetTokenScores] = useState([]);


    useEffect(()=>{
        if(TokenToColor === false){
            SetTokenScores(false)
            SetTokenWords(false)
        }
        else{
            var words = []
            var scores = []
            TokenToColor.map(t=>{
                words.push(t[0])
                scores.push(t[1])
            })
            // console.log('words',words)
            // console.log('words',scores)
            SetTokenWords(words)
            SetTokenScores(scores)
        }
    },[TokenToColor])



    useEffect(()=>{ //Cambio azione e inizializzo tutto
        if((props.action === 'mentions' || props.action === 'concept-mention') && SelectedLang === Language){
            // console.log('PASSO DI QUA, TOKENS')
            var array = Array.from(document.getElementsByName('butt'))
            //console.log('ARRARRA',array)
            var child = document.getElementById(props.start_token.toString())
            // console.log('child',child.id)
            child.removeAttribute('style')
            child.setAttribute('class','token')

            // array.map(child=>{
            //
            //     child.removeAttribute('style')
            //     child.setAttribute('class','token')
            //
            // });

            //console.log('ARR',array)
            if(FinalCount === array.length){
                // console.log('AGG')
                SetReportWords(array)
            }

            SetMentionWordsList([])
            SetLastWord('')

            // console.log('RISPOSTA4')
            // SetAllMentions([])
        }

    },[Action,Index,SelectedLang])


    const handleVisible1 = () => {
        SetShowAlert1(true)
        setTimeout(() => {
            SetShowAlert1(false)
        }, 2000);
    }
    const handleVisible2 = () => {
        SetShowAlert2(true)
        setTimeout(() => {
            SetShowAlert2(false)
        }, 2000);
    }
    const handleVisible3 = () => {
        SetShowAlert3(true)
        setTimeout(() => {
            SetShowAlert3(false)
        }, 2000);
    }



    const handleClick = (e) => {
        e.preventDefault();
        SetLastWordMention(false)
        SetShowAlert1(false)
        SetShowAlert2(false)
        SetShowAlert3(false)
        if(Action === 'concept-mention' && document.getElementById("linked-list") !== null){
            document.getElementById("linked-list").scroll(0, 0)

        }
        if(Action === 'mentions' && document.getElementById("mentions_list") !== null){
            document.getElementById("mentions_list").scroll(0, 0)

        }
        // console.log('target', ReportWords)
        // console.log('target',e.target.className.toString())
        if(e.target.className.toString() === 'notSelected' ){
            SetShowAlert1(true)
            // alert('NOT ALLOWED!')
            handleVisible1();

        }
        else if(e.target.className.toString() === 'token-selected'){
            //alert('ALREADY SELECTED!')
            SetShowAlert2(true)
            handleVisible2();

        }
        else if(e.target.className.toString() === 'notSelectedMention'){
            //alert('ALREADY SELECTED!')
            SetShowAlert3(true)
            handleVisible3();

        }
        else {

            var array = []
            var obj = ''
            obj = props.start_token + ' ' + props.stop_token + ' ' + props.words[props.index].word
            //alert(obj)
            if(MentionWordsList.length===0 && document.getElementsByClassName('token-selected').length>0){
                ReportWords.map(child=>{
                    child.setAttribute('class','token')

                })
            }

            var array_words = Array.from(document.getElementsByName("butt"))
            var array_selected = Array.from(document.getElementsByClassName("token-selected"))
            console.log('array_selected',array_selected)

            SetReportWords(array_words)
            // if(start_already_sel >= current){
            //     var last_id = current
            // }
            // else{
            //     var last_id = start_already_sel
            // }
            var tokens_prev = []
            var tokens_next = []
            var stop = false
            array_words.map((child,index) => {
                // if(child.getAttribute('class') !== 'token-adj-dx' && child.getAttribute('class') !== 'token-adj-sx' && child.getAttribute('class')!== 'token-selected'&& child.getAttribute('class')!== 'notSelectedMention'){
                //     child.setAttribute('class','notSelected')
                //
                //
                // }
                if(array_selected.length === 0){
                    if(Number(child.id) === Number(props.start_token)){

                        array_words.map((word,ind)=>{

                            if(Number(word.id) < Number(child.id)){
                                // console.log('word',word.id)
                                // console.log('word_1',child.id)
                                if(word.getAttribute('class') !== 'notSelected' && word.getAttribute('class') !== 'notSelectedMention'){
                                    tokens_prev.push(word)
                                }
                                else {
                                    tokens_prev = []
                                }
                            }
                            if(Number(word.id) >= Number(child.id)){
                                // console.log('word greater',word.id)
                                // console.log('word_1 greater',child.id)
                                if(word.getAttribute('class') !== 'notSelected' && stop === false && word.getAttribute('class') !== 'notSelectedMention'){
                                    tokens_next.push(word)
                                }
                                else{
                                    stop = true
                                }

                            }
                            // console.log('PREV',tokens_prev)
                            // console.log('NEXT',tokens_next)
                        })


                        child.setAttribute('class','token-selected')
                        child.style.cursor = 'default'

                        if((props.words[props.index+1] !== undefined) && (array_words[index+1] !== undefined) ){
                            if(array_words[index + 1].getAttribute('class') !==  'token-selected' && array_words[index + 1].getAttribute('class') !==  'notSelectedMention') {
                                // console.log('class_attr_next',array_words[index + 1])
                                // console.log('class_attr_next',array_words[index + 1].getAttribute('class'))
                                array_words[index + 1].setAttribute('class', 'token-adj-dx')
                            }
                        }
                        if((props.words[props.index-1] !== undefined) && (array_words[index-1] !== undefined) ){
                            if(array_words[index - 1].getAttribute('class') !==  'token-selected' && array_words[index - 1].getAttribute('class') !==  'notSelectedMention'){
                                // console.log('class_attr_prev',array_words[index - 1])
                                // console.log('class_attr_prev',array_words[index - 1].getAttribute('class'))
                                array_words[index - 1].setAttribute('class', 'token-adj-sx')

                            }

                        }
                    }
                }
                else{
                    var start_already_sel = array_selected[0].id
                    var current = props.start_token
                    // console.log('mentiosn_words',MentionWordsList)
                    if (Number(props.start_token) > Number(start_already_sel)){
                        if(Number(child.id) >= Number(start_already_sel) && Number(child.id) <= Number(current)){
                            // if(child.getAttribute('class') !== 'token-selected'){
                            //     SetMentionWordsList(prevState => [...prevState,props.words[props.index]])
                            // }
                            child.setAttribute('class','token-selected')
                            child.style.cursor = 'default'
                            if((props.words[props.index+1] !== undefined) && (array_words[index+1] !== undefined) ){
                                if(array_words[index + 1].getAttribute('class') !==  'token-selected' && array_words[index + 1].getAttribute('class') !==  'notSelectedMention') {
                                    // console.log('class_attr_next',array_words[index + 1])
                                    // console.log('class_attr_next',array_words[index + 1].getAttribute('class'))
                                    array_words[index + 1].setAttribute('class', 'token-adj-dx')
                                }
                            }
                            if((props.words[props.index-1] !== undefined) && (array_words[index-1] !== undefined) ){
                                if(array_words[index - 1].getAttribute('class') !==  'token-selected' && array_words[index - 1].getAttribute('class') !==  'notSelectedMention'){
                                    // console.log('class_attr_prev',array_words[index - 1])
                                    // console.log('class_attr_prev',array_words[index - 1].getAttribute('class'))
                                    array_words[index - 1].setAttribute('class', 'token-adj-sx')

                                }

                            }
                        }
                    }
                    else{
                        if(Number(child.id) >= Number(current) && Number(child.id) <= Number(start_already_sel)){
                            // if(child.getAttribute('class') !== 'token-selected'){
                            //     SetMentionWordsList(prevState => [props.words[props.index],...prevState])
                            // }
                            child.setAttribute('class','token-selected')
                            child.style.cursor = 'default'
                            if((props.words[props.index+1] !== undefined) && (array_words[index+1] !== undefined) ){
                                if(array_words[index + 1].getAttribute('class') !==  'token-selected' && array_words[index + 1].getAttribute('class') !==  'notSelectedMention') {
                                    // console.log('class_attr_next',array_words[index + 1])
                                    // console.log('class_attr_next',array_words[index + 1].getAttribute('class'))
                                    array_words[index + 1].setAttribute('class', 'token-adj-dx')
                                }
                            }
                            if((props.words[props.index-1] !== undefined) && (array_words[index-1] !== undefined) ){
                                if(array_words[index - 1].getAttribute('class') !==  'token-selected' && array_words[index - 1].getAttribute('class') !==  'notSelectedMention'){
                                    // console.log('class_attr_prev',array_words[index - 1])
                                    // console.log('class_attr_prev',array_words[index - 1].getAttribute('class'))
                                    array_words[index - 1].setAttribute('class', 'token-adj-sx')

                                }

                            }
                        }
                    }

                }


            })
            if(array_selected.length === 0) {
                array_words.map(child=>{
                    if((tokens_next.indexOf(child) === -1 && tokens_prev.indexOf(child) === -1)){
                        child.setAttribute('class','notSelectedMention')
                    }
                })
            }

            var array_selected = Array.from(document.getElementsByClassName("token-selected"))
            var ids = []
            array_selected.map(el=>{
                ids.push(Number(el.id))
            })
            var sortedPs =ids.sort(function (a, b) {  return a - b;  });
            var s = []
            sortedPs.map(element=>{
                s.push(document.getElementById(element.toString()))
            })
            console.log('sorted',sortedPs)
            var arr = []
            s.map(el=>{
                var ind = array_words.indexOf(el)
                // console.log('val',array_words)
                // console.log('val',ind)
                // console.log('val',props.words[ind])
                arr.push(props.words[ind])
            })
            SetMentionWordsList(arr)



        }
    }




    if(props.action === 'mentions' || props.action === 'concept-mention'){
        return (
            <span>
                <Tooltip
                    // PopperProps={{
                    //     disablePortal: true,
                    // }}
                    arrow
                    leaveDelay = '100'
                    open={ShowAlert1 || ShowAlert2 || ShowAlert3}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={(ShowAlert1 && "Not allowed") || (ShowAlert2 && "Already selected*") || (ShowAlert3 && "It is a mention")}
                >
            {(TokenWords && TokenWords.indexOf(props.word.toLowerCase()) !== -1) ?

                <button ref={target} name="butt" id={props.start_token} className="token" onClick={handleClick}
                           value={props.word}>
                       <Tooltip arrow disableFocusListener disableTouchListener  placement="top" title={'TF-IDF: '+TokenScores[Number(TokenWords.indexOf(props.word.toLowerCase()))].toString()}>
                           <span><b>{props.word}</b></span></Tooltip></button>
                    :
                    <button ref={target} name="butt" id={props.start_token} className="token" onClick={handleClick}
                                                             value={props.word}>
                    {props.word} </button>}

                </Tooltip>



                {/*<Overlay target={target.current} show={ShowAlert1} placement="top">*/}
                {/*    {(props) => (*/}
                {/*        <Tooltip  {...props}>*/}
                {/*            Not allowed*/}
                {/*        </Tooltip>*/}
                {/*    )}*/}
                {/*</Overlay>*/}
                {/*<Overlay target={target.current} show={ShowAlert2} placement="top">*/}
                {/*    {(props) => (*/}
                {/*        <Tooltip {...props}>*/}
                {/*            Already selected*/}
                {/*        </Tooltip>*/}
                {/*    )}*/}
                {/*</Overlay>*/}
                {/*<Overlay target={target.current} show={ShowAlert3} placement="top">*/}
                {/*    {(props) => (*/}
                {/*        <Tooltip {...props}>*/}
                {/*            It is a mention*/}
                {/*        </Tooltip>*/}
                {/*    )}*/}
                {/*</Overlay>*/}

            </span>

        );

    }

    else if(props.action === 'mentionsList' && Color !== ''){ //Colora nella lista a destra
        return (
            <>
            {(TokenWords && TokenWords.indexOf(props.word.toLowerCase()) !== -1) ?

                <Tooltip disableFocusListener disableTouchListener title={TokenScores[Number(TokenWords.indexOf(props.word.toLowerCase()))].toString()}>
                    <span className='span_to_highlight' id={props.start_token}><b>{props.word}</b></span></Tooltip> : <span className='span_to_highlight' id={props.start_token}>{props.word}</span>
            }</>

        );

    }

    return (

        <>
        {(TokenWords && TokenWords.indexOf(props.word.toLowerCase()) !== -1) ?


            <Tooltip disableFocusListener disableTouchListener title={TokenScores[Number(TokenWords.indexOf(props.word.toLowerCase()))].toString()}>
                <span className='span_to_highlight' id={props.start_token}><b>{props.word}</b></span></Tooltip> : <span className='span_to_highlight' id={props.start_token}>{props.word}</span>}</>

    );




}




export default Token_DocTag;