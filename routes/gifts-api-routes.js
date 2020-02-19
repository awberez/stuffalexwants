const cheerio = require("cheerio"), request = require("request"), cloudscraper = require('cloudscraper'), 
db = require("../models"), Sequelize = require('sequelize'), Op = Sequelize.Op;

let  giftsArr = require("../gifts.js");

module.exports = (app)=>{

	app.get("/api/gifts", (req, res)=>{
		console.log("gifts request received");
		let scrapeArr = [], sendArr = [], giftsSent = false;
		for (let object of giftsArr) { 
			if (object.scrape) { 
				object.key = giftsArr.indexOf(object);
				scrapeArr.push(object);
			}
			else { sendArr.push(object); };
		};
		setTimeout(()=>{ 
			if (!giftsSent) {
				console.log("one or more scrapes timed out, sending gifts");
				giftsSent = true;
				res.send(sendArr);
			};
		}, 10000);
		for (let object of scrapeArr) {
			console.log(`getting price for ${object.name}`);
			db.PriceList.findOne({ where: { key: object.key } }).then((dbGift)=>{
		    	let d = new Date(), timeDif = 30 * 60 * 1000;
		    	if (!dbGift || dbGift.name !== object.name || d.getTime() - timeDif > Date.parse(dbGift.updatedAt)) {
		    		console.log(`scraping for ${object.name}`);
					cloudscraper.get(object.link, (err, resp, body)=>{
						if (!err && resp.statusCode == 200) {
							console.log(`finding ${object.name} price`);
						  	let $ = cheerio.load(body);
						  	if ($("div.inset").children("div.title").text()) {
							  	$("div.inset").each((i, element)=>{
							    	let size = $(element).children("div.title").text(), price = parseFloat($(element).children("div.subtitle").text().substr(1).replace(/\,/g, ''));
							    	if (size == object.size && !isNaN(price)) {
										savePrice(object, price);
									    return false;	
							    	}
							    	else if (i == $("div.inset").length - 1) { savePrice(object, 0); };
							  	}); 
							}
							else if ($("span#priceblock_ourprice")) {
								let price = parseFloat($("span#priceblock_ourprice").text().substr(1).replace(/\,/g, ''));
								if (!isNaN(price)) { savePrice(object, price); }
								else { savePrice(object, 0); };
							}
							else { 
								console.log("failed to locate price data");
								savePrice(object, 0); 
							};
						}
						else { 
							console.log("error scraping site");
							savePrice(object, 0); 
						};
					});
				}
				else {
					console.log(`not scraping for ${object.name}`);
			   		if (!dbGift.price) { sendGifts(object.key); }
			   		else {
			   			addGift(object, dbGift.price);
						sendGifts(object.key);
			   		};
		   		}
		   	});
		}
		savePrice = (object, price) => {
			price ? addGift(object, price) : console.log("no price found");
			db.PriceList.upsert({
				key: object.key,
		        name: object.name,
		        price: price
		    }).then(()=>{ sendGifts(object.key); });
		};
		addGift = (object, price) => {
			object.sortPrice = price, object.listPrice = object.link.includes("amazon") ? `$${price % 1 !== 0 ? price.toFixed(2) : price}` : `$${price} + s&h`;
			console.log(`price found for ${object.name}:\n${object.listPrice}`);
			sendArr.push(object);
		};
		sendGifts = (key) => {
			scrapeArr = scrapeArr.filter(e => e.key !== key)
			if (!scrapeArr.length && !giftsSent) {
				console.log("sending gifts");
				res.send(sendArr); 
				giftsSent = true;
			}
		};
	});

};