package com.recipe.controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.recipe.domain.Recipe;
import com.recipe.domain.User;
import com.recipe.service.RecipeService;
import com.recipe.util.CommonUtil;

@Controller
@RequestMapping("/recipe/")
public class RecipeController {
	@Autowired
	RecipeService recipeService;

	// CommonUtil commonUtil = new CommonUtil();

//	@RequestMapping("list")
//	public String list(@RequestParam(defaultValue = "1") int pageNo, @RequestParam(defaultValue = "4") int pageSize,
//			Model model) {
//		model.addAttribute("list", recipeService.getRecipeList(pageNo, pageSize));
//		return "list";
//	}

	@RequestMapping(path = "addRecipe")
	@ResponseBody
	public String addRecipe(Recipe recipe,
			// @RequestParam("userNo") int userNo,
			@RequestParam("materialNo") String[] materialNos,
			@RequestParam("materialAmount") String[] materialAmounts,
			@RequestParam("recipeProduce") String[] recipeProduce,
			@RequestParam("imageFiles") List<MultipartFile> imageFiles,
			@RequestParam("representImgNames") List<String> representImgNames,
			@RequestParam("produceImgNames") List<String> produceImgNames, 
			HttpServletRequest request, HttpSession session) {
		int userNo = (Integer)session.getAttribute("userNo");
		System.out.println(userNo);
		
		Map<String, Object> result = new HashMap<>();
		Map<String, Object> map = new HashMap<>();
		Map<String, Object> recipeDatas = new HashMap<>();
		List<Map> materialList = new ArrayList<>();
		JsonArray recipeProduceDatas = new JsonArray();
		JsonArray recipeRepresentImages = new JsonArray();

		System.out.println(recipe);
		
		User user = new User();
		user.setUserNo(userNo);

		for (int i = 0; i < materialNos.length; i++) {
			Map<String, String> matertialInfo = new HashMap<>();
			System.out.println(materialNos.toString());
			System.out.println(materialAmounts.toString());
			matertialInfo.put("materialNo", materialNos[i]);
			matertialInfo.put("materialAmount", materialAmounts[i]);
			materialList.add(matertialInfo);
		}

		map.put("user", user);
		map.put("recipe", recipe);
		int recipeNo = recipeService.addRecipe(map);
		recipeDatas.put("recipeNo", recipeNo);
		recipeDatas.put("materialList", materialList);

		try {
			for (int i = 0; i < representImgNames.size(); i++) {
				// MultipartFile image = null;
				String[] fileInfo = representImgNames.get(i).split("/");
				// image = CommonUtil.findImageFile(fileInfo, imageFiles);
				String fileName = recipeNo + "_" + user.getUserNo() + "_" + CommonUtil.nowData() + "_" + i + ".png";
//				File newFile = new File(CommonUtil.getImageFolderPath("representImg", request) + "/" + fileName);
//				CommonUtil.findImageFile(fileInfo, imageFiles).transferTo(newFile);
				FileCopyUtils.copy(CommonUtil.findImageFile(fileInfo, imageFiles).getBytes(),
						new FileOutputStream(CommonUtil.getImageFolderPath("representImg", request) + "/" + fileName));
				recipeRepresentImages.add(fileName);
			} // end of for

			/* 조리과정 등록 */
			for (int i = 0; i < produceImgNames.size(); i++) {
				String[] fileInfo = produceImgNames.get(i).split("/");
				JsonObject obj = new JsonObject();
				String fileName = recipeNo + "_" + user.getUserNo() + "_" + CommonUtil.nowData() + "_" + i + ".png";
				obj.addProperty("recipeProduceImage", fileName);
				obj.addProperty("recipeProduce", recipeProduce[i]);
				recipeProduceDatas.add(obj);
				FileCopyUtils.copy(CommonUtil.findImageFile(fileInfo, imageFiles).getBytes(),
						new FileOutputStream(CommonUtil.getImageFolderPath("recipeImg", request) + "/" + fileName));
			} // end of for
			recipeDatas.put("recipeProduceDatas", recipeProduceDatas.toString());
			recipeDatas.put("recipeRepresentImages", recipeRepresentImages.toString());
			recipeService.registyImageAndProduce(recipeDatas);
			recipeService.addMaterials(recipeDatas);
			result.put("status", "success");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("status", "false");
		}
		return new Gson().toJson(result);
	}

	@RequestMapping("materialSearch")
	public void mts(@RequestParam String materialName, Model model) {
		model.addAttribute("list", recipeService.getMaterial(materialName));
	}
}
