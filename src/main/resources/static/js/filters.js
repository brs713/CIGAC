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
			$('#climber-filter-bar').addClass('hidden')
			$('#filter-bar').removeClass('hidden')
			filterCal = true;  // tells the render function to act on calendar items only
			break;
		case "Locations":
			$('#loc-main').removeClass('hidden')
			$('#loc-filters').removeClass('hidden')
			break;
		case "Climbers":
			$('#ppl-main').removeClass('hidden')
			$('#ppl-filters').removeClass('hidden')
			$('#filter-bar').addClass('hidden')
			$('#climber-filter-bar').removeClass('hidden')
			filterCal = false;  // tells the render function to act on calendar items only
			break;
		}
		render()
	})

	/*  TRY TO SIMULATE A "GET UNFILLED REQUESTS BY CLIMBER" CLICK    
    let b = $('#prev')

    var filterByClimber = new Event('change');

	// Listen for the event.
//	$('#climber-filter')[0].addEventListener('filterByClimber', function (e) {
//		console.log("evented!")
//	}, false);

    b.click(function() {
    	requestedFilter = "Unfilled"
    	$('.display-filter')[0].click();

    	$('#climber-filter').val(2)
    	$('#climber-filter').click()

    	$('#climber-filter')[0].dispatchEvent(filterByClimber);
    	$('#cal-search').click();
    })
    console.log(b)
	 */

	/*-----------------------------------------------------------------v-v-v-CAL-FILTERS-v-v-v-----------------------------------------------------------------*/	

	// climb filter vars
	let displayFilter = 'All';
	let dateAfter = false;
	let dateBefore = false;
	let timeMin = 0;
	let timeMax = 24;
	let durMin = 0;
	let durMax;
	let showGyms = true;
	let showCrags = false;
	let locs = [];	
	let climbers = [];	

	let now = new Date();

	// profile filter vars
	let requestedLeadMin = 0
	let requestedLeadMax = 22
	let requestedTrMin = 0
	let requestedTrMax = 22
	let requestedBoulderMin = 0
	let requestedBoulderMax = 11	
	let profiles = [];
	let gyms = [];



	/**
	 * Display - get filter criteria
	 */
	let requestedFilter = "";
	let dfset = $('.display-filter')
	$('.display-filter').click(function() {

		console.log(requestedFilter)
		// show this filter in the filter-bar, if applicable (not "All")
		if (requestedFilter == "") {
			displayFilter = $(this).text().trim();
		}
		else {
			displayFilter = requestedFilter;
		}
		filterDisplay(displayFilter)
		if (displayFilter != "All") {  // because showing all records isn't filtering
			applyFilter('display', displayFilter)
		}
		else {
			$('#filter-bar-display').addClass('hidden')
		}
		render();
		requestedFilter = "";
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
//			//TODO notify user that after must come before before -- ***ALERT?
//			console.log("AFTER IS GREATER THAN BEFORE, I THINK!!!")
//			$(modal).modal('hide');
//			return;
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
//			//TODO notify user that after must come before before -- ***ALERT?
//			console.log("AFTER IS GREATER THAN BEFORE, I THINK!!!")
//			$(modal).modal('hide');
//			return;
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

	// filter bar dropdowns - remove items - locs
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


	// - climbers
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
	 * RENDER APPLIED FILTERS
	 */
	let filterCal = true;  // switched with page buttons (beginning of file)

	let render = function(){

		if (filterCal == true) {
			// get all the climbs
			items = $('.climblist-form')
		}
		else {
			// get all the profiles
			items = $('.profile')
		}

		items.each(function(){


			// start with visibility
			$(this).removeClass('hidden')

			let show = true;

			if (filterCal == true) {

				/*  _______________  CLIMBSESSION RENDER ITERATION  _______________  */


				let climbTime = parseFloat($(this).find('.climblist-item-start-time').text(),10);
				let starthour = parseInt($(this).find('.climblist-item-starthour').text(), 10)
				starthour = ($(this).find('.climblist-item-startampm').text().trim() == "pm") ? starthour + 12 : starthour;
				let dur = (parseFloat($(this).find('.climblist-item-end-time').text(),10)) - climbTime
				let gymClimb = ($(this).find('.climblist-item-at-gym').text().trim() == 'false') ? false : true;



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
			}

			else {  // filterCal = false

				/*  _______________  PROFILE RENDER ITERATION  _______________  */



				let profLeadMin = (parseInt($(this).find('.lead-min').text(),10))
				let profLeadMax = (parseInt($(this).find('.lead-max').text(),10))
				let profTrMin = (parseInt($(this).find('.tr-min').text(),10))
				let profTrMax = (parseInt($(this).find('.tr-max').text(),10))
				let profBoulderMin = (parseInt($(this).find('.boulder-min').text(),10))
				let profBoulderMax = (parseInt($(this).find('.boulder-max').text(),10))


				// --- LeadMin ---//
//				if (requestedLeadMin <= profLeadMin) {
//				show = false;
//				}
//				if (profLeadMin) {
//				if (requestedLeadMin > profLeadMin) {
//				show = false;
//				}
//				}

//				// --- timeMax ---//
//				if (requestedLeadMax) {
//				if (time > profLeadMax) {
//				show = false;
//				}
//				}


				// --- profiles --- //
				let prof = $(this)
				if (profiles.length !== 0 && show === true) {
					show = false
					profiles.forEach(function(profile){
						if (prof.find('.name').text().trim() == profile) {
							show = true;
							return;
						}
						return false;
					})
				}


				// --- gyms --- //
				if (gyms.length !== 0 && show === true) {
					show = false
					gyms.forEach(function(gym){
						if (prof.find('.homegym').text().trim() == gym) {
							show = true;
							return;
						}
						return false;
					})
				}
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
//		if (!$('.loc:nth-child('+(index + 1)+')').hasClass('selected')) {  // redundant, but cool - caught by $('.loc').hover()
		if (iconTypes[index]) {
			markerNames[index].setIcon(gymHoverIcon)        		 
		}
		else {
			markerNames[index].setIcon(cragHoverIcon)
		}
		markerNames[index].setZIndex(1);
//		}
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


	//  -----  Add A Location  ---  //
	$('#add-loc-btn').click(function(){

		$('.location').addClass('hidden');
		$('#loc-input-form').removeClass('hidden');
		$('#gym-or-crag').removeClass('hidden');

	})

	$('#gym-or-crag').click(function(){

		$('#gym-or-crag span').toggleClass('add-this-type').toggleClass('hidden');
		$('.gym-input').toggleClass('add-this-type').toggleClass('hidden');
		$('.crag-input').toggleClass('add-this-type').toggleClass('hidden');

	})

	let fail
	let errMsg;
	let error = function(errCode, extras){

		console.log("in error rendering")
		fail = true;

		switch (errCode) {
		case 0:
			errMsg = "This location hasn't been viewed enough times to be considered a crag.  Could this be part of a larger location?"
				break;
		case 1:
			errMsg = "Another location already entered near these coordinates.  Were you looking for " + extras + "?"
			break;
		case 2:
			errMsg = "All fields required."
				break;
		case 3:
			errMsg = "There appears to be an issue with data processing.  Please verify instructions were followed."
				break;
		case 4:
			errMsg = "A location with this name already exists."
				break;
		}

		console.log(errMsg)
	}



	$('#submit-crag').click(function(e){
		fail = false;

		// TODO -validate

		let mpinfo = [];
		let locName = "";
		let locLat = "";
		let locLong = "";
		let isGym = false;
		let pageViews;
		let views = "";
		let form = $(this).parents('form');
		let copiedText = $('#mp-user-copy').val()
		let textfield = $('#mp-user-copy')


		// make sure all fields filled out
		if ($('#mp-user-copy').val() == "") {
			error(2)
			return;
		}

		mpinfo = copiedText.split(/\s+/)

		// find how many times the page has been viewed (If it's lots, it'll be considered a crag.)

		pageViews = mpinfo[mpinfo.indexOf("Views:") + 1]
		console.log("pageViews", pageViews)
		console.log(pageViews.length)

		for (let i=0; i<pageViews.length;++i) {
			if (pageViews[i] != ',') {
				views += pageViews[i]
			}
		}

		console.log("views are", views)

		mpinfo.forEach(function(word){

			// only worry about looking for name, lat & lng if this will be considered a crag.
			if (parseInt(views, 10) > 50000) {

				// find the name (all of the copied text preceding "Rock Climbing")
				if (word == "Rock" && mpinfo[mpinfo.indexOf(word) + 1] == "Climbing") {
					let index;
					mpinfo.forEach(function(i){
						if (i == "Rock") {
							index = mpinfo.indexOf(i);
						}
					})
					for (let i=0;i<index;++i) {

						locName += " " + mpinfo[i];
					}
					locName = locName.trim()

				}

				// find latitude & longitude
				if (word == "Location:") {
					locLat = mpinfo[mpinfo.indexOf(word) + 1]
					locLng = mpinfo[mpinfo.indexOf(locLat) + 1].split(" ")[0]
					if (locLat[locLat.length-1] == ",") {
						locLat = locLat.substring(0, locLat.length-1)
					}
				}
			}

			else {
				console.log("error0")
				error(0)
				return;
			}
		})


		// validate
		crags = $('.location').find('.isGym:contains(false)').parent()

		// check for data processing errors
		if ((typeof(locName) === 'undefined') || !locName || (typeof(locLat) === 'undefined') || !locLat || (typeof(locLng) === 'undefined') || !locLng) {
			error(3)
			return;
		}

		let mainLoc

		// check this data against existing crags
		crags.each(function(crag){

			// see if longitude is close to existing crag
			if (parseFloat($(this).find('.lng').text(), 10) - parseFloat(locLng, 10) < .1 || parseFloat($(this).find('.lng').text(), 10) - parseFloat(locLng, 10) > -.1) {

				// check latitude
				if (parseFloat($(this).find('.lat').text(), 10) - parseFloat(locLat, 10) < .1 || parseFloat($(this).find('.lat').text(), 10) - parseFloat(locLat, 10) > -.1) {
					mainLoc = $(this).find('.loc-name').text()
					error(1, mainLoc)
				}
			}

			// if name already exists
			if ($(this).find('.loc-name').text() == locName) {
				error(4)
				return;
			}
		})

		if (fail) {

			$('#loc-input-form').addClass('hidden');
			$('#loc-error').removeClass('hidden')
			$('#loc-error span').text(errMsg);

			console.log("FAILED!")
			e.preventDefault()
		}


		$('#crag-loc-name').val(locName)
		$('#crag-loc-lat').val(locLat)
		$('#crag-loc-lng').val(locLng)
		$('#crag-is-gym').val(isGym)

	})



	$('#submit-gym').click(function(e){
		fail = false;
		console.log("1")
		// TODO -validate

		let gmapinfo = [];
		let locName = "";
		let locLat = "";
		let locLong = "";
		let isGym = true;
		let locPostalAddress = "";
		let locCity = "";
		let locState = "";
		let locZip = "";
		let locSite = "";
		let locPhone = "";

		let form = $(this).parents('form');


		// make sure all fields filled out
		if ($('#gm-user-copy').val() == "" || $('#gm-latlng-copy').val() == "") {
			error(2)
		}
		console.log("2")

		let copiedText = $('#gm-user-copy').val()
		let textfield = $('#gm-user-copy')
		gmapcommas = copiedText.split(",")
		gmapinfo = copiedText.split(/\s+/)


		if (!fail) {

			// get name
			let index;

			gmapinfo.forEach(function(word){
				if (word == "reviews" ) {
					index = gmapinfo.indexOf(word);
				}
			})

			for (let i=0;i<index-1;++i) {

				locName += " " + gmapinfo[i];
			}
			locName = locName.trim()

			// get address
			index = -1;
			gmapcommas.forEach(function(chunk){
				if (chunk.indexOf("Google") !== -1) {
					index = chunk.indexOf("Google")
					locPostalAddress = chunk.substring(index + 7, chunk.length)
					locPostalAddress = locPostalAddress.trim()
				}
			})

			// get city
			let truncatedCopy
			let start = copiedText.indexOf(locPostalAddress)+ locPostalAddress.length + 2
			truncatedCopy = copiedText.substring(start, copiedText.length)
			locCity = truncatedCopy.split(",")[0]
			locState = truncatedCopy.split(",")[1].substring(1, 3)
			locZip = truncatedCopy.split(",")[1].substring(4, 9)

			// get site, phone
			let newTruncation
			start = truncatedCopy.indexOf(locZip) + 6
			newTruncation = truncatedCopy.substring(start, truncatedCopy.length)
			locSite = newTruncation.split(/\s+/)[0].trim()
			locPhone = newTruncation.split(/\s+/)[1].concat(newTruncation.split(/\s+/)[2]).trim()
			locPhone = locPhone.substring(1, 13)
			locPhone = locPhone.split(")")[0].concat(locPhone.split(")")[1])
			locPhone = locPhone.split("-")[0].concat(locPhone.split("-")[1])

			// get lat, long
			let latlngcopy = $('#gm-latlng-copy').val()
			locLat = latlngcopy.split(", ")[0].trim()
			locLng = latlngcopy.split(", ")[1].trim()


			// validate
			gyms = $('.location').find('.isGym:contains(true)').parent()

			let mainLoc
			// check data against existing gyms
			gyms.each(function(gym){

				if (!fail) { 
					// check for processing errors
					if ((typeof(locName) === 'undefined') || !locName || (typeof(locLat) === 'undefined') || !locLat || 
							(typeof(locLng) === 'undefined') || !locLng || (typeof(locPostalAddress) === 'undefined') || !locPostalAddress || 
							(typeof(locCity) === 'undefined') || !locCity || (typeof(locState) === 'undefined') || !locState || 
							(typeof(locZip) === 'undefined') || !locZip || (typeof(locPhone) === 'undefined') || !locPhone)
					{
						error(3)
					}
				}
				//if (typeof variable === 'undefined' || !variable) return

				if (!fail) {
					// see if longitude is close to existing crag
					if (parseFloat($(this).find('.lng').text(), 10) - parseFloat(locLng, 10) < .002 || parseFloat($(this).find('.lng').text(), 10) - parseFloat(locLng, 10) > -.002) {
						// check latitude
						if (parseFloat($(this).find('.lat').text(), 10) - parseFloat(locLat, 10) < .002 || parseFloat($(this).find('.lat').text(), 10) - parseFloat(locLat, 10) > -.002) {
							mainLoc = $(this).find('.loc-name').text()
							error(1, mainLoc)
						}
					}
				}

				if (!fail) {
					// if name already exists
					if ($(this).find('.loc-name').text() == locName) {
						error(4)
					}
				}
			})
		}
		
		if (fail) {

			$('#loc-input-form').addClass('hidden');
			$('#loc-error').removeClass('hidden')
			$('#loc-error span').text(errMsg);

			console.log("FAILED!")

			return false;
		}

		$('#gym-loc-name').val(locName)
		$('#gym-loc-lat').val(locLat)
		$('#gym-loc-lng').val(locLng)
		$('#gym-is-gym').val(isGym)
		$('#gym-loc-postalAddress').val(locPostalAddress)
		$('#gym-loc-city').val(locCity)
		$('#gym-loc-state').val(locState)
		$('#gym-loc-zip').val(locZip)
		$('#gym-loc-site').val(locSite)
		$('#gym-loc-phone').val(locPhone)

	})



	/*---------------------------------------v-v-v-PPL-FILTERS-v-v-v------^-^-^-LOC-FILTERS-^-^-^-----------------------------------------------------------*/    




	/**
	 * Profiles - get filter criteria
	 */

	$('#profile-filter select').change(function(){
		let chosen = $(this).val()  //gets the index of the selected option
		let option = $('#profile-filter option:selected') // gets the entire option element
		profiles.push(option.text()) // puts this profiles name in an array for filtering
		option.addClass('hidden')  // hides this option
		$(this).val(0)
		applyProfileDropdownFilter('profiles-dropdown', profiles)
		render()
	})

	$('#gym-filter select').change(function(){
		let chosen = $(this).val()  //gets the index of the selected option
		let option = $('#gym-filter option:selected') // gets the entire option element
		gyms.push(option.text()) // puts this gyms name in an array for filtering
		option.addClass('hidden')  // hides this option
		$(this).val(0)
		applyProfileDropdownFilter('gyms-dropdown', gyms)
		render()
	})


	/**
	 * LeadMin - get filter criteria
	 */


	//  This is about to be a 4 handle slider bar that will select a range for min & a range for max.
	/*	$('#lead-min-slider').slider({
		  values: [0, 5,6, 22],
		  range: true,
		  max: 22,
	});

	$('#lead-min-slider').on('slide', function(event, ui) {

		//TODO - map displayed values to route grades

        var index = $(ui.handle).index();
    	if (index == 1) { // left handle
    		$('#lead-min').val(ui.values[0]).removeClass('hidden');
    		applyProfileFilter('lead-min-range', "LeadMin range: "+requestedLeadMinMin+" to "+requestedLeadMinMax)
     	}
    	if (index == 2) { 
    		$('#lead-min').val(ui.values[1]).removeClass('hidden');
    		applyProfileFilter('lead-min-range', "LeadMin range: "+requestedLeadMinMin+" to "+requestedLeadMinMax)
     	}

    	if (index == 3) { 
    		$('#lead-max').val(ui.values[2]).removeClass('hidden');
    		applyProfileFilter('lead-min-range', "LeadMin range: "+requestedLeadMinMin+" to "+requestedLeadMinMax)
     	}
    	if (index == 4) { // right handle
    		$('#lead-max').val(ui.values[3]).removeClass('hidden');
    		applyProfileFilter('lead-min-range', "LeadMin range: "+requestedLeadMinMin+" to "+requestedLeadMinMax)
     	}

    	render()
	} );
	 */




	/**
	 * Filter Bar
	 */

	let profileFilterDivs = [ 
		"lead-min-range",
		"lead-max-range" ]
	let profileFilterDropdowns = [
		"profiles-dropdown",
		"gyms-dropdown" ]


	profileFilterBar = $('#climber-filter-bar')

	// populate filter bar
	profileFilterDivs.forEach(function(filter){
		let elem = $('<div id="filter-bar-'+filter+'" style="display: inline-block" class="hidden")><a class="filtered-category"></a></div>')
		profileFilterBar.append(elem)
	})

	profileFilterDropdowns.forEach(function(filter){
		let elem = $('<div id="climber-filter-bar-'+filter+'" style="display: inline-block" class="hidden")><select class="filtered-category"><option></option></select></div>')
		profileFilterBar.append(elem)
	})
	$('#climber-filter-bar-profiles-dropdown').find('option').text('-filtered profiles-')
	$('#climber-filter-bar-gyms-dropdown').find('option').text('-filtered gyms-')



	// apply filter for dropdown list

	let applyProfileDropdownFilter = function(filter, set) {	//TODO - wishlist - order these by ? - locid?, alphabet?
		let drop = $('#climber-filter-bar-'+filter).find('select')
		let options = drop.find('option')
		options.remove();
		firstOpt;
		if (set === gyms) {
			firstOpt = $('<option>-gyms-</option>')
		}
		if (set === profiles) {
			firstOpt = $('<option>-profiles-</option>')
		}
		drop.append(firstOpt)
		set.forEach(function(item) {
			let option = $('<option>'+item+' <span>[<span>x</span>]</span></option>')
			drop.append(option)
		})
		$('#climber-filter-bar-'+filter).removeClass('hidden')
		console.log("2")
	}


	// filter bar dropdowns - remove items - profiles
	$('#climber-filter-bar-profiles-dropdown select').change(function(){

		// get selected option
		let option = $('#climber-filter-bar-profiles-dropdown option:selected')

		// truncate to remove " [x]"
		let text = option.text().substring(0, (option.text().length)-4)

		// find the element in the left filter list and show it
		let element = $('#profile-filter option:contains('+text+')')
		element.removeClass('hidden');

		// take this option off the filter-bar dropdown
		option.remove()

		// drop this person from the array
		let index = profiles.indexOf(text)
		profiles.splice(index, 1)

		// if there are no more profiles in the array, hide this dropdown
		if (profiles.length === 0) {
			$('#climber-filter-bar-profiles-dropdown').addClass('hidden')
		}			

		render()
	})


	// - gyms
	$('#climber-filter-bar-gyms-dropdown select').change(function(){

		// get selected option
		let option = $('#climber-filter-bar-gyms-dropdown option:selected')

		// truncate to remove " [x]"
		let text = option.text().substring(0, (option.text().length)-4)

		// find the element in the left filter list and show it
		let element = $('#gym-filter option:contains('+text+')')
		element.removeClass('hidden');

		// take this option off the filter-bar dropdown
		option.remove()

		// drop this person from the array
		let index = gyms.indexOf(text)
		gyms.splice(index, 1)

		// if there are no more gyms in the array, hide this dropdown
		if (gyms.length === 0) {
			$('#climber-filter-bar-gyms-dropdown').addClass('hidden')
		}		

		render()
	})

	console.log('filters js loaded')

});






