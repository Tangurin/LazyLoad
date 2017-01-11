(function () {
    'use strict';
    /*===========================
    LazyLoad
    ===========================*/
    var LazyLoad = {
        initialized: false,
        elements: [],
        elementLength: 0,
        offset: -100,
        offsets: [],
        windowHeight: 0,
        windowInnerHeight: 0,
        options: {},
        debugMode: true,
        onLoadCallback: null,
        initialize: function(onLoadCallback) {
            LazyLoad.onLoadCallback = onLoadCallback;
            if (LazyLoad.initialized) {
                LazyLoad.runOnLoadCallback(onLoadCallback);
                return true;
            }

            LazyLoad.initialized = true;

            //Let content load before loading elements
            setTimeout(function() {
                var $elements = $('img[data-lazyLoad], .lazyLoadWrapper');
                if ($elements.length > 0) {
                    var elements = [];
                    $elements.each(function() {
                        var $element = $(this);
                        if ($element.parents('.lazyLoadWrapper').length > 0) {
                            return true;
                        }
                        $element.options = {
                            removeWhenVisible: true,
                            removeWhenAlreadyVisible: true,
                            extraOffset: -100,
                            callbacks: {
                                afterVisible: function($element) {
                                    LazyLoad.handleElement($element);
                                },
                                alreadyVisible: function($element) {
                                    LazyLoad.handleElement($element);
                                }
                            }
                        };
                        elements.push($element);
                    });
                    ScrollCollisionHandler.initialize(elements);
                }
            }, 400)
            LazyLoad.runOnLoadCallback(onLoadCallback);
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
            if (LazyLoad.debugMode) {
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
