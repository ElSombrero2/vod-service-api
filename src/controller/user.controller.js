import {User} from '../models/user.js'
import bcrypt from 'bcrypt'
import Stripe from 'stripe'
import { Sign,Verify } from '../modules/auth.js'

const stripe = new Stripe(process.env.STRIPE_KEY)

class UserController{
    async findOne(req,res){
        try{
            let u = await User.findOne({_id : req.user._id })
            u.password = undefined
            res.json(u)
        }catch(e){ res.status(500).json(e) }
    }

    async addToWatchList(req,res){
        try{
            let user = await User.findOne({_id:req.user._id})
            let result = null
            for(let i=0;i<user.watchlist.length;i++){
                if(user.watchlist[i]._id == req.body._id){
                    result = user.watchlist[i]
                    break
                }
            }
            if(!result){
                user.watchlist.push(req.body)
                user.save()
            }
            res.json({message : 'Added'})
        }catch(e){res.status(400).json({message:'Bad Request!'})}
    }

    async removeFromWatchList(req,res){
        try{
            let user = await User.findOne({_id:req.user._id})
            let result = -1
            for(let i=0;i<user.watchlist.length;i++){
                if(user.watchlist[i]._id == req.params.id){
                    result = i
                    break
                }
            }
            user.watchlist.splice(result,1)
            await user.save()
            res.json({message : 'Removed'})
        }catch(e){
            console.log(e)
            res.status(400).json({message:'Bad Request!'})
        }
    }

    async subscribe(req,res){
        try{
            let u = new User(req.body)
            u.password = bcrypt.hashSync(u.password,5)
            await u.save()
            u.password = undefined
            res.json(u)
        }catch(e){ res.status(400).json(e) }
    }

    async login(req,res){
        try{
            let u = await User.findOne({email : req.body.email })
            if(!u) throw {code : 404,message : 'Not Found!'}
            if(!bcrypt.compareSync(req.body.password,u.password)) throw {code : 400,message :'Wrong password!'}
            res.json({
                token : Sign({
                    email : u.email,
                    _id : u._id
                },process.env.KEY)
            })
        }catch(e){ res.status(400).json(e) }
    }

    async pay(req,res){
        let user = await User.findOne({_id : req.user._id})
        let ver = Verify(user.token,process.env.PAY_KEY)
        if(!ver){
            try{
                const paymentMethod = await stripe.paymentMethods.create({
                    type: 'card',
                    card:{token:req.params.token}
                });

                let intent = await stripe.paymentIntents.create({
                    amount:1000,
                    currency:'usd',
                    metadata:{
                        email:req.user.email,
                        _id:req.user._id
                    },
                    payment_method_types:['card'],
                    payment_method:paymentMethod.id,
                    confirm:true
                })

                await User.updateOne({_id:req.user._id},{
                    token : Sign({},process.env.PAY_KEY,{
                        expiresIn:'730h'
                    })
                })

                res.json({message : 'Payment Success!'})
            }catch(e){res.status(400).json({message : 'Payment Failed!'})}
        }else {res.status(400).json({message : 'Your Subscription is already paid!'})}
    }

    async verifyPayment(req,res){
        let token = Verify(req.query.token,process.env.PAY_KEY)
        res.json({
            value : token
        })
    }

    async changePassword(req,res){
        try{
            await User.updateOne({_id:req.user._id},{password : bcrypt.hashSync(req.body.password,5) })
            res.json({status : 'Changed'})
        }catch(e){ res.status(500).json(e) }
    }
}

export default new UserController()