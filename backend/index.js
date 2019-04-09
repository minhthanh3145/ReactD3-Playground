const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const FileServices = require('./src/apis/FileServices');
const FileUtils = require('./src/utils/FileUtils'); 

app.use(bodyParser.json({
    limit: '50mb',
    extended: true,
}));

app.get('/file', (req, res) => {
    FileServices.getFiles().then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err + " occured !");
    });
});

app.get('/file/content/:fileName', (req, res) => {
    let fileName = req.params.fileName;
    FileServices.getContent(fileName).then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err + " occured !");
    })
});

app.post('/file', (req, res) => {
    FileServices.saveFileIfNotExisted(req.body.fileName, req.body.content).then(result => {
        console.log(result);
        res.json({ exists: result.exists, msg: result.msg });
    }).catch(err => {
        console.log(err + " occured !");
    });
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);

