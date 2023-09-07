import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link, useNavigate, Navigate} from "react-router-dom";
import { useForm } from "react-hook-form";

import {useRecoilState} from "recoil";

import Atom_insertYearVisible from "../Atoms/Atom_insertYearVisible";


const InsertYear=(props)=>{
    const navigate = useNavigate();
    const [addYearVisible, setAddYearVisible] = useRecoilState(Atom_insertYearVisible);
    const school_id=props.school_id;

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const url= import.meta.env.VITE_APP_URL

    function handleDblClick(e)
    {
        const year_id = e.target.getAttribute('id');

        navigate(`/yearDetail/${year_id}`)


    }






    const handleAddYearVisible=()=>{

        setAddYearVisible(false)


    }

    const onSubmit = async (data) => {




        data.school_id=school_id;

         axios.post(url + '/insertYear', {school_id:school_id, year:data.year}, {withCredentials:true}).then((res)=>{


             let info = document.getElementById("info");



             if(res.data) {
                 if(res.data=='exists')

                 {

                     info.setAttribute('style', 'color:red')
                     info.innerText = "Ročník už existuje"
                     return;
                 }

                 else {

                     const year_id =  res.data

                    props.schooldata.push({id:year_id, school_id:school_id, year:data.year});


                    props.setStateFn(props.schooldata, 0);

                     info.setAttribute('style', 'color:green')
                     info.innerText = "Ročník byl úspěšně přidán"


                     // rovnou vlož nově přidaný ročník do selectu
                   /*  let listbox = document.getElementById("years_select")
                     var el = document.createElement("option");
                     el.setAttribute('id', year_id)

                     el.addEventListener('click', props.fillClasses)

                     el.text = document.getElementById('year').value
                     el.value = el.text


                     listbox.add(el);
                     document.getElementById('year').value = ''*/



                 }
             }

             else
             {

                  info.setAttribute('style', 'color:red')
                 info.innerText = "Přidání se nezdařilo"
             }






         })




    }

    const elem =

        <div id='insertYear_div' className="mx-auto align-items-center ">


            <div  className="col-11 text-center  mb-4 mt-4 ms-2" style={{textDecoration:'underline'}}><h1>Nový ročník</h1></div>




            <form onSubmit={handleSubmit(onSubmit)}>



                <div className="col-12" >


                    <div className="row col-12 mb-3" >
                        <label className='text-end labels' >Rok:</label>


                        <input type="text" name="year" id="year" className="col-2"
                               {...register('year', {

                                   required: 'Rok musí být zadán',

                               })} />

                        <div className='labels '></div>
                        <button   type='submit' className="col-2  btn-block mt-3" style={{background: "#43925A",
                            border: "1px solid #275535",
                            borderRadius: "10px",
                            marginTop:'10px'
                        }}>
                            Uložit
                        </button>


                    </div>






                    <div className="row col-12 mb-3 justify-content-center" >
                        <div className="row col-5 justify-content-center" >

                            <div onClick={handleAddYearVisible}  className="col-12 text-center mb-3" style={{color: "wheat", cursor: "pointer"}}>Skrýt</div>
                        </div>
                    </div>



                    <div className="row col-12 " >

                        <div className="col-12  text-center" style={{color: "green"}} id="info"></div>
                        <div className="col-12" >
                            <div className="col-12 error text-center" >{errors.year && errors.year.message}</div>



                        </div>
                    </div>


                </div>


            </form>

        </div>




    return <>{ addYearVisible ? elem : null }</>


}

export default InsertYear;
