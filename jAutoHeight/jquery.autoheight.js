/*
 * jQuery Plugin: jAutoHeight
 *
 * Copyright (c) 2012 Chika Arai
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 0.1
 *
 * $('.hoge').jAutoHeight({ column: 3 });
 * $('.hoge').jAutoHeight({ column: 2, resetHeight: false });
 *
 */

(function($){
	$.fn.jAutoHeight = function(options) {

		var defaults = {
			doneClass : 'adjust',
			column: null,
			resetHeight: true
		};

		var settings = $.extend({}, defaults, options);
		if(!settings.column) {
			alert('no column');
			return;
		} else if(typeof(settings.column) != 'number') {
			alert('not number');
			return;
		}

		return this.each(function() {
			var _this = $(this);
			var maxHeight = 0;

			if(settings.resetHeight) {
				_this.children().css({ height: 'auto' }).removeClass( settings.doneClass );
			}
			_this.children().each(function(){
				if( $(this).index() % settings.column == 0 ) {
					maxHeight = 0;
				}
				var thisHeight = parseInt( $(this).height() );
				if(thisHeight > maxHeight) {
					maxHeight = thisHeight;
				}
				this.maxHeight = maxHeight;
			})
			_this.children(':nth-child(' + settings.column + 'n), :last').each(function(){
				$(this).prevAll().andSelf().not('.' + settings.doneClass).css({ height: this.maxHeight }).addClass( settings.doneClass );
			});
		});
	}
})(jQuery);
