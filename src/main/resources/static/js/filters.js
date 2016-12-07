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
	let timeMin = false;
	let timeMax = false;
	let durMin = false;
	let durMax = false;
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
    	dfset.removeClass('df-active');
    	$(this).addClass('df-active');
    	displayFilter = $(this).text().trim();
    	render(dfset.text());
    })
	
	
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
			render('date-after', aftOutput)
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
		   	render('date-before', befOutput)
		})	
	});
	

	
	/**
	 * TimeOfDay - get filter criteria
	 */
	
	$('#slider').slider({
		  values: [0, 24],
		  range: true,
		  max: 24,
  });
	
	$('#slider').on('slide', function(event, ui) {
		timeMin = $(this).slider('option', 'values')[0];
		timeMax = $(this).slider('option', 'values')[1];
		$('#time-min').val(timeMin).removeClass('hidden');
		$('#time-max').val(timeMax).removeClass('hidden');
		//TODO - map displayed values to o'clocks'
		render()
	});

	
	
	/**
	 * Duration - get filter criteria
	 */
	
	$('#dur-slider').slider({
		  values: [0, 4],
		  range: true,
		  max: 24,
	});
	
	$('#dur-slider').on('slide', function(event, ui) {
		let left = $(this).slider('option', 'values')[0];
		let right = $(this).slider('option', 'values')[1];
		$('#dur-min').val(left).removeClass('hidden');
		$('#dur-max').val(right).removeClass('hidden');
		//TODO - map displayed values to hours
		//TODO - convert these hours into long (*60*60*1000)
		durMin = left *60*60*1000 -5000
		durMax = right *60*60*1000 +5000
		render()
	} );

	
	/**
	 * Location - get filter criteria
	 */
	
	$('#show-gyms').on('change', function(){ 
		if ($('#show-gyms').prop('checked') == true) {
			showGyms = true;
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
    
	filterDivs.forEach(function(filter){
		let elem = $('<div id="filter-bar-'+filter+'" style="display: inline-block" class="hidden")><a><span>[ X ]</span></a></div>')
		filterBar.append(elem)
	})
	
	// when you click on a div in the filter-bar
	filterBar.find('div').click(function(){
		$(this).addClass('hidden')
		
		if ($(this).attr('id') == 'filter-bar-date-after') {
			dateAfter = false;
			$('#date-after').addClass('hidden')
		}
		
		if ($(this).attr('id') == 'filter-bar-date-before') {
			dateBefore = false;
			$('#date-before').addClass('hidden')
		}
		
		render()
	})
		
	let reset = function(varName){
		let thing = initVals.indexOf(varName)
		console.log("reset's thing is", thing)
	}
	
	// apply filter action - shows the div
    let applyFilter = function(filter, input){
    	$('#filter-bar-'+filter).find('a').text("")   // TODO - MinorFix - this wipes out the <span>[X]</span>
		$('#filter-bar-'+filter).find('a').prepend(input)
		$('#filter-bar-'+filter).removeClass('hidden')
	};
	
	
    
	/**
	 * APPLYING FILTERS
	 */
    

	let render = function(filter,input){
    	
		applyFilter(filter, input);
  	
    	// get all the climbs
    	let climbs = $('.climblist-form')
    	
    	climbs.each(function(){

			let climbTime = parseFloat($(this).find('.climblist-item-start-time').text(),10);
			let starthour = parseInt($(this).find('.climblist-item-starthour').text(), 10)
			starthour = ($(this).find('.climblist-item-startampm').text().trim() == "pm") ? starthour + 12 : starthour;
			let dur = (parseFloat($(this).find('.climblist-item-end-time').text(),10)) - climbTime
			let gymClimb = ($(this).find('.climblist-item-at-gym').text().trim() == 'false') ? false : true;
	//console.log("@gym?", gymClimb)
 		
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