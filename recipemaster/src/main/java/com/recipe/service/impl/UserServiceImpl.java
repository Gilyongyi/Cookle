package com.recipe.service.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.recipe.dao.UserDao;
import com.recipe.domain.User;
import com.recipe.service.UserService;

@Service
public class UserServiceImpl implements UserService {
	@Autowired UserDao userDao;

	@Override
	public void addUser(User user) {
		userDao.insert(user);
	}

	@Override
	public List<User> getUserList(int pageNo, int pageSize) {
		HashMap<String,Object> params= new HashMap<>();    
		params.put("startIndex", (pageNo - 1) * pageSize);
		params.put("len", pageSize);   

		return userDao.selectList(params);
	}

	@Override
	public List<User> getUserRankList(int pageNo, int pageSize) {
		HashMap<String,Object> params= new HashMap<>();    
		params.put("startIndex", (pageNo - 1) * pageSize);
		params.put("len", pageSize);   

		return userDao.selectRankList(params);
	}

	@Override
	public User getUser(int no) {    
		return userDao.selectOne(no);
	}

	// 이메일 중복 검사
	@Override
	public boolean checkDuplication(String email) {  
		boolean result = true;    
		User user = userDao.checkDuplication(email);
		if (user != null){      
			result = false;
		}    
		return result;
	}

	// 닉네임 중복 검사
	@Override
	public boolean checkDuplicationUserName(String userName) {
		boolean result = true;    
		User user = userDao.checkDuplicationUserName(userName);
		if (user != null){      
			result = false;
		}    
		return result;
	} 

	@Override
	public int deleteUser(int no) {
		userDao.delete(no);
		return 0;
	}


	@Override
	public User loginUser(User user) {
		User dbUser=userDao.findUser(user.getEmail());
		System.out.println("dbUser"+dbUser);
		if (dbUser==null) {
			System.out.println("ID가 부적합합니다.");
			dbUser=null;
			return dbUser;
		}else if(! dbUser.getPassword().equals(user.getPassword())&&dbUser.getPassword()!=null && dbUser.getPassword() == "0"){
			System.out.println("비밀번호가 부적합합니다.");
			dbUser=null;
			return dbUser;
		}else{
			System.out.println(dbUser.getEmail()+"님이 login 시도 하였습니다.");
		}
		return dbUser;

	}

	@Override
	public void updateUser(User user) {
		userDao.update(user);
	}

	@Override
	public User selectFromEmail(String email) {
		return userDao.selectFromEmail(email);
	}

	@Override
	public List<User> selectRankListSCS(int pageNo, int pageSize, int uno) {
		HashMap<String,Object> params= new HashMap<>();
		params.put("startIndex", (pageNo - 1) * pageSize);
		params.put("len", pageSize);
		params.put("uno", uno);

		return userDao.selectRankListSCS(params);
	}

	@Override
	public List<User> selectMonthRank(int uno) {
		HashMap<String,Object> params= new HashMap<>();  
		params.put("uno", uno);

		return userDao.selectMonthRank(params);
	}

	@Override
	public List<User> selectTodayRank(int uno) {
		HashMap<String,Object> params= new HashMap<>();
		params.put("uno", uno);
		return userDao.selectTodayRank(params);
	}

	@Override
	public User selectMyRank(int uno) {    
		return userDao.selectMyRank(uno);
	}

	@Override
	public int addUserInNaver(User user) {
		return userDao.addUserInNaver(user);
	}

	public void authUpdate(String authKEY, int auth, String inputEmail) {
		HashMap<String,Object> params= new HashMap<>();    
		System.out.println("이곳은 authUpdat을 하는  service impl입니다."+authKEY+"?"+auth);
		params.put("authKEY", authKEY);
		params.put("auth", auth);   
		params.put("inputEmail", inputEmail); 
		userDao.authUpdate(params);
	}

	@Override
	public void addHits(int userNo) {
		userDao.updateHits(userNo);
	}
}
