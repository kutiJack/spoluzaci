import Message from './Message.jsx'
import {useEffect, useState} from "react";
import axios from 'axios';
import {useRecoilState} from "recoil";
import Atom_class_id from "@/Atoms/Atom_class_id";
import Atom_state from "@/Atoms/Atom_state";

const Board = (props) => {

    console.log('board zacina...')
    const [class_id, setClass_id] = useRecoilState(Atom_class_id)
    const [state, setState] = useRecoilState(Atom_state)
    const url = import.meta.env.VITE_APP_URL
    const [messages, setMessages] = useState([])
    let rerender = props.rerender;

    const getMessages = () => {

        axios.get(url + '/getMessages', {params: {class_id: class_id}}).then((res) => {

            let data = res.data;
            data.sort(function (x, y) {

                if (x.shift < y.shift) {
                    return -1;
                }
                if (x.shift > y.shift) {
                    return 1;
                }

                return 0;


            })

            setMessages(data)


        })


    }

    useEffect(() => {
        getMessages();
    }, [state])  // state


    return (

        <div className={'col-12 row justify-content-center '}>

            {messages ?
                messages.map((message) => {
                    return (
                        <Message message={message} shift={message.shift}/>
                    )
                })
                :
                null
            }

        </div>


    )
}

export default Board;
