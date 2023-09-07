import { atom } from "recoil";

const Atom_schoolData = atom({

    key: "Atom_schoolData",
    default: {school_id:-1, years:null, schooldetails:null, id:-1, fullname: 'Vyberte kraj, okres a město a zvolte školu...' },


});

export default Atom_schoolData;
