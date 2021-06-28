import {app} from './modules/app.js'
import {loadMongoose} from './modules/database.js'
import MovieRouter from './routers/movie.router.js'
import UserRouter from './routers/user.router.js'

async function main(){
    try{
        let db = await loadMongoose()
        UserRouter('/user')
        MovieRouter('/movie')
        app.listen(process.env.PORT)
    }catch(e){ console.error(e) }
}

export default main