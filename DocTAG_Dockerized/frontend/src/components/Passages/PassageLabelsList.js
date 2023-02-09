import React, {Component, createContext} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect,useContext } from "react";
import Mention from "../Mentions/Mention";
import {Col, OverlayTrigger, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
// import { useForm } from "react-hook-form";
// import DjangoCSRFToken from 'django-react-csrftoken'
// import cookie from "react-cookies";
import LabelItem from "../Labels/LabelItem";
import AddMention from "../Mentions/AddMention";
import {AppContext}  from "../../App";
// import {PassageContext}  from "../../Prova_BaseIndex";
import {LinkedContext, MentionContext} from '../../Prova_BaseIndex'
import '../Mentions/mention.css';
import './passage.css';
import '../General/first_row.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronLeft, faPalette,
    faChevronRight, faExclamationTriangle,
    faGlasses, faArrowDown, faChevronDown,
    faInfoCircle, faCircle,
    faList, faPlusCircle,
    faProjectDiagram, faTimes, faTimesCircle, faPencilAlt, faSave, faEdit
} from "@fortawesome/free-solid-svg-icons";
import SubmitButtons from "../General/SubmitButtons";
import Zoom from "@material-ui/core/Zoom";
import Tooltip from "react-bootstrap/Tooltip";
import {Add} from "@material-ui/icons";
import AddPassage from "./AddPassage";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

// export const PassageContext = createContext('')

function PassageLabelsList(props){
    const { language,labelsList,colorword,showlabels,report,reload,mentionToAdd,disButton, mentionsList,color,showmember,selectedLang,showautoannotation,showmajority,loadingColors,finalcount, highlightMention, action,reports, index, mentionSingleWord, allMentions, tokens } = useContext(AppContext);
    // const { mentionsList } = useContext(PassageContext);
    const [Children,SetChildren] = tokens;
    const [FinalCount, SetFinalCount] = finalcount;
    const [LoadingMentionsColor, SetLoadingMentionsColor] = loadingColors;
    const [mentions_to_show,SetMentions_to_show] = mentionsList;
    const [WordMention, SetWordMention] = mentionSingleWord;
    const [ShowMemberGt,SetShowMemberGt] =showmember
    const [ShowAutoAnn,SetShowAutoAnn] = showautoannotation;
    const [ColorWords,SetColorWords] = colorword

    const [Action, SetAction] = action;
    const [SelectedLang,SetSelectedLang] = selectedLang
    const [Color, SetColor] = color
    const [ShowLabelsOpts,SetShowLabelsOpts] = showlabels
    const [Language,SetLanguage] = language;
    const [labels, setLabels] = labelsList
    const [Report, setReport] = report;
    const [Reports, setReports] = reports;
    const [Index, setIndex] = index;
    const [Disable_Buttons, SetDisable_Buttons] = disButton;
    // const [ShowLists,SetShowLists] = useState([])
    const [Text, SetText] = useState('')
    const [ShowInfo,SetShowInfo] = useState(false)
    const [ShowInfoMentions, SetShowInfoMentions] = useState(false);
    const [ChangeLabel, SetChangeLabel] = useState(false);
    const [Saved,SetSaved] = useState(false)
    const [MentionToAdd,SetMentionToAdd] = mentionToAdd
    const [Filtered_mention,SetFiltered_mention] = useState([])
    const [HighlightMention, SetHighlightMention] = highlightMention;
    const [ReloadMentions,SetReloadMentions] = reload;

    //const [Highlight, SetHighlight] = useState('Highlight all');

    // useEffect(()=>{
    //     var arr = []
    //     if(labels.length > 0){
    //         console.log('entro')
    //         arr = new Array(labels.length).fill(false);
    //     }
    //     SetShowLists(arr)
    // },[labels])

    // useEffect(()=>{
    //     console.log('show',ShowLists)
    // },[ShowLists])

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


    // useEffect(()=>{
    //     // console.log('MENTISHOW',ShowInfoMentions)
    //     SetReloadMentions(false)
    //     if(SelectedLang === Language && WordMention.length === 0) {
    //         // console.log('entro')
    //         // console.log('count1', FinalCount)
    //         // console.log('count1', Children.length)
    //         // console.log('count1',mentions_to_show)
    //         if (ShowInfoMentions === false) {
    //             if (Children.length === FinalCount) {
    //                 if (mentions_to_show.length === 0) {
    //                     console.log('EMPTY MENTIONS')
    //                     Children.map(child => {
    //                         console.log('TOKEN empty')
    //                         child.setAttribute('class', 'token') //Added!!
    //                         child.style.color = 'black'                        //Added!!
    //                     })
    //                 }
    //
    //                 var bottone_mention = (document.getElementsByClassName('butt_mention'))
    //                 if (mentions_to_show.length > 0) {
    //                     Children.map(child => {
    //                         console.log('TOKEN')
    //                         child.setAttribute('class', 'token') //Added!!
    //                         child.style.color = 'black'
    //                         //Added!!
    //                     })
    //                     console.log('PASSO DI QUA, MENTIONS',mentions_to_show)
    //                     // console.log('PASSO COLORO')
    //                     var range_overlapping = []
    //                     mentions_to_show.map((m,i)=>{
    //                         console.log('m1',m)
    //                         console.log('m1',range_overlapping)
    //
    //                         var start = m.start
    //                         var stop = m.stop
    //                         var found = false
    //                         range_overlapping.map((o,i)=>{
    //                             // console.log('m1 found',o[0],o[1],start,stop)
    //                             // console.log('m1 found',start<=o[1])
    //                             // console.log('m1 found',o[0]<= stop)
    //                             // console.log('m1 found',(stop<= o[1]))
    //                             // console.log('m1 found',(o[0]<=start && start<=o[1]))
    //                             // console.log('m1 found',(o[0]<= stop && stop<= o[1]))
    //                             if (((o[0]<=start && start<=o[1]) || (o[0]<= stop && stop<= o[1]))){
    //                                 o[0] = Math.min(o[0],start)
    //                                 o[1] = Math.max(o[1],stop)
    //                                 found = true
    //                             }
    //                         })
    //                         if (found === false){
    //
    //                             range_overlapping.push([start,stop])
    //                             // console.log('m1',start,stop)
    //                             // console.log('m1',range_overlapping)
    //
    //                         }
    //
    //                     })
    //                     console.log('rangeover',range_overlapping)
    //
    //
    //                     mentions_to_show.map((mention, index) => {
    //                         var array = fromMentionToArray(mention.mention_text, mention.start)
    //                         //console.log(array)
    //                         var words_array = []
    //                         // var index_color = index
    //                         var index_color = index
    //
    //                         range_overlapping.map((o,i)=>{
    //                             if (((o[0]<=mention.start && mention.start<=o[1]) || (o[0]<= mention.stop && mention.stop<= o[1]))){
    //                                 index_color = i
    //                             }
    //                         })
    //                         console.log('m1',mention.text,index)
    //
    //                         if (Color[index_color] === undefined) {
    //                             index_color = index_color - Color.length
    //                         }
    //
    //                         // if (Color[index] === undefined) {
    //                         //     index_color = index - Color.length
    //                         // }
    //                         bottone_mention[index].style.color = Color[index_color]
    //
    //                         Children.map(child => {
    //
    //                             array.map((word, ind) => {
    //                                 if (child.id.toString() === word.startToken.toString()) {
    //
    //                                     words_array.push(child)
    //
    //                                     // supporto overlapping
    //                                     child.setAttribute('class', 'notSelectedMention')
    //                                     console.log('PASSO COLORO qua',child)
    //
    //                                     child.style.color = Color[index_color]
    //
    //                                     if (child.style.fontWeight === 'bold') {
    //                                         bottone_mention[index].style.fontWeight = 'bold'
    //                                     }
    //
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
    // },[Action,mentions_to_show,Color,ShowInfoMentions,SelectedLang,FinalCount,Children,ReloadMentions]) //COLOR AGGIUNTO,children
    useEffect(()=>{
        if(SelectedLang === Language && WordMention.length === 0) {

            if (ShowInfoMentions === false) {
                if (Children.length === FinalCount) {
                    if (mentions_to_show.length === 0) {
                        // console.log('EMPTY MENTIONS')
                        Children.map(child => {
                            // console.log('TOKEN')
                            child.setAttribute('class', 'token') //Added!!
                            child.style.color = 'black'                        //Added!!
                        })
                    }

                    var bottone_mention = Array.from(document.getElementsByClassName('butt_mention'))
                    if (mentions_to_show.length > 0) {
                        Children.map(child => {
                            // console.log('TOKEN')
                            child.setAttribute('class', 'token') //Added!!
                            child.style.color = 'black'
                            //Added!!
                        })
                        //console.log('PASSO DI QUA, MENTIONS',mentions_to_show)
                        // console.log('PASSO COLORO')
                        mentions_to_show.map((mention, index) => {
                            // console.log('mention',mention)
                            // console.log('mention',bottone_mention[index])
                            var array = fromMentionToArray(mention.mention_text, mention.start)
                            //console.log(array)
                            var words_array = []
                            if(mention.seq_number > 0){
                                var index_color = mention.seq_number - 1

                            }
                            else{
                                var index_color = Color.indexOf('royalblue')
                            }
                            if (Color[index_color] === undefined) {
                                index_color = index_color - Color.length
                            }
                            bottone_mention.map(bottone=>{
                                if(bottone.id.toString() === mention.start.toString()){
                                    bottone.style.color = Color[index_color]
                                }
                            })

                            // array.map(el=>{
                            //     var a = document.getElementById(el.startToken)
                            //     console.log('a',a)
                                // var arr = Array.from(document.getElementsByTagName('span'))
                                // arr.map(e=>{
                                //     if(e.id === el.startToken){
                                //         e.style.color = Color[index_color]
                                //
                                //     }
                                // })
                            // })


                            // bottone_mention[index].style.color = Color[index_color]
                            // console.log('mention',Color[index_color])

                            Children.map(child => {

                                array.map((word, ind) => {
                                    if (child.id.toString() === word.startToken.toString()) {

                                        words_array.push(child)
                                        // child.setAttribute('class', 'notSelected')
                                        child.setAttribute('class', 'notSelectedMention')


                                        child.style.color = Color[index_color]

                                        if (child.style.fontWeight === 'bold') {
                                            bottone_mention[index].style.fontWeight = 'bold'
                                        }
                                    }
                                })
                            })

                        })
                    }

                }
            }//Added
            else {
                Children.map(child => {
                    child.setAttribute('class', 'notSelected')
                })
                SetWordMention([])
            }
            if (ShowAutoAnn === true || ShowMemberGt === true) {
                Children.map(child => {
                    child.setAttribute('class', 'notSelected')
                })
            }

            SetLoadingMentionsColor(false)
        }
        SetReloadMentions(false)
    },[Action,mentions_to_show,Color,ShowInfoMentions,SelectedLang,ChangeLabel,WordMention,ReloadMentions]) //COLOR AGGIUNTO,children


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


    function setPassageColor(e,mention,label){
        e.preventDefault()
        SetWordMention([])
        SetMentionToAdd('')
        // console.log('mention_pa',mention)
        // console.log('mention_pa',label)
        if (Action === 'mentions') {
            SetDisable_Buttons(false)
            var bool = false // controllo se nelle mention to show c'è già ciò che voglio inserire
            // mentions_to_show.map(ment => {
            //     // console.log('mentions_current',ment.start)
            //     // console.log('mentions_current',mention.start)
            //     if ((ment.start === mention.start) && (ment.stop === mention.stop)) {
            //         SetChangeLabel(prev => !prev)
            //     }
            // })
            // if (bool === true) {
            //     alert('this mention has been already inserted in the list!')
            // } else {
            var mentions = mentions_to_show
            var found = false
            mentions.map(m=>{
                // console.log(m.start,mention.start)
                // console.log(m.stop,mention.stop)
                // console.log(m.label,label)
                if(m.start === mention.start && m.stop === mention.stop){
                    alert('This assignment already exist')
                    SetReloadMentions(true)
                    found = true

                }
            })
            if (!found){
                // console.log('mentions_current',mentions)

                // var eq = false
                // mentions.map(m =>{
                //     if(m.start.toString() === mention.start.toString()){
                //         eq = true
                //     }
                // })
                // if(eq === true){
                //     mentions = mentions.filter(x => x.start.toString() === mention.start.toString())
                // }
                // mentions = mentions.filter(x => x.start.toString() === mention.start.toString())
                mention['seq_number'] = label.seq_number
                mention['label'] = label.label

                mentions.push(mention)
                // console.log('mentions_current',mentions)

                var ordered = order_array(mentions)
                console.log('mentions_current',ordered)
                SetMentions_to_show(ordered)

                mentions_to_show.map(ment => {
                    // console.log('mentions_current',ment.start)
                    // console.log('mentions_current',mention.start)
                    if ((ment.start === mention.start) && (ment.stop === mention.stop)) {
                        SetChangeLabel(prev => !prev)
                    }
                })
            }


        }
        Children.forEach(function (child) {
            child.setAttribute('class', 'token')
        });
        SetHighlightMention(false)

        if(ShowLabelsOpts.length > 0){
            SetShowLabelsOpts([])
        }

    }



    useEffect(()=>{
        if(document.getElementById('select_all_butt') !== undefined && document.getElementById('select_all_butt') !== null) {
            if (HighlightMention === true) {
                document.getElementById('select_all_butt').style.fontWeight = 'bold'
                document.getElementById('select_all_butt').style.textDecoration = 'underline'
            } else {
                document.getElementById('select_all_butt').style.fontWeight = ''
                document.getElementById('select_all_butt').style.textDecoration = ''
                // console.log('highlight12', document.getElementById('select_all_butt'))
            }
        }

    },[HighlightMention,ColorWords])

    function fromMentionToArray(text,start1){
        // console.log('txt',text)
        // console.log('txt',start1)
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
        var last = words.slice(-1)[0]
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
        Children.map(c=>{
            c.classList.remove('normal')
            c.classList.remove('blocked')
        })
        var count_bold = 0
        var count_normal = 0
        var mentions = Array.from(document.getElementsByClassName('butt_mention'))
        mentions.map(but=>{
            but.classList.remove('normal')
            but.classList.remove('blocked')
            but.style.fontWeight === 'bold' ? count_bold = count_bold +1 : count_normal = count_normal +1

        })

        mentions_to_show.map((mention,index)=>{
            var words = fromMentionToArray(mention.mention_text,mention.start)
            Children.map(child=>{
                words.map(word=>{
                    if(child.id.toString() === word.startToken.toString()){

                        {(HighlightMention === true ) ? child.style.fontWeight = '' : child.style.fontWeight = 'bold'}


                    }
                })
            })
        })

        var bottone_mention = Array.from(document.getElementsByClassName('butt_mention'))
        bottone_mention.map(but=>{
            (HighlightMention === true ) ? but.style.fontWeight = '' : but.style.fontWeight = 'bold'

        })

        if(HighlightMention === true){
            // console.log('setto1')
            SetHighlightMention(false)
        }
        else{
            // console.log('setto2')

            SetHighlightMention(true)

        }


    }

    useEffect(()=>{
        console.log('highlight',HighlightMention)
    },[HighlightMention])

    function changeInfoMentions(e){
        e.preventDefault()
        if(ShowInfoMentions){
            SetShowInfoMentions(false)

        }else{SetShowInfoMentions(true)}
    }

    // useEffect(()=>{
    //     console.log('showlabels',ShowLabelsOpts)
    // },[ShowLabelsOpts])

    // function updateList(index){
    //
    //     var arr = ShowLists
    //     SetShowLists([])
    //     arr[index] = !arr[index]
    //     console.log('arr',arr)
    //
    //     SetShowLists(arr)
    // }

    return(
        <>
            {/*<PassageContext.Provider value={{showlabels:[ShowLabelsOpts,SetShowLabelsOpts]}}>*/}



            {mentions_to_show.length === 0 && WordMention.length === 0 && <div >

                <div>
                    Info about Passages: &nbsp;&nbsp;<button className='butt_info' onClick={(e)=>changeInfoMentions(e)}><FontAwesomeIcon  color='blue' icon={faInfoCircle} /></button>
                </div>
                {!ShowInfoMentions && <div className="mentions_list" id='mentions_list'><h5>This document has not been annotated yet</h5>
                </div>}
            </div>

            }
            {!ShowInfoMentions && WordMention.length >0 && <div className="mentions_list" id='mentions_list'>
                {<div >
                    <div><b>Current Passage:</b></div>
                <AddPassage mention_to_add ={WordMention}/>
                    <hr/>
                </div>}
                {labels.length > 0 && Color.length > 0 &&  WordMention.length > 0  && <div>
                    <b><i>Assign a label to this passage</i></b>
                    {labels.map((label,ind)=>
                        <div><button onClick={(e)=>setPassageColor(e,MentionToAdd,label)} disabled={WordMention.length === 0} id ={ind} className='button_passage'><FontAwesomeIcon icon={faCircle} color = {Color[ind]}/><span style={{color:Color[ind]}}>{label.label}</span></button></div>
                    )
                    }
                    <hr/></div>}
            </div>}

            {(mentions_to_show.length > 0 && WordMention.length === 0) && <>
                <Row>
                <Col md={7} className='right'>
                    <h5>Passages List&nbsp;&nbsp;
                        <OverlayTrigger
                            key='bottom'
                            placement='bottom'
                            overlay={
                                <Tooltip id={`tooltip-bottom'`}>
                                    Quick tutorial
                                </Tooltip>
                            }
                        >
                            <button className='butt_info' onClick={(e)=>changeInfoMentions(e)}><FontAwesomeIcon  color='blue' icon={faInfoCircle} /></button>
                        </OverlayTrigger>
                    </h5>


                </Col>
                <Col md={5} className='right'>
                    <button id='select_all_butt' className='select_all_butt' onClick={()=>handleSelectAll()} >Highlight all</button>
                </Col>
            </Row>

            {/*{ShowInfoMentions && <div className="mentions_list" id='mentions_list'> </div>}*/}

            {!ShowInfoMentions && labels.length > 0 && <div className="mentions_list" id='mentions_list'>


                {labels.map((label,ind)=>
                    <div>
                        <div style={{fontSize:'1.1rem'}}>
                            {/*<button className='button_passage' onClick={()=>updateList(ind)}><FontAwesomeIcon icon={faChevronDown} /></button> &nbsp;&nbsp;- &nbsp;&nbsp;*/}
                            <FontAwesomeIcon icon={faCircle} color = {Color[ind]} /> &nbsp;&nbsp;- &nbsp;&nbsp;
                        <b><i><span style={{color:Color[ind]}}>{label.label}</span></i></b>  - {mentions_to_show.filter(x=>x.label === label.label).length} passages</div>
                            {/*<div>{ShowLists[ind]}</div>*/}
                            {/*<Collapse style={{marginTop:'0px'}} in={ShowLists[ind] === true}>*/}
                                <div>
                                {mentions_to_show.map((mention,index) => <>
                                {mention.label === label.label && <div className="mentionElement"><Mention id = {index} index = {index} text={mention['mention_text']} start={mention['start']}
                                                                                                           stop={mention['stop']} mention_obj = {mention} />

                                    {ShowLabelsOpts.length > 0  &&  <>{ShowLabelsOpts[index] === true && <div>
                                        <b><i>Assign a label to this passage</i></b>
                                        {labels.map((label,ind)=>
                                            <div><button onClick={(e)=>setPassageColor(e,mention,label)}  id ={ind} className='button_passage'><FontAwesomeIcon icon={faCircle} color = {Color[ind]}/><span style={{color:Color[ind]}}>{label.label}</span></button></div>
                                        )
                                        }
                                    </div>}

                                    </>}

                                    </div>}

                                    </>)}

                                    </div>


                            {/*</Collapse>*/}

                        <hr/>
                    </div>
                )
                }
                {mentions_to_show.filter(x=>x.seq_number === 0).length > 0 && <div>
                    <div style={{fontSize:'1.1rem'}}>
                        {/*<button className='button_passage' onClick={()=>updateList(ind)}><FontAwesomeIcon icon={faChevronDown} /></button> &nbsp;&nbsp;- &nbsp;&nbsp;*/}
                        <FontAwesomeIcon icon={faCircle} color = 'royalblue' /> &nbsp;&nbsp;- &nbsp;&nbsp;
                        <b><i><span style={{color:'royalblue'}}>Passages without annotation</span></i></b>  - {mentions_to_show.filter(x=>x.seq_number === 0).length} passages</div>
                    {mentions_to_show.map((mention,index) => <>
                        {mention.label === '' && mention.seq_number === 0 && <div className="mentionElement"><Mention id = {index} index = {index} text={mention['mention_text']} start={mention['start']}
                                                                                                                      stop={mention['stop']} mention_obj = {mention} />

                            {ShowLabelsOpts.length > 0  &&  <>{ShowLabelsOpts[index] === true && <div>
                                <b><i>Assign a label to this passage</i></b>
                                {labels.map((label,ind)=>
                                    <div><button onClick={(e)=>setPassageColor(e,mention,label)}  id ={ind} className='button_passage'><FontAwesomeIcon icon={faCircle} color = {Color[ind]}/><span style={{color:Color[ind]}}>{label.label}</span></button></div>
                                )
                                }
                            </div>}

                            </>}

                        </div>}

                    </>)}

                </div>}

                {/*{mentions_to_show.map((mention,index) => <div className="mentionElement">*/}
                {/*    <Mention id = {index} index = {index} text={mention['mention_text']} start={mention['start']}*/}
                {/*             stop={mention['stop']} mention_obj = {mention}/></div>)}*/}
            </div>}

            </>}
            {/*</PassageContext.Provider>*/}




            {ShowInfoMentions && <Zoom in={ShowInfoMentions}>
                <div className='quick_tutorial'>
                    <h5>Passages: quick tutorial</h5>
                    <div>
                        You can identify a list of passages.
                        <div>
                            <ul className="fa-ul">
                                <li><span className="fa-li"><FontAwesomeIcon icon={faGlasses}/></span>
                                    Read the document on your left.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faList}/></span> On your right the list of passages associated to each label is displayed.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faPlusCircle}/></span>
                                    Click on the words which compose your passage. Once you selected a word you can click on the next or previous words to add words to the current passage. If you want to add more than one word with a click select two words in the text and, if it is possible, all the words between them will be part of the same passage.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faPlusCircle}/></span>On the right side, above the passage list, you can visualize the words you selected for your passage.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faPalette}/></span>Once you selected the passage, you have to select the label associated to that passage. Each label has a color assigned and the associated passages will have the same color.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>If you want to delete a passage press to the <FontAwesomeIcon icon={faTimesCircle}/> next to the passage.</li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faEdit}/></span>If you want to modify the label associated to a passage press to the <FontAwesomeIcon icon={faEdit}/> next to the passage.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>The <span style={{'color':'red'}}>CLEAR</span> button will remove all the passages you found.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faExclamationTriangle}/></span>Be aware that the removal of a passage removes also the concepts that were linked to it (if any).
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faSave}/></span>Your changes will be saved clicking on <span style={{'color':'green'}}>SAVE</span> button, changing annotation type or
                                    going to the previous or next document or topic.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div></Zoom>}
        </>






    );


}



export default PassageLabelsList