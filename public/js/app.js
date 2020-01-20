$(function(){

	let giftsArr = [];

	function getGifts() {
		$.get("/api/gifts", (res)=>{ 
			console.log("gifts request sent");
			giftsArr = res;
			scrapePrice(giftsArr);
		});
	}

	function scrapePrice(arr) {
		let scrapeArr = [];
		for (let object of arr) {
			if(object.scrape) {
				let data = {
					url: object.link,
					size: object.size,
					name: object.name
				}
				scrapeArr.push(object.name);
				$.post("/api/scrape", data, (res)=>{
					console.log("scrape request sent");
			  		if (!res) alert("Failure");
					else console.log(res);
					object.sortPrice = res[0].price;
					object.listPrice = "$" + res[0].price + " + s&h";
					console.log(object);
					scrapeArr = scrapeArr.filter(e => e !== object.name)
					if (!scrapeArr.length) {
						displayGifts(giftsArr);
					}
				});
			}
		}
	}

	function displayGifts(arr) {
		console.log("displaying gifts")
		$("#budgetContent").empty();
		$("#goodContent").empty();
		$("#highContent").empty();
		$("#bigContent").empty();
		for (let object of arr) {
			$(object.sortPrice <= 15 
				? "#budgetContent" 
				: object.sortPrice <= 50
					? "#goodContent"
					: object.sortPrice <= 150
						? "#highContent"
						: "#bigContent")
			.append(`
				<div id=gift${object.index} class="giftObject">
					<div class="row">
						<div class="col-lg-8">
							<h4>${object.name}</h4>
							<h5>${object.listPrice} - <a href=${object.link} target="blank">Available here</a></h5>
						</div>
						<div class="col-lg-4">
							<a href=${object.link} target="blank">
								<img src=${object.image} class="giftImage" alt=${object.name}/>
							</a>
						</div>
					</div>
				</div>
			`)
		}
	}

	getGifts();

});
























