const fetch = require('node-fetch');
var random = require('random-name')
var randomize = require('randomatic')
const readlineSync = require('readline-sync');
const cheerio = require('cheerio');
const delay = require('delay')

const getCookie = () => new Promise((resolve, reject) => {
    fetch(`https://android.swirge.com/register?ref=renoandrian`, {
        method: 'GET'
    }).then(async res => {
        const $ = cheerio.load(await res.text());
        const result = {
            cookie: res.headers.raw()['set-cookie'],
            //csrf: $('input[name=csrf_test_name]').attr('value')
        }

        resolve(result)
    })
    .catch(err => reject(err))
});

const functionRegist = (username, email, realCookie) => new Promise((resolve, reject) => {
    const params = new URLSearchParams;
    params.append('username', username);
    params.append('email', email)
    params.append('password', 'Berak321#');
    params.append('confirm_password', 'Berak321#')
    params.append('gender', 'male');
    params.append('accept_terms', 'on')

    fetch(`https://android.swirge.com/requests.php?f=register`, { 
        method: 'POST', 
        body: params,
        headers: {
            'Host': 'android.swirge.com',
            'Accept': '*/*',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.32 (KHTML, like Gecko) Chrome/86.0.4240.150 Safari/537.36',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://android.swirge.com',
            'Referer': 'https://android.swirge.com/register?ref=renoandrian',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'id-ID,id;q=0.9',
            'Cookie': realCookie
        }
    })
    .then(res => res.json())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

(async () => {
    try {
        const nama = random.first()
        const rand = randomize('0', 5)
        const email = `${nama}${rand}@gmail.com`
        const username = `${nama}${rand}`
        console.log(`[+] Email: ${email}`)
        const cookie = await getCookie()
        const sessid = cookie.cookie[0].split(';')[0]
        const adcon = cookie.cookie[1].split(';')[0]
        const us = cookie.cookie[3].split(';')[0]
        const realCookie = `${sessid}; ${adcon}; mode=day; access=1; src=1; _ga=GA1.2.710439838.1606528728; _gid=GA1.2.426015510.1606528728; _gat_gtag_UA_148709929_1=1; ${us}`
        const regist = await functionRegist(username, email, realCookie)
        if(regist.errors == '<i class="fa fa-check"></i> Registration successful! We have sent you an email, Please check your inbox/spam to verify your email.'){
            console.log('[+] Regist berhasil !')
        } else {
            console.log('[!] Regist gagal ! IP LIMIT !')
        }
    } catch (e) {
        console.log(e);
    }   
})()