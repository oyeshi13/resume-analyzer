import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import {PDFParse} from 'pdf-parse'
import fs from 'fs'


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

app.post("/analyze-resume",upload.array("files"),async (req,res)=>{
    const files = req.files
    const prompt = req.body.prompt
    
    try{
        const uint8 = new Uint8Array(files[0].buffer)
        const parse = await new PDFParse(uint8)

        const result = await parse.getText()
        res.json({
        reply: result.text.slice(0,150)
    })
    }catch(err){
        res.json({
            reply: err.message
        })
    }
    

})

app.listen(PORT,()=>{
    console.log(`Backend running in http://localhost:${PORT}`)
})