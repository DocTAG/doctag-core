import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {confirmable, createConfirmation} from 'react-confirm';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { faListOl,faRobot,faStickyNote, faMicroscope,faTimesCircle,faLanguage,faLocationArrow,faCogs, faHospital } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AppContext} from "../../App";
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../Linking/linked.css';
import Select from 'react-select';
import axios from "axios";


function OptionsModal(props){
    const { batchNumber,showOptions,action,reports,reportString,report_type,annotation,institute,language,usecase,updateMenu,usecaseList,languageList,instituteList } = useContext(AppContext);
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [ReportString, SetReportString] = reportString;
    const [UpdateMenu, SetUpdateMenu] = updateMenu;
    const [ShowModal, SetShowModal] = showOptions;
    const [Institute, SetInstitute] = institute;
    const [Language, SetLanguage] = language;
    const [UseCase, SetUseCase] = usecase;
    const [BatchList,SetBatchList] = useState([]);

    const [Action,SetAction] = action;
    const [BatchNumber,SetBatchNumber] = batchNumber;
    const [ShowErrorReports,SetShowErrorReports] = useState(false)
    const [Ins,SetIns] = useState('')
    const [Use,SetUse] = useState('')
    const [Lang,SetLang] = useState('')
    const [Batch,SetBatch] = useState('')
    const [Anno,SetAnno] = useState('Manual')
    const [Rep,SetRep] = useState('')
    const [Annotation,SetAnnotation] = annotation
    const [ReportType,SetReportType] = report_type
    const [AgentPresence, setAgentPresence] = useState(0)
    const [ShowError,SetShowError] = useState(false)
    const handleClose = () => SetShowModal(false);
    const [Reports,SetReports] = reports
    const [Options_usecases, Setoptions_usecases] = useState([])
    const [Options_language, Setoptions_language] = useState([])
    const [Options_institute, Setoptions_institute] = useState([])
    const [Options_batch, Setoptions_batch] = useState([])
    const [PubMedPresence,SetPubMedPresence] = useState(false)
    // const [Options_ann, Setoptions_ann] = useState([])
    const [FieldsUseCasesToExtract,SetFieldsUseCasesToExtract] = useState(false)
    const [FieldsAlreadyExtracted,SetFieldsAlreadyExtracted] = useState(false)

    const [Options_annotation, SetOptions_annotation] = useState([])


    // useEffect(()=>{
    //     if(Use !== '' && Rep !== '' && Lang !== '' && Ins !== '' && Batch !== ''){
    //         axios.get('check_auto_presence_for_configuration',{params:{batch:Batch,report_type:Rep,usecase:Use,institute:Ins,language:Lang}})
    //             .then(response=>{
    //                 if(response.data['count']>0){
    //                     var arr = []
    //                     arr.push({value:'Manual',label:'Manual'})
    //                     arr.push({value:'Automatic',label:'Automatic'})
    //                     SetOptions_annotation(arr)
    //                 }
    //                 else{
    //                     var arr = []
    //                     arr.push({value:'Manual',label:'Manual'})
    //                     SetOptions_annotation(arr)
    //                 }
    //             })
    //
    //     }
    //
    // },[Use,Rep,Ins,Lang,Batch])

    useEffect(()=>{
        if(Use !== ''){
            var opt = []
            if(Rep === 'reports'){
                axios.get('get_batch_list',{params:{usecase:Use}}).then(response=>{
                    SetBatchList(response.data['batch_list'])
                    if(response.data['batch_list'].length ===1){
                        SetBatch(1)
                    }
                    response.data['batch_list'].map(el=>{
                        opt.push({value:el,label:el})
                    })
                })
                Setoptions_batch(opt)
            }
            else{
                axios.get('get_PUBMED_batch_list',{params:{usecase:Use}}).then(response=>{
                    SetBatchList(response.data['batch_list'])
                    if(response.data['batch_list'].length ===1){
                        SetBatch(1)
                    }
                    response.data['batch_list'].map(el=>{
                        opt.push({value:el,label:el})
                    })
                })
                Setoptions_batch(opt)
            }




        }
    },[Use])

    useEffect(()=>{

        if(UseCaseList.length > 0 && InstituteList.length > 0 && LanguageList.length > 0){
            var options_institute = []
            var options_language = []
            // var options_annotation = []
            // UseCaseList.map((uc)=>{
            //     options_usecases.push({value: uc, label: uc})
            // })
            InstituteList.map((inst)=>{
                if(inst !== 'PUBMED'){
                    options_institute.push({value: inst, label: inst})
                }
            })
            LanguageList.map((lang)=>{
               options_language.push({value: lang, label: lang})
            })
            Setoptions_institute(options_institute)
            Setoptions_language(options_language)

        }
        // axios.get('get_post_fields_for_auto').then(function(response){
        //     SetFieldsUseCasesToExtract(response.data['total_fields'])
        //     SetFieldsAlreadyExtracted(response.data['extract_fields'])
        //
        // }).catch(function(error){
        //     console.log('error: ',error)
        // })
        axios.get('check_PUBMED_reports').then(function(response){
            if(response.data['count'] > 0){
                SetPubMedPresence(true)
            }


        }).catch(function(error){
            console.log('error: ',error)
        })


    },[])

    useEffect(()=>{
        var options_usecases = []
        if(Rep==='pubmed'){
            SetIns('PUBMED')
            SetLang('english')

            axios.get("pubmed_missing_auto").then(response => {
                (response.data['usecase'].map(uc=>{
                    options_usecases.push({value: uc, label: uc})

                })

            );
                Setoptions_usecases(options_usecases)
            }).catch(function (error){console.log(error)})
        }
        else{
            UseCaseList.map((uc)=>{
                options_usecases.push({value: uc, label: uc})
            })
            Setoptions_usecases(options_usecases)
        }


    },[Rep])


    function onSave(e){

        if(Ins === '' || Lang === '' || Use === '' || Anno === '' || Rep === '' || Batch === ''){
            SetShowError(true)

        }
        else { //Salvo solo se tutti e tre i campi sono stati riempiti
            var count = 0
            axios.get('get_reports', {
                params: {
                    institute: Ins,
                    usec: Use,
                    batch:Batch,
                    lang: Lang
                }
            }).then(function (response) {
                count = response.data['count']

                if (count === 0) {
                    SetShowErrorReports(true)
                }
                else if(count >0) {

                    axios.post("new_credentials", {
                        usecase: Use, language: Lang, institute: Ins, annotation: Anno,report_type: Rep,batch:Batch
                    })
                        .then(function (response) {
                            SetReportType(Rep)
                            SetUseCase(Use)
                            SetLanguage(Lang)
                            SetInstitute(Ins)

                            SetAnnotation(Anno)
                            SetBatchNumber(Batch)

                            SetRep('')
                            SetIns('')
                            SetUse('')
                            SetLang('')
                            SetAnno('')
                            SetBatch('')
                            SetUpdateMenu(true)
                            SetShowModal(false)
                            SetShowErrorReports(false)

                        })
                        .catch(function (error) {
                            SetShowModal(false)
                            SetShowErrorReports(false)
                            console.log('ERROR', error);
                        });

                    // }

                }
            })
                .catch(function (error) {
                    SetUpdateMenu(true)
                    SetIns('')
                    SetBatch('')
                    SetUse('')
                    SetLang('')
                    SetAnno('')
                    SetRep('')
                    console.log('ERROR', error);
                });
            // console.log('count1234', count)

        }



    }
    function handleChangeLanguage(option){
        console.log(`Option selected:`, option.value);
        SetLang(option.value.toString())
    }

    function handleChangeUseCase(option){
        console.log(`Option selected:`, option.value);
        SetUse(option.value.toString())
    }

    function handleChangeInstitute(option){
        console.log(`Option selected:`, option.value);
        SetIns(option.value.toString())
    }
    function handleChangeMode(option){
        console.log(`Option selected:`, option.value);
        SetAnno(option.value.toString())
    }
    function handleChangeReportType(option){
        console.log(`Option selected:`, option.value);
        SetRep(option.value.toString())
    }
    function handleChangeBatch(option){
        console.log(`Option selected:`, option.value);
        SetBatch(option.value.toString())

    }

    return(
        <Modal show={ShowModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Change Options</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {ShowError === true && <div style={{'font-size':'18px','color':'red'}}><FontAwesomeIcon icon={faTimesCircle}/> Please fill all the fields <FontAwesomeIcon icon={faTimesCircle}/></div>}
                {ShowErrorReports === true && <h5>There are not reports for this configuration, please change it. </h5>}
                <div>

                    <div >
                        <div><FontAwesomeIcon icon={faStickyNote}  /> Report type</div>
                        <Select

                            className='selection'
                            onChange={(option)=>handleChangeReportType(option)}
                            options={PubMedPresence === true ? [{value:'reports',label:'MedTAG reports'},{value:'pubmed',label:'PUBMED articles'}] :
                                [{value:'reports',label:'MedTAG reports'}]}

                        />
                        <hr/>

                    </div>
                    {Options_usecases.length > 0 && <div><div><FontAwesomeIcon icon={faMicroscope}  /> Use Case</div>
                    <Select

                        className='selection'
                        onChange={(option)=>handleChangeUseCase(option)}
                        options={Options_usecases}
                    />
                        <hr/></div>}
                    {Use !== '' && BatchList.length > 1 && <div><div><FontAwesomeIcon icon={faListOl}  /> Batch</div>
                        <Select

                            className='selection'
                            onChange={(option)=>handleChangeBatch(option)}
                            options={Options_batch}
                        />
                        <hr/></div>}
                    {((Rep === 'reports' || PubMedPresence === false) && Use !== '') &&  <div>
                        <div><FontAwesomeIcon icon={faLanguage}  /> Language</div>
                        <Select
                            className='selection'
                            onChange={(option)=>handleChangeLanguage(option)}
                            options={Options_language}

                        />
                        <hr/>


                        <div><FontAwesomeIcon icon={faHospital} /> Institute</div>
                        <Select
                            className='selection'
                            onChange={(option)=>handleChangeInstitute(option)}
                            options={Options_institute}

                        /><hr/>


                    </div>}
                    {Rep !== '' && Use !== '' && Ins !== '' && Lang !== '' && Batch !== '' && Options_annotation.length>0 && <div><div><FontAwesomeIcon icon={faRobot} /> Annotation mode</div>
                        <div ><Select
                            className='selection'
                            onChange={(option)=>handleChangeMode(option)}
                            options={Options_annotation}

                        /></div>
                    </div>}
                </div>

            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} >
                    Close
                </Button>
                <Button onClick={(e)=>onSave(e)} variant="primary" >
                    Save
                </Button>
            </Modal.Footer>
        </Modal>


    );



}


// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
// export default confirmable(LinkDialog);
export default (OptionsModal);