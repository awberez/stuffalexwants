const cheerio = require("cheerio"), request = require("request"), cloudscraper = require('cloudscraper'), 
db = require("../models"), Sequelize = require('sequelize'), Op = Sequelize.Op;

let  giftsArr = require("../gifts.js");

module.exports = (app)=>{

	app.get("/api/gifts", (req, res)=>{
		console.log("gifts request received");
		let scrapeArr = [], sendArr = [], giftsSent = false;
		for (let object of giftsArr) { 
			if (object.scrape) { 
				object.index = giftsArr.indexOf(object);
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
			db.PriceList.findOne({
		        where: { 
		        	key: object.index,
		        	name: object.name 
		        }
		    }).then((dbGift)=>{
		    	let d = new Date(), timeDif = 15 * 60 * 1000;
		    	if (!dbGift || d.getTime() - timeDif > Date.parse(dbGift.updatedAt)) {
		    		console.log(`scraping for ${object.name}`);
					cloudscraper.get(object.link, (err, resp, body)=>{
						console.log(`finding ${object.name} price`);
					  	let $ = cheerio.load(body);
					  	if ($("div.inset").children("div.title").text()) {
						  	$("div.inset").each((i, element)=>{
						    	let size = $(element).children("div.title").text(), price = parseFloat($(element).children("div.subtitle").text().substr(1).replace(/\,/g, ''));
						    	if (size == object.size && !isNaN(price)) {
						    		newPrice(object, price, sendArr);
									console.log(`price found for ${object.name}:\n$${price}`);
									db.PriceList.upsert({
										key: object.index,
								        name: object.name,
								        price: price,
								        no_price: false
								    }).then(()=>{
								    	scrapeArr = scrapeArr.filter(e => e.index !== object.index), giftsSent = sendGifts(res, scrapeArr, sendArr, giftsSent);
								    });
								    return false;	
						    	}
						    	else if (i == $("div.inset").length - 1) {
						    		console.log("no price found");
						    		db.PriceList.upsert({
										key: object.index,
								        name: object.name,
								        price: 0,
								        no_price: true
								    }).then(()=>{
								    	scrapeArr = scrapeArr.filter(e => e.index !== object.index), giftsSent = sendGifts(res, scrapeArr, sendArr, giftsSent);
								    });
									return false;	
						    	}
						  	}); 
						}
						else {
							console.log("failed to retrieve price data");
							db.PriceList.upsert({
								key: object.index,
						        name: object.name,
						        price: 0,
						        no_price: true
						    }).then(()=>{
						    	scrapeArr = scrapeArr.filter(e => e.index !== object.index), giftsSent = sendGifts(res, scrapeArr, sendArr, giftsSent);
						    });
						};
					});
				}
				else {
					console.log(`not scraping for ${object.name}`);
			   		if (dbGift.no_price) {
			   			scrapeArr = scrapeArr.filter(e => e.index !== object.index), giftsSent = sendGifts(res, scrapeArr, sendArr, giftsSent);
			   		}
			   		else {
			   			newPrice(object, dbGift.price, sendArr)
						scrapeArr = scrapeArr.filter(e => e.index !== object.index), giftsSent = sendGifts(res, scrapeArr, sendArr, giftsSent);
			   		};
		   		}
		   	});
		}
	});

	newPrice = (object, price, arr) => {
		object.sortPrice = price, object.listPrice = `$${price} + s&h`;
		arr.push(object);
	}

	sendGifts = (res, scrapeArr, sendArr, giftsSent) => {
		if (!scrapeArr.length && !giftsSent) {
			console.log("sending gifts");
			res.send(sendArr); 
			return true;
		}
		else return false;
	}

};