import './App.css';
import ReactDOM from "react-dom";
import React, {useState, useEffect, useContext, createContext} from "react";
import axios from "axios";
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import {Redirect, useHistory} from "react-router-dom";

// import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './components/General/first_row.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import StartingMenu from "./components/SelectMenu/StartingMenu";
import BaseIndex from "./BaseIndex";
import Tutorial from "./components/SideComponents/Tutorial";
import Credits from "./components/SideComponents/Credits";
import MyStats from "./components/SideComponents/MyStats";
import Spinner from "react-bootstrap/Spinner";
// import ReportsStats from "./components/SideComponents/ReportsStats";
import ReportsStats from "./components/ReportStatistics/ReportsStats";
import InfoAboutConfiguration from "./components/MedConfiguration/InfoAboutConfiguration";
import Configure from "./components/MedConfiguration/Configure";
import UpdateConfiguration from "./components/MedConfiguration/UpdateConfiguration";
import MembersStats from "./components/SideComponents/MembersStats";
import ConfigureResult from "./components/MedConfiguration/ConfigureResult";
import UploadFile from "./components/SideComponents/UploadFile";
import Prova_BaseIndex from "./Prova_BaseIndex";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.baseURL = window.baseurl;


export const AppContext = createContext('')

function App() {
    const [ClickedCheck, SetClickedCheck] = useState(false)
    const [selectedOption, setSelectedOption] = useState('');
    const [RemovedConcept,SetRemovedConcept] = useState(false);
    const [AnnotatedIndexList,SetAnnotatedIndexList] = useState([])
    const [SelectOptions,SetSelectOptions] = useState([]);
    const [OrderVar, SetOrderVar] = useState('lexic');
    const [Admin, SetAdmin] = useState('');
    const [ShowSnack, SetShowSnack] = useState(false)
    const [ShowSnackMention, SetShowSnackMention] = useState(false)
    const [SnackMessage, SetSnackMessage] = useState('This action removes this concept from concepts list. If you want to keep this concept go to Concepts and' +
        ' add it manually.')
    const [SnackMessageMention, SetSnackMessageMention] = useState('This action removes also the concepts you linked to this passage. If you want to keep these concepts go to Concepts and' +
        ' add them manually.')
    const [LabToInsert,SetLabToInsert] = useState([])
    const [LinkingConcepts,SetLinkingConcepts] = useState([])
    const [change, setChange] = useState(false)
    const [useCase,SetUseCase] = useState('')
    const [Language,SetLanguage] = useState('')
    const [Institute,SetInstitute] = useState('')
    const [UseCaseList,SetUseCaseList] = useState(false);
    const [LanguageList,SetLanguageList] = useState(false);
    const [InstituteList,SetInstituteList] = useState(false);
    const [ShowModal,SetShowModal] = useState(false)
    const [ShowModalDownload,SetShowModalDownload] = useState(false)
    const [UpdateMenu,SetUpdateMenu] = useState(false)
    const [Action, SetAction] = useState(false)
    const [WordMention, SetWordMention] = useState([])
    const [Mention, SetMention] = useState('')
    const [Outcomes,SetOutcomes] = useState([])
    const [UsersListAnnotations,SetUsersListAnnotations] = useState([])
    const [ReloadMentions,SetReloadMentions] = useState(false)
    const [labels, setLabels] = useState(false)
    const [index, setIndex] = useState(0)
    const [TopicIndex, SetTopicIndex] = useState(0)
    const [report, setReport] = useState('')
    const [reports, setReports] = useState(false)
    const [reportsString, setReportsString] = useState(false)
    const [Children, SetChildren] = useState([])
    const colori = ['green','red','orange','royalblue'];
    const [Color,SetColor] = useState(colori)
    const [Rows,SetRows] = useState([])
    //const [Color,SetColor] = useState(['red','green'])
    const [labels_to_show, setLabels_to_show] = useState([])
    const [ColorWords,SetColorWords] = useState(false)
    const [mentions_to_show, SetMentions_to_show] = useState(false) //modified 3092021 prima era false
    const [associations_to_show,SetAssociations_to_show] = useState(false)//modified 3092021 prima era false
    const [AllMentions, SetAllMentions] = useState([])
    const [checks, setChecks] = useState([])
    const [FinalCount, SetFinalCount] = useState(0)
    const [FinalCountReached, SetFinalCountReached] = useState(false)
    const [RadioChecked, SetRadioChecked] = useState(false)
    const [SemanticArea, SetSemanticArea] = useState([])
    const [Concepts, SetConcepts] = useState(false)
    const [HighlightMention, SetHighlightMention] = useState(false)
    const [ArrayInsertionTimes,SetArrayInsertionTimes] = useState([])
    const [SavedGT,SetSavedGT] = useState(false)
    const [ShowBar,SetShowBar] = useState(false)
    const [Disabled_Buttons, SetDisable_Buttons] = useState(false)
    const [Username, SetUsername] = useState('')
    // State for each ConceptList
    const [MakeReq,SetMakeReq] = useState(false)
    const [ShowErrorSnack, SetShowErrorSnack] = useState(false);
    const [ShowConceptModal, SetShowConceptModal] = useState(false)
    const [selectedConcepts, setSelectedConcepts] = useState({"Diagnosis":[], "Anatomical Location":[], "Test":[], "Procedure":[], "General Entity":[] })
    const [Start,SetStart] = useState(false)
    const [LoadingMenu, SetLoadingMenu] = useState(false)
    const [Fields,SetFields] = useState(false)
    const [FieldsToAnn,SetFieldsToAnn] = useState(false)
    const [LoadingLabels, SetLoadingLabels] = useState(false);
    const [LoadingConcepts, SetLoadingConcepts] = useState(false)
    const [LoadingMentions, SetLoadingMentions] = useState(false)
    const [LoadingMentionsColor, SetLoadingMentionsColor] = useState(true)
    const [LoadingAssociations, SetLoadingAssociations] = useState(false)
    const [LoadingReport, SetLoadingReport] = useState(false)
    const [LoadingReportList, SetLoadingReportList] = useState(false)
    const [Profile,SetProfile] = useState('')
    const [Annotation,SetAnnotation] = useState('')
    const [ShowAnnotationsStats,SetShowAnnotationsStats] = useState(false)
    const [showReportText,SetshowReportText] = useState(false);
    const [ShowAutoAnn,SetShowAutoAnn] = useState(false)
    const [ShowMemberGt,SetShowMemberGt] = useState(false)
    const [ShowMajorityGt,SetShowMajorityGt] = useState(false)
    const [UserChosen,SetUserChosen] = useState(false)
    const [ShowMajorityModal,SetShowMajorityModal] = useState(false)
    const [ShowMajorityGroundTruth,SetShowMajorityGroundTruth] = useState(false)
    const [ReportType,SetReportType] = useState(false)
    const [UsersList,SetUsersList] = useState([])
    const [BatchNumber,SetBatchNumber] = useState('')
    const [UpdateSingleReport,SetUpdateSingleReport] = useState(false)
    const [LoadingChangeGT,SetLoadingChangeGT] = useState(false)
    const [SelectedLang,SetSelectedLang] = useState('')
    const [ShowLabelsOpts,SetShowLabelsOpts] = useState([])
    const [TokenToColor,SetTokenToColor] = useState(false)
    const [Top_K,SetTop_K] = useState(10)
    const [TopicInfo,SetTopicInfo] = useState({})
    // const [ShowSnackReport,SetShowSnackReport] = useState(false);


    useEffect(()=>{
        if(ShowBar){
            SetShowBar(false)
        }
        SetLoadingMenu(true)
        axios.get("get_usecase_inst_lang").then(response => {
            console.log('usecaselist',response.data['usecase'])
            console.log('languagelist',response.data['language'])
            console.log('institutelist',response.data['institute'])
            SetUseCaseList(response.data['usecase']);
            SetLanguageList(response.data['language']);
            SetInstituteList(response.data['institute']);

        })
        //SetLoadingMenu(false)

        axios.get("get_admin").then(response => {
            SetAdmin(response.data['admin'])

        })
        // axios.get("get_fields").then(response => {SetFields(response.data['fields']);SetFieldsToAnn(response.data['fields_to_ann']);})
        // axios.get("get_semantic_area").then(response => SetSemanticArea(response.data['area']))
        // axios.get("conc_view").then(response => {SetConcepts(response.data['concepts'])})
        // axios.get("annotationlabel/all_labels").then(response => {
        //     setLabels(response.data['labels'])
        // })

        SetOrderVar('lexic')
        var username = window.username
        var profile = window.profile
        console.log('username', username)
        console.log('profile', profile)
        SetUsername(username)
        SetProfile(profile)
        window.scrollTo(0,0)


        axios.get("get_users_list")
            .then(response => {
                if(response.data.length>0){
                    console.log(response.data)
                    SetUsersList(response.data)
                }})
            .catch(error=>{
                console.log(error)
            })



    },[])

    useEffect(()=>{
        if(UseCaseList.length > 0 && useCase !== ''){
            SetTopicIndex(UseCaseList.indexOf(useCase))
        }
    },[UseCaseList,useCase])

    useEffect(()=>{
        // console.log('prima entrata in parametri')
        axios.get("get_session_params").then(response => {
            SetInstitute(response.data['institute']);
            SetLanguage(response.data['language']);
            SetUseCase(response.data['usecase']);
            SetAnnotation(response.data['annotation']);
            SetReportType(response.data['report_type']);
            SetUserChosen(response.data['team_member'])
            SetBatchNumber(response.data['batch'])
            SetTop_K(response.data['top_k'])

            console.log((response.data['institute']));
            console.log((response.data['language']));
            console.log((response.data['usecase']));
            console.log('team',response.data['team_member'])
            console.log((response.data['annotation']));
            console.log((response.data['report_type']));

            SetLoadingMenu(false)


        })


    },[])

    useEffect(()=>{
        if(useCase !== ''){
            axios.get('get_topic_info',{params:{topic:useCase}}).then(response=>{SetTopicInfo(response.data)}).catch(error=>console.log(error))
        }
    },[useCase])


    return (
        <div className="App">
            <AppContext.Provider value={{
                // showSnackReport:[ShowSnackReport,SetShowSnackReport],
                userslist:[UsersList,SetUsersList],topk:[Top_K,SetTop_K],usersListAnnotations:[UsersListAnnotations,SetUsersListAnnotations],
                tokentocolor:[TokenToColor,SetTokenToColor],colorword:[ColorWords,SetColorWords],showlabels:[ShowLabelsOpts,SetShowLabelsOpts],topicindex:[TopicIndex,SetTopicIndex],makereq:[MakeReq,SetMakeReq],selectedLang:[SelectedLang,SetSelectedLang],loadingChangeGT:[LoadingChangeGT,SetLoadingChangeGT],updateSingle:[UpdateSingleReport,SetUpdateSingleReport],batchNumber:[BatchNumber,SetBatchNumber],usersList:[UsersList,SetUsersList],tablerows:[Rows,SetRows],report_type:[ReportType,SetReportType],showmajoritygt:[ShowMajorityGroundTruth,SetShowMajorityGroundTruth],
                showmajoritymodal:[ShowMajorityModal,SetShowMajorityModal],userchosen:[UserChosen,SetUserChosen],showmember:[ShowMemberGt,SetShowMemberGt],showmajority:[ShowMajorityGt,SetShowMajorityGt],showautoannotation:[ShowAutoAnn,SetShowAutoAnn],showreporttext:[showReportText,SetshowReportText],showannotations:[ShowAnnotationsStats,SetShowAnnotationsStats],annotation:[Annotation,SetAnnotation],profile:[Profile,SetProfile],clickedCheck:[ClickedCheck, SetClickedCheck],loadingLabels:[LoadingLabels, SetLoadingLabels],loadingMentions:[LoadingMentions, SetLoadingMentions],loadingColors:[LoadingMentionsColor, SetLoadingMentionsColor],loadingAssociations:[LoadingAssociations, SetLoadingAssociations],loadingConcepts:[LoadingConcepts, SetLoadingConcepts],loadingReport:[LoadingReport, SetLoadingReport],loadingReportList:[LoadingReportList, SetLoadingReportList],
                conceptOption:[selectedOption, setSelectedOption],removedConcept:[RemovedConcept,SetRemovedConcept],indexList:[AnnotatedIndexList,SetAnnotatedIndexList],reportArray:[SelectOptions,SetSelectOptions],orderVar:[OrderVar,SetOrderVar],fields:[Fields,SetFields],fieldsToAnn:[FieldsToAnn,SetFieldsToAnn],topicinfo:[TopicInfo,SetTopicInfo],
                admin:[Admin, SetAdmin],showSnackMessage:[SnackMessage,SetSnackMessage],showSnack:[ShowSnack, SetShowSnack], labelsToInsert:[LabToInsert,SetLabToInsert],start:[Start,SetStart],changeConceots:[change,setChange],username:[Username,SetUsername],showOptions:[ShowModal,SetShowModal],language:[Language,SetLanguage],institute:[Institute, SetInstitute], usecase:[useCase,SetUseCase],outcomes:[Outcomes,SetOutcomes],semanticArea:[SemanticArea,SetSemanticArea],concepts:[Concepts,SetConcepts],reportString:[reportsString,setReportsString],radio:[RadioChecked, SetRadioChecked],finalcount:[FinalCount,SetFinalCount],reached:[FinalCountReached,SetFinalCountReached],
                index:[index,setIndex],showbar:[ShowBar,SetShowBar], tokens:[Children,SetChildren],report:[report,setReport],reports:[reports, setReports],insertionTimes:[ArrayInsertionTimes,SetArrayInsertionTimes],userLabels:[labels_to_show, setLabels_to_show],labelsList:[labels,setLabels],checks:[checks,setChecks],highlightMention:[HighlightMention, SetHighlightMention],updateMenu:[UpdateMenu,SetUpdateMenu],usecaseList: [UseCaseList,SetUseCaseList],languageList:[LanguageList,SetLanguageList],
                instituteList: [InstituteList,SetInstituteList],save:[SavedGT,SetSavedGT],disButton:[Disabled_Buttons,SetDisable_Buttons],selectedconcepts:[selectedConcepts, setSelectedConcepts],conceptModal:[ShowConceptModal, SetShowConceptModal],linkingConcepts:[LinkingConcepts,SetLinkingConcepts],errorSnack:[ShowErrorSnack, SetShowErrorSnack],reload:[ReloadMentions,SetReloadMentions],
                mentionToAdd:[Mention,SetMention],showDownload:[ShowModalDownload,SetShowModalDownload],showSnackMessageMention:[SnackMessageMention, SetSnackMessageMention],showSnackMention:[ShowSnackMention,SetShowSnackMention],associations:[associations_to_show,SetAssociations_to_show], mentionsList:[mentions_to_show,SetMentions_to_show], allMentions:[AllMentions, SetAllMentions],action:[Action,SetAction], mentionSingleWord:[WordMention, SetWordMention],color:[Color,SetColor]}}
            >
                <Router>
                    <div>

                        <Switch>

                            <Route path="/index">
                                {(LoadingMenu) ? <div className='spinnerDiv'><Spinner animation="border" role="status"/></div> : <Prova_BaseIndex />}
                            </Route>

                           <Route path="/credits">
                                <Credits />
                            </Route>

                            <Route path="/tutorial">
                                <Tutorial />
                            </Route>
                            <Route path="/my_stats">

                                <MyStats />
                            </Route>
                            <Route path="/infoAboutConfiguration">

                                <InfoAboutConfiguration />
                            </Route>
                            <Route path="/configure">

                                <Configure />
                            </Route>
                            <Route path="/updateConfiguration">

                                <UpdateConfiguration />
                            </Route>

                            <Route path="/team_members_stats">

                                <MembersStats />
                            </Route>
                            <Route path="/reports_stats">

                            <ReportsStats />
                            </Route>
                            <Route path="/uploadFile">

                                <UploadFile />
                            </Route>



                        </Switch>
                    </div>
                </Router>

            </AppContext.Provider>
        </div>
    );
}


export default App;
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);