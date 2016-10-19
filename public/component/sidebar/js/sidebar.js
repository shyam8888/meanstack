var overlay = $('.sidebar-overlay');
var sidebar = $('.sidebar');
var lsidebar = $('.sidebar-left');
var rsidebar = $('.sidebar-fixed-right');
var dcnavbarsidebar = $('.dc-navbar-sidebar');
var sidebar = $('.sidebar');
var sidebarHeader = $('#sidebar .sidebar-header');
var sidebarImg = sidebarHeader.css('background-image');
var toggleButtons = $('.sidebar-toggle');
var dctopbartoggle = $('.topbar-fixed');

$(document).ready(function() {

	// toggleButtons.css('display', 'none');

	// Left Sidebar
	$('.sidebar-toggle').on( 'touchstart click', function(e) {
		lsidebar.toggleClass('open');
			if ((lsidebar.hasClass('sidebar-fixed-left') || lsidebar.hasClass('sidebar-fixed-right')) && lsidebar.hasClass('open'
		)) {
		overlay.addClass('active');
			$('body').addClass("open-sidebar")
		} else {
			overlay.removeClass('active');
			$('body').removeClass("open-sidebar")
		}
	});

	$( ".sidebar .dropdown-menu, .dc-navbar-sidebar .dropdown-menu" ).click(function(event) {
        event.stopPropagation();
    });

	// Right Sidebar
	$('.sidebar-toggle-right').on( 'touchstart click', function(e) {
		rsidebar.toggleClass('open');
        if ((rsidebar.hasClass('sidebar-right')) && rsidebar.hasClass('open')) {
			overlay.addClass('active');
			$('body').addClass("open-sidebar")
        } else {
			overlay.removeClass('active');
			$('body').removeClass("open-sidebar")
		}
	});

	// Right Sidebar
	$('.dc-topbar-toggle').on( 'touchstart click', function(e) {
		dctopbartoggle.toggleClass('open');
    });

	$('.topbar-close').on('click', function() {
        dctopbartoggle.removeClass('open');
    });

	// Nave bar in Sidebar
    $('.navbar-sidebar-toggle').on('touchstart click', function(e) {
		dcnavbarsidebar.toggleClass('open');
        if ((dcnavbarsidebar.hasClass('dc-navbar-sidebar')) && dcnavbarsidebar.hasClass('open')) {
        	overlay.addClass('active');
			$('body').addClass("open-sidebar")
        } else {
        	overlay.removeClass('active');
			$('body').removeClass("open-sidebar")
		}
    });

	// Overlay
	overlay.on( 'touchstart click', function(e) {
    	$(this).removeClass('active');
    	$('.sidebar').removeClass('open');
		$('.dc-navbar-sidebar').removeClass('open');
		$('body').removeClass("open-sidebar")
		 event.stopPropagation();
	});

	$('.dc-navbar-sidebar .dropdown').on({
		"shown.bs.dropdown": function() { this.closable = false;},
		"click":             function() { this.closable = true; },
		"hide.bs.dropdown":  function() { return this.closable; }
	});


	// Window load browser resize position
	if($(window).width() < 1460){
		sidebar.removeClass('open sidebar-stacked');
		lsidebar.addClass('sidebar-fixed-left');
		rsidebar.addClass('sidebar-right');
		toggleButtons.css('display', 'inherit');
		$('body').removeClass("open-sidebar")
	}

});

// window resize position
$(window).resize(function(){
	if($(window).width() < 1460){
		sidebar.removeClass('open sidebar-stacked');
		lsidebar.addClass('sidebar-fixed-left');
		rsidebar.addClass('sidebar-right');
		toggleButtons.css('display', 'inherit');
		overlay.removeClass('active');
		$('body').removeClass("open-sidebar")
	} else{
		lsidebar.removeClass('sidebar-fixed-left').addClass('open sidebar-stacked');
		rsidebar.removeClass('sidebar-right');
		toggleButtons.css('display', 'none');
		overlay.removeClass('active');
		$('body').removeClass("open-sidebar")
	}
});

(function(removeClass){
	jQuery.fn.removeClass = function( value ) {
		if ( value && typeof value.test === "function" ) {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];
				if ( elem.nodeType === 1 && elem.className ) {
					var classNames = elem.className.split( /\s+/ );

					for ( var n = classNames.length; n--; ) {
						if ( value.test(classNames[n]) ) {
							classNames.splice(n, 1);
						}
					}
					elem.className = jQuery.trim( classNames.join(" ") );
				}
			}
		} else {
			removeClass.call(this, value);
		}
		return this;
	}
})(jQuery.fn.removeClass);
