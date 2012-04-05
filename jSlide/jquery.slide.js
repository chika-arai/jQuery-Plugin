/*--------------------------------------------------------------------
 * jQuery Plugin: jSlider
 *
 * Copyright (c) 2012 Chika Arai
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.1
 *
 * $('.hoge').jSlider(num, element);
 *
--------------------------------------------------------------------*/

(function($){
	$.fn.jSlider = function(options) {
		var defaults={
			ajaxError   : '<p class="error">XMLファイルの読み込みに失敗しました。</p>',
			autoplay    : true,
			borderWidth : null,
			contentClass: 'main',
			navigater   : true,
			navClass    : 'slideShowPager',
			rollover    : true,
			time        : 3000,
			xmlPath     : null
		};
		var settings = $.extend({}, defaults, options);

		if(!settings.xmlPath) {
			alert('XMLファイルが設定されていません。');
			return;
		}

		return this.each(function() {
			var _this = $(this);
			var nav, timer, current = 0, next = 1, thisLength = 0;

			$.ajax({
				url: settings.xmlPath,
				type: 'GET',
				dataType: 'xml',
				timeout: 300000,
				error: function(){
					_this.html(settings.ajaxError);
				},
				success: function(xml){
					settings.design = $(xml).find('design').text();
					var imageWidth = $(xml).find('width').text();
					var imageHeight = $(xml).find('height').text();
					var imageInnerHeight, imageInnerHeight;

					if(settings.design == 'pink' || settings.design == 'gray') {
						imageInnerWidth = imageWidth-2;
						imageInnerHeight = imageHeight-2;
					} else if(settings.design == 'green'){
						imageInnerWidth = imageWidth-8;
						imageInnerHeight = imageHeight-8;
					} else if(settings.borderWidth){
						imageInnerWidth = imageWidth- (settings.borderWidth*2);
						imageInnerHeight = imageHeight- (settings.borderWidth*2);
					} else {
						imageInnerWidth = imageWidth;
						imageInnerHeight = imageHeight;
					}

					// Main Images
					var html ='<ul class="main">';
					$(xml).find('image').each(function(i){

						var __this = $(this);
						var linkUrl, linkTarget;
						if(__this.find('resource').text()) {
							linkUrl = __this.find('link').text();
							linkTarget = __this.find("linkTarget").text()
							html += (i == 0) ? '<li class="current">': '<li>';
							if(linkUrl) {
								if(linkTarget == 'blank' || linkTarget == '_blank') {
									html += '<a href="' + linkUrl + '" target="' + linkTarget + '">';
								} else {
									html += '<a href="' + linkUrl + '">';
								}
								html += '<img src="' + __this.find("resource").text() + '" alt="" />';
								html += '</a>';
							} else {
								html += '<img src="' + __this.find("resource").text() + '" alt="" />';
							}
							html += '</li>';
							thisLength++;
						}

					});
					html += '</ul><div class="' + settings.design +'" style="width:' + imageInnerWidth + 'px; height:' + imageInnerHeight + 'px;"><span class="slideTL"></span><span class="slideTR"></span><span class="slideBL"></span><span class="slideBR"></span></div>';
					_this.prepend(html).css({
						width: imageWidth
						, height: imageHeight
					});
					divLink(_this, settings, _this.children('.main').children('li:first'));

					timer = setInterval(function(){ Rotate(_this, settings) }, settings.time);

					_this.hover(function(){
						clearInterval(timer);
					}, function(){
						timer = setInterval(function(){ Rotate(_this, settings) }, settings.time);
					});

					// Pager
					if(settings.navigater) {
						if(typeof(settings.navigater) == 'boolean' ){
							var navigaterHtml = '<ul class="' + settings.navClass + '">';
							for(var j=0; j < thisLength; j++) {
								if(j == 0) {
									navigaterHtml += '<li class="current"><img src="/shared/img/nav_pager_current.png" alt="" width="10" height="10" /></li>';
								} else {
									navigaterHtml += '<li><img src="/shared/img/nav_pager.png" alt="" width="10" height="10" /></li>';
								}
							}
							navigaterHtml += '</ul>';
							_this.append(navigaterHtml);
						} else {
							settings.navClass = settings.navigater;
						}

						_this.find('.' + settings.navClass).find('li:has(img)')
						.click(function(){
							if(!$(this).hasClass('current')) {
								next = $(this).index();
								slideShow(_this, settings);
							}
						}).hover(function(){
							if(settings.rollover==true) {
								$(this).not('.current').children('img').attr('src', function(){
									this.src = this.src.replace(/\.(gif|jpg|png)/, '_on.$1');
								});
							}
						}, function(){
							if(settings.rollover==true) {
								$(this).children('img[src*=_on.]').attr('src', function(){
									this.src = this.src.replace(/_on\.(gif|jpg|png)/, '.$1');
								});
							}
						});
					}
				}
			});

			var Rotate = function (elm, opt) {
				if(thisLength == 1){
					clearInterval(timer);
					return false;
				} else {
					next = (current + 1 >=  thisLength) ? 0 : current + 1 ;
					slideShow(elm, opt);
				}
			};

			var slideShow = function (elm, opt) {
				if(settings.navigater) {
					// Pager
					elm.find('.' + settings.navClass).find('li.current').removeClass('current')
						.children('img').attr('src', function(){
							this.src = this.src.replace(/_current\.(png|gif|jpg)/, '.$1');
						});

					elm.find('.' + settings.navClass).find('li:eq(' + next + ')').addClass('current')
						.children('img').attr('src', function(){
							this.src = this.src.replace(/(_on|_current)?\.(png|gif|jpg)/, '_current.$2');
						});
				}
				// KeyVisual
				elm.find('.' + opt.contentClass + ' li:eq(' + current + ')').fadeOut(500);
				elm.find('.' + opt.contentClass + ' li:eq(' + next + ')').fadeIn(500, function(){
					current = next;
					divLink(elm, opt, $(this));
				});
			};

			var divLink = function (elm, opt, thisElm) {
				elm.find('.' + opt.design).removeClass('hasLink').unbind('click');
				if( thisElm.is(':has(a)') ){
					elm.find('.' + opt.design).addClass('hasLink').click(function(){
						if( thisElm.children('a').is('[target!=_blank]')){
							location.href = thisElm.children('a').attr('href');
						} else {
							window.open( thisElm.children('a').attr('href') );
						}
					});
				}
			};

		});
	}
})(jQuery);
