var express = require('express');
var path = require('path');
var fs = require('fs');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;

router.get('/', function(req, res, next) {
	const userinfo = req.userContext && req.userContext.userinfo;
  res.render('search', 
  	{ 
  		results: null,
   		title: 'ejs',
   		isLoggedIn: !!userinfo,
     	userinfo: userinfo
	});
});

router.post('/', async function(req, res) {
	console.log(req.body);
	const userinfo = req.userContext && req.userContext.userinfo;
	var searchResults = await getSearchResults(req.body);
  	res.render('search', 
  		{
  		 	results: searchResults,
  		 	title: 'ejs',
  		 	isLoggedIn: !!userinfo,
	  		userinfo: userinfo
  		});
});

module.exports = router;

const SKIP_DB = false; //for testing, skip database query

//simple name & elements keyword search
async function getSearchResults(query) {

	//var results = [];

	if(!SKIP_DB) {
		//load mongodb atlas credentials
		const atlasCredentials = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'credentials', 'mongoDBAtlas.json')));
		//login to recipe database
		let connectString = 'mongodb+srv://<username>:<password>@recipes.bfoel.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
		connectString = connectString.replace('<username>', atlasCredentials['username']);
		connectString = connectString.replace('<password>', atlasCredentials['password']);
		const client = await MongoClient.connect(connectString, { useUnifiedTopology: true });
		console.log('DATABASE: Connected');

		const db = client.db('recipes');
		const recipesCollection = db.collection('recipes');

		//name from query
		const searchName = query['search_query'];

		//dietary flags from query
		let searchDietaryFlags = [];
		if(query['dairy-free'] != null) {
			searchDietaryFlags.push('DAIRY-FREE');
		}
		if(query['gluten-free'] != null) {
			searchDietaryFlags.push('GLUTEN-FREE');
		}
		if(query['vegetarian'] != null) {
			searchDietaryFlags.push('VEGETARIAN');
		}
		if(query['vegan'] != null) {
			searchDietaryFlags.push('VEGAN');
		}

		let dbQuery = {
			name: { $regex: new RegExp(searchName), $options: 'i' } //match as 'contains', ignore case
		};

		if(searchDietaryFlags.length > 0) {
			dbQuery.dietaryFlags = { $all: searchDietaryFlags }; //must have all specified restrictions
		}

		const queryResp = await recipesCollection.find(dbQuery, {projection: {_id: 0}}).toArray();
		console.log(queryResp.length + ' results: VVV');
		console.log(queryResp);
		client.close();
		return queryResp;
	}
}
	

//NOTE: the code below assumes 'query' is just the name search string, but current impl has 'query' as requestBody object.

	//load faux results
// 	var recipes = JSON.parse(fs.readFileSync('./public/fauxResults/recipes.json','utf-8')).recipes;

// 	console.log("fauxResults VVV");
// 	console.log(recipes);

// 	var results = [];

// 	if(query) {
// 		recipes.forEach(recipe => {
// 			console.log(recipe);
// 			if(recipe['name'].includes(query)) { //if name includes term, this gets to go first 
// 				results.push(recipe);
// 			}
// 			recipe['elements'].forEach(recipeElement => {
// 				if(recipeElement['name'].includes(query) && !recipeExists(recipe['name'], results)) { //if ingredients match and we haven't already added this recipe
// 					results.push(recipe);
// 				}
// 			});
// 		});
// 	} else {
// 		return recipes;
// 	}

// 	console.log("generated results VVV");
// 	console.log(results);

// 	return results;
// }

// //helper for getSearchResults
// function recipeExists(name, results) {
// 	let exists = false;
// 	console.log("recipeExists called");
// 	console.log("current results VVV");
// 	console.log(results);
// 	results.forEach(recipe => {
// 		if(name === recipe['name']) {
// 			exists = true;
// 		}
// 	});

// 	return exists;
// }