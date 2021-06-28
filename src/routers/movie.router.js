import { app } from '../modules/app.js'
import MovieController from '../controller/movie.controller.js'
import { FileFilter,ExtendTimeout } from '../modules/upload.js'

export default function MovieRouter(url){
    app.get(url,MovieController.findAll)
    app.get(url+'/one/:id',MovieController.findOne)
    app.get(url+'/view/:id',MovieController.view)
    app.get(url+'/most-views', MovieController.mostViews)
    app.get(url+'/random',MovieController.random)
    app.get(url+'/top',MovieController.top)
    app.get(url+'/find/:query',MovieController.search)
    app.post(url,ExtendTimeout(4800000),FileFilter(),MovieController.create)
    app.delete(url+'/:id',MovieController.remove)
}