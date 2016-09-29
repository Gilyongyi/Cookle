package com.recipe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.recipe.domain.Visitor;
import com.recipe.service.VisitorService;

@Controller
@RequestMapping("/visitor/")
public class VisitorController {
  @Autowired VisitorService visitorService;
  
  @RequestMapping("list")
  public String list(@RequestParam(defaultValue="1")int pageNo, 
                     @RequestParam(defaultValue="4")int pageSize,
                     Model model){
    
//    model.addAttribute("list", visitorService.getVisitorList(pageNo, pageSize));
    
    return "visitor/list";
  }
  
  @RequestMapping("detail")
  public String detail(int no, Model model){
    
    model.addAttribute("visitor", visitorService.getVisitor(no));
    
    return "visitor/detail";
  }
  
  @RequestMapping(path="add", method=RequestMethod.GET)
  public String form(){   
    
    return "visitor/form";
  }
  @RequestMapping(path="add", method=RequestMethod.POST)
  public String add(Visitor visitor){   
    visitorService.addVisitor(visitor);
    return "redirect:list.do";
  }
  
  @RequestMapping(path="update", method=RequestMethod.POST)
  public String update(Visitor visitor){   
    visitorService.updateVisitor(visitor);
    return "redirect:list.do";
  }
  
  @RequestMapping(path="delete")
  public String delete(int no){   
    visitorService.deleteVisitor(no);
    return "redirect:list.do";
  }
}
