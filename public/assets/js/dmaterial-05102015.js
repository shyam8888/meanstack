$( document ).ready(function() {
	// DMaterial form ------------------------------------------------------//
	// paper input
	$(".bar").remove();
	$(".paper-input .form-control").after('<span class="bar"></span>');
	// floating label
	$('.paper-input input.form-control').each(function () {
		if($(this).val() != ""){
			$(this).closest('.paper-input').addClass("floating-label-completed");
	  	}
	});
	// floating label animation
	$(".paper-input .form-control").focus(function(){
	  $(this).closest('.paper-input').addClass("floating-label-active floating-label-completed");
	});
	// remove floating label animation
	$(".paper-input .form-control").focusout(function(){
	  if($(this).val() === ""){
		$(this).closest('.paper-input').removeClass("floating-label-completed");
	  }
	  $(this).closest('.paper-input').removeClass("floating-label-active");
	});
	// custam check box
	$('.custom-checkbox input').after('<span class="dc-checkbox">&nbsp;</span>');
	
	// dropdown Animation elements ----------------------------------------------------//
	(function($) {
		$('.dropdown-menu').wrap( "<div class='dropdown-menu-container'></div>" );
		$('.dropdown-menu').before('<div class="dropdown-menu-bg"></div>');
		
		var dropdown = $('.dropdown');
		var dcdropdown = function() {
			if ( $(window).width() < 767) {
				// Add slidedown animation to dropdown
				
				dropdown.off('show.bs.dropdown');
				dropdown.on('show.bs.dropdown', function(e){
					var that = $(this).find('.dropdown-menu');
					var w = that.outerWidth();
					var h = that.outerHeight();
					var dcdmc = that.closest('.dropdown-menu-container');
					var dcdmbg = dcdmc.find('.dropdown-menu-bg');
					$dataSidebar = $(this).find('.dropdown-toggle').attr("data-sidebar");
					if ( $dataSidebar == 'true') {
						that.first().stop(true, true).slideDown(300);
						$(this).addClass('dcdropdown');
					} else {
					 // that.first().stop(true, true).show();
						dcdmc.css({'width':w + 'px', 'height':h + 'px'}, 200);
						dcdmc.find('.dropdown-menu-bg').css({'width':w + 'px', 'height':h + 'px'});
						that.css("clip","rect(0 "+w+"px "+h+"px 0)");
						if( that.hasClass('dropdown-menu-right')){
							dcdmbg.addClass('dropdown-menu-bg-right');
							dcdmc.css({"right":"0", "left":"auto"})
						} else if (that.hasClass('dropdown-menu-bottom-left')){
							dcdmbg.addClass('dropdown-menu-bg-bottom-left');
						} else if (that.hasClass('dropdown-menu-bottom-right')){
							dcdmbg.addClass('dropdown-menu-bg-bottom-right');
							dcdmc.css({"right":"0", "left":"auto"})
						} 
					}
				});
				
				// Add slideup animation to dropdown
				dropdown.off('hide.bs.dropdown');
				dropdown.on('hide.bs.dropdown', function(e){
					$dataSidebar = $(this).find('.dropdown-toggle').attr("data-sidebar");
					var that = $(this).find('.dropdown-menu');
					var w = that.outerWidth();
					var h = that.outerHeight();
					var dcdmc = that.closest('.dropdown-menu-container');
					var dcdmbg = dcdmc.find('.dropdown-menu-bg');
					if ($dataSidebar == 'true') {
						that.first().stop(true, true).slideUp(300);
					} else {
						that.css("clip","rect(0 0 0 0)");
						dcdmc.removeAttr('style');
						dcdmbg.removeAttr('style');
						if(that.hasClass('dropdown-menu-right')){
							that.css("clip","rect(0 "+w+"px 0 "+w+"px)");
						} else if (that.hasClass('dropdown-menu-bottom-right')){
							that.css("clip","rect(0 "+w+"px 0 "+w+"px)");
						} 
					}
				});
			} else {
				// Add slidedown animation to dropdown
				$('.dropdown-menu').removeAttr('style');
				dropdown.off('show.bs.dropdown');
				dropdown.on('show.bs.dropdown', function(e){
					$('.dropdown-menu').css({'clip':'rect(0 0 0 0)'});
					$dataSidebar = $(this).find('.dropdown-toggle').attr("data-sidebar");
					var hassidebar = $(this).closest('.sidebar').hasClass('sidebar');
					var that = $(this).find('.dropdown-menu');
					var w = that.outerWidth();
					var h = that.outerHeight();
					var dcdmc = that.closest('.dropdown-menu-container');
					var dcdmbg = dcdmc.find('.dropdown-menu-bg');
					if ( hassidebar ) {
						that.first().stop(true, true).slideDown();
					} else {
						dcdmc.css({'width':w + 'px', 'height':h + 'px'}, 200);
						dcdmbg.css({'width':w + 'px', 'height':h + 'px'});
						that.css("clip","rect(0 "+w+"px "+h+"px 0)");
						if( that.hasClass('dropdown-menu-right')){
							dcdmbg.addClass('dropdown-menu-bg-right');
							dcdmc.css({"right":"0", "left":"auto"})
						} else if (that.hasClass('dropdown-menu-bottom-left')){
							dcdmbg.addClass('dropdown-menu-bg-bottom-left');
						} else if (that.hasClass('dropdown-menu-bottom-right')){
							dcdmbg.addClass('dropdown-menu-bg-bottom-right');
							dcdmc.css({"right":"0", "left":"auto"})
						} 
					}
				});
				// Add slideup animation to dropdown
				dropdown.off('hide.bs.dropdown');
				dropdown.on('hide.bs.dropdown', function(e){
					$dataSidebar = $(this).find('.dropdown-toggle').attr("data-sidebar");
					var hassidebar = $(this).closest('.sidebar').hasClass('sidebar');
					var that = $(this).find('.dropdown-menu');
					var w = that.outerWidth();
					var h = that.outerHeight();
					var dcdmc = that.closest('.dropdown-menu-container');
					var dcdmbg = dcdmc.find('.dropdown-menu-bg');
					if (hassidebar) {
						that.first().stop(true, true).slideUp(300);
					} else {
						that.css("clip","rect(0 0 0 0)");
						dcdmc.removeAttr('style');
						dcdmbg.removeAttr('style');
						if(that.hasClass('dropdown-menu-right')){
							that.css("clip","rect(0 "+w+"px 0 "+w+"px)");
						} else if (that.hasClass('dropdown-menu-bottom-right')){
							that.css("clip","rect(0 "+w+"px 0 "+w+"px)");
						} 
					}
				});	
			}
		}
		dcdropdown();
		$(window).resize(function(){
			dcdropdown();
		});
	})(jQuery);
	
	
	// Ripple Effect -----------------------------------------------------------------//
	 $(".ripple-effect").on('mousedown touchstart', function(e) {
		var rippler = $(this);
		$('.ink').remove();
		// create .ink element if it doesn't exist
		if(rippler.find(".ink").length == 0) {
			rippler.append("<span class='ink'></span>");
		}
		var ink = rippler.find(".ink");
		// prevent quick double clicks
		ink.removeClass("animate");
		// set .ink diametr
		if(!ink.height() && !ink.width())
		{
			var d = Math.max(rippler.outerWidth(), rippler.outerHeight());
			ink.css({height: d, width: d});
		}
		// get click coordinates
		var x = e.pageX - rippler.offset().left - ink.width()/2;
		var y = e.pageY - rippler.offset().top - ink.height()/2;
		// set .ink position and add class .animate
		ink.css({
		  top: y+'px',
		  left:x+'px'
		}).addClass("animate");
		
		setTimeout(function(){ 
			ink.remove();
		}, 1500);
	})
	
	//-- Checkbox Ripple Effect --//
	$(".checkbox-ripple-effect").on('mousedown', function(e) {
		var rippler = $(this);
		$('.ink').remove();
		// create .ink element if it doesn't exist
		if(rippler.find(".ink").length == 0) {
			rippler.append('<span class="ink"></span>');
		}
		var ink = rippler.find(".ink");
		// prevent quick double clicks
		ink.removeClass("animate");
		// set .ink diametr
		if(!ink.height() && !ink.width())
		{
			var d = Math.max(rippler.outerWidth(), rippler.outerHeight());
			ink.css({height: 20, width: 20});
		}
		// get click coordinates
		var x = e.pageX - rippler.offset().left - ink.width()/2;
		var y = e.pageY - rippler.offset().top - ink.height()/2;
		// set .ink position and add class .animate
		ink.css({
		  top: y+'px',
		  left:x+'px'
		}).addClass("animate");
		setTimeout(function(){ 
			ink.remove();
		}, 1500);
	})
	
	//-- Radio Ripple Effect --//
	$(".radio-options").on('mousedown', function(e) {
		var rippler = $(this);
		$('.ink').remove();
		// create .ink element if it doesn't exist
		if(rippler.find(".ink").length == 0) {
			rippler.append('<span class="ink"></span>');
		}

		var ink = rippler.find(".ink");

		// prevent quick double clicks
		ink.removeClass("animate");

		// set .ink diametr
		if(!ink.height() && !ink.width())
		{
			var d = Math.max(rippler.outerWidth(), rippler.outerHeight());
			ink.css({height: 15, width: 15});
		}
		// get click coordinates
		var x = e.pageX - rippler.offset().left - ink.width()/2;
		var y = e.pageY - rippler.offset().top - ink.height()/2;

		// set .ink position and add class .animate
		ink.css({
		  top: y+'px',
		  left:x+'px'
		}).addClass("animate");
		setTimeout(function(){ 
			ink.remove();
		}, 1500);
	})
	
});