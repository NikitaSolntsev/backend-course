import express from 'express';
import mongoose from 'mongoose';
import router from './router.js'

import axios from "axios";

import TelegramApi from 'node-telegram-bot-api'

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
            {command : '/my_name', description : 'Получить своё имя'}
        ] )

        bot.on( 'message', msg => {

            try{

                // console.log(msg)

                const text = msg.text;
                const chatID = msg.chat.id;

                if ( text === '/random_fact' ){

                    bot.sendMessage( chatID, 'Случайный факт про кошек:' );
                    axios.get('https://catfact.ninja/fact')
                        .then( ({data}) => {
                            bot.sendMessage( chatID, data.fact );
                        })

                }
                else if ( text === '/my_name' ){
                    bot.sendMessage( chatID, `Твое имя: ${msg?.chat?.first_name}` );
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
        // console.log(err);
    }

}

startApp()