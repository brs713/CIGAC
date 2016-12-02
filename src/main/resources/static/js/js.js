


$(document).ready(function() {

	/***	
	Calendar Control
	 ***/

	let now = new Date()
	console.log("now is", now)

	let copydate = new Date(now)

	let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		
	let populateDaynumbers = function(range){
		
		copydate.setDate(copydate.getDate() - copydate.getDay());
		
		for (let i=0; i<range; ++i) {

			if (copydate.getDate() !== 1) { 
				$('#day'+i).text(copydate.getDate());
			}
			else {
				$('#day'+i).text(monthNames[copydate.getMonth()].charAt(0));
			}
			copydate.setDate(copydate.getDate() + 1);
		} 
	}
	
	populateDaynumbers(13);
	
	
	// BUTTON HANDLERS - NEXT, PREV
	$('#next-week').find('button').click(function(){
		populateDaynumbers(13);
		console.log('clickup')
	});

	$('#prev-week').click(function(){
		copydate.setDate(copydate.getDate() - 20);
		populateDaynumbers(13);
		console.log('clickdown')
	});

});