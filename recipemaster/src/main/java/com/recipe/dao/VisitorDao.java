package com.recipe.dao;

import java.util.List;
import java.util.Map;

import com.recipe.domain.User;
import com.recipe.domain.Visitor;

public interface VisitorDao {
  void insert(Visitor visitor);
  List<Visitor> selectList(Map<String,Object> params);
  Visitor selectOne(int no);
  void update(Visitor visitor);
  int delete(int no);
  User selectMyPageInfo(int userNo);
}
