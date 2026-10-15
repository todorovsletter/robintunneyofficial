var $doc = $(document);

$doc.ready(function(){
    $modalLink = $(".modal-link");

    $modalLink.each(function(){
        var $target = $($(this).attr("href"));
        var $close = $target.find(".close");

        $(this).click(function(e){
            event.preventDefault();

            $target.stop(true, true).fadeIn(375, "linear", function(){
                $(this).addClass("open");
            });

            $close.click(function(e){
                event.preventDefault();
                $target.stop(true, true).removeClass("open").delay(750).fadeOut(375, "linear");
            });

            $target.click(function(e){
                if($(e.target).closest(".modal-wrapper").length === 0) {
                    $close.trigger("click");
                }
            });

            $doc.keydown(function(e){
                if(e.key === "Escape" || e.keyCode === 27){
                    if($target.hasClass("open")){
                        $close.trigger("click");
                    }
                }
            });
        });
    });

    var $formControl = $(".form-control");

    $formControl.each(function(){
        var $this = $(this);
        var $input = $this.find('input:not(label input), [type="submit"]');

        $input.focus(function(){
            $this.addClass("floating");
        }).blur(function(){
            if(!$(this).val()) {
                $this.removeClass("floating");
            }
        });

        function validateSignup() {
            var emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            var newsletterEmail = $("#email").val().trim();

            var validEmail = (newsletterEmail !== "" && emailRegEx.test(newsletterEmail));

            if(validEmail && $("#terms").is(":checked")) {
                $("#newsletterSubmit").removeAttr("disabled");
            } else {
                $("#newsletterSubmit").attr("disabled", "disabled");
            }
        }

        validateSignup();
        $("#email").on("focusout", validateSignup);
        $("#terms").on("change", validateSignup);
    });

    $("#signup form").on("submit", function(e){
        event.preventDefault();

        var $this = $(this);

        $.ajax({
            url: "https://formspree.io/f/xkjokbba",
            type: "POST",
            data: $this.serialize(),
            dataType: "json",
            headers: {
                "Accept": "application/json"
            },
            success: function() {
                $this.closest(".modal-content").html('<p id="thankYou">Check your email for details.</p>');
            },
            error: function() {
                $this.find("#errorMsg").remove();

                $this.append($("<p>", {
                    text: "It seems there was a problem. Please try again.",
                    attr: {
                        "id": "errorMsg"
                    },
                    css: {
                        "text-align": "center",
                        "color": "#840001"
                    }
                }));
            }
        });
    });

    if(location.hash === "#signup") {
        $modalLink.filter('[href="#signup"]').trigger("click");
    }

    $('.interior a:not(.modal-link)[href*="#"]').click(function(e){
        var $target = $($(this).attr("href"));

        event.preventDefault();

        $("html, body").animate({
            scrollTop: $target.offset().top - 20
        }, 375, "linear")
    })
})