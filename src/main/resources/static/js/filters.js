$(document).ready(function(){
	

	let afterDate = 0;
	let beforeDate = 0;
	let aft = new Date();
	let bef = new Date();
	
	console.log('working')
	
	
	/**
	 * Date
	 */
	
	$('#date-filter button:contains("after")').click(function(){
		
		
		let modal = $('#filter-modal')
		//TODO - put in default date of day before ? 'before' : today
		$(modal).find('h4').text('show climbs after what date?:')
		$(modal).find('section').attr('id', 'filter-date-after')
		$('#btn-after').removeClass('hidden')
		$('#btn-after').click(function (){
			
			// convert date from long to date
			aft.setTime($('#selected-date').val())
			console.log(aft + "is getting double clicked?")
			let aftMonth = aft.getMonth() + 1
			let aftDate = aft.getDate()
			let aftYear = aft.getFullYear()
			let aftOutput = aftMonth + " / " + aftDate;
			$('#btn-after').addClass('hidden')

			if ((bef != 0) && (aft > bef)) {
				//TODO notify user that after must come before before -- ***ALERT?
				console.log("AFTER IS GREATER THAN BEFORE, I THINK!!!")
				$(modal).modal('hide');
				return;
			}
			
			//TODO populate active filters with this info
			$('#after').val(aftOutput).removeClass('hidden')					
			$(modal).modal('hide')
		})	
	});
	
	$('#date-filter button:contains("before")').click(function(){
		
		let modal = $('#filter-modal')

		//TODO - put in default date of day after ? 'after' : tomorrow
		
		$(modal).find('h4').text('show climbs before what date?:')
		$(modal).find('section').attr('id', 'filter-date-before')
		$('#btn-before').removeClass('hidden')
		$('#btn-before').click(function (){
			
			// convert date from long to date
			bef.setTime($('#selected-date').val())
			let befMonth = bef.getMonth() + 1
			let befDate = bef.getDate()
			let befYear = bef.getFullYear()
			let befOutput = befMonth + " / " + befDate;
			//TODO - low priority - showYear() function that checks if aftYear & befYear are different, then display both
			$('#btn-before').addClass('hidden')
			
			if ((aft != 0) && (aft > bef)) {
				//TODO notify user that after must come before before -- ***ALERT?
				console.log("AFTER IS GREATER THAN BEFORE, I THINK!!!")
				$(modal).modal('hide');
				return;
			}
			
			//TODO populate active filters with this info
			$('#before').val(befOutput).removeClass('hidden')
			$(modal).modal('hide')
			console.log("looping?")
		})	
	});
	

	/**
	 * TimeOfDay
	 */
	
	$('#slider').slider({
		  values: [0, 24],
		  range: true,
		  max: 24,
  });
	
	$('#slider').on( "slide", function( event, ui ) {
		let left = $(this).slider( "option", "values" )[0];
		let right = $(this).slider( "option", "values" )[1];
		$('#min-time').val(left).removeClass('hidden');
		$('#max-time').val(right).removeClass('hidden');
		//TODO - map displayed values to o'clocks'
		console.log($(this).slider( "option", "values" )[0])
	} );

	
	
	/**
	 * Duration
	 */
	
	$('#dur-slider').slider({
		  values: [0, 24],
		  range: true,
		  max: 24,
  });
	
	$('#dur-slider').on( "slide", function( event, ui ) {
		let left = $(this).slider( "option", "values" )[0];
		let right = $(this).slider( "option", "values" )[1];
		$('#dur-min').val(left).removeClass('hidden');
		$('#dur-max').val(right).removeClass('hidden');
		//TODO - map displayed values to o'clocks'
		console.log($(this).slider( "option", "values" )[0])
	} );

	
	/**
	 * Location
	 */
	

	
});