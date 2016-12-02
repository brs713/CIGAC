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

	
	/**
	  HOMEPAGE - any method
	*/
	@RequestMapping(value = "/")
	public String index(Model model){
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
		model.addAttribute("user_logged", user.getUsername());
		
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

		// get data
		boolean isAccepted = Boolean.parseBoolean(request.getParameter("isAccepted"));
		int climbId = Integer.parseInt(request.getParameter("climbId"));

		// find the referenced climb
		Climb climb = climbDao.findById(climbId);
		
		// if the user's trying to catch his/her own climb		-  THIS SHOULD GO AWAY AFTER FRONT-END VALIDATION
		if (climb.getUserInitiate() == user) {
			return "redirect:/search";
		}
		
		// update db
		climb.setAccepted(isAccepted);
		climbDao.save(climb);
		
		// message the user (Tell them they're climb has been accepted.)
		Comm acceptance = new Comm();
		acceptance.setClimb(climb);
		acceptance.setFromUser(user);
		acceptance.setToUser(climb.getUserInitiate());
		Date now = new Date();
		acceptance.setMessageCreated(now);
		commDao.save(acceptance);
		
       return "redirect:/search";
    }	
}
