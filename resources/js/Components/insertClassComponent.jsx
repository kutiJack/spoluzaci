import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link, useNavigate, Navigate} from "react-router-dom";
import { useForm } from "react-hook-form";

import {useRecoilState} from "recoil";

import Atom_insertClassVisible from "../Atoms/Atom_insertClassVisible";
import Atom_schoolData from "../Atoms/Atom_schoolData";

const InsertClass=(props)=>{
    const navigate = useNavigate();
    const [addClassVisible, setAddClassVisible] = useRecoilState(Atom_insertClassVisible);
    const [schoolData,setSchoolData ] = useRecoilState(Atom_schoolData)

    const year_id=schoolData.year_id;
    const year=schoolData.year;
    const school_id=schoolData.school_id

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const url= import.meta.env.VITE_APP_URL


    const handleAddClassVisible=()=>{

        setAddClassVisible(false)


    }

    const onSubmit = async (formdata) => {

        let data={}

        if(year_id) {


            data.school_id = school_id;
            data.year_id = year_id;


            data.class = formdata.class;
            const res = await axios.post(url + '/insertClass', {data})
            let info = document.getElementById("info");



            if (res.data) {


                // pokud server odpověděl, že třída už v databázi existuje...
                if (res.data == 'exists') {
                    info.setAttribute('style', 'color:red')
                    info.innerText = "Třída už existuje"
                    return;
                }


                // pokud třída neexistovala a byla tedy nově vložena...
                else {

                    info.setAttribute('style', 'color:green')


                    const class_id = res.data

                    info.innerText = "Třída byla úspěšně přidána"

props.updateClassListbox(class_id, class_name)





                }

            } else {

                info.setAttribute('style', 'color:red')
                info.innerText = "Přidání se nezdařilo"

            }


        }

        // pokud před přidáním třídy nebyl vybrán ročník...
        else if(year_id==null) {
            info.setAttribute('style', 'color:red')
            info.innerText = "Pro třídu nebyl vybrán ročník"
        }


    }

    const elem =

        <div id='insertClass_div' className="mx-auto justify-content-center ">


            <div className="col-11 text-center  mb-4 mt-4 ms-2"><h1>Nová třída</h1></div>




            <form onSubmit={handleSubmit(onSubmit)}>


                <div className="col-12" >


                    <div className="row col-12 mb-3" >
                        <label className='text-end labels' style={{testDecoration:'underline'}} >Třída:</label>


                        <input type="text" name="class" id="class" className="col-2"
                               {...register('class', {

                                   required: 'Třída musí být zadána',

                               })} />

                        <div className='labels '></div>
                        <button type='submit' className="col-2  btn-block mt-3" style={{background: "#43925A",
                            border: "1px solid #275535",
                            borderRadius: "10px",
                            marginTop:'10px'
                        }}>
                            Uložit
                        </button>

                    </div>






                    <div className="row col-12 mb-3 justify-content-center" >
                        <div className="row col-5 justify-content-center" >

                            <div onClick={handleAddClassVisible}  className="col-12 text-center mb-3" style={{color: "wheat", cursor: "pointer"}}>Skrýt</div>
                        </div>
                    </div>



                    <div className="row col-12 " >

                        <div className="col-12  text-center" style={{color: "green"}} id="info"></div>
                        <div className="col-12" >
                            <div className="col-12 error text-center" >{errors.class && errors.class.message}</div>



                        </div>
                    </div>


                </div>


            </form>

        </div>




    return <>{ addClassVisible ? elem : null }</>


}

export default InsertClass;
