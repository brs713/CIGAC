package com.bradlav.models.dao;

import java.util.List;
import javax.transaction.Transactional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.bradlav.models.User;


@Transactional
@Repository
public interface UserDao extends CrudRepository<User, Integer> {

	List<User> findAll();
	
	User findById(int id);

	User findByUsername(String username);
    User findByUsername(User user);
    
}
