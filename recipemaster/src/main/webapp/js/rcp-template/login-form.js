    ////////////____Input Focus___//////////////////

    $('.form-control').focusout(function() {
        $('.form-group').removeClass('focus');
    });
    $('.form-control').focus(function() {
        $(this).closest('.form-group').addClass('focus');
    });

    /// Input Kepress Filled  Focus
    $('.form-control').keyup(function() {
        if($(this).val().length > 0){
            $(this).closest('.form-group').addClass('filled');
        }

        else{
            $(this).closest('.form-group').removeClass('filled');
        }
    });

    /// Input Check Filled Focus
    var $formControl = $('.form-control');
    var values = {};
    var validate =    $formControl.each(function() {
        if($(this).val().length > 0){
            $(this).closest('.form-group').addClass('filled');
        }
        else{
            $(this).closest('.form-group').removeClass('filled');
        }
    });

// Button switching

$('.close').click(function(){
  $(this).closest('.register-form').toggleClass('open');
});