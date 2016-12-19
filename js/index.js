// Entire search animation function
var searchAnimation = function() {
	// Fade out search icon and text
	$(this).effect("clip",200, function() {
		// Fade in input field and button
		$("#searchInput").fadeIn("fast", function() {
			// Widen input field and show button
			$("#search").animate({"width":"70%"}, 200);
		});
	});
};

// Wiki API Call
var getWiki = function() {

	wikiDivRemove();
	removeError();

	// Construct query string
	var searchTerm = $("#search").val();

	if (searchTerm === "") {
		displayError();
		searchTerm = " ";
	}


	var data = {
		action: "action=opensearch",
		search: "&search=" + searchTerm,
		limit: "&limit=10",
		namespace: "&namespace=0",
		format: "&format=json"
	};
	var dataString = data.action + data.search + data.limit + data.namespace + data.format;

	// Call Wiki API
	$.ajax({
		method:"GET",
		url:"https://en.wikipedia.org/w/api.php?" + dataString,
		dataType:"jsonp",
		success: function(json) {
			if (json) {
				var titleArray = json[1];
				var descArray = json[2];
				var linkArray = json[3];
				var arrayLength = titleArray.length; // Could be any array returned

				if (arrayLength === 0) {
					displayError();
				} else {
					for (var i = 0; i < arrayLength; i++) {
						
						var divString = "<div class='wikiDiv'><a target='_blank' href='" + linkArray[i] + "'>" +
										   "<div class='article'><div class='title'>" + titleArray[i] + "</div>" + 
									       "<div class='info'>" + descArray[i] + "</div></a></div>"

						$(divString).appendTo("#wikiArticles").effect("slide", 200);
					}
				}
			}
		},
		complete: function() {
			wikiDivHover();
		}
	});
}

// Reset function
var resetFunction = function() {
	$("#search").val("");
	wikiDivRemove();
	removeError();
}

// Error handlers
var removeError = function() {
	$("#errorMessage").hide("fast");
}

var displayError = function() {
	$("#errorMessage").show("fast");
}

// Div show/remove
var wikiDivRemove = function() {
	$(".wikiDiv").fadeOut(200, function() {
		$(this).remove();
	});
}

var wikiDivHover = function() {
	$(".wikiDiv").hover(function() {
			$(this).toggleClass("border");
	});
}

// Click event handlers
$("#searchIcon").on("click", searchAnimation);
$("#resetBtn").on("click", resetFunction);
$("#searchBtn").on("click", getWiki);
$("#search").keypress(function(event) {
	if(event.keyCode === 13) {
		$("#searchBtn").trigger("click");
	}
});

