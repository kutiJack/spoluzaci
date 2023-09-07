import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link, BrowserRouter, Routes, useNavigate, Navigate} from "react-router-dom";
import {useParams, useLocation } from "react-router-dom";

import {useRecoilState} from "recoil";
import ReactDOMServer from "react-dom/server";
import Atom_insertClassVisible from '../Atoms/Atom_insertClassVisible';
import Atom_insertYearVisible from "../Atoms/Atom_insertYearVisible"
import InsertClass from "../Components/insertClassComponent";
import InsertYear from "../Components/insertYearComponent";
import school from "@/Components/School";
import Atom_auth from "@/Atoms/Atom_auth";
import Atom_school_id from "@/Atoms/Atom_school_id";
import Atom_class_id from "@/Atoms/Atom_class_id";
import Atom_schoolData from "@/Atoms/Atom_schoolData";


const  Detail=()=>{

   const url= import.meta.env.VITE_APP_URL
    const [auth, setAuth] = useRecoilState(Atom_auth)

    const [index, setIndex]=useState(0)
    const [state, setState]  = useState(false)
   // const [schooldata, setSchoolData] = useState([{}])
    const [isYearVisible, setIsYearVisible] = useRecoilState(Atom_insertYearVisible);
    const [isClassVisible, setIsClassVisible] = useRecoilState(Atom_insertClassVisible);
    const [school_id, setSchool_id] = useRecoilState(Atom_school_id)
    const [schoolData,setSchoolData ] = useRecoilState(Atom_schoolData)
    const [class_id, setClass_id] = useRecoilState(Atom_class_id)
    // získá id školy z komponenty schoolComponent



    // year_id bude dosazeno po vybrání roku ze selectu, stejně tak year...
    let year_id=-1;
    let year=-1;


    const location = useLocation();

    const navigate = useNavigate();


const setStateFn= (data, flag)=>{

 if(flag==0)
setSchoolData(currentdata=>{return {...currentdata, 0:data}})

    if(flag=1) {

        setSchoolData(currentdata => {

            return {...currentdata, 1: data}
        })


    }



  }



    let user_name=null;
    let user_id=null;


  if (!auth.user ==null) {
      user_name = auth.user.name;
user_id=auth.user.id;




  }



// zobrazí formulář pro přidání ročníku ... pouze přihlášeným
    const handleAddYearVisible=()=>{


        setIsClassVisible(false)
        setIsYearVisible(true)




    }








    // zobrazí formulář pro přidání třídy ... pouze přihlášeným
    const handleAddClassVisible=()=>{

        year_id=schoolData.year_id;

        if(year_id>0) {
            setIsYearVisible(false)
            setIsClassVisible(true)
        }
        else alert('Není vybraný ročník')

    }




    function sortSelect(elem) {
        var tmpAry = [];


        for (var i=0;i<elem.options.length;i++) tmpAry.push(elem.options[i]);

        tmpAry.sort(function(a,b){ return (a.text < b.text)?-1:1; });

        while (elem.options.length > 0) elem.options[0] = null;

        var newSelectedIndex = 0;
        for (var i=0;i<tmpAry.length;i++) {
            elem.options[i] = tmpAry[i];

        }

        return;
    }



    // po kliknutí na třídu v selectu zobrazí členy, registrované v této třídě...
    function fillMembers(e)
    {

        document.getElementById("empty_class_div").innerText=''

        year=document.getElementById('year_name_div')?.innerText;

        if(year)
        year=year.replace('Ročník ', '');


       setClass_id(e.target.getAttribute('id'));
        let classnamediv=document.getElementById('members_header_classname');


        let el = document.createElement('div')
        el.addEventListener('click', ()=> {

            if(year.length>0)
                navigate('/classDetail', {
                    state: {
                       auth:auth,
                       school_name: schoolData.schooldetails[0].fullname,
                        class_name: e.target.value,
                        year: year
                    }
                })
            else
            {
                alert('Není vybrán ročník...')
            }
        });

        el.innerHTML =" Vstoupit do <span>" +  e.target.value + "</span>"; classnamediv.innerHTML=''
        classnamediv.appendChild(el)


        const  res =  axios.post(url + "/getMembers", {year_id: year_id, school_id: school_id, class_id: e.target.getAttribute('id')}).then(
            (response)=>
            {



                if(response) {

                    setSchoolData(actualState=>{return {...actualState,year: year}})

                    let members_div=document.getElementById("members_div")


                    members_div.innerHTML=''


                    if(response.data.length>0) {


                        // vlož členy třídy do classdata pro využití v detailu třídy...


                        response.data.forEach((item) => {


                            var el = document.createElement("div");



                            el.innerText = item.name;


                            members_div.appendChild(el)


                        })
                    }

                    else {
                        document.getElementById("empty_class_div").innerText="Třída je zatím prázdná..."
                    }



                }

            })









    }















    // naplní select ročníky pro danou školu
    const fillYears=()=>{


        let listbox=document.getElementById("years_select")

listbox.innerHTML=''

for(const [index, item] of schoolData.years.entries())

            {



                var el = document.createElement("option");

                el.addEventListener('click', fillClasses)

                const year_id= item.id;
                el.setAttribute('id', year_id)

                var count = '';

                //pokud má ročník zaregistrované třídy, uveď jejich počet vedle ročníku
                if(schoolData.count[index]>0) {
                    count = schoolData.count[index];

                    el.text = item.year + ' (' + count + ')';

                }
               else

                   // jinak zobraz pouze ročník
                    el.text = item.year

                el.value = item.year;


                listbox.add(el);


            }


        sortSelect(listbox)

    }


  // přidá k názvu ročníku počet tříd, které jsou v tomto ročníku vytvořené...
  function addClassCount()
  {
      let listbox=document.getElementById("years_select")

const nodes = listbox.childNodes

      const arr=[]

      nodes.forEach((node)=>{
          arr.push({year_id:node.id, year:node.value, count:0})
      })

    axios.post(url + '/addClassCount', {arr:arr}).then((res)=>{

   for(var i = 0; i<nodes.length; i++)
   {
       if( res.data[i]['count']!='0')
     //  listbox.childNodes[i].innerText += ' ' + res.data[i]['count'];
       {
           const span = document.createElement('spans');
        span.addEventListener('click', ()=>alert('span'))
      span.innerText = ' (' + res.data[i]['count'] + ')'


               listbox.childNodes[i].appendChild(span)

       }

   }




    })


  }






    // po vybrání ročníku vyplní druhý select seznamem registrovaných tříd pro daný ročník
    const fillClasses=(e)=>{

      const element = e.target;
         setIndex([...element.parentElement.children].indexOf(element));

      document.getElementById("empty_class_div").innerText=''
        let members_div=document.getElementById("members_div")



        year = element.innerText

        members_div.innerHTML=''


        let yearsselect=document.getElementById("years_select")

       year_id=yearsselect.options[yearsselect.selectedIndex].getAttribute('id');



      setSchoolData(actualState=>{return {...actualState,year_id: year_id, year:year}})

       const  res =  axios.post(url + "/getClasses", {year_id: year_id, school_id: schoolData.school_id}).then(
           (response)=>
           {



               if(response) {




                   let listbox=document.getElementById("class_select")

                   listbox.innerHTML=''


                   if(listbox.childNodes.length==0)

                       if(response.data.length>0)
                           response.data.forEach((item)=> {


                               var el = document.createElement("option");
                               el.addEventListener('click', fillMembers)

                               const class_id= item.id;

                               el.setAttribute('id', class_id)

                               el.text = item.class ;
                               el.value = item.class;

                               listbox.add(el);


                           })



               }

           })







        //sortSelect(listbox)

    }







    let fullname='fullllllllllllll'



    useEffect(()=> {


        const  res =  axios.post(url + "/getDetail", {school_id: schoolData.school_id}).then(
            (response)=>
            {

                if(response) {

console.log('response data .... ', response.data)
                    setSchoolData(prevState=>{return {...prevState, years:response.data[0], count:response.data[1],  schooldetails: response.data.schooldetails}})



                }

            }, [class_id])



        setIsYearVisible(false)
        setIsClassVisible(false)











    },[]);


    return(
        <>

            <div className="row col-11 ms-5 "  >


                {Array.isArray(schoolData.schooldetails)?   <div  id="detail_div" className="row col-12  justify-content-center" >



                    <div className="col-12 row "   >
                        <div className="col-12 text-center "  style={{padding: "12px",border:"3px solid#67D286", borderRadius:"5px", color: "black", fontWeight: "bolder", marginBottom: "45px", fontSize: "1.1em" }}>{schoolData.fullname}</div>

                        <div className="col-3" >
                            <div>{schoolData.schooldetails[0].street} {schoolData.schooldetails[0].num}</div>
                            <div>{schoolData.schooldetails[0].city}</div>
                            <div>PSČ {schoolData.schooldetails[0].code}</div>


                            <div  >< Link className='back_links' state={{auth:auth}} style={{color:"wheat", fontSize: "0.8em" }} to="/school"> Zpět na výběr školy...</Link></div>
                        </div>

                        <div className="col-4"  >


                            <div><span>Mail:</span> <a href={`mailto:${schoolData.schooldetails[0].mail}`}>{schoolData.schooldetails[0].mail}</a></div>
                            <div><span>Web:</span> <a href={`${schoolData.schooldetails[0].web}`}>{schoolData.schooldetails[0].web}</a></div>
                            <div><span>Datová schránka:</span> {schoolData.schooldetails[0].datbox}</div>



                        </div>

                        {schoolData.year?.length>0 ?
                            <div className="col-4 row ">
                                <div className='col-12'></div>
                                <div className='col-12'></div>


                                <div id='year_name_div' className="col-12" style={{fontSize:'1.8em', fontWeight:'bolder'}}> Ročník {schoolData.year}</div>
                            </div>
                            :null }


                    </div>
                </div>: null}






                <div id="years_class_members_container" className="row col-12"    >


                    <div id="years_container" className="col-3"  >

                        <div id="years_select_div"   className="col-12  text-center " >


                                <button onClick={handleAddYearVisible} className="col-12 mb-3 " style={{color: "black" ,background: "#77D794", padding: "8px", borderRadius: "4px"}} >Přidat ročník</button>

                            {  /*  <div className="col-12 mb-3 " style={{color: "black" ,background: "#77D794", padding: "8px", borderRadius: "4px"}} >Ročníky</div> */ }





                            <select  id="years_select" size="14" className="col-12 text-start">

                                { Array.isArray(schoolData.schooldetails) ? fillYears() :null}}
                                }


                            </select>



                        </div>
                    </div>




                    <div id="class_container" className="col-3 " >
                        <div id="class_select_div"  className="col-12  text-center ">


                                <button onClick={handleAddClassVisible} className="col-12 mb-3 " style={{color: "black" ,background: "#77D794", padding: "8px", borderRadius: "4px"}} >Přidat třídu</button>

                            { /*  <div className="col-12 mb-3 " style={{color: "black" ,background: "#77D794", padding: "8px", borderRadius: "4px"}} >Třídy</div> */}





                            <select  id="class_select" size="14" className="col-12 text-start">

                            </select>



                        </div>


                    </div>



                    <div id="members_container" className="col-5 row justify-content-center" >
                        <div id="members_header" className="col-12  text-center">
                            <div id="members_header_classname" className="col-12" ></div>
                        </div>
                        <div id="empty_class_div" className="col-12" ></div>
                        <div id="members_div" className="col-12  " ></div>







                    </div>



                </div>



                <InsertClass school_id={school_id} setStateFn={setStateFn} index={index}  schooldata={schoolData} year_id={schoolData.year_id} year={year}   fillMembers={fillMembers} />

               <InsertYear school_id={school_id} setStateFn={setStateFn} schooldata={schoolData[0]}  fillClasses={fillClasses } year_id={year_id}/>


            </div>







        </>

    )

}

export default Detail
