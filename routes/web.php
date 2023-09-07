<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SchoolController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/* Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
}); */



Route::post('/createAlbum', [SchoolController::class, 'createAlbum']);
Route::post('/checkMyClasses', [SchoolController::class, 'checkMyClasses']);
Route::post('/getPhotos', [SchoolController::class, 'getPhotos']);
Route::post('/uploadImages', [SchoolController::class, 'uploadImages']);

Route::post('/getAlbums', [SchoolController::class, 'getAlbums']);
Route::post('/addClassCount', [SchoolController::class, 'addClassCount']);
Route::post('/getMyClass', [SchoolController::class, 'getMyClass']);
Route::get('/users', [SchoolController::class, 'getUsers']);
Route::get('/getMessages', [SchoolController::class, 'getMessages']);
Route::post('/addMessage', [SchoolController::class, 'addMessage']);
Route::post('/addReaction', [SchoolController::class, 'addReaction']);
Route::post('/addToMyClasses', [SchoolController::class, 'addToMyClasses']);
Route::post('/classDetail', [SchoolController::class, 'classDetail']);
Route::post('/enrollToClass', [SchoolController::class, 'enrollToClass']);
Route::post('/insertClass', [SchoolController::class, 'insertClass']);
Route::post('/insertYear', [SchoolController::class, 'insertYear']);
Route::post('/getDetail', [SchoolController::class, 'getDetail']);
Route::post('/getClasses', [SchoolController::class, 'getClasses']);
Route::post('/countClass', [SchoolController::class, 'countClass']);
Route::post('/getSchools', [SchoolController::class, 'getSchools']);
Route::post('/getMembers', [SchoolController::class, 'getMembers']);

/* Route::get('/', function () {
    return Inertia::render('App');
})->middleware(['auth'])->name('app'); */


Route::get('/', function () {
    return Inertia::render('App');
})->name('home');

/*
 Route::get('/guest', function () {
    return Inertia::render('App');
})->name('guest');
 */

require __DIR__.'/auth.php';
