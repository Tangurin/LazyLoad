var Lazyload = {
    elements: [],
    elementLength: 0,
    offsets: [],
    scrollElement: null,
    windowHeight: 0,
    windowInnerHeight: 0,
    zindex: 0,
    debug: true,
    options: {},
    initialize: function(scrollElement) {
        var $window = $(window);
        Lazyload.windowHeight = $window.height();
        Lazyload.windowInnerHeight = $window.innerHeight();
        Lazyload.scrollElement = scrollElement || $window;

        Lazyload.options = {
            opacity: 1,
            top: 0,
            scale: 1,
            rotate: 0,
        };

        //Let content load before loading elements
        setTimeout(Lazyload.initializeElements, 400)
    },
    initializeElements: function() {
        if (!Lazyload.setElements()) return false;
        Lazyload.listenForScroll();
    },
    setElements: function() {
        var $elements = $('.animateOnScroll');
        var elementLength = $elements.length;
        if (elementLength > 0) {
            Lazyload.elementLength = elementLength;
            var $element;
            var visible;
            for (var i = 0; i < elementLength; i++) {
                $element = $($elements[i]);
                visible = Lazyload.isVisible($element);

                if (!visible) {
                    var topOffset = $element.offset().top;
                    var elementOffset = $element.data('offset') || 0;
                    Lazyload.elements[i] = $element;
                    Lazyload.offsets[i] = topOffset + elementOffset;
                }
            }
            return true;
        }
        return false;
    },
    isVisible: function($element) {
      var rect = $element[0].getBoundingClientRect();
      var viewHeight = Math.max(Lazyload.windowHeight, Lazyload.windowInnerHeight);
      var isVisible = !(rect.bottom < 0 || rect.top - viewHeight >= 0);
      return isVisible;
    },
    listenForScroll: function() {
        ScrollHandler.initialize(AnimateOnScroll.scrollElement);
        
        var offsets = Lazyload.offsets;
        Lazyload.scrollElement.on('scroll', function() {
            var $this = $(this);
            var currentScroll = $this.scrollTop();
            var collision = currentScroll + Lazyload.windowHeight;
            var $element;
            var offset = 0;
            for (i = 0; i < Lazyload.elementLength; i++) {
                offset = Lazyload.offsets[i];
                if (collision > offset) {

                    delete Lazyload.elements[i];
                    delete Lazyload.offsets[i];
                }
            }
        });
    },
    debug: function(str) {
        if (Lazyload.debug) {
            console.log(str);
        }
    }
};

$(function() {
    Lazyload.initialize($('#slidebarMainContent'));
});
