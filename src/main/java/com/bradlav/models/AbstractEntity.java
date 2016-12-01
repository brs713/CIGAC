package com.bradlav.models;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;

@MappedSuperclass
public abstract class AbstractEntity {

	private int id;
	
	@Id
    @GeneratedValue
    @NotNull
    @Column(name = "id", unique = true)
	public int getId() {
		return this.id;
	}
	
	protected void setId(int id) {
        this.id = id;
    }
	
}
