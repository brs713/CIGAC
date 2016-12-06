package com.bradlav.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name="loc")
public class Loc extends AbstractEntity{
	

	private String locName;
	private double longitude;
	private double latitude;
	private boolean isGym;
	private String postalAddress;
	private String city;
	private String state;
	private int zip;
	private String phone;
	private String webAddress;
	
	
	
	public Loc(String locName, double longitude, double latitude, boolean isGym, String postalAddress, String city,
			String state, int zip, String phone, String webAddress) {
		super();
		this.locName = locName;
		this.longitude = longitude;
		this.latitude = latitude;
		this.isGym = isGym;
		this.postalAddress = postalAddress;
		this.city = city;
		this.state = state;
		this.zip = zip;
		this.phone = phone;
		this.webAddress = webAddress;
	}
	
	public Loc() {}

	
	@NotNull
    @Column(name = "locName")
	public String getLocName() {
		return locName;
	}



	public void setLocName(String locName) {
		this.locName = locName;
	}


	@NotNull
    @Column(name = "longitude")
	public double getLongitude() {
		return longitude;
	}



	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}


	@NotNull
    @Column(name = "lat")
	public double getLatitude() {
		return latitude;
	}



	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}


	@NotNull
    @Column(name = "isGym")
	public boolean isGym() {
		return isGym;
	}



	public void setGym(boolean isGym) {
		this.isGym = isGym;
	}


	@Column(name = "streetAddress")
	public String getPostalAddress() {
		return postalAddress;
	}



	public void setPostalAddress(String postalAddress) {
		this.postalAddress = postalAddress;
	}


	@Column(name = "city")
	public String getCity() {
		return city;
	}



	public void setCity(String city) {
		this.city = city;
	}


	@Column(name = "state")
	public String getState() {
		return state;
	}



	public void setState(String state) {
		this.state = state;
	}


	@Column(name = "zip")
	public int getZip() {
		return zip;
	}



	public void setZip(int zip) {
		this.zip = zip;
	}


	@Column(name = "phone")
	public String getPhone() {
		return phone;
	}



	public void setPhone(String phone) {
		this.phone = phone;//phoneFormatter(phone);
	}


	@Column(name = "webAddress")
	public String getWebAddress() {
		return webAddress;
	}


	public void setWebAddress(String webAddress) {
		this.webAddress = webAddress;
	}
	
	
	private String phoneFormatter(String phone) {
		long phoneInt = -1;
		phone = phone.trim();
		int[] phoneDigits = new int[10];
		int index = 0;
		for (int i = 0; i < phone.length(); i++){
		    char c = phone.charAt(i);        
		    if (Character.isDigit(c)) {
		    	phoneDigits[index] = Character.digit(c, 10); //(int)c;
		    	index++;
		    }
		}
		return Long.toString(phoneInt);
	}
	
}