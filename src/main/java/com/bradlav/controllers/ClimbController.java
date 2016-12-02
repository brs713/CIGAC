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
import com.bradlav.models.Loc;
import com.bradlav.models.User;


// from blogz-spring.PostController.java
// public String singlePost(@PathVariable String username, @PathVariable int uid, Model model)
// @PathVariable String foo, @PathVariable String bar used for - "/loc/{foo}/{bar}"


@Controller
public class ClimbController extends AbstractController {
	
	static final int YEAR = 2016;
	static final long MINUTE = 60 * 1000;
	static final long HOUR = 60 * MINUTE;
 
	// POST A NEW CLIMB
	@RequestMapping(value = "/post", method = RequestMethod.GET)
    String postGet(HttpServletRequest request, Model model) {

		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());

		// need to create a list of locations
		List<Climb> climbs = climbDao.findAll();
		List<Loc> locs = new ArrayList<Loc>();
		for (Climb climb : climbs) {
			if (!(locs.contains(climb.getLoc()))) {
				locs.add(climb.getLoc());
			}
		}
		
		model.addAttribute("locs", locs);
		
        return "post";
    }
	

	@RequestMapping(value = "/post", method = RequestMethod.POST)
	String postPost(HttpServletRequest request, Model model) throws ParseException {

		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());

		// errors
		String locError = "Invalid location.";
		
		// get data
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
		
		// validate
		boolean hasError = false;
		
		if (loc == null) {
			model.addAttribute("locError", locError);
			hasError = true;
		}

		// error path
		if (hasError) {
			
			// retry
			return "post";
		}

		// create a new object
		Climb climb = new Climb();
		
		// declare variables for new objects properties
		SimpleDateFormat datepickerFormat = new SimpleDateFormat("yyyy-MM-dd");
 		Loc location = locDao.findByLocName(loc);
 		Date now = new Date();
 		Date startsWhen = now;
 		Date endsWhen = now;
 		
 		// process data to store values in new variables
 		long duration = (Long.parseLong(durHour) * 60) + Long.parseLong(durMinute);   
 		Date date = datepickerFormat.parse(startDate);
 		System.out.println("date is (startDate parsed):" + date);
 		try {
	 		startsWhen = datepickerFormat.parse(startDate);
 		} catch (Exception e){
 			System.out.println("\n\n***this is an exception: " + e);
 		};
 		long startHourLong = Long.parseLong(startHour);
 		if (ampm.equals("pm")) {
 			if (startHourLong != 12) {
	 			startHourLong += 12;
 			}
 		}
 		
 		long startsWhenLong = startsWhen.getTime()
 				+ (startHourLong * HOUR)
 				+ (Long.parseLong(startMinute) * MINUTE);

// 		System.out.println("StartsWhenLong: " + startsWhenLong
// 				+ "\nstartsWhen : " + startsWhen.getTime()
// 				+ "\nstartHour * HOUR: " + (startHourLong * HOUR)
// 				+ "\nstartMinute * MINUTE: " + (Long.parseLong(startMinute) * MINUTE));

 		startsWhen = new Date(startsWhenLong);
 		 		
 		long t= startsWhen.getTime();
 		endsWhen = new Date(t + (duration * MINUTE));
 		climb.setEndTime(endsWhen);

 		
 		// if not null, set variable in new object
 		climb.setUserInitiate(user);
 		climb.setLoc(location);
 		climb.setScheduledTime(startsWhen);

 		if (endsWhen != now) {
 	 		climb.setEndTime(endsWhen);			
		}
		
		// write the record to the db
		climbDao.save(climb);
/**		
TODO: Need some kind of alert/modal/confirmation screen here, but I think that's a JS issue. 
**/	
		// redirect
		return "redirect:/";
		
    }	
}
