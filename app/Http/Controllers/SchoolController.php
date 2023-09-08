<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use App\Models\School;
use App\Models\Membership;
use App\Models\Classes;
use App\Models\User;
use App\Models\Year;
use App\Models\Board;
use App\Models\Myclass;
use App\Models\Gallery;
use App\Models\Album;
use App\Http\Requests\StorePostRequest;
use Illuminate\Support\Facades\Log;
class SchoolController extends Controller
{

/**
     * Store a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       // $users = User::all();
       $users=User::select('name')->get();

        return response()->json(

             $users
        );
    }







function createAlbum(Request $request)
{
$class_id=$request->class_id;
$owner = $request->owner;
$description=$request->description;

Log::info($class_id . ' ' . $owner . ' '. $description);

// zkontroluje, jestli název alba pro danou třídu už neexistuje...
$album=Album::where('class_id', $class_id)->get();


if( !$album->isEmpty())
{
return "exists";
}


Album::insert(['class_id'=>$class_id, 'owner'=>$owner, 'description'=>$description]);

return "OK";

}



// ověří, jestli už uživatel nemá třídu zařazenou do Moje třídy...
function checkMyClasses(Request $request)
{

$user_name= $request->user_name;
$class_id= $request->class_id;

Log::info($user_name . ' ' . $class_id);

$result = Myclass::where('user_name', $user_name)->where('class_id', $class_id)->first();


if($result)
{

return "exists";
}
else
{

return "OK";

}


}


function uploadImages(Request $request)
{


$files=$request->file('fotky');
$album_id=$request->album_id;
$owner=$request->owner;
$class_id=$request->class_id;



foreach($files as $file)
{


$path = $file->store('uploads','public');

Gallery::insert(['class_id'=>$class_id, 'album_id'=>$album_id, 'owner'=>$owner, 'path'=>$path]);

}

return $owner;
}


function getPhotos(Request $request)
{
$album_id=$request->album_id;
$class_id=$request->class_id;
$owner=$request->owner;

if(strlen($owner>0))
$photos=Gallery::where('album_id', $album_id)->where('class_id', $class_id)->where('owner', $owner)->get();
else
$photos=Gallery::where('album_id', $album_id)->where('class_id', $class_id)->get();

$arr=[];

foreach($photos as $photo)
{

$file=Storage::disk('public')->get($photo->path);

array_push($arr,$photo->path);


}

return $arr;

}


function getAlbums(Request $request)
{
$owner=$request->owner;
$class_id=$request->class_id;
$albums = Album::where('class_id', $class_id)->get();

return $albums;

}


function getMyClass(Request $request)
{


$user_name=$request->user_name;

$myClass=Myclass::where('user_name', $user_name)->get();

return $myClass;

}

function getMessages(Request $request)
{
$class_id=$request->class_id;

$messages= Board::where('class_id', $class_id)->get();


return $messages;


}

public function addReaction(Request $request)
{
$class_id=$request->input('class_id');
$sender=$request->input('sender');
$content=$request->input('content');
$date = $request->input('currentdate');
$id = $request->input('id'); // id zprávy, na kterou je reakce...

// zjistí root_id, shift a children_count zprávy, na kterou je reakce

$data= Board::select(['root_id', 'shift', 'children_count'])->where('id', $id)->get();

$shift=$data[0]->shift;
$root_id=$data[0]->root_id;
$children_count = $data[0]->children_count;

$children_count +=1;

$shift = $shift . '-' . $children_count;

Board::insert(['class_id'=>$class_id, 'root_id'=>$root_id, 'shift'=>$shift, 'sender'=>$sender, 'content'=>$content, 'date'=>$date  ]);

// zvýší children_count u zprávy, na kterou je reakce...

Board::where('id', $id)->update(['children_count'=>$children_count]);



}


public function addMessage(Request $request)
{
$class_id=$request->input('class_id');
$sender=$request->input('sender');
$content=$request->input('content');
$date = $request->input('currentdate');


$max_shift=Board::max('max_shift');
$max_shift +=1;


$id= Board::insertGetId(['class_id'=>$class_id, 'shift'=>$max_shift, 'max_shift'=>$max_shift, 'sender'=>$sender, 'content'=>$content, 'date'=>$date  ]);

Board::where('id', $id)->update(['root_id'=>$id]);



}

public function getClasses(Request $request)
{
$year_id=$request->input('year_id');
$school_id=$request->input('school_id');


$classes=Classes::where('year_id', $year_id)->where('school_id', $school_id)->get(); //{ "id": 5,  "school_id": 191,  "year_id": 3,  "year": null,  "class": "5. A"}

foreach($classes as $class)
{

$class_id= $class['id'];

$count = Membership::select('class_id')->where('class_id', $class_id)->count();
if($count==0)
continue;
$class['class'] .= ' (' . $count . ')';


}

Log::info('school id ' . $school_id . ' year id ' . $year_id . ' classes ' . $classes);

return $classes;



}


public function addToMyClasses(Request $request)
{
$class_id=$request->input('class_id');
$user_name=$request->input('user_name');
$school_id=$request->input('school_id');

$year_id=Classes::select('year_id')->where('id', $class_id)->get();
$year=Year::find($year_id);
$year=$year[0]->year;

$class_name =  Classes::select('class')->where('id', $class_id)->get();
$class_name =$class_name[0]->class;


$school_name=School::select('fullname')->where('id', $school_id)->get();
$school_name=$school_name[0]->fullname;

// Ověří, zda už třída není u uživatele v oblíbených uložena...

$result=Myclass::select('id')->where('class_id', $class_id)->where('user_name', $user_name)->get();


// pokud byla nalezena třída, je už v oblíbených
if(!$result->isEmpty())
{
return 'exists';


}
else
{

// jinak třídu ulož do oblíbených...isEmpty

Myclass::insert(['user_name'=>$user_name, 'class_id'=>$class_id, 'class_name'=>$class_name, 'year'=>$year, 'school_id'=>$school_id, 'school_name'=>$school_name]);

return "OK";



}

}

public function classDetail(Request $request)
{
$class_id=$request->input('class_id');

$ids=Membership::select('user_id')->where('class_id', $class_id)->get();

$users=User::find($ids);

return $users;




}


public function enrollToClass(Request $request)
{

$class_id=$request->input('class_id');
$user_id=$request->input('user_id');

if(!$user_id==null)
{
//zkontroluj, zda už uživatel není v dané třídě zapsán...
$result = Membership::select('user_id')->where('class_id', $class_id)->get();

// pokud dotaz vrátil výsledek, je uživatel ve třídě zapsán...
if(!$result->isEmpty())
{
return 'exists';
}
else
{


// pokud uživatel není ještě zapsán, zapiš ho do třídy...
Membership::insert(['class_id'=>$class_id, 'user_id'=>$user_id]);
return true;
}

}

else
{
return false;
}

}















public function getDetail(Request $request)
{

$details=null;

$school_id= $request->input('school_id');

$school= School::where('id', $school_id)->get();

$details = array('schooldetails'=>$school);

$counts=[];



$years = Year::where('school_id', $school_id)->get();

foreach($years as $year)
{
$year_id=$year->id;

$count = Classes::where('year_id', $year_id)->count();

array_push($counts, $count);


}


array_push($details,  $years);

array_push($details, $counts);



return $details;



}

public function insertClass(Request $request)
{
$data=$request->all();
 $school_id=$data['data']['school_id'];
$year_id=$data['data']['year_id'];
$classname=$data['data']['class'];

 // Zkontroluj, jestli přidávaná třída už pro danou školu a ročník neexistuje...

 $result = Classes::select(['class'])->where('school_id', $school_id)->where('year_id', $year_id)->where('class', $classname)->get();


// pokud dotaz třídu nenašel, může být přidána
 if($result->isEmpty())
 {

$class_instance = new Classes();

$class_instance->school_id=$school_id;
$class_instance->year_id=$year_id;
$class_instance->class=$classname;
$class_instance->save();
$id= $class_instance->id;

return $id;

 }
 else
 return 'exists';



}

public function addClassCount(Request $request)
{
$arr=$request->arr;

$res = Arr::map($arr, function ($value) {

$value = json_encode($value);

$value=json_decode($value);

$year_id=$value->year_id;
$year=$value->year;

$count = Classes::where('year_id', $year_id)->count();






$value->count=$count;

return $value;






 });

return $res;

}

public function insertYear(Request $request)
{

$year=  $request->input('year');

$school_id =  $request->input('school_id');


 //Zkontroluj, jestli přidávaný ročník už pro danou školu neexistuje...
$result = Year::select(['year'])->where('school_id', $school_id)->where('year', $year)->get();

   // pokud dotaz ročník nenašel, může být přidán
Log::info('school_id je ' .  $school_id . ' year je ' .  $year . ' vysledek dotazu je ' . $result);
if($result->isEmpty())
{

$year_instance = new Year();

$year_instance->school_id=$school_id;
$year_instance->year=$year;
$year_instance->save();
$id= $year_instance->id;


return (string)$id;

}

else
return 'exists';

}












public function countClass(Request $request)
{
$class_id=$request->input('class_id');

$count = Membership::select('class_id')->where('class_id', $class_id)->count();

return $count;


}


public function getMembers(Request $request)
{


$ids=[];

$class_id=$request->input('class_id');

$idobjects=Membership::select('user_id')->where('class_id', $class_id)->get();


foreach($idobjects as $idobject)
{

array_push($ids, $idobject->user_id);


}




$names = User::find($ids, 'name');



return $names;    // response.data[0].user_id   [{user_id:9}, {user_id:10}]





}




public function getSchools(Request $request)
{
$district = $request->input('district');
$city= $request->input('city');



$schools=School::select(['id', 'fullname', 'district', 'city'])->where('district', $district)->where('city', $city)->get();

//$schools=School::select(['id', 'fullname', 'district', 'city'])->get();
//$schools = DB::table('school')->select('id', 'fullname', 'district', 'city')->where('district', $district)->where('city', $city)->get();
//$schools = DB::table('school')->select('id', 'fullname', 'district', 'city')->get();

if(!$schools->isEmpty())
return $schools;




}

}
