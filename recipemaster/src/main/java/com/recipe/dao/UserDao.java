package com.recipe.dao;

import java.util.List;
import java.util.Map;

import com.recipe.domain.User;

public interface UserDao {
  void insert(User user);
  List<User> selectList(Map<String,Object> params);
  List<User> selectRankList(Map<String,Object> params); //용이추가
  User selectOne(int no);
  User checkDuplication(String email);
  User checkDuplicationUserName(String userName);
  void update(User user);
  int delete(int no);
  User findUser(String email);//Read or Retrieve
  User selectFromEmail(String email);    //Mypage 이메일로 유저정보 가져오
  List<User> selectRankListSCS(Map<String,Object> params); //랭크 리스트+구독 정보 추가
  List<User> selectMonthRank(Map<String,Object> params);
  List<User> selectTodayRank(Map<String,Object> params);
  User selectMyRank(int uno);
  int addUserInNaver(User user);
  void authUpdate(Map<String,Object> params); //인증update
  void updateHits(int userNo);
}
