import React, { Component } from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect,useContext } from "react";
import Association from "./Association";
import {Col, OverlayTrigger, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
// import { useForm } from "react-hook-form";
// import DjangoCSRFToken from 'django-react-csrftoken'
// import cookie from "react-cookies";
import AddMention from "../Mentions/AddMention";
import {AppContext}  from "../../App";
import {LinkedContext, MentionContext} from '../../Prova_BaseIndex'
import './linked.css';
import '../General/first_row.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faTimesCircle,
    faInfoCircle,
    faTimes,
    faGlasses,
    faList,
    faExclamationTriangle,
    faPlusCircle,
    faProjectDiagram,
    faPencilAlt,
    faSave
} from "@fortawesome/free-solid-svg-icons";
import SubmitButtons from "../General/SubmitButtons";
import Zoom from "@material-ui/core/Zoom";
import Tooltip from "react-bootstrap/Tooltip";
import {Language} from "@material-ui/icons";

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function LinkedList(props){
    const { language, showmember,selectedLang,action,highlightMention,showautoannotation,loadingColors,finalcount, color, allMentions,tokens, reports, index, mentionSingleWord, associations } = useContext(AppContext);
    const [AllMentions, SetAllMentions] = allMentions;
    const [WordMention, SetWordMention] = mentionSingleWord;
    const [LoadingMentionsColor, SetLoadingMentionsColor] = loadingColors;
    const [Action, SetAction] = action;
    const [Children, SetChildren] = tokens;
    const [HighlightMention, SetHighlightMention] = highlightMention;
    const [Color, SetColor] = color;
    const [FinalCount, SetFinalCount] = finalcount;
    const [ShowInfoLinking,SetShowInfoLinking] = useState(false)
    const [ShowMemberGt,SetShowMemberGt] =showmember
    const [ShowAutoAnn,SetShowAutoAnn] = showautoannotation
    const [SelectedLang,SetSelectedLang] = selectedLang
    const [Language,SetLanguage] = language;



    //const [Saved,SetSaved] = useState(false)
    // useEffect(()=>{
    //     if(SelectedLang === Language && WordMention.length === 0) {
    //         // var new_mentions = []
    //         // console.log('showlist',ShowLists)
    //         console.log('showlist',AllMentions)
    //         //
    //         // mentions_to_show.map(m=>{
    //         //     if(ShowLists[m.seq_number-1] === true){
    //         //         new_mentions.push(m)
    //         //     }
    //         // })
    //         // console.log('ert',new_mentions)
    //         if (AllMentions === false) {
    //             console.log('count',FinalCount)
    //             console.log('count',Children.length)
    //
    //             if (Children.length === FinalCount) {
    //                 if (AllMentions.length === 0) {
    //                     console.log('EMPTY MENTIONS')
    //                     Children.map(child => {
    //                         // console.log('TOKEN')
    //                         child.setAttribute('class', 'token') //Added!!
    //                         child.style.color = 'black'                        //Added!!
    //                     })
    //                 }
    //
    //                 var bottone_mention = Array.from(document.getElementsByClassName('butt_mention'))
    //                 if (AllMentions.length > 0) {
    //                     Children.map(child => {
    //                         // console.log('TOKEN')
    //                         child.setAttribute('class', 'token') //Added!!
    //                         child.style.color = 'black'
    //                         //Added!!
    //                     })
    //                     //console.log('PASSO DI QUA, MENTIONS',mentions_to_show)
    //                     console.log('PASSO COLORO')
    //                     AllMentions.map((mention, index) => {
    //                         console.log('mention',mention)
    //                         console.log('mention',bottone_mention[index])
    //                         var array = fromMentionToArray(mention.mention_text, mention.start)
    //                         //console.log(array)
    //                         var words_array = []
    //                         if(mention.seq_number > 0){
    //                             var index_color = mention.seq_number - 1
    //
    //                         }
    //                         else{
    //                             var index_color = 49
    //                         }
    //                         if (Color[index_color] === undefined) {
    //                             index_color = index_color - Color.length
    //                         }
    //                         bottone_mention.map(bottone=>{
    //                             if(bottone.id.toString() === mention.start.toString()){
    //                                 bottone.style.color = Color[index_color]
    //                             }
    //                         })
    //
    //                         // array.map(el=>{
    //                         //     var a = document.getElementById(el.startToken)
    //                         //     console.log('a',a)
    //                         // var arr = Array.from(document.getElementsByTagName('span'))
    //                         // arr.map(e=>{
    //                         //     if(e.id === el.startToken){
    //                         //         e.style.color = Color[index_color]
    //                         //
    //                         //     }
    //                         // })
    //                         // })
    //
    //
    //                         // bottone_mention[index].style.color = Color[index_color]
    //                         // console.log('mention',Color[index_color])
    //
    //                         Children.map(child => {
    //
    //                             array.map((word, ind) => {
    //                                 if (child.id.toString() === word.startToken.toString()) {
    //
    //                                     words_array.push(child)
    //                                     // child.setAttribute('class', 'notSelected')
    //                                     child.setAttribute('class', 'notSelectedMention')
    //
    //
    //                                     child.style.color = Color[index_color]
    //
    //                                     if (child.style.fontWeight === 'bold') {
    //                                         bottone_mention[index].style.fontWeight = 'bold'
    //                                     }
    //                                 }
    //                             })
    //                         })
    //
    //                     })
    //                 }
    //
    //             }
    //         }//Added
    //         else {
    //             Children.map(child => {
    //                 child.setAttribute('class', 'notSelected')
    //             })
    //             SetWordMention([])
    //         }
    //         if (ShowAutoAnn === true || ShowMemberGt === true) {
    //             Children.map(child => {
    //                 child.setAttribute('class', 'notSelected')
    //             })
    //         }
    //
    //         SetLoadingMentionsColor(false)
    //     }
    // },[Action,AllMentions,Color,ShowInfoLinking,SelectedLang,Children,WordMention]) //COLOR AGGIUNTO,children

    useEffect(()=>{
        if(SelectedLang === Language && WordMention.length === 0){
            if(!ShowInfoLinking) {
                if (Children.length === FinalCount) {
                    console.log('mentionshow', AllMentions)
                    if (AllMentions.length === 0) {
                        console.log('MENTIONS EMPTY')
                        Children.map(child => {
                            // console.log('TOKEN')
                            child.setAttribute('class', 'token') //Added!!
                            child.style.color = 'black'                        //Added!!
                        })

                    }

                    var bottone_linked = Array.from(document.getElementsByClassName('butt_linked'))
                    if (AllMentions.length > 0) {
                        Children.map(child => {
                            child.setAttribute('class', 'token') //Added!!
                            child.style.color = 'black'

                        })
                        //console.log('PASSO DI QUA, MENTIONS',AllMentions)
                        // console.log('PASSO COLORO')
                        AllMentions.map((mention, index) => {
                            console.log('MENTION', mention)
                            var array = fromMentionToArray(mention.mention_text, mention.start)
                            //console.log(array)
                            var words_array = []
                            if(mention.seq_number > 0){
                                var index_color = mention.seq_number - 1

                            }
                            else{
                                var index_color = Color.indexOf('royalblue')
                            }
                            console.log('MENTION', Color[index_color])
                            if (Color[index_color] === undefined) {
                                index_color = index_color - Color.length
                            }
                            bottone_linked.map(bottone=>{
                                if(bottone.id.toString() === mention.start.toString()){
                                    bottone.style.color = Color[index_color]
                                }
                            })
                            bottone_linked[index].style.color = Color[index_color]

                            Children.map(child => {
                                // if(child.getAttribute('class') !== 'notSelected') {
                                //     child.setAttribute('class', 'token') //Added!!
                                // }
                                array.map((word, ind) => {
                                    if (child.id.toString() === word.startToken.toString()) {

                                        // console.log('PASSO COLORO 1')
                                        words_array.push(child)
                                        child.setAttribute('class', 'notSelectedMention')


                                        child.style.color = Color[index_color]


                                        if (child.style.fontWeight === 'bold') {
                                            bottone_linked[index].style.fontWeight = 'bold'
                                        }

                                    }
                                })
                            })

                        })
                    }
                    else{ //ADDED
                        Children.map(child => {
                            child.setAttribute('class', 'token') //Added!!
                            child.color = 'black'
                        })
                    }

                }


            }//Added

            else{
                Children.map(child=>{
                    child.setAttribute('class','notSelected')
                })
                SetWordMention([])
            }
            if(ShowAutoAnn === true || ShowMemberGt === true){
                Children.map(child=>{
                    child.setAttribute('class','notSelected')
                })
            }

            SetLoadingMentionsColor(false)
        }

    },[Action,AllMentions,Color,ShowInfoLinking,SelectedLang,Children]) //COLOR AGGIUNTO,children


    useEffect(()=>{
        if(document.getElementById('select_all_butt') !== undefined && document.getElementById('select_all_butt') !== null) {
            if (HighlightMention === true) {
                // console.log('highlight12', HighlightMention)

                document.getElementById('select_all_butt').style.fontWeight = 'bold'
                document.getElementById('select_all_butt').style.textDecoration = 'underline'
            } else {
                document.getElementById('select_all_butt').style.fontWeight = ''
                document.getElementById('select_all_butt').style.textDecoration = ''
                // console.log('highlight12', document.getElementById('select_all_butt'))

            }

        }

    },[HighlightMention])


    function fromMentionToArray(text,start1){
        var array = []
        var words = []
        var stringa = text.toString() //The age is considered an integer!!
        if(stringa.indexOf(' ')){
            words = stringa.split(' ')

        }
        else{
            words.push(stringa)
        }
        // console.log('startpassato',props.startSectionChar)
        var start = start1

        words.map((word,index) =>{
            var end = start + word.length - 1

            var obj = {'word':word,'startToken':start,'stopToken':end}
            array.push(obj)
            start = end + 2 //tengo conto dello spazio
            // console.log('obj',obj)

        })
        return array
    }

    function handleSelectAll(){
        var count_bold = 0
        var count_normal = 0
        var mentions = Array.from(document.getElementsByClassName('butt_linked'))
        mentions.map(but=>{
            but.style.fontWeight === 'bold' ? count_bold = count_bold +1 : count_normal = count_normal +1

        })

        AllMentions.map((mention,index)=>{
            var words = fromMentionToArray(mention.mention_text,mention.start)
            Children.map(child=>{
                words.map(word=>{
                    if(child.id.toString() === word.startToken.toString()){

                        {(HighlightMention === true ) ? child.style.fontWeight = '' : child.style.fontWeight = 'bold'}


                    }
                })
            })
        })

        var bottone_linked = Array.from(document.getElementsByClassName('butt_linked'))
        bottone_linked.map(but=>{
            (HighlightMention === true ) ? but.style.fontWeight = '' : but.style.fontWeight = 'bold'

        })

        if(HighlightMention === true){
            SetHighlightMention(false)
        }
        else{

            SetHighlightMention(true)

        }


    }

    function changeInfoLinking(e){
        e.preventDefault()
        if(ShowInfoLinking){
            SetShowInfoLinking(false)

        }else{SetShowInfoLinking(true)}
    }



    if(AllMentions.length === 0){
        return(
            <div>


                <div>
                    {/*{ShowMajorityGt === true && <div><i>The ground-truth based on majority vote is <b>READ ONLY</b></i></div>}*/}
                    {/*{ShowMemberGt === true && <div><i>The ground-truth of other team members are <b>READ ONLY</b></i></div>}*/}
                    <form id = "linked-form" className="linked-form">
                        </form>
                    <div>
                        Info about linking: &nbsp;&nbsp;<button className='butt_info' onClick={(e)=>changeInfoLinking(e)}><FontAwesomeIcon  color='blue' icon={faInfoCircle} /></button>
                    </div>
                    {WordMention.length >0 && !ShowInfoLinking && <div><AddMention mention_to_add ={WordMention}/>
                        <hr/>

                    </div>}

                    {!ShowInfoLinking && <div className="linked-list" id ="linked-list"><h5>This document has not been annotated yet</h5></div>}


                    {ShowInfoLinking && <Zoom in={ShowInfoLinking}>
                        <div className='quick_tutorial'>
                            <h5>Linking: quick tutorial</h5>
                            <div>
                                You can link the mentions you found with one (or more) concepts.
                                <div>
                                    <ul className="fa-ul">
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faGlasses}/></span>
                                            Read the document on your left.
                                        </li>
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faList}/></span> On your right the list of passages is displayed (if any). You can also select new passages if you want:
                                        the elements preceded by the <FontAwesomeIcon icon={faPencilAlt}/> identify the clickable text portions. Click on the words that compose your passage and add the mention to the list.
                                        </li>
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faProjectDiagram}/></span>Click on LINK: a draggable window is displayed.
                                        </li>
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faPlusCircle}/></span> Choose a concept. Add the linked concept clicking on “Add”. The concept will be automatically displayed under its passage. Click on the concept to have some information about it.
                                        </li>
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>If you want to delete a linked concept click on the <FontAwesomeIcon icon={faTimesCircle}/> next to the concept.
                                        </li>
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>If you want to delete a passage (and its concepts) press to the <FontAwesomeIcon icon={faTimes}/> next to LINK button.
                                        </li>
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>If you want to delete all the linked concepts click on the <span style={{'color':'red'}}>CLEAR</span> button.
                                        </li>
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faExclamationTriangle}/></span>Be aware that the concepts you link (or remove) are automatically added (or removed) to the list of concepts
                                            viewable in Concepts section. The removal of the passage will affect not only the Concepts list but also the Mentions list of Mentions section.
                                        </li>
                                        <li><span className="fa-li"><FontAwesomeIcon icon={faSave}/></span>Your changes will be saved clicking on <span style={{'color':'green'}}>SAVE</span> button, changing annotation type or
                                            going to the previous or next document or topic.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div></Zoom>}
                </div>

            </div>
        );

    }
    return(
        <div>

            {AllMentions.length > 0 && <div>
            <Row>
                <Col md={7} className='right'><div><h5>Associations List &nbsp;&nbsp;
                    <OverlayTrigger
                        key='bottom'
                        placement='bottom'
                        overlay={
                            <Tooltip id={`tooltip-bottom'`}>
                                Quick tutorial
                            </Tooltip>
                        }
                    >
                        <button className='butt_info' onClick={(e)=>changeInfoLinking(e)}><FontAwesomeIcon color='blue' icon={faInfoCircle} /></button></OverlayTrigger></h5></div></Col>
                <Col md={5} className='right'> <button id='select_all_butt' className='select_all_butt' onClick={()=>handleSelectAll()} >Highlight all</button>
                </Col>

            </Row>

            {ShowInfoLinking && <Zoom in={ShowInfoLinking}>
                <div className='quick_tutorial'>
                    <h5>Linking: quick tutorial</h5>
                    <div>
                        You can link the mentions you found with one (or more) concepts.
                        <div>
                            <ul className="fa-ul">
                                <li><span className="fa-li"><FontAwesomeIcon icon={faGlasses}/></span>
                                    Read the report on your left.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faList}/></span> On your right the list of mentions is displayed. You can also select new mentions if you want:
                                    the elements preceded by <FontAwesomeIcon icon={faPencilAlt}/> identify the clickable text portions. Click on the words that compose your mention and add the mention to the list.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faProjectDiagram}/></span>Click on <i>Link</i>: a draggable window is displayed.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faPlusCircle}/></span>Choose a semantic area and then a concept. Add the linked concept
                                    clicking on "Add". The concept will be automatically displayed under its mention. Click on the concept to have some information about it.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>If you want to delete a linked concept click on the <FontAwesomeIcon icon={faTimesCircle}/> next to the concept.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>If you want to delete a mention (and its concepts) press to the <FontAwesomeIcon icon={faTimes}/> next to LINK button.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>If you want to delete all the linked concepts click on the <span style={{'color':'red'}}>CLEAR</span> button.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faExclamationTriangle}/></span>Be aware that the concepts you link (or remove) are automatically added (or removed) to the list of concepts
                                    viewable in Concepts section. The removal of the mention will affect not only the Concepts list but also the Mentions list of Mentions section.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faSave}/></span>Your changes will be saved clicking on <span style={{'color':'green'}}>SAVE</span> button, changing actions or
                                    going to the previous or next report.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div></Zoom>

                }
                {ShowInfoLinking && <form id = "linked-form" className="linked-form" />}

            {!ShowInfoLinking && <div className="linked-list" id ="linked-list">

                {WordMention.length >0 && <div><AddMention mention_to_add ={WordMention}/><hr/></div>}

                <form id = "linked-form" className="linked-form">
                    {AllMentions.length>0 && AllMentions.map((mention,index) => <div className='linkedElement'>
                        <Association id = {index} mention={mention} text={mention['mention_text']} start={mention['start']}
                                     stop={mention['stop']} />


                    </div>)}
                </form>
            </div>}
        </div>}

        </div>

    );
}

export default LinkedList