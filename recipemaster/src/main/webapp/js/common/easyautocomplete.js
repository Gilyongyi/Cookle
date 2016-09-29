$(document).ready(function(){
	// 자동완성 기능
	var options = {
			  url: function(phrase) {
				  console.log(phrase);
			    return "recipe/recipeSearchAutoComplete.json?searchValue="+phrase;
			  },
	
			  getValue: function(element) {
				console.log(element);
			    return element;
			  },
	
			  ajaxSettings: {
			    dataType: "json",
			    method: "GET"
			  },
			  requestDelay: 400,
			  
		      list: {
		          showAnimation: {
		            type: "slide", //normal|slide|fade
		            time: 200
		          },
	
		          hideAnimation: {
		            type: "slide", //normal|slide|fade
		            time: 200
		          },
		          onChooseEvent: function() {
		            
		          }
		      }
		};
		
	/*$('#searchKeyword').easyAutocomplete(options);*/
})
