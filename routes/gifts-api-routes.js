const cheerio = require("cheerio"), request = require("request");

module.exports = (app)=>{

	let giftsArr = [
		{name: `Flatiron Pepper Co "I Can't Feel My Face" Pepper Flakes`, 
			image: "./images/flatironpepper.jpg", 
			link: "https://www.flatironpepper.com/collections/frontpage/products/i-cant-feel-my-face",
			sortPrice: 19.95,
			listPrice: "$19.95 + s&h"},
		{name: `Lace Lab Red Flat Shoe Laces (63")`, 
			image: "./images/lacelabred.jpg", 
			link: "https://www.lacelab.com/collections/flat-laces/products/red-shoe-laces?variant=7899986693",
			sortPrice: 4.95,
			listPrice: "$4.95 + s&h"},
		{name: `Dinner at Sushi Taku`, 
			image: "./images/sushitaku.jpg", 
			link: "http://www.sushitaku.com",
			sortPrice: 33,
			listPrice: "~$33/person (after tax & tip)"},
		{name: `Apple iPhone 7 Plus Leather Case (Black)`, 
			image: "./images/iphonecase.jpg", 
			link: "https://www.apple.com/shop/product/MQHJ2ZM/A/iphone-8-plus-7-plus-leather-case-taupe?fnode=99&fs=f%3Diphone7plus%26fh%3D458b%252B47e1",
			sortPrice: 49,
			listPrice: "$49"},
		{name: `Pyritized Ammonite`, 
			image: "./images/ammonite.jpg", 
			link: "https://davesrockshop.com/pyritized-ammonites-holzmaden-germany.html",
			sortPrice: 62.5,
			listPrice: "$62.50"},
		{name: `Stance Socks Star Wars Duos 4 Pack (Large)`, 
			image: "./images/stancesw.jpg", 
			link: "https://www.ebay.com/itm/Stance-NEW-Unisex-Star-Wars-Duos-4-Pack-Socks-Multi-BNWT/254399781541?hash=item3b3b689aa5:m:mr8LgANaxH8nVV3RC1_QxOQ&var=553998741878",
			sortPrice: 84,
			listPrice: "$84.25 + s&h"},
		{name: `Stainless Steel Liquor Pour Spouts`, 
			image: "./images/spouts.jpg", 
			link: "https://www.amazon.com/Liquor-Pour-Spouts-Set-Stainless/dp/B01LW2L7R9?th=1",
			sortPrice: 9.99,
			listPrice: "$9.99"},
		{name: `Buffalo Wild Wings Mango Habanero Sauce`, 
			image: "./images/bwwmango.jpg", 
			link: "https://www.amazon.com/Buffalo-Wild-Wings-Sauce-Habanero/dp/B00D4XNNCM",
			sortPrice: 13.5,
			listPrice: "$13.50"},
		{name: `KitchenAid Pasta Roller Set`, 
			image: "./images/roller.jpg", 
			link: "https://www.amazon.com/KitchenAid-KSMPRA-3-Piece-Roller-Attachment/dp/B01DBGQR1K",
			sortPrice: 139,
			listPrice: "$139"},
		{name: `Air Max 1 Tinker Sketch to Shelf Black (Size 10)`, 
			image: "./images/airmaxtinker.jpg", 
			link: "https://stockx.com/nike-air-max-1-tinker-sketch-to-shelf-black",
			size: 10,
			scrape: true},
		{name: `Nintendo Switch`, 
			image: "./images/switch.jpg", 
			link: "https://www.amazon.com/Nintendo-Switch-Neon-Blue-Joy%E2%80%91/dp/B07VGRJDFY/ref=sr_1_1?keywords=nintendo%2Bswitch&qid=1577222266&sr=8-1&th=1",
			sortPrice: 299,
			listPrice: "$299"},
		{name: `New Balance 997 Todd Snyder Hudson Train Station (Size 10)`, 
			image: "./images/snydertrain.jpg", 
			link: "https://stockx.com/new-balance-997-todd-snyder-hudson-train-station",
			size: 10,
			scrape: true},	
		{name: `adidas 4D Runner Pharrell Tech Olive (Size 10)`, 
			image: "./images/4dpharrell.jpg", 
			link: "https://stockx.com/adidas-4d-runner-pharrell-tech-olive",
			size: 10,
			scrape: true},
	]

	app.get("/api/gifts", function(req, res) {
		console.log("gifts request received");
		let scrapeArr = [];
		for (let object of giftsArr) {
			if(object.scrape) {
				scrapeArr.push(object.name);
				let customHeaderRequest = request.defaults({ headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'} });
				customHeaderRequest.get(object.link, function(err, resp, body){
				  	let $ = cheerio.load(body), results = [];
				  	$("div.inset").each(function(i, element) {
				    	let size = $(element).children("div.title").text(), price = $(element).children("div.subtitle").text();
				    	if (size == object.size) {
				    		price = parseFloat(price.substr(1));
				    		object.sortPrice = price;
							object.listPrice = "$" + price + " + s&h";
							scrapeArr = scrapeArr.filter(e => e !== object.name);
							if (!scrapeArr.length) { res.send(giftsArr); };
				  			console.log("price found for " + object.name);
				  			console.log("$" + price);
				      	return false;
				    	}
				  	});
				});
			}
		}
	});

};