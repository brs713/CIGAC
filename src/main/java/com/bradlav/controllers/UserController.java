package com.bradlav.controllers;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.bradlav.models.Comm;
import com.bradlav.models.Loc;
import com.bradlav.models.Profile;
import com.bradlav.models.User;


@Controller
public class UserController extends AbstractController {


	@RequestMapping(value = "/profile", method = RequestMethod.GET)
	String getProfile(HttpServletRequest request, Model model){

		// get this session's user & give it to the nav line
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());

		// find a profile for this user, if one exists
		Profile profile;
		if (profileDao.findByUser(user) != null) {
			profile = profileDao.findByUser(user);

			String name = profile.getName();

			String gym = profile.getHomeGym();
			int leadMin = profile.getLeadPracticeMin();
			int leadMax = profile.getLeadPracticeMax();
			int trMin = profile.getTopropePracticeMin();
			int trMax = profile.getTopropePracticeMax();
			int boulderMin = profile.getBoulderPracticeMin();
			int boulderMax = profile.getBoulderPracticeMax();

			model.addAttribute("name", name);
			model.addAttribute("gym", gym);
			model.addAttribute("leadMin", leadMin);
			model.addAttribute("leadMax", leadMax);
			model.addAttribute("trMin", trMin);
			model.addAttribute("trMax", trMax);
			model.addAttribute("boulderMin", boulderMin);
			model.addAttribute("boulderMax", boulderMax);
		}

		return "-profile";
	}

	@RequestMapping(value = "/profile", method = RequestMethod.POST)
	String postProfile(HttpServletRequest request, Model model) {
		
		// get this session's user & give it to the nav line
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());

		// errors
		String nameError = "Invalid name.";
		String nameGuide = "name must be between 2 and 20 characters";

		// get data
		String name = request.getParameter("name");
		String gym = request.getParameter("gym");
		String leadMin = request.getParameter("leadMin");
		String leadMax = request.getParameter("leadMax");	
		String trMin = request.getParameter("trMin");
		String trMax = request.getParameter("trMax");	
		String boulderMin = request.getParameter("boulderMin");
		String boulderMax = request.getParameter("boulderMax");
		System.out.println("name, gym, lead, tr, boulder are: " + name + "  " + gym + "  " + leadMin + "/" + leadMax + "  " + trMin + "/" + trMax + "  " + boulderMin + "/" + boulderMax);

		// validate
		boolean hasError = false;
		if (name != null && name.trim().length() < 2 || name.trim().length() > 20) {
			model.addAttribute("nameError", nameError);
			model.addAttribute("nameGuide", nameGuide);
			hasError = true;
		}


		// error path
		if (hasError) {

			// save user's data in the form in event of an error
			if (name != null) {
				model.addAttribute("name", name);
			}
			if (gym != null) {
				model.addAttribute("gym", gym);
			}
			if (leadMin != null) {
				model.addAttribute("leadMin", leadMin);
			}
			if (leadMax != null) {
				model.addAttribute("leadMax", leadMax);
			}
			if (trMin != null) {
				model.addAttribute("trMin", trMin);
			}
			if (trMax != null) {
				model.addAttribute("trMax", trMax);
			}
			if (boulderMin != null) {
				model.addAttribute("boulderMin", boulderMin);
			}
			if (boulderMax != null) {
				model.addAttribute("boulderMax", boulderMax);
			}

/***		
TODO: //Validate mins are less than maxes.
***/

			
			// try again
			return "profile";
		}

		// find a profile for this user, if one exists
		Profile profile;
		if (profileDao.findByUser(user) != null) {
			profile = profileDao.findByUser(user);
		}
		else {
			profile = new Profile(user, name);			
		}

		// if not empty, process data & set it in the profile
		if (gym != "") {
			profile.setHomeGym(gym);
		}
		if (leadMin != "") {
			profile.setLeadPracticeMin(Integer.parseInt(leadMin));
		}
		if (leadMax != "") {
			profile.setLeadPracticeMax(Integer.parseInt(leadMax));
		}
		if (trMin != "") {
			profile.setTopropePracticeMin(Integer.parseInt(trMin));
		}
		if (trMax != "") {
			profile.setTopropePracticeMax(Integer.parseInt(trMax));
		}

		if (boulderMin != "") {
			profile.setBoulderPracticeMin(Integer.parseInt(boulderMin));
		}
		if (boulderMax != "") {
			profile.setBoulderPracticeMax(Integer.parseInt(boulderMax));
		}

				
		// write the record to the db
		profileDao.save(profile);

		// redirect
		return "redirect:/";  	

	}


	@RequestMapping(value = "/comm", method = RequestMethod.GET)
	String commGet(HttpServletRequest request, Model model) {
				
		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());

		
		//THIS DOESN'T BELONG HERE; SOMETHING LIKE THIS WILL GO SOMEWHERE ELSE LATER TO CREATE A COMMUNICATION WHEN A CLIMB IS ACCEPTED
//		List<Climb> climbs = climbDao.findByUserInitiate(user);
//		for (Climb climb : climbs) {
////			if (climb.isAccepted()) {
//				Comm message = new Comm(user, userDao.findById(1), climb);
////				commDao.save(message);
////			}
//		}
		
		// query for the data needed & save it
		List<Comm> comms = commDao.findByToUser(user);
		

 		String m = "";
 		for (Comm comm : comms) {
 			SimpleDateFormat beginning = new SimpleDateFormat(" E,  MM-d ");
 			SimpleDateFormat middle  = new SimpleDateFormat(" h:mm");
 			Calendar c = Calendar.getInstance();
 			Date t = comm.getClimb().getScheduledTime();
 			c.setTime(t);

 			String person = profileDao.findByUser(comm.getFromUser()).getName();
 			Loc place = comm.getClimb().getLoc();
 			String ampm = (c.get(Calendar.AM_PM)) == 0 ? "am" : "pm";

 			m += "<p>" + person + " agreed to climb with you at "
 					+ place + " on " 
 					+ beginning.format(t) + " at " 
 					+ middle.format(t) + " " 
 					+ ampm + "</p>";
 		}
		
 		System.out.println(m);
 		
 		model.addAttribute("div", m);
		
		return "comm";
	}
	
	
	@RequestMapping(value = "/comm", method = RequestMethod.POST)
	String commPost(HttpServletRequest request, Model model) {
		
		// get this session's user
		HttpSession thisSession = request.getSession();
		User user = getUserFromSession(thisSession);
		model.addAttribute("user_logged", user.getUsername());
		
		return "comm";
	}


}
