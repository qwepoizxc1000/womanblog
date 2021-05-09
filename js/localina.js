var applicationContext = 'https://my.localina.com/code/';

/* Pre loads loading image*/
var loadingImage = new Image();
loadingImage.src = applicationContext + "styles/images/ajax-loader.gif";

var customCss = {
    backgroundColor: '',
    selectorsDefaultColor: '',
    selectorHoverColor: '',
    selectorActiveColor: 'e0af00',
    buttonDefaultColor: 'db7100',
    buttonHoverColor: 'c95700',
    buttonActiveColor: 'dd8500',
    reservationButtonDefaultColor: 'db7100',
    reservationButtonHoverColor: '191500'
};

var Localina = {
    apiKey: null,
    locale: 'de',
    phoneNumber: null,
    groups: false,
    jqueryPluginInit: false,
    welcomeMessagePreview: null,
    previewMessage: null,
    https: (applicationContext.indexOf('https://') != -1),
    provider: 'LOCALINA',

//Just to guarantee compatibility with old versions of integration code
    init: function (opts) {
        for (opt in opts) {
            this[opt] = opts[opt];
        }
    },

    preview: function (firstArg, secondArg, thirdArg, fourthArg, fifthArg, sixthArg, seventhArg) {
        //This argument tell us if is a welcome message or a confirm message preview
        this.welcomeMessagePreview = sixthArg === 'true';
        //Message to preview
        this.previewMessage = seventhArg;

        this.startBooking(firstArg, secondArg, thirdArg, fourthArg, fifthArg, false);
    },

    //Deprecated
    startBookingHttps: function (firstArg, secondArg, thirdArg, fourthArg, fifthArg, sixthArg) {
        this.startBooking(firstArg, secondArg, thirdArg, fourthArg, fifthArg, sixthArg);
    },

    startBooking: function (firstArg, secondArg, thirdArg, fourthArg, fifthArg, sixthArg) {
        //Complete form: restaurantId, apiKey, locale, jQuery(this), groups, [sixthArg:for preview only:clearPreviewVars]
        this.phoneNumber = firstArg;
        this.apiKey = secondArg;

        if (sixthArg == undefined || sixthArg === 'true') {
            this.welcomeMessagePreview = null;
            this.previewMessage = null;
        }

        if (arguments.length < 3) {
            alert('Phone number, API Key and jQuery(this) are required for reservation.');
            return;
        }

        if (arguments.length >= 3) {
            //[restaurantId;apkiKey;[locale|jquery(this)]
            //Validate phone number
            if (typeof (firstArg) != 'string') {
                alert('Phone number is required and must be a string.');
                return;
            }
            //Validate API Key
            if (typeof (secondArg) != 'string') {
                alert('API Key is required and must be a string.');
                return;
            }

            //If string, user input is the locale
            if (typeof thirdArg == 'string') {
                //User inserted locale
                this.locale = thirdArg;
            }
        }

        if (arguments.length == 4) {
            //[restaurantId;apkiKey;locale;jquery(this)] or [restaurantId;apkiKey;jquery(this);groups]
            if (typeof fourthArg == 'boolean') {
                //Input is the groups
                this.groups = fourthArg;
            } else if (typeof fourthArg == 'string') {
                //convert to boolean
                this.groups = fourthArg === 'true';
            }
        }

        if (arguments.length == 5) {
            //[restaurantId;apkiKey;locale;jquery(this);groups]
            if (typeof fifthArg == 'boolean') {
                //Input is the groups
                this.groups = fifthArg;
            } else if (typeof fifthArg == 'string') {
                //convert to boolean
                this.groups = fifthArg === 'true';
            }
        }

        if (arguments.length == 6) {
            //[restaurantId;apkiKey;locale;jquery(this);groups;provider]

            //Parse groups
            if (typeof fifthArg == 'boolean') {
                //Input is the groups
                this.groups = fifthArg;
            } else if (typeof fifthArg == 'string') {
                //convert to boolean
                this.groups = fifthArg === 'true';
            }

            //Parse Provider
            if (typeof sixthArg == 'string') {
                //Input is the provider
                this.provider = sixthArg;
            }
        }

        if (arguments.length > 6) {
            alert('The function only accept 6 arguments.');
            return;
        }

        this.openBooking();
    },

    openBooking: function (phoneNumber) {
        //This is needed to maintain compatibility with old integration code
        if (phoneNumber) {
            this.phoneNumber = phoneNumber;
        }

        if (this.isMobileBrowser()) {
            //Redirect to mobile application
            window.open(this.createURL(false));
        } else {
            //Open modal box
            modalWindow.url = this.createURL(true);
            this.resetParameters();
            modalWindow.open();
        }
    },

    resetParameters: function() {
        this.locale = null;
        this.groups = null;
        this.provider = 'LOCALINA';
    },

    isMobileBrowser: function () {
        //function to detect mobile+tablet/desktop browser
        /*(function (a) {
         /*(jQuery.browser = jQuery.browser || {}).mobile =
         /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)
         || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,
         4))
         })(navigator.userAgent || navigator.vendor || window.opera);*/
        if (!this.jqueryPluginInit) {
            (function (a) {
                (jQuery.browser = jQuery.browser || {}).mobile =
                        /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(a)
                                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,
                                4))
            })(navigator.userAgent || navigator.vendor || window.opera);
            this.jqueryPluginInit = true;
        }

        return jQuery.browser.mobile;
    },

    createURL: function (desktop) {
        var url = applicationContext;
        url += '?';
        //API key
        url += '&apiKey=' + encodeURIComponent(this.apiKey);
        //Phone number
        url += '&restaurantId=' + encodeURIComponent(this.phoneNumber);
        //Locale
        if (this.locale != null) {
            url += '&locale=' + encodeURIComponent(this.locale);
        }
        //Groups
        url += '&groups=' + encodeURIComponent(this.groups);
        //Mobile parameter
        url += '&mobile=' + !desktop;
        //https
        url += '&https=' + this.https;
        //provider
        url += '&provider=' + this.provider;

        if (this.welcomeMessagePreview != null) {
            url += '&welcomeMessagePreview=' + encodeURIComponent(this.welcomeMessagePreview);
            url += '&previewMessage=' + encodeURIComponent(this.previewMessage);
        }

        //custom CSS
        url += '&backgroundColor=' + customCss.backgroundColor;
        url += '&selectorsDefaultColor=' + customCss.selectorsDefaultColor;
        url += '&selectorHoverColor=' + customCss.selectorHoverColor;
        url += '&selectorActiveColor=' + customCss.selectorActiveColor;
        url += '&buttonDefaultColor=' + customCss.buttonDefaultColor;
        url += '&buttonHoverColor=' + customCss.buttonHoverColor;
        url += '&buttonActiveColor=' + customCss.buttonActiveColor;

        return url;
    }
};

//Modal box
var modalWindow = {
    parent: "body",
    url: null,
    width: 519,
    iFrameNoScrollMinHeight: 815,

    modalWindowCss: {
        position: "absolute",
        padding: "0",
        left: "50%",
        "z-index": "1000000001",
        "background": "url('" + applicationContext
                + "styles/images/ajax-loader.gif') no-repeat center"
    },

    modalOverlayCss: {
        position: "fixed",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        height: "100%",
        width: "100%",
        margin: "0",
        padding: "0",
        background: "#000000",
        opacity: ".35",
        filter: "alpha(opacity = 35)",
        "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=35)",
        "-moz-opacity": "0.35",
        "-khtml-opacity": "0.25",
        "z-index": "101"
    },

    iFrameCss: {
        "border-radius": "4px",
        "visibility": "hidden"
    },

    closeWindowCss: {
        position: "absolute",
        width: "21px",
        height: "23px",
        right: "18px",
        top: "13px",
        background: "transparent url('" + applicationContext
                + "styles/images/close.png') no-repeat center",
        "text-indent": "-99999px",
        overflow: "hidden",
        cursor: "pointer",
        "display": "none"
    },

    close: function () {
        jQuery("#localina-modal-window").remove();
        jQuery("#localina-modal-overlay").remove();
    },

    open: function () {
        var iFrameHeight = this.iFrameNoScrollMinHeight;
        var browserHeight = jQuery(window).height();

        if (browserHeight < this.iFrameNoScrollMinHeight) {
            //Adjust iframe height to fit user browser
            iFrameHeight = browserHeight - 60;
        }

        var modal = "<div id=\"localina-modal-overlay\"></div>";
        modal += "<div id=\"localina-modal-window\" style=\"width:" + this.width + "px; height:"
                + iFrameHeight + "px; margin-top:-" + (iFrameHeight / 2) + "px; margin-left:-" + (this.width
                / 2)
                + "px;\">";
        modal +=
                "<iframe id='localina-iframe' class='' style='visibility:hidden;' width='" + this.width
                        + "' height='"
                        + iFrameHeight
                        + "' frameborder='0' scrolling='auto' allowtransparency='true' src='" + this.url
                        + "'></iframe>";
        modal += "</div>";

        //Append to body
        jQuery(this.parent).append(modal);

        jQuery("#localina-modal-window").append("<a id=\"localina-close-window\"></a>");

        jQuery("#localina-iframe").load(function () {
            //After iframe loads, show it, show close button and remove loading icon
            jQuery('#localina-iframe').css("visibility", 'visible');
            jQuery('#localina-close-window').css("display", "block");
            jQuery('#localina-modal-window').css("background", "transparent");
        });

        //Set css
        jQuery("#localina-iframe").css(this.iFrameCss);
        jQuery("#localina-modal-window").css(this.modalWindowCss);

        //Calculate top css property
        var top = ((iFrameHeight / 2)) + ( (jQuery(window).height() - iFrameHeight) / 2) + jQuery(document).scrollTop();

        jQuery("#localina-modal-window").css("top", +top + "px");
        jQuery("#localina-modal-overlay").css(this.modalOverlayCss);
        jQuery("#localina-close-window").css(this.closeWindowCss);

        //Handler on close
        jQuery("#localina-close-window").click(function () {
            modalWindow.close();
        });

        //jQuery("#localina-modal-window").css("top", (document.all ? document.scrollTop : window.pageYOffset)+"px");
    }
};

jQuery(document).ready(function () {
    if (jQuery("#localina-button")) {
        applyNormalButtonCSS();

        jQuery("#localina-button").mouseenter(function () {
            applyHoverButtonCSS();
        });

        jQuery("#localina-button").mouseleave(function () {
            applyNormalButtonCSS();
        });
    }
});

function applyHoverButtonCSS() {
    if (customCss.reservationButtonHoverColor) {
        jQuery("#localina-button").css("background", "#"+customCss.reservationButtonHoverColor);
    } else {
        jQuery("#localina-button").css("background-color", "#94b400");
        jQuery("#localina-button").css("filter",
            "progid:DXImageTransform.Microsoft.gradient(startColorstr = '#FF94B400', endColorstr = '#FF70890E', GradientType = 0)");
        jQuery("#localina-button").css("background-image", "-moz-linear-gradient(top, #94b400 0, #70890e 100%)");
        jQuery("#localina-button").css("background-image",
            "-webkit-gradient(linear, left top, left bottom, color-stop(0%, #94b400), color-stop(100%, #70890e))");
        jQuery("#localina-button").css("background-image", "-webkit-linear-gradient(top, #94b400 0, #70890e 100%)");
        jQuery("#localina-button").css("background-image", "-o-linear-gradient(top, #94b400 0, #70890e 100%)");
        jQuery("#localina-button").css("background-image", "-ms-linear-gradient(top, #94b400 0, #70890e 100%)");
        jQuery("#localina-button").css("background-image", "linear-gradient(top, #94b400 0, #70890e 100%)");
    }

}

function applyNormalButtonCSS() {
    jQuery("#localina-button").css("text-align", "center");
    jQuery("#localina-button").css("border", "1px solid " + customCss.reservationButtonDefaultColor ? "#" + customCss.reservationButtonDefaultColor : "#7f9b10");
    jQuery("#localina-button").css("-webkit-touch-callout", "none");
    jQuery("#localina-button").css("-webkit-user-select", "none");
    jQuery("#localina-button").css("-khtml-user-select", "none");
    jQuery("#localina-button").css("-moz-user-select", "none");
    jQuery("#localina-button").css("-ms-user-select", "none");
    jQuery("#localina-button").css("user-select", "none");
    jQuery("#localina-button").css("-moz-border-radius", "3px");
    jQuery("#localina-button").css("-webkit-border-radius", "3px");
    jQuery("#localina-button").css("-ms-border-radius", "3px");
    jQuery("#localina-button").css("-o-border-radius", "3px");
    jQuery("#localina-button").css("border-radius", "3px");

    if (customCss.reservationButtonDefaultColor) {
        jQuery("#localina-button").css("background", "#" + customCss.reservationButtonDefaultColor);
    } else {
        jQuery("#localina-button").css("background-color", "#9cbe00");
        jQuery("#localina-button").css("background-image", "-moz-linear-gradient(top, #9cbe00 0, #7f9b10 100%)");
        jQuery("#localina-button").css("background-image",
            "-webkit-gradient(linear, left top, left bottom, color-stop(0%, #9cbe00), color-stop(100%, #7f9b10))");
        jQuery("#localina-button").css("background-image", "-webkit-linear-gradient(top, #9cbe00 0, #7f9b10 100%)");
        jQuery("#localina-button").css("background-image", "-o-linear-gradient(top, #9cbe00 0, #7f9b10 100%)");
        jQuery("#localina-button").css("background-image", "-ms-linear-gradient(top, #9cbe00 0, #7f9b10 100%)");
        jQuery("#localina-button").css("background-image", "linear-gradient(top, #9cbe00 0, #7f9b10 100%)");
        jQuery("#localina-button").css("filter",
            "progid:DXImageTransform.Microsoft.gradient(startColorstr = '#FF9CBE00', endColorstr = '#FF7F9B10', GradientType = 0)");
    }

    jQuery("#localina-button").css("-moz-box-shadow", "inset 0 1px rgba(255, 255, 255, 0.3)");
    jQuery("#localina-button").css("-webkit-box-shadow", "inset 0 1px rgba(255, 255, 255, 0.3)");
    jQuery("#localina-button").css("-ms-box-shadow", "inset 0 1px rgba(255, 255, 255, 0.3)");
    jQuery("#localina-button").css("-o-box-shadow", "inset 0 1px rgba(255, 255, 255, 0.3)");
    jQuery("#localina-button").css("box-shadow", "inset 0 1px rgba(255, 255, 255, 0.3)");
    jQuery("#localina-button").css("font", "15px \"Trebuchet MS\", Tahoma, Arial, sans-serif");
    jQuery("#localina-button").css("line-height", "100%");
    jQuery("#localina-button").css("cursor", "pointer");
    jQuery("#localina-button").css("font-weight", "400");
    jQuery("#localina-button").css("font-family", "Helvetica, Arial, sans-serif");
    jQuery("#localina-button").css("font-size", "18px");
    jQuery("#localina-button").css("color", "#fff");
    jQuery("#localina-button").css("text-shadow", "rgba(0, 0, 0, 0.25) 1px 0 1px");
    jQuery("#localina-button").css("-moz-text-shadow", "rgba(0, 0, 0, 0.25) 1px 0 1px");
    jQuery("#localina-button").css("-webkit-text-shadow", "rgba(0, 0, 0, 0.25) 1px 0 1px");
    jQuery("#localina-button").css("-ms-text-shadow", "rgba(0, 0, 0, 0.25) 1px 0 1px");
    jQuery("#localina-button").css("-o-text-shadow", "rgba(0, 0, 0, 0.25) 1px 0 1px");
    jQuery("#localina-button").css("padding", "8px");
    jQuery("#localina-button").css("text-decoration", "none");
    jQuery("#localina-button").css("max-width", "200px");
    jQuery("#localina-button").css("display", "inline-block");
}

