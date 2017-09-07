"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var path = require("path");
var mongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/company';
var app = express();
app.use(bodyParser.json()); //for json encoded http body's
app.use(bodyParser.urlencoded({ extended: false })); //for route parameters
app.use(express.static('./'));
var port = 8000;
// var exampledefinition = JSON.parse(fs.readFileSync('./public/definition.json','utf8'));
mongoClient.connect(url, function (err, db) {
    if (err)
        console.log('error connecting to mongodb');
    else
        console.log('connected to mongo');
    app.get('/api/:object', function (req, res) {
        var collection = db.collection(req.params.object);
        collection.find({}).toArray(function (err, result) {
            res.send(result);
        });
    });
    app.get('/api/:object/:id', function (req, res) {
        var collection = db.collection(req.params.object);
        collection.findOne({ _id: new mongodb.ObjectID(req.params.id) }).then(function (doc) {
            res.send(doc);
        });
    });
    app.post('/api/:object', function (req, res) {
        var collection = db.collection(req.params.object);
        delete req.body._id;
        collection.insert(req.body, function (err, result) {
            if (err)
                res.send(err);
            res.send('success');
        });
    });
    app.put('/api/:object/:id', function (req, res) {
        var collection = db.collection(req.params.object);
        delete req.body._id;
        collection.update({ _id: new mongodb.ObjectID(req.params.id) }, { $set: req.body }, function (err, result) {
            if (err)
                res.send(err);
            res.send('success');
        });
    });
    app["delete"]('/api/:object/:id', function (req, res) {
        var collection = db.collection(req.params.object);
        collection.deleteOne({ _id: new mongodb.ObjectID(req.params.id) }, function (err, result) {
            if (err)
                res.send(err);
            res.send('success');
        });
    });
    app.all('/*', function (req, res, next) {
        res.sendFile(path.resolve('index.html'));
    });
});
app.listen(port, function () {
    console.log('listening on ' + port);
});
