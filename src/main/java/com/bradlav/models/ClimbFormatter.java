package com.bradlav.models;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class ClimbFormatter {

	private Climb climb;
	SimpleDateFormat month = new SimpleDateFormat("MMM");
	SimpleDateFormat date = new SimpleDateFormat("d");
	SimpleDateFormat day = new SimpleDateFormat("E");
	SimpleDateFormat hour = new SimpleDateFormat("h");
	SimpleDateFormat minute = new SimpleDateFormat("mm");
	Calendar c = Calendar.getInstance();
	String ampm;
	
	
	public ClimbFormatter(Climb climb) {
		super();
		this.climb = climb;
	}

	// GETTERS & SETTERS
	public Climb getClimb() {
		return climb;
	}

	public void setClimb(Climb climb) {
		this.climb = climb;
	}

	public User getUserInitiate() {
		return this.climb.getUserInitiate();
	}
	
	public User getUserAcceptor() {
		return this.climb.getUserAcceptor();
	}

	public String getLocation() {
		return this.climb.getLocation();
	}

	public Date getScheduledTime() {
		return this.climb.getScheduledTime();
	}
	
	public Date getEndTime() {
		return this.climb.getEndTime();
	}

	public boolean isAccepted() {
		return this.climb.isAccepted();
	}
	
	public String getStartMonth() {
		return month.format(this.climb.getScheduledTime());
	}
	public String getStartDate() {
		return date.format(this.climb.getScheduledTime());
	}	
	public String getStartDay() {
		return day.format(this.climb.getScheduledTime());
	}
	public String getStartHour() {
		return hour.format(this.climb.getScheduledTime());
	}
	public String getStartMinute() {
		return minute.format(this.climb.getScheduledTime());
	}
	public String getStartAmpm() {
		this.c.setTime(this.climb.getScheduledTime());
		return (c.get(Calendar.AM_PM)) == 0 ? "am" : "pm";		
	}

	
}
