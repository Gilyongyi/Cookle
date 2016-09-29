package com.recipe.domain;

public class Category {
	private String categoryName;
	private int categoryNo;
	
	public Category() {
		super();
	}
	public String getCategoryName() {
		return categoryName;
	}
	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
	public int getCategoryNo() {
		return categoryNo;
	}
	public void setCategoryNo(int categoryNo) {
		this.categoryNo = categoryNo;
	}
	@Override
	public String toString() {
		return "Category [categoryName=" + categoryName + ", categoryNo=" + categoryNo + "]";
	}
}
