
package com.recipe.service;

import java.util.List;

import com.recipe.domain.User;

public interface UserService {
  void addUser(User user);
  List<User> getUserList(int pageNo, int pageSize);
  List<User> getUserRankList(int pageNo, int pageSize);//용이추가
  User getUser(int no);
  boolean checkDuplication(String email); // email 중복체크
  boolean checkDuplicationUserName(String userName); // 닉네임 중복체크
  void updateUser(User user); //유저정보수정(용이-완료)
  int deleteUser(int no);
  User loginUser(User user); //login
  User selectFromEmail(String email);  
  List<User> selectRankListSCS(int pageNo, int pageSize, int uno);//준모추가
  List<User> selectMonthRank(int uno);
  List<User> selectTodayRank(int uno);
  User selectMyRank(int uno);
  int addUserInNaver(User user);
  void authUpdate(String authKEY, int auth, String inputEmail);//인증update
  void addHits(int userNo); //방문자수 증가
}