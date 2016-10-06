var LazyLoad = {
    elements: [],
    elementLength: 0,
    offset: -100,
    offsets: [],
    scrollElement: null,
    windowHeight: 0,
    windowInnerHeight: 0,
    debug: true,
    options: {},
    initialize: function(scrollElement) {
        var $window = $(window);
        LazyLoad.windowHeight = $window.height();
        LazyLoad.windowInnerHeight = $window.innerHeight();
        LazyLoad.scrollElement = scrollElement || $window;

        LazyLoad.options = {
            opacity: 1,
            top: 0,
            scale: 1,
            rotate: 0,
        };

        //Let content load before loading elements
        setTimeout(LazyLoad.initializeElements, 400)
    },
    initializeElements: function() {
        if (!LazyLoad.setElements()) return false;
        LazyLoad.listenForScroll();
    },
    setElements: function() {
        var $elements = $('img[data-lazyLoad], .lazyLoadWrapper');
        var elementLength = $elements.length;
        if (elementLength > 0) {
            LazyLoad.elementLength = elementLength;
            var $element;
            var visible;
            for (var i = 0; i < elementLength; i++) {
                $element = $($elements[i]);
                visible = LazyLoad.isVisible($element);

                if (visible) {
                    LazyLoad.loadElement($element);
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
        ScrollHandler.initialize(AnimateOnScroll.scrollElement);
        console.log(ScrollHandler);
        var offsets = LazyLoad.offsets;
        LazyLoad.scrollElement.on('ScrollHandler-Scroll', function() {
            console.log('a');
            var $this = $(this);
            var currentScroll = $this.scrollTop();
            var collision = currentScroll + LazyLoad.windowHeight;
            var $element;
            var offset = 0;
            for (i = 0; i < LazyLoad.elementLength; i++) {
                offset = LazyLoad.offsets[i];
                if (collision > offset) {
                    loadElement(LazyLoad.elements[i]);
                    delete LazyLoad.elements[i];
                    delete LazyLoad.offsets[i];
                }
            }
        });
    },
    handleElement: function($element) {
        console.log($element);
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
        var imageName = $element.data('image') || false;
        if ($element.prop('tagName') != 'IMG' || imageName == false) {
            return false;
        }

        $element.attr('src', imageName);
    },
    debug: function(str) {
        if (LazyLoad.debug) {
            console.log(str);
        }
    }
};

$(function() {
    LazyLoad.initialize($('#slidebarMainContent'));
});
