import '../../App.css';
import {AppContext} from '../../App';
import React, {useState, useEffect, useContext, createContext} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import {Container,Row,Col} from "react-bootstrap";

import '../General/first_row.css';

import SelectMenu from "../SelectMenu/SelectMenu";

import SideBar from "../General/SideBar";
import axios from "axios";
import Button from "react-bootstrap/Button";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faExclamationTriangle,
    faGlasses, faHospital,
    faList, faMicroscope, faUser, faCogs, faBars, faFlag, faCircle,
    faPalette, faLanguage,
    faPencilAlt,
    faPlusCircle, faSave, faExchangeAlt, faUserEdit, faRobot,
    faTimesCircle, faCheckSquare, faMousePointer, faProjectDiagram, faTimes, faDownload, faEdit
} from "@fortawesome/free-solid-svg-icons";
import {green} from "@material-ui/core/colors";
import Spinner from "react-bootstrap/Spinner";


function Tutorial() {


    const { showbar,username,usecaseList,reports,languageList,instituteList } = useContext(AppContext);

    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [Aux,SetAux] = useState(false)
    const [ShowBar,SetShowBar] = showbar;
    const [Username,SetUsername] = username;
    const [Reports,SetReports] = reports;

    const [ShowConceptsTutorial,SetShowConceptsTutorial] = useState(false)
    const [ShowLabelsTutorial,SetShowLabelsTutorial] = useState(false)
    const [ShowMentionsTutorial,SetShowMentionsTutorial] = useState(false)
    const [ShowLinkingTutorial,SetShowLinkingTutorial] = useState(false)

    useEffect(()=>{
        // console.log('SHOWBAR',ShowBar)

        axios.get("http:/0.0.0.0:8000/get_usecase_inst_lang").then(response => {
            SetUseCaseList(response.data['usecase']);
            SetLanguageList(response.data['language']);
            SetInstituteList(response.data['institute']);

        })
        var username = window.username
        // console.log('username', username)
        SetUsername(username)

    },[])

    return (
        <div className="App">




            <div >
                {/*<div style={{'float':'left','padding':'10px','padding-left':'250px'}}><button className='menuButton' onClick={(e)=>handleBar(e)}><FontAwesomeIcon icon={faBars} size='2x' /></button></div>*/}
                <Container fluid>
                    {ShowBar && <SideBar />}
                    {(InstituteList.length >= 0 && LanguageList.length >=0 && UseCaseList.length >= 0) ? <div><SelectMenu />
                        <div><hr/></div>


                    <div className='Tutorial'>
                        <div style={{'text-align':'center'}}><h2>TUTORIAL</h2>
                        <h6>In this section we explain in details how DocTAG works, its main components and how you can create your own ground-truths.</h6>
                        {/*<div>In the video below Gianmaria Silvello introduces you ExaTAG and its features. </div>*/}
                        {/*<video style={{'margin-top':'20px'}} width="60%"  controls src="http://examode.dei.unipd.it/exatag/static/videos/DocTAG_tutorial_brief.mp4" />*/}
                        <hr/>
                        </div>
                        <div>
                            <div>When you log in, you are asked to choose a <i>Topic</i> and a <i>Document Type</i> (if both PubMED articles and other documents coexist). Then, according to this configuration, you will be provided with a set of reports to annotate.</div>
                        <div>If it is the first time you log in, and you have never annotated a report, you will be asked to choose an annotation type between <i>Labels, Linking, Passages, Concepts.</i></div>
                        <div>If you have already annotated some documents for the configuration you selected, you will be provided with the last ground-truth you created.</div>
                        <hr/>
                            <div>The first time you try DocTAG, you run in TEST mode. The database is populated with a sample of data which allow you to try the application and to understand how the annotations work. In order to change the configuration, and populate the database with your data, you can open the side menu clicking on <FontAwesomeIcon icon={faBars}/> and select <i>Configuration</i>. Then, a list of instructions is displayed: follow them and at the end you can start annotating your own documents.
                                <div><span style = {{'font-weight':'bold'}}>NOTE: </span><span>You can change configuration only if you are the admin of DocTAG. If you are not, the <i>Configure</i> option will not be present in the side menu.</span></div>
                                <div>If you are interested in how to configure DocTAG, please, <a href='infoAboutConfiguration'>click here</a>.</div>
                            </div>

                        <hr/>
                        <div>In the home screen you can find three main components explained below.</div>
                            <h5>The Menu</h5>
                            <div>This is located at the top of the page and it includes:
                                <ul className="fa-ul">
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faBars}/></span>
                                        The side menu where you can find the <i>Configure, Credits, Tutorial, Home, DocTAG stats, My Stats, Members stats, Upload/Transfer annotations</i> sections.
                                    </li>
                                    <li>
                                        The <i>Topic</i>, the <i>Total</i> number of documents for that topic, the number of <i>Annotated</i> documents for the <i>Annotation type</i> chosen.</li>
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faUser}/></span>
                                        Your username and the <i>Logout</i> button.
                                    </li>
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faDownload}/></span>
                                        Clicking on <span > <Button id='conf' style={{'padding':'0','font-size':'10px','height':'25px','width':'76px'}} variant='info'> <FontAwesomeIcon icon={faDownload} /> Download</Button></span>&nbsp;
                                        you can download your ground-truths according to the configuration you prefer. You can download your ground-truths in: JSON or CSV The key file describes the semantics of tags.
                                    </li>
                                    <li><span className="fa-li"><FontAwesomeIcon icon={faUser}/><FontAwesomeIcon icon={faUserEdit}/></span>
                                        These buttons positioned between the <i>CLEAR</i> and <i>SAVE</i> buttons allow you to be provided with the annotation of a team member you can choose (by default, every time you log in you are provided with the ground truth of the admin, you can change the team member clicking on: <FontAwesomeIcon icon={faExchangeAlt}/>.</li>

                                </ul>

                            </div>
                            <hr/>
                            <h5>The Topic</h5>
                            <div>On your left you can find some information about the topic you chose. The information provided for a topic (if any) are:
                                <ul>
                                    <li><span className='tutorial_li'>Topic's title</span> </li>
                                    <li><span className='tutorial_li'>Topic's description</span>.</li>
                                    <li><span className='tutorial_li'>Topic's narrative</span>: the narrative is displayed in a modal.</li>

                                </ul>
                            <h5>The Document</h5>
                            <div>On your left you can find the document to annotate. If you are running in the test mode instead, the fields are those of the reports we provided.<br/>The three fields below are always displayed.
                            <ul>
                                <li><span className='tutorial_li'>Documents' order</span>: you can choose between the <i>lexicographical order</i> of your reports' ids and the <i>annotated reports' order</i>, that is a list which contains in the first positions the reports you have not annotated yet and, in the last positions, all the reports you have already annotated.</li>
                                <li><span className='tutorial_li'>Last update</span>: the date and the time related to the creation of the ground-truth for the examined report and the selected annotation type .</li>
                                <li><span className='tutorial_li'>document's id</span>: the document's identifier, displayed in the selected bar next to DOCUMENT title.</li>

                            </ul>
                                <div>If you want to jump to a precise topic, go to the bar next to the DOCUMENT title and select the one you prefer. The reports you have not annotated yet are in <span style={{'font-weight':'bold'}}>bold face</span>.</div>
                            </div>
                            <hr/>

                            <h5>The Annotation types</h5>
                            <div>You can annotate the reports in four different ways (which we usually call <i>annotation typess</i>):</div>

                            <div>
                                <ul>
                                    <li>
                                        <span className='tutorial_li'>Labels</span>: You are asked to choose one or more labels that can
                                        correctly categorize the document examined. <Button size = 'sm' variant='outline-info' onClick={()=>SetShowLabelsTutorial(prev=>!prev)}>Click here</Button> to see how to associate one or more labels to a document.
                                        {ShowLabelsTutorial && <div>
                                            <ul className="fa-ul tutorial-ul">
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faGlasses}/></span>
                                                    Read the document on your left.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faList}/></span> On your right the list of labels is displayed.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faCheckSquare}/></span>Click on the label that fits the document on your left best.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>The <span style={{'color':'red'}}>CLEAR</span> button will remove the label you assigned.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faSave}/></span>Your changes will be saved clicking on <span style={{'color':'green'}}>SAVE</span> button, changing annotation type or
                                                    going to the previous or next document or topic.
                                                </li>
                                            </ul>
                                        <hr/>
                                        </div>}
                                    </li>
                                    <li>
                                        <span className='tutorial_li'>Linking</span>: You are asked to associate to each mention you found a concept. If it is the case,
                                         you can also add new mentions. <Button size = 'sm' variant='outline-info' onClick={()=>SetShowLinkingTutorial(prev=>!prev)}>Click here</Button> to see how to perform <i>Linking</i>.
                                        {ShowLinkingTutorial && <div>
                                            <ul className="fa-ul tutorial-ul">
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
                                            </ul><hr/>
                                        </div>}

                                    </li>
                                    <li>
                                        <span className='tutorial_li'>Passages</span>: You are asked to find new passages in the document you are reading and associate to each passage a label. <Button size = 'sm' variant='outline-info' onClick={()=>SetShowMentionsTutorial(prev=>!prev)}>Click here</Button> to see how to find new passages.
                                        {ShowMentionsTutorial && <div>
                                            <ul className="fa-ul tutorial-ul">
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
                                        <hr/></div>}
                                    </li>
                                    <li>
                                        <span className='tutorial_li'>Concepts</span>: You are asked to find a set of concepts which can be associated to the report you are reading. <Button size = 'sm' variant='outline-info' onClick={()=>SetShowConceptsTutorial(prev=>!prev)}>Click here</Button> to see how to associate one or more concepts to a report.
                                        {ShowConceptsTutorial && <div>
                                            <ul className="fa-ul tutorial-ul">
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faGlasses}/></span>
                                                    Read the document on your left.
                                                </li>

                                                <li><span className="fa-li"><FontAwesomeIcon icon={faPlusCircle}/></span>Choose a concept.
                                                </li>

                                                <li><span className="fa-li"><FontAwesomeIcon icon={faMousePointer}/></span>Click on a concept of the list to have more information about it.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faSave}/></span>Your changes will be saved clicking on <span style={{'color':'green'}}>SAVE</span> button, changing annotation type or
                                                    going to the previous or next document or topic.
                                                </li>
                                                <li><span className="fa-li"><FontAwesomeIcon icon={faTimesCircle}/></span>Click on the <FontAwesomeIcon icon={faTimesCircle}/> next to the concept to remove it from the list.
                                                    Click on <span style={{'color':'red'}}>CLEAR</span> to remove the entire list instead.
                                                </li>
                                            </ul><hr/>
                                        </div>}
                                    </li>

                                </ul>
                            </div>
                            <hr/>
                            <div>
                                <h5>PubMed integration</h5>
                                <div>You can upload one or more sets of PubMed articles, the only information about articles we ask you to provide is the PubMed ID associated to the article.
                                </div>
                            </div>
                            {/*<div>*/}
                            {/*    <h5>Annotation mode</h5>*/}
                            {/*    <div>There are two annotation mode:*/}
                            {/*   <ul>*/}
                            {/*       <li><b>MANUAL ANNOTATION</b>: You can annotate the reports the administrator uploaded and find the labels, concepts, mentions and concept-mention associations (linking) creating your own ground-truths. </li>*/}
                            {/*       <li><b>AUTOMATIC ANNOTATION</b>: Automatic annotation is based on an algorithm which automatically annotate the reports. The algorithm assigns a set of labels, mentions, concept-mention associations and concepts to the reports your administrator uploaded (or to PubMed reports). you can check the algorithm's ground-truth of a report in every moment.*/}
                            {/*           <div>If you are the administrator bare in mind that Automatic annotation is available for: <b>colon, uterine cervix, lung</b> use cases and for <b>english</b> reports (and PubMed articles). Automatic annotation works with labels and concepts belonging to <a href='https://www.examode.eu/'>EXAMODE</a> we provide; this process can take a lot of time depending on how many reports you want to annotate and how powerful your machine is. If you want to automatically annotate your reports or get some more information click <a href='infoAboutConfiguration'>here</a></div>*/}
                            {/*       </li>*/}
                            {/*   </ul> </div>*/}
                            </div><hr/>
                            <h5>Please, pay attention to the following points.</h5>
                            <div>
                                <ul>
                                    {/*<li>*/}
                                    {/*    The mentions that you annotate and that you can visualize in the mentions list in <i>Mentions</i>*/}
                                    {/*    and <i>Linking</i> actions <span style={{'text-decoration':'underline'}}>include</span> the punctuation.*/}
                                    {/*    By the way, in the JSON serialization of your ground-truths the punctuation has been removed from the mentions' texts.*/}
                                    {/*</li>*/}
                                    <li>
                                        If you do not logout before leaving DocTAG, the next time you open DocTAG the last configuration will be restored. If you do not want to be provided with your previous configuration, please logout before leaving.
                                    </li>
                                    <li>
                                        Use Chrome to have the best experience.
                                    </li>

                                </ul>
                            </div>

                        </div>
                    </div>
                    </div> : <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}

                    </Container>
            </div>

        </div>
    );
}


export default Tutorial;
