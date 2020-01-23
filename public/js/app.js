$(function(){

	function getGifts() {
		console.log("gifts request sent");
		$.get("/api/gifts", (res)=>{ displayGifts(quickSort(res)); });
	}

	function displayGifts(arr) {
		console.log("displaying gifts")
		$("#budgetContent").empty();
		$("#goodContent").empty();
		$("#highContent").empty();
		$("#bigContent").empty();
		for (let gift of arr) {
			$(gift.sortPrice <= 15 
				? "#budgetContent" 
				: gift.sortPrice <= 50
					? "#goodContent"
					: gift.sortPrice <= 150
						? "#highContent"
						: "#bigContent")
			.append(`
				<div id=gift${gift.index} class="giftObject">
					<div class="row">
						<div class="col-lg-8">
							<h4>${gift.name}</h4>
							<h5>${gift.listPrice} - <a href=${gift.link} target="blank">Available here</a></h5>
						</div>
						<div class="col-lg-4">
							<a href=${gift.link} target="blank">
								<img src=${gift.image} class="giftImage" alt=${gift.name}/>
							</a>
						</div>
					</div>
				</div>
			`)
		}
	}

	function quickSort(origArr) {
		if (origArr.length <= 1) { return origArr; } 
		else {
			let left = [], right = [], newArr = [], pivot = origArr.pop(), length = origArr.length;
			for (let i = 0; i < length; i++) { origArr[i].sortPrice <= pivot.sortPrice ? left.push(origArr[i]) : right.push(origArr[i]); }
			return newArr.concat(quickSort(left), pivot, quickSort(right));
		}
	}

	getGifts();

});