import React from "react";
import {Link as RouterLink} from "react-router-dom";

const HeaderComponent = () => {
    return (
        <>
            <div id="hero" className="d-flex justify-content-center align-items-center">
                <div className="container position-relative">
                    <h1>Najdi své spolužáky<br/></h1>
                    <h2>Zavpomínej na léta v lavici...</h2>
                    <RouterLink to={'login'} className="btn-get-started">Get Started</RouterLink>
                </div>
            </div>

        </>

    )
}


export default HeaderComponent
