package com.recipe.controller;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.recipe.domain.User;
import com.recipe.service.UserService;
import com.recipe.util.CommonUtil;

@Controller
@RequestMapping("/user/")
public class UserController {
	@Autowired UserService userService;
	
	public CommonUtil commonUtil = new CommonUtil(); 

	@RequestMapping(path="update")
	@ResponseBody
	public String update(User user, @RequestParam("beforePassword")String beforePassword, 
			@RequestParam("profileImage") MultipartFile profileImage,
			HttpServletRequest request){    
		HashMap<String,Object> result = new HashMap<>();
		try{
			User dbUser = userService.getUser(user.getUserNo());
			System.out.println(user);
			if(beforePassword.equals(dbUser.getPassword())){
				/*파일업로드 추가*/
				if(null!=profileImage){
					String fileName = "userprofile_"+user.getUserNo()+".png";
					user.setImage(fileName);
					System.out.println(profileImage.getOriginalFilename());
					File recipeUrl= new File(commonUtil.getImageFolderPath("profileImg", request)+"/"+fileName);
					profileImage.transferTo(recipeUrl);
				}/*파일업로드 추가 끝*/
				userService.updateUser(user);
				result.put("status", "success");
			} else {
				result.put("status", "pwdFail");
			}
		}catch(Exception e){
			e.printStackTrace();
			result.put("status", "failure");
		} 
		
		return new Gson().toJson(result);
	}
}
