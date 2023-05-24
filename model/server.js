import express from "express"
import dotenv from "dotenv"
dotenv.config()
export class Server{
    constructor(){
        this.app=express()
        this.port=process.env.PORT
        this.middlewares()
        
    }

    middlewares(){
        //Servimos el contenido estatico
        this.app.use(express.static('public'))
    }
    listen(){
        this.app.listen(this.port,()=>{
            console.log(`Example app listening on port ${this.port}`)
        })
    }
    

}