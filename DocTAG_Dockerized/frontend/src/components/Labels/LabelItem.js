import React, {useContext} from 'react'
import {Container,Row,Col} from "react-bootstrap";
import './labels.css';
import { useState, useEffect } from "react";
import {AppContext} from "../../App";



function LabelItem(props) {
    const { radio,disButton,labelsToInsert,showautoannotation,clickedCheck,showmember,checks,labelsList } = useContext(AppContext);
    const [ShowAutoAnn,SetShowAutoAnn] = showautoannotation;
    const [ShowMemberGt,SetShowMemberGt] =showmember
    const [labels,setLabels] = labelsList;
    const [ClickedCheck, SetClickedCheck] = clickedCheck;
    const [Disable_Buttons, SetDisable_Buttons] = disButton;
    const [Checks,SetChecks] = checks;
    const [isDis,SetisDis] = useState(false)
    const [checked, setChecked] = useState(false)
    //const [checked, setChecked] = useState('')
    const [RadioChecked, SetRadioChecked] = radio;
    const [LabToInsert,SetLabToInsert] = labelsToInsert;

    useEffect(()=>{
        // console.log('checked',LabToInsert)
        if(LabToInsert.length>0){
            var lab = []
            LabToInsert.map(labe=>{
                lab.push(labe.label)
            })
            setChecked((lab.indexOf(props.label)!== -1))
        }
        else{
            setChecked(false)
        }

    },[LabToInsert]);


    function changeFunct(e){
        e.preventDefault()
        var arr = LabToInsert
        // console.log('selected',e.target.value)

        setChecked(checked => !checked);
        SetClickedCheck(true);
        SetDisable_Buttons(false)

    }
    function updateLab(){
        console.log('sono qua')
        var arr = []
        var elems = document.getElementsByName('labels')
        Array.from(elems).map(el=>{
            // console.log('el:',el)
            // console.log('el:',el.checked)
            if(el.checked === true){
                labels.map(lab=>{
                    if(lab.label===el.value){
                        if(labelsToInsert.indexOf(lab) === -1){
                            arr.push(lab)

                        }
                    }
                })
            }

        })
        // console.log('arr',arr)
        SetLabToInsert(arr)
    }

    // useEffect(()=>{
    //     console.log('entro',checked)
    //     console.log('entro',props.label)
    //     var arr = LabToInsert
    //     var arr_lab = []
    //     arr.map(lab=>{
    //         arr_lab.push(lab.label)
    //     })
    //     if(checked === true){
    //         console.log('entro 1')
    //         if(arr_lab.indexOf(props.label) === -1){
    //             arr.push({label:props.label,seq_number:props.seq_number})
    //         }
    //         console.log('entro tot', arr)
    //
    //         SetLabToInsert(arr)
    //     }
    //     else{
    //         console.log('entro 2')
    //         var new_arr = []
    //         new_arr = arr.filter(item=>item !== {label:props.label,seq_number:props.seq_number})
    //         console.log('entro tot', new_arr)
    //         SetLabToInsert(new_arr)
    //     }
    // },[checked])
    //
    useEffect(()=>{
        if(ShowMemberGt === true || ShowAutoAnn === true){
            console.log('isdis',ShowMemberGt === true || ShowAutoAnn === true)
            SetisDis(true)
        }
        else{
            SetisDis(false)
        }
    },[ShowMemberGt,ShowAutoAnn])


    return (



                    <div className="labelitem">

                {/*<input type="checkbox" value={props.label}/>*/}
                {/*<p key={props.seq_number}>{props.seq_number}: {props.label}</p>*/}

                           <label className='item_lab'>
                               <input style={{outline:'none'}}
                               name="labels"
                               type="radio"
                               value={props.label}
                               checked={checked}
                               disabled={isDis}
                               onChange={(e)=>{setChecked(checked => !checked);
                                   SetClickedCheck(true);
                                   SetDisable_Buttons(false);
                                   updateLab()}}
                           />&nbsp;{props.label}

                            </label>
</div>




        );
    }






export default LabelItem



// const LabelItem =(props) => {
//
//         return (
//             <div className="labelitem">
//                     {/*<input type="checkbox" value={props.label}/>*/}
//                     {/*<p key={props.seq_number}>{props.seq_number}: {props.label}</p>*/}
//                     <input
//                         name="labels"
//                         type="checkbox"
//                         value={props.label}
//                         checked=''
//                         onChange={handleChange}
//                     />
//                     <label>
//                             {props.seq_number}: {props.label}
//                     </label>
//             </div>
//         );
//
//
//
// }
// export default LabelItem
