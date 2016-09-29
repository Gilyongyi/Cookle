
$(function(){
  $('.image1').mouseover(function(){
	  $('.image1').html("<img src='images/2.jpg'/>")
  })
})

var time;
$(function(){
	$('.image1').hover(function(){
	   this.src = "images/3.jpg";
	  time= setTimeout(function(){
		   $('.image1').attr('src',"images/4.jpg")
	    	},2000);
	}, function(){
	    this.src = "images/2.jpg";
	}).mouseleave(function(){
		clearTimeout(time);
		  });
})