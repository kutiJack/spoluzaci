import { atom } from "recoil";

const Atom_schoolData = atom({

    key: "Atom_schoolData",
    default: {classes:[], state:false, school_id:-1, years:[], schooldetails:null, id:-1, fullname: 'Vyberte kraj, okres a město a zvolte školu...' },


});

export default Atom_schoolData;
