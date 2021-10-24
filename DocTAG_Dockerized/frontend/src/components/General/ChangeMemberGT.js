import React, {Component, useContext, useEffect, useRef, useState} from 'react'
import axios from "axios";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, OverlayTrigger} from "react-bootstrap";
import './buttons.css';
import './first_row.css';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import {AppContext} from "../../App";
import {faFileAlt,faRobot,faUser,faUserFriends,faUserEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Tooltip from "react-bootstrap/Tooltip";


function ChangeMemberGT(props){
    const { fieldsToAnn,makereq,userchosen,userslist,selectedLang,loadingChangeGT,batchNumber,report_type,institute,language,finalcount,username,showmember,showmajority,reached,showautoannotation,reportString,fields,annotation,report,usecase,concepts,semanticArea, disButton,labelsToInsert, selectedconcepts,linkingConcepts, radio, checks,save, userLabels, labelsList, mentionsList, action, reports, index, mentionSingleWord, allMentions, tokens, associations } = useContext(AppContext);
    const [associations_to_show,SetAssociations_to_show] = associations;
    // const [SelectedLang,SetSelectedLang] = selectedLang
    const [labels, setLabels] = labelsList
    const [Checks, setChecks] = checks;
    const [Fields,SetFields] = fields;
    const [FieldsToAnn,SetFieldsToAnn] = fieldsToAnn;
    const [SavedGT,SetSavedGT] = save;
    const [LabToInsert,SetLabToInsert] = labelsToInsert;
    const [Annotation,SetAnnotation] = annotation
    const [UseCase,SetUseCase] = usecase;
    const [ReportType,SetReportType] = report_type;
    const [Language,SetLanguage] = language;
    const [Institute,SetInstitute] = institute;
    const [reportsString, setReportsString] = reportString;
    const [FinalCount, SetFinalCount] = finalcount;
    const [FinalCountReached, SetFinalCountReached] = reached;
    const [ShowAutoAnn,SetShowAutoAnn] = showautoannotation;
    const [ShowMemberGt,SetShowMemberGt] =showmember
    const [ShowMajorityGt,SetShowMajorityGt] = showmajority
    const [Disable_Buttons, SetDisable_Buttons] = disButton;
    const [labels_to_show, setLabels_to_show] = userLabels;
    const [RadioChecked, SetRadioChecked] = radio;
    const [selectedConcepts, setSelectedConcepts] = selectedconcepts;
    const [Children,SetChildren] = tokens;
    const [mentions_to_show,SetMentions_to_show] = mentionsList;
    const [WordMention, SetWordMention] = mentionSingleWord;
    const [Report, setReport] = report;
    const [AllMentions, SetAllMentions] = allMentions;
    const [Reports, setReports] = reports;
    const [Index, setIndex] = index;
    const [UserLabels, SetUserLables] = userLabels;
    const [Action, SetAction] = action;
    const [BatchNumber,SetBatchNumber] = batchNumber; //PER CLEAR
    const [Disabled,SetDisabled] = useState(true); //PER CLEAR
    const [ExaRobot,SetExaRobot] = useState(false)
    const [Concepts, SetConcepts] = concepts;
    const [ChangeButton,SetChangeButton] = useState(false)
    const [Username,SetUsername] = username
    const [SemanticArea, SetSemanticArea] = semanticArea;
    const [UserChosen,SetUserChosen] = userchosen
    const [userGT,SetUserGT] = useState(true)
    const [UsersList,SetUsersList] = userslist
    const [RobotPresence,SetRobotPresence] = useState(false)
    const but1 = useRef(null)
    // const but2 = useRef()
    const but3 = useRef()
    const [MakeReq,SetMakeReq] = makereq
    const [LoadingChangeGT,SetLoadingChangeGT] = loadingChangeGT
    const [ClickBottomMenu,SetClickBottomMenu] = useState(false)

    function order_array(mentions){
        var ordered = []
        var texts = []
        mentions.map((item,i)=>{
            texts.push(item.mention_text)
        })
        texts.sort()
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
    useEffect(()=>{
        console.log('changegt',LoadingChangeGT)
    },[LoadingChangeGT])

    useEffect(()=>{
        SetMakeReq(true)
    },[ShowAutoAnn,ShowMemberGt,UserChosen])

    useEffect(()=>{
        SetMakeReq(true)
        but1.current.className = 'btn btn-outline-primary btn-sm'
        // but2.current.className = 'btn btn-outline-primary btn-sm'
        but3.current.className = 'btn btn-outline-primary btn-sm'

        // axios.get("http://0.0.0.0:8000/get_users_list")
        //     .then(response => {
        //         if(response.data.length>0){
        //             console.log(response.data)
        //             SetUsersList(response.data)
        //         }})
        //     .catch(error=>{
        //         console.log(error)
        //     })

        // axios.get("http://0.0.0.0:8000/check_auto_presence_for_configuration",
        //     {params: {batch:BatchNumber,usecase:UseCase,institute:Institute,language:Language,report_type:ReportType}})
        //     .then(response => {
        //         if(response.data['count'] > 0){
        //             SetRobotPresence(true)
        //         }
        //         else{
        //             SetRobotPresence(false)
        //         }})
        //     .catch(error=>{
        //         console.log(error)
        //     })
    },[])



    useEffect(()=>{
        // but1.current.focus()
        but1.current.className = 'btn btn-primary btn-sm'
        // but2.current.className = 'btn btn-outline-primary btn-sm'
        but3.current.className = 'btn btn-outline-primary btn-sm'
        SetChangeButton(false)
    },[Index,Action])

    function UserGT() {
        if(ShowMemberGt === true){
            SetMakeReq(true)
            but1.current.className = 'btn btn-primary btn-sm'
            // but2.current.className = 'btn btn-outline-primary btn-sm'
            but3.current.className = 'btn btn-outline-primary btn-sm'
            // if(ShowAutoAnn === true || ShowMemberGt === true){
            //     SetLoadingChangeGT(true)
            //
            // }
            SetClickBottomMenu(true)

            // SetShowAutoAnn(false)
            SetShowMemberGt(false)
            SetChangeButton(false)
        }

    }

    function MemberGT(){
        if(ShowMemberGt === false){
            SetMakeReq(true)
            but1.current.className = 'btn btn-outline-primary btn-sm'
            but3.current.className = 'btn btn-primary btn-sm'
            // but2.current.className = 'btn btn-outline-primary btn-sm'
            if(ShowMemberGt === false && ShowAutoAnn === false){
                submit(Action)

            }
            // if(ShowMemberGt === false){
            //     SetLoadingChangeGT(true)
            // }
            SetShowMemberGt(true)
            SetClickBottomMenu(true)

            // SetShowAutoAnn(false)
            SetChangeButton(false)
            SetUserGT(false)

        }




    }
    useEffect(()=>{
        SetClickBottomMenu(true)
    },[UserChosen])

    useEffect(()=>{
        // console.log('userchosen',MakeReq)
        var username_to_call = Username
        if (Annotation === 'Automatic'){
            var ns_id = 'Robot'
        }
        else{
            var ns_id = 'Human'
        }
        if(ShowAutoAnn){
            username_to_call = Username
            ns_id = 'Robot'
        }
        else if(ShowMemberGt){
            username_to_call = UserChosen

        }
        // console.log('CONCEPTS',ClickBottomMenu)

        if(ClickBottomMenu){
            SetLoadingChangeGT(true)
            console.log('load true')
            // if(MakeReq && ChangeButton){
            axios.get("http://0.0.0.0:8000/report_start_end", {params: {ns_id:ns_id,report_id: Reports[Index].id_report.toString()}}).then(response => {
                SetFinalCount(response.data['final_count']);SetFinalCountReached(false);SetChangeButton(true)
            })
            // axios.get("http://0.0.0.0:8000/get_fields",{params:{ns_id:ns_id}}).then(response => {SetFields(response.data['fields']);SetFieldsToAnn(response.data['fields_to_ann']);})

            if(Action === 'labels' ){
                // axios.get("http://0.0.0.0:8000/annotationlabel/all_labels",{params:{ns_id:ns_id}}).then(response => {setLabels(response.data['labels'])})
                axios.get("http://0.0.0.0:8000/annotationlabel/user_labels", {params: {language:Language,ns_id:ns_id,username:username_to_call,report_id: Reports[Index].id_report.toString()}}).then(response => {
                    setLabels_to_show(response.data[Action.toString()]);
                    SetLoadingChangeGT(false);console.log('load false 1');SetMakeReq(false);console.log('falso');

                })
            }
            else if(Action === 'concepts' ){
                // console.log('CONCEPTS')
                // axios.get("http://0.0.0.0:8000/get_semantic_area",{params: {ns_id:ns_id}}).then(response => SetSemanticArea(response.data['area']))
                // axios.get("http://0.0.0.0:8000/conc_view",{params: {ns_id:ns_id}}).then(response => {SetConcepts(response.data['concepts'])})
                axios.get("http://0.0.0.0:8000/contains", {params: {language:Language,ns_id:ns_id,username:username_to_call,report_id: Reports[Index].id_report.toString()}}).then(response => {setSelectedConcepts(response.data);SetLoadingChangeGT(false);console.log('load false 2');})
                SetMakeReq(false)
            }
            SetClickBottomMenu(false)
            SetLoadingChangeGT(false)
        }



    },[ClickBottomMenu,UserChosen])
// },[ChangeButton,MakeReq])



    useEffect(()=>{
        SetShowMajorityGt(false)
        SetShowAutoAnn(false)
        SetShowMemberGt(false)
        SetClickBottomMenu(false)
    },[Report,Index,Action])

    useEffect(()=>{
        console.log('change',ChangeButton)
        if(ChangeButton === true && (Fields.length > 0 || FieldsToAnn.length > 0) && MakeReq){ // Adedd 3092021
            var username = Username
            if(Annotation === 'Automatic'){
                var mode = 'Robot'
            }
            else if (Annotation === 'Manual'){
                var mode = 'Human'
            }

            if(ShowAutoAnn){
                mode = 'Robot'
            }
            if(ShowMemberGt){
                username = UserChosen

            }
            // if((ShowAutoAnn === true || ShowMemberGt === true) && ChangeButton === true){
            if(Action === 'mentions' && MakeReq){
                SetLoadingChangeGT(true)
                SetLoadingChangeGT(false);console.log('load true 1');
                axios.get("http://0.0.0.0:8000/mention_insertion", {params: {language:Language,username:username,ns_id:mode,report_id: Reports[Index].id_report.toString()}}).then(response => {
                    var mentions = (response.data[Action.toString()])
                    // SetLoadingChangeGT(false);
                    SetLoadingChangeGT(false);console.log('load false 3');
                    console.log('falso')

                    var ordered = order_array(mentions)
                    console.log('ordered',ordered)
                    SetMentions_to_show(ordered);
                    SetMakeReq(false)

                })
                SetLoadingChangeGT(true)
            }

            else if(Action === 'concept-mention' && MakeReq){
                SetLoadingChangeGT(true)
                axios.get("http://0.0.0.0:8000/insert_link/linked", {params: {language:Language,username:username,ns_id:mode,report_id: Reports[Index].id_report.toString()}}).then(response => {
                    SetAssociations_to_show(response.data['associations']);SetLoadingChangeGT(false);SetMakeReq(false)
                })
                axios.get("http://0.0.0.0:8000/insert_link/mentions", {params: {language:Language,username:username,ns_id:mode,report_id: Reports[Index].id_report.toString()}}).then(response => {
                    var mentions = (response.data['mentions1']);
                    var ordered = order_array(mentions)
                    console.log('ordered2',ordered)
                    // SetLoadingChangeGT(false);
                    SetLoadingChangeGT(false);console.log('load false 4');
                    console.log('falso')
                    SetMakeReq(false)
                    SetAllMentions(ordered)
                })
                SetLoadingChangeGT(true)
            }
        }
    },[ChangeButton,MakeReq])


    // },[ChangeButton,MakeReq])


    const submit = (token) => {
        // if(Saved === false){
        //     SetSaved(true)
        console.log('AZIONE',token)
        if (token.startsWith('mentions')) {
            SetWordMention('')
            Children.map(child=>{
                if(child.getAttribute('class') === 'token-selected' || child.getAttribute('class') === 'token-adj-dx' ||child.getAttribute('class') === 'token-adj-sx'){
                    child.setAttribute('class','token')
                }
            })
            var data_to_ret = {'mentions': mentions_to_show}
            // console.log('mentions: ' ,mentions_to_show)

            axios.post('http://0.0.0.0:8000/mention_insertion/insert', {
                mentions: data_to_ret['mentions'],language:Language,
                report_id: Reports[Index].id_report
            })
                .then(function (response) {

                    SetSavedGT(prevState => !prevState)
                    // console.log('RISPOSTA',response);
                })
                .catch(function (error) {
                    //alert('ATTENTION')
                    console.log(error);
                });

        }else if (token.startsWith('labels')) {
            //const data = new FormData(document.getElementById("annotation-form"));
            // console.log('labtoinsert',LabToInsert)
            axios.post('http://0.0.0.0:8000/annotationlabel/insert', {
                //labels: data.getAll('labels'),
                labels: LabToInsert,language:Language,
                report_id: Reports[Index].id_report,
            })
                .then(function (response) {
                    // console.log(response);

                    // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                    if (LabToInsert.length === 0) {
                        SetRadioChecked(false)

                    }
                    // SetLabToInsert([])
                    SetSavedGT(prevState => !prevState)
                })
                .catch(function (error) {

                    console.log(error);
                });

        } else if (token.startsWith('concept-mention')) {
            const data = new FormData(document.getElementById("linked-form"));
            //var data_to_ret = {'linked': data.getAll('linked')}


            data_to_ret = {'linked': associations_to_show}
            if (data_to_ret['linked'].length >= 0) {
                axios.post('http://0.0.0.0:8000/insert_link/insert', {
                    linked: data_to_ret['linked'],language:Language,
                    report_id: Reports[Index].id_report
                })
                    .then(function (response) {
                        // console.log(response);
                        // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                        SetWordMention('')
                        // console.log('aggiornato concepts');

                        SetSavedGT(prevState => !prevState)
                    })
                    .catch(function (error) {

                        console.log(error);
                    });
            }
        } else if (token.startsWith('concepts')) {
            // console.log(selectedConcepts);

            let concepts_list = []

            for (let area of SemanticArea) {
                for (let concept of selectedConcepts[area]) {
                    concepts_list.push(concept);
                }
            }

            // console.log(concepts_list);

            axios.post('http://0.0.0.0:8000/contains/update', {
                    concepts_list: concepts_list,language:Language,
                    report_id: Reports[Index].id_report,
                },
            )
                .then(function (response) {
                    // console.log(response);
                    // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                    SetSavedGT(prevState => !prevState)

                })
                .catch(function (error) {

                    console.log(error);
                });
        }



    }


    return(

        <div className="buttongroup">

            <ButtonGroup>
                    <OverlayTrigger
                        key='top'
                        placement='top'
                        overlay={
                            <Tooltip id={`tooltip-top'`}>
                                Your annotation
                            </Tooltip>
                        }
                    >
                    <Button disabled = {UsersList.length < 2} ref ={but1} onClick={()=>UserGT()} id='current' size = 'sm' variant="secondary">
                        <FontAwesomeIcon icon={faUser} />
                    </Button>
                    </OverlayTrigger>
                    {/*<OverlayTrigger*/}
                    {/*    key='top'*/}
                    {/*    placement='top'*/}
                    {/*    overlay={*/}
                    {/*        <Tooltip id={`tooltip-top'`}>*/}
                    {/*            Robot's annotation*/}
                    {/*        </Tooltip>*/}
                    {/*    }*/}
                    {/*>*/}
                    {/*    <Button disabled={RobotPresence === false || Annotation === 'Automatic' || Language !== 'english'} ref={but2} onClick={() => RobotGT()} id='robot' size='sm' variant="secondary">*/}
                    {/*        <FontAwesomeIcon icon={faRobot}/>*/}
                    {/*    </Button></OverlayTrigger>*/}
                    <OverlayTrigger
                        key='top'
                        placement='top'
                        overlay={
                            <Tooltip id={`tooltip-top'`}>
                                {UserChosen}'s annotation
                            </Tooltip>
                        }
                    >
                    <Button disabled={(UsersList.length < 2)} ref = {but3} onClick={()=>MemberGT()} id='mate' size = 'sm' variant="secondary">
                        <FontAwesomeIcon icon={faUserEdit} />
                    </Button></OverlayTrigger>
                </ButtonGroup>
        </div>
    );



}

export default ChangeMemberGT