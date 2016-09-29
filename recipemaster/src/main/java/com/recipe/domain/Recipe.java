package com.recipe.domain;

import java.util.Date;

import com.google.gson.JsonArray;

public class Recipe {

	private int recipeNo;
	private int userNo;
	private String recipeName;
	private String intro;
	private String recipeDetail;
	private JsonArray representImages;
	private JsonArray materials;
	private JsonArray recipeProcedure;
	private int cookTime;
	private int portion;
	private Date recipeDate;
	private int hits;
	private int regiStatus;
	private double gradePoint;
	private User user;
	private Date likeDate;
	private int likeUser;
	private int countLike;
	private int subscribeNum;
	private String subscribe;
	private int countComment;
	private int countScrap;
	private int scrapUser;
	private String scrap;
	private String rpimg;
	private String recipeComment;
	private Date recipeCommentDate;
	private String commentUsers;
	private int commentNo;
	private String ctgName;
	private JsonArray materialName;
	

  public String getCtgName() {
    return ctgName;
  }

  public void setCtgName(String ctgName) {
    this.ctgName = ctgName;
  }

  public int getCommentNo() {
    return commentNo;
  }

  public void setCommentNo(int commentNo) {
    this.commentNo = commentNo;
  }

  public String getRecipeComment() {
    return recipeComment;
  }

  public void setRecipeComment(String recipeComment) {
    this.recipeComment = recipeComment;
  }

  public Date getRecipeCommentDate() {
    return recipeCommentDate;
  }

  public void setRecipeCommentDate(Date recipeCommentDate) {
    this.recipeCommentDate = recipeCommentDate;
  }

  // ranking
	private int rownum;
	private int totalPoint;
	// ranking end
	
	public String getCommentUsers() {
    return commentUsers;
  }

  public void setCommentUsers(String commentUsers) {
    this.commentUsers = commentUsers;
  }

  public int getRownum() {
		return rownum;
	}

	public String getRpimg() {
		return rpimg;
	}

	public void setRpimg(String rpimg) {
		this.rpimg = rpimg;
	}

	public int getTotalPoint() {
		return totalPoint;
	}

	public void setTotalPoint(int totalPoint) {
		this.totalPoint = totalPoint;
	}

	public void setRownum(int rownum) {
		this.rownum = rownum;
	}

	public String getScrap() {
		return scrap;
	}

	public void setScrap(String scrap) {
		this.scrap = scrap;
	}

	public int getScrapUser() {
		return scrapUser;
	}

	public void setScrapUser(int scrapUser) {
		this.scrapUser = scrapUser;
	}

	public String getRecipeDetail() {
		return recipeDetail;
	}

	public void setRecipeDetail(String recipeDetail) {
		this.recipeDetail = recipeDetail;
	}

	public int getCountComment() {
		return countComment;
	}

	public void setCountComment(int countComment) {
		this.countComment = countComment;
	}

	public int getCountScrap() {
		return countScrap;
	}

	public void setCountScrap(int countScrap) {
		this.countScrap = countScrap;
	}

	public String getSubscribe() {
		return subscribe;
	}

	public void setSubscribe(String subscribe) {
		this.subscribe = subscribe;
	}

	public int getSubscribeNum() {
		return subscribeNum;
	}

	public void setSubscribeNum(int subscribeNum) {
		this.subscribeNum = subscribeNum;
	}

	// Method
	public int getRecipeNo() {
		return recipeNo;
	}

	public void setRecipeNo(int recipeNo) {
		this.recipeNo = recipeNo;
	}

	public int getUserNo() {
		return userNo;
	}

	public void setUserNo(int userNo) {
		this.userNo = userNo;
	}

	public String getRecipeName() {
		return recipeName;
	}

	public void setRecipeName(String recipeName) {
		this.recipeName = recipeName;
	}

	public String getIntro() {
		return intro;
	}

	public void setIntro(String intro) {
		this.intro = intro;
	}

	public JsonArray getRepresentImages() {
		return representImages;
	}

	public void setRepresentImages(JsonArray representImages) {
		this.representImages = representImages;
	}

	public JsonArray getMaterials() {
		return materials;
	}

	public void setMaterials(JsonArray materials) {
		this.materials = materials;
	}

	public JsonArray getRecipeProcedure() {
		return recipeProcedure;
	}

	public void setRecipeProcedure(JsonArray recipeProcedure) {
		this.recipeProcedure = recipeProcedure;
	}

	public int getCookTime() {
		return cookTime;
	}

	public void setCookTime(int cookTime) {
		this.cookTime = cookTime;
	}

	public int getPortion() {
		return portion;
	}

	public void setPortion(int portion) {
		this.portion = portion;
	}

	public Date getRecipeDate() {
		return recipeDate;
	}

	public void setRecipeDate(Date recipeDate) {
		this.recipeDate = recipeDate;
	}

	public int getHits() {
		return hits;
	}

	public void setHits(int hits) {
		this.hits = hits;
	}

	public int getRegiStatus() {
		return regiStatus;
	}

	public void setRegiStatus(int regiStatus) {
		this.regiStatus = regiStatus;
	}

	public double getGradePoint() {
		return gradePoint;
	}

	public void setGradePoint(double gradePoint) {
		this.gradePoint = gradePoint;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Date getLikeDate() {
		return likeDate;
	}

	public void setLikeDate(Date likeDate) {
		this.likeDate = likeDate;
	}

	public int getLikeUser() {
		return likeUser;
	}

	public void setLikeUser(int likeUser) {
		this.likeUser = likeUser;
	}

	public int getCountLike() {
		return countLike;
	}

	public void setCountLike(int countLike) {
		this.countLike = countLike;
	}

  @Override
  public String toString() {
    return "Recipe [recipeNo=" + recipeNo + ", userNo=" + userNo + ", recipeName=" + recipeName + ", intro=" + intro
        + ", recipeDetail=" + recipeDetail + ", representImages=" + representImages + ", materials=" + materials
        + ", recipeProcedure=" + recipeProcedure + ", cookTime=" + cookTime + ", portion=" + portion + ", recipeDate="
        + recipeDate + ", hits=" + hits + ", regiStatus=" + regiStatus + ", gradePoint=" + gradePoint + ", user=" + user
        + ", likeDate=" + likeDate + ", likeUser=" + likeUser + ", countLike=" + countLike + ", subscribeNum="
        + subscribeNum + ", subscribe=" + subscribe + ", countComment=" + countComment + ", countScrap=" + countScrap
        + ", scrapUser=" + scrapUser + ", scrap=" + scrap + ", rpimg=" + rpimg + ", recipeComment=" + recipeComment
        + ", recipeCommentDate=" + recipeCommentDate + ", commentUsers=" + commentUsers + ", commentNo=" + commentNo
        + ", ctgName=" + ctgName + ", rownum=" + rownum + ", totalPoint=" + totalPoint + "]";
  }

}