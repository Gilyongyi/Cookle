package com.recipe.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.recipe.dao.RecipeDao;
import com.recipe.domain.Category;
import com.recipe.domain.Material;
import com.recipe.domain.Recipe;
import com.recipe.domain.Search;
import com.recipe.service.RecipeService;

@Service
public class RecipeServiceImpl implements RecipeService {
	@Autowired RecipeDao recipeDao;

	@Override
	public void addGrade(int userNo, int recipeNo, double grade) {
		Map<String,Object> params = new HashMap<>();
		params.put("uno", userNo);
		params.put("rcpno", recipeNo);
		params.put("gpa", grade);
		recipeDao.insertGrade(params);
	}

	@Override
	public List<Recipe> getRecipeSearchList(int pageNo, int pageSize, Search search, int userNo) {	
		Map<String,Object> params = new HashMap<>();
		params.put("startIndex", (pageNo - 1) * pageSize);
		params.put("len", pageSize);
		params.put("search", search);
		params.put("userNo", userNo);	  
		params.put("categorySize",search.getCategoryList().size());	  
		return recipeDao.recipeSearch(params);
	}

	@Override
	public List<String> getRecipeNameList(String searchValue) {    
		return recipeDao.selectRecipeName(searchValue);
	}

	@Override
	public int getRecipeCount(int pageNo, int pageSize, Search search, int userNo) {
		Map<String,Object> params = new HashMap<>();
		params.put("startIndex", (pageNo - 1) * pageSize);
		params.put("len", pageSize);
		params.put("search", search);
		params.put("userNo", userNo);
		params.put("categorySize",search.getCategoryList().size());
		return recipeDao.recipeCount(params);
	}

	@Override
	public int addRecipe(Map map) {
		recipeDao.insert(map);
		return (int)map.get("recipeNo");
	}

	@Override
	public List<Recipe> getRecipeList(int userNo, int pageNo, int pageSize, int request) {
		HashMap<String,Object> params = new HashMap<>();
		params.put("startIndex", (pageNo - 1) * pageSize);
		params.put("request", request);
		params.put("userNo", userNo);
		params.put("len", pageSize);
		return recipeDao.recipeList(params);
	}

	@Override
	public List<Recipe> getRecipeRankList(int pageNo,int pageSize) {
		HashMap<String,Object> params = new HashMap<>();
		params.put("startIndex", (pageNo - 1) * pageSize);
		params.put("len", pageSize);
		return recipeDao.recipeRankList(params);
	}


	@Override
	public Recipe getRecipe(int recipeNo, int userNo) {
		HashMap<String,Object> params = new HashMap<>();
		params.put("userNo", userNo);
		params.put("recipeNo", recipeNo);

		return recipeDao.selectOne(params);
	}

	@Override
	public int updateRecipe(Map map) {
		return recipeDao.updateRecipe(map);
	}

	@Override
	public int deleteRecipe(int recipeNo) {
		return recipeDao.deleteRecipe(recipeNo);
	}

	@Override
	public List<Material> getMaterial(String materialName) {
		return recipeDao.selectMaterialName(materialName);
	}

	@Override
	public void addMaterials(Map map) {
		recipeDao.insertMaterials(map);
	}
	@Override
	public int updateHits(Recipe recipe) {
		return recipeDao.updateHits(recipe);
	}

	@Override
	public int likeUp(Recipe recipe) {
		return recipeDao.likeUp(recipe);
	}

	@Override
	public int registyImageAndProduce(Map map) {
		return recipeDao.insertImageAndProduce(map);
	}

	@Override
	public void likeDown(Recipe recipe) {
		recipeDao.likeDown(recipe);
	}

	@Override
	public List<Recipe> selectSubscribeUno(int userNo) {

		return recipeDao.selectSubscribeUno(userNo);
	}

	//준 수정
	@Override
	public List<Recipe> selectSbuscribe(String scsUserNo, int pageNo, int pageSize) {
		HashMap<String,Object> params = new HashMap<>();
		params.put("userNo", scsUserNo);
		params.put("startIndex", (pageNo - 1) * pageSize);
		params.put("len", pageSize);

		return recipeDao.selectSubscribe(params);
	}

	//준
	@Override
	public List<Recipe> selectSbuscribe2(String userNo, int pageNo, int pageSize) {
		HashMap<String,Object> params = new HashMap<>();
		params.put("userNo", userNo);
		params.put("startIndex", (pageNo - 1) * pageSize);
		params.put("len", pageSize);
		return recipeDao.selectSubscribe2(params);
	}
	@Override
	public int addScrap(int userNo, int recipeNo) {
		HashMap<String,Object> params = new HashMap<>();
		params.put("userNo", userNo);
		params.put("recipeNo", recipeNo);
		return recipeDao.addScrap(params);
	}

	@Override
	public int deleteScrap(int userNo, int recipeNo) {
		HashMap<String,Object> params = new HashMap<>();
		params.put("userNo", userNo);
		params.put("recipeNo", recipeNo);
		return recipeDao.deleteScrap(params);
	}

	@Override
	public int addSubscribe(int toUserNo, int fromUserNo) {
		HashMap<String,Object> params = new HashMap<>();
		params.put("toUserNo", toUserNo);
		params.put("fromUserNo", fromUserNo);
		return recipeDao.addSubscribe(params);
	}

	@Override
	public Map<String, Object> checkSubscribe(int toUserNo, int fromUserNo) {
		HashMap<String,Object> params = new HashMap<>();
		params.put("toUserNo", toUserNo);
		params.put("fromUserNo", fromUserNo);
		return recipeDao.checkSubscribe(params);
	}

	@Override
	public List<Recipe> selectMypage(int userNo) {
		return recipeDao.selectMypage(userNo);
	}

	@Override
	public List<Recipe> selectScrapUserNoMypage(int userNo) {
		return recipeDao.selectScrapUserNoMypage(userNo);
	}

	@Override
	public List<Recipe> selectMypageRecipe(String userNumbers, int userNo,int request) {
		HashMap<String,Object> params = new HashMap<>();
		params.put("userNumbers", userNumbers);
		params.put("userNo", userNo);
		params.put("request", request);
		return recipeDao.selectMypageRecipe(params);
	}

	@Override
	public int deleteSubscribe(int toUserNo, int fromUserNo) {      
		HashMap<String,Object> params = new HashMap<>();
		params.put("toUserNo", toUserNo);
		params.put("fromUserNo", fromUserNo);
		return recipeDao.deleteSubscribe(params);
	}

	@Override
	public List<Recipe> selectSubscribeMypage(int userNo) {
		return recipeDao.selectSubscribeMypage(userNo);
	}

	@Override
	public List<Recipe> recipeComment(int recipeNo) {
		return recipeDao.recipeComment(recipeNo);
	}

	@Override
	public List<Recipe> recipeCommentUserInfo(String userNums) {
		return recipeDao.recipeCommentUserInfo(userNums);
	}

	@Override
	public List<Material> getRecipeMaterial(int recipeNo) {
		return recipeDao.selectRecipeMaterial(recipeNo);
	}

	@Override
	public Recipe checkMyRecipe(Map map) {
		return recipeDao.checkMyRecipe(map);
	}

	@Override
	public int deleteMaterials(int recipeNo) {
		return recipeDao.deleteMaterials(recipeNo);
	}

	@Override
	public void addComment(Recipe recipe, int userNo) {
		Map<String,Object > map = new HashMap<>();
		map.put("recipe", recipe);
		map.put("userNo", userNo);
		System.out.println("service");
		recipeDao.addComment(map);
	}

	@Override
	public void deleteComment(int commentNo) {
		recipeDao.deleteComment(commentNo);
	}	

	@Override
	public List<Recipe> getRecipeRandomList(int pageSize) {
		HashMap<String,Object> params = new HashMap<>();
		params.put("len", pageSize);
		return recipeDao.recipeRandomList(params);
	}

	@Override
	public void addCategory(Map map) {
		recipeDao.insertCategoty(map);
	}

	@Override
	public List<Category> getCategoryList(int recipeNo) {
		return recipeDao.selectRecipeCategory(recipeNo);
	}

	@Override
	public void deleteCategoryList(int recipeNo) {
		recipeDao.deleteRecipeCategory(recipeNo);
	}

	@Override
	public List<Recipe> getRecipeRecomList(int pageSize) {
		HashMap<String,Object> params = new HashMap<>();
		params.put("len", pageSize);
		return recipeDao.recipeRecomList(params);
	}

	@Override
	public List<Recipe> getRecipeRecomCtList(int pageSize) {
		HashMap<String,Object> params = new HashMap<>();
		params.put("len", pageSize);
		return recipeDao.recipeRecomCtList(params);
	}

	@Override
	public boolean getDuplicateGrade(int userNo, int recipeNo) {
		boolean result = true;
		HashMap<String,Object> params = new HashMap<>();    
		params.put("uno", userNo);
		params.put("rcpno", recipeNo);
		if(recipeDao.checkDuplicateGrade(params) == 1){
			result = false;
		}    
		return result;
	}

	@Override
	public List<Integer> getMyLikeList(int userNo) {
		return recipeDao.selectMyLikeList(userNo);
	}

	@Override
	public List<Integer> getMyScrapList(int userNo) {
		return recipeDao.selectMyScrapList(userNo);
	}
}