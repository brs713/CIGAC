package com.bradlav.models.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bradlav.models.Loc;

@Transactional
@Repository
public interface LocDao extends CrudRepository<Loc, Integer> {
	
	List<Loc> findAll();
	
	Loc findById(Loc loc);
	
	Loc findByLocName(String locName);

}
