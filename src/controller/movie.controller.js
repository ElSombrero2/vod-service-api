import { Movie } from '../models/movies.js'
import fs from 'fs'

class MovieController{

    async create(req,res){
        try{
            let m = new Movie(req.body)
            await m.save()
            res.json(m)
        }catch(e){
            fs.unlink(req.uploadFiles.cover , err => console.log(req.body.cover + ' DELETED!'))
            fs.unlink(req.uploadFiles.image , err => console.log(req.body.image + ' DELETED!'))
            fs.unlink(req.uploadFiles.media , err => console.log(req.body.media + ' DELETED!'))
            res.status(500).json(e)
        }
    }

    async findAll(req,res){
        try{
            let m = await Movie.find()
            res.json(m)
        }catch(e){ res.status(500).json(e)}
    }

    async findOne(req,res){
        try{
            let m = await Movie.findOne({_id:req.params.id})
            res.json(m)
        }catch(e){ res.status(500).json(e)}
    }

    async view(req,res){
        try{
            let m = await Movie.findOne({_id:req.params.id})
            m.views += 1
            await m.save()
            res.json(m)
        }catch(e){ res.status(500).json(e)}
    }

    async mostViews(req,res){
        try{
            let m = await Movie.find().limit(3).sort({views : -1})
            res.json(m)
        }catch(e){ res.status(500).json(e)}
    }

    async random(req,res){
        try{
            let m = await Movie.findRandom().limit(3)
            res.json(m)
        }catch(e){ res.status(500).json(e)}
    }

    async top(req,res){
        try{
            let m = await Movie.find().limit(3).sort({note:-1})
            res.json(m)
        }catch(e){ res.status(500).json(e)}
    }

    async search(req,res){
        try{
            let m = await Movie.find()
            let q = req.params.query.toLowerCase()
            res.json(m.filter( m => {
                if(m.title.toLowerCase().includes(q) ||
                    m.year.toString().toLowerCase().includes(q) ||
                    m.genre.toLowerCase().includes(q) ||
                    m.description.toLowerCase().includes(q)
                ) return m
            }))
        }catch(e){ res.status(500).json(e)}
    }

    async remove(req,res){
        try{
            let m = await Movie.findOne({_id:req.params.id})
            if(!m) throw {code : 404,message : 'Not Found !'}
            fs.unlinkSync(m.media)
            fs.unlinkSync(m.cover)
            fs.unlinkSync(m.image)
            await Movie.deleteOne({_id:req.params.id})
            res.json({message : 'DELETED'})
        }catch(e){res.status(400).json(e)}
    }
}

export default new MovieController()