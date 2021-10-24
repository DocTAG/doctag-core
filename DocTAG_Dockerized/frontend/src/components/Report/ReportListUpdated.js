import React, {useRef, useContext, useEffect, useState} from 'react'
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, OverlayTrigger} from "react-bootstrap";
import './report.css';
import {AppContext, MentionContext} from "../../App";
import Button from "react-bootstrap/Button";
import {
    faExpandAlt,faMagic,
    faPencilAlt,
    faCompressAlt,
    faSignOutAlt,
    faLanguage,

} from '@fortawesome/free-solid-svg-icons';
import Badge from "react-bootstrap/Badge";
import ReportSection from "./ReportSection";
import ReportSelection from "./ReportSelection";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ErrorSnack from "./ErrorSnack";
import NextPrevButtons from "../General/NextPrevButtons";
import Tooltip from "react-bootstrap/Tooltip";
import TopicSelection from "./TopicSelection";
import Modal from "react-bootstrap/Modal";
import TopicNextPrevButtons from "../General/TopicNextPrevButtons";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
function ReportListUpdated(props) {

    const { selectedLang,usecase,save,topk,tokentocolor,mentionToAdd,highlightMention,colorword,mentionSingleWord,showSnackReport,loadingReport,tokens,showautoannotation,finalcount,reached,userchosen,report_type,showmajoritymodal,showmajoritygt,annotation,action,language,showmember,username,showmajority,report,index,institute,showannotations,showreporttext,fields,fieldsToAnn,orderVar, errorSnack,reports, reportString, insertionTimes } = useContext(AppContext);
    const [Fields,SetFields] = fields;
    const [Username,SetUsername] = username
    const [ShowMajorityModal,SetshowMajorityModal] = showmajoritymodal
    const [ReportType, SetReportType] = report_type
    const [ShowAutoAnn,SetShowAutoAnn] = showautoannotation;
    const [ShowMemberGt,SetShowMemberGt] =showmember
    const [ShowMajorityGt,SetShowMajorityGt] = showmajority
    const [Report, setReport] = report;
    const [MentionToAdd,SetMentionToAdd] = mentionToAdd

    const [Language,SetLanguage] = language;
    const [Action,SetAction] = action
    const [Children,SetChildren] = tokens;
    const [LoadingReport, SetLoadingReport] = loadingReport;
    const [FieldsToAnn,SetFieldsToAnn] = fieldsToAnn;
    const [FinalCount, SetFinalCount] = finalcount;
    const [FinalCountReached, SetFinalCountReached] = reached;
    // const [ShowErrorSnack, SetShowErrorSnack] = errorSnack;
    // const [Reports,SetReports] = reports
    // const [Institute,SetInstitute] = institute
    const [Index,SetIndex] = index
    const [ShowMajorityGroundTruth,SetShowMajorityGroundTruth] = showmajoritygt
    const [ReportString, SetReportString] = reportString;
    const [ArrayInsertionTimes,SetArrayInsertionTimes] = insertionTimes
    //Report sections
    const [WordMention, SetWordMention] = mentionSingleWord;
    const [CurTime, SetCurTime] = useState(false)
    const [Translation, SetTranslation] = useState(false)
    const [OrderVar,SetOrderVar] = orderVar;
    const [ShowAnnotationsStats,SetShowAnnotationsStats] = showannotations
    const [showReportText,SetshowReportText] = showreporttext;
    // const [Annotation,SetAnnotation] = annotation
    const [UserChosen,SetUserChosen] = userchosen
    const [Reports,SetReports] = reports
    const [reportsString, setReportsString] = reportString;
    const [HighlightMention, SetHighlightMention] = highlightMention;

    const [ReportTranslation,SetReportTranslation] = useState([])
    const [ExtractFields,SetExtractFields] = useState([])
    const pubmed_fields_to_ann = ['title','abstract']
    const pubmed_fields = ['authors','journal','volume','year']
    const [SelectedLang,SetSelectedLang] = selectedLang
    const [SavedGT,SetSavedGT] = save;
    const [ReportText,SetReportText] = useState(false)
    const [Expanded,SetExpanded] = useState(false)
    const expand = useRef(null);
    const topic = useRef(null);
    const topic_header = useRef(null);
    const doc_corpus = useRef(null);
    const doc_header = useRef(null);
    const info = useRef(null);
    const [ShowNarrModal,SetShowNarrModal] = useState(false)
    const [useCase,setUseCase] = usecase
    const [TopicInfo,SetTopicInfo] = useState({})
    const [ColorWords,SetColorWords] = colorword
    const [TokenToColor,SetTokenToColor] = tokentocolor
    const [Top_K,SetTop_K] = topk


    useEffect(()=>{
        console.log('tokentocolor',TokenToColor)
    },[TokenToColor])
    useEffect(()=>{
        if(Translation === false && ReportString !== false && ReportString !== ''&& ReportString !== undefined){
            SetReportText(ReportString)
        }
        if (Translation !== false){
            SetReportText(Translation)
        }

    },[ReportString,Translation])

    useEffect(()=>{
        SetColorWords(false)
        SetTokenToColor(false)
    },[Action,Index,Reports,Report,ReportString])


    useEffect(()=>{
        var tokens = Array.from(document.getElementsByName('butt'))
        var tokens_1 = Array.from(document.getElementsByClassName('span_to_highlight'))
        var topic_spans = Array.from(document.getElementsByClassName('topic_span'))
        var title_spans = Array.from(document.getElementsByClassName('title_span'))
        SetWordMention([])
        SetTokenToColor(false)
        SetMentionToAdd('')
        SetHighlightMention(false)
        var array_butt_mentions = Array.from(document.getElementsByClassName('butt_mention'))
        array_butt_mentions.map(child=>child.style.fontWeight = '')
        tokens.map(token=>{

            if(token.style.fontWeight === 'bold'){

                if(token.className !== 'token-selected'){
                    token.style.fontWeight = 'normal'
                }
            }

        })
        tokens_1.map(token=>{

            if(token.style.fontWeight === 'bold'){

                if(token.className !== 'token-selected'){
                    token.style.fontWeight = 'normal'
                }
            }

        })
        topic_spans.map(token=>{
            if(token.style.fontWeight === 'bold') {

                token.style.fontWeight = ''
            }

        })
        title_spans.map(token=>{
            if(token.style.fontWeight === 'bold') {

                token.style.fontWeight = ''
            }

        })


        if(ColorWords === true){

            var t = []
            axios.get('http://0.0.0.0:8000/get_query_doc_words',{params:{id_report:Reports[Index].id_report}}).then(response=>{
                response.data['top_k'].map(k=>{
                    topic_spans.map(token=>{
                        if((token.textContent.toString().toLowerCase()).includes(k[0].toString().toLowerCase())){

                            token.style.fontWeight = 'bold'
                            // console.log('sono qua',token)

                        }

                    })
                    title_spans.map(token=>{
                        if((token.textContent.toString().toLowerCase()).includes(k[0].toString().toLowerCase())){

                            token.style.fontWeight = 'bold'
                        }

                    })
                    tokens.map(token=>{



                        if((token.innerText.toString().toLowerCase()).includes(k[0].toString().toLowerCase())){
                            // t.push([token,k[1]])
                            t.push([token.innerText.toString().toLowerCase().replace(' ',''),k[1]])


                        }
                    })
                    tokens_1.map(token=>{

                        if((token.innerText.toString().toLowerCase()).includes(k[0].toString().toLowerCase())){
                            // t.push([token,k[1]])
                            t.push([token.innerText.toString().toLowerCase().replace(' ',''),k[1]])


                        }
                    })
                })
                console.log('array',t)
                SetTokenToColor(t)
            })
        }

    },[ColorWords])


    useEffect(()=>{
        if(useCase !== ''){
            axios.get('http://0.0.0.0:8000/get_topic_info',{params:{topic:useCase}}).then(response=>{SetTopicInfo(response.data)}).catch(error=>console.log(error))
        }
    },[useCase])


    useEffect(()=>{
        console.log('topicinfo1',TopicInfo)
        if(Object.keys(TopicInfo).length > 0){
            console.log('topicinfo entro')
            console.log('topicinfo',TopicInfo)
            console.log('topicinfo',TopicInfo['title'])
            console.log('topicinfo',typeof TopicInfo['title'])
        }
    },[TopicInfo])

    // useEffect(()=>{
    //     if(TopicInfo !== {}){
    //         var str = ''
    //         str = TopicInfo['title'] + ' ' + TopicInfo['description']
    //         SetTopicSplitted
    //     }
    // },[TopicInfo])


    // useEffect(()=>{
    //     var new_arr = []
    //     if(ShowAnnotationsStats === true || ShowMajorityModal === true){
    //         axios.get('http://0.0.0.0:8000/get_post_fields_for_auto').then(response=>{
    //             Object.keys(response.data['extract_fields']).map(val=>{
    //
    //
    //                 response.data['extract_fields'][val].map(el=>{
    //                     new_arr.push(el)
    //
    //                 })
    //             })
    //             SetExtractFields(new_arr)
    //         })
    //
    //     }
    //
    //
    // },[ShowAnnotationsStats,ShowMajorityModal])


    function setOrder(e){
        e.preventDefault()
        SetOrderVar('lexic')
    }

    // useEffect(()=>{
    //     console.log('fields',Fields)
    //     console.log('fieldstoann',FieldsToAnn)
    // },[Fields,FieldsToAnn])
    function setOrder1(e){
        e.preventDefault()
        SetOrderVar('annotation')
    }

    useEffect(()=>{
        // console.log('AUTOANN',Report)
        var username_to_call = Username
        var ns_id = 'Human'
        // if (Annotation === 'Automatic'){
        //     var ns_id = 'Robot'
        // }
        // else{
        //     var ns_id = 'Human'
        // }
        // if(ShowAutoAnn){
        //     username_to_call = Username
        //     ns_id = 'Robot'
        //
        // }
        if(ShowMemberGt){

            username_to_call = UserChosen

        }

        if(Report !== undefined){

            if((ShowAutoAnn || ShowMemberGt)){
                console.log('AXIOS')
                axios.get('http://0.0.0.0:8000/get_insertion_time_record',
                    {params:{ns_id:ns_id,username:username_to_call,rep:Reports[Index]['id_report'],language:SelectedLang,action:Action}})
                    .then(response=>{
                        if(response.data['date'] !== ''){
                            var data = response.data['date'].toString()
                            console.log('salvo!')

                            var date = data.split('T')
                            var hour = date[1].toString().split('.')
                            var temp = 'date: ' + date[0] + '  time: '+ hour[0] + '(GMT+1)'
                            SetCurTime(temp)
                        }
                        else{
                            SetCurTime('')

                        }

                    })
            }

        }
        else{
            SetCurTime(false)

        }
    },[ShowAutoAnn,ShowMemberGt,UserChosen,Report])



    useEffect(()=>{
        console.log('REPORT',ReportString)

        if(ShowAnnotationsStats === false && showReportText === false && ShowMajorityModal === false){
            if(OrderVar === 'lexic' && ReportString !== null){
                var el = document.getElementById('lexic')
                var el1 = document.getElementById('annot')
                el.style.fontWeight = 'bold';
                el1.style.fontWeight = 'normal';
            }
            else if(OrderVar === 'annotation' && ReportString !== null){
                var el1 = document.getElementById('lexic')
                var el = document.getElementById('annot')
                el.style.fontWeight = 'bold';
                el1.style.fontWeight = 'normal';
            }
        }

    },[OrderVar,ReportString])

    useEffect(()=>{
        console.log('trans')
        if(ReportString !== undefined){
            axios.get('http://0.0.0.0:8000/get_report_translations',{params:{id_report:Report.id_report}}).then(response=>{
                SetReportTranslation(response.data['languages'])
                console.log('respp',response.data['languages'])
            })
        }
    },[ReportString])


    function get_trans(rep){
        SetSelectedLang(rep)
        if(rep !== Language){
            // SetLoadingReport(true)
            axios.get("http://0.0.0.0:8000/report_start_end", {params: {language:rep,report_id: Reports[Index].id_report.toString()}}).then(response => {
                SetTranslation(response.data['rep_string']); SetFinalCount(response.data['final_count']);SetFinalCountReached(false);
                // SetLoadingReport(false)
            })
        }
        else{
            SetTranslation(false)
        }

    }
    useEffect(()=>{
        if(ShowAnnotationsStats === false  && ShowMajorityModal === false && showReportText === false && Object.keys(TopicInfo).length > 0){
            if(Expanded){
                expand.current.className = 'first_container_expanded'
                info.current.style.display = 'none'
                doc_header.current.style.display = 'none'
                doc_corpus.current.style.height = '63vh'
                topic.current.style.display = 'none'
                topic_header.current.style.display = 'none'
            }
            else{
                expand.current.className = 'first_container'
                info.current.style.display = 'flex';
                doc_header.current.style.display = 'flex';
                topic.current.style.display = 'flex';
                topic_header.current.style.display = 'flex';
                doc_corpus.current.style.height = '25vh'

            }
        }
        else if(ShowAnnotationsStats === true  || ShowMajorityModal === true || showReportText === true){
            // info.current.style.display = 'none'
            // doc_header.current.style.display = 'none'
            doc_corpus.current.style.height = '63vh'
            doc_corpus.current.style.overflow = 'initial'
            // topic.current.style.display = 'none'
            // topic_header.current.style.display = 'none'
        }

    },[Expanded])

    useEffect(()=>{

        if(SelectedLang !== '' && ReportTranslation.length > 0) {

            var l = Array.from(document.getElementsByClassName('lang_span'))

            l.map(el=>{

                if(el.id === SelectedLang){

                    el.style.fontWeight = 'bold'
                }
                else{
                    el.style.fontWeight = 'normal'

                }
            })

        }
    },[SelectedLang,ReportTranslation])

    const closeNarrModal = () => {SetShowNarrModal(false)}

    return (
        <div>
            <Modal show={ShowNarrModal && TopicInfo['narrative'] !== ''} onHide={closeNarrModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Narrative</Modal.Title>
                </Modal.Header>
                <Modal.Body>{TopicInfo['narrative']}</Modal.Body>
            </Modal>
            <div>
                {ReportString !== undefined && ShowAnnotationsStats === false  && ShowMajorityModal === false && showReportText === false && Object.keys(TopicInfo).length > 0 && <>

                    {Reports.length >0 && <div ref={topic_header}  className='first_row_container'>

                        <span className='reportListStyle'>TOPIC </span><span><TopicSelection /></span>&nbsp;&nbsp;<span ><TopicNextPrevButtons /></span></div>}

                    <div  ref={topic} className='topic_container'>
                        <Row>
                            <Col md={4} className="titles no-click">
                                <div>Title:</div>
                            </Col>
                            <Col md={8} >
                                {TopicInfo['title'].split(" ").map((topic_word,ind)=>
                                    <span className = 'title_span' id={'title_'+ind.toString()}>{topic_word} </span>
                                )}



                                </Col>
                            <Col md={4}  className="titles no-click">
                                <div>Description:</div>
                            </Col>
                            <Col md={8}><div>
                                {TopicInfo['description'].split(" ").map((topic_word,ind)=>
                                    <span className = 'topic_span' id={'topic_'+ind.toString()}>{topic_word} </span>
                                )}
                            </div>

                            </Col>
                            {Object.keys(TopicInfo).includes('narrative') && TopicInfo['narrative'] !== '' && <><Col md={4}  className="titles no-click">
                                <button className='narr_butt' onClick={()=>{SetShowNarrModal(true)}}>Narrative</button>
                            </Col>
                            <Col md={8}><div>

                            </div>

                            </Col></>}
                        </Row>
                        {/*<Row>*/}
                        {/*    <Col md={4} className="titles no-click">*/}
                        {/*        <div>Title:</div>*/}
                        {/*    </Col>*/}
                        {/*    <Col md={8} ><div><i>{TopicInfo['title']}</i></div></Col>*/}
                        {/*    <Col md={4}  className="titles no-click">*/}
                        {/*        <div>Description:</div>*/}
                        {/*    </Col>*/}
                        {/*    <Col md={8}><div><i>{TopicInfo['description']}</i></div></Col>*/}
                        {/*</Row>*/}
                        <hr style={{flex: '0 0 100%'}}/>

                    </div>

                </>}
                {Reports.length >0 && ReportString !== undefined && ShowAnnotationsStats === false  && ShowMajorityModal === false && showReportText === false && <div ref={doc_header}><span className='reportListStyle'>DOCUMENT </span><span><ReportSelection /></span>&nbsp;&nbsp;<span ><NextPrevButtons /></span></div>}

                <div id='report_sel' ref={expand} className='first_container doc_container'>


                    { ReportString !== undefined && ShowAnnotationsStats === false  && ShowMajorityModal === false && showReportText === false && <Row ref={info}>
                        <Col md={4} className="titles no-click">
                            <div>Documents' order:</div>
                        </Col>
                        <Col md={8}><div><Button size='sm' id='lexic' style={{'margin-top':'5px'}} onClick={(e)=>setOrder(e)}>Lexicographical</Button>&nbsp;&nbsp;<Button id='annot' style={{'margin-top':'5px'}} onClick={(e)=>setOrder1(e)} size='sm' >Annotated docs</Button></div></Col>
                        <Col md={4} className="titles no-click">
                            <div>last update:</div>
                        </Col>
                        {((ShowAutoAnn === true || ShowMemberGt === true || SelectedLang !== Language) && CurTime !== false) ? <Col md={8}><div>{CurTime}</div></Col> :
                            <>{ArrayInsertionTimes[Index] !== 0 ? <Col md={8}><div>{ArrayInsertionTimes[Index]}</div></Col> : <Col md={8}></Col>}</>}


                        {ReportType === 'pubmed' && <><Col md={4} className="titles no-click">
                            <div>PUBMED ID:</div>
                        </Col>
                            <Col md={8}>
                                {ReportType === 'pubmed' && <div>{props.report_id.split('PUBMED_')[1]}</div>}
                            </Col></>}

                        {ReportTranslation.length > 1 && <><Col md={4} className="titles no-click">
                            <div>Available versions:</div>
                        </Col>
                            <Col md={8}>
                                {ReportTranslation.map(rep=>
                                    <>{rep !== Language &&
                                    //onMouseDown={()=>get_trans(rep)} onMouseUp={()=>get_trans(Language)}
                                    <button
                                        style={{'border':'none','background-color':'white'}} onMouseDown={()=>get_trans(rep)} onMouseUp={()=>get_trans(Language)}
                                        type='button' ><Badge pill variant="primary">
                                        {rep}</Badge>
                                    </button>

                                    }&nbsp;&nbsp;</>
                                )}
                            </Col></>}


                        <hr style={{flex: '0 0 100%'}}/>
                    </Row>}


                    {ReportString !== undefined && ShowAnnotationsStats === false  && ShowMajorityModal === false && showReportText === false && <Row>
                        <Col md={10}>{Expanded && <span><b>Topic: </b>{useCase} <TopicNextPrevButtons/>&nbsp;&nbsp; |&nbsp;&nbsp;  <b>Doc: </b>{props.report_id} <NextPrevButtons/></span>}</Col>
                        <Col md={1}><OverlayTrigger
                            key='top'
                            placement='top'
                            overlay={
                                <Tooltip id={`tooltip-top'`}>
                                    {Expanded ? <>Minimize</> : <>Expand</>}
                                </Tooltip>
                            }
                        >
                            <span className='full-window' onClick={()=>SetExpanded(prev => !prev)}>{Expanded ? <FontAwesomeIcon  icon={faCompressAlt} /> : <FontAwesomeIcon  icon={faExpandAlt} />}</span></OverlayTrigger></Col>
                        <Col md={1}><OverlayTrigger
                            key='top'
                            placement='top'
                            overlay={
                                <Tooltip id={`tooltip-top'`}>
                                   Toggle top-{Top_K} TF-IDF matching words
                                </Tooltip>
                            }
                        >
                            <span className='full-window' onClick={()=>SetColorWords(prev => !prev)}><FontAwesomeIcon  icon={faMagic} /> </span></OverlayTrigger></Col>
                    </Row>}


                    <div ref={doc_corpus} className='doc_corpus'>
                        {ReportText !== false  && <div className='no_margin_top'>

                            {FieldsToAnn.map((field,ind)=><div className='no_margin_top'>
                                    {ReportText[field] !== undefined && ReportText[field] !== null  && <Row>
                                        {/*{((props.action === 'mentions' || props.action === 'concept-mention') && (ShowAnnotationsStats === false && ShowMajorityModal === false && Translation === false)) ? <Col md={4} className="titles no-click"><div><FontAwesomeIcon style={{'width':'0.8rem'}} icon={faPencilAlt}/> {field}:</div></Col> : <Col md={4} className="titles no-click"><div>{field}:</div></Col>}*/}
                                        {!((Fields.length === 0 && FieldsToAnn.length === 1) || (Fields.length === 1 && FieldsToAnn.length === 0)) && <>{((props.action === 'mentions' || props.action === 'concept-mention') && (ShowAnnotationsStats === false && ShowMajorityModal === false && Translation === false)) ? <Col md={4} className="titles no-click"><div><FontAwesomeIcon style={{'width':'0.8rem'}} icon={faPencilAlt}/> {field}:</div></Col> : <Col md={4} className="titles no-click"><div>{field}:</div></Col>}</>}
                                        {ShowAnnotationsStats === false && ShowMajorityModal === false && Translation === false && <Col md={((Fields.length === 0 && FieldsToAnn.length === 1) || (Fields.length === 1 && FieldsToAnn.length === 0)) ? 12 : 8}><ReportSection action={props.action} stop={ReportText[field].stop} start={ReportText[field].start} text={ReportText[field].text}  report = {props.report}/></Col>}
                                        {(ShowAnnotationsStats === true || ShowMajorityModal === true || Translation !== false) && <Col md={((Fields.length === 0 && FieldsToAnn.length === 1) || (Fields.length === 1 && FieldsToAnn.length === 0)) ? 12 : 8}><ReportSection action='noAction' stop={ReportText[field].stop} start={ReportText[field].start} text={ReportText[field].text}  report = {props.report}/></Col>}
                                    </Row>}
                                </div>
                            )}
                            {(ShowAnnotationsStats === true || ShowMajorityModal === true ) && ExtractFields.length > 0 && <div className='no_margin_top'>
                                {ExtractFields.map((field,ind)=><div>
                                        {ReportText[field] !== undefined && FieldsToAnn.indexOf(field) === -1 && Fields.indexOf(field) === -1 &&  ReportText[field] !== null  && <Row>
                                            {!((props.action === 'mentions' || props.action === 'concept-mention') && (ShowAnnotationsStats === false && ShowMajorityModal === false)) ? <Col md={4} className="titles no-click"><div><FontAwesomeIcon style={{'width':'0.8rem'}} icon={faPencilAlt}/> {field}:</div></Col> : <Col md={4} className="titles no-click"><div>{field}:</div></Col>}
                                            {ShowAnnotationsStats === false && ShowMajorityModal === false && <Col md={((Fields.length === 0 && FieldsToAnn.length === 1) || (Fields.length === 1 && FieldsToAnn.length === 0)) ? 12 : 8}><ReportSection action={props.action} stop={ReportText[field].stop} start={ReportText[field].start} text={ReportText[field].text}  report = {props.report}/></Col>}
                                            {(ShowAnnotationsStats === true || ShowMajorityModal === true ) && <Col md={((Fields.length === 0 && FieldsToAnn.length === 1) || (Fields.length === 1 && FieldsToAnn.length === 0)) ? 12 : 8}><ReportSection action='noAction' stop={ReportText[field].stop} start={ReportText[field].start} text={ReportText[field].text}  report = {props.report}/></Col>}
                                        </Row>}
                                    </div>
                                )}
                            </div >}
                            {Fields.map((field,ind)=><div className='no_margin_top'>
                                    {ReportText[field] !== undefined && ReportText[field] !== null  && FieldsToAnn.indexOf(field) === -1 && <Row>

                                        {!((Fields.length === 0 && FieldsToAnn.length === 1) || (Fields.length === 1 && FieldsToAnn.length === 0)) && <Col md={4} className="titles no-click"><div>{field}:</div></Col>}
                                        <Col md={((Fields.length === 0 && FieldsToAnn.length === 1) || (Fields.length === 1 && FieldsToAnn.length === 0)) ? 12 : 8}><ReportSection action='noAction' stop={ReportText[field].stop} start={ReportText[field].start} text={ReportText[field].text} report = {props.report}/></Col>

                                    </Row>}
                                </div>
                            )}




                        </div>}

                    </div>
                </div>

            </div>




            {/*}*/}
        </div>

    );

}

export default ReportListUpdated