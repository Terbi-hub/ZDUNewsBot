import cherio from 'cherio';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk'
import { PuppeteerHandler } from './parse/helpers/puppeteer';
export const p = new PuppeteerHandler();

import TelegramApi from 'node-telegram-bot-api'


const url = 'https://zu.edu.ua/news.html';

const token = '1731067614:AAHlVeDuo0cEbOMWM8lZ1-4nZ1_DzrknxE4';
const bot = new TelegramApi(token, {polling:true});



(async function main() {
   listPageHandle(url)
   
  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if(text === '/getNews') {
    bot.sendMessage(chatId, "Ось останні 5 новин з сайту ЖДУ ім. Івана Франка"); 
    var data = fs.readFileSync('./parse/data/test.json');
    var words = JSON.parse(data);
    const emos = ["💡", "🌍" , "🧠" , "🧊" , "❄️",  "🌅", "🌄", "🌠", "🔎","🔍"]
    words.forEach(element => {
      const rand = Math.floor(Math.random() * 10)
      let messageText = `----------------------------------------------------------------------------------------------------- ${emos[rand]} ${element.title} \n 
        ${element.text}\n -----------------------------------------------------------------------------------------------------`
      bot.sendMessage(chatId, messageText); 
});}})
})();

async function listPageHandle(url) {
  const pageContent =  await p.getPageContent(url);
    const $ = cherio.load(pageContent);
    const numNews = 5;
    const newsItems = [];

    $('#text_color ul li').not("ul").each((i, header) => {
      const title = $(header.children[0]).text();
      const text = $(header.children[2]).text();
      if(newsItems.length < numNews && title !== '' && text !== '') {
      newsItems.push({
        title,
        text
      });
    }});
    saveData(newsItems);
}

function saveData(data) {
  const fileName = `data.json`;
  const savePath = path.join(__dirname, './parse', 'data', fileName);
  return new Promise((resolve, reject) => {
    
    fs.writeFile(savePath, JSON.stringify(data, null, 4), err => {
      if (err) {
        return reject(err);
      }

      console.log(chalk.blue('File was saved successfully: ') + chalk.blue.bold(fileName + '\n'));
      resolve();
    });
  });
}