jQuery.noConflict();
// IE checker
function gkIsIE() {
	if (navigator.userAgent.match(/msie/i) ){ return true; }
	else { return false; }
}
// Google maps function
var gkMapInitialize = function() {
  var maps = jQuery('.gk-map');
  var mapCenters = [];
  var mapAreas = [];
  
  maps.each(function(i, map) {
  	map = jQuery(map);
	mapCenters[i] = new google.maps.LatLng(0.0, 0.0);
	  
	  
	if(map.data('latitude') !== undefined && map.data('longitude') !== undefined) {
		mapCenters[i] = new google.maps.LatLng(
			  		parseFloat(map.data('latitude')), 
			  		parseFloat(map.data('longitude'))
			  	);
	}
	  
	  
	  var mapOptions = {
	    zoom: parseInt(map.data('zoom'), 10) || 12,
	    center: mapCenters[i],
	    panControl: map.data('ui') === 'yes' ? true : false,
	    zoomControl: map.data('ui') === 'yes' ? true : false,
	    scaleControl: map.data('ui') === 'yes' ? true : false,
	    disableDefaultUI: map.data('ui') === 'yes' ? false : true,
	    mapTypeControl: map.data('ui') === 'yes' ? true : false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
        }
	  };
	
	  mapAreas[i] = new google.maps.Map(map.get(0), mapOptions);
	  var link = jQuery('<a>', { class: 'gk-map-close'});
	  link.insertAfter(map);
	  // custom events for the full-screen display
	  var marker = null;
	  map.on('displaybigmap', function() {
	  	marker = new google.maps.Marker({
	  	   position: mapCenters[i],
	  	   map: mapAreas[i],
	  	   animation: google.maps.Animation.DROP
	  	});
	  	
	  	setTimeout(function() {
	  		google.maps.event.trigger(mapAreas[i], 'resize');
	  	}, 300);
	  	
	  	mapAreas[i].setCenter(mapCenters[i]);
	  	
	  	if(map.data('line') !== undefined) {
	  		var points = map.data('line').split(';');
	  		var polyline = [];
	  		
	  		points = points.filter(function(x) { 
	  			return x != '';
	  		});
	  		
	  		jQuery.each(points, function(i, item) {
	  			var coords = item.split(',');
	  			polyline.push(new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1])));
	  		});
	  		
	  		if(points.length) {
	  			var path = new google.maps.Polyline({
	  				path: polyline,
	  				geodesic: true,
	  				strokeColor: '#ff0000',
	  				strokeOpacity: 1.0,
	  				strokeWeight: 2
	  			});
	  			
	  			path.setMap(mapAreas[i]);
	  		}
	  	}
	  });
	  
	  if(maps[i].hasClass('static')) {
	  	marker = new google.maps.Marker({
	  	   position: mapCenters[i],
	  	   map: mapAreas[i],
	  	   animation: google.maps.Animation.DROP
	  	});
	  }
	  
	  map.on('hidebigmap', function() {
	  	if(marker) {
	  		marker.setMap(null);
	  	}
	  });
  });
  
  jQuery(window).resize(function() {
  	mapAreas.each(function(map, i) {
  		map.setCenter(mapCenters[i]);
  	});
  });
};
//
var page_loaded = false;
//
jQuery(window).load(function() {
	//
	page_loaded = true;
	// smooth anchor scrolling
    if(jQuery(document.body).attr('data-smoothscroll') == '1') {
	    jQuery('a[href*="#"]').on('click', function (e) {
	        e.preventDefault();
	        if(this.hash !== '') {
	            var target = jQuery(this.hash);

	            if(this.hash !== '' && this.href.replace(this.hash, '') == window.location.href.replace(window.location.hash, '')) {    
	                if(target.length && this.hash !== '#') {
	                    jQuery('html, body').stop().animate({
	                        'scrollTop': target.offset().top
	                    }, 1000, 'swing', function () {
	                        if(this.hash !== '#') {
	                            window.location.hash = target.selector;
	                        }
	                    });
	                } else if(this.hash !== '' && this.href.replace(this.hash, '') !== '') {
	                    window.location.href = this.href;
	                }
	            } else if(this.hash !== '' && this.href.replace(this.hash, '') !== '') {
	                window.location.href = this.href;
	            }
	        }
	    });
	}
	// style area
	if(jQuery('#gkStyleArea').length > 0){
		jQuery('#gkStyleArea').find('a').each(function(i, element){
			jQuery(element).click(function(e){
				e.preventDefault();
				e.stopPropagation();
				changeStyle(i+1);
			});
		});
	}
	// K2 font-size switcher fix
	if(jQuery('#fontIncrease').length > 0 && jQuery('.itemIntroText').length > 0) {
		jQuery('#fontIncrease').click(function() {
			jQuery('.itemIntroText').attr('class', 'itemIntroText largerFontSize');
		});
		
		jQuery('#fontDecrease').click( function() {
			jQuery('.itemIntroText').attr('class', 'itemIntroText smallerFontSize');
		});
	}
	
// Google Maps loading
	var loadScript = function() {
		jQuery.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyApzvGEs5IknzSqv-NU2gfG7CynDX2qC_U&callback=gkMapInitialize")
		  .fail(function( jqxhr, settings, exception ) {
		   console.log('Google Maps script not loaded');
		});	

		
	};
	
	if(jQuery('.gk-map').length > 0) {
		loadScript();
	}

	// Locate effect
	var locate_buttons = jQuery('.gk-locate');
	
	locate_buttons.each(function(i, button) {
		button = jQuery(button);
		var wrapper = button.parents('.box');
		
		button.click(function(e) {
			e.preventDefault();
			
			wrapper.find('.header').addClass('hide');
			wrapper.find('.gk-over-map').addClass('hide');
			wrapper.addClass('hide');
			
			var map = wrapper.find('.gk-map');
			
			setTimeout(function() {
				var coordinates = map.offset();
				var scroll = jQuery(window).scrollTop();
				var window_size = window.getSize();
				var top_margin = (-1 * (coordinates.top - scroll));
				var bottom_margin = (-1 * (jQuery(window).height() - (coordinates.top + map.height() - scroll)));
				
				setTimeout(function() {
					map.css('z-index', '1000000');
					map.css({
						'height': jQuery(window).height() + "px",
						'margin-top': top_margin + "px",
						'margin-bottom': bottom_margin + "px"
					});
					
					map.trigger('displaybigmap');
					
					setTimeout(function() {
						var close_button = wrapper.find('.gk-map-close');
						close_button.addClass('active');
						
						if(!close_button.hasClass('has-events')) {
							close_button.click(function(e) {
								e.preventDefault();
								e.stopPropagation();
								map.css({
									'height': wrapper.outerHeight() + "px",
									'margin-top': "0px",
									'margin-bottom': "0px"
								});
								
								close_button.removeClass('active');
								
								setTimeout(function() {
									map.css('z-index', '0');
									map.trigger('hidebigmap');
									
									setTimeout(function() {
										wrapper.removeClass('hide');
									}, 50);
									
									setTimeout(function() {
										wrapper.find('.header').removeClass('hide');
										wrapper.find('.gk-over-map').removeClass('hide');
									}, 300);
								}, 300);
							});
							close_button.addClass('has-events');
						}
					}, 500);
				}, 500);
			}, 0);
		});
	});
	// Testimonials
	var testimonials = jQuery('.gk-testimonials');
	
	if(testimonials.length > 0) {
		testimonials.each(function(i, wrapper) {
			wrapper = jQuery(wrapper);
			var amount = wrapper.data('amount');
		
			var testimonial_prev = jQuery('<a>', { class: 'gk-testimonials-prev' });
			var testimonial_next = jQuery('<a>', { class: 'gk-testimonials-next' });
			var testimonial_pagination = jQuery('<ul>', { class: 'gk-testimonials-pagination' });
			
			var quotes = wrapper.find('blockquote');
			var current_page = 0;
			var sliding_wrapper = wrapper.find('div div');
			
			for(var j = 0; j < amount; j++) {
				var titem = '<li' + (j === 0 ? ' class="active"' : '') + '>' + (j+1) + '</li>';
				testimonial_pagination.html(testimonial_pagination.html() + titem);
			}
	
			testimonial_prev.appendTo(wrapper);
			testimonial_next.appendTo(wrapper);
			testimonial_pagination.appendTo(wrapper);
			var pages = testimonial_pagination.find('li');
			// hide quotes
			quotes.each(function(i, quote) {
				if(i > 0) {
					jQuery(quote).addClass('hidden');
				}
			});
			// navigation
			testimonial_prev.click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				quotes[current_page].addClass('hidden');
				current_page = (current_page > 0) ? current_page - 1 : pages.length - 1;
				quotes[current_page].removeClass('hidden');
				pages.removeClass('active');
				pages[current_page].addClass('active');
				sliding_wrapper.css('margin-left', -1 * (current_page * 100) + "%");
			});
			
			testimonial_next.click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				quotes[current_page].addClass('hidden');
				current_page = (current_page < pages.length - 1) ? current_page + 1 : 0;
				quotes[current_page].removeClass('hidden');
				pages.removeClass('active');
				pages[current_page].addClass('active');
				sliding_wrapper.css('margin-left', -1 * (current_page * 100) + "%");
			});
			
			pages.each(function(i, page) {
				page = jQuery(page);
				page.click(function() {
					quotes[current_page].addClass('hidden');
					current_page = i;
					quotes[current_page].removeClass('hidden');
					pages.removeClass('active');
					pages[current_page].addClass('active');
					sliding_wrapper.css('margin-left', -1 * (current_page * 100) + "%");	
				});
			});
		});
	}
	// Form validation
	var contact_forms = jQuery('.gkContactForm');
	var reservation_forms = jQuery('.gkReservationForm');
	
	var forms = [
					contact_forms,
					reservation_forms
				];
	
	if(contact_forms || reservation_forms) {
		forms.each(function(set, i) {
			set = jQuery(set);
			set.each(function(i, form) {
				form = jQuery(form);
				var inputs = form.find('.required');
				var submit = form.find('.submit');
				
				inputs.each(function(i, input) {
					input = jQuery(input);
					input.focus(function() {
						if(input.hasClass('invalid-input')) {
							input.removeClass('invalid-input');
						}
					});
				});
				
				submit.click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					
					var valid = true;
					
					inputs.each(function(i, input) {
						input = jQuery(input);
						if(input.val() === '') {
							valid = false;
							input.addClass('invalid-input');
						}
					});
					
					if(valid) {
						submit.parents('form').submit();
					}
				});
			});
		});
	}
	
	// Gallery popups
	var photos = jQuery('.gk-photo');
	
	if(photos.length > 0) {
		// photos collection
		var collection = [];
		// create overlay elements
		var overlay = jQuery('<div>', { class: 'gk-photo-overlay' });
		var overlay_prev = jQuery('<a>', { class: 'gk-photo-overlay-prev' });
		var overlay_next = jQuery('<a>', { class: 'gk-photo-overlay-next' });
		// put the element
		overlay.appendTo(jQuery('body'));
		// add events
		overlay.click(function() {
			var img = overlay.find('img');
			if(img) { img.remove(); }
			overlay.removeClass('active');
			overlay_prev.removeClass('active');
			overlay_next.removeClass('active');
			setTimeout(function() {
				overlay.css('display', 'none');
			}, 300);
		});
		// prepare links
		photos.each(function(j, photo) {
			photo = jQuery(photo);
			var link = photo.find('a');
			collection.push(link.attr('href'));
			link.click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				overlay.css('display', 'block');
				
				setTimeout(function() {
					overlay.addClass('active');
					
					setTimeout(function() {
						overlay_prev.addClass('active');
						overlay_next.addClass('active');
					}, 300);
					
					var img = jQuery('<img>', { class: 'loading' });
					img.load(function() {
						img.removeClass('loading');
					});
					img.attr('src', link.attr('href'));
					img.prependTo(overlay);
				}, 50);
			});
		});
		// if collection is bigger than one photo
		if(collection.length > 1) {
			overlay_prev.appendTo(overlay);
			overlay_next.appendTo(overlay);
			
			overlay_prev.click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				var img = overlay.find('img');
				if(!img.hasClass('loading')) {
					img.addClass('loading');
				}
				setTimeout(function() {
					var current_img = img.attr('src');
					var id = collection.indexOf(current_img);
					var new_img = collection[(id > 0) ? id - 1 : collection.length - 1];
					img.attr('src', new_img);
				}, 300);
			});
			
			overlay_next.click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				var img = overlay.find('img');
				if(!img.hasClass('loading')) {
					img.addClass('loading');
				}
				setTimeout(function() {
					var current_img = img.attr('src');
					var id = collection.indexOf(current_img);
					var new_img = collection[(id < collection.length - 1) ? id + 1 : 0];
					img.attr('src', new_img);
				}, 300);
			});
		}
	}
});

//
jQuery(document).ready(function() {
	if(jQuery('#gkHeaderNav').length > 0 && !jQuery('#gkHeaderNav').hasClass('active')) {		
		jQuery(window).scroll(function() {
			var currentPosition = jQuery(window).scrollTop();

			if(
				currentPosition >= jQuery('#gkHeader').height() && 
				!jQuery('#gkHeaderNav').hasClass('active')
			) {
				jQuery('#gkHeaderNav').addClass('active');
			} else if(
				currentPosition < jQuery('#gkHeader').height() && 
				jQuery('#gkHeaderNav').hasClass('active')
			) {
				jQuery('#gkHeaderNav').removeClass('active');
			}
		});
	}
	// Scroll effects 
	var frontpage_header = jQuery('#gkHeader');
	var frontpage_module = jQuery('#gkHeaderMod');
	
	if(
		jQuery('body').hasClass('frontpage') && 
		frontpage_header && 
		jQuery(window).width() > 720
	) {
		jQuery(window).scroll(function() {	
			var win_scroll = jQuery(window).scrollTop();
			var header_height = frontpage_header.height();
			
			if(win_scroll < header_height) {
				animate_header(win_scroll, header_height);	
			}
		});
		
		var animate_header = function(win_scroll, header_height) {
			var result = (win_scroll / header_height) * 0.75;
			frontpage_module.css('background', 'rgba(0, 0, 0, ' + (result) + ')');
		};
	}
});


// Function to change styles
function changeStyle(style){
	
	// cookie function
	jQuery.cookie = function (key, value, options) {
    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);
        if (value === null || value === undefined) {
            options.expires = -1;
        }
        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }
    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
	};

	var file1 = $GK_TMPL_URL+'/css/style'+style+'.css';
	var file2 = $GK_TMPL_URL+'/css/typography/typography.style'+style+'.css';
	jQuery('head').append('<link rel="stylesheet" href="'+file1+'" type="text/css" />');
	jQuery('head').append('<link rel="stylesheet" href="'+file2+'" type="text/css" />');

	jQuery.cookie('gk_steakhouse_j30_style', style, { expires: 365, path: '/' });
}
