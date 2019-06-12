jQuery(document).ready(function($) {
    function scrollToAbout(sectId) {
        $("html, body").animate({ scrollTop: $(sectId).offset().top }, "slow");
    }

    $("#link").click(function() {
        var sectName = "#about";
        scrollToAbout(sectName);
    });

    $("#abt").click(function() {
        var sectName = "#about";
        scrollToAbout(sectName);
    });
    $("#svc").click(function() {
        var sectName = "#services";
        scrollToAbout(sectName);
    });

    $("#ptf").click(function() {
        var sectName = "#portfolio";
        scrollToAbout(sectName);
    });
    $("#achv").click(function() {
        var sectName = "#achievements";
        scrollToAbout(sectName);
    });
    $("#home").click(function() {
        var sectName = "#sect";
        scrollToAbout(sectName);
    });

    $("#askFaran").click(function() {
        var sectName = "#sect";
        scrollToAbout(sectName);
    });

    //wow js animation
    // Animation section
    if ($(".wow").length) {
        var wow = new WOW({
            boxClass: "wow", // animated element css class (default is wow)
            animateClass: "animated", // animation css class (default is animated)
            offset: 0, // distance to the element when triggering the animation (default is 0)
            mobile: true, // trigger animations on mobile devices (default is true)
            live: true // act on asynchronously loaded content (default is true)
        });
        wow.init();
    }

    //set animation timing
    var animationDelay = 1000,
        //loading bar effect
        barAnimationDelay = 6000,
        barWaiting = barAnimationDelay - 5000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
        //letters effect
        lettersDelay = 100,
        //type effect
        typeLettersDelay = 300,
        selectionDuration = 100,
        typeAnimationDelay = selectionDuration + 1500,
        //clip effect
        revealDuration = 1200,
        revealAnimationDelay = 3000;

    initHeadline();

    function initHeadline() {
        //insert <i> element for each letter of a changing word
        singleLetters($(".cd-headline.letters").find("b"));
        //initialise headline animation
        animateHeadline($(".cd-headline"));
    }

    function singleLetters($words) {
        $words.each(function() {
            var word = $(this),
                letters = word.text().split(""),
                selected = word.hasClass("is-visible");
            for (var i in letters) {
                if (word.parents(".rotate-2").length > 0)
                    letters[i] = "<em>" + letters[i] + "</em>";
                letters[i] = selected ?
                    '<i class="in">' + letters[i] + "</i>" : "<i>" + letters[i] + "</i>";
            }
            var newLetters = letters.join("");
            word.html(newLetters).css("opacity", 1);
        });
    }

    function animateHeadline($headlines) {
        var duration = animationDelay;
        $headlines.each(function() {
            var headline = $(this);

            if (headline.hasClass("loading-bar")) {
                duration = barAnimationDelay;
                setTimeout(function() {
                    headline.find(".cd-words-wrapper").addClass("is-loading");
                }, barWaiting);
            } else if (headline.hasClass("clip")) {
                var spanWrapper = headline.find(".cd-words-wrapper"),
                    newWidth = spanWrapper.width() + 10;
                spanWrapper.css("width", newWidth);
            } else if (!headline.hasClass("type")) {
                //assign to .cd-words-wrapper the width of its longest word
                var words = headline.find(".cd-words-wrapper b"),
                    width = 0;
                words.each(function() {
                    var wordWidth = $(this).width();
                    if (wordWidth > width) width = wordWidth;
                });
                headline.find(".cd-words-wrapper").css("width", width);
            }

            //trigger animation
            setTimeout(function() {
                hideWord(headline.find(".is-visible").eq(0));
            }, duration);
        });
    }

    function hideWord($word) {
        var nextWord = takeNext($word);

        if ($word.parents(".cd-headline").hasClass("type")) {
            var parentSpan = $word.parent(".cd-words-wrapper");
            parentSpan.addClass("selected").removeClass("waiting");
            setTimeout(function() {
                parentSpan.removeClass("selected");
                $word
                    .removeClass("is-visible")
                    .addClass("is-hidden")
                    .children("i")
                    .removeClass("in")
                    .addClass("out");
            }, selectionDuration);
            setTimeout(function() {
                showWord(nextWord, typeLettersDelay);
            }, typeAnimationDelay);
        } else if ($word.parents(".cd-headline").hasClass("letters")) {
            var bool = $word.children("i").length >= nextWord.children("i").length ?
                true : false;
            hideLetter($word.find("i").eq(0), $word, bool, lettersDelay);
            showLetter(nextWord.find("i").eq(0), nextWord, bool, lettersDelay);
        } else if ($word.parents(".cd-headline").hasClass("clip")) {
            $word
                .parents(".cd-words-wrapper")
                .animate({ width: "2px" }, revealDuration, function() {
                    switchWord($word, nextWord);
                    showWord(nextWord);
                });
        } else if ($word.parents(".cd-headline").hasClass("loading-bar")) {
            $word.parents(".cd-words-wrapper").removeClass("is-loading");
            switchWord($word, nextWord);
            setTimeout(function() {
                hideWord(nextWord);
            }, barAnimationDelay);
            setTimeout(function() {
                $word.parents(".cd-words-wrapper").addClass("is-loading");
            }, barWaiting);
        } else {
            switchWord($word, nextWord);
            setTimeout(function() {
                hideWord(nextWord);
            }, animationDelay);
        }
    }

    function showWord($word, $duration) {
        if ($word.parents(".cd-headline").hasClass("type")) {
            showLetter($word.find("i").eq(0), $word, false, $duration);
            $word.addClass("is-visible").removeClass("is-hidden");
        } else if ($word.parents(".cd-headline").hasClass("clip")) {
            $word
                .parents(".cd-words-wrapper")
                .animate({ width: $word.width() + 10 }, revealDuration, function() {
                    setTimeout(function() {
                        hideWord($word);
                    }, revealAnimationDelay);
                });
        }
    }

    function hideLetter($letter, $word, $bool, $duration) {
        $letter.removeClass("in").addClass("out");

        if (!$letter.is(":last-child")) {
            setTimeout(function() {
                hideLetter($letter.next(), $word, $bool, $duration);
            }, $duration);
        } else if ($bool) {
            setTimeout(function() {
                hideWord(takeNext($word));
            }, animationDelay);
        }

        if ($letter.is(":last-child") && $("html").hasClass("no-csstransitions")) {
            var nextWord = takeNext($word);
            switchWord($word, nextWord);
        }
    }

    function showLetter($letter, $word, $bool, $duration) {
        $letter.addClass("in").removeClass("out");

        if (!$letter.is(":last-child")) {
            setTimeout(function() {
                showLetter($letter.next(), $word, $bool, $duration);
            }, $duration);
        } else {
            if ($word.parents(".cd-headline").hasClass("type")) {
                setTimeout(function() {
                    $word.parents(".cd-words-wrapper").addClass("waiting");
                }, 200);
            }
            if (!$bool) {
                setTimeout(function() {
                    hideWord($word);
                }, animationDelay);
            }
        }
    }

    function takeNext($word) {
        return !$word.is(":last-child") ?
            $word.next() :
            $word.parent().children().eq(0);
    }

    function takePrev($word) {
        return !$word.is(":first-child") ?
            $word.prev() :
            $word.parent().children().last();
    }

    function switchWord($oldWord, $newWord) {
        $oldWord.removeClass("is-visible").addClass("is-hidden");
        $newWord.removeClass("is-hidden").addClass("is-visible");
    }
});

$(window).on("scroll", function() {
    // Back to top
    if ($(this).scrollTop() > 150) {
        $(".back-top").fadeIn();
    } else {
        $(".back-top").fadeOut();
    }

    // Progress bar
    $(".single-progressbar").each(function() {
        var base = $(this);
        var windowHeight = $(window).height();
        var itemPos = base.offset().top;
        var scrollpos = $(window).scrollTop() + windowHeight - 100;
        if (itemPos <= scrollpos) {
            var auptcoun = base.find(".progress-bar").attr("aria-valuenow");
            base.find(".progress-bar").css({
                width: auptcoun + "%"
            });
            var str = base.find(".skill_per").text();
            var res = str.replace("%", "");
            if (res == 0) {
                $({
                    countNumber: 0
                }).animate({
                    countNumber: auptcoun
                }, {
                    duration: 1500,
                    easing: "linear",
                    step: function() {
                        base.find(".skill_per").text(Math.ceil(this.countNumber) + "%");
                    }
                });
            }
        }
    });
});

$(".navbar a").on("click", function() {
    $(".navbar").find(".active").removeClass("active");
    $(this).parent().addClass("active");
});


(function($) {
    "use strict";
    $.fn.sliderResponsive = function(settings) {

        var set = $.extend({
                slidePause: 5000,
                fadeSpeed: 800,
                autoPlay: "on",
                showArrows: "off",
                hideDots: "off",
                hoverZoom: "on",
                titleBarTop: "off"
            },
            settings
        );

        var $slider = $(this);
        var size = $slider.find("> div").length; //number of slides
        var position = 0; // current position of carousal
        var sliderIntervalID; // used to clear autoplay

        // Add a Dot for each slide
        $slider.append("<ul></ul>");
        $slider.find("> div").each(function() {
            $slider.find("> ul").append('<li></li>');
        });

        // Put .show on the first Slide
        $slider.find("div:first-of-type").addClass("show");

        // Put .showLi on the first dot
        $slider.find("li:first-of-type").addClass("showli")

        //fadeout all items except .show
        $slider.find("> div").not(".show").fadeOut();

        // If Autoplay is set to 'on' than start it
        if (set.autoPlay === "on") {
            startSlider();
        }

        // If showarrows is set to 'on' then don't hide them
        if (set.showArrows === "on") {
            $slider.addClass('showArrows');
        }

        // If hideDots is set to 'on' then hide them
        if (set.hideDots === "on") {
            $slider.addClass('hideDots');
        }

        // If hoverZoom is set to 'off' then stop it
        if (set.hoverZoom === "off") {
            $slider.addClass('hoverZoomOff');
        }

        // If titleBarTop is set to 'on' then move it up
        if (set.titleBarTop === "on") {
            $slider.addClass('titleBarTop');
        }

        // function to start auto play
        function startSlider() {
            sliderIntervalID = setInterval(function() {
                nextSlide();
            }, set.slidePause);
        }

        // on mouseover stop the autoplay
        $slider.mouseover(function() {
            if (set.autoPlay === "on") {
                clearInterval(sliderIntervalID);
            }
        });

        // on mouseout starts the autoplay
        $slider.mouseout(function() {
            if (set.autoPlay === "on") {
                startSlider();
            }
        });

        //on right arrow click
        $slider.find("> .right").click(nextSlide)

        //on left arrow click
        $slider.find("> .left").click(prevSlide);

        // Go to next slide
        function nextSlide() {
            position = $slider.find(".show").index() + 1;
            if (position > size - 1) position = 0;
            changeCarousel(position);
        }

        // Go to previous slide
        function prevSlide() {
            position = $slider.find(".show").index() - 1;
            if (position < 0) position = size - 1;
            changeCarousel(position);
        }

        //when user clicks slider button
        $slider.find(" > ul > li").click(function() {
            position = $(this).index();
            changeCarousel($(this).index());
        });

        //this changes the image and button selection
        function changeCarousel() {
            $slider.find(".show").removeClass("show").fadeOut();
            $slider
                .find("> div")
                .eq(position)
                .fadeIn(set.fadeSpeed)
                .addClass("show");
            // The Dots
            $slider.find("> ul").find(".showli").removeClass("showli");
            $slider.find("> ul > li").eq(position).addClass("showli");
        }

        return $slider;
    };
})(jQuery);



//////////////////////////////////////////////
// Activate each slider - change options
//////////////////////////////////////////////
$(document).ready(function() {

    $("#slider1").sliderResponsive({
        // Using default everything
        // slidePause: 5000,
        // fadeSpeed: 800,
        // autoPlay: "on",
        // showArrows: "off", 
        // hideDots: "off", 
        // hoverZoom: "on", 
        // titleBarTop: "off"
    });

    $("#slider2").sliderResponsive({
        fadeSpeed: 300,
        autoPlay: "off",
        showArrows: "on",
        hideDots: "on"
    });

    $("#slider3").sliderResponsive({
        hoverZoom: "off",
        hideDots: "on"
    });

});


// poster frame click event
$(document).on('click', '.js-videoPoster', function(ev) {
    ev.preventDefault();
    var $poster = $(this);
    var $wrapper = $poster.closest('.js-videoWrapper');
    videoPlay($wrapper);
});

// play the targeted video (and hide the poster frame)
function videoPlay($wrapper) {
    var $iframe = $wrapper.find('.js-videoIframe');
    var src = $iframe.data('src');
    // hide poster
    $wrapper.addClass('videoWrapperActive');
    // add iframe src in, starting the video
    $iframe.attr('src', src);
}

// stop the targeted/all videos (and re-instate the poster frames)
function videoStop($wrapper) {
    // if we're stopping all videos on page
    if (!$wrapper) {
        var $wrapper = $('.js-videoWrapper');
        var $iframe = $('.js-videoIframe');
        // if we're stopping a particular video
    } else {
        var $iframe = $wrapper.find('.js-videoIframe');
    }
    // reveal poster
    $wrapper.removeClass('videoWrapperActive');
    // remove youtube link, stopping the video from playing in the background
    $iframe.attr('src', '');
}

(function ($) {
    'use strict';
    var form = $('.contact__form'),
        message = $('.contact__msg'),
        form_data;
    // Success function
    function done_func(response) {
        message.fadeIn().removeClass('alert-danger').addClass('alert-success');
        message.text(response);
        setTimeout(function () {
            message.fadeOut();
        }, 2000);
        form.find('input:not([type="submit"]), textarea').val('');
    }
    // fail function
    function fail_func(data) {
        message.fadeIn().removeClass('alert-success').addClass('alert-success');
        message.text(data.responseText);
        setTimeout(function () {
            message.fadeOut();
        }, 2000);
    }
    
    form.submit(function (e) {
        e.preventDefault();
        form_data = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: form.attr('action'),
            data: form_data
        })
        .done(done_func)
        .fail(fail_func);
    });
    
})(jQuery);