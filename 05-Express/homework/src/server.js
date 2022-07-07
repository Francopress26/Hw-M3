// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
//Si vamos a recibir info por body esta linea es IMPORTANTISIMAAAAA!!!!
server.use(express.json());

// TODO: your code to handle requests
// 
let id =1
server.post('/posts', (req, res)=>{
  
    const {author,title,contents}=req.body
    const post ={
        author: author,
        title: title,
        contents:contents,
        id:id++}
    if(author && title && contents){
          posts.push(post)
          res.status(200).json(post)
    }else return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"}) 
    
 });


 server.post('/posts/author/:author' ,(req,res)=> {
    const {title,contents} = req.body

    const {author} = req.params

    if(!contents || !title || !author){
        return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"})
    }
    
    const post={
        author: author,
        title: title,
        contents:contents,
        id:id++
    }
    posts.push(post)
    res.status(200).json(post)

 })


 server.get('/posts', (req,res)=>{

    let {term}= req.query

    if(term){
        let postT = posts.filter(Posts => Posts.title.includes(term) || Posts.contents.includes(term))
        return res.send(postT)
    }
    res.json(posts)
 })

 server.get('/posts/:author', (req,res)=>{
    let {author} =req.params

    let post_author = posts.filter(p => p.author===author)
    if(post_author.length >0) return res.send(post_author)
    res.status(STATUS_USER_ERROR).json({error: "No existe ningun post del autor indicado"})


 })

 server.get('/posts/:author/:title', (req,res)=>{
    let {author,title}=req.params

        let posts_author = posts.filter(p => p.author===author && p.title===title)
        if(posts_author.length >0) return res.json(posts_author)
        res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado"})
 })

 server.put('/posts', (req,res)=>{
    let {id,title,contents}=req.body
    if(!id || !title || !contents)return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"})
        // Si me pasan el id por body siempre me llega como nimero pero si me llegara x params o query podria ser string asique me tengo q acordar de parsearlo
    let post_id=posts.find(p=>p.id === id)
    if(!post_id) return res.status(STATUS_USER_ERROR).json({error: "El id no corresponde a ningun post valido existente"})
    post_id.title=title
    post_id.contents=contents
    res.json(post_id)
    // posts=posts.filter(p => p.id !==id)
    // posts.push(post_id)
     // No tengo que hacer lo que esta comentado porque estoy modificando la REFERENCIA DE post_id( averiguar xq)
 })

 server.delete('/posts',(req,res)=>{
    let {id}=req.body
    let post_id=posts.find(p=> p.id ===id)
    if(!id || !post_id){
        return res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"})
    }
    posts=posts.filter(p=> p.id !== id)
    return res.json({success:true})
 })

 server.delete('/author',(req,res)=>{
    let {author}=req.body
    let author_s=posts.filter(p=>p.author===author)
    
    if(!author || author_s.length==0){
        return res.status(STATUS_USER_ERROR).json({error:"No existe el autor indicado"})
    } 
    return res.json(author_s)
 })
module.exports = { posts, server };
