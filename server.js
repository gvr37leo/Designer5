"use strict";
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
start();
function start() {
    mongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('error connecting to mongodb retrying in 5 seconds');
            setTimeout(start, 5000);
        }
        else {
            console.log('connected to mongo');
        }
        app.get('/api/:object', function (req, res) {
            var collection = db.collection(req.params.object);
            collection.find({}).toArray(function (err, result) {
                collection.count({}).then(function (count) {
                    res.send({
                        data: result,
                        collectionSize: count
                    });
                });
            });
        });
        app.post('/api/search/:object', function (req, res) {
            var collection = db.collection(req.params.object);
            var query = req.body;
            if (query.filter._id) {
                query.filter._id = new mongodb.ObjectID(query.filter._id);
            }
            collection.find(query.filter).sort(query.sort).skip(query.paging.skip).limit(query.paging.limit).toArray(function (err, result) {
                collection.count({}).then(function (count) {
                    res.send({
                        data: result,
                        collectionSize: count
                    });
                });
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
            req.body.lastupdate = new Date().getTime();
            collection.insert(req.body, function (err, result) {
                if (err)
                    res.send(err);
                else
                    res.send({ status: 'success' });
            });
        });
        app.put('/api/:object/:id', function (req, res) {
            var collection = db.collection(req.params.object);
            delete req.body._id;
            req.body.lastupdate = new Date().getTime();
            collection.update({ _id: new mongodb.ObjectID(req.params.id) }, { $set: req.body }, function (err, result) {
                if (err)
                    res.send(err);
                else
                    res.send({ status: 'success' });
            });
        });
        app.delete('/api/:object/:id', function (req, res) {
            var collection = db.collection(req.params.object);
            collection.deleteOne({ _id: new mongodb.ObjectID(req.params.id) }, function (err, result) {
                if (err)
                    res.send(err);
                else
                    res.send({ status: 'success' });
            });
        });
        app.all('/*', function (req, res, next) {
            res.sendFile(path.resolve('index.html'));
        });
    });
}
app.listen(port, function () {
    console.log('listening on ' + port);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFZLE9BQU8sV0FBTSxTQUFTLENBQUMsQ0FBQTtBQUNuQyxJQUFZLFVBQVUsV0FBTSxhQUM1QixDQUFDLENBRHdDO0FBQ3pDLElBQVksT0FBTyxXQUFNLFNBQ3pCLENBQUMsQ0FEaUM7QUFFbEMsSUFBWSxJQUFJLFdBQU0sTUFDdEIsQ0FBQyxDQUQyQjtBQUc1QixJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQ3RDLElBQUksR0FBRyxHQUFHLG1DQUFtQyxDQUFDO0FBQzlDLElBQUksR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDO0FBQ3BCLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQSw4QkFBOEI7QUFDekQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBLHNCQUFzQjtBQUMxRSxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUU5QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsMEZBQTBGO0FBQzFGLEtBQUssRUFBRSxDQUFBO0FBRVA7SUFDSSxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBQyxVQUFTLEdBQUcsRUFBQyxFQUFFO1FBQ25DLEVBQUUsQ0FBQSxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUM7WUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLG1EQUFtRCxDQUFDLENBQUE7WUFDaEUsVUFBVSxDQUFDLEtBQUssRUFBQyxJQUFJLENBQUMsQ0FBQTtRQUMxQixDQUFDO1FBQ0QsSUFBSSxDQUFDLENBQUM7WUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixD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