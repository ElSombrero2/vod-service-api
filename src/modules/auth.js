import jwt from 'jsonwebtoken'

const Sign = (payload,key,opt) => {
    return jwt.sign(payload,key,opt)
}

const Verify = (token,key) => {
    try{
        return jwt.verify(token,key)
    }catch(e){
        return null
    }
}

const AuthFilter = () => {
    return (req,res,next) => {
        const user = Verify(req.headers['x-auth'],process.env.KEY)
        if(user){
            req.user = user
            next()
        }else res.status(401).json({message : 'Unauthorized!'})
    }
}

export { Sign,Verify,AuthFilter }