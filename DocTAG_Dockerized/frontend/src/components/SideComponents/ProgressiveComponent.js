import ChangingProgressProvider from "./ChangingProgressProvider";
import {buildStyles, CircularProgressbar, CircularProgressbarWithChildren} from "react-circular-progressbar";
import React, {useEffect, useState} from "react";
import MyStats from "./MyStats";
import {Container,Row,Col} from "react-bootstrap";

function ProgressiveComponent(props){
    const [Colors,SetColors] = useState(['#039be5','#00c853','#f57f17','#d84315'])
    const [Actions,SetActions] = useState(['Labels','Passages','Concepts','Linking'])
    const random = getRandomInt(100)
    useEffect(()=>{
        console.log('STATS_ARR: ',props.stats_array)
    },[props.stats_array])

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }


    return (

            <div style={{'text-align':'center'}}>
                <div style={{ maxWidth: 180, maxHeight: 180, display: "inline-block" }}>
                    {/*<ChangingProgressProvider values={[0, random]}>*/}
                    <ChangingProgressProvider values={[0, props.stats_array_percent[props.action]]}>
                    {percentage => (
                            <CircularProgressbar
                                // value={percentage}
                                value={percentage}
                                text={`${percentage}%`}
                                styles={buildStyles({
                                    pathColor: Colors[(props.index)]
                                    // trailColor: Colors[(props.stats_array_percent).indexOf(percentage)]
                                })}

                            />
                        )}
                    </ChangingProgressProvider>
                </div>
                <div>
                    <h6>{Actions[props.index]}</h6>
                    <div style={{textAlign:'center'}}>
                        <div ><span>Annotated: </span><span style={{textAlign:'right'}}>{props.stats_array[props.action]} ({props.stats_array_percent[props.action]}%) </span></div>
                        <div ><span>Missing: </span><span style={{textAlign:'right'}}>{props.stats_array['all_reports'] - props.stats_array[props.action]} ({ 100 - props.stats_array_percent[props.action]}%) </span></div>
                    </div>

                </div>
                {/*<div>*/}
                {/*    <h6>{Actions[props.index]}</h6>*/}
                {/*    <div style={{textAlign:'center'}}>*/}
                {/*        <div ><span>Annotated: </span><span style={{textAlign:'right'}}>{random} ({random}%) </span></div>*/}
                {/*        <div ><span>Missing: </span><span style={{textAlign:'right'}}>{100 - random} ({ 100 - random}%) </span></div>*/}
                {/*    </div>*/}

                {/*</div>*/}

            </div>


    );
}

export default ProgressiveComponent;
