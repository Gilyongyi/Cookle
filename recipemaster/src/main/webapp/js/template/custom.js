;(function($) {
	"use strict";
	var HAINTHEME = HAINTHEME || {};

	//== Check if element exist
	//
	$.fn.exists = function(callback) {
		var args = [].slice.call(arguments, 1);
		if (this.length) {
			callback.call(this, args);
		}
		return this;
	};

	//===== Header area
	//
	HAINTHEME.navbar = function() {
		//** Sticky nav
		//
		var stickyNav = function() {
			$(".ht-main-navbar.scroll-up-nav").headroom({
				classes : {
					// when element is initialised
					initial : "headroom",
					// when scrolling up
					pinned : "headroom--pinned",
					// when scrolling down
					unpinned : "headroom--unpinned",
					// when above offset
					top : "headroom--top",
					// when below offset
					notTop : "headroom--not-top"
				},
			});
		}
		//** Mega menu
		//
		var megaMenuEffect = function() {
			$('#ht-main-nav li.mega-menu').each(function() {
				$(this).on({
					mouseenter: function(e) {
						$(this).addClass('active');
						$(this).find('ul').first()
							.css({display:"block"})
							.stop()
							.animate(
							{
								opacity: 1
							},
							{
								duration: 300
							}
						);
					},
					mouseleave: function(e) {
						$(this).removeClass('active');
						$(this).find('ul').first()
							.stop()
							.animate(
							{
								opacity: 0
							},
							{
								duration: 300,
								complete : function() {
									$(this).css({display:"none"});
								}
							}
						);
					}
				});
			});
		};
		//** Dropdown menu
		//
		var dropdownMenuEffect = function() {
			$('#ht-main-nav li.dropdown-menu').each(function() {
				$(this).on({
					mouseenter: function(e) {
						$(this).addClass('active');
						$(this).find('ul').first()
							.css({display:"block"})
							.stop()
							.animate(
							{
								opacity: 1
							},
							{
								duration: 300
							}
						);
					},
					mouseleave: function(e) {
						$(this).removeClass('active');
						$(this).find('ul').first()
							.stop()
							.animate(
							{
								opacity: 0
							},
							{
								duration: 300,
								complete : function() {
									$(this).css({display:"none"});
								}
							}
						);
					}
				});
				$(this).find('ul').first().find('li').on({
					mouseenter: function(e) {
						$(this).addClass('active');
						$(this).find('ul').first()
							.css({display:"block"})
							.stop()
							.animate(
							{
								opacity: 1
							},
							{
								duration: 300
							}
						);
					},
					mouseleave: function(e) {
						$(this).removeClass('active');
						$(this).find('ul').first()
							.stop()
							.animate(
							{
								opacity: 0
							},
							{
								duration: 300,
								complete : function() {
									$(this).css({display:"none"});
								}
							}
						);
					}
				})
			});
		};
        //** Search form
		//
        var searchFormExpand = function() {
			$('.ct-search').find('button').each(function(){
				var inputText = $(this).parent().find('input');
				$(this).on('click', function(e){
					if (!inputText.hasClass('is-visible')) {
						inputText.addClass('is-visible').focus();
						inputText.animate(
							{
								width: 180,
								opacity: 1
							},
							{
								duration: 300
							}
						);
						$(this).addClass('is-active');
					} else {
						inputText.removeClass('is-visible');
						inputText.animate(
							{
								width: 0,
								opacity: 0
							},
							{
								duration: 300
							}
						);
						$(this).removeClass('is-active');
					}
					e.preventDefault();
					e.stopPropagation();
				});
			});
			$('#ht-search-form')
				.on('show.bs.modal', function(event) {
					$('.search-toggle').addClass('active');
				})
				.on('shown.bs.modal', function(event) {
					$(this).find('input').focus();
				})
				.on('hidden.bs.modal', function(event) {
					$('.search-toggle').removeClass('active');
				})
			;
		};
		//** Mobile nav
		//
		var mobileNav = function() {
			$('.mobile-control-toggle button.mobile-nav-toggle').on('click', function(e){
				if (!$('.mobile-nav').hasClass('is-open')) {
					$('.mobile-nav').addClass('is-open');
					$('body').addClass('mobile-menu-is-open');
					$(this).addClass('is-open');
				} else {
					$('.mobile-nav').removeClass('is-open');
					$('body').removeClass('mobile-menu-is-open');
					$(this).removeClass('is-open');
				}
				e.stopPropagation();
			});
		};
		//** Mobile submenu
		//
		var mobileSubNav = function() {
			$('.mobile-nav').find('.sub-menu-toggle').on('click', function(e){
				var subMenu = $(this).parent().find('ul').first();
				var thisLi = $(this).parent();
				if ( subMenu.css('display') != 'block' ) {
					subMenu.css('display','block');
					thisLi.addClass('is-open');
				} else {
					subMenu.css('display','none');
					thisLi.removeClass('is-open');
				}
				e.stopPropagation();
			});
		}
		//** Touch anywhere to close
		//
		var anywhereClose = function() {
			$(document).on('click', function() {
				// Close search form desktop
				var inputText = $('.main-nav-control-toggles').find('input');
				if (inputText.hasClass('is-visible')) {
					inputText.removeClass('is-visible');
					inputText.animate(
						{
							width: 0,
							opacity: 0
						},
						{
							duration: 300
						}
					);
					$('.ct-search').find('button').removeClass('is-active');
				}
				// Close mobile nav
				// var mobileMenu = $('.mobile-nav');
				// if (mobileMenu.hasClass('is-open')) {
				// 	alert('Hello :)');
				// 	$('body').removeClass('mobile-menu-is-open');
				// 	$('.mobile-nav').removeClass('is-open');
				// 	$('.mobile-control-toggle button.mobile-nav-toggle').removeClass('is-open');
				// }
			});
			$('.ht-page-wrapper').on('click', function() {
				if ($('.mobile-nav').hasClass('is-open')) {
					$('body').removeClass('mobile-menu-is-open');
					$('.mobile-nav').removeClass('is-open');
					$('.mobile-control-toggle button.mobile-nav-toggle').removeClass('is-open');
				}
			});
		};
		//** Stop propagation for anywhere close
		//
		var clearPropagation = function() {
			var mobileNav = $('.mobile-nav');
			var searchForm = $('.ct-search input');
			$(mobileNav, searchForm).on('click', function(e){
				e.stopPropagation();
			});
		};
		//** Invoking
		//
		stickyNav();
		megaMenuEffect();
		dropdownMenuEffect();
		searchFormExpand();
		mobileNav();
		mobileSubNav();
		anywhereClose();
		clearPropagation();
	};

	//===== Slider
	//
	HAINTHEME.slider = function() {
		$('.flexslider.basic').each(function(){
			$(this).flexslider({
				namespace		: 	"flex-",
				selector		: 	".slides > li",
				animation		:	$(this).data('effect'), //"fade" or "slide"
				slideshow		:	$(this).data('auto'), // Boolean: Animate slider automatically
				easing			:  	"easeInOutExpo", // Easing
				useCSS			:  	true, // Use css animation
				direction		:	$(this).data('direction'), // horizontal, vertical
				controlNav		:	$(this).data('pager'), // Pagination
				directionNav	:	$(this).data('navi'), // Next, prev
				animationSpeed	:	$(this).data('animation-speed'),
				slideshowSpeed	:	$(this).data('slide-speed'),
				smoothHeight	:	true,
				prevText		:	'<i class ="fa fa-chevron-left"></i>',
				nextText		:	'<i class ="fa fa-chevron-right"></i>'
			});
		});
		$('.flexslider.sync').each(function(){
			$($(this).data('sync')).flexslider({
				asNavFor		:  	$('#'+$(this).attr('id')),
				animation		:	"slide",
				itemWidth		:  	60,
				directionNav	: 	false,
				controlNav		:	false,
				animationLoop	:  	false,
				itemMargin		:  	0
			});
			$(this).flexslider({
				sync			: 	$(this).data('sync'),
				namespace		: 	"flex-",
				selector		: 	".slides > li",
				animation		:	$(this).data('effect'), //"fade" or "slide"
				slideshow		:	$(this).data('auto'), // Boolean: Animate slider automatically
				//easing			:  	"easeInOutExpo", // Easing
				useCSS			:  	true, // Use css animation
				direction		:	$(this).data('direction'), // horizontal, vertical
				controlNav		:	$(this).data('pager'), // Pagination
				directionNav	:	$(this).data('navi'), // Next, prev
				animationSpeed	:	$(this).data('animation-speed'),
				slideshowSpeed	:	$(this).data('slide-speed'),
				smoothHeight	:	false,
				prevText		:	'<i class ="fa fa-chevron-left"></i>',
				nextText		:	'<i class ="fa fa-chevron-right"></i>'
			});
		});
		$('.ht-carousel').each(function(){
			$(this).find('.slides').owlCarousel({
				responsive : {
					0: {
						items: $(this).data('items')[0]
					},
					481: {
						items: $(this).data('items')[1]
					},
					769: {
						items: $(this).data('items')[2]
					},
					993: {
						items: $(this).data('items')[3]
					},
					1201: {
						items: $(this).data('items')[4]
					}
				},
				loop: $(this).data('loop'),

				autoplay: $(this).data('auto'),
				autoplayTimeout: $(this).data('slide-speed'),
				autoplayHoverPause: true,

				smartSpeed: $(this).data('animation-speed'),

				fallbackEasing: 'swing',

				nestedItemSelector: false,
				itemElement: 'div',
				stageElement: 'div',

				// Classes and Names
				themeClass: '',
				baseClass: 'owl-carousel',
				itemClass: 'owl-item',
				centerClass: 'center',
				activeClass: 'active',

				dots: $(this).data('pager'),
				nav: $(this).data('navi'),
				navText: ['<i class ="fa fa-chevron-left"></i>', '<i class ="fa fa-chevron-right"></i>']
			});
		});
	};

	//===== Isotope
	//
	HAINTHEME.isotope = function() {
		$('.isotope-filter').each(function(){
			var targetGrid = $(this).data('target');
			$(targetGrid).isotope({
				itemSelector: '.entry',
				layoutMode: 'masonry',
				transitionDuration: '1s'
			});
			$(this).find('a').on( 'click', function(e) {
				$(this).parent().parent().find('li').removeClass('is-filtered');
				$(this).parent().addClass('is-filtered');
				var filterValue = $(this).data('filter');
				$(targetGrid).isotope({
					filter: filterValue,
					transitionDuration: '1s'
				});
				e.preventDefault();
			});
		});
	};

	//===== Masonry
	//
	HAINTHEME.masonry = function() {
		$('.ht-masonry-layout').each(function(){
			var gridSizer = $(this).data('grid-size');
			$(this).isotope({
				layoutMode: 'masonry',
				columnWidth: gridSizer,
				isFitWidth: true,
				gutter: '1'
			});
		});
	};

	//===== Comment Reply
	//
	HAINTHEME.commentReply = function() {
		var html = 
		'<div class="comment-reply">'+
			'<button class="close">&times;</button>'+
			'<div class="">'+
				'<h3 class="heading">REPLY TO THIS COMMENT</h3>'+
			'</div>'+
			'<form action="">'+
				'<div class="form-group half">'+
					'<label for="">Name <span class="label-description">(ex: William) <sup>*</sup></span></label>'+
					'<input type="text">'+
				'</div>'+
				'<div class="form-group half">'+
					'<label for="">Email <span class="label-description">(Not Published)</span> <sup>*</sup></label>'+
					'<input type="text">'+
				'</div>'+
				'<div class="form-group half">'+
					'<label for="">Website <span class="label-description">(Optional)</span></label>'+
					'<input type="text">'+
				'</div>'+
				'<div class="form-group">'+
					'<label for="">Comment <sup>*</sup></label>'+
					'<textarea name="" id="" cols="30" rows="5"></textarea>'+
				'</div>'+
				'<div class="form-group submit-group">'+
					'<div><input type="checkbox"> Notify me of followup comments in this post via email</div>'+
					'<button type="submit" class="ht-button view-more-button">'+
						'<i class="fa fa-arrow-left"></i> SUBMIT <i class="fa fa-arrow-right"></i>'+
					'</button>'+
				'</div>'+
			'</form>'+
		'</div>'

		$('.comment-reply-link').on('click', function() {
			var target = $(this).attr('href');
			if ($(target).find('.comment-reply').length == 0) {
				$(target).find('.comment-content').append(html);
			}
		});

		$(document).on('click', '.comment-reply .close', function(){
			$(this).parent().remove();
		});
	};

	HAINTHEME.googleMapAPI = function() {
		var mapCounter = 1;
		$('.ht-map').each(function(){
			$(this).attr('id','ht-map-'+ mapCounter);
			mapCounter++;
			var coor = $(this).data('coor');
			var id = $(this).attr('id');
			var zooming = $(this).data('zoom');
			var mapType = $(this).data('map-type');
			var controlUI = $(this).data('control-ui') ? false : true;
			var scrollWheel = $(this).data('scroll-wheel');
			var marker = $(this).data('marker');
			var style = $(this).data('style');

			$(this).css('height',$(this).data('height'));

			function initialize() {
				var map_canvas = document.getElementById(id);
				var myLatlng = new google.maps.LatLng(coor[0],coor[1]);
				var map_options = {
					center: myLatlng,
					zoom: zooming,
					mapTypeId: mapType,
					disableDefaultUI: controlUI,
					scrollwheel: scrollWheel,
					styles: style
				}
				var map = new google.maps.Map(map_canvas, map_options);
				if (marker != "") {
					var mapMarker = new google.maps.Marker({
						position: myLatlng,
						map: map,
						title: marker
					});
				}
			}
			google.maps.event.addDomListener(window, 'load', initialize);
		});
	};

	HAINTHEME.recipeSubmit = function() {
		var minutesConverter = function(minute) {
			var hou = Math.floor(minute / 60);
			var min = minute % 60;

			hou = hou > 9 ? hou : '0' + hou;
			min = min > 9 ? min : '0' + min;

			return hou + ':' + min;
		}
		$('.upload').each(function() {
			var $target = $($(this).data('target'));
			var $button = $(this).find('a.upload-trigger');
			var $visibleInput = $(this).find('.upload-visible');

			$button.on('click', function(e) {
				$target.trigger('click');
				e.preventDefault();
			})
			$target.on('change', function() {
				$visibleInput.val($(this).val());
			})
		});
		$( ".slider-range" ).each(function() {
			var $this = $(this);
			var $targetInput = $($(this).data('target'));
			$this.slider({
				// range: true,
				min: 0,
				max: $(this).data('max') * 60,
				step: 1,
				values: [ 0 ],
				slide: function( event, ui ) {
					$targetInput.val( minutesConverter(ui.values[ 0 ]) );
				}
			});
		})
	};

	HAINTHEME.lightbox = function() {
		// Lightbox Gallery
		$('.ht-lightbox-gallery').exists(function(){
			var idCounter = 1;
			var child = $(this).data('child');
			$('.ht-lightbox-gallery').each(function(){
				var galleryId = 'ht-lightbox-gallery-' + idCounter;
				idCounter++;
				$(this).find(child).each(function() {
					$(this)
						.addClass('ht-lightbox')
						.attr('data-lightbox-gallery', galleryId)
					;
				})
			});
		});
		$('a.ht-lightbox').nivoLightbox({
			effect: 'fadeScale',
			theme: 'default',
			keyboardNav: true,
			clickOverlayToClose: true,
			onInit: function(){},
			beforeShowLightbox: function(){},
			afterShowLightbox: function(lightbox){},
			beforeHideLightbox: function(){},
			afterHideLightbox: function(){},
			onPrev: function(element){},
			onNext: function(element){},
			errorMessage: 'The requested content cannot be loaded. Please try again later.'
		});
	};

	HAINTHEME.parallaxGen = function() {
		var is_smallscreen = $(window).width();
		if( is_smallscreen > 768){
			$('[data-ht-parallax]').each(function() {
				var dataMove = $(this).attr("data-ht-parallax");
				var dataAttrFrom, dataFrom, dataAttrTo, dataTo;
				if($(this).is('#ht-top-area')) {
					var height = $(this).outerHeight();
					dataAttrFrom = 'data-0';
					dataFrom = 'background-position:0px 0px';
					dataAttrTo = 'data-' + height;
					dataTo = 'background-position: 0px ' + dataMove + 'px';
				} else {
					dataAttrFrom = 'data-bottom-top';
					dataFrom = 'background-position: 0px -' + dataMove + 'px';
					dataAttrTo = 'data-top-bottom';
					dataTo = 'background-position:0px 0px';
				}
				$(this).attr(dataAttrFrom,dataFrom).attr(dataAttrTo,dataTo);
			});
		}
	};
	HAINTHEME.parallaxInit = function() {
		var vW = $(window).width();
		if( vW > 768) {
			var s = skrollr.init({
				forceHeight: false,
				smoothScrolling: false
			});
		} else {
			var s = skrollr.init();
			s.destroy();
		}
		if(Modernizr.touch) {
			var s = skrollr.init();
			s.destroy();
		}
	};
	
	HAINTHEME.others = function() {
		$("#dp-hook").DateTimePicker();

		$('.ht-accordion').each(function() {
			var $this = $(this);
			$(this).find('.panel-heading').on('click', function() {
				$this.find('.panel-heading').removeClass('current');
				$(this).addClass('current');
			})
		});

		$('.entry-ingredient').find('tr').on('click', function() {
			$(this).toggleClass('is-done');
		});

		$(".action-print").printPage({
			message: 'Loading print ...'
		});

		$('.action-share').each(function() {
			$(this).on({
				mouseenter: function(e) {
					if( $(window).width() >= 768 ) {
						$( this ).find( ".entry-social" )
							.css({ display:"block" })
							.stop()
							.animate(
								{
									opacity: 1,
									top: '-60'
								},
								{
									duration: 300
								}
						);
					}
				},
				mouseleave: function(e) {
					if( $( window ).width() >= 768 ) {
						$( this ).find( ".entry-social" )
						.stop()
						.animate(
							{
								opacity: 0,
								top: '-40'
							},
							{
								duration: 300,
								complete : function() {
									$( this ).css({ display:"none" });
								}
							}
						);
					}
				}
			});
		});
	};

	$(document).ready( function() {
		$('html').removeClass('no-js');		
		HAINTHEME.navbar();
		HAINTHEME.slider();
		HAINTHEME.isotope();
		HAINTHEME.masonry();
		HAINTHEME.lightbox();
		HAINTHEME.commentReply();
		HAINTHEME.googleMapAPI();
		HAINTHEME.recipeSubmit();
		HAINTHEME.others();
	});

	$(document).ready(function(){
		var is_smallscreen_2 = $(window).width();
		if( is_smallscreen_2 > 768 ){
			HAINTHEME.parallaxGen();
			HAINTHEME.parallaxInit();
			$(window).on( 'resize', function() {
				HAINTHEME.parallaxInit();
			})
		}
	});

	$(document).ready(function(){
		var isiPhone = navigator.userAgent.toLowerCase().indexOf("iphone");
		var isiPad = navigator.userAgent.toLowerCase().indexOf("ipad");
		var isiPod = navigator.userAgent.toLowerCase().indexOf("ipod");
		if(isiPhone > -1){
			// alert('iphone');
		}
		if(isiPad > -1){
			alert('iPad');
		}
		if(isiPod > -1){
		  alert('iPod');
		}   
	});

	$(window)
		.on( 'load', function() {
			HAINTHEME.isotope();
			HAINTHEME.masonry();
		})
		.on( 'scroll', function() {

		});

})(jQuery); // EOF