import React, {useState} from 'react';
import reactDOM from 'react-dom/client';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import {Routes, Route, Link as RouterLink, Navigate, useLocation} from "react-router-dom";
import { useRecoilState } from "recoil";
import Atom_school_id from "@/Atoms/Atom_school_id";
import Atom_schoolData from "@/Atoms/Atom_schoolData";
import Atom_auth from "@/Atoms/Atom_auth";
import axios from 'axios'
import getDistrictsArray, {getCitiesArray} from "../regions"
import SectionComponent1 from '../Components/sectionComponent1'
import Detail from './Detail';
let district = null;
let city=null;

const School =  (props)=>{

    const [auth, setAuth] = useRecoilState(Atom_auth)
    const [school_id, setSchool_id] = useRecoilState(Atom_school_id)
    const [schoolData, setSchoolData] = useRecoilState(Atom_schoolData)
const location = useLocation();


    const [fullname, setFullname]=useState({id: -1, fullname: 'Vyberte kraj, okres a město a zvolte školu...'})

//setSchool_id(fullname.id)



    let linkx=null;
    if(schoolData.school_id<0)
        linkx = <span>{schoolData.fullname}</span>

    else
        linkx =< RouterLink to={'/detail'}   style={{color: "white"}}>{schoolData.fullname}</RouterLink>



    function getDistricts(e)
    {
        let schools=document.getElementById('schools');
        schools.innerText='';

        let cities=document.getElementById('cities');
        cities.innerText='';


        let listbox=document.getElementById("districts")

        const region = e.target.value;


        const districts = getDistrictsArray(region)

        listbox.innerHTML=''



        for(var i = 0; i < districts.length; i++) {
            var opt = districts[i];

            var el = document.createElement("option");
            el.text = opt;
            el.value = opt;

            listbox.add(el);
        }

        listbox.setAttribute('style', 'visibility:visible')
        listbox.setAttribute('style', 'overflow:hidden')




    }

    function getCities(e)
    {
        let schools=document.getElementById('schools');
        schools.innerText='';

        let listbox=document.getElementById("cities")
        listbox.innerHTML=''
        district = e.target.value;


        const cities=getCitiesArray(district)

        for(var i = 0; i < cities.length; i++) {
            var opt = cities[i];

            var el = document.createElement("option");
            el.text = opt;
            el.value = opt;

            listbox.add(el);
        }

        listbox.setAttribute('style', 'visibility:visible')


    }


    async function getSchools(e)
    {
        let i=1;
        let listbox=document.getElementById("schools")
        listbox.innerHTML=''
        city= e.target.value;

        let res= await axios.post("http://localhost:8000/getSchools", {district: district, city: city})

            const rows = res.data;

        // z controlleru getSchools se vrací seznam škol, každý řádek se skládá z:
        // id školy, fullname, district, city

            Object.entries(rows).forEach((item) => {



                const id = item[1].id;

                const school = item[1].fullname
                var el = document.createElement("option");
                el.setAttribute('id', id)
                el.text = i + ' ' +  school;
                el.value = school;

                listbox.add(el);
                i++;
            })


            listbox.setAttribute('style', 'visibility:visible')


    }

    async function getSchoolDetail(e)
    {


// výběrem školy získá id školy
        const id=e.target.selectedOptions[0].getAttribute('id')



        // nastav název školy do state, aby ho mohl převzít link na detail dané školy...
     //   setFullname(prevState => {return {fullname: e.target.value}})

setSchoolData(prevState=>{return {school_id:id, fullname: e.target.value}})

    }





    return (
        <>
            <div className="col-12 d-flex justify-content-center"   >
                <div className="row  mt-3 text-center align-items-center" style={{ width: "80%", height: "70px", border: "1px solid #B4B4B4", borderRadius: "3px", background: "#5FCF80"}}>

                    <SectionComponent1 content={linkx}/>
                </div>

            </div>
            <div className="col-12 d-flex justify-content-center"   >



                <div  className=" row mt-3 justify-content-center " style={{ width: "80%"}} >

                    <div  className="row  mt-3 col-12"  >

                        <div className="col-3" >Kraj</div>
                        <div  className="col-2" >Okres</div>
                        <div  className="col-2" >Město</div>
                        <div  className="col-5" >Škola</div>

                    </div>




                    <div id={"select_div"}  className="col-12 row"  >

                        <div className={"col-3"}>
                            <select className="col-11"   onChange={getDistricts} name='regions' id={'regions'} size="19" >

                                <option>Hlavní město Praha</option>
                                <option>Středočeský</option>
                                <option>Jihočeský</option>
                                <option>Plzeňský</option>
                                <option>Karlovarský</option>
                                <option>Ústecký</option>
                                <option>Liberecký</option>
                                <option>Královéhradecký</option>
                                <option>Pardubický</option>
                                <option>Vysočina</option>
                                <option>Jihomoravský</option>
                                <option>Zlínský</option>
                                <option>Olomoucký</option>
                                <option>Moravskoslezský</option>



                            </select>
                        </div>

                        <div className={"col-2"} >

                            <select className="col-12" size="19" onChange={getCities}  name='districts' id='districts' style={{visibility: "hidden" }} />


                        </div>

                        <div className={"col-2"} >

                            <select onChange={getSchools} className={"col-12"} size="19"  name='cities' id='cities' style={{visibility: "hidden", overflow: "visible !important" }} />


                        </div>

                        <div className={"col-5"} style={{borderRight: "1px solid green"}}>

                            <select onChange= {(e)=>getSchoolDetail(e)} className={"col-12"}  size="19"   name='schools' id='schools' style={{visibility: "hidden", overflow: "visible !important" }} />


                        </div>


                    </div>

                </div>
            </div>

        </>

    )



}

export default School
