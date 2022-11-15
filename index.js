var {Telegraf} = require('telegraf')
var bip39 = require('bip39');
var axios = require('axios');
var Web3 = require('web3');
const ethers = require('ethers');
const bot = new Telegraf('5660714085:AAHNmN2UKLhw47WnooyiUXlItybQDDPT8Uc');

let etherValue = [];
let BSCValue = [];
const startBrute = async() => {
    
        let generateMnemonic = bip39.generateMnemonic();
        return generateMnemonic;
        };
    

const getAdr = (mnemonic) =>{
    try{
        const wallet = ethers.Wallet.fromMnemonic(mnemonic);
        return wallet.address
    }catch{
        console.log("Невалидная сидка")
    }
}



const getBalanceETH = async (address) => {
    
try{
    
await axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=893CZ1D4S4B198SBN6PXP3GQ4XDEICURF4`)
.then(res => {
 etherValue = res.data.result;
    }).catch(err => { 
        console.log(err); 
      });
    }catch(e){
        console.warn('ya upal')
    }

    return etherValue;
    
}

const getBalanceBSC = async (address, mnemonic) => {
    try{
    await axios.get(`https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=3BGHR6DZVPVYQXPY9RNRU21V2PDVN9ZR4W`)
    .then(res => {
       BSCValue = res.data.result;
        }).catch(err => { 
            console.log(err); 
          });
        }catch(e){
            console.warn('ya upal')
        }
        return BSCValue;
    }






bot.start((ctx) => {

      ctx.replyWithHTML('<b>Здорова:)</b> \n /brute - для начала');
     })
   
 bot.command('brute', async (ctx) => {
    ctx.replyWithHTML(`<b>Сколько брутить?</b>`)
 })   

 bot.on('message', async (ctx)=> {
    let counter = 0;
    ctx.replyWithHTML(`<b> Начал ${ctx.message.text} операций... </b>`)
    for(i = 0; i <= ctx.message.text; i++ ) {
        (function(ind) {
            setTimeout( async function(){
                if(counter == 1000){
                    ctx.replyWithHTML(`<b> Прошло ${counter} операций</b>`)
                    counter = 0;
                }
                if(i == ind + 1){
                    ctx.replyWithHTML(`<b> Закончил ${ctx.message.text} операций</b>`)
                }
                let mnenomic = await startBrute();
                let wallet = await getAdr(mnenomic);
               
                let balanceETH = await getBalanceETH(wallet)
                console.log(balanceETH);
                if(balanceETH.length !==0 && mnenomic){
                    ctx.replyWithHTML(`<b> ETH - есть транзы \n ${mnenomic}</b>`);
                }
                let balanceBSC = await getBalanceBSC(wallet)
                if(balanceBSC.length !==0 && mnenomic){
                    ctx.replyWithHTML(`<b> BSC - есть транзы \n ${mnenomic}</b>`);
                }
                counter++;

            }, 10000 * ind);
        })(i);
    }

 }) 

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));