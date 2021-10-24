import '../../App.css';
import {AppContext} from '../../App';
import React, {useState, useEffect, useContext, useRef} from "react";
import './compStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import {Container,Row,Col} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import '../General/first_row.css';
import {
    CircularProgressbar,ProgressProvider,
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import './compStyle.css'
// import { easeQuadInOut } from "d3-ease";
// import AnimatedProgressProvider from "./AnimatedProgressProvider";
import ChangingProgressProvider from "./ChangingProgressProvider";

import SelectMenu from "../SelectMenu/SelectMenu";

import SideBar from "../General/SideBar";
import ProgressiveComponent from "./ProgressiveComponent";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {FontDownload} from "@material-ui/icons";
import {faTimes, faUpload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function UploadFile() {


    const { showbar,usersList,usecaseList,annotation,reports,languageList,instituteList } = useContext(AppContext);
    const [Annotation,SetAnnotation] = annotation;
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [Aux,SetAux] = useState(false)
    const [ShowBar,SetShowBar] = showbar;
    const [showTransfer,setshowTransfer] = useState(false);
    const [showUpload,setshowUpload] = useState(false);
    const [Reports,SetReports] = reports;
    const [Checked, SetChecked] = useState(0)
    const [UsersList,SetUsersList] = usersList
    const [ShowDeleteFiles,SetShowDeleteFiles] = useState(false)
    const [ShowModal,SetShowModal] = useState(false)
    const [LoadingTransfer,SetLoadingTransfer] = useState(false)
    const [LoadingUpload,SetLoadingUpload] = useState(false)
    const [CompleteTransfer,SetCompleteTransfer] = useState(0)
    const [CompleteUpload,SetCompleteUpload] = useState(0)
    const [Overwrite,SetOverwrite] = useState(false)
    const ref_user = useRef('')

    useEffect(()=>{
        window.scroll(0,0)
    },[])

    function handleStartCopy(){
        var input = ''

        input = document.getElementById('input_upload');
        if(input.files[0] !== undefined && input.files[0] !== null){
            var formData = new FormData();
            formData.append('overwrite', Overwrite.toString())
            input = document.getElementById('input_upload');
            for (let ind=0; ind<input.files.length; ind++) {
                var name = 'files_' + ind.toString()
                formData.append(name, input.files[ind]);
            }

            axios.post('http://0.0.0.0:8000/handle_upload_files',formData)
                .then(response => {
                    SetCompleteUpload(false);
                    if (response.data['message'] === 'Ok'){
                        SetCompleteUpload(true)
                        SetChecked(0)
                        var input = ''
                        input = document.getElementById('input_upload');
                        if(input.files[0] !== undefined && input.files[0] !== null){
                            input.value = null
                        }
                        SetShowModal(false)

                    }
                    else{
                        SetCompleteUpload(response.data['message'])
                        SetShowModal(false)

                    }})
                .catch(error=>{SetLoadingUpload(false);})
        }
        else{
            if(ref_user !== ''){
                 axios.post('http://0.0.0.0:8000/handle_copy_rows',{username:ref_user.current,overwrite:Overwrite})
                    .then(response => {SetLoadingTransfer(false);
                        if (response.data['message'] === 'Ok'){

                            SetCompleteTransfer(true)
                            SetShowModal(false)

                        }
                        else{
                            SetCompleteTransfer(response.data['message'])
                            SetShowModal(false)

                        }})
                    .catch(error=>{SetLoadingTransfer(false);
                    SetShowModal(false);
                    })
            }
        }
    }
    useEffect(()=>{
        console.log('complete_trans',CompleteTransfer)
    },[CompleteTransfer])

    function handleCheckFiles(){
        var input = ''
        input = document.getElementById('input_upload');
        if(input.files[0] !== undefined && input.files[0] !== null){
            var formData = new FormData();
            input = document.getElementById('input_upload');
            for (let ind=0; ind<input.files.length; ind++) {
                var name = 'files_' + ind.toString()
                formData.append(name, input.files[ind]);
            }
            axios.post('http://0.0.0.0:8000/handle_check_upload_files',formData)
                .then(response => {SetLoadingTransfer(false);
                if (response.data['message'] === 'Ok'){
                    SetChecked(true)
                }
                else{
                    SetChecked(response.data['message'])
                }

                SetChecked(true)})
                SetShowModal(false)
                .catch(error=>{SetLoadingTransfer(false);
                })
        }
    }

    function deleteInput(e){
        e.preventDefault()
        SetCompleteUpload(0)
        SetLoadingUpload(true)
        SetChecked(0)
        SetShowDeleteFiles(false)
        var input = ''
        input = document.getElementById('input_upload');
        if(input.files[0] !== undefined && input.files[0] !== null){
            input.value = null
        }

    }

    const handleCloseModal = () => SetShowModal(false)

    return (
        <div className="App">
            <div>
                <Container fluid>
                    {ShowBar && <SideBar />}
                    {(InstituteList.length >= 0 && LanguageList.length >=0 && UseCaseList.length >= 0) && <div><SelectMenu />
                        <hr/></div>}


                    <div style={{'text-align':'center', 'margin-bottom':'3%'}}><h2>UPLOAD AND TRANSFER ANNOTATIONS</h2></div>
                    <div>
                        The annotations created by the team members who share DocTAG can be <b>copied</b> from a user to another. This allows you to have the ground-truths of a team mate of yours ready to be re-edited by you and not create ex novo a ground-truth.
                        In order to do this, select the team member you want to copy the ground-truths of. Bare in mind that <b>you annotations might be overwritten by those of the team mate you selected. This is irreverisble. </b>
                        <hr/>
                        <div>
                            Uploading new annotations might lead to collisions if the team mate you are uploading the annotations of and you have annotated the same documents.
                            <div style={{marginTop:'1%'}}>
                                <label><input
                                    type="radio"
                                    name='collision'
                                    onChange={()=>{SetOverwrite(true);}}

                                /> If your team mate and you annotated the same documents, the ground truths of your team mate will <b>overwrite</b> yours in case of collision</label><br/>
                                <label><input
                                    type="radio"
                                    name='collision'
                                    defaultChecked={true}
                                    onChange={()=>{SetOverwrite(false);}}

                                /> If your team mate and you annotated the same documents, the ground truths of your team mate will be <b>ignored</b> in case of collision.</label>

                            </div>
                         </div>
                        <hr/>
                        In order to rely on your team member's annotations there are two options:

                        <div><h5 style={{display:'inline-block'}}>Get the annotations of a team mate</h5><IconButton onClick={()=>setshowTransfer(prev=>!prev)}><ExpandMoreIcon style={{marginLeft:'2px'}} /></IconButton></div>
                        <div>
                            <Collapse style={{marginTop:'0px'}} in={showTransfer}>
                                <div>
                                    <b>If you share DocTAG with other team members</b> you can select the team member you desire and copy his annotations for the annotation type you are interested in.
                                    <Row>
                                        <Col md={2}></Col>
                                        <Col md={8}>
                                            {LoadingTransfer === false ? <div>{UsersList.length > 0 && <div style={{display:'inline-block','padding-left':'1%','padding-right':'1%','margin-top':'2%','width':'80%'}}>
                                                <div className="input-group"><Form.Control as="select" style={{margin:'0 1% 2% 0'}} onChange={(option)=>{SetCompleteTransfer(0);ref_user.current = option.target.value}} defaultValue="Choose a team member..." >
                                                <option value = ''>Select a team member...</option>
                                                {UsersList.map(val=>
                                                    <option value ={val}>{val}</option>
                                                )}
                                            </Form.Control>
                                                    <Button onClick={()=>{SetShowModal(true);SetLoadingTransfer(true);handleStartCopy()}} style={{margin:'0 0 2% 1%'}} variant='success'>Confirm</Button></div>
                                            </div>}</div> : <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}
                                            <div>
                                                {CompleteTransfer === true && <div>Ok, annotations transferred.</div>}
                                                {CompleteTransfer !== true && CompleteTransfer !== 0 && <div>An error occurred: {CompleteTransfer}</div>}

                                            </div>
                                        </Col>
                                        <Col md={2}>
                                        </Col>
                                    </Row>
                                    {/*<Modal show={ShowModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>*/}

                                    {/*    <Modal.Body>Remember that all the ground truth you created (if any) will be overwritten. Continue?*/}
                                    {/*    </Modal.Body>*/}
                                    {/*    <Modal.Footer>*/}
                                    {/*        <Button variant="secondary" onClick={handleCloseModal}>*/}
                                    {/*            No*/}
                                    {/*        </Button>*/}
                                    {/*        <Button variant="primary" onClick={()=>{SetLoadingTransfer(true);handleStartCopy()}}>*/}
                                    {/*            Yes*/}
                                    {/*        </Button>*/}
                                    {/*    </Modal.Footer>*/}
                                    {/*</Modal>*/}

                                </div>
                            </Collapse>
                        </div><hr/>
                        <div><h5 style={{display:'inline-block'}}>Get the annotations from CSV file</h5><IconButton onClick={()=>setshowUpload(prev=>!prev)}><ExpandMoreIcon style={{marginLeft:'2px'}} /></IconButton></div>
                        <div>
                            <Collapse style={{marginTop:'0px'}} in={showUpload}>
                                <div>
                                    Upload a CSV file with the annotations. This file should be a CSV with annotations a team mate of yours who use DocTAG downloaded, or have the same file format.

                                    <Form.Group style={{'margin-top':'20px','margin-bottom':'20px'}}>
                                        <Form.File id="input_upload" onClick={(e) => {SetShowDeleteFiles(false);SetCompleteUpload(0);e.target.value = null;}} onChange={(e)=>{SetShowDeleteFiles(true);handleCheckFiles()}}  multiple/>
                                        {ShowDeleteFiles === true && <div><Button className='delete-button' onClick={(e)=>deleteInput(e)}><FontAwesomeIcon icon={faTimes} />Delete file</Button></div>}
                                    </Form.Group>
                                    {Checked === true && <div style={{color:'green',margin:'1% 0 1% 0'}}>Ok, you can confirm.</div>}
                                    {Checked !== 0 && Checked !== true && <div style={{color:'red',margin:'1% 0 1% 0'}}>An error occurred: {Checked}</div>}
                                    <div>
                                        {CompleteUpload === 0 ? <Button type="file" onClick={()=>{SetShowModal(true);handleStartCopy();SetChecked(0)}} variant='primary'>Confirm</Button> : <div>
                                            {CompleteUpload !== true && <div style={{color:'red'}}>An error occurred: </div>
                                            }
                                            {CompleteUpload === true && <div style={{color:'green'}}>Ok, files uploaded with no errors.</div>
                                            }
                                        </div>}

                                    </div>
                                </div>

                            </Collapse>
                        </div>


                    </div>


                </Container>

            </div>


        </div>



    );
}



export default UploadFile;
