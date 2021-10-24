jQuery(document).ready(function(e) {
    jQuery("#sfsi_plus_floater").attr("data-top",jQuery(document).height());
});

function sfsiplus_showErrorSuc(s, i, e) {
    if ("error" == s) var t = "errorMsg"; else var t = "sucMsg";
    return SFSI(".tab" + e + ">." + t).html(i), SFSI(".tab" + e + ">." + t).show(), 
    SFSI(".tab" + e + ">." + t).effect("highlight", {}, 5e3), setTimeout(function() {
        SFSI("." + t).slideUp("slow");
    }, 5e3), !1;
}

function sfsiplus_beForeLoad() {
    SFSI(".loader-img").show(), SFSI(".save_button >a").html("Saving..."), SFSI(".save_button >a").css("pointer-events", "none");
}

function sfsi_plus_make_popBox() {
    var s = 0;
    SFSI(".plus_sfsi_sample_icons >li").each(function() {
        "none" != SFSI(this).css("display") && (s = 1);
    }), 0 == s ? SFSI(".sfsi_plus_Popinner").hide() :SFSI(".sfsi_plus_Popinner").show(), "" != SFSI('input[name="sfsi_plus_popup_text"]').val() ? (SFSI(".sfsi_plus_Popinner >h2").html(SFSI('input[name="sfsi_plus_popup_text"]').val()), 
    SFSI(".sfsi_plus_Popinner >h2").show()) :SFSI(".sfsi_plus_Popinner >h2").hide(), SFSI(".sfsi_plus_Popinner").css({
        "border-color":SFSI('input[name="sfsi_plus_popup_border_color"]').val(),
        "border-width":SFSI('input[name="sfsi_plus_popup_border_thickness"]').val(),
        "border-style":"solid"
    }), SFSI(".sfsi_plus_Popinner").css("background-color", SFSI('input[name="sfsi_plus_popup_background_color"]').val()), 
    SFSI(".sfsi_plus_Popinner h2").css("font-family", SFSI("#sfsi_plus_popup_font").val()), SFSI(".sfsi_plus_Popinner h2").css("font-style", SFSI("#sfsi_plus_popup_fontStyle").val()), 
    SFSI(".sfsi_plus_Popinner >h2").css("font-size", parseInt(SFSI('input[name="sfsi_plus_popup_fontSize"]').val())), 
    SFSI(".sfsi_plus_Popinner >h2").css("color", SFSI('input[name="sfsi_plus_popup_fontColor"]').val() + " !important"), 
    "yes" == SFSI('input[name="sfsi_plus_popup_border_shadow"]:checked').val() ? SFSI(".sfsi_plus_Popinner").css("box-shadow", "12px 30px 18px #CCCCCC") :SFSI(".sfsi_plus_Popinner").css("box-shadow", "none");
}

function sfsi_plus_stick_widget(s) {
    0 == sfsiplus_initTop.length && (SFSI(".sfsi_plus_widget").each(function(s) {
        sfsiplus_initTop[s] = SFSI(this).position().top;
    }), console.log(sfsiplus_initTop));
    var i = SFSI(window).scrollTop(), e = [], t = [];
    SFSI(".sfsi_plus_widget").each(function(s) {
        e[s] = SFSI(this).position().top, t[s] = SFSI(this);
    });
    var n = !1;
    for (var o in e) {
        var a = parseInt(o) + 1;
        e[o] < i && e[a] > i && a < e.length ? (SFSI(t[o]).css({
            position:"fixed",
            top:s
        }), SFSI(t[a]).css({
            position:"",
            top:sfsiplus_initTop[a]
        }), n = !0) :SFSI(t[o]).css({
            position:"",
            top:sfsiplus_initTop[o]
        });
    }
    if (!n) {
        var r = e.length - 1, c = -1;
        e.length > 1 && (c = e.length - 2), sfsiplus_initTop[r] < i ? (SFSI(t[r]).css({
            position:"fixed",
            top:s
        }), c >= 0 && SFSI(t[c]).css({
            position:"",
            top:sfsiplus_initTop[c]
        })) :(SFSI(t[r]).css({
            position:"",
            top:sfsiplus_initTop[r]
        }), c >= 0 && e[c] < i);
    }
}

function sfsi_plus_float_widget(s) {
    function iplus()
	{
        rplus = "Microsoft Internet Explorer" === navigator.appName ? aplus - document.documentElement.scrollTop :aplus - window.pageYOffset, 
        Math.abs(rplus) > 0 ? (window.removeEventListener("scroll", iplus), aplus -= rplus * oplus, SFSI("#sfsi_plus_floater").css({
            top:(aplus + t).toString() + "px"
        }), setTimeout(iplus, n)) :window.addEventListener("scroll", iplus, !1);
		
	}
    /*function eplus()
	{
		var documentheight = SFSI("#sfsi_plus_floater").attr("data-top");
		var fltrhght = parseInt(SFSI("#sfsi_plus_floater").height());
		var fltrtp = parseInt(SFSI("#sfsi_plus_floater").css("top"));
		if(parseInt(fltrhght)+parseInt(fltrtp) <=documentheight)
		{
			window.addEventListener("scroll", iplus, !1);
		}
		else
		{
			window.removeEventListener("scroll", iplus);
			SFSI("#sfsi_plus_floater").css("top",documentheight+"px");
		}
	}*/
	
	SFSI( window ).scroll(function() {
		var documentheight = SFSI("#sfsi_plus_floater").attr("data-top");
		var fltrhght = parseInt(SFSI("#sfsi_plus_floater").height());
		var fltrtp = parseInt(SFSI("#sfsi_plus_floater").css("top"));
		if(parseInt(fltrhght)+parseInt(fltrtp) <=documentheight)
		{
			window.addEventListener("scroll", iplus, !1);
		}
		else
		{
			window.removeEventListener("scroll", iplus);
			SFSI("#sfsi_plus_floater").css("top",documentheight+"px");
		}
	});
	
    if ("center" == s)
	{
		var t = ( jQuery(window).height() - SFSI("#sfsi_plus_floater").height() ) / 2;
	}
	else if ("bottom" == s)
	{
		var t = window.innerHeight - ( SFSI("#sfsi_plus_floater").height() + parseInt(SFSI('#sfsi_plus_floater').css('margin-bottom')));
	}
	else
	{
		var t = parseInt(s);
	}
    var n = 50, oplus = .1, aplus = 0, rplus = 0;
    //SFSI("#sfsi_plus_floater"), window.onscroll = eplus;
}

function sfsi_plus_shuffle() {
    var s = [];
    SFSI(".sfsi_plus_wicons ").each(function(i) {
        SFSI(this).text().match(/^\s*$/) || (s[i] = "<div class='" + SFSI(this).attr("class") + "'>" + SFSI(this).html() + "</div>", 
        SFSI(this).fadeOut("slow"), SFSI(this).insertBefore(SFSI(this).prev(".sfsi_plus_wicons")), 
        SFSI(this).fadeIn("slow"));
    }), s = sfsiplus_Shuffle(s), $("#sfsi_plus_wDiv").html("");
    for (var i = 0; i < testArray.length; i++) $("#sfsi_plus_wDiv").append(s[i]);
}

function sfsiplus_Shuffle(s) {
    for (var i, e, t = s.length; t; i = parseInt(Math.random() * t), e = s[--t], s[t] = s[i], 
    s[i] = e) ;
    return s;
}

function sfsi_plus_setCookie(s, i, e) {
    var t = new Date();
    t.setTime(t.getTime() + 1e3 * 60 * 60 * 24 * e);
    var n = "expires=" + t.toGMTString();
    document.cookie = s + "=" + i + "; " + n;
}

function sfsfi_plus_getCookie(s) {
    for (var i = s + "=", e = document.cookie.split(";"), t = 0; t < e.length; t++) {
        var n = e[t].trim();
        if (0 == n.indexOf(i)) return n.substring(i.length, n.length);
    }
    return "";
}

function sfsi_plus_hideFooter() {}

window.onerror = function() {}, SFSI = jQuery.noConflict(), SFSI(window).on('load',function() {
    SFSI("#sfpluspageLoad").fadeOut(2e3);
});

var global_error = 0;

SFSI(document).ready(function(s) {

	//changes done {Monad}
	SFSI("head").append('<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />'), 
    SFSI("head").append('<meta http-equiv="Pragma" content="no-cache" />'), SFSI("head").append('<meta http-equiv="Expires" content="0" />'), 
    SFSI(document).click(function(s)
	{
        var i = SFSI(".sfsi_plus_FrntInner_changedmonad"), e = SFSI(".sfsi_plus_wDiv"), t = SFSI("#at15s");
        i.is(s.target) || 0 !== i.has(s.target).length || e.is(s.target) || 0 !== e.has(s.target).length || t.is(s.target) || 0 !== t.has(s.target).length || i.fadeOut();
    }),
	SFSI("div#sfsiplusid_linkedin").find(".icon4").find("a").find("img").mouseover(function() {
        SFSI(this).attr("src", sfsi_plus_ajax_object.plugin_url + "images/visit_icons/linkedIn_hover.svg");
    }),
	SFSI("div#sfsiplusid_linkedin").find(".icon4").find("a").find("img").mouseleave(function() {
        SFSI(this).attr("src", sfsi_plus_ajax_object.plugin_url + "images/visit_icons/linkedIn.svg");
    }),
	SFSI("div#sfsiplusid_youtube").find(".icon1").find("a").find("img").mouseover(function() {
        SFSI(this).attr("src", sfsi_plus_ajax_object.plugin_url + "images/visit_icons/youtube_hover.svg");
    }),
	SFSI("div#sfsiplusid_youtube").find(".icon1").find("a").find("img").mouseleave(function() {
        SFSI(this).attr("src", sfsi_plus_ajax_object.plugin_url + "images/visit_icons/youtube.svg");
    }),
	SFSI("div#sfsiplusid_facebook").find(".icon1").find("a").find("img").mouseover(function() {
        SFSI(this).css("opacity", "0.9");
    }),
	SFSI("div#sfsiplusid_facebook").find(".icon1").find("a").find("img").mouseleave(function() {
        SFSI(this).css("opacity", "1");
	}),
	SFSI("div#sfsiplusid_twitter").find(".cstmicon1").find("a").find("img").mouseover(function() {
        SFSI(this).css("opacity", "0.9");
    }),
	SFSI("div#sfsiplusid_twitter").find(".cstmicon1").find("a").find("img").mouseleave(function() {
        SFSI(this).css("opacity", "1");
    }),
	SFSI(".pop-up").on("click", function() {
        ("fbex-s2" == SFSI(this).attr("data-id") || "googlex-s2" == SFSI(this).attr("data-id") || "linkex-s2" == SFSI(this).attr("data-id")) && (SFSI("." + SFSI(this).attr("data-id")).hide(), 
        SFSI("." + SFSI(this).attr("data-id")).css("opacity", "1"), SFSI("." + SFSI(this).attr("data-id")).css("z-index", "1000")), 
        SFSI("." + SFSI(this).attr("data-id")).show("slow");
    }),
	/*SFSI("#close_popup").live("click", function() {*/
	SFSI(document).on("click", '#close_popup', function () {
        SFSI(".read-overlay").hide("slow");
    });
    var e = 0; 
    sfsi_plus_make_popBox(),
	SFSI('input[name="sfsi_plus_popup_text"] ,input[name="sfsi_plus_popup_background_color"],input[name="sfsi_plus_popup_border_color"],input[name="sfsi_plus_popup_border_thickness"],input[name="sfsi_plus_popup_fontSize"],input[name="sfsi_plus_popup_fontColor"]').on("keyup", sfsi_plus_make_popBox), 
    SFSI('input[name="sfsi_plus_popup_text"] ,input[name="sfsi_plus_popup_background_color"],input[name="sfsi_plus_popup_border_color"],input[name="sfsi_plus_popup_border_thickness"],input[name="sfsi_plus_popup_fontSize"],input[name="sfsi_plus_popup_fontColor"]').on("focus", sfsi_plus_make_popBox), 
    SFSI("#sfsi_plus_popup_font ,#sfsi_plus_popup_fontStyle").on("change", sfsi_plus_make_popBox), 
    /*SFSI(".radio").live("click", function(){*/
	SFSI(document).on("click", '.radio', function () {	
        var s = SFSI(this).parent().find("input:radio:first");
        "sfsi_plus_popup_border_shadow" == s.attr("name") && sfsi_plus_make_popBox();
    }), /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? SFSI("img.sfsi_wicon").on("click", function(s) {
        s.stopPropagation();
        var i = SFSI("#sfsi_plus_floater_sec").val();
        SFSI("div.sfsi_plus_wicons").css("z-index", "0"), SFSI(this).parent().parent().parent().siblings("div.sfsi_plus_wicons").find(".sfsiplus_inerCnt").find("div.sfsi_plus_tool_tip_2").hide(), 
        SFSI(this).parent().parent().parent().parent().siblings("li").length > 0 && (SFSI(this).parent().parent().parent().parent().siblings("li").find("div.sfsi_plus_tool_tip_2").css("z-index", "0"), 
        SFSI(this).parent().parent().parent().parent().siblings("li").find("div.sfsi_plus_wicons").find(".sfsiplus_inerCnt").find("div.sfsi_plus_tool_tip_2").hide()), 
        SFSI(this).parent().parent().parent().css("z-index", "1000000"), SFSI(this).parent().parent().css({
            "z-index":"999"
        }), SFSI(this).attr("effect") && "fade_in" == SFSI(this).attr("effect") && (SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").css({
            opacity:1,
            "z-index":10
        }), SFSI(this).parent().css("opacity", "1")), SFSI(this).attr("effect") && "scale" == SFSI(this).attr("effect") && (SFSI(this).parent().addClass("scale"), 
        SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").css({
            opacity:1,
            "z-index":10
        }), SFSI(this).parent().css("opacity", "1")), SFSI(this).attr("effect") && "combo" == SFSI(this).attr("effect") && (SFSI(this).parent().addClass("scale"), 
        SFSI(this).parent().css("opacity", "1"), SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").css({
            opacity:1,
            "z-index":10
        })), ("top-left" == i || "top-right" == i) && SFSI(this).parent().parent().parent().parent("#sfsi_plus_floater").length > 0 && "sfsi_plus_floater" == SFSI(this).parent().parent().parent().parent().attr("id") ? (SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").addClass("sfsi_plc_btm"), 
        SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").find("span.bot_arow").addClass("top_big_arow"), 
        SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").css({
            opacity:1,
            "z-index":10
        }), SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").show()) :(SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").find("span.bot_arow").removeClass("top_big_arow"), 
        SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").removeClass("sfsi_plc_btm"), 
        SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").css({
            opacity:1,
            "z-index":1e3
        }), SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").show());
    }) :SFSI(document).on("mouseenter","img.sfsi_wicon" ,function() {
        var s = SFSI("#sfsi_plus_floater_sec").val();
        SFSI("div.sfsi_plus_wicons").css("z-index", "0"), SFSI(this).parent().parent().parent().siblings("div.sfsi_plus_wicons").find(".sfsiplus_inerCnt").find("div.sfsi_plus_tool_tip_2").hide(), 
        SFSI(this).parent().parent().parent().parent().siblings("li").length > 0 && (SFSI(this).parent().parent().parent().parent().siblings("li").find("div.sfsi_plus_tool_tip_2").css("z-index", "0"), 
        SFSI(this).parent().parent().parent().parent().siblings("li").find("div.sfsi_plus_wicons").find(".sfsiplus_inerCnt").find("div.sfsi_plus_tool_tip_2").hide()), 
        SFSI(this).parent().parent().parent().css("z-index", "1000000"), SFSI(this).parent().parent().css({
            "z-index":"999"
        }), SFSI(this).attr("effect") && "fade_in" == SFSI(this).attr("effect") && (SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").css({
            opacity:1,
            "z-index":10
        }), SFSI(this).parent().css("opacity", "1")), SFSI(this).attr("effect") && "scale" == SFSI(this).attr("effect") && (SFSI(this).parent().addClass("scale"), 
        SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").css({
            opacity:1,
            "z-index":10
        }), SFSI(this).parent().css("opacity", "1")), SFSI(this).attr("effect") && "combo" == SFSI(this).attr("effect") && (SFSI(this).parent().addClass("scale"), 
        SFSI(this).parent().css("opacity", "1"), SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").css({
            opacity:1,
            "z-index":10
        })), ("top-left" == s || "top-right" == s) && SFSI(this).parent().parent().parent().parent("#sfsi_plus_floater").length > 0 && "sfsi_plus_floater" == SFSI(this).parent().parent().parent().parent().attr("id") ? (SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").addClass("sfsi_plc_btm"), 
        SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").find("span.bot_arow").addClass("top_big_arow"), 
        SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").css({
            opacity:1,
            "z-index":10
        }), SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").show()) :(SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").find("span.bot_arow").removeClass("top_big_arow"), 
        SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").removeClass("sfsi_plc_btm"), 
        SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").css({
            opacity:1,
            "z-index":10
        }), SFSI(this).parentsUntil("div").siblings("div.sfsi_plus_tool_tip_2").show());
    }), SFSI(document).on("mouseleave","div.sfsi_plus_wicons", function() {
		SFSI(this).children("div.sfsiplus_inerCnt").children("a.sficn").attr("effect") && "fade_in" == SFSI(this).children("div.sfsiplus_inerCnt").children("a.sficn").attr("effect") && SFSI(this).children("div.sfsiplus_inerCnt").find("a.sficn").css("opacity", "0.6"), 
        SFSI(this).children("div.sfsiplus_inerCnt").children("a.sficn").attr("effect") && "scale" == SFSI(this).children("div.sfsiplus_inerCnt").children("a.sficn").attr("effect") && SFSI(this).children("div.sfsiplus_inerCnt").find("a.sficn").removeClass("scale"), 
        SFSI(this).children("div.sfsiplus_inerCnt").children("a.sficn").attr("effect") && "combo" == SFSI(this).children("div.sfsiplus_inerCnt").children("a.sficn").attr("effect") && (SFSI(this).children("div.sfsiplus_inerCnt").find("a.sficn").css("opacity", "0.6"), 
        SFSI(this).children("div.sfsiplus_inerCnt").find("a.sficn").removeClass("scale")), "sfsiplusid_google" == SFSI(this).children("div.sfsiplus_inerCnt").find("a.sficn").attr("id") ? SFSI("body").on("click", function() {
            SFSI(this).children(".sfsiplus_inerCnt").find("div.sfsi_plus_tool_tip_2").hide();
        }) :(SFSI(this).css({
            "z-index":"0"
        }), SFSI(this).children(".sfsiplus_inerCnt").find("div.sfsi_plus_tool_tip_2").hide());
    }), SFSI("body").on("click", function() {
        SFSI(".sfsiplus_inerCnt").find("div.sfsi_plus_tool_tip_2").hide();
    }), SFSI(".adminTooltip >a").on("hover", function() {
        SFSI(this).offset().top, SFSI(this).parent("div").find("div.sfsi_plus_tool_tip_2_inr").css("opacity", "1"), 
        SFSI(this).parent("div").find("div.sfsi_plus_tool_tip_2_inr").show();
    }), SFSI(".adminTooltip").on("mouseleave", function() {
        "none" != SFSI(".sfsi_plus_gpls_tool_bdr").css("display") && 0 != SFSI(".sfsi_plus_gpls_tool_bdr").css("opacity") ? SFSI(".pop_up_box ").on("click", function() {
            SFSI(this).parent("div").find("div.sfsi_plus_tool_tip_2_inr").css("opacity", "0"), SFSI(this).parent("div").find("div.sfsi_plus_tool_tip_2_inr").hide();
        }) :(SFSI(this).parent("div").find("div.sfsi_plus_tool_tip_2_inr").css("opacity", "0"), 
        SFSI(this).parent("div").find("div.sfsi_plus_tool_tip_2_inr").hide());
    }), SFSI(".expand-area").on("click", function() {
        "Read more" == SFSI(this).text() ? (SFSI(this).siblings("p").children("label").fadeIn("slow"), 
        SFSI(this).text("Collapse")) :(SFSI(this).siblings("p").children("label").fadeOut("slow"), 
        SFSI(this).text("Read more"));
    }), SFSI(".sfsi_plus_wDiv").length > 0 && setTimeout(function() {
        var s = parseInt(SFSI(".sfsi_plus_wDiv").height()) + 15 + "px";
        SFSI(".sfsi_plus_holders").each(function() {
            SFSI(this).css("height", s);
		});
		SFSI(".sfsi_plus_widget").css("min-height", "auto");
    }, 200);
    jQuery(document).find('.wp-block-ultimate-social-media-plus-sfsi-plus-share-block').each(function(index,target){
        console.log('gutenberg',target);
        var actual_target= jQuery(target).find('.sfsi_plus_block');
        var align= jQuery(actual_target).attr('data-align');
        var maxPerRow= jQuery(actual_target).attr('data-count');
        var iconType= jQuery(actual_target).attr('data-icon-type');
        // console.log(iconType);
            jQuery.ajax({
                'url': '/wp-json/ultimate-social-media-plus/v1/icons/?url='+window.location.href+'&ractangle_icon='+('round'==iconType?0:1),
                'method':'GET'
                // 'data':{'is_admin':true,'share_url':'/'}
            }).done((response)=>{
                jQuery(actual_target).html(response);
                if(iconType=='round'){
                    sfsi_plus_changeIconWidth(maxPerRow,target,align);
                }else{
                    if('center'===align){
                        jQuery(target).find('.sfsi_plus_block_text_before_icon').css({'display':'inherit'});
                    }
                    jQuery(target).css({'text-align':align});
                }
                if(window.gapi){
                    window.gapi.plusone.go();window.gapi.plus.go();window.gapi.ytsubscribe.go();
                };
                if(window.twttr){
                    window.twttr.widgets.load();
                };
                if(window.IN && window.IN.parse){
                    window.IN.parse();
                };
                if(window.addthis){
                    if(window.addthis.toolbox){
                        window.addthis.toolbox('.addthis_button.sficn');
                    }else{
                        window.addthis.init();window.addthis.toolbox('.addthis_button.sficn');
                    }
                };
                if(window.PinUtils){
                    window.PinUtils.build();
                };
                if(window.FB){
                    if(window.FB.XFBML){
                        window.FB.XFBML.parse();
                    }
                };
            }).fail((response)=>{
                // console.log(response,$('.sfsi_plus_block'));
                jQuery(actual_target).html(response.responseText.replace('/\\/g',''));
            });
    });
    if( undefined !==window.location.hash){
        switch(window.location.hash){
            case '#ui-id-3' : jQuery('#ui-id-3').click();
            case '#ui-id-1' : jQuery('#ui-id-1').click();
        }
    }
    // sfsi_plus_update_iconcount();
});

function sfsi_plus_update_iconcount(){
    SFSI(".wp-block-ultimate-social-media-plus-sfsi-plus-share-block").each(function(){
        var icon_count = SFSI(this).find(".sfsi_plus_block").attr('data-count');
        var icon_align = SFSI(this).find(".sfsi_plus_block").attr('data-align');
        // console.log(icon_count,icon_align,this,jQuery(this),jQuery(this).find('.sfsiplus_norm_row'));
        // sfsi_plus_changeIconWidth(icon_count,this);
        if(jQuery(this).find('.sfsiplus_norm_row').length<1){
            setTimeout(function(){
                // console.log(icon_count);
                sfsi_plus_changeIconWidth(icon_count,this,icon_align);
            },1000);
        }else{
             sfsi_plus_changeIconWidth(icon_count,this,icon_align);
        }
    });
}

function sfsi_plus_changeIconWidth(per_row=null,target,icon_align){
    var iconWidth = parseInt(jQuery(target).find('.sfsiplus_norm_row div').css('width'))||40;
    console.log('iconwidth',iconWidth,jQuery(target).find('.sfsiplus_norm_row'),jQuery(target).find('.sfsiplus_norm_row div').css('width'));

    var iconMargin = parseInt(jQuery(target).find('.sfsiplus_norm_row div').css('margin-left'))||0;  
    
    var wrapperWidth = (iconWidth+iconMargin)*per_row;
    jQuery(target).find('.sfsiplus_norm_row').css({'width':wrapperWidth+'px'});
    jQuery(target).find('.sfsi_plus_block').css({'width':wrapperWidth+'px'});
        jQuery(target).find('.sfsi_plus_block_text_before_icon').css({'padding-top':'12px'});
    if('center'===icon_align){
        jQuery(target).find('.sfsi_plus_block_text_before_icon').css({'display':'inherit'});
    }
    jQuery(target).css({'text-align':icon_align});
}
//hiding popup on close button
function sfsiplushidemepopup()
{
	SFSI(".sfsi_plus_FrntInner").fadeOut();
}

var sfsiplus_initTop = new Array();

