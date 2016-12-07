$(document).ready(function(){
	
	console.log('working')

//	let initVals = {};
//	initVals['displayFilter'] = 'All';
//	initVals['date-after'] = ['dateAfter', false]
//	initVals['date-before'] = ['dateBefore', false],
//	initVals['time-min'] = ['timeMin', false],
//	initVals['time-max'] = ['timeMax', false],
//	initVals['dur-min'] = ['durMin', false],
//	initVals['dur-max'] = ['durMax', false],
//	initVals['show-gyms'] = ['showGyms', true]
//	initVals['show-crags'] = ['showCrags', false]
//	initVals['locs-dropdown'] = ['locs', []]	//array
//	initVals['climbers-dropdown'] = ['climbers', []]	//array
	
	let displayFilter = 'All';
	let dateAfter = false;
	let dateBefore = false;
	let timeMin = 0;
	let timeMax = 24;
	let durMin = 0;
	let durMax;
	let showGyms = true;
	let showCrags = false;
	let locs = [];	//array
	let climbers = [];	//array
	let now = new Date();

	
	/**
	 * Display - get filter criteria
	 */
    
    let dfset = $('.display-filter')
    $('.display-filter').click(function() {
    	displayFilter = $(this).text().trim();
    	filterDisplay(displayFilter)
    	if (displayFilter != "All") {  // because showing all records isn't filtering
    		console.log("should apply filter here")
    		applyFilter('display', displayFilter)// ???
    	}
    	else {
    		$('#filter-bar-display').addClass('hidden')
    		console.log('\t\t\thiding?')
    	}
    	render();
    })

    let filterDisplay = function(divText) {
    	dfset.removeClass('df-active');
    	$('.display-filter:contains('+divText+')').addClass('df-active');    
    }
	
	/**
	 * Date - get filter criteria
	 */
	
    // TODO - verify / rewrite Date - get filter criteria
    
    let afterDate = 0;
	let beforeDate = 0;
	let aft = new Date();
	let bef = new Date();
	$('#date-filter button:contains("after")').click(function(){
		
		let modal = $('#filter-modal')
		//TODO - put in default date of day before ? 'before' : today
		$(modal).find('h4').text('show climbs after what date?:')
		$(modal).find('section').attr('id', 'filter-date-after')
		$('#btn-after').removeClass('hidden')
		$('#btn-after').click(function (){
			
			dateAfter = parseFloat($('#selected-date').val(), 10)
			
			// convert date from long to date
			aft.setTime($('#selected-date').val())
			console.log(aft + "is getting double clicked?")
			let aftMonth = aft.getMonth() + 1
			let aftDate = aft.getDate()
			let aftYear = aft.getFullYear()
			let aftOutput = aftMonth + " / " + aftDate;
			$('#btn-after').addClass('hidden')

//			if ((bef != 0) && (aft > bef)) {
//				//TODO notify user that after must come before before -- ***ALERT?
//				console.log("AFTER IS GREATER THAN BEFORE, I THINK!!!")
//				$(modal).modal('hide');
//				return;
//			}
			
			//TODO populate active filters with this info
			$('#date-after').val(aftOutput).removeClass('hidden')
			$(modal).modal('hide')
			applyFilter('date-after', aftOutput+" ")  // ???
			render()

		})	
	});
	
	$('#date-filter button:contains("before")').click(function(){
		
		let modal = $('#filter-modal')

		//TODO - put in default date of day after ? 'after' : tomorrow
		
		$(modal).find('h4').text('show climbs before what date?:')
		$(modal).find('section').attr('id', 'filter-date-before')
		$('#btn-before').removeClass('hidden')
		$('#btn-before').click(function (){
			
			dateBefore = parseFloat($('#selected-date').val(), 10)
			
			// convert date from long to date
			bef.setTime($('#selected-date').val())
			let befMonth = bef.getMonth() + 1
			let befDate = bef.getDate()
			let befYear = bef.getFullYear()
			let befOutput = befMonth + " / " + befDate;
			//TODO - low priority - showYear() function that checks if aftYear & befYear are different, then display both
			$('#btn-before').addClass('hidden')
			
//			if ((aft != 0) && (aft > bef)) {
//				//TODO notify user that after must come before before -- ***ALERT?
//				console.log("AFTER IS GREATER THAN BEFORE, I THINK!!!")
//				$(modal).modal('hide');
//				return;
//			}
			
			//TODO populate active filters with this info
			$('#date-before').val(befOutput).removeClass('hidden')
			$(modal).modal('hide')
			console.log("looping?")
		   	applyFilter('date-before', befOutput+" ") // ???
		   	render()
		})	
	});
	

	
	/**
	 * TimeOfDay - get filter criteria
	 */
	
	$('#time-slider').slider({
		  values: [0, 24],
		  range: true,
		  max: 24,
  });
	
	$('#time-slider').on('slide', function(event, ui) {
		
		//TODO - map displayed values to o'clocks'
		
        var index = $(ui.handle).index();
        	if (index == 1) { // left handle
        		$('#time-min').val(ui.values[0]).removeClass('hidden');
        		timeMin = ui.values[0]
        		applyFilter('time-min', "Earliest: "+timeMin+" hrs ")
        	}
        	if (index == 2) { //right handle
        		$('#time-max').val(ui.values[1]).removeClass('hidden');
        		timeMax = ui.values[1]
        		applyFilter('time-max', "Latest: "+timeMax+" hrs ")
        	}
		render()
	});
	

	
	/**
	 * Duration - get filter criteria
	 */
	
	$('#dur-slider').slider({
		  values: [0, 24],
		  range: true,
		  max: 24,
	});
	
	$('#dur-slider').on('slide', function(event, ui) {
   		durMin = ui.values[0] *60*60*1000 -5000
		durMax = ui.values[1] *60*60*1000 +5000
		//TODO - map displayed values to hours
		
        var index = $(ui.handle).index();
    	if (index == 1) { // left handle
    		$('#dur-min').val(ui.values[0]).removeClass('hidden');
    		applyFilter('dur-min', "Shortest: "+durMin+" hrs ")
     	}
    	if (index == 2) { //right handle
    		$('#dur-max').val(ui.values[1]).removeClass('hidden');
    		applyFilter('dur-max', "Latest: "+durMax+" hrs ")
    	}

    	render()
	} );

	
	/**
	 * Location - get filter criteria
	 */
	
	$('#show-gyms').on('change', function(){ 
		if ($('#show-gyms').prop('checked') == true) {
			showGyms = true;
			applyFilter('show-gyms', "in Gyms ")
		}
		else {
			showGyms = false;
		}
		render()
	})
	
	$('#show-crags').on('change', function(){ 
		if ($('#show-crags').prop('checked') == true) {
			showCrags = true;
		}
		else {
			showCrags = false;
		}
		render()
	})
		

	$('#location-filter select').change(function(){
		let chosen = $(this).val()
		let option = $('#location-filter option:selected')
		locs.push(option.text())
		option.addClass('hidden')
		$(this).val(0)
		render(option.text())
	})
	

	
	/**
	 * Climbers - get filter criteria
	 */
		
	$('#climber-filter select').change(function(){
		let chosen = $(this).val()
		let option = $('#climber-filter option:selected')
		climbers.push(option.text())
		option.addClass('hidden')
		$(this).val(0)
		render(option.text())
	})
	
	
	
	/**
	 * Accepting a Climb!
	 */
		
    $('.accept-climb').click(function(e){
    	let fail = false;
    	
    	// TODO - WISHLIST - if user has another climb that overlaps this one
    		//confirmation alert - if yes
    			//fail = true
    			//cancel other climb
    	
    	let form = $(this).parents('form');
    	let userInitiator = form.find('.climblist-item-name-init').find('span').text()
    	let userLogged = form.find('.user-logged').text()

    	// TODO if user logged == lurker
    		//fail = true;
    	
    	
    	if (fail) {
    		e.preventDefault();
    	}
    })
	
    
    
	
	/**
	 * Filter Bar
	 */
   
    let filterDivs = [ 
    				"display",
    				"date-after",
					"date-before",
					"time-min",
					"time-max",
					"show-gyms",
					"show-crags",
					"locs-dropdown",
					"climbers-dropdown",
					"dur-min",
					"dur-max" ]

	let filterBar = $('#filter-bar')
    
	// populate filter bar
	filterDivs.forEach(function(filter){
		let elem = $('<div id="filter-bar-'+filter+'" style="display: inline-block" class="hidden")><a><span>[ X ]</span></a></div>')
		filterBar.append(elem)
	})
	
	locsFiltered = []
	climbersFiltered = []
	
	// when you click on a div in the filter-bar
	filterBar.find('div').click(function(){
		$(this).addClass('hidden')
		
		// display
		if ($(this).attr('id') == 'filter-bar-display') {
			filterDisplay("All")
		}
				
		// date
		if ($(this).attr('id') == 'filter-bar-date-after') {
			dateAfter = false;
			$('#date-after').addClass('hidden')
		}
		
		if ($(this).attr('id') == 'filter-bar-date-before') {
			dateBefore = false;
			$('#date-before').addClass('hidden')
		}
		
		// time
		if ($(this).attr('id') == 'filter-bar-time-min') {
			timeMin = 0;
			$('#time-slider').slider('option', 'values', [timeMin, timeMax])
			$('#time-min').addClass('hidden')
		}
		
		if ($(this).attr('id') == 'filter-bar-time-max') {
			timeMax = 24;
			$('#time-slider').slider('option', 'values', [timeMin, timeMax])
			$('#time-max').addClass('hidden')
		}
		
		// show-gyms
		if ($(this).attr('id') == 'filter-bar-show-gyms') {
			$('#show-gyms').prop('checked', 'false')
		}
		
		// show-crags
		if ($(this).attr('id') == 'filter-bar-show-crags') {
			$('#show-crags').prop('checked', 'false')
		}
		
		// duration
		if ($(this).attr('id') == 'filter-bar-dur-min') {
			durMin = 0 - 5000;
			$('#dur-slider').slider('option', 'values', [0, durMax])
			$('#dur-min').addClass('hidden')
		}
		if ($(this).attr('id') == 'filter-bar-dur-max') {
			durMax = 24 *60*60*1000 +5000
			$('#dur-slider').slider('option', 'values', [durMin, 24])
			$('#dur-max').addClass('hidden')
		}

		render()
	})
	
	// filter bar dropdowns - remove items

	
	// TODO reset locations
	// TODO reset climbers
		
	let reset = function(varName){
		let thing = initVals.indexOf(varName)
		console.log("reset's thing is", thing)
	}
	
	// apply filter action - shows the div
    let applyFilter = function(filter, input){
    	$('#filter-bar-'+filter).find('a').text("")
    	let elem = $('<span>[x]</span>')
		$('#filter-bar-'+filter).find('a').append(elem).prepend(input)
		$('#filter-bar-'+filter).removeClass('hidden')
	};
	
	
    
	/**
	 * APPLYING FILTERS
	 */
    

	let render = function(){
  	
    	// get all the climbs
    	let climbs = $('.climblist-form')
    	
    	climbs.each(function(){

			let climbTime = parseFloat($(this).find('.climblist-item-start-time').text(),10);
			let starthour = parseInt($(this).find('.climblist-item-starthour').text(), 10)
			starthour = ($(this).find('.climblist-item-startampm').text().trim() == "pm") ? starthour + 12 : starthour;
			let dur = (parseFloat($(this).find('.climblist-item-end-time').text(),10)) - climbTime
			let gymClimb = ($(this).find('.climblist-item-at-gym').text().trim() == 'false') ? false : true;

			
    		// start with visibility
    		$(this).removeClass('hidden')

    		let show = true;


    		// --- displayFilter ---//
    		if (displayFilter != "All") {
    			
    			switch (displayFilter) {
    			case "Unfilled":
    				if ($(this).find('.climblist-item-acceptor').text().trim() != 'unaccepted') {
    					show = false;
    				}
    				break;
    			case "Filled":
    				if ($(this).find('.climblist-item-acceptor').text().trim() == 'unaccepted') {
    					show = false;
    				}
    				break;
    			case "Expired":
    				if (climbTime > now.getTime()) {
    					show = false;
    				}
    				break;
    			}
    		}
    		
    	//Note- anything < false = false, anything > false = true, so only worry about wrapping > below

    		// --- dateAfter ---//
			if (climbTime < dateAfter) {
				show = false;
			}

			// --- dateBefore ---//
			if (dateBefore) {
				if (climbTime > dateBefore) {
					show = false;
				}
			}

			// --- timeMin ---//
			if (starthour <= timeMin) {
				show = false;
			}

			// --- timeMax ---//
			if (timeMax) {
				if (starthour > timeMax) {
					show = false;
				}
			}

			// --- durMin ---//
			if (dur <= durMin) {
				show = false;
			}

			// --- durMax ---//
			if (durMax) {
				if (dur > durMax) {
					show = false;
				}
			}
			
			// --- showGyms ---//
			if (showGyms) {
				if (!gymClimb && !showCrags) {
					show = false;
				}
			}
			if (!showGyms) {
				if (!showCrags) {
					show = false;
				}
			}
			
			// --- showCrags ---//
			if (showCrags) {
				if (gymClimb && !showGyms) {
					show = false;
				}
			}
			
			// --- locations --- //
			let climb = $(this)
			if (locs.length !== 0 && show === true) {
				show = false
				locs.forEach(function(loc){
					if (climb.find('.climblist-item-location span').text().trim() == loc) {
						show = true;
						return;
					}
					return false;
				})
			}

			
			// --- climbers --- //
			if (climbers.length !== 0 && show === true) {
				show = false
				climbers.forEach(function(climber){
					if (climb.find('.climblist-item-name-init span').text().trim() == climber) {
						show = true;
						return;
					}
					if (climb.find('.climblist-item-acceptor').text().trim() == climber) {
						show = true;
						return;
					}
					return false;
				})
			}

			
			
    		// show it or hide it
    		if (!show) {
    			$(this).addClass('hidden')
    		}
    	})
		console.log("\t\t\t\t***rendered***");
	}
    render();
	
});