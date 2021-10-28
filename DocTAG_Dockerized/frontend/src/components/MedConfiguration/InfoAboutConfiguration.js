import '../../App.css';
import {AppContext} from '../../App';
import React, {useState, useEffect, useContext, createContext} from "react";
import '../SideComponents/compStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import {Container,Row,Col} from "react-bootstrap";
import Button from "react-bootstrap/Button";

import '../General/first_row.css';

import SelectMenu from "../SelectMenu/SelectMenu";

import SideBar from "../General/SideBar";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import {faBars, faDownload, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import {Link,Redirect} from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";

function InfoAboutConfiguration() {
    const { admin,showbar,username,usecaseList,reports,languageList,instituteList } = useContext(AppContext);

    var FileDownload = require('js-file-download');


    const [Redir, SetRedir] = useState(false);
    const [UpdateConfiguration, SetUpdateConfiguration] = useState(false);
    const [ShowBar,SetShowBar] = showbar;
    const [Admin,SetAdmin] = admin;
    const [Username,SetUsername] = username;
    const [GroundTruthList,SetGroundTruthList] = useState([])
    const [ShowModalSure,SetShowModalSure] = useState(false)
    const [ShowModalMissing,SetShowModalMissing] = useState(false)
    const [ShowGenSection,SetShowGenSection] = useState(false)
    const [ShowCSVSection,SetShowCSVSection] = useState(false)
    const [ShowExSection,SetShowExSection] = useState(false)


    function handleBar(e){
        SetShowBar(prevState => !prevState)
    }
    useEffect(()=>{
        window.scrollTo(0, 0)

    },[])
    function handleCloseMissing(){
        SetShowModalMissing(false)
        SetRedir(true)
    }
    function onSaveExample(e,token){
        e.preventDefault()
        axios.get('http://0.0.0.0:8000/download_examples', {params:{token:token}})
            .then(function (response) {
                if(token === 'reports'){
                    FileDownload((response.data), 'reports_example.csv');
                }
                else if(token === 'concepts'){
                    FileDownload((response.data), 'concepts_example.csv');
                }
                else if(token === 'labels'){
                    FileDownload((response.data), 'labels_example.csv');
                }
                else if(token === 'pubmed'){
                    FileDownload((response.data), 'pubmed_example.csv');
                }


            })
            .catch(function (error) {
                console.log('error message', error);
            });

    }
    function onSaveTemplate(e,token){
        e.preventDefault()
        axios.get('http://0.0.0.0:8000/download_templates', {params:{token:token}})
            .then(function (response) {
                if(token === 'reports'){
                    FileDownload((response.data), 'reports_template.csv');
                }
                else if(token === 'concepts'){
                    FileDownload((response.data), 'concepts_template.csv');
                }
                else if(token === 'labels'){
                    FileDownload((response.data), 'labels_template.csv');
                }
                else if(token === 'pubmed'){
                    FileDownload((response.data), 'pubmed_template.csv');
                }

            })
            .catch(function (error) {
                console.log('error message', error);
            });

    }
    function handleClose(){
        SetShowModalSure(false)
    }
    useEffect(()=>{
        console.log('ALL!!!')
        axios.get('http://0.0.0.0:8000/get_gt_list',{params:{token:'all'}}).then(response => SetGroundTruthList(response.data['ground_truths'])).catch(error =>console.log(error))
    },[])

    function onSaveAll(token){
        // SetShowModalSure(false)
        // console.log('gt_list',GroundTruthList)
        // console.log('gt_list',token)
        if(token === 'save' && GroundTruthList>0){

            axios.get('http://0.0.0.0:8000/download_all_ground_truths')
                .then(function (response) {
                    FileDownload(JSON.stringify(response.data['ground_truth']), 'all_json_ground_truth.json');
                    SetShowModalSure(false)
                    SetShowModalMissing(false)
                    SetRedir(true)

                })
                .catch(function (error) {

                    console.log('error message', error);
                });

        }
        else if(token === 'save' && GroundTruthList === 0){
            SetShowModalMissing(true)
        }
        else if(token === 'skip'){
            SetShowModalMissing(false)
            SetShowModalSure(false)
            SetRedir(true)
        }


    }
    useEffect(()=>{
        // console.log('showmodalmissi',ShowModalMissing)
    },[ShowModalMissing])

    // useEffect(()=>{
    //     if(ShowModalSure === true && GroundTruthList === 0){
    //         onSaveAll('skip')
    //     }
    // },[ShowModalSure])

    return (
        <div className="App">


            <div >
                {/*<div style={{'float':'left','padding':'10px','padding-left':'250px'}}><button className='menuButton' onClick={(e)=>handleBar(e)}><FontAwesomeIcon icon={faBars} size='2x' /></button></div>*/}
                <Container fluid>
                    {ShowBar && <SideBar />}

                    <Row>
                        <Col md={1}>
                            <span> <button className='menuButton' onClick={(e)=>handleBar(e)}><FontAwesomeIcon icon={faBars} size='2x' /></button></span>
                        </Col>
                        <Col md={11}></Col>
                    </Row>
                <div>
                    <h2 style={{'margin-top':'30px','margin-bottom':'30px','text-align':'center'}}>New DocTAG configuration</h2>
                    <div style={{'text-align':'center'}}><div>If you are already running your configuration and you want to add new data, for example a new batch of reports or new concepts, click on <i>Update configuration</i>.
                        {Username === 'Test' && Admin === '' && <div><b>You are in the test mode, this means that you are using a configuration we provided in order to test the application before uploading your data. Once you finished your tests, please, start a new configuration clicking on <i>Configure without saving</i> or on <i>Save the json ground truths and configure.</i></b></div>}
                    </div>
                        <div>
                        <Button variant="success" onClick={(e)=>SetUpdateConfiguration(true)}>
                            Update configuration
                        </Button></div>
                        <hr/>
                    </div>
                    Dear user,<br/> pay attention to the following sections before changing the DocTAG configuration.

                        {/*This type of file is usually used to represent data tables. The first row contains the columns' names separated by a delimiter (usually the comma, but it depends, sometimes it can also be the semicolon). Each one of the other rows instead, contain the data: each row contain as many values as the columns are and these values are separated by the comma.</div>*/}
                    <div style={{'margin-top':'30px'}}>
                        <div><h4 style={{display:'inline-block'}}>General Information about the configuration</h4><IconButton onClick={()=>SetShowGenSection(prev=>!prev)}><ExpandMoreIcon style={{marginLeft:'2px'}} /></IconButton></div>
                        <Collapse style={{marginTop:'0px'}} in={ShowGenSection}>

                        <div>
                        <ul>
                        <li>
                            The new configuration you are going to set will <span style={{'font-weight':'bold'}}>overwrite</span> the current one. This means that all the annotations you performed will be lost (if any) together with the automatic annotations. This action is <span style={{'font-weight':'bold'}}>irreversible</span>. To keep all your data safe, we strongly recommend you to download the ground truths you created, especially if you are not in the test mode - i.e., you are not using the sample of data we provided the very first time you opened the application.
                         </li>
                            <li>
                                If you are in the Test mode and there is no web app administrator yet, you are asked to provide a <span style={{'font-weight':'bold'}}>username</span> and a <span style={{'font-weight':'bold'}}>password</span> that characterize your account. You will be the <span style={{'font-weight':'bold'}}>Admin</span>, which means that you are the only one who can change or update the configuration of the web app. Remember that if you are in the test mode, the test account will be available if some tests on the application need to be performed.
                            </li>
                        <li>
                            You will be asked to provide at least four files containing the data needed to run DocTAG. After this configuration, you will perform: <i>labels annotation, passages annotation,  linking</i> and <i>concepts identification</i> with the data you provided. We ask you to provide:
                            <ul>

                                <li>
                                    One or more files containing the texts (documents) you want to annotate. A file containing the textual documents is typically characterized by the <i>document_id</i> which contains the identifier of the document, the <i>language</i> (not mandatory) which determines the language of each document. The document's body is stored in a set of extra columns (in the case of csv file), or keys (in the case of
                                    json file). If you insert the entire body in a single column (key), then all the document will be annotable by default. If you split your body into many fields (keys) then you can choose what fields to annotate, display without annotate or hide.</li>

                                <li>If your documents are split into one ore more columns (or keys) you will be provided with the columns' (keys) names: you will have to decide if those fields will be annotated, displayed or hidden.</li>
                                <li>One or more files containing the <i>Runs</i>: these runs contain the list of documents associated to each topic. <b>Make sure the documents cited in <i>runs</i> files are included in the <i>collection</i> files</b>.</li>
                                <li>One or more files containing the <i>Topic</i>: these topic files contain the list of topics. Each topic is characterized by an <i>id</i> and a title, narrative and description.</li>
                                <li>One or more files containing the concepts needed to perform <i>linking</i> or <i>concepts identification</i>. These files must have four columns: a <i>concept_url</i> which is the URL of the concept in the ontology you chose, the <i>concept name</i>, which is the concept related to that URL.</li>
                                <li>One or more files containing the annotation labels needed to perform label annotations. Each label describes the relevance of the document to its associated topic.</li>
                            </ul>
                        </li>
                        </ul>
                        <div>If you have doubts, please check the <a href={'https://github.com/DocTAG/DocTAG-core/'}>GitHub page</a>. </div>
                        </div>
                        </Collapse><hr/>
                        <div>
                            <h4 style={{display:'inline-block'}}>The CSV,JSON,TXT files</h4><IconButton onClick={()=>SetShowCSVSection(prev=>!prev)}><ExpandMoreIcon style={{marginLeft:'2px'}} /></IconButton>
                        </div>
                        <Collapse style={{marginTop:'0px'}} in={ShowCSVSection}>
                        <div>We ask you to provide a set of files: the collection, the topics, the run and the labels are mandatory, this means that without them you can not configure DocTAG.</div><br/>
                            <h5>The Collection</h5>
                            <div>The collection can be uploaded in <b>csv, json</b> and <b>zip</b> (this archive must contain one or more files in <b>csv</b> or <b>json</b> formatted as it is shown below).<br/><br/>
                            <h6>CSV</h6>
                               <div>Each file must include in the header a column called <i>document_id</i>: this column will include the identifiers of your documents. If you are interested in storing information about documents' languages, the header has to
                                include a column <i>language</i> and for each document you are asked to provide the associated language. Language column is not mandatory, if you are not interested in languages, this will be set to <i>english</i> by default. The header must include at least one more field where each document's corpus is stored. If
                                you insert only one filed hosting all the corpus, the entire document will be annotable and displayed. If you subdivide your report in parts and assign a field in the header for each part, you can choose which field you can annotate, display (without annotation) and hide, <b>by the way at least one field must be annotable.</b><br/>
                                <br/>
                                Below a csv file subdivided into fields and where the language is defined (in this case you will decide if you want to annotate all the fields or many of them):
                                <div style={{display:"flex",justifyContent:"center",fontSize:'0.8rem'}}>
                                    <code><div style={{textAlign:"left"}}>
                                        <div><b>document_id,language,introduction,body,conclusion</b></div>
                                        <div>id_1,english,this is the introduction of doc1,this is the body of doc1,these are the conclusion of doc1</div>
                                        <div>id_2,english,this is the introduction of doc2,this is the body of doc2,these are the conclusion of doc2</div>
                                        <div>id_3,english,this is the introduction of doc3,this is the body of doc3,these are the conclusion of doc3</div>
                                    </div></code>
                                </div><br/>
                                Below a csv file where all the document's corpus is annotable and where the language is not defined is defined:
                                <div style={{display:"flex",justifyContent:"center",fontSize:'0.8rem'}}>
                                    <code><div style={{textAlign:"left"}}>
                                        <div><b>document_id,text</b></div>
                                        <div>id_1,this is the document doc1</div>
                                        <div>id_2,this is the document doc2</div>
                                        <div>id_3,this is the document doc3</div>
                                    </div></code>
                                </div><br/>
                               </div>
                            <h6>JSON</h6>
                                <div>
                                    Each JSON file containing your collection must be formatted as follows. all the collection must be stored in an array associated to the key <i>collection</i>. Each element of the array is a JSON element<br/>
                                    which must include: <i>document_id</i> key with the identifier of the document. If you are interested in the language of the document insert a <i>language</i> key <b>for each element of the <i>collection</i> list</b>.
                                    You can include all the corpus of each document under a unique field. By the way if you want to choose what keys to annotate, display and hide, you can store your document in more than one field.
                                    <br/><br/>
                                    <div>
                                        Below a json file subdivided into fields and where the language is defined is the following (in this case you will decide if you want to annotate all the fields or many of them):
                                    </div><br/>
                                    <div style={{display:"flex",justifyContent:"center"}}>

                                            <div >
                                                <pre style={{fontSize:'0.8rem',color:'#e83e8c'}}>

                                                    {JSON.stringify(                   {"collection":[{
                                                "document_id":"document_1",
                                                "language":"english",
                                                "introduction":"this is the introduction of document_1",
                                                "body":"this is the body of document_1",
                                                "conclusion":"this is the conclusion of document_1",
                                            },
                                                {
                                                    "document_id":"document_2",
                                                    "language":"english",
                                                    "introduction":"this is the introduction of document_2",
                                                    "body":"this is the body of document_2",
                                                    "conclusion":"this is the conclusion of document_3",
                                                }
                                            ]}, null, 2) }</pre>
                                            </div>

                                    </div>
                                    <br/>
                                    <div>
                                        Below a json file subdivided into fields and where the language is defined is the following (in this case you will decide if you want to annotate all the fields or many of them):
                                    </div><br/>
                                    <div style={{display:"flex",justifyContent:"center"}}>
                                        <div >
                                            <pre style={{fontSize:'0.8rem',color:'#e83e8c'}}>
                                                {JSON.stringify(
                                                        {"collection":[
                                                        {
                                                        "document_id":"document_1",
                                                        "text":"this is the  document_1"
                                                        },
                                                        {
                                                            "document_id":"document_2",
                                                            "text":"this is the  document_2"
                                                        }

                                                    ]}, null, 2) }</pre>
                                        </div>
                                    </div>

                                </div>
                                <hr/>
                                <h5>The collection of PubMed articles</h5>
                                <div>
                                    The allowed file formats for PubMed files are <b>json, csv</b> and <b>txt</b> formats. Each file must contain exclusively the ids of the articles you are interested to.<br/><br/>
                                    <h6>CSV</h6>
                                    <div>The header must contain the <i>document_id</i> column which is mandatory.</div><br/>
                                    <div style={{display:"flex",justifyContent:"center",fontSize:'0.8rem'}}>
                                        <code><div style={{textAlign:"left"}}>
                                            <div><b>document_id</b></div>
                                            <div>1000</div>
                                            <div>120459</div>
                                            <div>1727</div>

                                        </div></code>
                                    </div>
                                    <h6>JSON</h6>
                                    <div>The PubMed ids stored in the json files must be stored in an array. Each element of the array must contain the key <i>pubmed_ids</i> key which is mandatory.</div><br/>
                                        <div>
                                            Below a json file containing the id of the pubmed articles to add to DocTAG configuration:
                                        </div><br/>
                                        <div style={{display:"flex",justifyContent:"center"}}>

                                            <div >
                                                <pre style={{fontSize:'0.8rem',color:'#e83e8c'}}>
                                                    {JSON.stringify(
                                                        {"pubmed_ids":[
                                                                "pubmed_1","pubmed_2","pubmed_3"

                                                            ]}, null, 2) }</pre>
                                            </div>
                                        </div>
                                    <h6>txt format</h6>
                                    <div>In this case each line contains and ID:</div>
                                    <div style={{display:"flex",justifyContent:"center",fontSize:'0.8rem'}}>
                                        <code><div style={{textAlign:"left"}}>
                                            <div>1000</div>
                                            <div>120459</div>
                                            <div>1727</div>
                                        </div></code>
                                    </div><br/>
                                </div><hr/>
                                <h5>The Topic files</h5>
                                <div>
                                    The allowed file formats for topics files are <b>json, csv</b> and <b>TREC txt</b> formats.<br/><br/>
                                    <h6>CSV</h6>
                                    <div>The header must contain the <i>topic_id</i> column which is mandatory. Other columns are: <i>title, description</i> and <i>narrative</i>: these columns are not mandatory, by the way they are useful indicators of what the topics are about.</div><br/>
                                    <div style={{display:"flex",justifyContent:"center",fontSize:'0.8rem'}}>
                                        <code><div style={{textAlign:"left"}}>
                                            <div><b>topic_id,title,description,narrative</b></div>
                                            <div>top1,title of top1,description of top1, narrative of top1</div>
                                            <div>top2,title of top2,description of top2, narrative of top2</div>
                                            <div>top3,title of top3,description of top3, narrative of top3</div>

                                        </div></code>
                                    </div>
                                    <h6>JSON</h6>
                                    <div>The topics stored in the json files must be stored in an array. Each element of the array must contain the key <i>topic_id</i> key which is mandatory. Other keys are: <i>title, description</i> and <i>narrative</i>: these keys are not mandatory, by the way they are useful indicators of what the topics are about.</div><br/>
                                    <div>
                                        Below a json file containing the topics' definition:
                                    </div><br/>
                                    <div style={{display:"flex",justifyContent:"center"}}>

                                        <div >
                                                <pre style={{fontSize:'0.8rem',color:'#e83e8c'}}>
                                                    {JSON.stringify(
                                                        {"topics":[
                                                                {
                                                                    "topic_id":"topic_1",
                                                                    "title":"title_topic_1",
                                                                    "description":"description_topic_1",
                                                                    "narrative":"narrative topic_1"
                                                                },
                                                                {
                                                                    "topic_id":"topic_2",
                                                                    "title":"title_topic_2",
                                                                    "description":"description_topic_2",
                                                                    "narrative":"narrative topic_2"
                                                                }
                                                                ]
                                                        }

                                                            , null, 2) }</pre>
                                        </div>
                                    </div>

                                    <h6>TREC txt format</h6>
                                    <div>In this case each file is a txt formatted as follows:</div>

                                    <div style={{display:"flex",justifyContent:"center"}}>
                                        <pre style={{fontSize:'0.8rem',color:'#e83e8c'}}>
                                                &lt;top&gt;<br/>

                                            &lt;num&gt; Number: <i>number</i><br/>
                                            &lt;title&gt; <i>title</i><br/>

                                            &lt;desc&gt; Description:<br/>
                                                <i>description</i><br/>

                                            &lt;narr&gt; Narrative:<br/>
                                                <i>narrative</i><br/>

                                            &lt;/top&gt;
                                        </pre>
                                    </div>
                                    <br/>
                                </div><hr/>
                                <h5>The Runs files</h5>
                                <div>
                                    The allowed file formats for runs files are <b>json, csv, txt</b> formats.<br/><br/>
                                    <h6>CSV</h6>
                                    <div>The header must contain two columns <i>topic_id</i> and <i>document_id</i>. If you inserted the language of each document in the collection in <i>language</i> column or key, provide it also in the runs (otherwise some errors can occur).</div><br/>
                                    <div style={{display:"flex",justifyContent:"center",fontSize:'0.8rem'}}>
                                        <code><div style={{textAlign:"left"}}>
                                            <div><b>topic_id,document_id,language</b></div>
                                            <div>top1,doc1,english</div>
                                            <div>top1,doc2,english</div>
                                            <div>top3,doc5,english</div>
                                        </div></code>
                                    </div>
                                    <h6>JSON</h6>
                                    <div>The topic-document associations must be stored in an array associated to the key <i>run</i>. Each element of this array is a json object with <i>topic_id</i> key and <i>documents</i> key. the former stores the information about the topic identifier, the letter is a list of documents associated to the corresponding <i>topic_id</i>. If you specified a language for each document, the array <i>documents</i> must contain json objects composed by <i>document_id</i> and <i>language</i> keys</div><br/>
                                    <div>
                                        Below a json file containing the topics' definition where language is specified:
                                    </div><br/>
                                    <div style={{display:"flex",justifyContent:"center"}}>

                                        <div >
                                                <pre style={{fontSize:'0.8rem',color:'#e83e8c'}}>
                                                    {JSON.stringify(
                                                        {"run":[
                                                                {
                                                                    "topic_id":"topic_1",
                                                                    "documents":[
                                                                        {
                                                                            "document_id":"doc_1",
                                                                            "language":"english"
                                                                        },
                                                                        {
                                                                            "document_id":"doc_2",
                                                                            "language":"spanish"
                                                                        }


                                                                    ]
                                                                },
                                                                {
                                                                    "topic_id":"topic_2",
                                                                    "documents":[
                                                                        {
                                                                            "document_id":"doc_12",
                                                                            "language":"english"
                                                                        },
                                                                        {
                                                                            "document_id":"doc_14",
                                                                            "language":"italian"
                                                                        }


                                                                    ]
                                                                }
                                                            ]
                                                        }

                                                        , null, 2) }</pre>
                                        </div>
                                    </div>

                                    <div>
                                        Below a json file containing the topics' definition where language is <b>NOT</b> specified:
                                    </div><br/>
                                    <div style={{display:"flex",justifyContent:"center"}}>

                                        <div >
                                            <pre style={{fontSize:'0.8rem',color:'#e83e8c'}}>
                                                {JSON.stringify(
                                                    {"run":[
                                                            {
                                                                "topic_id":"topic_1",
                                                                "documents":["doc_1","doc_2","doc_3"]

                                                            },
                                                            {
                                                                "topic_id":"topic_2",
                                                                "documents":["doc_10","doc_20","doc_30"]
                                                            }
                                                        ]
                                                    }

                                                    , null, 2) }</pre>
                                        </div>
                                    </div>

                                    <h6>TREC format</h6>
                                    <div>In this case each file is a txt formatted as follows:</div>
                                    <div style={{display:"flex",justifyContent:"center",fontSize:'0.8rem'}}>
                                        <code><div style={{textAlign:"left"}}>
                                            <div>top1 Q0 doc1 0.51</div>
                                            <div>top1 Q0 doc2 0.34</div>
                                            <div>top2 Q0 doc5 0.6</div>
                                        </div></code>
                                    </div><br/>
                                    <h6>txt format</h6>
                                    <div>In this case each file is a txt where each line contains the topic_id, the document_id and the language (if needed) space separated.</div>
                                    <div style={{display:"flex",justifyContent:"center",fontSize:'0.8rem'}}>
                                        <code><div style={{textAlign:"left"}}>
                                            <div>top1 doc1 english</div>
                                            <div>top1 doc2 english</div>
                                            <div>top2 doc5 english</div>
                                        </div></code>
                                    </div><br/>
                                </div><hr/>
                                <h5>The Labels files</h5>
                                <div>
                                    The allowed file formats for labels files are <b>json, csv, txt</b> formats. Make sure to write your labels files inserting on top of the lists the most relevant and the least one first.<br/><br/>
                                    <h6>CSV</h6>
                                    <div>The header must contain <i>label</i> column: other columns are not allowed.</div>
                                    <div style={{display:"flex",justifyContent:"center",fontSize:'0.8rem'}}>
                                        <code><div style={{textAlign:"left"}}>
                                            <div><b>label</b></div>
                                            <div>Relevant</div>
                                            <div>Not Relevant</div>
                                        </div></code>
                                    </div><br/>
                                    <h6>JSON</h6>
                                    <div>The json file must contain a list of labels associated to the <i>labels</i> key.</div><br/>
                                    <div>
                                        Below a json file containing the labels' definition:
                                    </div><br/>
                                    <div style={{display:"flex",justifyContent:"center"}}>

                                        <div >
                                                <pre style={{fontSize:'0.8rem',color:'#e83e8c'}}>
                                                    {JSON.stringify(
                                                        {"labels":["Relevant","Not Relevant"]}

                                                        , null, 2) }</pre>
                                        </div></div>
                                    <h6>txt format</h6>
                                    <div>In this case each file is a txt where each line contains a label.</div>
                                    <div style={{display:"flex",justifyContent:"center",fontSize:'0.8rem'}}>
                                        <code><div style={{textAlign:"left"}}>
                                            <div>Relevant</div>
                                            <div>Not Relevant</div>
                                        </div></code>
                                    </div>

                                    <br/>
                                </div>
                                <h5>The Concepts files</h5>
                                <div>
                                    The allowed file formats for labels files are <b>json, csv</b> formats.<br/><br/>
                                    <h6>CSV</h6>
                                    <div>The header must contain <i>concept_url</i> and <i>concept_name</i> column: other columns are not allowed.</div><br/>
                                    <div style={{display:"flex",justifyContent:"center",fontSize:'0.8rem'}}>
                                        <code><div style={{textAlign:"left"}}>
                                            <div><b>concept_url,concept_name</b></div>
                                            <div>www.example1.com,concept1</div>
                                            <div>www.example2.com,concept2</div>
                                        </div></code>
                                    </div>
                                    <h6>JSON</h6>
                                    <div>The json file must contain a list of concepts associated to the <i>concepts</i> key. Each element of the array must contain two keys: <i>concept_url, concept_name</i></div><br/>
                                    <div>
                                        Below a json file containing the concepts' definition:
                                    </div><br/>
                                    <div style={{display:"flex",justifyContent:"center"}}>

                                        <div >
                                                <pre style={{fontSize:'0.8rem',color:'#e83e8c'}}>
                                                    {JSON.stringify(
                                                        {"concepts_list":[
                                                                {
                                                                    "concept_url":"www.concept_1.com",
                                                                    "name":"concept_1"
                                                                },{
                                                                    "concept_url":"www.concept_2.com",
                                                                    "name":"concept_2"
                                                                }
                                                                ]
                                                        }




                                                        , null, 2) }</pre>
                                        </div>
                                </div>
                                </div>
                            </div>

                        </Collapse><hr/>



                    <div style={{'margin-bottom':'30px'}}>In the database you have: {GroundTruthList} ground truths

                    </div>

                    <Button variant="primary" onClick={(e)=>onSaveAll('save')}>
                       Save the JSON ground truths and configure
                    </Button>&nbsp;&nbsp;
                    <Button variant="secondary" onClick={(e)=>SetShowModalSure(true)}>
                        Configure without saving
                    </Button>
                    </div>
                    <hr/>


                    {Redir && <Redirect  to="/configure" />}
                    {UpdateConfiguration && <Redirect  to="/updateConfiguration" />}
                </div>
                </Container>
            </div>

            {ShowModalMissing === true  &&

            <Modal show={ShowModalMissing} onHide={()=>{SetShowModalMissing(false)}}>
                <Modal.Header closeButton>
                    <Modal.Title>Attention</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>You do not have any ground-truth to save.</div>
                </Modal.Body>
                <Modal.Footer>

                    <Button variant="primary" onClick={handleCloseMissing}>
                        Ok
                    </Button>

                </Modal.Footer>
            </Modal>}

            {ShowModalSure === true && GroundTruthList === 0 && <Redirect  to="/configure" /> }
            {ShowModalSure === true && GroundTruthList > 0 && <Modal show={ShowModalSure} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Attention</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Are you sure you want to configure without saving the ground-truths?</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={(e)=>onSaveAll('save')}>
                        No, save
                    </Button>&nbsp;&nbsp;
                    <Button variant="secondary" onClick={(e)=>onSaveAll('skip')}>
                        Yes
                    </Button>

                </Modal.Footer>
            </Modal>}
        </div>



    );
}



export default InfoAboutConfiguration;
