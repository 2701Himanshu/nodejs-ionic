var express = require('express');
var faker = require('faker');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('test', ['users']);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//list all documents
router.get('/users/list', function(req, res){
	db.users.find(function (err, docs) {
		console.log(docs);
		results = JSON.parse(JSON.stringify(docs));
	    // res.render('contact', {title: 'Customer App', users: results});
	    res.json(results);
	});
});

//add a single document
router.post('/users/add', function(req, res, next){
	var newUser = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
	};
	db.users.insert(newUser, function(err, result){
		if(err){
			// console.log(err);
			res.send(err);
		}
		// res.redirect('/contact');
		res.send(result);
	});
});

//delete a single document
router.delete('/users/delete', function(req, res, next){
	var removedID = {"_id": mongojs.ObjectId(req.body.id)};
	db.users.remove( removedID, function(err, result){
		if(err){
			res.send(err);
		}
		res.json(result);
	});
});

//show details of a single document
router.post('/users/details',function(req, res, result){
	var userID = {"_id": mongojs.ObjectId(req.body.id)};
	console.log(userID);
	db.users.findOne( userID, function(err, result){
		if(err){
			res.send(err);
		}
		res.json(result);
	});
});

//update single document details
router.patch('/users/update', function(req, res, next){
	var userID = {"_id": mongojs.ObjectId(req.body.id)};
	console.warn("Updated : "+userID);
	var dataToUpdate = {
		"first_name": req.body.first_name,
		"last_name": req.body.last_name,
		"email": req.body.email
	};
	db.users.update(
		userID, 
		{ 
			$set: dataToUpdate
		},
		function(err, result){
			if(err) {
				res.send(err);
			}
			res.json(result);
		}
	);
});



// router.get('/about', function(req, res, next) {
//   res.render('about', { title: 'About' });
// });

router.get('/api', function(req, res, next){
	var users = [];
	for(var i=0;i<20;i++){
		users.push({
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			username: faker.internet.userName(),
			email: faker.internet.email(),
		});
	}
	res.status(200).json(users);
});

router.get('/getDetails/:id', function(req, res, next) {
	var dataToReturn = {
		id: req.params,
		name: 'Himanshu',
		age: 21,
		address: 'Nankari',
		contact: '+917275436937',
		nickName: 'chutiya'
	}
  res.json(dataToReturn);
});

var cb1 = function(req, res, next){
	console.log('cb1');
	next();
}
var cb2 = function(req, res, next){
	console.log('cb2');
	next();
}
var cb3 = function(req, res){
	res.send('return output.');
}

router.get('/ab+cd', [cb1,cb2,cb3]);

router.post('/postData', function(req, res, next){
	res.json(req.params);
});

module.exports = router;
