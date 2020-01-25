const cheerio = require("cheerio"), request = require("request"), giftsArr = require("../gifts.js"),
customHeaderRequest = request.defaults({ headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'} });

module.exports = (app)=>{

	app.get("/api/gifts", (req, res)=>{
		console.log("gifts request received");
		let scrapeArr = [], giftsSent = false;
		for (let object of giftsArr) {
			if(object.scrape) {
				scrapeArr.push(object.name);
				customHeaderRequest.get(object.link, (err, resp, body)=>{
				  	let $ = cheerio.load(body);
				  	$("div.inset").each((i, element)=>{
				    	let size = $(element).children("div.title").text(), price = $(element).children("div.subtitle").text();
				    	if (size == object.size) {
				    		price = parseFloat(price.substr(1).replace(/\,/g, ''));
				    		object.sortPrice = price;
							object.listPrice = `$${price} + s&h`;
							scrapeArr = scrapeArr.filter(e => e !== object.name);
							if (!scrapeArr.length) {
								giftsSent = true;
								res.send(giftsArr);
							};
				  			console.log(`price found for ${object.name}:\n$${price}`);
				      		return false;
				    	}
				  	});
				});
			}
		}
		if (!scrapeArr.length && !giftsSent) { res.send(giftsArr); };
	});

};