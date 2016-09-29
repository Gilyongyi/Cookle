package com.recipe.service.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.recipe.dao.VisitorDao;
import com.recipe.domain.User;
import com.recipe.domain.Visitor;
import com.recipe.service.VisitorService;

@Service
public class VisitorServiceImpl implements VisitorService {
	@Autowired VisitorDao visitorDao;

	@Override
	public void addVisitor(Visitor visitor) {
		visitorDao.insert(visitor);
	}

	@Override
	public List<Visitor> getVisitorList(int userNo,int pageNo, int pageSize) {
		HashMap<String,Object> params= new HashMap<>();    
		params.put("startIndex", (pageNo - 1) * pageSize);
		params.put("len", pageSize);    
		params.put("userNo", userNo);
		return visitorDao.selectList(params);
	}

	@Override
	public Visitor getVisitor(int no) {    
		return visitorDao.selectOne(no);
	}

	@Override
	public int deleteVisitor(int no) {
		visitorDao.delete(no);
		return 0;
	}

	@Override
	public void updateVisitor(Visitor visitor) {
		visitorDao.update(visitor);
	}

	@Override
	public User getVisitorInfo(int no) {
		return visitorDao.selectMyPageInfo(no);
	}
}
