/** This is a temporary server for testing/reference. Not meant to be used in production! */
let fs = require('fs'); let path = require('path');
const express = require('express');
let app =  express();
app.use(require('body-parser').json());
let port = 8000;

app.use((req, res, next)=>{
    console.log(`${req.method} Request for ${req.url}`); next();
});

app.get('/api/getJson', (req,res)=>{
    fs.readFile('./directory.json', 'utf-8', (err, data) => {
        if (err) console.error(err);
        res.send(JSON.parse(data));
    });
});

app.get('/api/shouldUpdate', (req,res)=> {
    let path = './prod'
    if (!fs.existsSync('./prod')) {
        console.error('No directory: ', path);
        res.json('Not Found.');
    } else {
        let name = fs.readdirSync(path).filter(f => f.includes('styles.'))[0];
        if (name) {
            name = name.split('styles.')[1].split('.css')[0];
            res.json(name);
        } else res.json('Not Found.');
    }
});

app.use('/data', express.static('./data'));

app.use('/', express.static('./prod'));

app.listen(port, _=>{ console.log(`Listening in on ${port}...`); });