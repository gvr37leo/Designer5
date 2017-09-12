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
                res.send(result);
            });
        });
        app.post('/api/search/:object', function (req, res) {
            var collection = db.collection(req.params.object);
            collection.find(req.body).toArray(function (err, result) {
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
                else
                    res.send({ status: 'success' });
            });
        });
        app.put('/api/:object/:id', function (req, res) {
            var collection = db.collection(req.params.object);
            delete req.body._id;
            collection.update({ _id: new mongodb.ObjectID(req.params.id) }, { $set: req.body }, function (err, result) {
                if (err)
                    res.send(err);
                else
                    res.send({ status: 'success' });
            });
        });
        app["delete"]('/api/:object/:id', function (req, res) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQW1DO0FBQ25DLHdDQUF5QztBQUN6QyxpQ0FBa0M7QUFFbEMsMkJBQTRCO0FBRTVCLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFDdEMsSUFBSSxHQUFHLEdBQUcsbUNBQW1DLENBQUM7QUFDOUMsSUFBSSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7QUFDcEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBLDhCQUE4QjtBQUN6RCxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUEsc0JBQXNCO0FBQzFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTlCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQiwwRkFBMEY7QUFDMUYsS0FBSyxFQUFFLENBQUE7QUFFUDtJQUNJLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFDLFVBQVMsR0FBRyxFQUFDLEVBQUU7UUFDbkMsRUFBRSxDQUFBLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBQztZQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsbURBQW1ELENBQUMsQ0FBQTtZQUNoRSxVQUFVLENBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxDQUFBO1FBQzFCLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBRUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsVUFBUyxHQUFHLEVBQUUsR0FBRztZQUNyQyxJQUFJLFVBQVUsR0FBRyxF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