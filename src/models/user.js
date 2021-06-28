import mongoose from 'mongoose'
import { MovieSchema } from './movies.js'

const UserSchema = new mongoose.Schema({
    email : {
        type : mongoose.Schema.Types.String,
        required : true,
        unique : true
    },
    password : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    token : {
        type : mongoose.Schema.Types.String,
        default : null
    },
    watchlist : [MovieSchema]
})

const User = mongoose.model('users',UserSchema)

export {User,UserSchema}