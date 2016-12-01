


$(document).ready(function() {

	/***	
	Calendar Control
	 ***/

	let now = new Date()

	let copydate = new Date(now)

	let populateDaynumbers = function(){
		for (let i=0; i<13; ++i) {

			$('#day'+i).text(copydate.getDate());
			copydate.setDate(copydate.getDate() + 1);
		} 
	}
	
	populateDaynumbers();
	console.log(now, copydate)
	
	$('#next-week').find('button').click(function(){
		populateDaynumbers();
		console.log('clickup')
	});

	$('#prev-week').click(function(){
		copydate.setDate(copydate.getDate() - 30);
		populateDaynumbers();
		console.log('clickdown')
	});

});