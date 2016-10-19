(function($) {

	$.fn.dcTab = function( options ){

		// Establish our default settings
		var settings = $.extend({
		//	text         : 'Hello, World!',
		//	color        : null,
		//	fontStyle    : null,
		//	complete	 : null
		}, options);

		return this.each( function() {
						
			var hidWidth;
			//var scrollBarWidths = 40;	
			var $this = $(this);
			var widthOfList = function(){
				var itemsWidth = 0;
				$this.find('li').each(function(){
					var itemWidth = $(this)[0].getBoundingClientRect().width;
					itemsWidth+=itemWidth;
				});
				return itemsWidth;
			};
			
			/* width Of Hidden */
			var widthOfHidden = function(){ 
				return ( widthOfList()-($this.outerWidth()))
			};
			
			$this.find('ul.nav-tabs').width(widthOfList())

			var getLeftPosi = function(){
				return $this.find('ul.nav-tabs').position().left;
			};
			
			var reAdjust = function(){
				if (($this.outerWidth()) < widthOfList()) {
					$this.find('.scroller-right').show();
					$buttonWidth = $this.find('.scroller-right').outerWidth();
					$this.find('.scrollable-wrapper').css('padding-right', $buttonWidth + 'px');
				}
				else {
					$this.find('.scroller-right').hide();
					$this.find('.scrollable-wrapper').css('padding-right', '0px');
				}
				if (getLeftPosi()<0) {
					$this.find('.scrollable-wrapper').css('padding-left', $buttonWidth + 'px');
					$this.find('.scroller-left').show();
				}
				else {
					$('.item').animate({left:"-="+getLeftPosi()+"px"},'slow');
					$this.find('.scroller-left').hide();
					$this.find('.scrollable-wrapper').css('padding-left', '0px');
				}
			}
			
			reAdjust();
			
			$(window).on('resize',function(e){  
				reAdjust();
			});
			
			$scrollLeft = '';
			$scrolledLeft = '';
			$tabSet = '';
			$tabSetLeft = '';
			$tab = $(".dc-list li");
			$wrapper = $('.scrollable-wrapper');
			$navCotainer = $wrapper.outerWidth();
			$wrapperLeft = $wrapper.offset().left;
			$wrapperRight = $wrapper.offset().left + $navCotainer;
			$tabLeft = $tab.offset().left;
			$buttonWidth = $('.scroller-right').outerWidth();
			
			/*******************/
			var sliderLoad = function(){
				var $slider = $this.find('.slider'),
					$sliderActive = $this.find('ul li.active'),
				//  $isActive = $('.dc-tabs-scrollable ul li.active'),
					$isX = $sliderActive.offset().left,
					$navX = $this.find(".nav").offset().left,
					$wrapperLeft = $wrapper.offset().left;
					$sliderLeft = $isX - $wrapperLeft,
					$wrapPadLeft = $wrapper.css("padding-left"),
					$paddingAmount = parseInt($wrapPadLeft, 10); 
					$finalPossion =  $wrapperLeft + $paddingAmount - $navX + $isX - $wrapperLeft;
				if ($navX < $paddingAmount + $wrapperLeft){
					$slider.width($sliderActive.width() + "px").css("left",$finalPossion + "px");
				}else {
					$slider.width($sliderActive.width() + "px").css("left",$sliderLeft + "px");
				}
				$this.find("ul li").click(function(){
					var $thisWidth = $(this).width() + "px",
						$newLeft = $(this).offset().left - $wrapperLeft,
						$navX = $(this).closest(".nav").offset().left,
						$finalPossion = $wrapperLeft - $navX + $paddingAmount + $newLeft;
						$slider.width($thisWidth).css("left", $finalPossion + "px");
						//$slider.d();
				});
			};
			
			sliderLoad();
			$(window).on("load resize",function(){
				sliderLoad();	
			});
			
			
			/*******************/
			$this.find('.scroller-right').click(function() {
			//	alert("yes");
				$wrapper = $(this).prev(".scrollable-wrapper");
				$tab = $wrapper.find(".dc-list li");
				
				$navWidth = $wrapper.children(".nav").width();
				$thisWidht = $(this).outerWidth();
				
				$tab.each(function() {
					var SuspectTabLeft = $(this).offset().left;
					var SuspectTabRight = $(this).offset().left + $(this).outerWidth();
					$(this).removeClass('prev-tab');
					
					if (SuspectTabLeft < $wrapperRight && SuspectTabRight > $wrapperRight){
						$tabSet =  SuspectTabRight - $wrapperRight + $thisWidht;
						$(this).addClass('last-tab');	
						$(this).prev().removeClass('last-tab');
					}
				});
				
				var finalTab = $wrapper.find('.last-tab').next().length;
				
				if ( finalTab == 0) {
					var lastTabRight = $wrapper.find('.last-tab').offset().left + $wrapper.find('.last-tab').outerWidth();
					var NewScrollAmount = lastTabRight - $wrapperRight ;
					$wrapper.animate({scrollLeft: '+='+ NewScrollAmount })
					$(this).fadeOut('slow');	
				}
				else {
					$wrapper.animate({scrollLeft: '+='+ $tabSet});			
				}
				$(this).parents('.dc-tabs').find('.scroller-left').fadeIn('slow');
		
			});
			/*******************/
			
			/*******************/
			$this.find('.scroller-left').click(function() {
				$wrapper = $(this).next(".scrollable-wrapper");
				$tab = $wrapper.find(".dc-list li");
				$tab.each(function() {
					var SuspectTabLeft = $(this).offset().left;
					var SuspectTabRight = $(this).offset().left + $(this).outerWidth();
					$(this).removeClass('last-tab');
					if (SuspectTabLeft < $wrapperLeft && SuspectTabRight > $wrapperLeft){
						$tabSetLeft =  $wrapperLeft - SuspectTabLeft + $thisWidht;
						$(this).addClass('prev-tab');	
						$(this).next().removeClass('prev-tab');
					}
				});
				var finalTab = $wrapper.find('.prev-tab').prev().length;
				if ( finalTab == 0) {
					var lastTableft = $wrapper.find('.prev-tab').offset().left;
					var NewScrollAmount = $wrapperLeft - lastTableft ;
					$wrapper.animate({scrollLeft: '-='+ NewScrollAmount })
					$(this).fadeOut('slow');	
				}
				else {
					$wrapper.animate({scrollLeft: '-='+ $tabSetLeft});			
				}
				$(this).parents('.dc-tabs').find('.scroller-right').fadeIn('slow');
			});
			$this.find('ul li').click(function(){
				$wrapper = $(this).closest(".scrollable-wrapper");
					//setTabActive()
				var activeLeft = $(this).offset().left;
				var activeRight = $(this).offset().left + $(this).outerWidth();
				var cuttRight = $wrapperRight - $buttonWidth;
				var cuttleft = $wrapperLeft + $buttonWidth;
				if (activeLeft < cuttleft && activeRight > cuttleft){
					var setLeft = $wrapperLeft - activeLeft + $buttonWidth;
					$wrapper.animate({scrollLeft: '-=' + setLeft });			
					$(this).parents('.dc-tabs').find('.scroller-right').fadeIn('slow');
				}
				if (activeLeft < cuttRight && activeRight > cuttRight) {
					var setRight = activeRight - $wrapperRight + $buttonWidth;
					$wrapper.animate({scrollLeft: '+=' + setRight });
					$(this).parents('.dc-tabs').find('.scroller-left').fadeIn('slow');
				}
			});
		});
	};
}(jQuery));