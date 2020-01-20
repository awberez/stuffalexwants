const cheerio = require("cheerio"), request = require("request");

module.exports = (app)=>{

	app.post("/api/scrape", function(req, res) {

		console.log("scrape request received");
		console.log(req.body);

		let url = req.body.url, shoeSize = parseFloat(req.body.size), shoeName = req.body.name;
		let customHeaderRequest = request.defaults({
	    headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'}
		});

		customHeaderRequest.get(url, function(err, resp, body){
		  	let $ = cheerio.load(body), results = [];
		  	$("div.inset").each(function(i, element) {

		    	let size = $(element).children("div.title").text();
		    	let price = $(element).children("div.subtitle").text();

		    	if (size == shoeSize) {
		      		results.push({ price: parseFloat(price.substr(1)) });
		  			console.log("price found for " + shoeName);
		      	return false;
		    	}
		  	});

		  	console.log(results)
		  	res.send(results);

		});
	});

};