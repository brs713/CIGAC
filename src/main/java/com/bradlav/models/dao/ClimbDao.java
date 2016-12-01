package com.bradlav.models.dao;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bradlav.models.Climb;
import com.bradlav.models.User;


@Transactional
@Repository
public interface ClimbDao extends CrudRepository<Climb, Integer> {

	List<Climb> findAll();
	List<Climb> findAllByOrderByScheduledTimeAsc();
	
	Climb findById(int id);
	Climb findById(Climb climb);
	
	List<Climb> findByUserInitiate(User userInitiate);	
	List<Climb> findByUserInitiate(int uid);
	
	List<Climb> findByUserAcceptor(User userAcceptor);
	List<Climb> findByUserAcceptor(int uid);
	
	List<Climb> findByLocation(String location);
	
	List<Climb> findByScheduledTime(Date scheduledTime);
	

}
