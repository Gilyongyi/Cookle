// show contact
$('.rcp-rt-recipe-btn').click(function(){
  $(this).addClass('active');
  $('.contactme').addClass('active');
  $('.overlay').fadeIn();
});

// overlay escape click
$('.overlay').click(function(){
  $('.chat-wrap').removeClass('active');
  $('.contactme').removeClass('active');
  $('.overlay').fadeOut();
});

// inputs background on blur
$('.inputs').blur(function(){
  if($(this).val().length > 0){
    $(this).addClass('white');
  } else {
    $(this).removeClass('white');
  }
});

// boom