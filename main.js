var winnerCount = 1;
var started = false;
var entries = [];

$("#pickAWinner").click(function(){
	//need to use a nested element since it messed up the layout on destroy. 
	//its probably removing styles but I don't have time to look into it
	$("#fireworkBG .bg").fireworks('destroy');
	
	//fetch entries.txt if we don't have it
	if (entries.length == 0 && started == false){
		started = true;
		$.ajax({
			url : "entries.txt",
			dataType: "text",
			success : function (data) {
				entries = data.split("\r\n");
				if ( testRandomReturnsAll(entries) ){
					getWinner(entries);
				}else{
					alert("ERROR: full range not possible no winner selected. Please check your entires.txt for possible incorrect data");
				}
			}
		});
	}else{
		if (entries.length > 0){
			if ( testRandomReturnsAll(entries) ){
				getWinner(entries);
			}else{
				alert("ERROR: full range not possible no winner selected. Please check your entires.txt for possible incorrect data");
			}
		}else{
			alert("All Winners have been picked!");
		}
	}
});

/**
 * getWinner
 * gets a random winner and drops the name onto the page (then trigger fireworks)
 */
function getWinner(entries){
	var winnerID = getRandomNumber(1,entries.length);
	
	//make it zero base
	//yes I know I could have done getRandomNumber(entries.length-1) but this is cleaer
	var realWinnerID = winnerID-1;
	var winnerName = entries[realWinnerID];
	
	//output winner into the h1 called winnerName
	//could write this on a single line but that looks a mess and is hard to read
	//$("#winnerName").html(entries[getRandomNumber(entries.length-1)]);
	$("#winnerName").html("Winner #" +winnerCount+"<br/>"+winnerName);
	$('#fireworkBG .bg').fireworks();
	winnerCount++;
	removeWinnerFromPool(realWinnerID);
}

/**
 * getRandomNumber
 * feteches a random number between start and end (inculsive) using rando
 */
function getRandomNumber(start, end){
	return rando(start,end);
}

/**
 * testRandomReturnsAll
 * returns true when full range has been returned to confirm random is working correctly and no people are left out
 */
function testRandomReturnsAll(entries){
	
	var fullRangePossible = false;
	var breakLimit = entries.length * 1000;
	var counter = 0;
	
	var expectedRange = range(1, entries.length, 1);
	while (fullRangePossible == false){
		var newRandomNumber = getRandomNumber(1,entries.length);
		for( var i = 0; i < expectedRange.length; i++){ 
			if ( expectedRange[i] === newRandomNumber) { 
				expectedRange.splice(i, 1); 
			}
		}
		
		if (expectedRange.length == 0){
			fullRangePossible = true;
		}
		counter++;
		if (counter > breakLimit){
			break;
		}
	}
	console.log("It took "+counter+" interations to get full range, so now continue");
	return fullRangePossible;

}

/**
 * range
 * just generates a simple range array
 */
function range(start, stop, step) {
    var a = [start], b = start;
    while (b < stop) {
        a.push(b += step || 1);
    }
    return a;
}
/**
 * removeWinnerFromPool
 * remove winner so they can't be pulled again
 */
function removeWinnerFromPool(arrayPos){
	entries.splice(arrayPos, 1); 
}