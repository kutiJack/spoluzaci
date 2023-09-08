import {useEffect} from "react";
import axios from 'axios'
import {Link as RouterLink} from "react-router-dom";

const MyClass = (props) => {
    const list = props.list;
    return list.map((item) => {
        return <li id={item.class_id} className={'sublink'}><RouterLink to={'/classDetail'} state={
            {
                class_id: item.class_id,
                school_id: item.school_id,
                school_name: item.school_name,
                year: item.year,
                class_name: item.class_name
            }

        }>{item.class_name}</RouterLink></li>
    })
}

export default MyClass;
