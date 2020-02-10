const cheerio = require("cheerio"), request = require("request"), cloudscraper = require('cloudscraper');
let  giftsArr = require("../gifts.js");

module.exports = (app)=>{

	app.get("/api/gifts", (req, res)=>{
		console.log("gifts request received");
		let scrapeArr = [], giftsSent = false, scrapeFail;
		scrapeFail = setTimeout(()=>{ 
			for (let object of giftsArr) {
				if(object.scrape) { giftsArr = giftsArr.filter(el => el.name !== object.name); }
			};
			res.send(giftsArr);
		}, 10000);
		for (let object of giftsArr) {
			if(object.scrape) {
				scrapeArr.push(object.name);
				console.log(`getting price for ${object.name}`);
				cloudscraper.get(object.link, (err, resp, body)=>{
					clearTimeout(scrapeFail);
					console.log(`finding ${object.name} price`);
				  	let $ = cheerio.load(body);
				  	if ($("div.inset").children("div.title").text()) {
					  	$("div.inset").each((i, element)=>{
					  		console.log(`checking div ${i+1}`);
					    	let size = $(element).children("div.title").text(), price = parseFloat($(element).children("div.subtitle").text().substr(1).replace(/\,/g, ''));
					    	if (size == object.size && !isNaN(price)) {
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
					    	if (i == $("div.inset").length - 1 && scrapeArr.includes(object.name)) {
					    		console.log("no price found");
								scrapeArr = scrapeArr.filter(e => e !== object.name);
					  			giftsArr = giftsArr.filter(el => el.name !== object.name);
					  			if (!scrapeArr.length && !giftsSent) { res.send(giftsArr); };
					    	}
					  	}); 
					}
					else {
						console.log("failed to retrieve price data");
						scrapeArr = scrapeArr.filter(e => e !== object.name);
			  			giftsArr = giftsArr.filter(el => el.name !== object.name);
			  			if (!scrapeArr.length && !giftsSent) { res.send(giftsArr); };
					};
				});
			}
		}
	});

};