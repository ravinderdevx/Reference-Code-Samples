<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Post;
use DB;

class PostsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth', ['except' => ['index', 'show']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $posts_per_page = 10;

        $data = array();
        
        //$data['posts'] = Post::all();
        //$data['posts'] = Post::where('title', 'Post Two')->get();
        //$data['posts'] = DB::select("SELECT * FROM posts");

        $data['posts'] = Post::orderBy('created_at', 'desc')->paginate($posts_per_page);
        return view('posts.index')->with($data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('posts.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'title' => 'required',
            'body' => 'required'
        ]);
        
        // Create Post
        $post = new Post;
        $post->title = $request->input('title');
        $post->body = $request->input('body');
        $post->user_id = auth()->user()->id;
        $post->save();
        
        $data = array();
        $data['success'] = 'Post Created Successfully';

        return redirect('/posts')->with($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = array();
        $data['post'] = Post::find($id);
        return view('posts.show')->with($data);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $data = array();
        $post = Post::find($id);

        //Check for User
        if(Auth()->user()->id !== $post->user_id) {
            $data['error'] = 'Unauthorized Access.';
            return redirect('/posts')->with($data);
        }
        
        $data['post'] = $post;
        return view('posts.edit')->with($data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'title' => 'required',
            'body' => 'required'
        ]);
        
        // Create Post
        $post = Post::find($id);
        $post->title = $request->input('title');
        $post->body = $request->input('body');
        $post->save();
        
        $data = array();
        $data['success'] = 'Post Updated Successfully';

        return redirect('/posts')->with($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $data = array();
        
        $post = Post::find($id);

        //Check for User
        if(Auth()->user()->id !== $post->user_id) {
            $data['error'] = 'Unauthorized Access.';
            return redirect('/posts')->with($data);
        }

        $post->delete();

        $data['success'] = 'Post Removed Successfully';

        return redirect('/posts')->with($data);
    }
}
