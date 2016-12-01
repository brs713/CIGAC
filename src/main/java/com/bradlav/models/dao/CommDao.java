package com.bradlav.models.dao;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bradlav.models.Climb;
import com.bradlav.models.Comm;
import com.bradlav.models.User;

@Transactional
@Repository
public interface CommDao extends CrudRepository<Comm, Integer> {
	
	List<Comm> findAll();
	
	List<Comm> findByFromUser(User fromUser);
	List<Comm> findByFromUser(int fromUid);
	
	List<Comm> findByToUser(User toUser);
	List<Comm> findByToUser(int toUid);
	
	List<Comm> findByClimb(Climb climb);
	List<Comm> findByClimb(int climbId);
	
	Comm findByMessageCreated(Date created);
	
}
