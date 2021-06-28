import {app} from '../modules/app.js'
import UserController from '../controller/user.controller.js'
import { AuthFilter } from '../modules/auth.js'

export default function UserRouter(url){
    app.get(url,AuthFilter(),UserController.findOne)
    app.post(url + '/watchlist',AuthFilter(),UserController.addToWatchList)
    app.delete(url + '/watchlist/:id',AuthFilter(),UserController.removeFromWatchList)
    app.post(url,UserController.subscribe)
    app.post(url + '/login',UserController.login)
    app.get(url + '/pay/token/:token',AuthFilter(),UserController.pay)
    app.get(url + '/pay/verify',UserController.verifyPayment)
    app.put(url + '/password',AuthFilter(),UserController.changePassword)
}

