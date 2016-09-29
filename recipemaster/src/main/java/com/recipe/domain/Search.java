package com.recipe.domain;

import java.util.List;

public class Search {
  private String searchKeyword; //검색어
  private String searchCondition; //검색조건
  private String sortCondition; //정렬조건
  private String orderCondition; // 오름차순 , 내림차순 조건
  private List<String> categoryList; //카테고리
  
  public String getSearchKeyword() {
    return searchKeyword;
  }
  public void setSearchKeyword(String searchKeyword) {
    this.searchKeyword = searchKeyword;
  }
  public String getSearchCondition() {
    return searchCondition;
  }
  public void setSearchCondition(String searchCondition) {
    this.searchCondition = searchCondition;
  }
  public String getSortCondition() {
    return sortCondition;
  }
  public void setSortCondition(String sortCondition) {
    this.sortCondition = sortCondition;
  }  
  public String getOrderCondition() {
    return orderCondition;
  }
  public void setOrderCondition(String orderCondition) {
    this.orderCondition = orderCondition;
  }
  public List<String> getCategoryList() {
    return categoryList;
  }
  public void setCategoryList(List<String> categoryList) {
    this.categoryList = categoryList;
  }
  
  @Override
  public String toString() {
    return "Search [searchKeyword=" + searchKeyword + ", searchCondition=" + searchCondition + ", sortCondition="
        + sortCondition + ", orderCondition=" + orderCondition + ", categoryList=" + categoryList + "]";
  }       
}
