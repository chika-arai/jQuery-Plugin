/*
 * jQuery Plugin: jFixed
 *
 * Copyright (c) 2012 Chika Arai
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.1
 *
 * $('.hoge').jFixed();
 *
 */

(function($){
	$.fn.jFixed = function(options) {
		return this.each(function() {
			var _this = $(this);
			var rightFix = false;
			_this.width = ( $(window).width() == _this.width() ) ? _this.children().width() : _this.width();
			_this.css({
				position: 'absolute',
				bottom: 'auto',
				top: $(document).scrollTop() + $(window).height() - _this.height()
			});
			if(_this.css('right') != 'auto') {
				rightFix = true;
				_this.css({ 
					right: 'auto',
					left: $(window).width() - _this.width
				});
			}
			$(window).bind('resize scroll', function(){
				_this.css({
					top: $(document).scrollTop() + $(window).height() - _this.height()
				});
				if(rightFix){
					_this.css({ left: $(window).width() - _this.width });
				}
			});
		});
	}
})(jQuery);
