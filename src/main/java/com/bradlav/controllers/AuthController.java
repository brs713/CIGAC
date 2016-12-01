package com.bradlav.controllers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import com.bradlav.models.User;


@Controller
public class AuthController extends AbstractController {

	private static class AuthError {
		private String[] userError = {
				"Invalid Username.",
				"Username already exists.",
				"Could not find a user by that username.",
				"usernames must be between 4 & 20 characters",
				"only letters, numbers, '_' and '-' ",
				"may be used in username creation"
		};
		private String[] passwordError = {
				"Please enter a valid password.",
				"Incorrect password.",
				"must be 4-16 characters"
		};
		private String confirmError = "Passwords do not match.";
		private String emailError = "Please enter an e-mail address.";
	}

	@RequestMapping(value = "/signup", method = RequestMethod.GET)
	public String signupFormGet(HttpServletRequest request, Model model) {

		return "signup";
	}

	@RequestMapping(value = "/signup", method = RequestMethod.POST)
	public String signupPost(HttpServletRequest request, Model model) {
		
		AuthError error = new AuthError();		

		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String verify = request.getParameter("confPassword");
		String email = request.getParameter("email");

		model.addAttribute("email", email);

		//Validate data.
		boolean hasError = false;
		if (!User.isValidUsername(username)) {
			hasError = true;
			model.addAttribute("usrError", error.userError[0]);
			if (username.length() < 4 || username.length() > 20) {
				model.addAttribute("usrGuideLength", error.userError[3]);
			}
			else {
				model.addAttribute("usrGuideAllowed", error.userError[4] + error.userError[5]);
			}

		}
		else { // username is valid
			

			// if this username already exists
			if (userDao.findByUsername(username) != null) {
				model.addAttribute("usrError", error.userError[1]);
				hasError = true;
			}

			else { // username doesn't already exist
				model.addAttribute("name", username);

				if (!User.isValidPassword(password)) {
					model.addAttribute("pwdError", error.passwordError[0]);
					model.addAttribute("pwdGuide", error.passwordError[2]);
					hasError = true;
				}
				model.addAttribute("username", username);
				//here - user doesn't exist & password is valid
			}
		}
		if (!verify.equals(password)) {
			model.addAttribute("cnfError", error.confirmError);
			model.addAttribute("emlError", error.emailError);
			hasError = true;
		}


		if (hasError) {
			model.addAttribute("errClass", "error");
			return "signup";
		}

		// create user/ create session / put them in
		User user = new User(username, password);
		userDao.save(user);
		login(request, user);

		return "redirect:profile";
	}

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String loginFormGet(HttpServletRequest request, Model model) {
		
		return "login";
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public String loginPost(HttpServletRequest request, Model model) {
		
		AuthError error = new AuthError();

		String username = request.getParameter("username");
		String password = request.getParameter("password");

		User user = userDao.findByUsername(username);

		boolean hasError = false;
		if (user == null) {
			model.addAttribute("usrError", error.userError[2]);
			model.addAttribute("usrGuide", error.userError[3] + " and contain " + error.userError[4]);
			hasError = true;
		}
		else {
			model.addAttribute("name", username);
			if (!user.isMatchingPassword(password)) {
				model.addAttribute("pwdError", error.passwordError[1]);
				model.addAttribute("pwdGuide", error.passwordError[2]);
				hasError = true;
			}
		}

		if (hasError) {
			return "login";
		}

		login(request, user);

		return "redirect:/";
	}

	@RequestMapping(value = "/logout", method = RequestMethod.GET)
	public String logout(HttpServletRequest request){
		request.getSession().invalidate();
		return "redirect:login";
	}


	private void login(HttpServletRequest request, User user) {
		HttpSession newSession = request.getSession();
		setUserInSession(newSession, user);
	}
}
