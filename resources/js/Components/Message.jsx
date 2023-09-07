import {DateTime} from "luxon"
import '../../css/message.css'
import React, {useState, useEffect} from 'react'
import axios from "axios";
import { useRecoilState } from "recoil";
import Atom_auth from "@/Atoms/Atom_auth";
import Atom_class_id from "@/Atoms/Atom_class_id";

import { useForm } from "react-hook-form";
import Atom_state from "@/Atoms/Atom_state";


const Message = (props)=>{

const shift=props.shift.split('-').length*100;

const margin=shift + 'px'



    const [state, setState] = useRecoilState(Atom_state)
  const[rerender, setRerender]=useState(props.rerender)
    const [auth, setAuth] = useRecoilState(Atom_auth)
    const [class_id, setClass_id] = useRecoilState(Atom_class_id)
const message=props.message;
    let id=message.id;

const [reactionVisible, setReactionVisible]=useState(false)
    const { register, handleSubmit, watch, formState: { errors }, getValues, setValue } = useForm();

    const url= import.meta.env.VITE_APP_URL
    let dt = DateTime.fromSQL(message.date)

  const datum = dt.toFormat("d.MM. yyyy h:mm")

    function onReactionSubmit(data){





     const content = getValues('textarea')

     const sender=auth.user.name;


        var currentdate = new Date();
        var datetime =
            currentdate.getFullYear() + "/"
            + (currentdate.getMonth()+1)  + "/"
            +currentdate.getDate() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();





     const res =  axios.post(url + '/addReaction', {class_id: class_id, sender: sender, id:id, content:content, currentdate:datetime, isChild:false}, {withCredentials: true}).then(

         // odstartuj rerendering Boardu, aby se zobrazila nově přidaná reakce
setState(!state)


     )

setValue('textarea', '')
setReactionVisible(false)


    }


useEffect(()=>{



}, [rerender])



function showReact()
{
    setReactionVisible(true)
}

    return (

        <>
        <div  id={message.id} className={'message_container col-9 row'} style={{marginLeft:`${margin}`}}>

            <div id={'message_title'} className={'col-12 d-flex'}>

                <div className={'col-3 '}>{message.sender}</div>
                <div className={'col-9 d-flex justify-content-end  '} >  {datum} </div>



            </div>
<div id={'message_content'} className={'col-12'}>{message.content}</div>

            {auth !=null && auth.user!=null ?
<div className={'text-center'} id={'message_bottom'}>


    <span onClick={showReact}>Odpovědět</span>
</div>
:null

    }






        </div>

            {reactionVisible == true ?   <div className={'col-8'} id={'message_react'} style={{marginLeft:`${margin}`}}>


                <form className="col-12 row justify-content-center" onSubmit={handleSubmit(onReactionSubmit)}>
                    <textarea {...register("textarea")} id="reaction_textarea" className="col-12" rows="3" cols="70"></textarea>


                    <div className='col-2 row justify-content-center mt-2'  >
                        <input type="submit"   />
                    </div>
                </form>

            </div>: null}

    </>

    )



}

export default Message;
