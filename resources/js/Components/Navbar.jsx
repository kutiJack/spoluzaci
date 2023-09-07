import React, {useState, useEffect} from "react";
import axios from 'axios'
import { Link, Head } from '@inertiajs/react';
import { Link as RouterLink, useNavigate} from "react-router-dom";
import { useRecoilState } from "recoil";
import Atom_auth from "@/Atoms/Atom_auth";
import Atom_class_id from "@/Atoms/Atom_class_id";
import '../../css/navbar.css'
import MyClass from "@/Components/MyClass";

const NavComponent= props=> {

    const url= import.meta.env.VITE_APP_URL
    const [auth, setAuth] = useRecoilState(Atom_auth)
    const [class_id, ] = useRecoilState(Atom_class_id)
const [myClassList, setMyClassList]=useState(null)

const navigate=useNavigate();
    let user_name='';


    const getMyClass = async (user_name, ) => {

        const response = await axios.post(url + '/getMyClass', {user_name:user_name}).catch((error) => {return null})

        setMyClassList(response.data)

    }





useEffect(()=>{



    if(auth!=null && auth.user!=null && class_id>0) {
user_name=auth.user.name;
getMyClass(user_name)



    }


},[auth])



const showMyClass = ()=>{




}


    return (




        <div>
            <header id="header" className="fixed-top">
                <div  className="container d-flex align-items-center" >

                    <h1  onClick={  ()=>navigate('/classDetail', {
                        state: {

                            class_id: 5,
                            school_id: 191,
                            school_name: "Gymnázium Beroun",
                            class_name: "5.A",
                            year: "1991"
                        }}) } className="logo me-auto">Mentor</h1>


                    <nav  className="navbar"  >




                       < ul id="cm-nav">
                        <li><RouterLink to={'/'} className={'link'} >Domů</RouterLink></li>


                        <li><RouterLink to={'/school'} state={{auth:auth}}>Školy</RouterLink></li>


                           {auth && auth.user ?      <li><a href={'#'} >Moje třídy</a>
                            <ul id={'submenu'}>
                                {myClassList !=null ?   <MyClass list={myClassList} /> : null}

                            </ul>
                        </li>
                               :
                               null }


                           {auth && auth.user ?    <li><Link href={'/logout'} method={'post'}>Odhlásit</Link></li> :
                               <li><Link href={'/register'} >Registrovat</Link></li> }


                    </ul>





                        <i  className="bi bi-list mobile-nav-toggle"></i>
                    </nav>


                    <div id='profile' className={"get-started-btn"}>

                        <Link style={{color: "white"}} href={'/login'} >


                            {auth !==null && auth.user!=null ?  <span>{auth.user.name}</span>
                            :
                            <span>Přihlásit</span>

                            }
                            </Link>



                    </div>


                </div>
            </header>




        </div>
    )


}






export default NavComponent;
