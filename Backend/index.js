import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'


const app=express()
const PORT=5000
const storage = multer.memoryStorage()

const upload = multer({
    storage
})



app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send("backend running")
})

app.post('/chat',(req,res)=>{
    const msg = req.body.message
    res.json({
        reply : msg
    })
})

app.post("/analyze-resume",upload.array("files"),(req,res)=>{
    const files = req.files
    const prompt = req.body.prompt
    res.json({
        reply: `received ${files.length} files with prompt:${prompt}`
    })
})

app.listen(PORT,()=>{
    console.log(`Backend running in http://localhost:${PORT}`)
})