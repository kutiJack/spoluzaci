import Atom_auth from "@/Atoms/Atom_auth";
import {useLocation, useParams, useNavigate, Link} from "react-router-dom";
import {useRecoilState} from "recoil";
import ImageGallery from 'react-image-gallery';
import '../../css/image-gallery.css'
import '../../css/gallery.css'
import React, {useState, useEffect} from 'react'
import UploadImage from "@/Components/UploadImage";
import NewAlbum from "@/Components/NewAlbum";


const Gallery = () => {
    const url = import.meta.env.VITE_APP_URL
    const [auth, setAuth] = useRecoilState(Atom_auth)
    const [myClassButtonVisible, setMyClassButtonVisible] = useState(true)
    const [uploadImageVisible, setUploadImageVisible] = useState(false)
    const [imagepaths, setImagepaths] = useState([])
    const [albums, setAlbums] = useState([])
    const [newAlbumVisible, setNewAlbumVisible] = useState(false)
    const location = useLocation();


    // provizorní konstanta, nahradit funkcí, která vrací true, pokud už je třída uložena do Moje třídy...
    const checkmyclasses = true;
    const prefix = "http://localhost/spoluzaci/resources/img/gallery/"

    let owner = ''
    auth.user != null && auth.user.name != null ? owner = auth.user.name : owner = '';
    const school_id = location.state.school_id;
    const class_id = location.state.class_id;
    const class_name = location.state.class_name;
    const year = location.state.year;
    const school_name = location.state.school_name;

    let images = []


    useEffect(() => {


        // pokud není nikdo přihlášený, je owner prázdný řetězec...
        getPhotos(0, class_id, owner);
        getAlbums();

    }, [])


    function hideNewAlbumDialog() {
        setNewAlbumVisible(false)
    }

    function getAlbums() {


        axios.post(url + '/getAlbums', {owner: owner, class_id: class_id}).then((res) => {

            setAlbums(res.data);


        })

    }


    function getPhotos(album_id, class_id, owner) {
        let array = []

        axios.post(url + '/getPhotos', {album_id: album_id, class_id: class_id, owner: owner}).then((res) => {

            const arr = res.data;
            const newarr = arr.map((item) => {

                let path = url + '/' + item;

                return {original: path, thumbnail: path}


            })


            setImagepaths(newarr)


        })


    }


    function _renderThumbInner(item) {
        return (

            <span className="image-gallery-thumbnail-inner">

        <img
            className="image-gallery-thumbnail-image"
            src={item.thumbnail}
            height={item.thumbnailHeight}
            width={item.thumbnailWidth}
            alt={item.thumbnailAlt}
            title={item.thumbnailTitle}
            loading={item.thumbnailLoading}

        />
                {
                    item.thumbnailLabel && (
                        <div className="image-gallery-thumbnail-label">
                            {item.thumbnailLabel}
                        </div>
                    )
                }
                <div>bottom</div>
      </span>
        )

    }


// po kliknutí na název alba zobrazí fotky, které jsou do alba přiřazeny...
    function handle_album_click(e) {


    }

    function showUpload() {

        setUploadImageVisible(true);
    }

    function hideUpload() {

        // vyčistí seznam uploadovaných souborů...
        const elem = document.getElementById('selected_files');
        elem.innerHTML = ""
        setUploadImageVisible(false);
    }

    function enrollToClass() {

    }

    function addToMyClasses() {


    }


    return (
        <div id={'gallery_container'} className={'col-12 row justify-content-center '}>

            <div className='col-12 row justify-content-center' id='class_detail_container '>


                <div className="col-11 row justify-content-center" id="class_detail_header_container">

                    {
                        // první sloupec

                    }
                    <div className='floatleft  d-flex align-items-end flex-column justify-content-start '
                         style={{width: '120px', paddingBottom: '10px'}}>


                        <Link to={`/detail`} state={{
                            auth: auth,
                            school_id: school_id,
                            class_id: class_id,
                            school_name: school_name,
                            year: year,
                        }}
                              className=' back_links col-12 mt-auto d-flex align-items-center  '> Do školy...</Link>

                        <Link to={`/classDetail`} state={{
                            auth: auth,
                            school_id: school_id,
                            class_id: class_id,
                            class_name: class_name,
                            school_name: school_name,
                            year: year,
                        }}
                              className=' back_links col-12 mt-auto d-flex align-items-center  '> Do třídy...</Link>

                    </div>


                    {
                        // druhý sloupec

                    }

                    <div className='justify-content-center col-10'>
                        <div id="class_detail_header_year_class_div"
                             className="col-11  row text-center justify-content-center">
                            {class_name}
                            <span
                                className="text-center" style={{marginTop: "12px", width: "55px", fontSize: "18px"}}>ročník
                    </span>
                            <span
                                className="text-center"
                                style={{marginTop: "12px", width: "50px", fontSize: "18px"}}>{year}
                        </span>


                        </div>

                        <div id="class_detail_header_schoolname_div" style={{fontSize: '22px'}}
                             className="col-11 text-center ">{school_name}</div>


                        <div className='col-11 row justify-content-center mt-2' style={{height: '35px'}}>


                            {auth.user != null

                                ?

                                uploadImageVisible == false ?
                                    <div onClick={showUpload} className=" col-2 text-center"
                                         id="class_detail_header_enroll_div">Nahrát foto</div>
                                    :
                                    <div onClick={hideUpload} className=" col-2 text-center"
                                         id="class_detail_header_enroll_div">Ukončit nahrávání</div>


                                :
                                null}


                        </div>
                    </div>


                    {
                        // třetí sloupec
                    }


                </div>


            </div>

            <div className={'col-12  text-center row justify-content-center '}>

                {newAlbumVisible == true ?
                    <div onClick={() => hideNewAlbumDialog()}
                         id={'hide_newAlbum_Dialog'}
                         className={'col-1 d-flex align-items-center justify-content-center  '}>Skrýt dialog</div>

                    :

                    <div onClick={() => setNewAlbumVisible(true)} id={'new_album'}
                         className={'col-1 d-flex align-items-center justify-content-center  '}>Nové
                        album</div>


                }


                {newAlbumVisible == true ? <NewAlbum class_id={class_id} owner={owner}/> : null}


                {albums.length > 0 ?

                    <div className={'col-12 row justify-content-center'}>

                        <div className={'col-1 text-center'}
                             style={{color: "rgba(23,51,83,0.66)", fontSize: "1.2em"}}>Alba
                        </div>

                        <ul className={'col-12'} id={'albums_list'}>

                            <li className={'back_links'} id={'album_back_li'}><span
                                onClick={() => getPhotos(0, class_id, owner)}>Zpět</span></li>
                            {albums.map((item) => {

                                return <li onClick={() => getPhotos(item.id, class_id, owner)}
                                           id={item.id}>{item.description}</li>

                            })}


                        </ul>
                    </div>
                    : null


                }
                <ul className={'col-12'} id={'selected_files'}></ul>


            </div>


            {uploadImageVisible == true && auth.user != null ?

                <div className={'col-12 row justify-content-center '}>
                    <UploadImage owner={auth.user.name} class_id={class_id}/>
                </div>
                : null}

            {imagepaths.length > 0 ?
                <div className={'mt-5'}>
                    <ImageGallery items={imagepaths} showNav={false} renderThumbInner={_renderThumbInner}/>
                </div>
                : null}
        </div>
    )
}

export default Gallery;
