import express from 'express';
import mongoose from 'mongoose';
import Post from './Models/Post.js';

const URL_BD = "mongodb+srv://backendcourse:Mopolopo2002@cluster0.2ppyina.mongodb.net/?retryWrites=true&w=majority";

const PORT = 3000;

const app = express()


app.use(express.json())

app.get('/', (req, res) => {
    console.log(req.query)
    console.log(req.body)
    res.status(200).json({body : { title : 'Привет, мир!'}});
})

app.post( '/post', async (req, res) => {

    const throwError = ( message, errors = {}) => {
        res.status(500).json({ message: "ERROR", error: message, errors})
    }

    try{

        const { title, description } = req.body;

        const errors = {}

        if ( !title ){
            errors.title = 'Укажите название поста';
        }

        if ( !description ){
            errors.description = 'Укажите описание поста';
        }
        if ( Object.keys(errors).length ){
            throwError( 'Есть незаполненные поля', errors );
        }

        const post = await Post.create( { title, description } );

        res.status(200).json( { message: 'SUCCESS', body : `Пост с заголовком ${title} добавлен`, post} )

    }catch(err){
        throwError('Ошибка сервера');
    }

})

async function startApp() {

    try{
        await mongoose.connect(URL_BD, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        app.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}`)
        })
    }catch(err){
        console.log('SERVER IS DROP DOWN');
        console.log(err);
    }

}

startApp()