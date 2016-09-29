package com.recipe.dao;

import java.util.List;
import java.util.Map;

import com.recipe.domain.Category;
import com.recipe.domain.Material;
import com.recipe.domain.Recipe;

public interface RecipeDao {
	Recipe checkMyRecipe(Map map); // Create
	int insert(Map map); // Create
	void insertMaterials(Map map); // Create
	int insertImageAndProduce(Map map);  
	List<Recipe> recipeList(Map<String,Object> params); // Read or Retrieve
	List<Recipe> recipeRandomList(Map<String,Object> params);
	List<Recipe> recipeRankList(Map<String,Object> params); //용이
	List<Recipe> recipeSearch(Map<String,Object> params); //Search 성현
	int recipeCount(Map<String,Object> params); //Recipe Count 성현
	List<String> selectRecipeName(String searchValue); //Recipe Name List 성현
	List<Recipe> selectSubscribe2(Map<String,Object> params); //준모
	List<Recipe> recipeComment(int recipeNo);
	List<Recipe> recipeCommentUserInfo(String userNums);
	int addSubscribe(Map<String,Object> params); //구독하기 추가 고재현
	int  deleteSubscribe(Map<String,Object> params);
	int deleteRecipe(int recipeNo);
	List<Recipe> selectSubscribeUno(int userNo); //구독하기한 userNo추출  고재현
	List<Recipe> selectSubscribe(Map<String,Object> params); //구독한 리스트 고재현 //준모 수정
	List<Recipe> selectMypage(int userNo);      // mypage리스트  고재현
	List<Recipe> selectScrapUserNoMypage(int userNo);
	List<Recipe> selectSubscribeMypage(int userNo);// mypageScrap리스트  고재현
	List<Recipe> selectMypageRecipe(Map<String,Object> params);      // mypageScrap리스트  고재현
	Recipe selectOne(Map<String,Object> params); // Read or Retrieve
	int updateRecipe(Map map); // Update
	int updateHits(Recipe recipe);  //조회수 증가  고재현
	int delete(int no); // Delete
	List<Material> selectMaterialName(String materialName); //박상일 - 재료이름으로 재료검색
	List<Material> selectRecipeMaterial(int recipeNo); //박상일 - 재료넘버로 재료검색
	int likeUp(Recipe recipe);  //좋아요 증가 고재현 
	void likeDown(Recipe recipe);//좋아요 취소  고재현 
	int addScrap(Map<String, Object> Numbers); //스크랩 하기 고재현
	int deleteScrap(Map<String, Object> Numbers); //스크랩 취소 고재현
	int deleteMaterials(int recipeNo); // 박상일 - 레시피 재료삭제
	Map<String,Object> checkSubscribe(Map<String,Object> params);//구독 Check 준모
	Integer addComment(Map map);
	Integer deleteComment(int commentNo);
	void insertCategoty(Map map);
	List<Category> selectRecipeCategory(int recipeNo);
	void deleteRecipeCategory(int recipeNo);
	List<Recipe> recipeRecomList(Map<String,Object> params);
	List<Recipe> recipeRecomCtList(Map<String,Object> params);
	void insertGrade(Map<String, Object> params); // 이성현 별점매기기
	int checkDuplicateGrade(Map<String, Object> params); // 이성현 별점등록한 레시피인지 체크
	List<Integer> selectMyLikeList(int userNo); 
	List<Integer> selectMyScrapList(int userNo); 
}
