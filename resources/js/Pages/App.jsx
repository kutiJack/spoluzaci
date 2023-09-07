import  React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter, Routes,  Route} from "react-router-dom";
import School from '../Components/School'
import Detail from '../Components/Detail'
import Gallery from "@/Components/Gallery";
import ClassDetail from '../Components/ClassDetail'
//import Galery from './GaleryComponent'
//import Album from './AlbumComponent'
import MyClass from "../Components/MyClass";
import Layout from '../Layouts/Layout'
import { useRecoilState } from "recoil";
import Atom_auth from "@/Atoms/Atom_auth";
import myClass from "../Components/MyClass";


function App(props) {

const [auth, setAuth] = useRecoilState(Atom_auth)


    useEffect(()=>{

        setAuth(props.auth)


    })



    return(

            <BrowserRouter>

                <Routes>



                    <Route element={<Layout auth={auth}/>}>

                        <Route  path='/'/>
                        <Route  path='/school' element={<School />} />
                        <Route  path='/detail' element={<Detail />} />
                        <Route  path='/classDetail' element={<ClassDetail />} />
                        <Route  path='/myClass' element={<MyClass />}/>
                        <Route path='/gallery' element={<Gallery />} />


                    </Route>



                </Routes>



            </BrowserRouter>



    )


}

export default App;
