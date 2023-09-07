import '../../css/newAlbum.css'

const NewAlbum = (props)=>{

const class_id=props.class_id;
const owner = props.owner;
    const url= import.meta.env.VITE_APP_URL


function createAlbum()
{

    const description=document.getElementById('description').value;

    if(description.length<2)
    {
        alert("Název alba musí být delší než 2 znaky...")
        return;
    }

    axios.post(url + '/createAlbum', {description:description, class_id:class_id, owner:owner}).then((res)=>{



    })



}



    return(
        <div id={'newAlbum_container'} className={'col-12 row justify-content-center'}>

<div className={'col-3 row justify-content-center'}>
<input className={'col-10'} type={'text'} id={'description'}/>
<button className={'col-4'} onClick={createAlbum} >Vytvořit</button>
</div>

        </div>
    )
}


export default NewAlbum;
