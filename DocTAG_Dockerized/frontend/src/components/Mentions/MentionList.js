import React, { Component } from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect,useContext } from "react";
import Mention from "./Mention";
import {Col, OverlayTrigger, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
// import { useForm } from "react-hook-form";
// import DjangoCSRFToken from 'django-react-csrftoken'
// import cookie from "react-cookies";
import LabelItem from "../Labels/LabelItem";
import AddMention from "./AddMention";
import {AppContext}  from "../../App";
import {LinkedContext, MentionContext} from '../../Prova_BaseIndex'
import './mention.css';
import '../General/first_row.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronLeft, faPalette,faEdit,
    faChevronRight, faExclamationTriangle,
    faGlasses,
    faInfoCircle,
    faList, faPlusCircle,
    faProjectDiagram, faTimes, faTimesCircle, faPencilAlt, faSave
} from "@fortawesome/free-solid-svg-icons";
import SubmitButtons from "../General/SubmitButtons";
import Zoom from "@material-ui/core/Zoom";
import Tooltip from "react-bootstrap/Tooltip";

// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function MentionList(props){
    const { language, mentionsList,color,showmember,selectedLang,showautoannotation,showmajority,loadingColors,finalcount, highlightMention, action,reports, index, mentionSingleWord, allMentions, tokens } = useContext(AppContext);
    //const { mentionsList } = useContext(MentionContext);
    const [Children,SetChildren] = tokens;
    const [FinalCount, SetFinalCount] = finalcount;
    const [LoadingMentionsColor, SetLoadingMentionsColor] = loadingColors;
    const [mentions_to_show,SetMentions_to_show] = mentionsList;
    const [WordMention, SetWordMention] = mentionSingleWord;
    const [ShowMemberGt,SetShowMemberGt] =showmember
    const [ShowAutoAnn,SetShowAutoAnn] = showautoannotation;
    const [Action, SetAction] = action;
    const [SelectedLang,SetSelectedLang] = selectedLang
    const [Color, SetColor] = color
    const [Language,SetLanguage] = language;

    const [ShowInfoMentions, SetShowInfoMentions] = useState(false);
    const [Saved,SetSaved] = useState(false)
    const [HighlightMention, SetHighlightMention] = highlightMention;
    //const [Highlight, SetHighlight] = useState('Highlight all');
    useEffect(()=>{
        // console.log('MENTISHOW',ShowInfoMentions)
        if(SelectedLang === Language && WordMention.length === 0) {
            // console.log('count1', FinalCount)
            // console.log('count1', Children.length)
            // console.log('count1',Children)
            if (ShowInfoMentions === false) {
                if (Children.length === FinalCount) {
                    if (mentions_to_show.length === 0) {
                        console.log('EMPTY MENTIONS')
                        Children.map(child => {
                            // console.log('TOKEN')
                            child.setAttribute('class', 'token') //Added!!
                            child.style.color = 'black'                        //Added!!
                        })
                    }

                    var bottone_mention = (document.getElementsByClassName('butt_mention'))
                    if (mentions_to_show.length > 0) {
                        Children.map(child => {
                            // console.log('TOKEN')
                            child.setAttribute('class', 'token') //Added!!
                            child.style.color = 'black'
                            //Added!!
                        })
                        //console.log('PASSO DI QUA, MENTIONS',mentions_to_show)
                        console.log('PASSO COLORO')
                        mentions_to_show.map((mention, index) => {
                            var array = fromMentionToArray(mention.mention_text, mention.start)
                            //console.log(array)
                            var words_array = []
                            var index_color = index
                            if (Color[index] === undefined) {
                                index_color = index - Color.length
                            }
                            bottone_mention[index].style.color = Color[index_color]

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
    },[Action,mentions_to_show,Color,ShowInfoMentions,SelectedLang,Children]) //COLOR AGGIUNTO,children



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
        var count_bold = 0
        var count_normal = 0
        var mentions = Array.from(document.getElementsByClassName('butt_mention'))
        mentions.map(but=>{
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

    function changeInfoMentions(e){
        e.preventDefault()
        if(ShowInfoMentions){
            SetShowInfoMentions(false)

        }else{SetShowInfoMentions(true)}
    }

    if(mentions_to_show.length === 0){
        return(
        <div>

            {/*{ShowMajorityGt === true && <div><i>The ground-truth based on majority vote is <b>READ ONLY</b></i></div>}*/}
            {/*{ShowMemberGt === true && <div><i>The ground-truth of other team members are <b>READ ONLY</b></i></div>}*/}
            <div>
                Info about Mentions: &nbsp;&nbsp;<button className='butt_info' onClick={(e)=>changeInfoMentions(e)}><FontAwesomeIcon  color='blue' icon={faInfoCircle} /></button>
            </div>
            {ShowInfoMentions && <Zoom in={ShowInfoMentions}>
                <div className='quick_tutorial'>
                    <h5>Mentions: quick tutorial</h5>
                    <div>
                        You can identify a list of mentions.
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
                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>If you want to delete a passage press to the <FontAwesomeIcon icon={faTimesCircle}/> next to the mention.</li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faEdit}/></span>If you want to modify the label associated to a passage press to the <FontAwesomeIcon icon={faEdit}/> next to the mention.
                                </li>
                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>The <span style={{'color':'red'}}>CLEAR</span> button will remove all the mentions you found.
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
                {WordMention.length >0 && !ShowInfoMentions && <div ><AddMention mention_to_add ={WordMention}/>
                    <hr/>

                </div>}

            {!ShowInfoMentions && <div className="mentions_list" id='mentions_list'><h5>This report has not been annotated yet</h5>
                    </div>}



        </div>
        );

    }

        return(
            <>

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
                {ShowInfoMentions && <Zoom in={ShowInfoMentions}>
                    <div className='quick_tutorial'>
                        <h5>Mentions: quick tutorial</h5>
                        <div>
                            You can identify a list of mentions.
                            <div>
                                <ul className="fa-ul">
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faGlasses}/></span>
                                        Read the report on your left.
                                    </li>
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faList}/></span> On your right the list of mentions is displayed (if any).
                                    </li>
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faPlusCircle}/></span>The report's section you can extract the mentions from are preceded by a <FontAwesomeIcon icon={faPencilAlt}/>.
                                        Click on the words which compose your mention. Once you selected a word you can click exclusively on the next or previous words.
                                    </li>
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faPlusCircle}/></span>On the right side, above the mentions list, you can visualize the words you selected for your mention. Click on
                                        "Add" in order to add the mention to the list.
                                    </li>
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faPalette}/></span>Once you added the mention this will have a color. In the textual report the words which characterize a mention of the list
                                        will be colored and they will not be selectable any more.
                                    </li>
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>If you want to delete a mention press to the <FontAwesomeIcon icon={faTimesCircle}/> next to the mention.
                                    </li>
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>The <span style={{'color':'red'}}>CLEAR</span> button will remove all the mentions you found.
                                    </li>
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faExclamationTriangle}/></span>Be aware that the removal of a mention removes also the concepts that were linked to it.
                                    </li>
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faSave}/></span>Your changes will be saved clicking on <span style={{'color':'green'}}>SAVE</span> button, changing actions or
                                        going to the previous or next report.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div></Zoom>}
                {ShowInfoMentions && <div className="mentions_list" id='mentions_list'> </div>}

                {!ShowInfoMentions && <div className="mentions_list" id='mentions_list'>

                    {WordMention.length >0 && <div><AddMention mention_to_add ={WordMention}/>
                        <hr/>

                    </div>}
                    {mentions_to_show.map((mention,index) => <div className="mentionElement">
                        {/*<input type="hidden" value={JSON.stringify(mention)}  name="mention"/>*/}
                        <Mention id = {index} index = {index} text={mention['mention_text']} start={mention['start']}
                                 stop={mention['stop']} mention_obj = {mention}/></div>)}
                </div>}


            </>






        );


}

export default MentionList