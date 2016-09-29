package com.recipe.service;

import java.util.List;
import java.util.Map;

import com.recipe.domain.Category;
import com.recipe.domain.Material;
import com.recipe.domain.Recipe;
import com.recipe.domain.Search;

public interface RecipeService {
	Recipe checkMyRecipe(Map map);	
	int addRecipe(Map map); 
	void addMaterials(Map map);
	int likeUp(Recipe recipe);
	void likeDown(Recipe recipe);
	List<String> getRecipeNameList(String searchValue); //레시피 이름 자동완성 -이성현
	List<Recipe> getRecipeList(int userNo, int pageNo, int pageSize, int request);
	List<Recipe> getRecipeRandomList(int pageSize);
	List<Recipe> recipeComment(int recipeNo);
	List<Recipe> recipeCommentUserInfo(String userNums);
	List<Recipe> getRecipeRankList(int pageNo, int pageSize);
	List<Recipe> getRecipeSearchList(int pageNo, int pageSize, Search search, int userNo); //레시피 페이지 검색 -이성현
	int getRecipeCount(int pageNo, int pageSize, Search search, int userNo);
	List<Recipe> selectSbuscribe2(String userNo, int pageNo, int pageSize); //준모,용이형
	int addSubscribe(int toUserNo, int fromUserNo);
	int deleteSubscribe(int toUserNo, int fromUserNo);
	Map<String, Object> checkSubscribe(int toUserNo, int fromUserNo);//구독 check
	List<Recipe> selectSubscribeUno(int userNo);
	List<Recipe> selectSbuscribe(String scsUserNo, int pageNo, int pageSize); //준모 수정
	List<Recipe> selectMypage(int userNo);    
	List<Recipe> selectScrapUserNoMypage(int userNo);
	List<Recipe> selectSubscribeMypage(int userNo);
	List<Recipe> selectMypageRecipe(String userNumbers, int userNo, int request);
	Recipe getRecipe(int recipeNo,int userNo);
	int updateRecipe(Map map);
	int updateHits(Recipe recipe);
	int deleteRecipe(int recipeNo);
	List<Material> getMaterial(String materialName);
	List<Material> getRecipeMaterial(int recipeNo);
	int registyImageAndProduce(Map map);
	int addScrap(int userNo, int recipeNo);
	int deleteScrap(int userNo, int recipeNo);
	int deleteMaterials(int recipeNo);
	void addComment(Recipe recipe, int userNo);
	void deleteComment(int commentNo);
	void addCategory(Map map);
	List<Category> getCategoryList(int recipeNo);
	void deleteCategoryList(int recipeNo);
	List<Recipe> getRecipeRecomList(int pageSize);
	List<Recipe> getRecipeRecomCtList(int pageSize);
	void addGrade(int userNo, int recipeNo, double grade);
	boolean getDuplicateGrade(int userNo, int recipeNo);
	List<Integer> getMyLikeList(int userNo);
	List<Integer> getMyScrapList(int userNo);
}
