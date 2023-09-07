import React, { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import HeaderComponent from '@/Components/headerComponent';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

import Navbar from '../Components/Navbar';
import {Outlet} from "react-router-dom";

import { useRecoilState } from "recoil";

import Atom_auth from "@/Atoms/Atom_auth";


const Layout=(props)=>
{
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const [auth, setAuth] = useRecoilState(Atom_auth)
    return (
     <>

<Navbar auth={auth} />
         <HeaderComponent />
         <div ><Outlet /></div>








     </>
    );
}

export default Layout;
