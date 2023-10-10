import express from 'express';
import mongoose from 'mongoose';
import router from './router.js'

const URL_BD = "mongodb+srv://backendcourse:Mopolopo2002@cluster0.2ppyina.mongodb.net/?retryWrites=true&w=majority";

const PORT = 3000;

const app = express()

app.use(express.json())
app.use('/api', router)

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