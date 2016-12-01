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

import com.bradlav.models.ClimbFormatter;
import com.bradlav.models.Climb;
import com.bradlav.models.Comm;
import com.bradlav.models.Profile;
import com.bradlav.models.User;

@Controller
public class MainController extends AbstractController {


	@RequestMapping(value = "/")
	public String index(Model model){
		return "home";
	}
	
	// SEARCH-CLIMBS
	@RequestMapping(value = "/search-climbs", method = RequestMethod.GET)
    String searchClimbsGet(HttpServletRequest request, Model model){
		
		System.out.println("\n\n\t\t<<<<<   GET SEARCH-CLIMBS   >>>>>");

		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());
		
		//get data
		List<User> users = userDao.findAll();
		List<Profile> profiles = profileDao.findAll();
		List<Climb> climbList = climbDao.findAllByOrderByScheduledTimeAsc();
		List<ClimbFormatter> climbs = new ArrayList<ClimbFormatter>();

//		for (Climb c : climbList) {
//			System.out.print(c.getId() +" "+ c.getUserInitiate() + "   ");
//		}
//		System.out.println("\n");
		
		for (Climb climb : climbList) {
			climbs.add(new ClimbFormatter(climb));
		}

//		for (ClimbFormatter c : climbs) {
//			System.out.print(c.getClimb().getId() +" "+ c.getUserInitiate() + "   ");
//		}
		
		// need to create a list of locations
		List<String> locs = new ArrayList<String>();
		for (Climb climb : climbList) {
			if (!(locs.contains(climb.getLocation()))) {
				locs.add(climb.getLocation());
			}
		}
		
//		for (ClimbFormatter climb : climbs) {
//			System.out.println("\n\n\nThis climb is:" + climb);
//		}
		
		
		//pass in data
		model.addAttribute("tab", "cal");
		model.addAttribute("calContent", true);
		model.addAttribute("locContent", false);
		model.addAttribute("pplContent", false);

		model.addAttribute("users", users);
		model.addAttribute("climbs", climbs);
		model.addAttribute("profiles", profiles);
		model.addAttribute("locs", locs);

        return "search-climbs";
    }
	
	
	
	@RequestMapping(value = "/search-climbs", method = RequestMethod.POST)
	String searchClimbsPost(HttpServletRequest request, Model model) {

		System.out.println("\n\n\t\t*****   SEARCH-CLIMBS posted   *****");
		
		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());		

		boolean isAccepted = Boolean.parseBoolean(request.getParameter("isAccepted"));
		System.out.println("accepted is: " + isAccepted);
		
		int climbId = Integer.parseInt(request.getParameter("climbId"));
		
		System.out.println("vars are:" + isAccepted + climbId);

		Climb climb = climbDao.findById(climbId);
		
		if (climb.getUserInitiate() == user) {
			System.out.println("Can't catch yourself"); //
			return "redirect:/search-climbs";
		}
		
		climb.setAccepted(isAccepted);
		climbDao.save(climb);
		
		Comm acceptance = new Comm();
		acceptance.setClimb(climb);
		acceptance.setFromUser(user);
		acceptance.setToUser(climb.getUserInitiate());
		Date now = new Date();
		acceptance.setMessageCreated(now);
		commDao.save(acceptance);
		
		
//		{date-hidden}{3:15pm}:  {Siri}   with   {Sarge}   at   {SoIll}		
//		{date-hidden}{3:15pm}:  {Luna}   wants to climb at   {Upper Limits}  -  {Accept btn}
		


/* chunk of sample from communication
 		String m = "";
 		for (Comm comm : comms) {
 			String person = profileDao.findByUser(comm.getFromUser()).getName();
 			String place = comm.getClimb().getLocation();
 			String ampm = (c.get(Calendar.AM_PM)) == 0 ? "am" : "pm";

 			m += "<p>" + person + " agreed to climb with you at "
 					+ place + " on " 
 					+ beginning.format(t) + " at " 
 					+ middle.format(t) + " " 
 					+ ampm + "</p>";
 		}

*/

//Assemble:
		//Month & Day
		
		
		//Time
		

		//User Initiate
		
		
		//User Acceptor
		
		
       return "redirect:/search-climbs";
    }


	
	
	
	// CAL
	@RequestMapping(value = "/cal", method = RequestMethod.GET)
    String calendarGet(HttpServletRequest request, Model model){

		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());
		
		//get data
		List<User> users = userDao.findAll();
		List<Profile> profiles = profileDao.findAll();
		List<Climb> climbList = climbDao.findAllByOrderByScheduledTimeAsc();
		List<ClimbFormatter> climbs = new ArrayList<ClimbFormatter>();
		for (Climb c : climbList) {
			System.out.print(c.getId() +" "+ c.getUserInitiate() + "   ");
		}
		System.out.println("\n");
		
		for (Climb climb : climbList) {
			climbs.add(new ClimbFormatter(climb));
		}
		for (ClimbFormatter c : climbs) {
			System.out.print(c.getClimb().getId() +" "+ c.getUserInitiate() + "   ");
		}
		
		System.out.println("\n\n\n");
		
		//pass in data
		model.addAttribute("tab", "cal");
		model.addAttribute("calContent", true);
		model.addAttribute("locContent", false);
		model.addAttribute("pplContent", false);

		model.addAttribute("users", users);
		model.addAttribute("climbs", climbs);
		model.addAttribute("profiles", profiles);

        return "cal";
    }
	@RequestMapping(value = "/cal", method = RequestMethod.POST)
	String searchPost(HttpServletRequest request, Model model) {

		System.out.println("\n\n\t\t*****   CAL posted   *****");
		
		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());		

		boolean isAccepted = Boolean.parseBoolean(request.getParameter("isAccepted"));
		int climbId = Integer.parseInt(request.getParameter("climbId"));
		
		System.out.println("vars are:" + isAccepted + climbId);
       return "cal";
    }
	
	
	// LOC
	@RequestMapping(value = "/loc", method = RequestMethod.GET)
    String locationsGet(HttpServletRequest request, Model model){

		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());
		
		// get data
		List<User> users = userDao.findAll();
		List<Climb> climbs = climbDao.findAllByOrderByScheduledTimeAsc();
		List<Profile> profiles = profileDao.findAll();

		// need to create a list of locations
		List<String> locs = new ArrayList<String>();
//		locs.add("-Crags-");
		for (Climb climb : climbs) {
			if (!(locs.contains(climb.getLocation()))) {
				locs.add(climb.getLocation());
			}
		}
		
		// pass in data
		model.addAttribute("tab", "loc");
		model.addAttribute("calContent", false);
		model.addAttribute("locContent", true);
		model.addAttribute("pplContent", false);

		model.addAttribute("users", users);
		model.addAttribute("climbs", climbs);
		model.addAttribute("profiles", profiles);
		model.addAttribute("locs", locs);

        return "loc";
    }
	@RequestMapping(value = "/loc", method = RequestMethod.POST)
	String locationsPost(HttpServletRequest request, Model model) {

		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());

        return "loc";
    }
	
	
	// PPL
	@RequestMapping(value = "/ppl", method = RequestMethod.GET)
    String peopleGet(HttpServletRequest request, Model model){

		
		//displays a list of people in main & their climbing sessions in detail(order by next unfilled climbSession?)
				
		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());
		
		// get data
		List<User> users = userDao.findAll();
		List<Climb> climbs = climbDao.findAllByOrderByScheduledTimeAsc();
		List<Profile> profiles = profileDao.findAll();

		// pass in data
		model.addAttribute("tab", "ppl");
		model.addAttribute("calContent", false);
		model.addAttribute("locContent", false);
		model.addAttribute("pplContent", true);
		
		model.addAttribute("users", users);
		model.addAttribute("climbs", climbs);
		model.addAttribute("profiles", profiles);

        return "ppl";
    }
	@RequestMapping(value = "/ppl", method = RequestMethod.POST)
	String peoplePost(HttpServletRequest request, Model model) {

		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());

        return "ppl";
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
