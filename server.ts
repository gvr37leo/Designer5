import * as express from "express";
import * as bodyParser from "body-parser"
import * as mongodb from "mongodb"
import * as fs from "fs"
import * as path from "path"
import * as escapeRegexp from "escape-regexp"

var mongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/company';
var app = express();
app.use(bodyParser.json());//for json encoded http body's
app.use(bodyParser.urlencoded({ extended: false }));//for route parameters
app.use(express.static('./'));

var port = 8000;
// var exampledefinition = JSON.parse(fs.readFileSync('./public/definition.json','utf8'));
start()

function start(){
    mongoClient.connect(url,function(err,db){
        if(err){
            console.log('error connecting to mongodb retrying in 5 seconds')
            setTimeout(start,5000)
        }
        else {
            console.log('connected to mongo');
        }
    
        app.get('/api/:object', function(req, res){
            var collection = db.collection(req.params.object)
            collection.find({}).toArray(function(err, result){
                res.send(result);
            })
        })
    
        app.post('/api/search/:object', function(req, res){
            var collection = db.collection(req.params.object)
            var query:Query = req.body;
            collection.find(query.filter).sort(query.sort).limit(50).toArray(function(err, result){
                res.send(result);
            })
        })
    
        app.get('/api/:object/:id', function(req, res){
            var collection = db.collection(req.params.object)
            collection.findOne({_id:new mongodb.ObjectID(req.params.id)}).then(function(doc){
                res.send(doc);
            })
        })
    
        app.post('/api/:object', function(req, res){
            var collection = db.collection(req.params.object)
    
            delete req.body._id
            req.body.lastupdate = new Date().getTime()
            collection.insert(req.body, function(err, result){
                if(err)res.send(err)
                else res.send({status:'success'});
            });
        })
    
        app.put('/api/:object/:id', function(req, res){
            var collection = db.collection(req.params.object)
    
            delete req.body._id
            req.body.lastupdate = new Date().getTime()
            collection.update({_id:new mongodb.ObjectID(req.params.id)}, {$set:req.body}, function(err, result){
                if(err)res.send(err);
                else res.send({status:'success'});
            })
        })
    
        app.delete('/api/:object/:id', function(req, res){
            var collection = db.collection(req.params.object)
    
            collection.deleteOne({_id:new mongodb.ObjectID(req.params.id)}, function(err, result){
                if(err)res.send(err)
                else res.send({status:'success'});
            })
        })
    
        app.all('/*', function(req, res, next) {
            res.sendFile(path.resolve('index.html'));
        });
    });
}

app.listen(port, function(){
    console.log('listening on ' + port)
})

declare class Query{
    filter:any
    sort:any
}