import '../../App.css';
import {AppContext} from '../../App';
import React, {useState, useEffect, useContext, createContext} from "react";
import './compStyle.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import {Container,Row,Col} from "react-bootstrap";

import '../General/first_row.css';

import SelectMenu from "../SelectMenu/SelectMenu";

import SideBar from "../General/SideBar";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

function Credits() {


    const { showbar,username,usecaseList,reports,languageList,instituteList } = useContext(AppContext);

    const [UseCaseList,SetUseCaseList] = usecaseList;
    const [LanguageList,SetLanguageList] = languageList;
    const [InstituteList,SetInstituteList] = instituteList;
    const [Aux,SetAux] = useState(false)
    const [ShowBar,SetShowBar] = showbar;
    const [Username,SetUsername] = username;
    const [Reports,SetReports] = reports;

    useEffect(()=>{
        // console.log('SHOWBAR',ShowBar)

        axios.get("http://127.0.0.1:8000/get_usecase_inst_lang").then(response => {
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


                    <div style={{'text-align':'center'}}><h2>CREDITS</h2></div>


                    <div className="py-5 text-center">

                        <div className="row">
                            <div className="col-lg-4 col-md-6 p-4"><a className='cardLink' target='_blank'
                                                                      href="http://www.dei.unipd.it/~giachell/"> <img
                                className="img-fluid d-block mb-3 mx-auto rounded-circle person_img"
                                src="https://www.dei.unipd.it/~giachell/img/personal/personal-image.jpg"
                                alt="Card image cap" width="200"/>
                                <h4 className="person_name"><b>Fabio Giachelle</b></h4></a>
                                <p>PhD Student</p>
                                <p className="mb-0">giachell@dei.unipd.it</p>
                            </div>
                            <div className="col-lg-4 col-md-6 p-4"><a className='cardLink' target='_blank'
                                                                      href="http://www.dei.unipd.it/~irreraorne/"> <img
                                className="img-fluid d-block mb-3 mx-auto rounded-circle person_img"
                                src="http://www.dei.unipd.it/~irreraorne/img/foto.jpg"
                                alt="Card image cap" width="200"/>
                                <h4 className="person_name"><b>Ornella Irrera</b></h4></a>
                                <p>Research Assistant</p>
                                <p className="mb-0">irreraorne@dei.unipd.it</p>
                            </div>
                            <div className="col-lg-4 p-4"><a className='cardLink' target='_blank' href="http://www.dei.unipd.it/~silvello/">
                                <img className="img-fluid d-block mb-3 mx-auto rounded-circle person_img"
                                     target="http://www.dei.unipd.it/~silvello/"
                                     src="http://nanoweb.dei.unipd.it/static/images/personal_images/gian_personal-image.jpg"
                                     alt="Card image cap" width="200" />
                                    <h4 className="person_name"><b>Gianmaria Silvello</b></h4></a>
                                <p>Associate Professor</p>
                                <p className="mb-0">silvello@dei.unipd.it</p>
                            </div>
                        </div>

                    </div>
                    </div> : <div className='spinnerDiv'><Spinner animation="border" role="status"/></div>}
                </Container>
            </div>

        </div>



    );
}

export default Credits;
