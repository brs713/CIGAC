package com.bradlav.models;


import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;


@Entity
@Table(name = "climbs")
public class Climb extends AbstractEntity {
	
	private User userInitiate;
	private User userAcceptor;
	private String location;
	private Date scheduledTime;
	private Date endTime;
	private boolean isAccepted;
	SimpleDateFormat month = new SimpleDateFormat("MM");
	SimpleDateFormat date = new SimpleDateFormat("d");
	SimpleDateFormat day = new SimpleDateFormat("E");
	SimpleDateFormat hour = new SimpleDateFormat("h");
	SimpleDateFormat minute = new SimpleDateFormat("mm");
	Calendar c = Calendar.getInstance();
	String ampm;

	public Climb(User userInitiate, User userAcceptor, String location, Date scheduledTime, Date endTime,
			boolean isAccepted) {
		super();
		this.userInitiate = userInitiate;
		this.userAcceptor = userAcceptor;
		this.location = location;
		this.scheduledTime = scheduledTime;
		this.endTime = endTime;
		this.isAccepted = false;
	}
	
	// No-arg Constructor
	public Climb() {}
	
	
	// GETTERS & SETTERS
	@NotNull
	@ManyToOne
	//@Column(name = "userInitiate")
	public User getUserInitiate() {
		return userInitiate;
	}
	public void setUserInitiate(User userInitiate) {
		this.userInitiate = userInitiate;
	}
	
	@ManyToOne
	//@Column(name = "userAcceptor")
	public User getUserAcceptor() {
		return userAcceptor;
	}
	public void setUserAcceptor(User userAcceptor) {
		this.userAcceptor = userAcceptor;
	}
	
	@NotNull
	@Column(name = "location")
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	
	@NotNull
	@Column(name = "scheduledTime")//, insertable = false, updatable = false)
	public Date getScheduledTime() {
		return scheduledTime;
	}
	public void setScheduledTime(Date scheduledTime) {
		this.scheduledTime = scheduledTime;
	}
	
	@Column(name = "endTime")
	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	@NotNull
	@Column(name = "isAccepted")
	public boolean isAccepted() {
		return isAccepted;
	}
	public void setAccepted(boolean isAccepted) {
		this.isAccepted = isAccepted;
	}
	
}





