import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'


type Post={
  id: number
  title: string
  content: string
  created_at: string
}

export default function Posts() {
  const [posts, setPosts]=useState([])
  const [title, setTitle]=useState('')
  const [content, setContent]=useState('')  
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY || '',
  )
  
  const fetchPosts = async () => { 
    const {data}=await supabase.from('posts').select('*').order('created_at', {ascending: false})
    console.log(data)
    setPosts(data)
  }
  
  const createPost = async () => {
    await supabase.from('posts').insert([{title, content}]).single()
    fetchPosts()
  }
  
  useEffect(() => {
    fetchPosts()
  },[])
  
  const handleAdd = (e) => { 
    e.preventDefault()
    setTitle('')
    setContent('')
    createPost()
   }
  
  return (
    <div className='text-center space-y-3 px-6 max-w-2xl'>
      <h1 className='text-3xl'>Posts</h1>
      
       <form>
        <div className='flex items-center justify-center space-x-3'>
          
          <label htmlFor="title">
            Title <input id='title' name='title' value={title} placeholder='title' type="text" className='border border-gray-300 px-3 py-2 rounded'
            onChange={(e)=>setTitle(e.target.value)}
            />
          </label>
          <label htmlFor="content">
            Content <input id='content' name='content' value={content} placeholder='content' type="text" className='border border-gray-300 px-3 py-2 rounded' 
            onChange={(e)=>setContent(e.target.value)}
            />
          </label>
          <button 
          onClick={handleAdd}
          className='bg-purple-500 hover:bg-purple-600 font-semibold text-white px-6 py-3 rounded-full'>Add</button>
        </div>
      </form>
      
      <div className='space-y-3'>
          {posts.map((post: Post)=>(
            <div className='bg-purple-100 rounded-lg px-4 py-2 space-y-1'>
              <div className='text-xl font-semibold'>{post.title}</div>
              <div className=''>{post.content}</div>
              <div className='text-gray-500'>{post.created_at.substring(0,10)}</div>
            </div>
          ))}  
      </div>
    </div>
  )
}
