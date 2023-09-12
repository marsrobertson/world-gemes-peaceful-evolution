const express = require('express');
const path = require('path');

const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');


const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(requestIp.mw());

// set a cookie
app.use(function (req, res, next) {
    // check if client sent cookie
    var cookieMYID = req.cookies.myid;
    if (cookieMYID === undefined) {
    //   var randomNumber=Math.random().toString();
    //   randomNumber=randomNumber.substring(2,randomNumber.length);
    //   res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
    //   console.log('cookie created successfully');
    } else {
      // yes, cookie was already present 
      //console.log('cookie exists', cookie);
    } 

    let cookieREFERREDBY = req.cookies.referredby;
    if (cookieREFERREDBY === undefined) {

    } else {

    }


    next();
});
  
const supabase = createClient("https://gjvyxbowkyqyousawtma.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqdnl4Ym93a3lxeW91c2F3dG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM2NDgzOTUsImV4cCI6MjAwOTIyNDM5NX0.kDOlvf-iWRTws94H7lhWO6-kj8JL84y31t_WOY4ZmO0");

app.get('/products', async (req, res) => {
    const {data, error} = await supabase
        .from('products')
        .select()
    res.send(data);
});

app.get('/:id', (req, res) => {
    const id = req.params.id;

    const clientIp = req.clientIp;
    const userAgent = req.headers['user-agent'];

    console.log(`ID: ${id} IP: ${clientIp} User Agent: ${userAgent}`);

    
    // Send the index.html file as a response
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});