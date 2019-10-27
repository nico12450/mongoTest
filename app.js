var express = require('express');
var app = express();
var fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : true}));

const readline = require('readline');

const MongoClient = require('mongodb').MongoClient;
var uri;
var client;
var connection;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var mdp = "";

rl.question('Entrez le mot de passe de la base de donnée : ', (answer) => {
  // TODO: Log the answer in a database
  mdp = answer;
  var uri = "mongodb+srv://nicolas:" + mdp + "@cluster0-k8rai.mongodb.net/test?retryWrites=true&w=majority";
  client = new MongoClient(uri, { useNewUrlParser: true });
  connection = client.connect();
  console.log("mot de passe enregistré");

  rl.close();
});




app.get('/', function(req, res) {

    fs.readFile("main.html", function (error, pgResp) {

            if (error) {

                res.writeHead(404);
                res.write('Contents you are looking are Not Found');

            }

            else {

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(pgResp);

            }
             
            res.end();

        });

});

app.get('/listeUsers',function(req,res){

	res.writeHead(200, {"Content-Type": "application/json"});

	const connect = connection;

	connect.then(() => {

		var db =client.db("baseTest");

		const collection = db.collection("Utilisateurs");

		collection.find({}).toArray(function(err,result){

			if(err){throw err;}
			//console.log(result);
			res.end(JSON.stringify(result));

		});

	});

});

app.post('/submit', function(req, res){

	//console.log("test");
	//console.log(req.body.prenom);
	//console.log(req.body);
	res.redirect('/');

	const connect = connection;

	connect.then(() => {

		var db = client.db("baseTest");

		const collection = db.collection("Utilisateurs");
		// perform actions on the collection object
		collection.insertOne(req.body, function(err,res){

			if(err){

				throw err;

			}

			console.log("document inséré")

		});

	});


});

app.listen(8080);