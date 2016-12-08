$(document).ready(function(){

/* WISHLIST
 * 
 * Alert: "Crag Selected - Enabling 'show: Crags {checkbox}'" - only when not already selected
 * 
 * Error Div: "Neither gyms nor crags selected: no results will be displayed.
 * 			  Please select 'show: Gyms {checkbox}' or 'show: Crags {checkbox}' to enable filtering.
 * 		- then Highlight #show-gyms & #show-crags  
 * 
 */	


	let mainSet = $('.main-filter-button')
    $('.main-filter-button').click(function() {

    	// hide content
    	$('.search-main').addClass('hidden')
    	$('.search-filters').addClass('hidden')
    	    	
    	// deactivate any other main-filter-button buttons
    	mainSet.removeClass('main-active')
    	
    	// make this the active button
    	$(this).addClass('main-active')
    	
    	// show requested content
    	page = $(this).text().trim();
    	    	
    	switch (page) {
    	case "Calendar":
    		$('#cal-main').removeClass('hidden')
    		$('#cal-filters').removeClass('hidden')
    		break;
    	case "Locations":
    		$('#loc-main').removeClass('hidden')
    		$('#loc-filters').removeClass('hidden')
    		break;
    	case "Climbers":
    		$('#ppl-main').removeClass('hidden')
    		$('#ppl-filters').removeClass('hidden')
    		break;
    	
    	
    	}
    
    })
	

	
/*-----------------------------------------------------------------v-v-v-CAL-FILTERS-v-v-v-----------------------------------------------------------------*/	
	
	
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

    	// show this filter in the filter-bar, if applicable (not "All")
    	displayFilter = $(this).text().trim();
    	filterDisplay(displayFilter)
    	if (displayFilter != "All") {  // because showing all records isn't filtering
    		applyFilter('display', displayFilter)
    	}
    	else {
    		$('#filter-bar-display').addClass('hidden')
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
			applyFilter('date-after', "After: "+aftOutput+" ")  // ???
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
		   	applyFilter('date-before', "Before: "+befOutput+" ") // ???
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
			applyFilter('show-gyms', "Gyms ")
		}
		else {
			showGyms = false;
			$('#filter-bar-show-gyms').addClass('hidden')
		}
		render()
	})
	
	$('#show-crags').on('change', function(){ 
		if ($('#show-crags').prop('checked') == true) {
			showCrags = true;
			applyFilter('show-crags', "Crags ")
		}
		else {
			showCrags = false;
			$('#filter-bar-show-crags').addClass('hidden')
		}
		render()
	})
		

	$('#location-filter select').change(function(){
		let chosen = $(this).val()
		let option = $('#location-filter option:selected')
		locs.push(option.text())
		option.addClass('hidden')
		$(this).val(0)
		applyDropdownFilter('locs-dropdown', locs)
		render()
	})
	

	
	/**
	 * Climbers - get filter criteria
	 */
		
	$('#climber-filter select').change(function(){
		let chosen = $(this).val()  //gets the index of the selected option
		let option = $('#climber-filter option:selected') // gets the entire option element
		console.log("this climber is chosen",chosen)
		climbers.push(option.text()) // puts this climbers name in an array for filtering
		console.log("climbers is",climbers)
		option.addClass('hidden')  // hides this option
		$(this).val(0)
		applyDropdownFilter('climbers-dropdown', climbers)
		render()
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
					"dur-min",
					"dur-max" ]
	let filterDropdowns = [
					"locs-dropdown",
					"climbers-dropdown" ]

	
	let filterBar = $('#filter-bar')
    
	// populate filter bar
	filterDivs.forEach(function(filter){
		let elem = $('<div id="filter-bar-'+filter+'" style="display: inline-block" class="hidden")><a class="filtered-category"></a></div>')
		filterBar.append(elem)
	})

	filterDropdowns.forEach(function(filter){
		let elem = $('<div id="filter-bar-'+filter+'" style="display: inline-block" class="hidden")><select class="filtered-category"><option></option></select></div>')
		filterBar.append(elem)
	})
	$('#filter-bar-locs-dropdown').find('option').text('-filtered locations-')
	$('#filter-bar-climbers-dropdown').find('option').text('-filtered climbers-')
	

	
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
			showGyms = false;
			$('#show-gyms').prop('checked', false)
		}
		
		// show-crags
		if ($(this).attr('id') == 'filter-bar-show-crags') {
			showCrags = false;
			$('#show-crags').prop('checked', false)
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
				
		if ($(this).attr('id') == 'filter-bar-locs-dropdown') {
			$('#filter-bar-locs-dropdown').removeClass('hidden')
		}
		if ($(this).attr('id') == 'filter-bar-climbers-dropdown') {
			$('#filter-bar-climbers-dropdown').removeClass('hidden')
		}

		render()
	})
	
	// filter bar dropdowns - remove items
	$('#filter-bar-locs-dropdown select').change(function(){
		
		// get selected option
		let option = $('#filter-bar-locs-dropdown option:selected')

		// truncate to remove " [x]"
		let text = option.text().substring(0, (option.text().length)-4)

		// find the element in the left filter list and show it
		let element = $('#climber-filter option:contains('+text+')')
		element.removeClass('hidden');
		
		// take this option off the filter-bar dropdown
		option.remove()
		
		// drop this person from the array
		let index = locs.indexOf(text)
		locs.splice(index, 1)
		
		// if there are no more locs in the array, hide this dropdown
		if (locs.length === 0) {
			$('#filter-bar-locs-dropdown').addClass('hidden')
		}			

		render()
	})


	$('#filter-bar-climbers-dropdown select').change(function(){
		
		// get selected option
		let option = $('#filter-bar-climbers-dropdown option:selected')

		// truncate to remove " [x]"
		let text = option.text().substring(0, (option.text().length)-4)

		// find the element in the left filter list and show it
		let element = $('#climber-filter option:contains('+text+')')
		element.removeClass('hidden');
		
		// take this option off the filter-bar dropdown
		option.remove()
		
		// drop this person from the array
		let index = climbers.indexOf(text)
		climbers.splice(index, 1)
		
		// if there are no more climbers in the array, hide this dropdown
		if (climbers.length === 0) {
			$('#filter-bar-climbers-dropdown').addClass('hidden')
		}			

		render()
	})

	
	// TODO reset locations
	// TODO reset climbers
		
	let reset = function(varName){
		let thing = initVals.indexOf(varName)
		console.log("reset's thing is", thing)
	}
	
	// apply filter action - shows the div				//TODO - wishlist - add 3rd param "identifier" for "Shortest:", "Earliest:" etc.; refactor above to pass in identifiers  
    let applyFilter = function(filter, input) {
    	$('#filter-bar-'+filter).find('a').text("")
    	let elem = $('<span>[<span>x</span>]</span>')	//TODO - wishlist - "identifier" param - code <spans> for this below & style
		$('#filter-bar-'+filter).find('a').append(elem).prepend(input)
		$('#filter-bar-'+filter).removeClass('hidden')
	};
	applyFilter('show-gyms', "In Gyms ")
	
	// apply filter for dropdowns
	let firstOpt
	let applyDropdownFilter = function(filter, set) {	//TODO - wishlist - order these by ? - locid?, alphabet?
		let drop = $('#filter-bar-'+filter).find('select')
		let options = drop.find('option')
		options.remove();
		firstOpt;
		if (set === climbers) {
			firstOpt = $('<option>-climbers-</option>')
		}
		if (set === locs) {
			firstOpt = $('<option>-locations-</option>')
		}
		drop.append(firstOpt)
    	set.forEach(function(item) {
    		let option = $('<option>'+item+' <span>[<span>x</span>]</span></option>')
    		drop.append(option)
    	})
		$('#filter-bar-'+filter).removeClass('hidden')
	}
	
    
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
	
	// page load.
    render();
	
/*---------------------------------------v-v-v-LOC-FILTERS-v-v-v------^-^-^-CAL-FILTERS-^-^-^-----------------------------------------------------------*/
 
    let setHover = function(index) {
//    	if (!$('.loc:nth-child('+(index + 1)+')').hasClass('selected')) {  // redundant, but cool - caught by $('.loc').hover()
	    	if (iconTypes[index]) {
	    		markerNames[index].setIcon(gymHoverIcon)        		 
	    	}
	    	else {
	    		markerNames[index].setIcon(cragHoverIcon)
	    	}
	    	markerNames[index].setZIndex(1);
//    	}
    }

    let setSelected = function(index) {
    	if (iconTypes[index]) {
    		markerNames[index].setIcon(gymSelectedIcon)        		 
    	}
    	else {
    		markerNames[index].setIcon(cragSelectedIcon)
    	}
    	markerNames[index].setZIndex(2);
    }
    
    let resetMarker = function(index) {
    	if (iconTypes[index]) {
    		markerNames[index].setIcon(gymIcon)        		 
    	}
    	else {
    		markerNames[index].setIcon(cragIcon)
    	}
    	markerNames[index].setZIndex(0);
    }

    let center = function (latitude, longitude) {
    	map.setCenter({
    		lat : latitude,
			lng : longitude
		});
	}

    
    $('.loc').hover(function(){
    	if (!$(this).hasClass('selected')) {
    		let idx = $(this).index()
    		setHover(idx)
    	}
    }, function(){
    	if (!$(this).hasClass('selected')) {
    		let idx = $(this).index()
    		resetMarker(idx)
    	}
    })


    $('.loc').click(function(){
    	let idx = $(this).index()
    	setSelected(idx);
    	let prevElemIndex = $('.selected').index()
    	if (prevElemIndex !== -1) {
    		resetMarker(prevElemIndex)
    	}
    	$('.selected').removeClass('selected')
    	$('.location').addClass('hidden')
    	$(this).addClass('selected')
    	let mainSelection = $('#location'+idx)
    	mainSelection.removeClass('hidden')
    	let latitude = parseFloat(mainSelection.find('.lat').text(), 10)
    	let longitude = parseFloat(mainSelection.find('.lng').text(), 10)
    	center(latitude, longitude)
    })

    
/*---------------------------------------v-v-v-PPL-FILTERS-v-v-v------^-^-^-LOC-FILTERS-^-^-^-----------------------------------------------------------*/    
    
    
	console.log('filters js loaded')
    
});