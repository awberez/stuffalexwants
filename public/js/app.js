$(function(){

	let giftsArr = [];

	function getGifts() {
		console.log("gifts request sent");
		$.get("/api/gifts", (res)=>{ 
			giftsArr = res;
			displayGifts(giftsArr);
		});
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
























