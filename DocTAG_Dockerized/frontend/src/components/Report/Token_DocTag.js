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





function Token_DocTag(props) {
    const {
        tokens,
        mentionSingleWord,
        index,
        tokentocolor,
        language,
        selectedLang,
        fields,
        fieldsToAnn,
        reportString,
        mentionToAdd,
        allMentions,
        action,
        mentionsList,
        color,
        report,
        finalcount,
        reached
    } = useContext(AppContext);
    const [Color, SetColor] = color
    const [ReportString, SetReportString] = reportString;
    const [Action, SetAction] = action
    const [Report, SetReport] = report
    const [ShowAlert1, SetShowAlert1] = useState(false)
    const [ShowAlert2, SetShowAlert2] = useState(false)
    const [ShowAlert3, SetShowAlert3] = useState(false)
    const [FinalCount, SetFinalCount] = finalcount;
    const [Reached, SetReached] = reached;
    const [AllMentions, SetAllMentions] = allMentions
    const [MentionWordsList, SetMentionWordsList] = mentionSingleWord // questo è un array con le singole parole della mention! Nome un po' infelice
    const [ReportWords, SetReportWords] = tokens; //buttons che sono le singole parole del report
    const target = useRef(null);
    const [MentionToAdd, SetMentionToAdd] = mentionToAdd;
    const [LastWordMention, SetLastWordMention] = useState(true);
    const [LastWord, SetLastWord] = useState('');
    const [SelectedLang, SetSelectedLang] = selectedLang
    const [Language, SetLanguage] = language
    const [Index, SetIndex] = index
    const [Fields, SetFields] = fields;
    const [FieldsToAnn, SetFieldsToAnn] = fieldsToAnn;
    const token_ref = useRef(null);
    const [TokenToColor, SetTokenToColor] = tokentocolor
    const [TokenWords, SetTokenWords] = useState([]);
    const [TokenScores, SetTokenScores] = useState([]);

    useEffect(() => {
        console.log('tokenc', TokenToColor)
        if (TokenToColor === false) {
            SetTokenScores(false)
            SetTokenWords(false)
        } else {
            var words = []
            var scores = []
            TokenToColor.map(t => {
                words.push(t[0])
                scores.push(t[1])
            })
            console.log('words', words)
            console.log('words', scores)
            SetTokenWords(words)
            SetTokenScores(scores)
        }
    }, [TokenToColor])

    useEffect(() => {
        token_ref.current = props.word //Cambio azione e inizializzo tutto
        if ((props.action === 'mentions' || props.action === 'concept-mention') && SelectedLang === Language) {
            var child = document.getElementById(props.start_token.toString())
            child.removeAttribute('style')
            child.setAttribute('class', 'token')
            // console.log('rp',props.index === props.words.length -1)
            // console.log('rp',props.index)
            // console.log('rp',props.words.length -1)

            if (props.index === props.words.length - 1) {
                var array = Array.from(document.getElementsByName('butt'))

                SetReportWords(array)
            }


            SetMentionWordsList([])

            SetLastWord('')


        }

    }, [Action, Index, SelectedLang, FinalCount, Fields, FieldsToAnn])
    //Action,Index,SelectedLang,FinalCount,Fields,FieldsToAnn


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


    function handleClick(e, id) {
        e.preventDefault();
        console.log('target', e.target.id)
        SetLastWordMention(false)
        SetShowAlert1(false)
        SetShowAlert2(false)
        SetShowAlert3(false)
        if (Action === 'concept-mention' && document.getElementById("linked-list") !== null) {
            document.getElementById("linked-list").scroll(0, 0)

        }
        if (Action === 'mentions' && document.getElementById("mentions_list") !== null) {
            document.getElementById("mentions_list").scroll(0, 0)

        }
        // console.log('target', ReportWords)
        // console.log('target',e.target.className.toString())
        if (e.target.className.toString() === 'notSelected' || e.target.className.toString() === 'tokenOtherField') {
            SetShowAlert1(true)
            // alert('NOT ALLOWED!')
            handleVisible1();

        } else if (e.target.className.toString() === 'token-selected') {
            //alert('ALREADY SELECTED!')
            SetShowAlert2(true)
            handleVisible2();

        } else if (e.target.className.toString() === 'notSelectedMention') {
            //alert('ALREADY SELECTED!')
            SetShowAlert3(true)
            handleVisible3();

        } else {

            var array = []
            var obj = ''
            obj = props.start_token + ' ' + props.stop_token + ' ' + props.words[props.index].word
            //alert(obj)
            if (MentionWordsList.length === 0 && document.getElementsByClassName('token-selected').length > 0) {
                ReportWords.map(child => {
                    child.setAttribute('class', 'token')

                })
            }
            ReportWords.map(child => {
                if (Number(child.id) < Number(props.words[0].startToken) || Number(child.id) > Number(props.words[props.words.length - 1].startToken)) {
                    if (child.getAttribute('class') === 'token') {
                        child.setAttribute('class', 'tokenOtherField')

                    }
                }


            })
            // console.log('START',id)
            // console.log('START',props.words)
            // console.log('START',props.index)


            var array_words = Array.from(document.getElementsByName("butt"))
            var array_selected = Array.from(document.getElementsByClassName("token-selected"))
            // console.log('array_selected',array_selected)
            // console.log('array_selected',array_words)

            SetReportWords(array_words)

            var tokens_prev = []
            var tokens_next = []
            var stop = false
            array_words.map((child, index) => {
                if (array_selected.length === 0) {
                    if (Number(child.id) === Number(id)) {
                        array_words.map((word, ind) => {

                            if (Number(id) >= Number(word.id)) {

                                if (word.getAttribute('class') !== 'notSelected' && word.getAttribute('class') !== 'notSelectedMention') {
                                    tokens_prev.push(word)
                                } else {
                                    tokens_prev = []
                                }
                            }
                            if (Number(id) < Number(word.id)) {

                                if (word.getAttribute('class') !== 'notSelected' && stop === false && word.getAttribute('class') !== 'notSelectedMention') {
                                    tokens_next.push(word)
                                } else {
                                    stop = true
                                }

                            }

                        })


                        child.setAttribute('class', 'token-selected')
                        child.style.cursor = 'default'

                        if ((props.words[props.index + 1] !== undefined) && (array_words[index + 1] !== undefined)) {
                            if (array_words[index + 1].getAttribute('class') !== 'token-selected' && array_words[index + 1].getAttribute('class') !== 'notSelectedMention') {
                                // console.log('class_attr_next',array_words[index + 1])
                                // console.log('class_attr_next',array_words[index + 1].getAttribute('class'))
                                array_words[index + 1].setAttribute('class', 'token-adj-dx')
                            }
                        }
                        if ((props.words[props.index - 1] !== undefined) && (array_words[index - 1] !== undefined)) {
                            if (array_words[index - 1].getAttribute('class') !== 'token-selected' && array_words[index - 1].getAttribute('class') !== 'notSelectedMention') {
                                // console.log('class_attr_prev',array_words[index - 1])
                                // console.log('class_attr_prev',array_words[index - 1].getAttribute('class'))
                                array_words[index - 1].setAttribute('class', 'token-adj-sx')

                            }

                        }
                    }
                } else {
                    var start_already_sel = array_selected[0].id
                    var current = id
                    // console.log('valval',current)
                    // console.log('valval',start_already_sel)
                    // console.log('valval',props.words[props.index-1])
                    // console.log('valval',props.words[props.index+1])
                    // console.log('valval',props.words)
                    // console.log('mentiosn_words',MentionWordsList)
                    if (Number(current) >= Number(start_already_sel)) {
                        // DELL?ULTIMO
                        if (Number(child.id) >= Number(start_already_sel) && Number(child.id) <= Number(current)) {
                            // if(child.getAttribute('class') !== 'token-selected'){
                            //     SetMentionWordsList(prevState => [...prevState,props.words[props.index]])
                            // }
                            console.log('entro qua 1')
                            child.setAttribute('class', 'token-selected')
                            child.style.cursor = 'default'
                            if ((props.words[props.index + 1] !== undefined) && (array_words[index + 1] !== undefined)) {
                                if (array_words[index + 1].getAttribute('class') !== 'token-selected' && array_words[index + 1].getAttribute('class') !== 'notSelectedMention') {
                                    // console.log('class_attr_next',array_words[index + 1])
                                    // console.log('class_attr_next',array_words[index + 1].getAttribute('class'))
                                    array_words[index + 1].setAttribute('class', 'token-adj-dx')
                                }
                            }
                            // DEL PRIMO
                            if ((Number(props.words[0].startToken) < start_already_sel) && (array_words[index - 1] !== undefined)) {
                                if (array_words[index - 1].getAttribute('class') !== 'token-selected' && array_words[index - 1].getAttribute('class') !== 'notSelectedMention') {
                                    // console.log('class_attr_prev',array_words[index - 1])
                                    // console.log('class_attr_prev',array_words[index - 1].getAttribute('class'))
                                    array_words[index - 1].setAttribute('class', 'token-adj-sx')

                                }

                            }
                        }
                    } else {
                        if (Number(child.id) >= Number(current) && Number(child.id) <= Number(start_already_sel)) {
                            // if(child.getAttribute('class') !== 'token-selected'){
                            //     SetMentionWordsList(prevState => [props.words[props.index],...prevState])
                            // }
                            // console.log('entro qua 2')

                            child.setAttribute('class', 'token-selected')
                            child.style.cursor = 'default'
                            if ((Number(props.words[props.words.length - 1].startToken) > Number(start_already_sel)) && (array_words[index + 1] !== undefined)) {
                                if (array_words[index + 1].getAttribute('class') !== 'token-selected' && array_words[index + 1].getAttribute('class') !== 'notSelectedMention') {
                                    // console.log('class_attr_next',array_words[index + 1])
                                    // console.log('class_attr_next',array_words[index + 1].getAttribute('class'))
                                    array_words[index + 1].setAttribute('class', 'token-adj-dx')
                                }
                            }
                            if ((props.words[props.index - 1] !== undefined) && (array_words[index - 1] !== undefined)) {
                                if (array_words[index - 1].getAttribute('class') !== 'token-selected' && array_words[index - 1].getAttribute('class') !== 'notSelectedMention') {
                                    // console.log('class_attr_prev',array_words[index - 1])
                                    // console.log('class_attr_prev',array_words[index - 1].getAttribute('class'))
                                    array_words[index - 1].setAttribute('class', 'token-adj-sx')

                                }

                            }
                        }
                    }

                }


            })
            // if(array_selected.length === 0) {
            //     array_words.map(child=>{
            //         if((tokens_next.indexOf(child) === -1 && tokens_prev.indexOf(child) === -1)){
            //             child.setAttribute('class','notSelectedMention')
            //         }
            //     })
            // }

            var array_selected = Array.from(document.getElementsByClassName("token-selected"))
            var ids = []
            array_selected.map(el => {
                ids.push(Number(el.id))
            })
            var sortedPs = ids.sort(function (a, b) {
                return a - b;
            });
            var s = []
            sortedPs.map(element => {
                s.push(document.getElementById(element.toString()))
            })
            // console.log('sorted',sortedPs)
            var arr = []
            // console.log('s',s)
            s.map(el => {
                // console.log('el',el)
                var ind = array_words.indexOf(el)
                // console.log('val',array_words[ind])
                // console.log('val',array_words[ind].value)
                // console.log('val',props.words[ind])
                // console.log('val',props.words.filter(el=>el.word === array_words[ind].value)[0])
                // console.log('val',ind)
                // console.log('val',props.words[ind].id)
                arr.push(props.words.filter(el => el.word === array_words[ind].value && Number(el.startToken) === Number(array_words[ind].id))[0])
            })
            // console.log('START',arr)
            // console.log('START',array_selected)
            SetMentionWordsList(arr)


        }
    }

    // if(props.action === 'mentions' || props.action === 'concept-mention'){
    //     return (
    //         <span>
    //             <Tooltip
    //                 // PopperProps={{
    //                 //     disablePortal: true,
    //                 // }}
    //                 arrow
    //                 leaveDelay = '100'
    //                 open={ShowAlert1 || ShowAlert2 || ShowAlert3}
    //                 disableFocusListener
    //                 disableHoverListener
    //                 disableTouchListener
    //                 title={(ShowAlert1 && "Not allowed") || (ShowAlert2 && "Already selected*") || (ShowAlert3 && "It is a mention")}
    //             >
    //         {(TokenWords && TokenWords.indexOf(props.word.toLowerCase()) !== -1) ?
    //
    //             <button ref={target} name="butt" id={props.start_token} className="token" onClick={handleClick}
    //                     value={props.word}>
    //                 <Tooltip arrow disableFocusListener disableTouchListener  placement="top" title={'TF-IDF: '+TokenScores[Number(TokenWords.indexOf(props.word.toLowerCase()))].toString()}>
    //                     <span><b>{props.word}</b></span></Tooltip>
    //                 </button>
    //             :
    //             <button ref={target} name="butt" id={props.start_token} className="token" onClick={handleClick}
    //                     value={props.word}>
    //                 {props.word} </button>}
    //
    //             </Tooltip>
    //
    //
    //
    //
    //
    //         </span>
    //
    //     );
    //
    // }
    //
    // else if(props.action === 'mentionsList' && Color !== ''){ //Colora nella lista a destra
    //     return (
    //         <>
    //             {(TokenWords && TokenWords.indexOf(props.word.toLowerCase()) !== -1) ?
    //
    //                 <Tooltip disableFocusListener disableTouchListener title={TokenScores[Number(TokenWords.indexOf(props.word.toLowerCase()))].toString()}>
    //                     <span className='span_to_highlight' id={props.start_token}><b>{props.word}</b></span></Tooltip> : <span className='span_to_highlight' id={props.start_token}>{props.word}</span>
    //             }</>
    //
    //     );
    //
    // }
    //
    // return (
    //
    //     <>
    //         {(TokenWords && TokenWords.indexOf(props.word.toLowerCase()) !== -1) ?
    //
    //
    //             <Tooltip disableFocusListener disableTouchListener title={TokenScores[Number(TokenWords.indexOf(props.word.toLowerCase()))].toString()}>
    //                 <span className='span_to_highlight' id={props.start_token}><b>{props.word}</b></span></Tooltip> : <span className='span_to_highlight' id={props.start_token}>{props.word}</span>}</>
    //
    // );


    {
        if (props.action === 'mentions' || props.action === 'concept-mention') {
            return (
                <>


            <span>
                <Tooltip
                    // PopperProps={{
                    //     disablePortal: true,
                    // }}
                    arrow
                    leaveDelay='100'
                    open={ShowAlert1 || ShowAlert2 || ShowAlert3}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={(ShowAlert1 && "Not allowed") || (ShowAlert2 && "Already selected*") || (ShowAlert3 && "It is a mention")}
                >
            {(TokenWords && TokenWords.indexOf(props.word.toLowerCase()) !== -1) ?
                <button ref={target} name="butt" id={props.start_token} className="token"
                        onClick={(e) => handleClick(e, props.start_token)} value={props.word}>


                    <Tooltip arrow disableFocusListener disableTouchListener placement="top"
                             title={'TF-IDF: ' + TokenScores[Number(TokenWords.indexOf(props.word.toLowerCase()))].toString()}>
                        <span><b>{props.word}</b></span></Tooltip>
                </button>
                :

                <button ref={target} name="butt" id={props.start_token} className="token"
                        onClick={(e) => handleClick(e, props.start_token)} value={props.word}>{props.word}</button>


            }

                </Tooltip>





            </span>


                    {/*<button ref={target} name = "butt" id={props.start_token} className="token" onClick={(e)=>handleClick(e,props.start_token)} value={props.word}>{props.word}</button>*/}


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

                </>

            );

        }
        else if (props.action === 'mentionsList' && Color !== '') { //Colora nella lista a destra
            return (
                <>
                    {(TokenWords && TokenWords.indexOf(props.word.toLowerCase()) !== -1) ?

                        <Tooltip disableFocusListener disableTouchListener
                                 title={TokenScores[Number(TokenWords.indexOf(props.word.toLowerCase()))].toString()}>
                            <span className='span_to_highlight'
                                  id={props.start_token}><b>{props.word}</b></span></Tooltip> :
                        <span className='span_to_highlight' id={props.start_token}>{props.word}</span>
                    }</>

            );

        }

        return (

            <>
                {(TokenWords && TokenWords.indexOf(props.word.toLowerCase()) !== -1) ?


                    <Tooltip disableFocusListener disableTouchListener
                             title={TokenScores[Number(TokenWords.indexOf(props.word.toLowerCase()))].toString()}>
                        <span className='span_to_highlight'
                              id={props.start_token}><b>{props.word}</b></span></Tooltip> :
                    <span className='span_to_highlight' id={props.start_token}>{props.word}</span>}</>

        );

        // else if(props.action === 'mentionsList' && Color !== ''){ //Colora nella lista a destra
        //     return (
        //         <span id={props.start_token} ref={token_ref}>{props.word}</span>
        //
        //     );
        //
        // }
        //
        //     return (
        //         <span id={props.start_token} ref={token_ref}>{props.word}</span>
        //     );
        // }

    }
}


export default Token_DocTag;