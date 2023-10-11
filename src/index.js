import express from 'express';
import mongoose from 'mongoose';
import router from './router.js'
import PostController from "./Controllers/PostController.js";

import axios from "axios";

import TelegramApi from 'node-telegram-bot-api'
import Post from "./Models/Post.js";

const telegram_bot_token = '6367946154:AAGfyApvzlZk5QaTs56LHW3cJIARGNpEo98';

const URL_BD = "mongodb+srv://backendcourse:Mopolopo2002@cluster0.2ppyina.mongodb.net/?retryWrites=true&w=majority";

const bot = new TelegramApi(telegram_bot_token, { polling: true })

const PORT = 4321;

const app = express()

app.use(express.json())
app.use('/api', router)

async function startApp() {

    try{

        bot.setMyCommands( [
            {command : '/random_fact', description : 'Рандомный факт про котов'},
            {command : '/posts', description : 'Получить все посты'},
            {command : '/create_post', description : 'Создать пост с рандомным фактом про котов' }
        ] )

        bot.on( 'message', async (msg) => {

            try{
                console.log(msg)

                const text = msg.text;
                const chatID = msg.chat.id;

                if ( text === '/random_fact' ){

                    bot.sendMessage( chatID, 'Случайный факт про кошек:' );
                    axios.get('https://catfact.ninja/fact')
                        .then( ({data}) => {
                            bot.sendMessage( chatID, data.fact );
                        })

                }
                else if ( text === '/posts' ){
                    const posts = await Post.find()
                    posts.forEach( (post) => {
                        bot.sendMessage( chatID, `Заголовок: ${post?.title}\nОписание: ${post?.description}` );
                    } )
                }
                else if ( text === '/create_post' ){
                    bot.sendMessage( chatID, 'Случайный факт про кошек:' );

                    const resFact = await axios.get('https://catfact.ninja/fact');
                    const post = await Post.create( { title : 'Рандомный факт', description : resFact?.data?.fact } );
                    bot.sendMessage( chatID, `Пост создан:\nЗаголовок: ${post?.title}\nОписание: ${post?.description}` );
                }
                else{
                    bot.sendMessage( chatID, `Привет! Ты написал мне ${text}` );
                }
            }catch (err){
                console.log(err)
            }

        } )

        console.log('Telegram bot is working')

    }catch(err){
        console.log('Telegram bot is drop down');
        console.log(err);
    }

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
    }

}

startApp()