package com.bradlav.controllers;

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
import com.bradlav.models.ClimbFormatter;
import com.bradlav.models.Comm;
import com.bradlav.models.Loc;
import com.bradlav.models.Profile;
import com.bradlav.models.User;

@Controller
public class MainController extends AbstractController {

	
//	/**
//	  ERROR - Get
//	*/
//	@RequestMapping(value = "/error", method = RequestMethod.GET)
//  String error(HttpServletRequest request, Model model){
//		return "error";
//	}
	
	/**
	  HOMEPAGE - get
	*/
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String splash(HttpServletRequest request, Model model){
	
		return "-Splash";
		
	}
	
	
	/**
	  HOMEPAGE - get
	*/
	@RequestMapping(value = "/home", method = RequestMethod.GET)
	public String homeGet(HttpServletRequest request, Model model){
		
//		Loc loc = new Loc();
//		loc.setLocName("ClimbSoIll");
//		loc.setLatitude(38.614884);
//		loc.setLongitude(-90.207767);
//		loc.setGym(true);
//		loc.setPostalAddress("1419 Carroll St");
//		loc.setCity("St. Louis");
//		loc.setState("MO");
//		loc.setZip(63104);
//		loc.setPhone("3146211700");
//		loc.setWebAddress("climbsoill.com");
//		locDao.save(loc);
//		
//		Loc loc1 = new Loc();
//		loc1.setLocName("Upper Limits Downtown");
//		loc1.setLatitude(38.626543);
//		loc1.setLongitude(-90.211079);
//		loc1.setGym(true);
//		loc1.setPostalAddress("326 S 21st St");
//		loc1.setCity("St. Louis");
//		loc1.setState("MO");
//		loc1.setZip(63103);
//		loc1.setPhone("3142417625");
//		loc1.setWebAddress("upperlimits.com");
//		locDao.save(loc1);
//
//		Loc loc2 = new Loc();
//		loc2.setLocName("Upper Limits Maryland Heights");
//		loc2.setLatitude(38.694640);
//		loc2.setLongitude(-90.412375);
//		loc2.setGym(true);
//		loc2.setPostalAddress("1874 Lackland Hill Pkwy");
//		loc2.setCity("St. Louis");
//		loc2.setState("MO");
//		loc2.setZip(63146);
//		loc2.setPhone("3149912516");
//		loc2.setWebAddress("upperlimits.com");
//		locDao.save(loc2);
//		
//		Loc loc3 = new Loc();
//		loc3.setLocName("Jackson Falls");
//		loc3.setLatitude(37.506825);
//		loc3.setLongitude(-88.681467);
//		loc3.setGym(false);
//		locDao.save(loc3);
//		
//		Loc loc4 = new Loc();
//		loc4.setLocName("Horseshoe Canyon Ranch");
//		loc4.setLatitude(36.0118);
//		loc4.setLongitude(-93.2922);
//		loc4.setGym(false);
//		loc4.setPostalAddress("70 HC");
//		loc4.setCity("Jasper");
//		loc4.setState("AR");
//		loc4.setZip(72641);
//		loc4.setPhone("8704462555");
//		loc4.setWebAddress("http://horseshoecanyonduderanch.com/things-to-do/rock-climbing/");
//		locDao.save(loc4);
		
		
		
		
		
		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		if (user != null) {
			model.addAttribute("user_logged", user.getUsername());			
		}
		else {
			model.addAttribute("user_logged", "lurker");
		}
		
		// get data
		List<User> users = userDao.findAll();
		List<Profile> profiles = profileDao.findAll();
		List<Climb> climbList = climbDao.findAllByOrderByScheduledTimeAsc();
		List<Loc> locs = locDao.findAll();
//		List<Comm> comms = commDao.findAll();

		// format climb output
		List<ClimbFormatter> climbs = new ArrayList<ClimbFormatter>();
		for (Climb climb : climbList) {
			climbs.add(new ClimbFormatter(climb));
		}
		
		//pass in data
		model.addAttribute("users", users);
		model.addAttribute("climbs", climbs);
		model.addAttribute("profiles", profiles);
		model.addAttribute("locs", locs);
//		model.addAttribute("comms", comms);
		
		return "-home";
	}
	
	/**
	  HOMEPAGE - post
	*/
	@RequestMapping(value = "/home", method = RequestMethod.POST)
	public String homePost(HttpServletRequest request, Model model){
		
		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		if (user != null) {
			model.addAttribute("user_logged", user.getUsername());			
		}
		else {
			model.addAttribute("user_logged", "lurker");
		}
		
		// get data
		List<User> users = userDao.findAll();
		List<Profile> profiles = profileDao.findAll();
		List<Climb> climbList = climbDao.findAllByOrderByScheduledTimeAsc();
		List<Loc> locs = locDao.findAll();
//		List<Comm> comms = commDao.findAll();

		// format climb output
		List<ClimbFormatter> climbs = new ArrayList<ClimbFormatter>();
		for (Climb climb : climbList) {
			climbs.add(new ClimbFormatter(climb));
		}
		
		//pass in data
		model.addAttribute("users", users);
		model.addAttribute("climbs", climbs);
		model.addAttribute("profiles", profiles);
		model.addAttribute("locs", locs);
//		model.addAttribute("comms", comms);

		
		String loc = request.getParameter("location");
		Long dateInput = Long.parseLong(request.getParameter("selected-date"));
		Long hourInput = Long.parseLong(request.getParameter("hour-spinner"));
		Long minuteInput = Long.parseLong(request.getParameter("minute-spinner"));
		String ampm = request.getParameter("ampm");
		Long durHourInput = Long.parseLong(request.getParameter("dur-hour-spinner"));
		Long durMinuteInput = Long.parseLong(request.getParameter("dur-minute-spinner"));
		
 		if (ampm.equals("pm")) {
 			if (hourInput != 12) {
 				hourInput += 12;
 			}
 		}
 		else {
 			if (hourInput == 12) {
 				hourInput = (long) 0;
 			}
 		}

		hourInput *= 60 * 60 * 1000;
		minuteInput *= 60 * 1000;
		Date startTime = new Date(dateInput + hourInput + minuteInput);
		System.out.println("\n\n\tstartTime = " + startTime);
		
		durHourInput *= 60 * 60 * 1000;
		durMinuteInput *= 60 * 1000;
		Date endTime = new Date(startTime.getTime() + durHourInput + durMinuteInput);
		
		Climb climb = new Climb();
		climb.setUserInitiate(user);
		climb.setLoc(locDao.findByLocName(loc));
		climb.setScheduledTime(startTime);
		climb.setEndTime(endTime);
		climbDao.save(climb);
		
		return "-home";
		
	}
	
	
	/**
	  SEARCH - Get
	*/
	@RequestMapping(value = "/search", method = RequestMethod.GET)
    String searchClimbsGet(HttpServletRequest request, Model model){
		
		System.out.println("\n\n\t\t<<<<<   GET SEARCH-CLIMBS   >>>>>");

		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		if (user != null) {
			model.addAttribute("user_logged", user.getUsername());			
		}
		else {
			model.addAttribute("user_logged", "lurker");
		}

		// get data
		List<User> users = userDao.findAll();
		List<Profile> profiles = profileDao.findAll();
		List<Climb> climbList = climbDao.findAllByOrderByScheduledTimeAsc();
		List<Loc> locs = locDao.findAll();
		List<Comm> comms = commDao.findAll();

		// format climb output
		List<ClimbFormatter> climbs = new ArrayList<ClimbFormatter>();
		for (Climb climb : climbList) {
			climbs.add(new ClimbFormatter(climb));
		}
		
		for (ClimbFormatter climb : climbs) {
//			System.out.println("\n\t" + climb.getStartLong() +"   " +climb.getEndLong() );
		}
		
		//pass in data
		model.addAttribute("users", users);
		model.addAttribute("climbs", climbs);
		model.addAttribute("profiles", profiles);
		model.addAttribute("locs", locs);
		model.addAttribute("comms", comms);

        return "-search";
    }
	
	
	/**
	  SEARCH - Post
	*/
	@RequestMapping(value = "/search", method = RequestMethod.POST)
	String searchClimbsPost(HttpServletRequest request, Model model) {

		System.out.println("\n\n\t\t*****   SEARCH - post method    *****");
		
		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());		

		
		String gym = request.getParameter("is-gym");
		System.out.println("\n\n\t\t\t This is the value of gym: "+gym);

		
		if (gym != null && gym != "") {		// not sure which
		
			boolean isGym = Boolean.parseBoolean(gym);
			String locName = request.getParameter("loc-name");
			double latitude = Double.parseDouble(request.getParameter("loc-lat"));
			double longitude = Double.parseDouble(request.getParameter("loc-lng"));

			Loc loc = new Loc();

			loc.setLocName(locName);
			loc.setLatitude(latitude);
			loc.setLongitude(longitude);
			loc.setGym(isGym);

			if (isGym) {
				
				String postalAddress = request.getParameter("loc-address");
				String city = request.getParameter("loc-city");
				String state = request.getParameter("loc-state");
				int zip = Integer.parseInt(request.getParameter("loc-zip"));
				String phone = request.getParameter("loc-phone");
				String webAddress = request.getParameter("loc-site");
				
				loc.setPostalAddress(postalAddress);
				loc.setCity(city);
				loc.setState(state);
				loc.setZip(zip);
				loc.setPhone(phone);
				loc.setWebAddress(webAddress);

			}
			
			locDao.save(loc);
		}

		else {
			// get data
			
			
			boolean isAccepted = Boolean.parseBoolean(request.getParameter("isAccepted"));
			int climbId = Integer.parseInt(request.getParameter("climbId"));
			System.out.println("\n\taccepted is " + isAccepted + "   climbId is " + climbId + "\n");

			// find the referenced climb
			Climb climb = climbDao.findById(climbId);

			// update db
			climb.setAccepted(isAccepted);
			climb.setUserAcceptor(user);
			climbDao.save(climb);

			// message the user (Tell them they're climb has been accepted.)
			Comm acceptance = new Comm();
			acceptance.setClimb(climb);
			acceptance.setFromUser(user);
			acceptance.setToUser(climb.getUserInitiate());
			Date now = new Date();
			acceptance.setMessageCreated(now);
			commDao.save(acceptance);
		}
       return "redirect:/search";
    }	
}
