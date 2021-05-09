jQuery(window).load(function() {
    if(jQuery('.gkMainMenu').length > 0) {
        // fix for the iOS devices     
        jQuery('.gkMainMenu ul li span').each(function(i, el) {
            el.attr('onmouseover', '');
        });

        jQuery('#gkExtraMenu ul li a').each(function(i, el) {
            el = jQuery(el);
            el.attr('onmouseover', '');
            
            if(el.parent().hasClass('haschild') && jQuery('body').attr('data-tablet') !== undefined) {
                el.click(function(e) {
                    if(el.attr("dblclick") === undefined) {
                        e.preventDefault();
                        e.stopPropagation();
                        el.attr("dblclick", new Date().getTime());
                    } else {
                        if(el.parent().find('div.childcontent').eq(0).css('overflow') === 'visible') {
                            window.location = el.attr('href');
                        }
                        var now = new Date().getTime();
                        if(now - el.attr("dblclick", 0) < 500) {
                            window.location = el.attr('href');
                        } else {
                           e.preventDefault();
                           e.stopPropagation();
                           el.attr("dblclick", new Date().getTime());
                        }
                    }
                });
            }
        });

        var bases = jQuery('.gkMainMenu');
		
		bases.each(function(j, base) {
			base = jQuery(base);
	        base.find('.childcontent-inner').each(function(i, submenu) {
	            var cols = jQuery(submenu).children('.gkcol');
	            
	            if(cols.length > 1) {
	                var max = jQuery(cols[0]).outerHeight();
	                
	                for(i = 0; i < cols.length; i++) {
	                    max = jQuery(cols[i]).outerHeight() > max ? jQuery(cols[i]).outerHeight() : max;
	                }
	                
	                cols.css('height', max + "px");
	            }
	        });
	        
	        if($GKMenu && ($GKMenu.height || $GKMenu.width)) {    
	            base.find('li.haschild').each(function(i, el){   
	                el = jQuery(el);  
	                if(el.children('.childcontent').length > 0) {
	                    var content = el.children('.childcontent').first();
	                    var prevh = content.outerHeight();
	                    var prevw = content.outerWidth();
	                    var duration = $GKMenu.duration;
	                    var heightAnim = $GKMenu.height;
	                   
	                    var widthAnim = $GKMenu.width;
	                    
	                    // hide the menu till opened
	                    if(content.parent().parent().hasClass('level0')) {
	                        content.css('margin-left', "-999px");
	                    }
	    
	                    var fxStart = { 
	                        'height' : heightAnim ? 0 : prevh, 
	                        'width' : widthAnim ? 0 : prevw, 
	                        'opacity' : 0 
	                    };
	                    var fxEnd = { 
	                        'height' : prevh, 
	                        'width' : prevw, 
	                        'opacity' : 1 
	                    };  
	                    
	                    
	                    content.css(fxStart);
	                    content.css({'left' : 'auto', 'overflow' : 'hidden' });
	                    //                      
	                    el.mouseenter(function() {                    
	                        var content = el.children('.childcontent').first();
	                        var basicMargin = 0;
	                        content.css('display', 'block');
	                        content.addClass('active');
	                    
	                        var pos = content.offset();
	                        var winWidth = jQuery(window).outerWidth();
	                        var winScroll = jQuery(window).scrollLeft();
	                        
	                        // calculations
	                        var posStart = pos.left;
	                        var posEnd = pos.left + prevw;
	                        var diff;
	
	                        if(el.parent().hasClass('level0')) {
	                            content.css('margin-left', basicMargin + "px");
	                            pos = content.offset();
	                            posStart = pos.left;
	                            posEnd = pos.left + prevw;
	                            
	                            if(posStart < 0) {
	                                content.css('margin-left', content.css('margin-left').toInt() + (-1 * posStart) + 10);
	                            }
	                            
	                            if(posEnd > winWidth + winScroll) {
	                                diff = (winWidth + winScroll) - posEnd;
	                                content.css('margin-left', content.css('margin-left').toInt() + diff - 24);
	                            }
	                        } else {
	                            diff = (winWidth + winScroll) - posEnd;
	                            
	                            if(posEnd > winWidth + winScroll) {
	                                content.css('margin-left', "-160px");
	                            }
	                        }
	                        //
	                        content.stop().animate(
			                    fxEnd, 
			                    {
				                    "duration": duration, 
				                    "queue": false,
				                    "complete": function() { 
							                        if(content.outerHeight() === 0){ 
							                            content.css('overflow', 'hidden'); 
							                        } else if(
							                            content.outerHeight(true) - prevh < 30 && 
							                            content.outerHeight(true) - prevh >= 0
							                        ) {
							                            content.css('overflow', 'visible');
							                        }
							                    }
			                    }
			                );
	                    });
	                el.mouseleave(function(){
	                
	                        content.css({
	                            'overflow': 'hidden'
	                        });
	                        //
	                        content.removeClass('active');
	                        content.stop().animate(
		                    fxStart, 
		                    {
		                        "duration": duration, 
		                        "queue": false,
		                        "complete": function() { 
						                        if(content.outerHeight() === 0){ 
						                            content.css('overflow', 'hidden'); 
						                        } else if(
						                            content.outerHeight(true) - prevh < 30 && 
						                            content.outerHeight(true) - prevh >= 0
						                        ) {
						                            content.css('overflow', 'visible');
						                        }
						                        content.removeClass('active');
						                        content.css('display', 'none');
						                    }
						    }
		                );
	                    });
	                }
	            });    
	        }
	    });
    }
    // Aside menu
    if(jQuery('#aside-menu').length > 0) {
        var staticToggler = jQuery('#static-aside-menu-toggler');
        
        staticToggler.click(function() {
            gkOpenAsideMenu();
        });
        
        jQuery('#close-menu').click( function() {
            jQuery('#close-menu').toggleClass('menu-open');
            jQuery('#gkBg').toggleClass('menu-open');
            jQuery('#gkHeaderNav').toggleClass('menu-open');
            jQuery('#aside-menu').toggleClass('menu-open');
        });
        
        jQuery('#aside-menu').find('a[href^="#"]').click(function() {
        	jQuery('#close-menu').trigger('click');
        });
    }
    // detect android browser
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1 && !window.chrome;
    if(isAndroid) {
        jQuery('body').addClass('android-stock-browser');
    }
    // Android stock browser fix for the aside menu
    if(jQuery('body').hasClass('android-stock-browser') && jQuery('#aside-menu').length > 0) {
        // menu dimensions
        var asideMenu = jQuery('#aside-menu');
        var menuHeight = jQuery('#aside-menu').height();
        
        jQuery('#static-aside-menu-toggler').click( function() {
           asideMenu.css('position', 'absolute');
           asideMenu.css('top', jQuery(window).scrollTop());
        });
        
        //
        /*jQuery(window).scroll( function(e) {
            if(asideMenu.hasClass('menu-open')) {
                // get the necessary values and positions
                var currentPosition = jQuery(window).scrollTop();
                var windowHeight = jQuery(window).height();

                // compare the values
                if(currentPosition > menuHeight - windowHeight) {
                    jQuery('#close-menu').trigger('click');
                }
            }
        });*/
    }
    
    function gkOpenAsideMenu() {
        jQuery('#gkBg').toggleClass('menu-open');
        jQuery('#aside-menu').toggleClass('menu-open');
        jQuery('#gkHeaderNav').toggleClass('menu-open');
    
        if(!jQuery('#close-menu').hasClass('menu-open')) {
            setTimeout(function() {
                jQuery('#close-menu').toggleClass('menu-open');
            }, 300);
        } else {
            jQuery('#close-menu').removeClass('menu-open');
        }
    }
}); 