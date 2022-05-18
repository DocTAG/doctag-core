import React, {Component, useEffect,useRef, useState, useContext} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col} from "react-bootstrap";
import './report.css';
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Tooltip from "react-bootstrap/Tooltip";
import Overlay from 'react-bootstrap/Overlay';
import {AppContext} from "../../App";




function TokenOverlapping(props){
    const { tokens,mentionSingleWord,index,language,selectedLang,fields,fieldsToAnn,reportString,mentionToAdd,allMentions,action,mentionsList,color,report,finalcount,reached } = useContext(AppContext);
    const [Color,SetColor] = color
    const [PartOfMention,SetPartOfMention] = useState(false)
    const [ReportString, SetReportString] = reportString;
    const [Action,SetAction] = action
    const [Report,SetReport] = report
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
    const [Fields,SetFields] = fields;
    const [mentions_to_show,SetMentions_to_show] = mentionsList
    const [FieldsToAnn,SetFieldsToAnn] = fieldsToAnn;


    useEffect(()=>{ //Cambio azione e inizializzo tutto
        if((props.action === 'mentions' || props.action === 'concept-mention') && SelectedLang === Language){
            // console.log('count_t',FinalCount)
            var array = Array.from(document.getElementsByName('butt'))
            // console.log('count_t',array)

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
                // console.log('count_tt')
                SetReportWords(array)
            }

            SetMentionWordsList([])
            SetLastWord('')

            // console.log('RISPOSTA4')
            // SetAllMentions([])
        }

    },[Action,Index,SelectedLang,FinalCount,Fields,FieldsToAnn])

    // useEffect(() => {
    //     if ((props.action === 'mentions' || props.action === 'concept-mention') && SelectedLang === Language) {
    //         var child = document.getElementById(props.start_token.toString())
    //         child.removeAttribute('style')
    //         child.setAttribute('class', 'token')
    //         // console.log('rp',props.index === props.words.length -1)
    //         // console.log('rp',props.index)
    //         // console.log('rp',props.words.length -1)
    //
    //         if (props.index === props.words.length - 1) {
    //             var array = Array.from(document.getElementsByName('butt'))
    //
    //             SetReportWords(array)
    //         }
    //
    //
    //         SetMentionWordsList([])
    //
    //         SetLastWord('')
    //
    //
    //     }
    //
    // }, [Action, Index, SelectedLang, FinalCount, Fields, FieldsToAnn])


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



    function handleClick(e,id){
        e.preventDefault();
        console.log('target',e.target.id)
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
        if(e.target.className.toString() === 'notSelected' || e.target.className.toString() === 'tokenOtherField'){
            SetShowAlert1(true)
            // alert('NOT ALLOWED!')
            handleVisible1();

        }
        else if(e.target.className.toString() === 'token-selected'){
            //alert('ALREADY SELECTED!')
            SetShowAlert2(true)
            handleVisible2();

        }
        // else if(e.target.className.toString() === 'notSelectedMention'){
        //     //alert('ALREADY SELECTED!')
        //     SetShowAlert3(true)
        //     handleVisible3();
        //
        // }

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
            ReportWords.map(child=>{
                if(Number(child.id)< Number(props.words[0].startToken) || Number(child.id) > Number(props.words[props.words.length -1 ].startToken)){
                    if(child.getAttribute('class') === 'token'){
                        child.setAttribute('class','tokenOtherField')

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
            array_words.map((child,index) => {
                if(array_selected.length === 0){
                    if(Number(child.id) === Number(id)){
                        array_words.map((word,ind)=>{

                            if(Number(id) >= Number(word.id)){

                                if(word.getAttribute('class') !== 'notSelected' ){
                                    tokens_prev.push(word)
                                }
                                else {
                                    tokens_prev = []
                                }
                            }
                            if(Number(id) < Number(word.id)){

                                if(word.getAttribute('class') !== 'notSelected' && stop === false ){
                                    tokens_next.push(word)
                                }
                                else{
                                    stop = true
                                }

                            }

                        })
                        array_words.map((word,ind)=>{
                            if (!(tokens_prev.includes(word) || tokens_next.includes(word))){
                                word.setAttribute('class','notSelected')
                            }
                        })


                        child.setAttribute('class','token-selected')
                        child.style.cursor = 'default'

                        if((props.words[props.index+1] !== undefined) && (array_words[index+1] !== undefined) ){
                            if(array_words[index + 1].getAttribute('class') !==  'token-selected' ) {
                                // console.log('class_attr_next',array_words[index + 1])
                                // console.log('class_attr_next',array_words[index + 1].getAttribute('class'))
                                array_words[index + 1].setAttribute('class', 'token-adj-dx')
                            }
                        }
                        if((props.words[props.index-1] !== undefined) && (array_words[index-1] !== undefined) ){
                            if(array_words[index - 1].getAttribute('class') !==  'token-selected' ){
                                // console.log('class_attr_prev',array_words[index - 1])
                                // console.log('class_attr_prev',array_words[index - 1].getAttribute('class'))
                                array_words[index - 1].setAttribute('class', 'token-adj-sx')

                            }

                        }
                    }
                }
                else{
                    var start_already_sel = array_selected[0].id
                    var current = id
                    // console.log('valval',current)
                    // console.log('valval',start_already_sel)
                    // console.log('valval',props.words[props.index-1])
                    // console.log('valval',props.words[props.index+1])
                    // console.log('valval',props.words)
                    // console.log('mentiosn_words',MentionWordsList)
                    if (Number(current) >= Number(start_already_sel)){
                        // DELL?ULTIMO
                        if(Number(child.id) >= Number(start_already_sel) && Number(child.id) <= Number(current)){
                            // if(child.getAttribute('class') !== 'token-selected'){
                            //     SetMentionWordsList(prevState => [...prevState,props.words[props.index]])
                            // }
                            child.setAttribute('class','token-selected')
                            child.style.cursor = 'default'
                            if((props.words[props.index+1] !== undefined) && (array_words[index+1] !== undefined) ){
                                if(array_words[index + 1].getAttribute('class') !==  'token-selected' ) {
                                    // console.log('class_attr_next',array_words[index + 1])
                                    // console.log('class_attr_next',array_words[index + 1].getAttribute('class'))
                                    array_words[index + 1].setAttribute('class', 'token-adj-dx')
                                }
                            }
                            // DEL PRIMO
                            if((Number(props.words[0].startToken) < start_already_sel) && (array_words[index-1] !== undefined) ){
                                if(array_words[index - 1].getAttribute('class') !==  'token-selected' ){
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
                            console.log('entro qua 2')

                            child.setAttribute('class','token-selected')
                            child.style.cursor = 'default'
                            if((Number(props.words[props.words.length-1].startToken) > Number(start_already_sel)) && (array_words[index+1] !== undefined) ){
                                if(array_words[index + 1].getAttribute('class') !==  'token-selected' ) {
                                    // console.log('class_attr_next',array_words[index + 1])
                                    // console.log('class_attr_next',array_words[index + 1].getAttribute('class'))
                                    array_words[index + 1].setAttribute('class', 'token-adj-dx')
                                }
                            }
                            if((props.words[props.index-1] !== undefined) && (array_words[index-1] !== undefined) ){
                                if(array_words[index - 1].getAttribute('class') !==  'token-selected' ){
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
            array_selected.map(el=>{
                ids.push(Number(el.id))
            })
            var sortedPs =ids.sort(function (a, b) {  return a - b;  });
            var s = []
            sortedPs.map(element=>{
                s.push(document.getElementById(element.toString()))
            })
            // console.log('sorted',sortedPs)
            var arr = []
            // console.log('s',s)
            s.map(el=>{
                // console.log('el',el)
                var ind = array_words.indexOf(el)
                // console.log('val',array_words[ind])
                // console.log('val',array_words[ind].value)
                // console.log('val',props.words[ind])
                // console.log('val',props.words.filter(el=>el.word === array_words[ind].value)[0])
                // console.log('val',ind)
                // console.log('val',props.words[ind].id)
                arr.push(props.words.filter(el=> el.word === array_words[ind].value && Number(el.startToken) === Number(array_words[ind].id))[0])
            })
            // console.log('START',arr)
            // console.log('START',array_selected)
            SetMentionWordsList(arr)



        }
    }

    function TokenOver(e){
        var target = e.target
        // console.log('target',mentions_to_show)
        //find the mentions it belongs to
        var ismentionhigh = false
        if(!target.classList.contains('blocked')){
            if(Action === 'mentions'){
                mentions_to_show.map((m, i) => {

                    if (Number(target.id) >= Number(m.start) && Number(target.id) <= Number(m.stop)) {
                        // console.log('target',target.id)
                        // console.log('target', m.start)
                        // console.log('target', m.stop)
                        // console.log('target', Number(target.id) <= Number(m.stop))
                        // console.log('target', Number(target.id) >= Number(m.start))

                        var bott = Array.from(document.getElementsByClassName('butt_mention'))
                        // console.log('target',bott[i].textContent)
                        // console.log('target', m.mention_text)
                        bott.map(b=>{
                            if(Number(b.id) + b.textContent.trim().length-1 === m.start + m.mention_text.trim().length -1 ) {
                                target.style.fontWeight = 'bold'
                                ismentionhigh = true
                            }
                        })

                        // if (bott[i].classList.contains('blocked')) {
                        //     target.style.fontWeight = 'bold'
                        //     ismentionhigh = true
                        //     // SetPartOfMention(true)
                        //     // target.style.fontWeight === '' ? target.style.fontWeight = 'bold' : target.style.fontWeight = ''
                        //
                        // }
                    }
                })
            }
            if(Action === 'concept-mention'){
                AllMentions.map((m,i)=> {

                    if (Number(target.id) >= Number(m.start) && Number(target.id) <= Number(m.stop)) {
                        // console.log('target',target.id)
                        // console.log('target', m.start)
                        // console.log('target', m.stop)
                        // console.log('target', Number(target.id) <= Number(m.stop))
                        // console.log('target', Number(target.id) >= Number(m.start))

                        var bott = Array.from(document.getElementsByClassName('butt_linked'))
                        if (bott[i].classList.contains('blocked')) {
                            target.style.fontWeight = 'bold'
                            ismentionhigh = true
                            // SetPartOfMention(true)
                            // target.style.fontWeight === '' ? target.style.fontWeight = 'bold' : target.style.fontWeight = ''

                        }
                    }
                })

            }


            if (!ismentionhigh){
                (target.style.fontWeight === '' ) ? target.style.fontWeight = 'bold' : target.style.fontWeight = ''
            }

            if(Action === 'mentions'){
                mentions_to_show.map((m,i)=>{

                    if(Number(target.id) >= Number(m.start) && Number(target.id) <= Number(m.stop)){
                        // console.log('target',target.id)
                        // console.log('target', m.start)
                        // console.log('target', m.stop)
                        // console.log('target', Number(target.id) <= Number(m.stop))
                        // console.log('target', Number(target.id) >= Number(m.start))

                        var bott =Array.from(document.getElementsByClassName('butt_mention'))
                        bott.map(b=>{
                            if(Number(b.id) + b.textContent.trim().length-1 === m.start + m.mention_text.trim().length -1 ) {
                                if (! b.classList.contains('blocked')){
                                    target.style.fontWeight === 'bold' ? b.style.fontWeight = 'bold' : b.style.fontWeight = ''
                                    // bott[i].scrollIntoView()
                                    // target.style.fontWeight === '' ? target.style.fontWeight = 'bold' : target.style.fontWeight = ''

                                }
                            }
                        })
                        // if (! bott[i].classList.contains('blocked')){
                        //     target.style.fontWeight === 'bold' ? bott[i].style.fontWeight = 'bold' : bott[i].style.fontWeight = ''
                        //     // bott[i].scrollIntoView()
                        //     // target.style.fontWeight === '' ? target.style.fontWeight = 'bold' : target.style.fontWeight = ''
                        //
                        // }
                    }
                })
            }
            else if(Action === 'concept-mention'){
                AllMentions.map((m,i)=>{

                    if(Number(target.id) >= Number(m.start) && Number(target.id) <= Number(m.stop)){
                        // console.log('target',target.id)
                        // console.log('target', m.start)
                        // console.log('target', m.stop)
                        // console.log('target', Number(target.id) <= Number(m.stop))
                        // console.log('target', Number(target.id) >= Number(m.start))

                        var bott =document.getElementsByClassName('butt_linked')
                        if (! bott[i].classList.contains('blocked')){
                            target.style.fontWeight === 'bold' ? bott[i].style.fontWeight = 'bold' : bott[i].style.fontWeight = ''
                            // bott[i].scrollIntoView()
                            // target.style.fontWeight === '' ? target.style.fontWeight = 'bold' : target.style.fontWeight = ''

                        }
                    }
                })
            }


        }

    }

    function TokenOut(e){
        var target = e.target
        if(!target.classList.contains('blocked')){
            target.style.fontWeight = ''
            if(Action === 'mentions') {
                mentions_to_show.map((m, i) => {
                    if (target.id >= m.start && target.id <= m.stop) {
                        var bott = Array.from(document.getElementsByClassName('butt_mention'))
                        bott.map(b => {
                            if (Number(b.id) + b.textContent.trim().length - 1 === m.start + m.mention_text.trim().length - 1) {
                                if (!b.classList.contains('blocked')) {
                                    target.style.fontWeight === 'bold' ? b.style.fontWeight = 'bold' : b.style.fontWeight = ''
                                }
                            }


                        })
                    }
                })
            }
            if(Action === 'concept-mention'){
                AllMentions.map((m,i)=>{
                    if(target.id >= m.start && target.id <= m.stop){
                        var bott =(document.getElementsByClassName('butt_linked'))
                        bott[i].style.fontWeight = ''


                    }
                })
            }

        }


    }


    {if(props.action === 'mentions' || props.action === 'concept-mention'){
        return (
            <>
                {/*<button ref={target} name = "butt" id={props.start_token} className="token" onClick={handleClick} value={props.word}><span>{props.word.slice(0,-1)}</span><span id={props.stop_token}>{props.word.slice(-1)}</span></button>*/}
                <button ref={target} name = "butt" id={props.start_token} className="token" onMouseOut={(e)=>TokenOut(e)} onClick={(e)=>handleClick(e,props.start_token)}  onMouseOver={(e)=>TokenOver(e)} value={props.word}>{props.word}</button>



                <Overlay target={target.current} show={ShowAlert1} placement="top">
                    {(props) => (
                        <Tooltip  {...props}>
                            Not allowed
                        </Tooltip>
                    )}
                </Overlay>
                <Overlay target={target.current} show={ShowAlert2} placement="top">
                    {(props) => (
                        <Tooltip {...props}>
                            Already selected
                        </Tooltip>
                    )}
                </Overlay>
                <Overlay target={target.current} show={ShowAlert3} placement="top">
                    {(props) => (
                        <Tooltip {...props}>
                            It is a mention
                        </Tooltip>
                    )}
                </Overlay>

            </>

        );

    }

    else if(props.action === 'mentionsList' && Color !== ''){ //Colora nella lista a destra
        return (
            <span id={props.start_token}>{props.word}</span>

        );

    }

        return (
            <span id={props.start_token}>{props.word}</span>
        );
    }

}



export default TokenOverlapping;