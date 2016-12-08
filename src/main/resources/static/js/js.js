



$(document).ready(function() {

	/***	
	Calendar Control
	 ***/
	let weeks = 2;

	let createCalendar = function(weeks, div) {

		let container = $('#'+div); //.my-calendar-control

		let labels = ['s', 'm', 't', 'w', 't', 'f', 's'];

		container.append($('<table></table>'));
		container.find($('table')).append($('<tr class="days-of-week"></tr>'));
		labels.forEach(function(label) {
			container.find('.days-of-week').append($('<td>' + label + '</td>'));
		});
		let row = [];
		for (let i=0; i<weeks; ++i) {
			row[i] =  $('<tr></tr>');
			container.find($('table')).append(row[i]);
			let day = [];
			for (let j=0;j<7;++j){
				day[j] = $('<td class="day"><div class="daynumber day'+((i*7)+j)+div+'"></div><div class="daydetail-frame"><div class="daydetail"></div><span class="date"></span></div></td>');
				$(row[i]).append(day[j]);
			}
			if (i === 0) {
				let prevControl = $('<td id="prev-week-'+div+'"><span class="glyphicon glyphicon-chevron-up cal-btn cal-prev"></span></td>');
				$(row[i]).append(prevControl);
			}
			if (i === weeks-1) {
				let nextControl = $('<td id="next-week-'+div+'"><span class="glyphicon glyphicon-chevron-down cal-btn cal-next"></span></td>');
				$(row[i]).append(nextControl);
			}
		}

		let now = new Date()
		let hours = now.getHours()
		let minutes = now.getMinutes()
		let seconds = now.getSeconds()
		let dayStart = now.getTime() - ((hours * 60 * 60 * 1000)+(minutes * 60 * 1000)+(seconds * 1000))
		let copydate = new Date(dayStart)
		let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		let populateDaynumbers = function(range){

			copydate.setDate(copydate.getDate() - copydate.getDay());

			for (let i=0; i<range; ++i) {

				// first day of the month displays a letter
				if (copydate.getDate() !== 1) { 
					$('.day'+i+div).text(copydate.getDate());
				}
				else {
					$('.day'+i+div).text(monthNames[copydate.getMonth()].charAt(0));
				}
				$('.day'+i+div).siblings().find('.date').text(copydate.getTime());
				copydate.setDate(copydate.getDate() + 1);
			} 
		}

		populateDaynumbers(weeks * 7);

		// BUTTON HANDLERS - NEXT, PREV
		$('#prev-week-'+div).click(function(){
			copydate.setDate(copydate.getDate() - (((weeks + 1) * 7) - 1));
			populateDaynumbers(weeks * 7);
			resetCal();
			selectDay($('.date').filter(function() { return ($(this).text() === selected) }).siblings());
		});

		$('#next-week-'+div).click(function(){
			copydate.setDate(copydate.getDate() - (((weeks - 1) * 7) - 1));
			populateDaynumbers(weeks * 7);
			resetCal();
			selectDay($('.date').filter(function() { return ($(this).text() === selected) }).siblings());
		});

	};


	let calendars = $('.my-calendar-control');
	let selected;

	$(calendars).each(function(){
		createCalendar(weeks, $(this).attr('id'));
	});
	$('.daydetail-frame').mouseenter(function() {
		$(this).css('background-color', '#eeeeee');
	})
	$('.daydetail-frame').mouseleave(function() {
		$(this).css('background-color', 'inherit');
	})
	$('.daydetail').click(function() {
		resetCal();
		selected = $(this).siblings().text();
		$('#selected-date').attr('value', selected);
//		console.log("checking value", $('#post-climb-form input').value())
		console.log("checking element", $('#selected-date'))
		selectDay($(this));
	})

	let resetCal = function() {
		$('.daydetail').css('background-color', 'inherit').css('border', '0');
	}

	let selectDay = function(element) {
		element.css('background-color', '#fafafa').css('border', '1px solid #e0d0f0');
	}
	
	/* Stuff from datepicker

 disabledInputs = [];
 highlight days in other month;

	 */
	// ONLY PROBLEM HERE THAT I SEE IS THAT I'M NOT IMPLEMENTING PREVENTDEFAULT() CORRECTLY; 
	// ENDED UP HIDING INPUTS IN FORM & HAVING THEM UPDATED WHEN SELECTED IS ASSIGNED 
//	$('#post-climb-form button').click(function(e){
//		e.preventDefault();
//		let form = $(this).parent();
//		if (selected != null) {
//			console.log("in null check", selected);
//			let dateInput = $('<input name="dateInGetTimeFormat" value="'+selected+'"/>');
//			form.append(dateInput)
//		}
//		$(this).click();
//	})
	
	
	/***	
	Modal Spinner Control
	 ***/
	
	let prev = 2;
	
    $('#hour-spinner').TouchSpin({
    	initval: 2,
    	verticalbuttons: true,
        buttondown_class: "btn btn-link",
        buttonup_class: "btn btn-link",
        verticalupclass: 'glyphicon glyphicon-plus',
        verticaldownclass: 'glyphicon glyphicon-minus'
      });
    
    $('#hour-spinner').on('change', function(){
    	if ($(this).val() > 12) {
    		$(this).val(1);
    	}
    	if ($(this).val() < 1) {
    		$(this).val(12)
    	}
    	if ($(this).val() == 11) {
    		if (prev == 12) {
    			console.log("flag12 confirmed")
    			$('#ampm').val(($('#ampm').val() == 'pm') ? 'am' : 'pm');
    		}
    	}
    	if ($(this).val() == 12) {
    		if (prev == 11) {
    			console.log("flag11 confirmed")
    			$('#ampm').val(($('#ampm').val() == 'pm') ? 'am' : 'pm');
    		}
    	}
    	prev = $(this).val();
    	console.log(prev)
    });

    $('#minute-spinner').TouchSpin({
    	min: -5,
    	step: 5,
    	initval: 30,
        verticalbuttons: true,
        buttondown_class: "btn btn-link",
        buttonup_class: "btn btn-link",
        verticalupclass: 'glyphicon glyphicon-plus',
        verticaldownclass: 'glyphicon glyphicon-minus'
      });
    
    $('#minute-spinner').on('change', function(){
    	if ($(this).val() > 55) {
    		$(this).val(0);
    		prev = $('#hour-spinner').val();
    		$('#hour-spinner').val(parseInt($('#hour-spinner').val())+1);
        	if ($('#hour-spinner').val() > 12) {
        		$('#hour-spinner').val(1);
        	}
        	if ((prev == 11) && ($('#hour-spinner').val() == 12)) {
    			$('#ampm').val(($('#ampm').val() == 'pm') ? 'am' : 'pm');
        	}
    	}
    	if ($(this).val() < 0) {
    		$(this).val(55);
    		prev = $('#hour-spinner').val();
    		$('#hour-spinner').val(parseInt($('#hour-spinner').val())-1);
    		if ($('#hour-spinner').val() < 1) {
        		$('#hour-spinner').val(12)
        	}
        	if ((prev == 12) && ($('#hour-spinner').val() == 11)) {
    			$('#ampm').val(($('#ampm').val() == 'pm') ? 'am' : 'pm');
        	}

    	}
    	if ($(this).val() == 0) {
    		$(this).val('00');
    	}
    	if ($(this).val() == 5) {
    		$(this).val('05');
    	}
    });
    
    $('.timein input').click(function(){
    	prev = $('#hour-spinner').val();
    	console.log(prev);
    });
    
    $('#dur-hour-spinner').TouchSpin({
    	initval: 1,
    	verticalbuttons: true,
        buttondown_class: "btn btn-link",
        buttonup_class: "btn btn-link",
        verticalupclass: 'glyphicon glyphicon-plus',
        verticaldownclass: 'glyphicon glyphicon-minus'
      });
    
    $('#dur-minute-spinner').TouchSpin({
    	min: -5,
    	step: 5,
    	initval: 0,
        verticalbuttons: true,
        buttondown_class: "btn btn-link",
        buttonup_class: "btn btn-link",
        verticalupclass: 'glyphicon glyphicon-plus',
        verticaldownclass: 'glyphicon glyphicon-minus'
      });
    
    $('#dur-minute-spinner').on('change', function(){
    	if ($(this).val() > 55) {
    		$(this).val(0);
    		$('#dur-hour-spinner').val(parseInt($('#dur-hour-spinner').val())+1);
    	}
    	if ($(this).val() < 0) {
    		if ($('#dur-hour-spinner').val() > 0) {
    			$(this).val(55);
    			$('#dur-hour-spinner').val(parseInt($('#dur-hour-spinner').val())-1);
    		}
    	}
    	if ($(this).val() <= 0) {
    		$(this).val('00');
    	}
    	if ($(this).val() == 5) {
    		$(this).val('05');
    	}
    });
    $('#dur-minute-spinner').val('00');
    
    
    
	/***	
	Modal Post Form Date
	 ***/
    
    $('#submit-post').click(function(e){
    	e.preventDefault();
    	console.log("default prevented")

    	let form = $(this).parent();

    	if (selected != null || selected != "") {
    		console.log("in null check", selected);
    		$('#selected-date').val(selected)
    		console.log($('#selected-date').val(selected))
    	}
    	else {
    		console.log("logic says selected = null; returning false")
    		return false;
    	}
    	$(this).attr('type', 'submit')
    	console.log($(this).attr('type'))
    	form.submit();
    })
    
    
    let cancelMapScroll = function(){
        let mapwrap = $('#mapwrap');
        let map = $('#map');

        map.addClass('scrolloff');
        mapwrap.on('click', function () {
            map.toggleClass('scrolloff');
        });

        // re-enable scrolling on mouseleave
        mapwrap.mouseleave(function () {
            map.addClass('scrolloff'); // set the pointer events to none when mouse leaves the map area
        });
    }
    cancelMapScroll()
    
    
});