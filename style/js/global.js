$(document).ready(function(){

	/*------------------------------------*\
		FUNCTION ShowcaseHeightSet()
		Set '.showcase__stage-wrapper'
		height the same as
		'.showcase__stage--active'
		(which is positioned absolutely
		and doesn't fill wrapper)
	\*------------------------------------*/
	function ShowcaseHeightSet() {
		$(".showcase__stage-wrapper").css("height", $(".showcase__stage--active").height() );
	}






	/*------------------------------------*\
		Set hero and showcase heights
	\*------------------------------------*/
	if( $(".maxwidth1050").css("display") == "none" )
	{
		$(".content").css( "top", $(window).height() );
		$(".hero").css( "height", $(window).height() );
	}

	else
	{
		var HeroHeight = $(".hero__content").height() + $(".experience__hollow-arrow").height();
		$(".hero").css( "height", HeroHeight );
		$(".content").css( "top", 0 );
	}

	ShowcaseHeightSet();


	$(window).resize(function(event){
		if( $(".maxwidth1050").css("display") == "none" )
		{
			$(".content").css( "top", $(window).height() );
			$(".hero").css( "height", $(window).height() );
		}

		else
		{
			var HeroHeight = $(".hero__content").height() + $(".experience__hollow-arrow").height();
			$(".hero").css( "height", HeroHeight );
			$(".content").css( "top", 0 );
		}

		ShowcaseHeightSet();
	});

	window.addEventListener("orientationchange", function() {
		ShowcaseHeightSet();
	});






	/*------------------------------------*\
		Run showcase height function
		after image on active slide
		has loaded
	\*------------------------------------*/
	$(".showcase__stage--active img").one("load", function() {
		ShowcaseHeightSet();
	}).each(function() {
		if(this.complete) $(this).load();
	});






	/*------------------------------------*\
		Hamburger navigation in header
	\*------------------------------------*/
	$(".header__hamburger").click(function(event) {
		$(".header__navigation").fadeToggle(100);
		event.stopPropagation();
	});

	$(".header__navigation").click(function(event) {
		event.stopPropagation();
	});

	$("html, .header__navigation a").click(function(event) {
		$(".header__navigation").slideUp(100);
	});





	/*------------------------------------*\
		Smooth Scroll
	\*------------------------------------*/

	$(".js-smooth-scroll").click(function(event) {
		event.preventDefault();

		var ThisHref = $(this).attr("href");
		//var HeaderHeight = $(".header").height();

		$( ThisHref ).velocity("scroll", {
			duration: 1000,
			//offset: -HeaderHeight,
			easing: "ease",

			begin: function() {
				$(window).on("mousewheel", function(event) {
					return false;
				});
			},

			complete: function() {
				$(window).off("mousewheel");
			}
		});

		window.location.hash = ThisHref;
	});






	/*------------------------------------*\
		Portfolio Showcase
	\*------------------------------------*/
	//responsive slides set
	var slides_settings = {
		auto: false,              // Boolean: Animate automatically, true or false
		speed: 500,              // Integer: Speed of the transition, in milliseconds
		timeout: 8000,           // Integer: Time between slide transitions, in milliseconds
		pager: true,             // Boolean: Show pager, true or false
		nav: false,              // Boolean: Show navigation, true or false
		random: false,           // Boolean: Randomize the order of the slides, true or false
		pause: false,            // Boolean: Pause on hover, true or false
		pauseControls: true,     // Boolean: Pause when hovering controls, true or false
		prevText: " ",           // String: Text for the "previous" button
		nextText: " ",           // String: Text for the "next" button
		maxwidth: "",            // Integer: Max-width of the slideshow, in pixels
		navContainer: "",        // Selector: Where controls should be appended to, default is after the 'ul'
		manualControls: "",      // Selector: Declare custom pager navigation
		namespace: "rslides",    // String: Change the default namespace used
		before: function(){},    // Function: Before callback
		after: function(){}      // Function: After callback
	}
	
	$(".rslides").responsiveSlides(slides_settings);


	//thumb navigation
	$(".showcase__thumb").click(function(event) {

		if( $(this).hasClass("showcase__thumb--blank") || $(this).hasClass("showcase__thumb--active") ) {
			0;
		}

		else {
			var ProjectNumber = $(this).attr("data-project");

			//thumbnails
			$(".showcase__thumb").removeClass("showcase__thumb--active");
			$(".showcase__thumb[data-project='" + ProjectNumber + "']").addClass("showcase__thumb--active");

			//stage
			$(".showcase__stage").fadeOut(400).removeClass("showcase__stage--active");
			$(".showcase__stage[data-project='" + ProjectNumber + "']").fadeIn(400).addClass("showcase__stage--active");

			//details
			$(".showcase__point-details-full").css("display","none");
			$(".showcase__ellipsis, .showcase__readmore").css("display","inline");

		}

		//set showcase section height
		ShowcaseHeightSet();
	});





	/*------------------------------------*\
		Project details 'read more'
		and 'read less' buttons
	\*------------------------------------*/
	$(".showcase__readmore").click(function(event) {
		$(this).parent().parent().find(".showcase__point-details-full").css("display","inline");
		$(this).parent().find(".showcase__ellipsis").css("display","none");
		$(this).hide();

		//set height
		ShowcaseHeightSet();
	});

	$(".showcase__readless").click(function(event) {
		$(this).parent(".showcase__point-details-full").css("display","none");
		$(this).parent().parent().find(".showcase__ellipsis, .showcase__readmore").css("display","inline");

		//set height
		ShowcaseHeightSet();
	});






	/*------------------------------------*\
		Contact form AJAX script
		which communicates with
		contact_form.php
	\*------------------------------------*/
	$("#submit").on('click', function(e) {

		e.preventDefault();

		var proceed = true;

		if(proceed) //everything looks good! proceed...
		{
			//get input field values data to be sent to server
			post_data = {
				'name'      : String( $('#name').val() ),
				'email'     : String( $('#email').val() ),
				'content'  : String( $('#content').val() )
			};


			//Ajax post data to server
			$.post('email/send.php', post_data, function(response)
			{
 				//load json data from server and output message
				//it probably should be refactored a bit...
 				switch (response.type) {

 					case "error_message_content":

						$(".contact__response-ajax-text").hide();
						$(".contact__textarea-wrapper .contact__response-ajax-text").css("display","inline-block").text(response.text);

						$("#content, #name, #email").css("box-shadow","none");
						$("#content").css("border", "1.2px solid red");
						break;

 					case "error_sender_name":
						$(".contact__response-ajax-text").hide();
						$(".contact__input-wrapper--name .contact__response-ajax-text").css("display","inline-block").text(response.text);

						$("#content, #name, #email").css("box-shadow","none");
						$("#content").css("border", "0");
						$("#name").css("border", "1.2px solid red");
						break;

 					case "error_sender_email":
						$(".contact__response-ajax-text").hide();
						$(".contact__input-wrapper--email .contact__response-ajax-text").css("display","inline-block").text(response.text);

						$("#content, #name, #email").css("box-shadow","none");
						$("#email").css("border", "1.2px solid red");
						$("#content").css("border", "0");
						$("#name").css("border", "0");
						break;

					default:
						
						$("#email").css("border", "0");
						$(".contact__response-ajax-text").hide();
						$("#content, #name, #email").css("box-shadow","none");
						$(".contact__button-wrapper").removeClass("ghost-button");
						$(".contact__button-wrapper").addClass("contact__button-wrapper--sent");
						$(".contact__paper-plane-wrapper").addClass("contact__paper-plane-wrapper--takeoff");

						$(".contact__response-description--success").html(response.text);

						if(response.type == 'error')
						{
							$(".contact__response--error").delay(500).fadeIn(100);

						} else{
							
							$(".contact__form input, .contact__form textarea").val("");
							$(".contact__response--success").delay(500).fadeIn(100);
						}

						$("#submit").unbind('click');

				}

			}, 'json');

		}
	});






	/*------------------------------------*\
		Hat tip
	\*------------------------------------*/
	$(".header__title-wrapper").hover(function(event) {
		$(".hero__hat").toggleClass("hero__hat--tip");
	});

	$(".hero__title-small").hover(function(event) {
		$(".hero__hat").toggleClass("hero__hat--tip");
	});

});
