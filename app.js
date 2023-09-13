const express = require('express');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const requestIp = require('request-ip');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(requestIp.mw());
app.use(express.static(path.join(__dirname, 'public')));


// app.use(function (req, res, next) {
//     const path = req.path;
//     console.log('Requested URL:', path);
//     var cookieMYID = req.cookies.myid;
//     if (cookieMYID === undefined) {
//     //   var randomNumber=Math.random().toString();
//     //   randomNumber=randomNumber.substring(2,randomNumber.length);
//     //   res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
//     //   console.log('cookie created successfully');
//     } else {
//       // yes, cookie was already present 
//       //console.log('cookie exists', cookie);
//     } 

//     let cookieREFERREDBY = req.cookies.referredby;
//     if (cookieREFERREDBY === undefined) {

//     } else {

//     }

//     // let test = req.cookies.myCookieName;
//     // console.log("myCookieName = " + test);

//     next();
// });


const supabaseURL = process.env.SUPABASE_URL;
const supabaseKEY = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseURL, supabaseKEY);

app.get('/products', async (req, res) => {
    const {data, error} = await supabase
        .from('products')
        .select()
    res.send(data);
});

app.get('/:id', async (req, res) => {
    const id = req.params.id;
    const referredby = req.query.referredby

    const clientIp = req.clientIp;
    const userAgent = req.headers['user-agent'];

    const hashedUserAgent = hashData(userAgent);
    const hashedIP = hashData(clientIp)

    //  console.log(`ID: ${id} IP: ${hashedIP} User Agent: ${hashedUserAgent}`);

    const {error} = await supabase
        .from('referrals')
        .insert({
            urlhit: id,
            referredby: referredby,
            iphash: hashedIP,
            useragenthash: hashedUserAgent
        })
    if (error) {
        console.error(error)
    }

    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


function hashData(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex');
}