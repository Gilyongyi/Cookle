package com.recipe.controller.json;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.recipe.domain.User;
import com.recipe.domain.Visitor;
import com.recipe.service.UserService;
import com.recipe.service.VisitorService;
import com.recipe.util.CommonUtil;

@Controller
@RequestMapping("/visitor/")
public class VisitorController {
  @Autowired VisitorService visitorService;
  @Autowired UserService userService;
  
  @RequestMapping(path="list", produces="application/json;charset=UTF-8")
  @ResponseBody
  public String list(@RequestParam(defaultValue="1")int pageNo, 
                      @RequestParam(defaultValue="10")int pageSize,
                      String email){
    User user = userService.selectFromEmail(email);
    
    HashMap<String,Object> result = new HashMap<>();
    try{
      List<Visitor> list = visitorService.getVisitorList(user.getUserNo(),pageNo, pageSize);
      result.put("status", "success");
      result.put("data", list);
      result.put("user", user);
    }catch(Exception e){
      e.printStackTrace();
      result.put("status", "failure");
    }
    return new Gson().toJson(result);
  }

  @RequestMapping(path="add", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
  @ResponseBody
  public String add(Visitor visitor, int toUser, HttpSession session){    
    HashMap<String,Object> result = new HashMap<>();
    try{
      visitor.setLoginUserNo(CommonUtil.getSessionUser(session).getUserNo());
      visitor.setVisitorUserNo(toUser);
      System.out.println("로그인한 유저 NO : "+ visitor);
      visitorService.addVisitor(visitor);
      result.put("status", "success");    
 
    }catch(Exception e){
      result.put("status", "failure");
    }
    return new Gson().toJson(result);
  }
  
  @RequestMapping(path="detail", 
      produces="application/json;charset=UTF-8")
  @ResponseBody
  public String detail(int no){        
    HashMap<String,Object> result = new HashMap<>();
    try{      
      result.put("status", "success");
      result.put("data", visitorService.getVisitor(no));
    }catch(Exception e){
      result.put("status", "failure");
    }
    return new Gson().toJson(result);
  }

  @RequestMapping(path="update", method=RequestMethod.POST, produces="application/json;charset=UTF-8")
  @ResponseBody
  public String update(Visitor visitor){    
    HashMap<String,Object> result = new HashMap<>();
    try{
      visitorService.updateVisitor(visitor);
      result.put("status", "success");      
    }catch(Exception e){
      result.put("status", "failure");
    }
    return new Gson().toJson(result);
  }
  
  @RequestMapping(path="delete", produces="application/json;charset=UTF-8")
  @ResponseBody
  public String delete(int no){    
    HashMap<String,Object> result = new HashMap<>();
    try{
      visitorService.deleteVisitor(no);
      result.put("status", "success");      
    }catch(Exception e){
      e.printStackTrace();
      result.put("status", "failure");
    }
    return new Gson().toJson(result);
  }
  
  @RequestMapping(path="loadMyPage",method=RequestMethod.POST, produces="application/json;charset=UTF-8")
  @ResponseBody 
  public String loadMyPage(String email){
    HashMap<String,Object> result = new HashMap<>();
    //참조하고 있는 사람 userNo
    User user=userService.selectFromEmail(email);
    int userNo = user.getUserNo();
    try{
      userService.addHits(userNo);
      result.put("status","success");
      result.put("data",visitorService.getVisitorInfo(userNo));
    }catch (Exception e){ 
      result.put("status", "false");
    }
    return new Gson().toJson(result);
  }
}
