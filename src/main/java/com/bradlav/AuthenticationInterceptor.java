package com.bradlav;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.bradlav.controllers.AbstractController;
import com.bradlav.models.User;
import com.bradlav.models.dao.UserDao;

public class AuthenticationInterceptor extends HandlerInterceptorAdapter {

    @Autowired
    UserDao userDao;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {

        List<String> authPages = Arrays.asList(

        		);

        // Require sign-in for auth pages
        if ( authPages.contains(request.getRequestURI()) ) {

        	boolean isLoggedIn = false;
        	User user;
            Integer userId = (Integer) request.getSession().getAttribute(AbstractController.userSessionKey);

            if (userId != null) {
            	user = userDao.findById(userId);
            	
            	if (user != null) {
            		isLoggedIn = true;
            	}
            }

            // If user not logged in, redirect to login page
            if (!isLoggedIn) {
                response.sendRedirect("/login");
                return false;
            }
        }

        return true;
    }

}