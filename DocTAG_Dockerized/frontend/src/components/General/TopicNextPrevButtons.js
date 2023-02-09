import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight, faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {AppContext} from "../../App";
import { confirm } from '../Dialog/confirm'
import regeneratorRuntime from "regenerator-runtime";
import { useCallback } from "react";
import { debounce } from "lodash";

function NextPrevButtons(props){

    const { annotation,removedConcept,updateMenu,usecase,batchNumber,report_type,institute,usecaseList,topicindex,language,showautoannotation,showmember,showmajority,semanticArea,clickedCheck,conceptOption,loadingReport,reportArray,loadingReportList,loadingLabels,loadingAssociations,loadingColors,loadingConcepts,loadingMentions,report,orderVar,indexList,disButton,reportString, selectedconcepts,labelsToInsert, radio, checks,save, userLabels, labelsList, mentionsList, action, reports, index, mentionSingleWord, allMentions, tokens, associations } = useContext(AppContext);
    const [mentions_to_show,SetMentions_to_show] = mentionsList;
    const [Language, SetLanguage] = language;
    const [BatchNumber,SetBatchNumber] = batchNumber

    const [ShowAutoAnn,SetShowAutoAnn] = showautoannotation;
    const [ShowMemberGt,SetShowMemberGt] =showmember
    const [ShowMajorityGt,SetShowMajorityGt] = showmajority
    const [ReportType,SetReportType] = report_type

    const [ClickedCheck, SetClickedCheck] = clickedCheck;
    const [selectedOption, setSelectedOption] = conceptOption;
    const [Annotation,SetAnnotation] = annotation
    const [associations_to_show,SetAssociations_to_show] = associations;
    const [AnnotatedIndexList,SetAnnotatedIndexList] = indexList;
    const [OrderVar, SetOrderVar] = orderVar;
    const [SavedGT,SetSavedGT] = save;
    const [ReportString, SetReportString] = reportString;
    const [labels_to_show, setLabels_to_show] = userLabels;
    const [LoadingLabels, SetLoadingLabels] = loadingLabels;
    const [LoadingConcepts, SetLoadingConcepts] = loadingConcepts;
    const [LoadingMentions, SetLoadingMentions] = loadingMentions;
    const [LoadingMentionsColor, SetLoadingMentionsColor] = loadingColors;
    const [LoadingAssociations, SetLoadingAssociations] =loadingAssociations;
    const [LoadingReport, SetLoadingReport] = loadingReport;
    const [LoadingReportList, SetLoadingReportList] = loadingReportList;
    const [Action, SetAction] = action;
    const [RadioChecked, SetRadioChecked] = radio;
    const [selectedConcepts, setSelectedConcepts] = selectedconcepts;
    const [Children,SetChildren] = tokens;
    const [WordMention, SetWordMention] = mentionSingleWord;
    const [Report, setReport] = report;
    const [Reports, setReports] = reports;
    const [Index, setIndex] = index;
    const [TokenNextPrev, SetTokenNextPrev] = useState([])
    const [LabToInsert,SetLabToInsert] = labelsToInsert;
    const [DisNext, SetDisNext] = useState(false)
    const [SelectOptions,SetSelectOptions] = reportArray;
    const [Checks, setChecks] = checks;
    const [labels, setLabels] = labelsList;
    const [RemovedConcept,SetRemovedConcept] = removedConcept;
    const [SemanticArea, SetSemanticArea] = semanticArea;
    const [DisabledButtons,SetDisabledButtons] = useState(false)
    // const [SelectedLang,SetSelectedLang] = selectedLang
    // console.log('annotation',Annotation)
    const [UpdateMenu, SetUpdateMenu] = updateMenu;

    const [useCase,SetUseCase] = usecase;
    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [TopicIndex,SetTopicIndex] = topicindex;
    const [Institute,SetInstitute] = institute;



    useEffect(()=>{
        var arr = []
        if(Action === 'labels'){
            arr.push('annotation_next')
            arr.push('annotation_prev')
        }else if(Action === 'mentions'){
            arr.push('mentions_next')
            arr.push('mentions_prev')
        }else if(Action === 'concepts'){
            arr.push('concepts_next')
            arr.push('concepts_prev')
        }else if(Action === 'concept-mention'){
            arr.push('linked_next')
            arr.push('linked_prev')
        }else if(Action === 'none'){
            arr.push('none_next')
            arr.push('none_prev')
        }
        SetTokenNextPrev(arr)
    },[Action])

    function submit(event,token){
        event.preventDefault();
        // SetLoadingReport(true)
        // SetLoadingReportList(true)
        // if(Action === 'mentions'){
        //     SetLoadingMentions(true)
        // }
        // else if(Action === 'concepts'){
        //     SetLoadingConcepts(true)
        // }
        // else if(Action === 'concept-mention'){
        //     SetLoadingAssociations(true)
        // }
        if(ShowAutoAnn === false && ShowMemberGt === false){

            if(LoadingReportList === false && LoadingReport === false){

                if (token.startsWith('mentions') && LoadingMentions === false && LoadingMentionsColor === false) {
                    SetWordMention('')
                    Children.map(child=>{
                        if(child.getAttribute('class') === 'token-selected' || child.getAttribute('class') === 'token-adj-dx' ||child.getAttribute('class') === 'token-adj-sx'){
                            child.setAttribute('class','token')
                        }
                    })
                    var data_to_ret = {'mentions': mentions_to_show.filter(x=>x.seq_number !== 0)}
                    // console.log('mentions: ' ,mentions_to_show)

                    axios.post('mention_insertion/insert', {
                        mentions: data_to_ret['mentions'],language:Language,
                        report_id: Reports[Index].id_report
                    })
                        .then(function (response) {

                            // SetSavedGT(prevState => !prevState)
                            SetSavedGT(true)
                            // console.log('RISPOSTA',response);
                        })
                        .catch(function (error) {
                            //alert('ATTENTION')
                            console.log(error);
                        });

                }else if (token.startsWith('annotation') && LoadingLabels === false && ((Annotation === 'Manual' && ClickedCheck === true) || (Annotation === 'Automatic'))) {
                    axios.post('annotationlabel/insert', {
                        //labels: data.getAll('labels'),
                        // labels: LabToInsert,
                        labels: LabToInsert,language:Language,
                        report_id: Reports[Index].id_report,
                    })
                        .then(function (response) {
                            // console.log(response);

                            // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                            if (LabToInsert.length === 0) {
                                SetRadioChecked(false)

                            }
                            // SetLabToInsert([]) added 30082021
                            // SetSavedGT(prevState => !prevState)
                            SetSavedGT(true)
                        })
                        .catch(function (error) {

                            console.log(error);
                        });

                } else if (token.startsWith('linked') && LoadingAssociations === false) {
                    //const data = new FormData(document.getElementById("linked-form"));
                    //var data_to_ret = {'linked': data.getAll('linked')}


                    data_to_ret = {'linked': associations_to_show}
                    if (data_to_ret['linked'].length >= 0) {
                        axios.post('insert_link/insert', {
                            linked: data_to_ret['linked'],language:Language,
                            report_id: Reports[Index].id_report
                        })
                            .then(function (response) {
                                // console.log(response);
                                // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                                SetWordMention('')
                                // console.log('aggiornato concepts');

                                // SetSavedGT(prevState => !prevState)
                                SetSavedGT(true)
                            })
                            .catch(function (error) {

                                console.log(error);
                            });
                    }
                } else if (token.startsWith('concepts') && LoadingConcepts === false && (selectedOption !== '' || RemovedConcept === true)) {
                    // console.log(selectedConcepts);

                    let concepts_list = []

                    for (let area of SemanticArea) {
                        for (let concept of selectedConcepts[area]) {
                            concepts_list.push(concept);
                        }
                    }

                    // console.log(concepts_list);

                    axios.post('contains/update', {
                            concepts_list: concepts_list,language:Language,
                            report_id: Reports[Index].id_report,
                        },
                    )
                        .then(function (response) {
                            // console.log(response);
                            // {concepts_list.length > 0 ? SetSavedGT(true) : SetSavedGT(false)}
                            // SetSavedGT(prevState => !prevState)
                            SetSavedGT(true)

                        })
                        .catch(function (error) {

                            console.log(error);
                        });
                }


                if (token.endsWith('_prev')) {
                    getPrev()
                } else if (token.endsWith('_next')) {
                    getNext()

                }
            }
        }
        else{
            if (token.endsWith('_prev')) {
                getPrev()
            } else if (token.endsWith('_next')) {
                getNext()

            }
        }


    }

    const getNext = () => {
            var a = TopicIndex
            if (TopicIndex === UseCaseList.length - 1) {
                a = 0
                SetTopicIndex(0)
            } else {
                SetTopicIndex(a + 1)
                a = a + 1
            }
            // console.log('A', a + 1)
            // console.log(Index)
            SetUseCase(UseCaseList[a])
            // console.log('report',Reports[Index])
            // console.log('report',Reports[a])
             axios.post("new_credentials", {
                usecase: UseCaseList[a], language: Language, institute: Institute, annotation: Annotation,report_type: ReportType,batch:BatchNumber
            })
                .then(function (response) {
                    SetUpdateMenu(true)


                })
                .catch(function (error) {
                    console.log('ERROR', error);
                });
        // console.log('report',Reports[Index])


    }

    const getPrev = () => {
        // console.log(Index)
        // submit(event,'annotation')
        var a = TopicIndex
        if (TopicIndex === 0) {
            a = UseCaseList.length
            SetTopicIndex(a - 1)
            a = a -1
        } else {
            SetTopicIndex(a - 1)
            a = a -1
        }
        SetUseCase(UseCaseList[a])
        axios.post("new_credentials", {
            usecase: UseCaseList[a], language: Language, institute: Institute, annotation: Annotation,report_type: ReportType,batch:BatchNumber
        })
            .then(function (response) {

                SetUpdateMenu(true)

            })
            .catch(function (error) {
                console.log('ERROR', error);
            });
            // console.log('report',Reports[Index])


    }



    // useEffect(()=>{
    //
    //     // console.log('bottone dis',DisNext)
    // },[DisNext])

    // useEffect(() => {
    //     window.addEventListener('keydown', keyPress);
    //     // Remove event listeners on cleanup
    //     return () => {
    //         window.removeEventListener('keydown', keyPress);
    //     };
    // }, [LabToInsert,ClickedCheck,mentions_to_show,selectedConcepts,associations_to_show,SelectOptions,RemovedConcept])
    //
    // function keyPress(e){
    //     // if(token === 'left'){
    //     if(e.keyCode === 39){
    //         // console.log('destra',TokenNextPrev[0])
    //         submit(e,TokenNextPrev[0])
    //         // onSubDx(e)
    //     }
    //
    //     // }
    //     // else if(token === 'right'){
    //     if(e.keyCode === 37){
    //         // console.log('destra2',TokenNextPrev[1])
    //         // onSubSx(e)
    //         submit(e,TokenNextPrev[1])
    //     }
    //     // }
    //
    // }
    return(

        <span  className='two_buttons_div_rep'>

                        <Button id='but_dx' size='sm' className="btn prevbtn" type="submit" onClick={(e)=>submit(e,TokenNextPrev[1])} name = "token_prev"  variant="info"><FontAwesomeIcon icon={faChevronLeft} /></Button>&nbsp;&nbsp;
            {/*<Button  size='sm' className="btn prevbtn" type="submit" onClick={(e)=>onSubSx(e)} name = "prev"  variant="info"><FontAwesomeIcon icon={faChevronLeft} /></Button>&nbsp;&nbsp;*/}
            {/*<Button  size='sm' className="btn nextbtn"  type="submit" onClick={(e)=>onSubDx(e)}  name = "next"  variant="info"><FontAwesomeIcon icon={faChevronRight} /></Button>*/}
            <Button id='but_sx' size='sm' className="btn nextbtn"  type="submit" onClick={(e)=>submit(e,TokenNextPrev[0])}  name = "token_next"  variant="info"><FontAwesomeIcon icon={faChevronRight} /></Button>
            </span>

    );
}


export default NextPrevButtons

