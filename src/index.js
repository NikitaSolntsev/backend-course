import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import router from './router.js'
import getCorrectDate from "./utils/getCorrectDate/index.js";

import axios from "axios";

import TelegramApi from 'node-telegram-bot-api'
import Post from "./Models/Post.js";

const telegram_bot_token = process.env.TELEGRAM_BOT_TOKEN;

const URL_BD = process.env.URL_BD;

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
            {command : '/create_post', description : 'Создать пост с рандомным фактом про котов' },
        ] )

        bot.on( 'message', async (msg) => {

            try{
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
                    if ( posts.length ){
                        posts.forEach( (post) => {
                            bot.sendMessage( chatID, `ID: ${post?._id}\nЗаголовок: ${post?.title}\nОписание: ${post?.description}\nДата: ${ getCorrectDate(post?.create_at)}` );
                        } )
                    }else{
                        bot.sendMessage( chatID, `Постов нет` );
                    }
                }
                else if ( text === '/create_post' ){
                    bot.sendMessage( chatID, 'Случайный факт про кошек:' );

                    const resFact = await axios.get('https://catfact.ninja/fact');
                    const post = await Post.create( { title : 'Рандомный факт', description : resFact?.data?.fact, create_at : new Date() } );
                    bot.sendMessage( chatID, `Пост создан:\nЗаголовок: ${post?.title}\nОписание: ${post?.description}\nДата: ${getCorrectDate(post.create_at)}` );
                }
                else if ( text.includes( '/delete_post' ) ){
                    const id = text.substr(13, text.length );
                    const deletedPost = await Post.findByIdAndDelete(id);
                    if ( deletedPost ){
                        bot.sendMessage( chatID, `Пост с id ${id} удалён.`);
                    }else{
                        bot.sendMessage( chatID, `Пост с id ${id} не найден.`);
                    }

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
        console.log('Telegram bot crashed');
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
        console.log('Server crashed');
    }

}

startApp()