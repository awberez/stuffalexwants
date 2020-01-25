$(function(){

	let apiDelay;

	function getGifts() {
		console.log("gifts request sent");
		apiDelay = setTimeout(function(){ 
			$("#budgetContent, #goodContent, #highContent, #bigContent, #grailContent").html(`<p>Experiencing abnormal delays retrieving content...</p>`);
			apiDelay = setTimeout(function(){ 
				$("#budgetContent, #goodContent, #highContent, #bigContent, #grailContent").html(`<p>Please refresh your browser or try visiting StuffAlexWants.com at a later time.</p>`);
			}, 10000);
		}, 5000);
		$.get("/api/gifts", (res)=>{ 
			clearTimeout(apiDelay);
			displayGifts(quickSort(res)); 
		});
	}

	function displayGifts(arr) {
		console.log(`displaying ${arr.length} gifts`)
		$("#budgetContent, #goodContent, #highContent, #bigContent, #grailContent").empty();
		for (let gift of arr) {
			$(gift.sortPrice <= 25 
				? "#budgetContent" 
				: gift.sortPrice <= 75
					? "#goodContent"
					: gift.sortPrice <= 250
						? "#highContent"
						: gift.sortPrice <= 750
							? "#bigContent"
							: "#grailContent")
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