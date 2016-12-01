package com.bradlav.controllers;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.bradlav.models.Climb;
import com.bradlav.models.User;


// from blogz-spring.PostController.java
// public String singlePost(@PathVariable String username, @PathVariable int uid, Model model)
// @PathVariable String foo, @PathVariable String bar used for - "/loc/{foo}/{bar}"


@Controller
public class ClimbController extends AbstractController {
	
	static final int YEAR = 2016;
	static final long MINUTE = 60 * 1000;
	static final long HOUR = 60 * MINUTE;

	
 
	// NEWCLIMB
	@RequestMapping(value = "/newclimb", method = RequestMethod.GET)
    String newclimbGet(HttpServletRequest request, Model model) {

		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());

		
		// need to create a list of locations
		List<Climb> climbs = climbDao.findAll();
		List<String> locs = new ArrayList<String>();
		for (Climb climb : climbs) {
			if (!(locs.contains(climb.getLocation()))) {
				locs.add(climb.getLocation());
			}
		}
		model.addAttribute("locs", locs);
//		Date now = new Date();
// 		System.out.println("\n\nnow is " + now + "\n\n");
//		now is Thu Nov 17 14:14:09 CST 2016
		
        return "newclimb";
    }
	

	@RequestMapping(value = "/newclimb", method = RequestMethod.POST)
	String newclimbPost(HttpServletRequest request, Model model) throws ParseException {

		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());

		// errors
		String locError = "Invalid location.";
		//String locGuide = "";
//		String whenError = "Invalid date.";
//		//String[] whenGuide = {};
//		//String durationError = "Invalid duration.";
//		//String durationGuide = "";
//		String empty = "cannot be empty";

		SimpleDateFormat datepickerFormat = new SimpleDateFormat("yyyy-MM-dd");
		
		
		// get data
//		String month = request.getParameter("month");
//		String day = request.getParameter("day");
//		String hour = request.getParameter("hour");
//		String minute = request.getParameter("minute");
//		String duration = request.getParameter("duration");
		String loc = request.getParameter("loc");
		String startDate = request.getParameter("start-date");
		String startHour = request.getParameter("start-hour");
		String startMinute = request.getParameter("start-minute");
		String ampm = request.getParameter("ampm");
		String durHour = request.getParameter("dur-hour");
		String durMinute = request.getParameter("dur-minute");
		
		// save user data in case of error
		model.addAttribute("loc", loc);
		model.addAttribute("start-date", loc);
		model.addAttribute("start-hour", startHour);
		model.addAttribute("start-minute", startMinute);
		model.addAttribute("ampm", ampm);
		model.addAttribute("dur-hour", "durHour");
		model.addAttribute("dur-minute", "durMinute");
		
		System.out.println("\n\n\tstartDate(String) is " + startDate);
		System.out.println(startHour +":"+ startMinute + " " + ampm);
		System.out.println(durHour +":"+ durMinute);
		System.out.println("location:  " + loc);  //null
		
		// validate
		boolean hasError = false;

		
		if (loc == null) {
			System.out.println("\n\t\t\tnull\n\n");
			model.addAttribute("locError", locError);
			hasError = true;
		}


		// error path
		if (hasError) {
			
			// retry
			return "newclimb";
		}

		// create a new object
		Climb climb = new Climb();
		
		// declare variables for new objects properties
 		String location = loc;
 		Date now = new Date();
 		Date startsWhen = now;
 		Date endsWhen = now;
 		
 		// process data to store values in new variables
 		
 		
 		long duration = (Long.parseLong(durHour) * 60) + Long.parseLong(durMinute);   
// 		Calendar c = Calendar.getInstance();
// 		c.clear();
// 		c.set(Calendar.DAY_OF_MONTH, Integer.parseInt(day));
// 		c.set(Calendar.MONTH, Integer.parseInt(month) - 1);
// 		c.set(Calendar.YEAR, YEAR);
 		Date date = datepickerFormat.parse(startDate);
 		System.out.println("date is (startDate parsed):" + date);
 		try {
	 		startsWhen = datepickerFormat.parse(startDate);
	 		System.out.println("in try startDate: " + startDate);
	 		System.out.println("in try startsWhen: " + startsWhen);
 		} catch (Exception e){
 			System.out.println("\n\n***this is an exception: " + e);
 		};
 //		startsWhen = c.getTime();
 		long startHourLong = Long.parseLong(startHour);
 		if (ampm.equals("pm")) {
 			System.out.println("in ampm, sHL = " + startHourLong);
 			if (startHourLong != 12) {
	 			startHourLong += 12;
	 			System.out.println("ending ampm, sHL = " + startHourLong);
 			}
 		}
 		System.out.println("outta if ampm loop");
 		
 		
 		long startsWhenLong = startsWhen.getTime()
 				+ (startHourLong * HOUR)
 				+ (Long.parseLong(startMinute) * MINUTE);
 		System.out.println("StartsWhenLong: " + startsWhenLong
 				+ "\nstartsWhen : " + startsWhen.getTime()
 				+ "\nstartHour * HOUR: " + (startHourLong * HOUR)
 				+ "\nstartMinute * MINUTE: " + (Long.parseLong(startMinute) * MINUTE));

 		
 		startsWhen = new Date(startsWhenLong);
 		System.out.println("in try : " + startDate);
 		
 		
 		System.out.println("\n\nstartsWhen is " + startsWhen + "\n\n"); 		
 		
 		long t= startsWhen.getTime();
 		endsWhen = new Date(t + (duration * MINUTE));
 		climb.setEndTime(endsWhen);


 		
 		// if not null, set variable in new object
 		climb.setUserInitiate(user);
 		climb.setLocation(location);
 		climb.setScheduledTime(startsWhen);

 		if (endsWhen != now) {
 	 		climb.setEndTime(endsWhen);			
		}
		
		// write the record to the db
		climbDao.save(climb);
		
		// redirect
		return "redirect:/";
		
    }
	
}

/*
 
		// errors
		String nameError = "Invalid name.";
		String nameGuide = "name must be between 2 and 20 characters";

		// get data
		String name = request.getParameter("name");

		// validate
		boolean hasError = false;

		// error path
		if (hasError) {
			
			// save user's data
 			if ( != null) {
				model.addAttribute("", );
			}

			// retry
			return "";
		}
		
		
		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		
		// create a new object
		= new ();
		
		// declare variables for new objects properties
 		
 		
 		// process data to store values in new variables
 		
 		
 		// if not null, set variable in new object
 		if ( != "") {
			
		}
		
		// write the record to the db
		somethingDao.save(object);
		
		// redirect
		return "redirect:/";

*/