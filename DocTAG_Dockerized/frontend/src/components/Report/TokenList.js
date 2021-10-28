import React, {Component, useContext, useEffect, useState} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Row,Col} from "react-bootstrap";
import './report.css';
import Token from "./Token";
import {AppContext} from "../../App";
import Token_DocTag from "./Token_DocTag";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

function TokenList(props){
    const [Words, SetWords] = useState([])
    const [ActiveWords, SetActiveWords] = useState([])
    const { tokentocolor } = useContext(AppContext);
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



    useEffect(()=>{
        var array = []
        var words = []

        var stringa = props.testo.toString() //The age is considered an integer!!
        words = stringa.split(' ')
        // console.log('testo malvagio',words)
        //
        // if(stringa.indexOf(' ')){
        //
        // }
        // else{
        //     words.push(stringa)
        // }
        // console.log('startpassato',props.startSectionChar)
        var start = props.startSectionChar
        words.map((word,index) =>{
            var end = start + word.length - 1
            var obj = {'word':word,'startToken':start,'stopToken':end}
            array.push(obj)
            start = end + 2 //tengo conto dello spazio
            //console.log('obj',obj)
        })
        SetWords(array)

    },[props.testo])




    return(

        // <div>
        //     {props.testo}
        // </div>

        <div>
            {Words.map((word,index)=>
                <span className="tokenList"><Token_DocTag key = {word.startToken} action = {props.action} words = {Words} start_token={word.startToken} stop_token={word.stopToken} word={word.word} index={index} activate = {ActiveWords}/> </span>
            )}
        </div>
    );

}


export default TokenList