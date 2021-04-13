var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('search', { results: null });
});

router.post('/', function(req, res) {
	console.log(req.body);
	var searchResults = getSearchResults(req.body.search_query);
  	res.render('search', { results: searchResults });
});

module.exports = router;

//simple name & elements keyword search
function getSearchResults(query) {
	//load faux results
	var recipes = JSON.parse(fs.readFileSync('./public/fauxResults/recipes.json','utf-8')).recipes;

	console.log("fauxResults VVV");
	console.log(recipes);

	var results = [];

	if(query) {
		recipes.forEach(recipe => {
			console.log(recipe);
			if(recipe['name'].includes(query)) { //if name includes term, this gets to go first 
				results.push(recipe);
			}
			recipe['elements'].forEach(recipeElement => {
				if(recipeElement['name'].includes(query) && !recipeExists(recipe['name'], results)) { //if ingredients match and we haven't already added this recipe
					results.push(recipe);
				}
			});
		});
	} else {
		return recipes;
	}

	console.log("generated results VVV");
	console.log(results);

	return results;
}

//helper for getSearchResults
function recipeExists(name, results) {
	let exists = false;
	console.log("recipeExists called");
	console.log("current results VVV");
	console.log(results);
	results.forEach(recipe => {
		if(name === recipe['name']) {
			exists = true;
		}
	});

	return exists;
}