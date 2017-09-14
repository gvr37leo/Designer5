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
            collection.find(req.body).limit(50).toArray(function (err, result) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQW1DO0FBQ25DLHdDQUF5QztBQUN6QyxpQ0FBa0M7QUFFbEMsMkJBQTRCO0FBRzVCLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7QUFDdEMsSUFBSSxHQUFHLEdBQUcsbUNBQW1DLENBQUM7QUFDOUMsSUFBSSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7QUFDcEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBLDhCQUE4QjtBQUN6RCxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUEsc0JBQXNCO0FBQzFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRTlCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQiwwRkFBMEY7QUFDMUYsS0FBSyxFQUFFLENBQUE7QUFFUDtJQUNJLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFDLFVBQVMsR0FBRyxFQUFDLEVBQUU7UUFDbkMsRUFBRSxDQUFBLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBQztZQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsbURBQW1ELENBQUMsQ0FBQTtZQUNoRSxVQUFVLENBQUMsS0FBSyxFQUFDLElBQUksQ0FBQyxDQUFBO1FBQzFCLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBRUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsVUFBUyxHQUFHLEVBQUUsR0FBRztZQUNyQyxJQUFJLFVBQVUsR0FBRyxF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