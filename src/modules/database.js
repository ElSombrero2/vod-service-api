import mongoose from 'mongoose'

async function loadMongoose(){
    const db = await mongoose.connect(process.env.CS,{
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useCreateIndex : true
    })
    return db
}

export {loadMongoose}