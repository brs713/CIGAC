package com.bradlav.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "profile")
public class Profile extends AbstractEntity{

	private User user;
	private String name; 
//	private Image pic;
	private String homeGym;

	private int leadPracticeMin;
	private int leadPracticeMax;
	private int topropePracticeMin;
	private int topropePracticeMax;
	private int boulderPracticeMin;
	private int boulderPracticeMax;

	// CONSTRUCTORS
	public Profile(User user, String name, String homeGym, int leadPracticeMin, int leadPracticeMax,
			int topropePracticeMin, int topropePracticeMax, int boulderPracticeMin, int boulderPracticeMax) {
		super();
		this.user = user;
		this.name = name;
//		this.pic = pic;
		this.homeGym = homeGym;
		this.leadPracticeMin = leadPracticeMin;
		this.leadPracticeMax = leadPracticeMax;
		this.topropePracticeMin = topropePracticeMin;
		this.topropePracticeMax = topropePracticeMax;
		this.boulderPracticeMin = boulderPracticeMin;
		this.boulderPracticeMax = boulderPracticeMax;
	}
	
	// Main constructor
	public Profile(User user, String name) {
		this.user = user;
		this.name = name;
	}

	// No-arg Constructor
	public Profile() {}


	// GETTERS & SETTERS
	
	@NotNull
	@ManyToOne//(mappedBy="user")
	//@Column(name = "user")
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@NotNull
	@Column(name = "name")
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	//@Column(name = "pic")  *** how do you put an img in a db column?
//	public Image getPic() {
//		return pic;
//	}
//	public void setPic(Image pic) {
//		this.pic = pic;
//	}

	@Column(name = "homeGym")
	public String getHomeGym() {
		return homeGym;
	}

	public void setHomeGym(String homeGym) {
		this.homeGym = homeGym;
	}

	@Column(name = "leadpracmin")
	public int getLeadPracticeMin() {
		return leadPracticeMin;
	}

	public void setLeadPracticeMin(int leadPracticeMin) {
		this.leadPracticeMin = leadPracticeMin;
	}

	@Column(name = "leadpracmax")
	public int getLeadPracticeMax() {
		return leadPracticeMax;
	}
	public void setLeadPracticeMax(int leadPracticeMax) {
		this.leadPracticeMax = leadPracticeMax;
	}

	@Column(name = "trpracmin")
	public int getTopropePracticeMin() {
		return topropePracticeMin;
	}
	public void setTopropePracticeMin(int topropePracticeMin) {
		this.topropePracticeMin = topropePracticeMin;
	}

	@Column(name = "trpracmax")
	public int getTopropePracticeMax() {
		return topropePracticeMax;
	}
	public void setTopropePracticeMax(int topropePracticeMax) {
		this.topropePracticeMax = topropePracticeMax;
	}

	@Column(name = "bldpracmin")
	public int getBoulderPracticeMin() {
		return boulderPracticeMin;
	}
	public void setBoulderPracticeMin(int boulderPracticeMin) {
		this.boulderPracticeMin = boulderPracticeMin;
	}

	@Column(name = "bldpracmax")
	public int getBoulderPracticeMax() {
		return boulderPracticeMax;
	}
	public void setBoulderPracticeMax(int boulderPracticeMax) {
		this.boulderPracticeMax = boulderPracticeMax;
	}

//	public void deleteObject(int id)
//	{
//	    String deleteStatement = "DELETE FROM hosts WHERE id=?";
//	    try
//	    {
//	        getSimpleJdbcTemplate().update(deleteStatement, id);
//	    }
//	    catch (RuntimeException runtimeException) 
//	    {
//	        System.err.println("***NagiosHostDao::deleteObject, RuntimeException occurred, message follows.");
//	        System.err.println(runtimeException);
//	        throw runtimeException;
//	    }
//	}


}

