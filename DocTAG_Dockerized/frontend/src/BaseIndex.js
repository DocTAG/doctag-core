import './App.css';
import LabelList from "./components/Labels/LabelList";
import {AppContext} from './App';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import {Container, Row, Col, Modal} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import ReportSelection from "./components/Report/ReportSelection";
import LinkedList from "./components/Linking/LinkedList";
import MentionList from "./components/Mentions/MentionList";
import './components/General/first_row.css';
import Buttons from "./components/General/Buttons"
import SubmitButtons from "./components/General/SubmitButtons";
import SelectMenu from "./components/SelectMenu/SelectMenu";
import {faUser,faEllipsisH,faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SideBar from "./components/General/SideBar";
import ConceptsContainer from "./components/Concepts/ConceptsContainer";
import NextPrevButtons from "./components/General/NextPrevButtons";
import StartingMenu from "./components/SelectMenu/StartingMenu";
import NewSideBar from "./components/General/NewSideBar";
import SnackBar from "./components/General/SnackBar";
import ReportListUpdated from "./components/Report/ReportListUpdated";
import SnackBarMention from "./components/General/SnackBarMention";
import {
    faExchangeAlt,faUserEdit
} from '@fortawesome/free-solid-svg-icons';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PassageLabelsList from "./components/Passages/PassageLabelsList";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
export const ReportContext = createContext('')

export const MentionContext = createContext('')
export const LinkedContext = createContext('')
export const LabelContext = createContext('')
export const ConceptContext = createContext('')
// export const PassageContext = createContext('')

function BaseIndex() {


    const { makereq,selectedLang,topicindex,fieldsToAnn,report_type,loadingChangeGT,showannotations,batchNumber,usersList,updateSingle,userchosen,showautoannotation,showmember,loadingLabels,annotation,loadingConcepts,loadingMentions,loadingAssociations,loadingReport,loadingReportList,loadingColors,clickedCheck,conceptOption,removedConcept,fields,checks,start,showbar,index,linkingConcepts,showSnackMention,mentionSingleWord,color,allMentions,mentionsList,mentionToAdd,associations,conceptModal,disButton,save,highlightMention,selectedconcepts,usecaseList,userLabels,labelsList,insertionTimes,tokens,report,reports,concepts,reached,finalcount,semanticArea,radio,changeConceots,labelsToInsert,showSnack,showSnackMessage,showOptions,username,action,reportString,outcomes,institute,language,usecase,updateMenu,languageList,instituteList } = useContext(AppContext);
    const [RemovedConcept,SetRemovedConcept] = removedConcept;
    const [SelectedLang,SetSelectedLang] = selectedLang
    const [LoadingChangeGT,SetLoadingChangeGT] = loadingChangeGT
    const [LoadingLabels, SetLoadingLabels] = loadingLabels;
    const [LoadingConcepts, SetLoadingConcepts] = loadingConcepts;
    const [LoadingMentions, SetLoadingMentions] = loadingMentions;
    const [LoadingMentionsColor, SetLoadingMentionsColor] = loadingColors;
    const [LoadingAssociations, SetLoadingAssociations] =loadingAssociations;
    const [LoadingReport, SetLoadingReport] = loadingReport;
    const [LoadingReportList, SetLoadingReportList] = loadingReportList;
    const [ShowSnackMention, SetShowSnackMention] =showSnackMention;
    const [ShowSnack, SetShowSnack] =showSnack;
    const [SnackMessage, SetSnackMessage] = showSnackMessage;
    const [LabToInsert,SetLabToInsert] =labelsToInsert;
    const [ShowAutoAnn,SetShowAutoAnn] = showautoannotation;
    const [ShowMemberGt,SetShowMemberGt] =showmember
    // const [selectedOption, setSelectedOption] = useState('');
    const [LinkingConcepts,SetLinkingConcepts] = linkingConcepts;
    const [change, setChange] = changeConceots;
    const [useCase,SetUseCase] = usecase;
    const [Language,SetLanguage] = language;
    const [Institute,SetInstitute] = institute;
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [ShowModal,SetShowModal] = showOptions;
    const [Annotation, SetAnnotation] = annotation
    const [UpdateMenu,SetUpdateMenu] = updateMenu;
    const [Action, SetAction] = action;
    const [Area, SetArea] = useState('')
    const [ConceptChosen, SetConceptChosen] = useState('')
    const [WordMention, SetWordMention] = mentionSingleWord;
    const [Mention, SetMention] = mentionToAdd;
    const [Outcomes,SetOutcomes] = outcomes;
    const [Enable, SetEnable] = useState(false)
    const [GroundTruth, SetGroundTruth] = useState(-1)
    const [labels, setLabels] = labelsList;
    const [Index, setIndex] = index;
    const [Report, setReport] = report;
    const [Reports, setReports] = reports;
    const [reportsString, setReportsString] = reportString;
    const [Children, SetChildren] = tokens;
    const [MountForm,SetMountForm] = useState([])
    // const colori = ['red','green','orange','blue','#3be02c', '#B71C1C','#4db6ac','#FF6D00','#0091EA','#fbc02d','#b80073','#64dd17','#880E4F','#0094cc','#4A148C','#7E57C2','#3F51B5','#2196F3','#c75b39','#0097A7','#00695C','#ec407a','#2196f3','#00695c','#F50057','#00E5FF','#c600c7','#00d4db',
    //     '#388E3C','#aa00ff','#558b2f','#76FF03','#69F0AE','#e259aa','#CDDC39','royalblue','#EEFF41','#ea7be6','#d05ce3','#1DE9B6','#F06292','#F57F17','#BF360C','#7781f4','#795548','#607D8B','#651fff','#8d6e63'];
    const [Color,SetColor] = color;
    //const [Color,SetColor] = useState(['red','green'])
    const [labels_to_show, setLabels_to_show] = userLabels;
    const [mentions_to_show, SetMentions_to_show] = mentionsList;
    const [associations_to_show,SetAssociations_to_show] = associations;
    const [AllMentions, SetAllMentions] = allMentions;
    const [Checks, setChecks] = checks;
    const [NoReports,SetNoReports] = useState(false)
    const [selectedOption, setSelectedOption] = conceptOption;
    const us = useRef(null)
    const [UsersList,SetUsersList] = usersList
    const [Show, SetShow] = useState(false)
    const [FinalCount, SetFinalCount] = finalcount;
    const [FinalCountReached, SetFinalCountReached] = reached;
    const [RadioChecked, SetRadioChecked] = radio;
    const [SemanticArea, SetSemanticArea] = semanticArea;
    const [Concepts, SetConcepts] = concepts;
    const [HighlightMention, SetHighlightMention] = highlightMention;
    const [ArrayInsertionTimes,SetArrayInsertionTimes] = insertionTimes;
    const [GTReport,SetGTreport] = useState(false)
    const [SavedGT,SetSavedGT] = save;
    const [ShowBar,SetShowBar] = showbar;
    const [Disabled_Buttons, SetDisable_Buttons] = disButton;
    const [Username, SetUsername] = username;
    const [Start,SetStart] = start;
    // State for each ConceptList
    const [ReportType,SetReportType] = report_type
    const [RefPage,SetRefPage] = useState(false);
    const [ShowConceptModal, SetShowConceptModal] = conceptModal;
    const [selectedConcepts, setSelectedConcepts] = selectedconcepts;

    const [BatchNumber,SetBatchNumber] = batchNumber
    const [upGroundTruth,SetupGroundTruth] = useState(false)
    const [MakeReq,SetMakeReq] = makereq
    const [ShowChangeUserModal,SetShowChangeUserModal] = useState(false)
    const [currentSemanticArea, setCurrentSemanticArea] = useState("All")
    const [Fields,SetFields] = fields;
    const [FieldsToAnn,SetFieldsToAnn] = fieldsToAnn;
    const [ClickedCheck, SetClickedCheck] = clickedCheck;
    const [ShowAnnotationsStats,SetShowAnnotationsStats] = showannotations;
    const [ChosenUser,SetChosenUser] = userchosen
    const [TopicIndex,SetTopicIndex] = topicindex;
    const [AskUpdate, SetAskUpdate] = useState(false)
    // Added by Fabio 20200218
    var csrf_token = "";
    const [UserChosen,SetUserChosen] = userchosen

    useEffect(()=>{
        window.scroll(0,0)
        console.log('ciaone')
    },[])

    useEffect(()=>{
        if(Language !== ''){
            SetSelectedLang(Language)

        }
    },[Language,Index])


    useEffect(()=>{
        if(useCase !== '' && Language !== '' && BatchNumber !== ''){
            axios.post('new_credentials',{
                usecase: useCase, language: Language, institute: Institute, annotation: Annotation,report_type: ReportType,batch:BatchNumber
            }).then(response=>{SetUpdateMenu(true)}).catch(error=>{
                console.log('error', error)
            })
        }

    },[useCase])

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
        // console.log('setto colori')
        // SetColor(colori)
        SetLoadingMentionsColor(true)
        // SetMakeReq(true) // DA METTERE

    },[Action,Index,Report,reportsString])




    useEffect(()=>{

        if((useCase !== '' && Language !== '' && Institute !== '' && Annotation !== '' && ReportType !== '' && BatchNumber !== '')) {
            console.log('QUA CI ENTRO_0', ReportType)
            axios.get("get_fields").then(response => {SetFields(response.data['fields']);SetFieldsToAnn(response.data['fields_to_ann']);})
            axios.get("get_semantic_area").then(response => SetSemanticArea(response.data['area']))
            axios.get("conc_view").then(response => {SetConcepts(response.data['concepts'])})
            axios.get("annotationlabel/all_labels").then(response => {
                setLabels(response.data['labels'])
            })

            // axios.get("get_fields").then(response => {
            //     SetFields(response.data['fields']);
            //     SetFieldsToAnn(response.data['fields_to_ann']);
            // })
            // axios.get("annotationlabel/all_labels").then(response => {
            //     setLabels(response.data['labels'])
            // })
            // axios.get("get_semantic_area").then(response => SetSemanticArea(response.data['area']))
            // axios.get("conc_view").then(response => {
            //     SetConcepts(response.data['concepts'])
            // })

            csrf_token = document.getElementById('csrf_token').value;

            axios.get("get_last_gt", {params: {configure: 'configure'}}
            ).then(response => {

                SetGroundTruth(response.data['groundtruth']);




            })


        }

    },[Institute, useCase,Language,Annotation,ReportType,BatchNumber]) // c'era upgroundtruth

    useEffect(()=>{
        // console.log('labels',labels)
        if(Concepts.length === 0 && labels.length === 0 && FieldsToAnn.length === 0){

            SetAskUpdate(true)
        }
        else{
            SetAskUpdate(false)
        }
    },[Concepts,labels,FieldsToAnn])

    useEffect(()=>{
        SetDisable_Buttons(true)
        setChange(false)
        // SetLabToInsert([])
        SetClickedCheck(false)
        setSelectedConcepts(false)
        // SetLinkingConcepts([])
        // setSelectedOption('')
        SetRemovedConcept(false)
    },[Index,Action])


    useEffect(()=>{

        if(UpdateMenu === true){
            setReportsString(false)
            SetChildren([])
            SetFinalCount(0)
            setIndex(0)
            setReports([])
            setReport('')
            SetAction(false)
            SetGTreport(prev=>!prev)
            SetUpdateMenu(false)

            axios.get("get_last_gt",{params: {configure:'configure'}}).then(response => {SetGroundTruth(response.data['groundtruth']); SetupGroundTruth(prev => !prev)})
        }

    },[UpdateMenu])



    useEffect(() => {

        if(useCase !== '' && Institute !== '' && Language !== '' ) {
            if (GroundTruth !== '') {

                var action = GroundTruth['gt_type']
                SetAction(action)


            } else {//DEFAULT
                SetAction('none')


            }
            SetLoadingReportList(true)
            console.log('entro qua dentro!!!!')
            axios.get("get_reports", {params: {configure: 'configure'}}).then(response => {
                setReports(response.data['report']);
                setIndex(response.data['index'])
                if(response.data['report'].length === 0){
                    SetNoReports(true)
                }
                else{
                    SetNoReports(false)
                }
                setReport(response.data['report'][0]);
                SetGTreport(true);
                SetLoadingReportList(false)
            })


        }

        }, [GroundTruth,upGroundTruth]);
    // }, [GroundTruth,upGroundTruth]);

    // useEffect(()=>{
    //     SetLoadingReport(false)
    // },[reportsString])

    useEffect(()=>{

        if(Reports.length > 0 && Action){
            SetSavedGT(prevState => !prevState) //Carico lista per select report
            SetLoadingReport(true)

            axios.get("report_start_end", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {
                setReportsString(response.data['rep_string']); SetFinalCount(response.data['final_count']);SetFinalCountReached(false); SetLoadingReport(false);

            })

            if (Action === 'labels' && MakeReq) {
                SetLoadingLabels(true)
                axios.get("annotationlabel/user_labels", {params: {language:Language,report_id: Reports[Index].id_report.toString()}}).then(response => {
                    setLabels_to_show(response.data[Action.toString()]);SetLoadingLabels(false);

                })
            }else if (Action === 'mentions' && MakeReq) {
                SetLoadingMentions(true)
                axios.get("mention_insertion", {params: {language:Language,report_id: Reports[Index].id_report.toString()}}).then(response => {
                    var mentions = response.data[Action.toString()]

                    var ordered = order_array(mentions)
                    SetMentions_to_show(ordered);
                    SetLoadingMentions(false);
                })
            } else if (Action === 'concept-mention' && MakeReq){
                SetLoadingAssociations(true)
                axios.get("insert_link/linked", {params: {language:Language,report_id: Reports[Index].id_report.toString()}}).then(response => {SetAssociations_to_show(response.data['associations']);})
                axios.get("insert_link/mentions", {params: {language:Language,report_id: Reports[Index].id_report.toString()}}).then(response => {
                    var mentions = (response.data['mentions1']);
                    var ordered = order_array(mentions);

                    SetAllMentions(ordered);
                    SetLoadingAssociations(false)})
            } else if (Action === 'concepts' ){
                SetLoadingConcepts(true)
                axios.get("contains", {params: {language:Language,report_id: Reports[Index].id_report.toString()}}).then(response => {setSelectedConcepts(response.data);SetLoadingConcepts(false);})

            }
            SetMakeReq(false)


        }
    },[GTReport])



    useEffect(()=>{

        if(Reports.length>0) {
            var json_arr = {}
            SemanticArea.map(val=>{
                json_arr[val] = []
            })
            setSelectedConcepts(json_arr)
            axios.get("report_start_end", {params: {report_id: Reports[Index].id_report.toString()}}).then(response => {SetFinalCount(response.data['final_count']);
                setReportsString(response.data['rep_string']); SetFinalCountReached(false);
                // console.log('DATA',(response.data['final_count'])
                // );
            })

        }
    },[Report,Index])


    useEffect(() => {
        var json_arr = {}
        SemanticArea.map(val=>{
            json_arr[val] = []
        })
        setSelectedConcepts(json_arr)

        if (Reports.length>0 && ShowMemberGt === false && Action === 'labels' && MakeReq) {

            axios.get("annotationlabel/user_labels", {params: {language:Language,report_id: Reports[Index].id_report.toString()}}).then(response => {SetMakeReq(false);setLabels_to_show(response.data[Action.toString()]);

            })
        }
        else if (Reports.length >0 && ShowMemberGt === false && Action === 'concepts' && MakeReq ){
            axios.get("contains", {params: {language:Language,report_id: Reports[Index].id_report.toString()}}).then(response => {setSelectedConcepts(response.data);SetMakeReq(false);})

        }
    }, [reportsString,MakeReq]); //report, Index // C'era anche Action, se dà problemi mettiamo


    useEffect(() => {
        if(Reports.length>0 && ShowMemberGt === false) {
            SetSavedGT(prevState => !prevState)
            if (Action === 'labels' && MakeReq) {
                SetLoadingLabels(true)

                axios.get("annotationlabel/user_labels", {params: {language:Language,report_id: Reports[Index].id_report.toString()}}).then(response => {SetMakeReq(false);setLabels_to_show(response.data[Action.toString()]);
                    SetLoadingLabels(false);



                })

            }
            else if (Action === 'concepts' && MakeReq){
                SetLoadingConcepts(true)
                axios.get("contains", {params: {language:Language,report_id: Reports[Index].id_report.toString()}}).then(response => {SetMakeReq(false);setSelectedConcepts(response.data);SetLoadingConcepts(false)})

            }
        }
    }, [Action,MakeReq]);

    useEffect(() => {
        // SetMentions_to_show(false)
        // SetAllMentions(false)
        // SetAssociations_to_show(false)
        SetHighlightMention(false)
        // SetColor(colori)
        console.log('provo highlight')

        if (Reports.length>0 && reportsString !== false) {
            // console.log('reportString',reportsString)


            if (Action === 'mentions' && MakeReq ) {

                SetLoadingMentions(true)
                axios.get("mention_insertion", {params: {language:Language,report_id: Reports[Index].id_report.toString()}}).then(response => {
                    var mentions = (response.data[Action.toString()])
                    console.log('mm',mentions)

                    SetMakeReq(false);
                    var ordered = order_array(mentions)
                    console.log('mm',ordered)

                    SetMentions_to_show(ordered);
                    SetLoadingMentions(false);

                })
            } else if (Action === 'concept-mention' && MakeReq){
                SetLoadingAssociations(true)
                axios.get("insert_link/linked", {params: {language:Language,report_id: Reports[Index].id_report.toString()}}).then(response => {SetAssociations_to_show(response.data['associations']);SetMakeReq(false);})
                axios.get("insert_link/mentions", {params: {language:Language,report_id: Reports[Index].id_report.toString()}}).then(response => {
                    var mentions = (response.data['mentions1']);
                    var ordered = order_array(mentions)
                    SetMakeReq(false);
                    SetAllMentions(ordered);
                    // console.log('allmentionsup',response.data['mentions1'])
                    SetLoadingAssociations(false)})
            }
        }


    }, [Action,reportsString,Index,MakeReq]);

    useEffect(()=>{
        console.log('provo agg makereq',MakeReq)
    },[MakeReq])

    useEffect(()=>{
        if(Reports.length > 0 && document.getElementById("report_sel") !== null){
            document.getElementById("report_sel").scroll(0, 0)
            if(Action === 'concept-mention'){
                if(document.getElementById("linked-list") !== null) {
                    document.getElementById("report_sel").scroll(0, 0)
                    document.getElementById("linked-list").scroll(0, 0)
                }

            }
            if(Action === 'mentions'){
                if(document.getElementById("mentions_list") !== null){
                    document.getElementById("report_sel").scroll(0, 0)
                    document.getElementById("mentions_list").scroll(0, 0)
                }


            }
        }

    },[Action, Index, Report])

    // useEffect(()=>{
    //     // console.log('user_lab_to_ims',LabToInsert)
    //     console.log('mentions',mentions_to_show)
    // },[mentions_to_show])

    useEffect(()=>{
        if(labels.length > 0){
            var user_checks = new Array(labels.length).fill(false)
            // console.log('labels_tot',labels)
            var array = []
            // labels_to_show.map(label=>{
            //     array.push(label.label)
            // })
            SetLabToInsert(labels_to_show)
            // console.log('lab_to_show',labels_to_show)
            // console.log('labels',labels)

            // var min_seq = 0
            // var min_seq = labels[0].seq_number
            // labels.map(lab=>{
            //     if(min_seq > lab.seq_number){
            //         min_seq = lab.seq_number
            //     }
            // })
            if(labels_to_show.length>0){
                SetRadioChecked(true)
                labels_to_show.map((lab) => {
                    var ind = labels.indexOf(lab)
                    // console.log('indice',ind)
                    user_checks[ind] = true
                    // console.log('checks:',user_checks)
                    })

                }
            else{
                SetRadioChecked(false)

            }
            setChecks(user_checks)
        }


    },[labels_to_show]);

    useEffect(()=>{
        const height = document.documentElement.scrollHeight
        // console.log('height',height)

        if(document.getElementById('spinnerDiv') !== null){
            // console.log('height',height)

            document.getElementById('spinnerDiv').style.height = height.toString() + 'px'

        }
    },[Start,LoadingReport,LoadingReportList])

    function sendUser(val){
        axios.post('update_user_chosen',{user_chosen:val}).then(response=>{
            console.log(response.data)
        }).catch(error=>console.log(error))
    }

    return (
        <div className="App">

            {/*{Annotation === '' && useCase === '' && Language === '' && Institute === '' && UseCaseList.length >= 0 && LanguageList.length >= 0 && InstituteList.length >=0 && <StartingMenu />}*/}
            {useCase === '' && Language === '' && Institute === '' && UseCaseList.length >= 0 && LanguageList.length >= 0 && InstituteList.length >=0 && <StartingMenu />}

                {(useCase !== '' && Language !== '' && Institute !== '' && (LoadingReportList)) ?
                    <div className='spinnerDiv'><Spinner animation="border" role="status"/></div> :
                    // <div className='spinnerDiv'><Spinner animation="border" role="status"/></div> :

                    <div >
                        {/*<div style={{'float':'left','padding':'10px','padding-left':'250px'}}><button className='menuButton' onClick={(e)=>handleBar(e)}><FontAwesomeIcon icon={faBars} size='2x' /></button></div>*/}
                        <Container fluid>
                            {ShowBar && <SideBar />}
                            {ShowSnackMention && <SnackBarMention message = {SnackMessage} />}
                            {ShowSnack && <SnackBar message = {SnackMessage} />}

                            {Institute !== '' && Annotation !== '' && Language !== '' && useCase !== '' && BatchNumber !== '' && InstituteList.length >= 0 && LanguageList.length >=0 && UseCaseList.length >= 0 && Reports.length >= 0 && <div><SelectMenu />
                                <div><hr/></div></div>

                            }
                            {/*<div>{Institute}</div>*/}
                            {/*<div>{Language}</div>*/}
                            {/*<div>{useCase}</div>*/}
                            {/*<div>{BatchNumber}</div>*/}
                            {/*<div>{FieldsToAnn.toString()}</div>*/}
                            {/*<div>{Fields.toString()}</div>*/}
                            {/*<div>{Reports.length}</div>*/}
                            {(Institute !== '' && Language !== '' && useCase !== '' && BatchNumber !== '' && FieldsToAnn !== false && Fields !== false && Reports.length > 0) && <Row className='row_container'>
                                <Col md={6}>

                                    {/*{Reports.length >0 && <div className='first_row_container' ><span className='reportListStyle'>REPORT </span><span><ReportSelection /></span>&nbsp;&nbsp;<span ><NextPrevButtons /></span></div>}*/}

                                    {Reports.length >0 && <div >
                                        {(LoadingReport) ? <Spinner animation="border" role="status"/> : <ReportListUpdated report_id = {Reports[Index].id_report} report = {Reports[Index].report_json} action={Action}/>}</div> }
                                </Col>



                                <Col md={1}></Col>

                                <Col md={5}>
                                    {FieldsToAnn !== false && Concepts !== false  && labels !== false && <div style={{'text-align':'center'}}><Buttons /></div>}

                                    {ShowAutoAnn === false && ShowMemberGt === false && Action !== 'none' && Annotation === 'Manual' && <div >This is <b>your</b> annotation</div>}
                                    {ShowAutoAnn === false && ShowMemberGt === false && Action !== 'none' && Annotation === 'Automatic' && <div >This is <b>your</b> automatic annotation</div>}
                                    {ShowAutoAnn === true && ShowMemberGt === false && Action !== 'none' && <div >This is <b>Robot</b>'s annotation <b>(read only)</b> </div>}
                                    {ShowAutoAnn === false && ShowMemberGt === true && Action !== 'none' && Annotation === 'Manual' && <div >This is <b>{ChosenUser}</b>'s annotation <b>(read only)</b> <button onClick={()=>SetShowChangeUserModal(true)} style={{border:'none',backgroundColor:'white'}}> <FontAwesomeIcon icon={faExchangeAlt} /></button> </div>}
                                    {ShowAutoAnn === false && ShowMemberGt === true && Action !== 'none' && Annotation === 'Automatic' && <div >This is <b>{ChosenUser}</b>'s automatic annotation <b>(read only)</b> <button onClick={()=>SetShowChangeUserModal(true)} style={{border:'none',backgroundColor:'white'}}> <FontAwesomeIcon icon={faExchangeAlt} /></button> </div>}
                                    <Modal show={ShowChangeUserModal} onHide={()=>SetShowChangeUserModal(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Change Team Member</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                           <div>The button <FontAwesomeIcon icon={faUserEdit} /> allows you to see how one of your team members annotated the document you are reading. Select the team member you want to view the ground-truths of. If you have never changed the team member before, the default member is the admin.
                                           </div>
                                            <div style={{'padding-left':'1%','padding-right':'1%'}}><Form.Control as="select" ref={us} defaultValue="Choose a team member..." onChange={(e)=>{us.current = e.target.value}}>
                                                <option value = ''>Select a team member...</option>
                                                {UsersList.map(val=>
                                                    <option value ={val}>{val}</option>
                                                )}
                                            </Form.Control></div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button disabled={us.current === ''} variant="primary" onClick={(e)=>{sendUser(us.current);SetShowChangeUserModal(false);SetUserChosen(us.current)}}>
                                                Confirm
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>

                                    {Action === 'labels' && <div className='first_container_right'>
                                        {(LoadingLabels || LoadingReport || LoadingChangeGT) ? <Spinner animation="border" role="status"/> : <div>
                                            {Reports.length >0  &&

                                            <LabelList labels={labels} report_id = {Reports[Index].id_report} />

                                            }

                                        </div>}
                                        <SubmitButtons token={'annotation'} token_prev={'annotation_prev'} token_next = {'annotation_next'}/>

                                    </div>}
                                    {Action === 'mentions' && <div className='first_container_right'>

                                        {(LoadingMentions || LoadingReport || LoadingChangeGT) ? <Spinner animation="border" role="status"/> :
                                            <>
                                                {/*{Reports.length > 0 && mentions_to_show !== false && <MentionList />}*/}
                                                {/*<PassageContext.Provider value={{showlabels:[ShowLabelsOpts,SetShowLabelsOpts]}}>*/}
                                                {Reports.length > 0 && mentions_to_show !== false && <PassageLabelsList />}
                                                {/*</PassageContext.Provider>*/}



                                            </>

                                        }
                                        <SubmitButtons token={'mentions'} token_prev={'mentions_prev'}
                                                       token_next={'mentions_next'}/>

                                    </div>}
                                    {Action === 'concept-mention' && <div className='first_container_right'>
                                        {(LoadingAssociations || LoadingReport || LoadingChangeGT) ? <Spinner animation="border" role="status"/> :
                                            <div>
                                                <LinkedContext.Provider value={{mountForm:[MountForm,SetMountForm], enable_select: [Enable, SetEnable], conceptchosen:[ConceptChosen, SetConceptChosen], area:[Area,SetArea], show:[Show,SetShow]}}>

                                                    {Reports.length >0 && AllMentions !== false && associations_to_show !== false && <LinkedList />}

                                                </LinkedContext.Provider>

                                            </div>

                                        }
                                        <SubmitButtons token={'linked'} token_prev={'linked_prev'} token_next={'linked_next'} />

                                    </div>}
                                    {Action === 'concepts' && <div className='first_container_right'>
                                        {(LoadingConcepts || LoadingReport || LoadingChangeGT) ? <Spinner animation="border" role="status"/> :
                                            <div>
                                                <ConceptContext.Provider value={{currentSemanticArea, setCurrentSemanticArea, selectedOption, setSelectedOption}}>

                                                    <ConceptsContainer />

                                                </ConceptContext.Provider>

                                            </div>

                                        }
                                        <SubmitButtons token={'concepts'} token_prev={'concepts_prev'} token_next={'concepts_next'} />

                                    </div>}





                                    {Action === '' && <h2>Please, choose an annotation type.</h2>}
                                    {Action === 'none' && AskUpdate === false && <div><h5>This is the default configuration. Choose an annotation type and start the annotation.</h5></div>}
                                    {AskUpdate === true && Action === 'none' && <div><h5>It seems that you did not inserted labels, concepts and fields to annotate for this use case. Please update the configuration in order to start the annotation.</h5></div>}


                                </Col>
                            </Row>}
                            {NoReports === true && <div style={{margin:'2%',textAlign:'center'}}><h4>No documents found for this configuration.</h4></div>}

                            {/*{!Start && Reports.length === 0 && <div><h5>There are not reports which correspond to this configuration. Please change it.</h5></div>}*/}


                        </Container>
                    </div>}




            {/*</AppContext.Provider>*/}


        </div>
    );
}


export default BaseIndex;
