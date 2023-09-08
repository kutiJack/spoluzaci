import React, {useEffect, useState} from "react";
import axios from "axios";
import {useLocation, useParams, useNavigate, Link} from "react-router-dom";
import {useRecoilState} from "recoil";
import Atom_auth from "@/Atoms/Atom_auth";
import Atom_school_id from "@/Atoms/Atom_school_id";
import Atom_class_id from "@/Atoms/Atom_class_id";
import {useForm} from "react-hook-form";
import Board from './Board'

const ClassDetail = (props) => {
    const [auth, setAuth] = useRecoilState(Atom_auth)
    const location = useLocation();
    const navigate = useNavigate();
    const [newMessageVisible, setNewMessageVisible] = useState(false)
    const [myClassButtonVisible, setMyClassButtonVisible] = useState(true)
    const [checkmyclasses, setCheckmyclasses] = useState(false)
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const [school_id, setSchool_id] = useRecoilState(Atom_school_id)
    const [class_id, setClass_id] = useRecoilState(Atom_class_id)
    const [rerender, setRerender] = useState(false)
    const url = import.meta.env.VITE_APP_URL
    const school_name = location.state.school_name;
    let user_name = "";
    let user_id = -1;
    let class_name = location.state.class_name;

    if (class_name.includes('('))
        class_name = class_name.substr(0, class_name.indexOf('('))

    let year = location.state.year;

    if (year.includes('('))
        year = year.substr(0, year.indexOf('('))

    if (auth != null && auth.user != null) {
        user_name = auth.user.name;
        user_id = auth.user.id;

    }


    useEffect(() => {

//pokud do třídy přicházíme z Moje třídy, dosaď class_id této oblíbené třídy
        location.state !== null && location.state.class_id != null ? (setClass_id(location.state.class_id), checkMyClasses(location.state.class_id)) : auth != null ?
            checkMyClasses(class_id)
            :
            null;

        let alreadyEnrolled = false;

        let res = axios.post(url + "/classDetail", {class_id: class_id}).then(
            (response) => {

// server vrátil jména uživatelů, kteří jsou zapsání v této třídě...
                if (!response.data == false) {

                    let membersdiv = document.getElementById('class_detail_header_members_div');
                    membersdiv.innerText = ''

                    const data = response.data;

                    data.forEach((item) => {

                        let div = document.createElement('div')
                        div.innerText = item.name + ' ';
                        membersdiv.appendChild(div)

                        // pokud je přihlášený uživatel už v databázi membership pro tuto třídu...
                        if (item.name == document.getElementById('profile').innerText)
                            alreadyEnrolled = true;
                    })

                    if (alreadyEnrolled == true) {
                        const enroll = document.getElementById("class_detail_header_enroll_div")
                        enroll.innerText = "Jste členem třídy";
                        enroll.removeAttribute('onclick')
                    }

                } else {
                    console.log('class detail dopadl false...')
                }

            })


    }, [myClassButtonVisible]);


    const enrollToClass = () => {

        const res = axios.post(url + "/enrollToClass", {
            class_id: class_id,
            user_id: user_id
        }, {withCredentials: true}).then(
            (response) => {

                if (response.data == true) {

                    const name = document.getElementById('profile').innerText;
                    document.getElementById('class_detail_header_members_div').innerText += name;
                    document.getElementById("class_detail_header_enroll_div").innerText = "Jste členem třídy"
                    console.log('Uživatel byl úspěšně přidán do třídy...')
                }

                if (response.data == 'exists') {
                    const enroll = document.getElementById("class_detail_header_enroll_div")
                    enroll.removeAttribute('onclick')
                }

            })


    }

    function goToGallery() {

        navigate('/gallery', {
            state: {
                school_id: school_id,
                class_id: class_id,
                class_name: class_name,
                year: year,
                school_name: school_name
            }
        })

    }

    function showAddMessage() {
        setNewMessageVisible(!newMessageVisible);
    }


    function onSubmit(data) {

        const textarea = document.getElementById("board_new_message_dialog");
        const content = textarea.value;
        const sender = user_name;
        let currentdate = new Date();
        let datetime =
            currentdate.getFullYear() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getDate() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();

        const res = axios.post(url + '/addMessage', {
            class_id: class_id,
            sender: sender,
            content: content,
            currentdate: datetime,
            isChild: false
        }, {withCredentials: true}).then(
            () => {
                showAddMessage();
                setState(!state)
            })


    }

// Pokud už je třída uložená v Moje třídy, nezobrazí se tlačítko pro přidání třídy...
    function checkMyClasses(_class_id) {

        axios.post(url + '/checkMyClasses', {user_name: user_name, class_id: _class_id}).then((response) => {
            setCheckmyclasses(response.data)


        })
    }

    function addToMyClasses() {

        const res = axios.post(url + "/addToMyClasses", {
            class_id: class_id,
            user_name: user_name,
            school_id: school_id
        }).then((response) => {

            if (response.data == 'exists') {

                setMyClassButtonVisible(true)

            } else if (response.data == 'OK') {

                setMyClassButtonVisible(false)

            }


        })


    }


    return (
        <>

            <div className='col-12 row justify-content-center' id='class_detail_container '>
                <div className="col-11 row justify-content-center" id="class_detail_header_container">
                    {
                        // první sloupec

                    }
                    <div className='floatleft  d-flex align-items-end flex-column justify-content-start '
                         style={{width: '120px', paddingBottom: '10px'}}>

                        <Link to={`/detail`}
                              className=' back_links col-12 mt-auto d-flex align-items-center  '> Do školy...</Link>
                    </div>

                    {
                        // druhý sloupec

                    }

                    <div className='justify-content-center col-10'>
                        <div id="class_detail_header_year_class_div"
                             className="col-12 row text-center justify-content-center">
                            {class_name}
                            <span
                                className="text-center" style={{marginTop: "12px", width: "55px", fontSize: "18px"}}>ročník
                            </span>
                            <span
                                className="text-center"
                                style={{marginTop: "12px", width: "100px", fontSize: "18px"}}>{year}
                            </span>

                        </div>

                        <div id="class_detail_header_schoolname_div" style={{fontSize: '22px'}}
                             className="col-12 text-center ">{school_name}</div>
                        <div id="class_detail_header_members_div"></div>

                        <div className='col-12 row justify-content-center' style={{height: '25px'}}>

                            {auth.user != null
                                ?
                                <div onClick={enrollToClass} className=" col-2 text-center"
                                     id="class_detail_header_enroll_div">Zapsat se do třídy
                                </div>
                                :
                                null}


                            {
                                auth.user != null ?

                                    myClassButtonVisible ?
                                        checkmyclasses == "exists" ?

                                            <div id='class_detail_header_add_to_myclass_div'
                                                 className='col-2 text-center'>
                                                Třída je v oblíbených
                                            </div>
                                            :
                                            <div id='class_detail_header_add_to_myclass_div' onClick={addToMyClasses}
                                                 className='col-2 text-center'>
                                                Uložit do "Moje třídy"
                                            </div>
                                        : null
                                    : null
                            }
                        </div>
                    </div>


                    {
                        // třetí sloupec
                    }

                    <div className='float-right galeryclick  d-flex'>
                        <div className='text-center mx-auto p-2 ' onClick={goToGallery}>Galerie</div>
                    </div>


                </div>


            </div>


            {auth !== null && auth.user != null ?
                <div className="col-11 row justify-content-center mt-5 ">

                    <div className="col-5 row justify-content-center" style={{paddingLeft: '130px'}}>
                        <button onClick={showAddMessage} id="board_add_message_button">
                            {newMessageVisible ?
                                <span>Skrýt</span>
                                :
                                <span>Nová zpráva</span>}
                        </button>
                    </div>


                    {newMessageVisible ?
                        <div className="col-8 row justify-content-center">
                            <form className="col-12 row justify-content-center" onSubmit={handleSubmit(onSubmit)}>
                                <textarea id="board_new_message_dialog" className="col-12" rows="3"
                                          cols="70"></textarea>


                                <div className='col-2 row justify-content-center mt-2'>
                                    <input type="submit"/>
                                </div>
                            </form>

                        </div>
                        : null}
                </div>
                : null


            }
            <Board class_id={class_id} rerender={rerender}/>
        </>
    )
}

export default ClassDetail;
