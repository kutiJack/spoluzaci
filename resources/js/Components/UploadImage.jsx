import {useState, useEffect} from "react";
import '../../css/uploadImage.css'



const UploadImage = (props)=>{

    const url= import.meta.env.VITE_APP_URL
    const[albums, setAlbums]=useState([])
    const[album_id, setAlbum_id] = useState(0)
    const [images, setImages]=useState({})






    const owner=props.owner;
    const class_id=props.class_id;


    function onUploadChanged(e)
    {


        setImages(e.target.files)
let elem=document.getElementById('selected_files');
elem.innerHTML="";
       [...e.target.files].forEach((item)=>{

           const li = document.createElement('li');

           li.innerText=item.name;
           elem.appendChild(li)


        })




    }

    const uploadFile = (e) => {
        e.preventDefault();
        const formData = new FormData();


formData.append('album_id', album_id);
formData.append('owner', owner);
formData.append('class_id', class_id);

   for (let i = 0; i < images.length; i++) {


         formData.append("fotky[]", images[i]);
        }




axios.post(url+ '/uploadImages', formData, {  headers: { 'content-type': 'multipart/form-data' } }).then((res) => {


    // vyčistí seznam odesílaných souborů...
  const elem=document.getElementById('selected_files');
  elem.style.color="green"
  elem.innerHTML='Fotky byly odeslány...'


        });
    };



// po vybrání alba v selectu ho přiřadí k uploadovaným fotkám
function selectAlbum(e)
{

    // myusql id alba
 setAlbum_id(e.target.value);

}

// naplní rozbalovací seznam alby, aby do nich mohly být přiřazeny uploadované fotky...
    function getAlbums(){
axios.post(url + '/getAlbums', {owner:owner,class_id:class_id}).then((res)=>{

setAlbums(res.data);


})

}

useEffect(()=>{
    getAlbums();

}, [])







    return (

        <>

            <div id={"uploadImage_container"} className={'col-7 row justify-content-center border  '}>




<form onSubmit={uploadFile}>

    <div className={'col-12 mt-3 row justify-content-center  '}>

        <label style={{borderBottom:"1px solid gray", marginBottom:"10px"}} className={'ms-3 col-2  text-center'} for={'files'}>
            Vybrat soubory
        <input id={'files'} style={{display:"none"}} type="file" multiple onChange={onUploadChanged} required />
        </label>

        <div className={'col-12 row justify-content-center text-center  '}>

    <select  className={'col-5 '} onChange={selectAlbum} >
        <option value='0'>Zařadit do alba</option>

        {
            albums ?

                albums.map((item)=>{
                    return <option value={item.id}>{item.description}</option>
                })

                : null


        }


    </select>

        </div>
    <input className={'col-2'} type={"submit"} value={'Odeslat'} style={{marginTop:"12px"}}/>




    </div>
</form>
















        </div>




</>

    )



}


export default UploadImage;
