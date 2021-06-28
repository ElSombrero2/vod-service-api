import multer from 'multer'
import fs from 'fs'
import mime from 'mime-types'

const upload = multer({dest : 'uploads' })

const files = [
    {
        name : 'cover',
        maxCount : 1
    },
    {
        name : 'image',
        maxCount : 1
    },
    {
        name : 'media',
        maxCount : 1
    }
]

const PATH = 'uploads/'

const ExtendTimeout = (ms) => {
    return (req,res,next) => {
        res.setTimeout(ms,()=>{})
        next()
    }
}

const FileFilter = () => {
    return (req,res,next) => {
        upload.fields(files)(req,res, () => {
            try{
                const cover = req.files.cover[0]
                const image = req.files.image[0]
                const media = req.files.media[0]

                req.body.cover = PATH + 'cover/' + Date.now() + '_.' + mime.extension(cover.mimetype)
                req.body.image = PATH + 'image/' + Date.now() + '_.' + mime.extension(image.mimetype)
                req.body.media = PATH + 'media/' + Date.now() + '_.' + mime.extension(media.mimetype)

                fs.renameSync(cover.path,req.body.cover)
                fs.renameSync(image.path,req.body.image)
                fs.renameSync(media.path,req.body.media)

                next()
            }catch(e){
                res.status(400).json({message : 'File missing!'})
            }
        })
    }
}

export { FileFilter,ExtendTimeout }