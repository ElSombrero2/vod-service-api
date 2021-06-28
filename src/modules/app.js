import express from 'express'
import cors from 'cors'
import { Verify } from './auth.js'

const app = express()

const filter = () => {
    return (req,res,next) => {
        let token = req.query.token
        if(token === 'null') token = null
        let data = Verify(token,process.env.PAY_KEY)
        if(!data) res.status(401,{message : 'Unauthorized!'})
        else next()
    }
}

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
app.use('/uploads/cover',express.static('uploads/cover'))
app.use('/uploads/image',express.static('uploads/image'))
app.use('/uploads/media',filter(),express.static('uploads/media'))

export {app}