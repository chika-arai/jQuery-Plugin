/*--------------------------------------------------------------------
 * jQuery Plugin: jToggle
 *
 * Copyright (c) 2012 Chika Arai
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.1
 *
 * $('.toggle').jToggle();
 *
--------------------------------------------------------------------*/

(function($){

	// Rollover
	$('img').filter('.rollover').each(function(){
		$('<img />').attr('src', this.src.replace(/\.(gif|png|jpg)/, '_on.$1') );
	}).hover(function(){
		this.src = this.src.replace(/\.(gif|png|jpg)/, '_on.$1');
	}, function(){
		this.src = this.src.replace(/\_on.(gif|png|jpg)/, '.$1');
	});

	$.fn.jToggle = function(setting) {
		var setting = $.extend({
			trigger: '.toggler',
			contents: '.toggleContents'
		}, setting);
		return this.each(function() {
			var _this = $(this);
			var trigger = _this.find(setting.trigger);
			var defaultText = (trigger.get(0).tagName == 'A') ? trigger.text() : null;
			_this.find('.toggleContents').not('.open').hide();
			if(_this.find('.toggleContents.open').length && defaultText != null){
				trigger.text('閉じる').parents('.more').addClass('open');
			}
			trigger.click(function(){
				$(this).parents('.toggle').find('.toggleContents').slideToggle();
				if ($(this).hasClass('toggleOneTime') ) {
					$(this).parents('.more').hide();
				} else if(defaultText != null) {
					$(this).text( $(this).text() == defaultText ? '閉じる' : defaultText).parents('.more').toggleClass('open');
				}
				return false;
			});
		});
	}
})(jQuery);
