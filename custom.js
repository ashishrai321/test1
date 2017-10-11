// Iterate over each select element
$('.cusSelect select').each(function () {
	
	if($(window).width() < 768 && !$('.loginPane').length) {
		//return;
	}

    var $this = $(this),
        numberOfOptions = $(this).children('option').length;

    $this.addClass('s-hidden');

    $this.wrap('<div class="select"></div>');

    $this.after('<div class="styledSelect"></div>');

    var $styledSelect = $this.next('div.styledSelect'),
		getEq = (function(){
			if($this.children('option').filter("[selected]").index() > 0){
				return $this.children('option').filter("[selected]").index();
			}else{
				return 0;
			}
		})();
		
    $styledSelect.text($this.children('option').eq(getEq).text()); 

    var $list = $('<ul />', {
        'class': 'options'
    }).insertAfter($styledSelect);
	
    /*for (var i = 0; i < numberOfOptions; i++) {
        $('<li />', {
            text: $this.children('option').eq(i).text(),
            rel: $this.children('option').eq(i).val() 
        }).appendTo($list);
    }*/
	
	
	for (var i = 1; i < numberOfOptions; i++) {
		if($this.find('option').eq(i).data('target') && $this.find('option').eq(i).hasClass('padL10')){
			$('<li />', {
				text: $this.children('option').eq(i).text(),
				rel: $this.children('option').eq(i).val(),
				class: 'indent',
				target:'_blank'
			}).appendTo($list);
		}else if($this.find('option').eq(i).data('target')){
			$('<li />', {
				text: $this.children('option').eq(i).text(),
				rel: $this.children('option').eq(i).val(),
				target:'_blank'
			}).appendTo($list);
		}else if($this.find('option').eq(i).hasClass('padL10')){
			$('<li />', {
				text: $this.children('option').eq(i).text(),
				rel: $this.children('option').eq(i).val(),
				class: 'indent'
			}).appendTo($list);
		}else{
			$('<li />', {
				text: $this.children('option').eq(i).text(),
				rel: $this.children('option').eq(i).val(),
			}).appendTo($list);
		}
    }
	
	
	
	
	
	if($list.children('li').length >= 10){
		var filter = $('<input />', {
			'type':'text',
			'placeholder':'Search..'
		}).prependTo($this.siblings('ul.options'));
		
		filter.keyup(function(){
			var valThis = this.value.toLowerCase(),
				hasLength  = this.value.length;
		
			$list.children('li').each(function () {
				var text  = $(this).text(),
					textL = text.toLowerCase(),
					htmlR = '<span>' + text.substr(0, hasLength) + '</span>' + text.substr(hasLength);
				(textL.indexOf(valThis) == 0) ? $(this).html(htmlR).show() : $(this).hide();
			});
		});
	}

    var $listItems = $list.children('li');
	if(getEq){
		$listItems.eq(getEq).addClass('selected');
	}
    $styledSelect.click(function (e) {
        e.stopPropagation();		
        if($(this).hasClass('active')){
            $(this).removeClass('active').next('ul.options').hide();
			return;
        }
        $(this).toggleClass('active').next('ul.options').toggle();
    });
    $listItems.click(function (e) {
        e.stopPropagation();
		$listItems.removeClass('selected');
        $styledSelect.text($(this).addClass('selected').text()).removeClass('active');
        $this.val($(this).attr('rel'));
        $list.hide();
    });

    $(document).click(function (e) {
		if (!$list.is(e.target) && $list.has(e.target).length === 0) {
			$styledSelect.removeClass('active');
			$list.hide();
			if($list.children('input').length){
				$list.children('input').val('').siblings('li').each(function(index, element) {
					var liText = $(element).text();
					$(element).text(liText);
				}).show(0);
			}
		}
    });

});

// For Popup ////////////////
	var $win = $(window), defPad;
	function popup_pos(panel, mask){
		if($(panel).hasClass('smFloat') && $win.width() < 768){
			$(panel).find('.popWrapper').css('height', $(panel).height());
		}else{
			$(panel).find('.popWrapper').css('height','');
			defPad = ($win.width() < 768 || $win.height() < 768) ? 20 : 100;
			$(panel).css('max-height', $win.height() - defPad)
			.find('.popWrapper').css('height', $(panel).height());
		}
		if($('#'+mask).length){return};
		$('body').append('<div id='+mask+'></div>');
		$('#'+mask).fadeIn(300, function(){
			if($(panel).hasClass('smFloat') && $win.width() < 768){
				$(panel).addClass('active')	
			}else{
				//alert('1');
				$(panel).fadeIn(1300, function(){
					$(panel).find('.popWrapper').css('overflow-y','');
					popup_pos(panel, mask);
				}).find('.popWrapper').css('overflow-y','hidden');			
			}
		});
		$('body').css('overflow-y', 'hidden');
	}
	function remove_mask(mask, contentBox){
		$(contentBox).removeClass('active');
		$(mask +','+ contentBox).fadeOut(300 , function() {
			$(mask).remove();
			$('body').css('overflow-y', 'auto');
			$(contentBox).removeAttr('style');
			if($(contentBox).find('.popWrapper').length){
				$(contentBox).find('.popWrapper').removeAttr('style');
			}
	    });
	}
	
	$(window).on('resize', function() {
		if($('.popup-box').length && $('.popup-box:visible').length && ($('.popup-box').hasClass('active') || $('.popup-box').hasClass('default'))){
			popup_pos($('.popup-box:visible'), 'mask');
		}
	});
	
	(function escape_bg(mask, contentBox){
		$(document.body).keyup(function(e) {
			if(e.keyCode == 27  && $('.popup-box:visible').length){
				$('a.close').trigger('click'); 
			}
			//return false;
		})
	})('#mask', '.popup-box')
	
	$('body').on('click', '.popup', function(e){	
		defPad = ($win.width() < 768 || $win.height() < 768) ? 20 : 100;
		popup_pos($(this).attr('data-href'), 'mask');
		e.preventDefault();
		return false;
	});	
	
	$('a.close').on('click', function() { 
	  remove_mask('#mask', '.popup-box:visible');
	  return false;
	});	
	
	$('body').on('click', '#mask', function() { 
	  	$('a.close').trigger('click');
	});
	$('.popup-box').on('click', 'input[value=Cancel], .typeClose', function(){
		$('a.close').trigger('click');
	})	

function scrollToTop(pos, time){
	$('body,html').animate({scrollTop:pos}, time, 'easeInOut4');
	return false;
}

$(document).ready(function() {
	var $typeDoc = $('.typeDoc');
		
	$typeDoc.find('dt').on('click', function(){
		var $this = $(this);
		if($this.hasClass('open')){
			if($this.hasClass('active')){
				$this.next('dd').slideToggle(400, function(){
					$this.removeClass('active');
				})
				return;
			}
			$this.next('dd').slideToggle(400, function(){
				$this.addClass('active');
			});
		}
	})
	
// Input Placeholder text
	$('input, textarea').each(function(index, element) {
		var placeholderText = $(element).attr('placeholder');
		$(element).on('focus', function(){
			$(element).attr('placeholder','');
		})
		$(element).on('blur', function(){
			$(element).attr('placeholder',placeholderText);
		})
	});
	
	if($("#defaultLocationMap").length){
		function initialize() {
		  var mapProp = {
			center:new google.maps.LatLng(28.7041,77.1025),
			zoom:12,
			mapTypeId:google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		  };
		  var map=new google.maps.Map(document.getElementById("defaultLocationMap"),mapProp);
		}
		google.maps.event.addDomListener(window, 'load', initialize);
	}
	
	if($("#mainNav").length){
		var subNav = $("#mainNav"),
			subNavHt = subNav.closest('header.main').outerHeight(),
			menuItems = subNav.find("li"),
			trigNav = $('.trigNav'),
			scrollItems = menuItems.map(function () {
				var item = $(this).data("id");
				return item;
			});
		
		function customScrollToTop($this){
			if($this.data("id")){
				var href = $this.data("id"),
					offsetTop = "#"+href;
				scrollToTop($(offsetTop).offset().top - (subNavHt - 2), 2000);
			}
		}
		menuItems.click(function(e) {
			customScrollToTop($(this));
		});
		trigNav.click(function(e){
			customScrollToTop($(this));
		});
		$(window).scroll(function () {
			/*if ($(window).scrollTop() < 100) {
				arrTop.fadeOut(400);
			} else {
				arrTop.fadeIn(400);
			}*/
			
			var fromTop = $(this).scrollTop(),
				cur = scrollItems.map(function () {
				if ($("#" + this).offset().top - subNavHt < fromTop)
					return this;
			});
			cur = cur[cur.length - 1];
			if (cur) {
				var id = cur.toString()
				menuItems.filter("[data-id=" + cur + "]").addClass("active")
				.siblings().removeClass("active");
			}
		});
	}
	
	$('#btnMenu').on('click', function(){
		var $this = $(this);
		$this.toggleClass('active');
		/*var $this = $(this), $search = $('#topWrapper .search');
		$search.fadeOut(200, function(){
			$this.parent('nav.main').addClass('z5').css('z-index',5);
			$('body, html').css({
				'overflow':'hidden',
				'position':'fixed',
				'top':0,
				'bottom':0,
				'left':0,
				'right':0,
			});
			if($this.hasClass('active')){
				$('body, html').css({
					'overflow':'auto',
					'position':'relative'
				});
				$this.parent('nav.main').removeClass('z5');
				$search.delay(400).fadeIn(0, 'easeInOutQuad', function(){
					$this.parent('nav.main').css('z-index',3);
				})
				
			}
			$this.toggleClass('active');
		})*/
	})

})

function initCarousel(){
	var jcarousel = $('#leadership');
	
	var labelTarget = $('#ourLeadership').find('.jLabel hgroup'), 
		labelTargetH5 = labelTarget.children('h5'),
		labelTargetH6 = labelTarget.children('h6'),
		labelTargetText = labelTarget.children('.moreText');
	
	labelTarget.children('.moreText').hide(200, 'easeInOutQuad');
	$this = $('#ourLeadership').find('button');
	$this.on('click', function(){
		if($(this).hasClass('close')){
			$(this).removeClass('close').text('More')				
		}else{
			$(this).text('Close').addClass('close');
		}
		labelTargetText.slideToggle();
	})
	
	var defLi = jcarousel.find('li').first();
	
	labelTargetH5.html(defLi.data('h5'));
	labelTargetH6.html(defLi.data('h6'));
	labelTargetText.html(defLi.data('text'));
	
	jcarousel
		.on('jcarousel:reload jcarousel:create', function () {
			var width = jcarousel.outerWidth();
			jcarousel.jcarousel('items').css('width', width + 'px');
		})
		.jcarousel({
			animation: {
				duration: 1000,
				easing: 'easeInOutQuad',
				
				start: function() {
					var target = jcarousel.jcarousel('fullyvisible');
					labelTarget.fadeOut(1000, 'easeInOutQuad', function(){
						labelTargetH5.html(target.data('h5'));
						labelTargetH6.html(target.data('h6'));
						labelTargetText.html(target.data('text'));
						$(this).fadeIn(1000, 'easeInOutQuad');
						
					})
				},
//					complete: function() {
//						carouselStage
//							.jcarousel('fullyvisible')
//							.addClass('active')
//							.siblings()
//							.removeClass('active');
//					}
				
			},
			//wrap: 'circular'
		})

		.jcarouselAutoscroll({
			interval: 5000,
			autostart: false,
			target: '+=1'
		})
		
		.touchwipe({
			wipeLeft: function() {
				$('.jcarousel-control-next4').trigger('click')
			},
			wipeRight: function() {
				$('.jcarousel-control-prev4').trigger('click')
			},
			min_move_x: 50,
			min_move_y: 50,
			preventDefaultEvents: false
		});
	
	$('.prev1')
		.on('jcarouselcontrol:inactive', function() {
			$(this).addClass('inactive');
		})
		.on('jcarouselcontrol:active', function() {
			$(this).removeClass('inactive');
		})
		.jcarouselControl({
			target: '-=1'
		});

	$('.next1')
		.on('jcarouselcontrol:inactive', function() {
			$(this).addClass('inactive');
		})
		.on('jcarouselcontrol:active', function() {
			$(this).removeClass('inactive');
		})
		.jcarouselControl({
			target: '+=1'
		});		
}

$.fn.viewportChecker = function(useroptions) {
    // Define options and extend with user
    var options = {
        classToAdd: 'visible',
        offset: 100,
        currIndex: 0,
        callbackFunction: function(elem) {
			
            if ($(elem).find('.mainSvg').length) {
				
                $(elem).find('.mainSvg path').hide(0);
				
                // begin displaying divs
                function showDivs(numberOfDivs, divArray) {

                    var i, lastDiv;

                    function nextDiv() {
                        i = randomInt(numberOfDivs);
                        if (numberOfDivs <= 1) {
                            $(divArray).fadeIn(2000);
                        }
                        $(divArray[i]).fadeIn(2000);
                        lastDiv = divArray.splice(i, 1);
                        numberOfDivs--;
                        if (numberOfDivs == 0) {
							$('.tagLine').addClass('show');
                            return;
                        };
                        setTimeout(nextDiv, 200);
                    }
                    setTimeout(nextDiv, 1000);
                }
                // calculate next random index
                function randomInt(divsLeft) {
                    var i = Math.random() * divsLeft;
                    return Math.round(i);
                }
				
				// Event function
				function attachEvt(elem){
					elem.on('click', function(e){
						console.log($(this).attr('d'));
						
						initCarousel();						
						
					})
				}
				
                // call this function on page load
                (function begin() {
                    //var arr = $(elem).find('.doodle g').css('display','none').toArray(); previous
                    //showDivs(arr.length, arr);
                    var objCont = document.getElementsByTagName('section')[currIndex].getElementsByTagName('object')[0].contentDocument;
                    var obj2 = $(objCont).find('path').css('display', 'none').toArray()
                    showDivs(obj2.length, obj2);
					attachEvt($(objCont).find('path'));
                })()
            }
        }
    };

    $.extend(options, useroptions);

    // Cache the given element and height of the browser
    var $elem = this,
        windowHeight = $(window).height();

    this.checkElements = function() {
        // Set some vars to check with
        var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html'),
            viewportTop = $(scrollElem).scrollTop(),
            viewportBottom = (viewportTop + windowHeight);

        $elem.each(function(index) {

            var $obj = $(this);
            // If class already exists; quit
            if ($obj.hasClass(options.classToAdd)) {

                return;
            }

            // define the top position of the element and include the offset which makes is appear earlier or later
            var elemTop = Math.round($obj.offset().top) + options.offset,
                elemBottom = elemTop + ($obj.height());

            // Add class if in viewport
            if ((elemTop < viewportBottom) && (elemBottom > viewportTop)) {
                $obj.addClass(options.classToAdd);
                currIndex = index;
                // Do the callback function. Callback wil send the jQuery object as parameter
                options.callbackFunction($obj);
            }
        });
    };

    // Run checkelements on load and scroll
    $(window).scroll(this.checkElements);
    this.checkElements();

    // On resize change the height var
    $(window).resize(function(e) {
        windowHeight = e.currentTarget.innerHeight;
    });
};


$(window).on('load', function(){
	
	var $body = $('body');
	$body.closest('html').addClass('loaded');
		
		var $st = setTimeout(function(){
			//$body.addClass('loadMain');
			clearTimeout($st);
		}, 1000);
		
		(function(){
			var lFollowX = 0,
				lFollowY = 0,
				x = 0,
				y = 0,
				friction = .05,
				$elem = $('#posMove');
			
			function moveBackground() {
			  x += (lFollowX - x) * friction;
			  y += (lFollowY - y) * friction;
			  
			  //translate = 'translate3d('+ x +'px,'+ y +'px, 0) rotateY(' + y + 'deg)';
			  translate = 'translate3d('+ x +'px,'+ y +'px, 0)';
			
			  $elem.css({'transform': translate});
			
			  window.requestAnimationFrame(moveBackground);
			}
			
			$(window).on('mousemove mouseover', function(e) {
			
			  var lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX));
			  var lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));
			  lFollowX = (20 * lMouseX) / 100; // 100 : 12 = lMouxeX : lFollow
			  lFollowY = (10 * lMouseY) / 100;
			
			});
			moveBackground();
		})();
		
		$('section, .scrollFadeIn').not('section.cusAnim').viewportChecker({
			classToAdd: 'animated fadeInBottom', // Class to add to the elements when they are visible
		});
		$('section.cusAnim.product li').viewportChecker({
			classToAdd: 'animated fadeInLeft', // Class to add to the elements when they are visible
		});
		
})







$(document).ready(function(e) {
	var svg = $('#svg');
    svg.find('path').on('click', function(e){
		svg.attr('class','active');
		console.log($(this).attr('d'))	
	})
});














