var countryRedirect = function() {

    var validCountries = "AT|BE|BG|CZ|DK|EE|FI|FR|DE|HU|IE|IL|IT|LV|LT|NL|NO|PL|PT|RO|RU|SK|SI|ES|SE|CH|TR|UK|AU|CN|HK|IN|KR|MY|NZ|PH|SG|TW|TH|BR|CA|MX|US";

    var flagLang = {
        'uk': {
            'title': 'Would you like to view this product on our UK website?',
            'yes': 'Yes',
            'no': 'No',
            'or': 'or',
            'choose': 'Choose country',
            'position': 28
        },
        'bg': {
            'title': 'Бихте ли искали да видите този продукт на българския ни уебсайт?',
            'yes': 'Да',
            'no': 'Не',
            'or': 'или',
            'choose': 'Изберете страна',
            'position': 3
        },
        'cz': {
            'title': 'Chcete tento produkt zobrazit na naší české webové stránce?',
            'yes': 'Ano',
            'no': 'Ne',
            'or': 'nebo',
            'choose': 'Vyberte zemi',
            'position': 4
        },
        'dk': {
            'title': 'Vil du se dette produkt på vores danske hjemmeside?',
            'yes': 'Ja',
            'no': 'Nej',
            'or': 'eller',
            'choose': 'Vælg land',
            'position': 5
        },
        'de': {
            'title': 'Möchten Sie sich dieses Produkt auf unserer deutschen Webseite ansehen?',
            'yes': 'Ja',
            'no': 'Nein',
            'or': 'oder',
            'choose': 'Land auswählen',
            'position': 9
        },
        'at': {
            'title': 'Möchten Sie sich dieses Produkt auf unserer österreichischen Webseite ansehen?',
            'yes': 'Ja',
            'no': 'Nein',
            'or': 'oder',
            'choose': 'Land auswählen',
            'position': 1
        },
        'es': {
            'title': '¿Quiere ver este producto en nuestro sitio web en español?',
            'yes': 'Sí',
            'no': 'No',
            'or': 'o',
            'choose': 'Seleccione el país',
            'position': 24
        },
        'ee': {
            'title': 'Kas soovite vaadata seda toodet meie Eesti veebisaidil?',
            'yes': 'Jah',
            'no': 'Ei',
            'or': 'või',
            'choose': 'Valige riik',
            'position': 6
        },
        'fi': {
            'title': 'Haluatko lisätietoja tästä tuotteesta suomalaiselta verkkosivustolta?',
            'yes': 'Kyllä',
            'no': 'Ei',
            'or': 'tai',
            'choose': 'Valitse maa',
            'position': 7
        },
        'fr': {
            'title': 'Souhaitez-vous afficher ce produit sur notre site internet en français?',
            'yes': 'Oui',
            'no': 'Non',
            'or': 'ou',
            'choose': 'Choisir le pays',
            'position': 8
        },
        'hu': {
            'title': 'Megtekinti a terméket a magyar weboldalon?',
            'yes': 'Igen',
            'no': 'Nem',
            'or': 'vagy',
            'choose': 'Ország kiválasztása',
            'position': 10
        },
        'it': {
            'title': 'Desideri visualizzare questo prodotto nel nostro sito Web italiano?',
            'yes': 'Sì',
            'no': 'No',
            'or': 'o',
            'choose': 'Scegli il paese',
            'position': 13
        },
        'lt': {
            'title': 'Ar norite peržiūrėti šį produktą mūsų svetainėje lietuvių kalba?',
            'yes': 'Taip',
            'no': 'Ne',
            'or': 'arba',
            'choose': 'Pasirinkti šalį',
            'position': 15
        },
        'lv': {
            'title': 'Vai vēlaties skatīt šo produktu mūsu vietnē latviešu valodā?',
            'yes': 'Jā',
            'no': 'Nē',
            'or': 'vai',
            'choose': 'Izvēlēties valsti',
            'position': 14
        },
        'nl': {
            'title': 'Wilt u dit product op onze Nederlandse website bekijken?',
            'yes': 'Ja',
            'no': 'Nee',
            'or': 'of',
            'choose': 'Kies land',
            'position': 16
        },
        'be': {
            'title': 'Would you like to view this product on our Belgium website?',
            'yes': 'Yes',
            'no': 'No',
            'or': 'or',
            'choose': 'Choose country',
            'position': 2
        },
        'nl-be': {
            'title': 'Wilt u dit product op onze Vlaamse website bekijken?',
            'yes': 'Ja',
            'no': 'Nee',
            'or': 'of',
            'choose': 'Kies land',
            'position': 2
        },
        'fr-be': {
            'title': 'Souhaitez-vous afficher ce produit sur notre site internet en français?',
            'yes': 'Oui',
            'no': 'Non',
            'or': 'ou',
            'choose': 'Choisir le pays',
            'position': 2
        },
        'fr-ch': {
            'title': 'Souhaitez-vous afficher ce produit sur notre site internet en français?',
            'yes': 'Oui',
            'no': 'Non',
            'or': 'ou',
            'choose': 'Choisir le pays',
            'position': 26
        },
        'de-ch': {
            'title': 'Möchten Sie sich dieses Produkt auf unserer Schweitzer Webseite ansehen?',
            'yes': 'Ja',
            'no': 'Nein',
            'or': 'oder',
            'choose': 'Land auswählen',
            'position': 26
        },
        'ch': {
            'title': 'Would you like to view this product on our Swiss website?',
            'yes': 'Yes',
            'no': 'No',
            'or': 'or',
            'choose': 'Choose country',
            'position': 26
        },
        'no': {
            'title': 'Ønsker du å se dette produktet på vårt norske nettsted?',
            'yes': 'Ja',
            'no': 'Nei',
            'or': 'eller',
            'choose': 'Velg land',
            'position': 17
        },
        'pl': {
            'title': 'Czy chcesz obejrzeć ten produkt na naszej stronie w języku polskim?',
            'yes': 'Tak',
            'no': 'Nie',
            'or': 'lub',
            'choose': 'Wybierz kraj',
            'position': 18
        },
        'pt': {
            'title': 'Pretende visualizar este produto no nosso website em português?',
            'yes': 'Sim',
            'no': 'Não',
            'or': 'ou',
            'choose': 'Seleccionar país',
            'position': 19
        },
        'ro': {
            'title': 'Aţi dori să vizualizaţi acest produs pe site-ul nostru web român?',
            'yes': 'Da',
            'no': 'Nu',
            'or': 'sau',
            'choose': 'Alegeţi ţara',
            'position': 20
        },
        'ru': {
            'title': 'Хотите ознакомиться с этим продуктом на нашем веб-сайте на русском языке?',
            'yes': 'Да',
            'no': 'Нет',
            'or': 'или',
            'choose': 'Выбрать страну',
            'position': 21
        },
        'sk': {
            'title': 'Chceli by ste si pozrieť tento produkt na našej slovenskej webovej stránke?',
            'yes': 'Áno',
            'no': 'Nie',
            'or': 'alebo',
            'choose': 'Vybrať krajinu',
            'position': 22
        },
        'si': {
            'title': 'Si želite izdelek ogledati na našem slovenskem spletnem mestu?',
            'yes': 'Da',
            'no': 'Ne',
            'or': 'ali',
            'choose': 'Izberite državo',
            'position': 23
        },
        'se': {
            'title': 'Vill du se den här produkten på vår svenska webbplats?',
            'yes': 'Ja',
            'no': 'Nej',
            'or': 'eller',
            'choose': 'Välj land',
            'position': 25
        },
        'tr': {
            'title': 'Bu ürünü Türkçe web sitemizde görüntülemek ister misiniz?',
            'yes': 'Evet',
            'no': 'Hayır',
            'or': 'veya',
            'choose': 'Ülke seçin',
            'position': 27
        },
        'ex': {
            'title': 'Would you like to view this product on our Export website?',
            'yes': 'Yes',
            'no': 'No',
            'or': 'or',
            'choose': 'Choose country',
            'position': null
        }
    }

    var googleLocale = null;
    var locale = null;
    var self = this;

    var promoWrapper = dojo.query(".mk-promo-wrapper");
    var promoToggle = null;
    if(promoWrapper.length >= 1) {
        promoToggle = new dojo.fx.Toggler({node: promoWrapper[0]});
    }

    var addTracking = function (url){
        var newurl = '';
        if(url.indexOf('?')!= -1){
            newurl = url.substring(0, url.indexOf('?')+1)+ 'CMP=os_Google-' + googleLocale.toUpperCase() + '_ProductDetail_Redirect';
        }else{
            newurl = url+'?CMP=os_Google-' + googleLocale.toUpperCase() + '_ProductDetail_Redirect';
        }
        return newurl;
    }

    this.redirect = function(){

        if (typeof JSON === 'undefined') {
            return false;
        }

        var docRef = document.referrer;

        if (docRef == "")
        {
            return;
        }

        var campaignUserAvailable = mkPfjs.campaignUser.hasOwnProperty("newVisit");

        if(campaignUserAvailable)
        {
            self.cookieHelper = mk.helper.cookieHelper;

            var redirectMsgCookie = JSON.parse(self.cookieHelper.getCookie());
        }


        if ((/google/).test(docRef)) {

            if(campaignUserAvailable) {
                if (redirectMsgCookie.flagMsg === 'hide') return;
            }

            var regExpression = /([a-z]{2,6})$/;

            var urlHost = new dojo._Url(docRef).host;

            var localeMatches = urlHost.match(regExpression);


            if (localeMatches != null && localeMatches.length >= 1) {

                var regExpLocale = /[A-Za-z].$/;
                locale = dojo.locale.match(regExpLocale)[0];

                googleLocale = localeMatches[1];

                if(googleLocale == locale || (googleLocale == "uk" && locale == "gb")) return; //if the google referrer and locale is the same then do  not need to redirect.

                //check to see if google locale is in the list

                var countrySiteExists = validCountries.indexOf(googleLocale.toUpperCase()) >= 0;

                if (googleLocale !== 'com') {

                    var lang = null;
                    var newURL = document.URL;

                    if(countrySiteExists){
                        lang = flagLang[googleLocale];
                        newURL = addTracking(newURL.replace(newURL.split('.com')[0], 'http://' + googleLocale + '.farnell'));
                    } else {
                        lang = flagLang['ex'];
                        newURL = addTracking(newURL.replace(newURL.split('.com')[0], 'http://export.farnell'));
                    }


                    var pdpFlagWrapper = dojo.create("div", {
                        id: "pdp_flag_message",
                        className: "mk-overlay",
                        style: "display: inline"
                    });
                    var flag = dojo.create("div", {id: "pdp_flag_button"}, pdpFlagWrapper, "first");

                    var flagPositionClass = "";
                    if (countrySiteExists) {
                        flagPositionClass = "mk-flag-europe-s mk-small-flag mk-flag-position-" + lang.position; //position only required if site is valid
                    }

                    var flagPostion = dojo.create("div", {
                        id: "flag",
                        className: "mk-margintop-x mk-left " + flagPositionClass
                    }, flag, "first");

                    dojo.create("h3", {
                        className: "mk-country-redirect-text",
                        innerHTML: lang.title
                    }, flagPostion, "after");
                    var mkRedirect = dojo.create("div", {id: "mk-redirect", className: "mk-right"}, flag, "last");
                    var ulMkRedirect = dojo.create("ul", {}, mkRedirect, "first");
                    var liYes = dojo.create("li", {id: "liYes"}, ulMkRedirect, "first");
                    var yes = dojo.create("a", {
                        className: "mk-primary-btn mk-btn5 mk-rightmargin-12 mk-left",
                        href: newURL,
                        onclick: 'SEOChangeCountry("' + locale + '","' + googleLocale.toUpperCase() + '", this)',
                        innerHTML: lang.yes
                    }, liYes, "first");
                    var liNo = dojo.create("li", {id: "liNo"}, ulMkRedirect, "last");
                    var no = dojo.create("a", {
                        className: "mk-primary-btn mk-btn5 mk-rightmargin-12 mk-left",
                        href: "",
                        innerHTML: lang.no
                    }, liNo, "first");
                    var liOr = dojo.create("li", {}, ulMkRedirect, "last");
                    var or = dojo.create("h3", {id: "mk-or", className: "mk-left", innerHTML: lang.or}, liOr, "first");
                    var liChangeCountry = dojo.create("li", {}, ulMkRedirect, "last");
                    dojo.create("a", {
                        className: "mk-subtle-btn mk-btn4 mk-left",
                        href: "http://www.farnell.com?ICID=EXP-REDIRECT",
                        onclick: 'SEOChangeCountry("' + locale + '" , "[ALL]", this )',
                        innerHTML: lang.choose
                    }, liChangeCountry, "first");

                    dojo.connect(no, "onclick", function (evt) {
                        evt.preventDefault(evt);
                        flagMsgClose();
                    });

                    //hide the promo strip
                    if (promoToggle != null) {
                        promoToggle.hide();
                        dojo.style(promoWrapper[0], "height", "0px");
                    }

                    var productNode = dojo.byId('productHeader');

                    dojo.place(pdpFlagWrapper, productNode, 'before');
                }
            }
        }

        var flagMsgClose = function() {
            if(campaignUserAvailable) {
                redirectMsgCookie.flagMsg = 'hide';
                self.cookieHelper.setCookie(redirectMsgCookie, 365);
            }

            // hide the message
            var messagePDP = dojo.byId('pdp_flag_message');

            if (messagePDP !== null) {
                dojo.style(messagePDP, "display", "none");
            }

            if(promoToggle != null)
            {
                promoToggle.show();
                dojo.style(promoWrapper[0], "height", "");
            }


            SEOChangeCountry(locale, googleLocale, this);
        }

        var SEOChangeCountry = function(currentLocale, chosenLocale, theObject) {
            if (typeof s_gi == 'undefined') {
                return;
            } //ignore if omniture not active
            if (typeof fedsearchConfig != 'object' || !fedsearchConfig.omnitureAccount) {
                return;
            } // ignore if omniture account isn't defined
            var s = s_gi(fedsearchConfig.omnitureAccount);
            s.linkTrackVars = 'eVar30';
            s.linkTrackEvents = 'None';
            s.eVar30 = '{offered:' + currentLocale + ',selected:' + chosenLocale + '}';
            var lt = theObject.href != null ? s.lt(theObject.href) : "";
            if (lt == "") {
                s.tl(theObject, 'e', 'SEO Change Country');
            }
        }

    }
}
