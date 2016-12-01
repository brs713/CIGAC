package com.bradlav.models;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
@Table(name = "user")
public class User extends AbstractEntity {

	private String username;
	private String pwHash;
	private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
//	private Profile userProfile;
	// Do I need a 'private List<Climbs> usersClimbs;' here?

	
	// CONSTRUCTORS //
	public User(String username, String password) {
		
		super();
		
		if (!isValidUsername(username)) {
			throw new IllegalArgumentException("Invalid username");
		}
		
		this.username = username;
		this.pwHash = hashPassword(password);
		
	}
	
	// No-Arg Constructor
	public User() {}
	
	
	// GETTERS & SETTERS //
	@NotNull
    @Column(name = "pwhash")
	public String getPwHash() {
		return pwHash;
	}
	
	@SuppressWarnings("unused")
	private void setPwHash(String pwHash) {
		this.pwHash = pwHash;
	}
	
	@NotNull
    @Column(name = "username", unique = true)
	public String getUsername() {
		return username;
	}
	
	@SuppressWarnings("unused")
	private void setUsername(String username) {
		this.username = username;
	}
	
	// this isn't a column
//	public Profile getUserProfile() {
//		return userProfile;
//	}
//
//	public void setUserProfile(Profile userProfile) {
//		this.userProfile = userProfile;
//	}

	// UTILITY METHODS
	private static String hashPassword(String password) {		
		return encoder.encode(password);
	}
	
	public boolean isMatchingPassword(String password) {
		return encoder.matches(password, pwHash);
	}
	
	public static boolean isValidPassword(String password) {
		Pattern validUsernamePattern = Pattern.compile("(\\S){4,20}");
		Matcher matcher = validUsernamePattern.matcher(password);
		return matcher.matches();
	}
	
	public static boolean isValidUsername(String username) {
		Pattern validUsernamePattern = Pattern.compile("[a-zA-Z][a-zA-Z0-9_-]{3,20}");
		Matcher matcher = validUsernamePattern.matcher(username);
		return matcher.matches();
	}
	
		
}
