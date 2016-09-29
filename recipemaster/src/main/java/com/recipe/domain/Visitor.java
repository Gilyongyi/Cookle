package com.recipe.domain;

import java.sql.Date;

public class Visitor {

  public Visitor(){
  }
  private int visitorNo; //방명록 일련번호
  private String visitorContent;
  private String visitorImg;
  private Date visitorDate;
  private int loginUserNo; //세션 유저넘버 
  private int visitorUserNo; //방문한 유저페이지의 유저넘버
  private User user; //로그인한 유저넘버 저장할꺼
  
  
  
  public int getLoginUserNo() {
    return loginUserNo;
  }
  public void setLoginUserNo(int loginUserNo) {
    this.loginUserNo = loginUserNo;
  }
  public User getUser() {
    return user;
  }
  public void setUser(User user) {
    this.user = user;
  }
  public int getVisitorNo() {
    return visitorNo;
  }
  public void setVisitorNo(int visitorNo) {
    this.visitorNo = visitorNo;
  }
  public String getVisitorContent() {
    return visitorContent;
  }
  public void setVisitorContent(String visitorContent) {
    this.visitorContent = visitorContent;
  }
  public String getVisitorImg() {
    return visitorImg;
  }
  public void setVisitorImg(String visitorImg) {
    this.visitorImg = visitorImg;
  }
  public Date getVisitorDate() {
    return visitorDate;
  }
  public void setVisitorDate(Date visitorDate) {
    this.visitorDate = visitorDate;
  }
  public int getVisitorUserNo() {
    return visitorUserNo;
  }
  public void setVisitorUserNo(int visitorUserNo) {
    this.visitorUserNo = visitorUserNo;
  }
  @Override
  public String toString() {
    return "Visitor [visitorNo=" + visitorNo + ", visitorContent=" + visitorContent + ", visitorImg=" + visitorImg
        + ", visitorDate=" + visitorDate + ", loginUserNo=" + loginUserNo + ", visitorUserNo=" + visitorUserNo
        + ", user=" + user + "]";
  }
 
}
