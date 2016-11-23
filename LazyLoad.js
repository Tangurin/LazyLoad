(function () {
    'use strict';
    /*===========================
    LazyLoad
    ===========================*/
    var LazyLoad = {
        active: false,
        elements: [],
        elementLength: 0,
        offset: -100,
        offsets: [],
        windowHeight: 0,
        windowInnerHeight: 0,
        options: {},
        debug: true,
        onLoadCallback: null,
        initialize: function(onLoadCallback) {
            LazyLoad.onLoadCallback = onLoadCallback;
            if (LazyLoad.active) {
                LazyLoad.runOnLoadCallback(onLoadCallback);
                return true;
            }
            var $window = $(window);
            LazyLoad.windowHeight = $window.height();
            LazyLoad.windowInnerHeight = $window.innerHeight();

            //Let content load before loading elements
            setTimeout(LazyLoad.initializeElements, 400)
            LazyLoad.active = true;
        },
        initializeElements: function() {
            if (LazyLoad.setElements()) {
                LazyLoad.listenForScroll();
            }
            LazyLoad.runOnLoadCallback();
            return false;
        },
        setElements: function() {
            var $elements = $('img[data-lazyLoad], .lazyLoadWrapper');
            var elementLength = $elements.length;
            if (elementLength > 0) {
                var $element;
                var visible;
                for (var i = 0; i < elementLength; i++) {
                    $element = $($elements[i]);
                    visible = LazyLoad.isVisible($element);

                    if (visible) {
                        LazyLoad.handleElement($element);
                        continue;
                    }
                    LazyLoad.elements[i] = $element;
                    LazyLoad.offsets[i] = $element.offset().top + LazyLoad.offset;
                }
                return true;
            }
            return false;
        },
        isVisible: function($element) {
          var rect = $element[0].getBoundingClientRect();
          var viewHeight = Math.max(LazyLoad.windowHeight, LazyLoad.windowInnerHeight);
          var isVisible = !(rect.bottom < 0 || rect.top - viewHeight >= 0);
          return isVisible;
        },
        listenForScroll: function() {
            var elementLength = LazyLoad.offsets.length;
            ScrollHandler.onScroll(function($this) {
                var currentScroll = $this.scrollTop();
                var collision = currentScroll + LazyLoad.windowHeight;
                var $element;
                var offset = 0;
                for (i = 0; i < elementLength; i++) {
                    offset = LazyLoad.offsets[i];
                    if (collision > offset) {
                        LazyLoad.loadElement(LazyLoad.elements[i]);
                        delete LazyLoad.elements[i];
                        delete LazyLoad.offsets[i];
                    }
                }
            });
        },
        handleElement: function($element) {
            if ($element.hasClass('lazyLoadWrapper')) {
                var $images = $('img', $element);
                $.each($images, function(key) {
                    LazyLoad.loadElement($(this));
                });
                return true;
            }

            LazyLoad.loadElement($element);
        },
        loadElement: function($element) {
            var path = $element.data('lazyload') || false;
            if ($element.prop('tagName') != 'IMG' || path == false || $element.hasClass('imageLoaded')) {
                return false;
            }

            $element.attr('src', path).addClass('imageLoaded');
        },
        runOnLoadCallback: function(callback) {
            var callback = typeof callback == 'function' ? callback : LazyLoad.onLoadCallback;
            if (typeof callback == 'function') {
                callback();
            }
        },
        debug: function(str) {
            if (LazyLoad.debug) {
                console.log(str);
            }
        }
    };
    window.LazyLoad = LazyLoad;
})();

/*===========================
LazyLoad AMD Export
===========================*/
if (typeof(module) !== 'undefined')
{
    module.exports = window.LazyLoad;
}
else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.LazyLoad;
    });
}
