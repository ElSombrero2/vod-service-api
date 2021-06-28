import mongoose from 'mongoose'
import random from 'mongoose-random'


const MovieSchema = new mongoose.Schema({
    title : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    description : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    note : {
        type : mongoose.Schema.Types.Number,
        required : true,
        default : 10
    },
    year : {
        type : mongoose.Schema.Types.Number,
        required : true
    },
    genre : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    image : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    cover : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    media : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    views : {
        type : mongoose.Schema.Types.Number,
        required : true,
        default : 0
    },
})

MovieSchema.plugin(random)

const Movie = mongoose.model('movies',MovieSchema)

export {Movie,MovieSchema}