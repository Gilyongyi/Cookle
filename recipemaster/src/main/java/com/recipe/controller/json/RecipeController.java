package com.recipe.controller.json;

import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.recipe.domain.Category;
import com.recipe.domain.Material;
import com.recipe.domain.Recipe;
import com.recipe.domain.Search;
import com.recipe.domain.User;
import com.recipe.service.RecipeService;
import com.recipe.service.UserService;
import com.recipe.util.CommonUtil;

@Controller
@RequestMapping("/recipe/")
public class RecipeController {
	@Autowired
	RecipeService recipeService;
	@Autowired
	UserService userService;

	// 리스트 검색 -이성현
	@RequestMapping(path = "listSearch", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String listSearch(@RequestParam(defaultValue = "1") int pageNo,
			@RequestParam(defaultValue = "8") int pageSize, Search search,
			@RequestParam(value = "categoryList") List<String> categoryList, String more, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();
		int recipeCount = 0;

		int userNo = 0;
		if (CommonUtil.getSessionUser(session) != null) {
		  userNo = CommonUtil.getSessionUser(session).getUserNo();
		}

		List<Recipe> list;
		// 카테고리 list를 search 객체에 담는다.
		search.setCategoryList(categoryList);
		if (more.equals("popular")) {
			list = recipeService.getRecipeList(userNo, pageNo, pageSize, 1); // 오늘의
			// 인기
			// 레시피
		} else {
			list = recipeService.getRecipeSearchList(pageNo, pageSize, search, userNo);
		}

		// 카테고리 데이터 잘 받아오는지 테스트
		/*
		 * for (String ctg : categoryList) { System.out.println("카테고리 : "+ctg);
		 * }
		 */

		// 검색결과 첫페이지를 갱신했을때만 레시피카드들을 카운트 한다.
		if (pageNo == 1) {
			recipeCount = recipeService.getRecipeCount(pageNo, pageSize, search, userNo);
		}

		try {
			result.put("status", "success");
			result.put("data", list);
			if (list.isEmpty()) {
				result.put("data", "lastPage");
			}
			result.put("recipeCount", recipeCount);
			result.put("pageNo", pageNo);
		} catch (Exception e) {
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	// 별점 매기기 -이성현
	@RequestMapping(path = "starRate", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String starRate(int recipeNo, double grade, HttpSession session) {

		User user = CommonUtil.getSessionUser(session);
		HashMap<String, Object> result = new HashMap<>();
		boolean loginCheck = true;
		try {
			// 로그인 확인
			if (user.getUserNo() != 0) {
				recipeService.addGrade(user.getUserNo(), recipeNo, grade);
			} else {
				loginCheck = false;
			}
			result.put("loginCheck", loginCheck);
			result.put("status", "success");
		} catch (Exception e) {
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	// 이미 별점을 부여한 레시피인지 확인 -이성현
	@RequestMapping(path = "checkDuplicateGrade", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String checkDuplicateGrade(int recipeNo, HttpSession session) {

		User user = CommonUtil.getSessionUser(session);
		HashMap<String, Object> result = new HashMap<>();
		boolean loginCheck = true;
		boolean checkDuplicateGrade = true; // true면 중복이 아님
		try {
			// 로그인 확인 (로그인 안했을대 에러 안나게 하기위해)
			if (user.getUserNo() != 0) {
				// 이미 별점을 부여한 레시피인지 확인
				checkDuplicateGrade = recipeService.getDuplicateGrade(user.getUserNo(), recipeNo);
			} else {
				loginCheck = false;
			}
			result.put("checkDuplicateGrade", checkDuplicateGrade);
			result.put("loginCheck", loginCheck);
			result.put("status", "success");
		} catch (Exception e) {
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	// 검색창 자동완성 -이성현
	@RequestMapping(path = "recipeSearchAutoComplete", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String recipeSearchAutoComplete(@RequestParam String searchValue) {
		HashMap<String, Object> result = new HashMap<>();
		List<String> recipeNameList = recipeService.getRecipeNameList(searchValue);
		try {
			result.put("status", "success");
			result.put("data", recipeNameList);
		} catch (Exception e) {
			result.put("status", "false");
		}
		return new Gson().toJson(recipeNameList);
	}

	@RequestMapping(path = "addRecipe")
	@ResponseBody
	public String addRecipe(Recipe recipe, @RequestParam(value = "materialNo", defaultValue = "") String[] materialNos,
			@RequestParam(value = "materialAmount", defaultValue = "") String[] materialAmounts,
			@RequestParam(value = "materialName", defaultValue = "") List<String> materialNames,
			@RequestParam(value = "categoryValue", defaultValue = "") List<Integer> categoryValue,
			@RequestParam(value = "timerValues", defaultValue = "") List<String> timerValues,
			@RequestParam(value = "recipeProduce", defaultValue = "") String[] recipeProduce,
			@RequestParam(value = "imageFiles", defaultValue = "") List<MultipartFile> imageFiles,
			@RequestParam(value = "representImgNames", defaultValue = "") List<String> representImgNames,
			@RequestParam(value = "produceImgNames", defaultValue = "") List<String> produceImgNames,
			@RequestParam(value = "ctgName", defaultValue = "") List<String> ctgName, HttpServletRequest request,
			HttpSession session) {

		System.out.println("레시피 등록하러 옴");

		Map<String, Object> result = new HashMap<>();
		Map<String, Object> map = new HashMap<>();
		Map<String, Object> recipeDatas = new HashMap<>();
		List<Map> materialList = new ArrayList<>();
		JsonArray recipeProduceDatas = new JsonArray();
		JsonArray recipeRepresentImages = new JsonArray();
		JsonArray recipeMaterialNames = new JsonArray();

		User user = CommonUtil.getSessionUser(session);

		for (int i = 0; i < materialNos.length; i++) {
			Map<String, String> matertialInfo = new HashMap<>();
			matertialInfo.put("materialNo", materialNos[i]);
			matertialInfo.put("materialAmount", materialAmounts[i]);
			recipeMaterialNames.add(materialNames.get(i));
			materialList.add(matertialInfo);
		}

		map.put("user", user);
		map.put("recipe", recipe);
		map.put("material", recipeMaterialNames);
		map.put("ctgName", ctgName.toString());
		int recipeNo = recipeService.addRecipe(map);
		recipe.setRecipeNo(recipeNo);
		recipeDatas.put("recipeNo", recipeNo);
		recipeDatas.put("materialList", materialList);
		recipeDatas.put("categoryValue", categoryValue);

		try {
			for (int i = 0; i < representImgNames.size(); i++) {
				Thread.sleep(1);
				// MultipartFile image = null;
				String[] fileInfo = representImgNames.get(i).split("/");
				// image = CommonUtil.findImageFile(fileInfo, imageFiles);
				String fileName = recipe.getRecipeNo() + "_" + user.getUserNo() + "_" + System.currentTimeMillis()
				+ ".png";
				// File newFile = new
				// File(CommonUtil.getImageFolderPath("representImg", request) +
				// "/" + fileName);
				// CommonUtil.findImageFile(fileInfo,
				// imageFiles).transferTo(newFile);
				FileCopyUtils.copy(CommonUtil.findImageFile(fileInfo, imageFiles).getBytes(),
						new FileOutputStream(CommonUtil.getImageFolderPath("representImg", request) + "/" + fileName));
				recipeRepresentImages.add(fileName);
			} // end of for

			/* 조리과정 등록 */
			for (int i = 0; i < produceImgNames.size(); i++) {
				Thread.sleep(1);
				String[] fileInfo = produceImgNames.get(i).split("/");
				JsonObject obj = new JsonObject();
				String fileName = recipe.getRecipeNo() + "_" + user.getUserNo() + "_" + System.currentTimeMillis()
				+ ".png";
				obj.addProperty("recipeProduceImage", fileName);
				obj.addProperty("recipeProduce", recipeProduce[i]);

				if (timerValues.size() > 0) {
					for (String value : timerValues) {
						String[] values = value.split("/");
						if (Integer.parseInt(values[0]) == i) {
							obj.addProperty("recipeTime", values[1]);
						}
					}
				}

				recipeProduceDatas.add(obj);
				FileCopyUtils.copy(CommonUtil.findImageFile(fileInfo, imageFiles).getBytes(),
						new FileOutputStream(CommonUtil.getImageFolderPath("recipeImg", request) + "/" + fileName));
			} // end of for
			recipeDatas.put("recipeProduceDatas", recipeProduceDatas.toString());
			recipeDatas.put("recipeRepresentImages", recipeRepresentImages.toString());
			if (materialNos.length > 0) {
				recipeService.addMaterials(recipeDatas);
			}
			if (categoryValue.size() > 0) {
				recipeService.addCategory(recipeDatas);
			}
			recipeService.registyImageAndProduce(recipeDatas);

			result.put("status", "success");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	@RequestMapping(path = "checkMyRecipe")
	@ResponseBody
	public String checkMyRecipe(int recipeNo, HttpSession session) {
		Map<String, Object> result = new HashMap<>();

		try {
			User user = CommonUtil.getSessionUser(session);

			if (user.getUserNo() == 0) {
				result.put("status", "nologin");
			} else {
				Map<String, Object> dataForCheckMyRecipe = new HashMap<>();
				dataForCheckMyRecipe.put("userNo", user.getUserNo());
				dataForCheckMyRecipe.put("recipeNo", recipeNo);
				if (recipeService.checkMyRecipe(dataForCheckMyRecipe) != null) {
					result.put("status", "success");
				} else {
					result.put("status", "fail");
				}
			}
		} catch (Exception e) {
			result.put("status", "nologin");
		}

		return new Gson().toJson(result);
	}

	@RequestMapping(path = "updateRecipe")
	@ResponseBody
	public String updateRecipe(Recipe recipe, @RequestParam("materialNo") String[] materialNos,
			@RequestParam("materialAmount") String[] materialAmounts,
			@RequestParam("materialName") List<String> materialNames,
			@RequestParam("recipeProduce") String[] recipeProduce,
			@RequestParam(value = "timerValues", defaultValue = "") List<String> timerValues,
			@RequestParam("categoryValue") List<Integer> categoryValue,
			@RequestParam("imageFiles") List<MultipartFile> imageFiles,
			@RequestParam("representImgNames") List<String> representImgNames,
			@RequestParam(value = "deleteRepresentImg", defaultValue = "") List<String> deleteRepresentImg,
			@RequestParam(value = "deleteProduceImg", defaultValue = "") List<String> deleteProduceImg,
			@RequestParam("produceImgNames") List<String> produceImgNames,
			@RequestParam("ctgName") List<String> ctgName, HttpServletRequest request, HttpSession session) {

		Map<String, Object> result = new HashMap<>();
		User user = CommonUtil.getSessionUser(session);

		Map<String, Object> recipeDatas = new HashMap<>();
		List<Map> materialList = new ArrayList<>();
		Map<String, Object> map = new HashMap<>();
		JsonArray recipeProduceDatas = new JsonArray();
		JsonArray recipeRepresentImages = new JsonArray();
		JsonArray recipeMaterialNames = new JsonArray();

		for (String imageName : deleteRepresentImg) {
			if (!CommonUtil.imageDelete(CommonUtil.getImageFolderPath("representImg", request), imageName)) {
				result.put("status", "false");
				return new Gson().toJson(result);
			}
		}

		for (String imageName : deleteProduceImg) {
			if (!CommonUtil.imageDelete(CommonUtil.getImageFolderPath("recipeImg", request), imageName)) {
				result.put("status", "false");
				return new Gson().toJson(result);
			}
		}

		for (int i = 0; i < materialNos.length; i++) {
			Map<String, String> matertialInfo = new HashMap<>();
			matertialInfo.put("materialNo", materialNos[i]);
			matertialInfo.put("materialAmount", materialAmounts[i]);
			recipeMaterialNames.add(materialNames.get(i));
			materialList.add(matertialInfo);
		}

		try {
			for (int i = 0; i < representImgNames.size(); i++) {
				// MultipartFile image = null;
				Thread.sleep(1);
				String[] fileInfo = representImgNames.get(i).split("/");

				String fileName = fileInfo.length > 1
						? recipe.getRecipeNo() + "_" + user.getUserNo() + "_" + System.currentTimeMillis() + ".png"
								: fileInfo[0];
				if (fileInfo.length > 1) {
					FileCopyUtils.copy(CommonUtil.findImageFile(fileInfo, imageFiles).getBytes(), new FileOutputStream(
							CommonUtil.getImageFolderPath("representImg", request) + "/" + fileName));
				}
				recipeRepresentImages.add(fileName);
			} // end of for

			/* 조리과정 등록 */
			for (int i = 0; i < produceImgNames.size(); i++) {
				Thread.sleep(1);
				String[] fileInfo = produceImgNames.get(i).split("/");
				JsonObject obj = new JsonObject();
				String fileName = recipe.getRecipeNo() + "_" + user.getUserNo() + "_" + System.currentTimeMillis()
				+ ".png";
				obj.addProperty("recipeProduceImage", produceImgNames.get(i));
				if (fileInfo.length > 1) {
					FileCopyUtils.copy(CommonUtil.findImageFile(fileInfo, imageFiles).getBytes(),
							new FileOutputStream(CommonUtil.getImageFolderPath("recipeImg", request) + "/" + fileName));
					obj.addProperty("recipeProduceImage", fileName);
				}
				obj.addProperty("recipeProduce", recipeProduce[i]);
				if (timerValues.size() > 0) {
					for (String value : timerValues) {
						String[] values = value.split("/");
						if (Integer.parseInt(values[0]) == i) {
							obj.addProperty("recipeTime", values[1]);
						}
					}
				}
				recipeProduceDatas.add(obj);
			} // end of for

			recipe.setRecipeProcedure(recipeProduceDatas);
			recipe.setRepresentImages(recipeRepresentImages);

			map.put("material", recipeMaterialNames.toString());
			map.put("ctgName", ctgName.toString());
			map.put("recipe", recipe);

			recipeService.updateRecipe(map);

			recipeService.deleteMaterials(recipe.getRecipeNo());
			recipeService.deleteCategoryList(recipe.getRecipeNo());

			recipeDatas.put("materialList", materialList);
			recipeDatas.put("categoryValue", categoryValue);
			recipeDatas.put("recipeNo", recipe.getRecipeNo());

			recipeService.addMaterials(recipeDatas);
			recipeService.addCategory(recipeDatas);

			// recipeService.addMaterials(recipeDatas);
			result.put("status", "success");
		} catch (Exception e) {
			// e.printStackTrace();
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	// ---------------------고재현 -------------------------
	@RequestMapping(path = "list", produces = "application/json;charset=UTF-8", method = RequestMethod.POST)
	@ResponseBody
	public String list(@RequestParam int userNo, @RequestParam(defaultValue = "4") int pageSize, int request) {
		HashMap<String, Object> result = new HashMap<>();
		List<Recipe> list = recipeService.getRecipeList(userNo, 1, pageSize, request);
		try {
			result.put("status", "success");
			result.put("data", list);
			System.out.println(list);
		} catch (Exception e) {
			result.put("status", "false");
		}

		return new Gson().toJson(result);
	}

	@RequestMapping(path = "recipeDetail", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String recipeDetail(int recipeNo, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();
		List<Material> materials = new ArrayList<>();
		List<Category> categories = new ArrayList<>();
		Recipe recipe = new Recipe();
		if ((User) session.getAttribute("loginUser") != null) {
			System.out.println(((User) session.getAttribute("loginUser")).getUserNo());
			recipe = recipeService.getRecipe(recipeNo, ((User) session.getAttribute("loginUser")).getUserNo());
		} else {
			recipe = recipeService.getRecipe(recipeNo, 0);
		}
		materials = recipeService.getRecipeMaterial(recipeNo);
		categories = recipeService.getCategoryList(recipeNo);
		recipe.setHits(recipe.getHits() + 1);
		recipeService.updateHits(recipe);
		try {
			result.put("status", "success");
			result.put("data", recipe);
			result.put("materials", materials);
			result.put("categories", categories);
		} catch (Exception e) {
			result.put("status", "false");
		}

		return new Gson().toJson(result);
	}

	@RequestMapping(path = "recipeComment", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String recipeComment(int recipeNo) {
		HashMap<String, Object> result = new HashMap<>();
		System.out.println(recipeNo);
		List<Recipe> recipeComment = recipeService.recipeComment(recipeNo);

		try {

			result.put("status", "success");
			result.put("data", recipeComment);
			// result.put("user", recipeCommentUser);
		} catch (Exception e) {
			result.put("status", "false");
		}

		return new Gson().toJson(result);
	}

	@RequestMapping(path = "likeUp", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String recipeLikeUp(@RequestParam("recipeNo") int recipeNo, @RequestParam("userNo") int userNo) {
		HashMap<String, Object> result = new HashMap<>();

		Recipe recipe = new Recipe();
		recipe.setRecipeNo(recipeNo);
		recipe.setUserNo(userNo);
		recipeService.likeUp(recipe);

		try {
			result.put("status", "success");
			result.put("data", recipe);
		} catch (Exception e) {
			result.put("status", "false");
		}

		return new Gson().toJson(result);
	}

	@RequestMapping(path = "likeDown", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String recipeLikeDown(@RequestParam("recipeNo") int recipeNo, @RequestParam("userNo") int userNo) {
		Recipe recipe = new Recipe();
		recipe.setRecipeNo(recipeNo);
		recipe.setUserNo(userNo);
		recipeService.likeDown(recipe);

		HashMap<String, Object> result = new HashMap<>();
		try {
			result.put("status", "success");
		} catch (Exception e) {
			result.put("status", "false");
		}

		return new Gson().toJson(result);
	}

	@RequestMapping(path = "scrap", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String scrap(int recipeNo, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();
		User userNo = new User();

		try {
			if (session.getAttribute("loginUser") == null) {
				result.put("status", "notLogin");
			} else {
				userNo.setUserNo(((User) session.getAttribute("loginUser")).getUserNo());
				recipeService.addScrap(userNo.getUserNo(), recipeNo);
				result.put("status", "success");
			}
		} catch (Exception e) {
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	@RequestMapping(path = "deleteScrap", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String deleteScrap(int recipeNo, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();

		User userNo = new User();
		userNo.setUserNo(((User) session.getAttribute("loginUser")).getUserNo());

		recipeService.deleteScrap(userNo.getUserNo(), recipeNo);
		try {
			result.put("status", "success");
		} catch (Exception e) {
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}
	//
	// @RequestMapping(path = "addSubscribe", produces =
	// "application/json;charset=UTF-8")
	// @ResponseBody
	// public String addSubscribe(HttpSession session, int fromUserNo) {
	// HashMap<String, Object> result = new HashMap<>();
	//
	// // toUserNo = 구독자, fromUserNo = 회원번호 (해당 회원 페이지)
	// User user = new User();
	// int toUserNo = (int) session.getAttribute("loginUser");
	// System.out.println(user.getUserNo());
	//
	// recipeService.addSubscribe(toUserNo, fromUserNo);
	// try {
	// result.put("status", "success");
	// } catch (Exception e) {
	// result.put("status", "false");
	// }
	// return new Gson().toJson(result);
	// }

	// 준모수정
	@RequestMapping(path = "subscribe", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String subscribe(@RequestParam(defaultValue = "1") int pageNo,
			@RequestParam(defaultValue = "4") int pageSize, HttpSession session, int userNo) {
		HashMap<String, Object> result = new HashMap<>();
		Recipe recipe = new Recipe();
		try {
			// 구독한 사람 뽑는다.
			List<Recipe> userNoList = recipeService.selectSubscribeUno(userNo);

			for (int i = 0; i < userNoList.size(); i++) {
				if (recipe.getSubscribe() == null) {
					recipe.setSubscribe(String.valueOf(userNoList.get(0).getSubscribeNum()));
				} else {

					recipe.setSubscribe(recipe.getSubscribe() + "," + userNoList.get(i).getSubscribeNum());
				}
			}
			String scsUserNo = recipe.getSubscribe();
			List<Recipe> subscribe = recipeService.selectSbuscribe(scsUserNo, pageNo, pageSize);
			result.put("status", "success");
			result.put("data", subscribe);
			result.put("pageNo", pageNo);
		} catch (Exception e) {
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	/*
	 * @RequestMapping(path="addSubscribe",produces=
	 * "application/json;charset=UTF-8")
	 * 
	 * @ResponseBody public String addSubscribe(HttpSession session,int
	 * fromUserNo){ HashMap<String,Object> result = new HashMap<>(); //toUserNo
	 * = 구독자, fromUserNo = 회원번호 (해당 회원 페이지) User user = new User(); int
	 * toUserNo=((User)session.getAttribute("loginUser")).getUserNo();
	 * System.out.println("toUserNo::"+toUserNo);
	 * System.out.println("fromUserNo::"+fromUserNo);
	 * recipeService.addSubscribe(toUserNo, fromUserNo); try{
	 * result.put("status","success"); }catch(Exception e){ result.put("status",
	 * "false"); } return new Gson().toJson(result); }
	 */

	@RequestMapping(path = "addSubscribe", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String addSubscribe(HttpSession session, String email) {
		HashMap<String, Object> result = new HashMap<>();
		// toUserNo = 구독자, fromUserNo = 회원번호 (해당 회원 페이지)

		if (((User) session.getAttribute("loginUser")) == null) {

			result.put("status", "failure");
			return new Gson().toJson(result);
		}

		int toUserNo = ((User) session.getAttribute("loginUser")).getUserNo();
		int fromUserNo = userService.selectFromEmail(email).getUserNo();

		if (toUserNo == fromUserNo) {
			result.put("status", "failure");

			return new Gson().toJson(result);
		}

		recipeService.addSubscribe(toUserNo, fromUserNo);
		try {
			result.put("status", "success");
		} catch (Exception e) {
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	@RequestMapping(path = "deleteSubscribe", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String deleteSubscribe(HttpSession session, String email) {
		HashMap<String, Object> result = new HashMap<>();
		// toUserNo = 구독자, fromUserNo = 회원번호 (해당 회원 페이지)
		int toUserNo = CommonUtil.getSessionUser(session).getUserNo();

		int fromUserNo = userService.selectFromEmail(email).getUserNo();

		recipeService.deleteSubscribe(toUserNo, fromUserNo);

		try {
			result.put("status", "success");
		} catch (Exception e) {
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	@RequestMapping(path = "checkSubscribe", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String checkSubscribe(HttpSession session, String email) {
		HashMap<String, Object> result = new HashMap<>();
		// toUserNo = 구독자, fromUserNo = 회원번호 (해당 회원 페이지)
		User user = new User();

		if (((User) session.getAttribute("loginUser")) == null) {
			result.put("status", "false");
			return new Gson().toJson(result);
		}
		// login한 사람 userNo
		int toUserNo = ((User) session.getAttribute("loginUser")).getUserNo();
		// 참조하고 있는 사람 userNo
		user = userService.selectFromEmail(email);
		int fromUserNo = user.getUserNo();
		try {

			if (recipeService.checkSubscribe(toUserNo, fromUserNo) != null) {
				result.put("status", "success");
			} else {
				result.put("status", "false");
			}

		} catch (Exception e) {
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	// ---------------------고재현 -------------------------
	@RequestMapping(path = "materialSearch", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String mts(@RequestParam("searchValue") String materialName, Model model) {
		Map<String, Object> result = new HashMap<>();
		List<Material> list = recipeService.getMaterial(materialName);
		List<Map<String, Object>> foodstuffList = new ArrayList<>();
		List<Map<String, Object>> seasoningList = new ArrayList<>();
		try {
			for (Material mt : list) {
				Map<String, Object> seasoning = new HashMap<>();
				Map<String, Object> foodstuff = new HashMap<>();
				if (mt.getMaterialStatement() == 1) {
					foodstuff.put("name", mt.getMaterialName());
					foodstuff.put("no", mt.getMaterialNo());
					foodstuff.put("category", mt.getMaterialStatement());
					foodstuffList.add(foodstuff);
				} else {
					seasoning.put("name", mt.getMaterialName());
					seasoning.put("no", mt.getMaterialNo());
					seasoning.put("category", mt.getMaterialStatement());
					seasoningList.add(seasoning);
				}
				result.put("foodstuff", foodstuffList);
				result.put("seasoning", seasoningList);
			}
		} catch (Exception e) {
			result.put("status", "false");
		}

		return new Gson().toJson(result);
	}

	@RequestMapping(path = "rank", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String rank(@RequestParam(defaultValue = "1") int pageNo, @RequestParam(defaultValue = "10") int pageSize) {
		HashMap<String, Object> result = new HashMap<>();
		List<Recipe> list = recipeService.getRecipeRankList(pageNo, pageSize);
		try {
			result.put("status", "success");
			result.put("data", list);
		} catch (Exception e) {
			result.put("status", "false");
		}

		return new Gson().toJson(result);
	}

	// 커뮤니티 레시피 리스트 : 용 ---- 고재현 수정.
	@RequestMapping(path = "userPage", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String userPage(String email, int request, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();

		try {
			List<Recipe> recipeList = new ArrayList<Recipe>();
			List<Recipe> userNumbers = new ArrayList<Recipe>();
			int userNo = CommonUtil.getSessionUser(session).getUserNo();
			User user = userService.selectFromEmail(email);

			userNumbers = recipeService.selectScrapUserNoMypage(user.getUserNo());
			Recipe recipe = CommonUtil.functionForUserNumbers(userNumbers, request);
			// getSession(userNo, session);

			if (request == 1) {
				recipeList = recipeService.selectMypageRecipe(String.valueOf(user.getUserNo()), userNo, request);
			} else if (request == 2) {
				recipeList = recipeService.selectMypageRecipe(recipe.getScrap(), userNo, request);
			} else if (request == 3) {
				userNumbers = recipeService.selectSubscribeMypage(user.getUserNo());
				Recipe subscribeRecipe = CommonUtil.functionForUserNumbers(userNumbers, request);
				// getSession(userNo, session);
				recipeList = recipeService.selectMypageRecipe(subscribeRecipe.getScrap(), userNo, request);
			}
			if (request == 5) {
				List<List> mainSubscribe = new ArrayList<List>();
				userNumbers = recipeService.selectSubscribeMypage(user.getUserNo());
				for (int i = 0; i < userNumbers.size(); i++) {

					recipeList = recipeService.selectMypageRecipe(String.valueOf(userNumbers.get(i).getSubscribeNum()),
							userNo, request);
					// System.out.println("request 5 : "+recipeList);
					mainSubscribe.add(recipeList);
				}
				result.put("data", mainSubscribe);
			} else {
				result.put("data", recipeList);
			}
			result.put("status", "success");
			result.put("user", user);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	// community준모,용이형
	@RequestMapping(path = "comList", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String comList(@RequestParam(defaultValue = "1") int pageNo, @RequestParam(defaultValue = "4") int pageSize,
			HttpSession session) {

		HashMap<String, Object> result = new HashMap<>();
		try {
			List<Recipe> myRecipeList = recipeService.selectSbuscribe2((session.getAttribute("userNo")).toString(),
					pageNo, pageSize);
			result.put("status", "success");
			result.put("data", myRecipeList);
			result.put("pageNo", pageNo);
		} catch (Exception e) {
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	@RequestMapping(path = "addComment", produces = "application/json; charset=UTF-8")
	@ResponseBody
	public String addComment(int recipeNo, String recipeComment, HttpSession session) {
		HashMap<String, Object> result = new HashMap<>();
		Recipe recipe = new Recipe();
		recipe.setRecipeNo(recipeNo);
		recipe.setRecipeComment(recipeComment);

		if ((User) session.getAttribute("loginUser") == null) {
			result.put("status", "notLogin");
		} else {
			recipeService.addComment(recipe, ((User) session.getAttribute("loginUser")).getUserNo());
		}
		result.put("status", "success");
		return new Gson().toJson(result);
	}

	@RequestMapping(path = "deleteComment", produces = "application/json; charset=UTF-8")
	@ResponseBody
	public String deleteComment(int commentNo) {
		HashMap<String, Object> result = new HashMap<>();
		recipeService.deleteComment(commentNo);

		result.put("status", "success");

		return new Gson().toJson(result);
	}

	// @RequestMapping(path = "imageDelete", produces =
	// "application/json;charset=UTF-8")
	// @ResponseBody
	// public String imageDelete(@RequestParam("category") String category,
	// @RequestParam("imageName") String imageName, HttpServletRequest request)
	// {
	// HashMap<String, Object> result = new HashMap<>();
	// File file = new File(CommonUtil.getImageFolderPath(category,
	// request)+"/"+imageName);
	//
	// if(file.exists()){
	// file.delete();
	// result.put("status", "success");
	// } else {
	// result.put("status", "fail");
	// }
	//
	// return new Gson().toJson(result);
	// }

	@RequestMapping(path = "randomList", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String randomlist(@RequestParam(defaultValue = "1") int pageSize) {
		HashMap<String, Object> result = new HashMap<>();
		List<Recipe> list = recipeService.getRecipeRandomList(pageSize);
		try {
			result.put("status", "success");
			result.put("data", list);
		} catch (Exception e) {
			result.put("status", "false");
		}

		return new Gson().toJson(result);
	}

	@RequestMapping(path = "recomList", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String recomlist(@RequestParam(defaultValue = "1") int pageSize) {
		HashMap<String, Object> result = new HashMap<>();
		List<Recipe> list = recipeService.getRecipeRecomList(pageSize);
		try {
			result.put("status", "success");
			result.put("data", list);
		} catch (Exception e) {
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	@RequestMapping(path = "recomCtList", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String recomCtlist(@RequestParam(defaultValue = "1") int pageSize) {
		HashMap<String, Object> result = new HashMap<>();
		List<Recipe> list = recipeService.getRecipeRecomCtList(pageSize);
		try {
			result.put("status", "success");
			result.put("data", list);
			System.out.println(list);
		} catch (Exception e) {
			result.put("status", "false");
		}

		return new Gson().toJson(result);
	}
	
	@RequestMapping(path = "getMyLikeList", produces = "application/json;charset=UTF-8")
	@ResponseBody
	public String getMyLikeList(@RequestParam(defaultValue = "0") int userNo) {
		HashMap<String, Object> result = new HashMap<>();
		List<Integer> likelist = recipeService.getMyLikeList(userNo);
		List<Integer> scraplist = recipeService.getMyScrapList(userNo);
		try {
			result.put("status", "success");
			result.put("like", likelist);
			result.put("scrap", scraplist);
		} catch (Exception e) {
			result.put("status", "false");
		}

		return new Gson().toJson(result);
	}
}