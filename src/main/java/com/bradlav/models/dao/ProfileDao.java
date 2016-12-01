package com.bradlav.models.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.bradlav.models.Profile;
import com.bradlav.models.User;

@Transactional
@Repository
public interface ProfileDao extends CrudRepository<Profile, Integer> {
	
	Profile findByUser(User user);
	List<Profile> findByName(String name);  //this searches just name, so it could return multiples.

	List<Profile> findAll();
	

}
