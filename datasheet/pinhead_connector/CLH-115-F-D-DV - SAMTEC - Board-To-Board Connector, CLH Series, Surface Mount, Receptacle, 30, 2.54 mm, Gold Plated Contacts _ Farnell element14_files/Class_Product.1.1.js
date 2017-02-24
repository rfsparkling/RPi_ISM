/*-----------------------lang start------------------------------------------------------------------------------------------*/
var i18n = {};

function setI18n(val){
i18n = val;
}

function geti18n(modPath,wcsPath,langFile,ie8Path) {
    var tmp = ""; 
    dojo.registerModulePath("wcsstore", modPath);
    dojo.requireLocalization(
      wcsPath, 
      langFile         
    ); 
     tmp = dojo.i18n.getLocalization(
      wcsPath,  
      langFile         
    );
    if (typeof tmp.toLocaleLowerCase != "undefined")
    {
        var loc = dojo.locale;
        var theUrl = ie8Path+langFile+".js"; //need to add loc in the  path for IE8
        dojo.xhrGet({
                  url:theUrl, handleAs:"text",
                  load: function(data){
                       var dataString = data.replace(/(\r\n|\n|\r)/gm,"");
                       var ret = "dojo.toJson"+dataString;
                       setI18n(dojo.fromJson(eval(ret))); 
                
                  },
                 error: function(error){
                   console.log("An unexpected error occurred: " + error);
                 },
                handle: function(data) {
                    /*no op */
                },
                failOk : true
                });        
     }
     else
     {
      setI18n(tmp);
     }
}

geti18n("../../../../../../wcsstore","wcsstore.ExtendedSitesCatalogAssetStore.cms.asset.js.common.lib","product",
"/wcsstore/ExtendedSitesCatalogAssetStore/cms/asset/js/common/lib/nls/");
/*-----------------------lang end------------------------------------------------------------------------------------------*/


/*-----------------------Define Class: Product start------------------------------------------------------------------------------------------*/
function Product(){
    this.valid = typeof s === 'undefined' ? false : true;
	this.ldJson = dojo.query("script[type $= application/ld+json]")[0];
	this.seoURLAr = pf.canonical.data.productSeoURL.split("/");  
	this.manufacturerPartNo = typeof(this.ldJson) == "object" ? JSON.parse(this.ldJson.firstChild.data)["mpn"] : "";	
    this.manufacturerName = this.seoURLAr.length > 0 ? pf.canonical.data.productSeoURL.split("/")[0] : ""; 
    this.manufacturerPartNo = this.manufacturerPartNo === "" && this.seoURLAr.length > 1 ? pf.canonical.data.productSeoURL.split("/")[1] : this.manufacturerPartNo ;
	this.img = dojo.byId('productMainImage').src;
    this.sku = dojo.byId('itemsArray').value;
    this.hideQuoteLink = (typeof requestQuote === "function");/*replacement test*/    

    if(pf){
        this.availability = typeof pf.tagging.data.omniture.eVar33 === 'undefined' ? "" : pf.tagging.data.omniture.eVar33;
    }else{
        this.availability = "";
    }
    
	this.quoteLink = function(opts){
        if (this.hideQuoteLink) return;        
        
        if (pf.tagging.data.omniture.prop14 == "Out of Stock" ) {
            return;
        }

        if (opts !== undefined) {
            var text = (opts.text !== undefined ? opts.text : i18n.challenge);
            var quantityText = (opts.quantityText !== undefined ? opts.quantityText : i18n.larger_quant);
            var target = (opts.target !== undefined ? opts.target : "");
            var section = (opts.section !== undefined ? opts.section : "");
            var quoteUri = (opts.quoteUri !== undefined ? opts.quoteUri : "/request-a-quote");
        }
        else {
            var text = i18n.challenge;
            var quantityText = i18n.larger_quant;
            var target = "";
            var section = "";
            var quoteUri = "/request-a-quote";
        }
    
        var quotePriceList = dojo.query('.pricing');
        var priceBreakRows = dojo.query('tr', quotePriceList[0]);
        var priceBreakFinalRow = priceBreakRows[priceBreakRows.length -1];
        var priceBreak = dojo.query('td', priceBreakFinalRow);
        
        var quotePrice = priceBreak[priceBreak.length -1].innerHTML.replace(/\s\t+/g,'').replace(/\<.*\>/g,'');
        var quoteQty = priceBreak[0].innerHTML.replace(/^\s*|&nbsp;|\s+/g,'').split('-')[0];
        
        var quoteRow = quotePriceList[0].insertRow(-1);
        var quoteCell = quoteRow.insertCell(0);
        quoteCell.style.textAlign = "left";
        quoteCell.style.width = "100%";
        var url = quoteUri + "?sku="+this.sku+"&manufacturer="+encodeURIComponent(this.manufacturerName)+"&manufacturerid="+encodeURIComponent(this.manufacturerPartNo)+"&price="+quotePrice+"&qty="+quoteQty + section;
        quoteCell.colSpan = dojo.query('th', quotePriceList[0]).length;
        quoteCell.innerHTML = "<div class='hr' style='margin: 5px 0;'><hr></div><div class='mk-col-100'>" + quantityText + "<br /><a href='"+url+"' "+target+">"+text+"</a></div>";
    }
/*
  Available opts are set with defaults, but can be overridden by passing your  own opts when you call the method
  text (text to display on link),iconImgSrc (icon to show) ,mk_video_width, mk_video_height, astyle( anchor style), istyle (icon style)
  mk_video_id (in case want to add to another id) , allowPopup - catch all for non youtube or non brightcove videos - a popup window - off by default
*/    
    this.addVideoLink = function(opts) {
        if (typeof opts === "undefined")  opts={};
        var text = (opts.text !== undefined ? opts.text :i18n.play_video);
        var iconImgSrc =  (opts.iconImgSrc !== undefined ? opts.iconImgSrc :"/wcsstore/ExtendedSitesCatalogAssetStore/cms/asset/media/common/videoTemplates/playvideoIcon.png");
        var mk_video_width = (opts.mk_video_width !== undefined ? opts.mk_video_width :425);
        var mk_video_height = (opts.mk_video_height !== undefined ? opts.mk_video_height :365);
        var astyle = (opts.astyle !== undefined ? opts.astyle :"display: block;  width:auto;float:left; clear: both; margin: 5px 0 0 0;");
        var istyle = (opts.istyle !== undefined ? opts.istyle :"float:left; margin-right:0.8em;margin-bottom:5px;");
        var mk_video_id = (opts.mk_video_id !== undefined ? opts.mk_video_id :"mk-show-media-video-1");
        var allowPopup = (opts.allowPopup !== undefined ? opts.allowPopup :false);
        var useLightBox = false;
        var mk_video_ele_alt = dojo.query('.videoLink a');/*Not  Youtube*/
        /* youtube*/
        var mk_video_ele = dojo.byId('videoDiv_1');/* check 1-3 for youtube link*/
        if (mk_video_ele === null || mk_video_ele === undefined) {mk_video_ele = dojo.byId('videoDiv_2');}
        if (mk_video_ele === null || mk_video_ele === undefined) {mk_video_ele = dojo.byId('videoDiv_3');}
        if( mk_video_ele !== null && mk_video_ele !== undefined ){
            mk_video_width = parseInt(mk_video_ele.width,10);
            mk_video_height = parseInt(mk_video_ele.height,10);
            mk_video_url = (mk_video_ele.data !== '' && mk_video_ele.data !== undefined ? mk_video_ele.data : mk_video_ele.Movie);
            
            /* IE8 calls this before video object is embedded - adding fallback*/
            if (mk_video_ele.nodeName == 'DIV') {
                mk_video_url = (globalYoutubeData['videoDiv_1'] !== undefined ? globalYoutubeData['videoDiv_1']: globalYoutubeData['videoDiv_2']);
            }
            
            /* Need to use the '/embed/' youtube URL. */
            if (mk_video_url.indexOf('youtube') != -1 ) {
                /* two possible urls, '/v/' & '/watch?v='. Replacing both with '/embed/' */
                mk_video_url = mk_video_url.replace(/^\/watch\?v=|\/v\//,'/embed/');
                /*Only the ID is needed for embed - remove everything after(and including) the first ampersand.*/
                mk_video_url = mk_video_url.replace(/&.*$/, '');
            }
        }
        /*Not YouTube */   
        if (mk_video_ele_alt.length > 0  && mk_video_ele == null) {
            mk_video_ele = mk_video_ele_alt[0];
                    if (this.sku == '07X2279') mk_video_ele.href = 'http://bcove.me/taavgwmg';/*test hack*/
                    mk_video_url = mk_video_ele.href;
                    /*brightcove*/
                    if(mk_video_url.indexOf('bcove.me') > -1 || mk_video_url.indexOf('brightcove') > -1){
                        useLightBox = true;
                   } 
                   else 
                    {   /*can not override popupwindow dimensions*/
                        mk_video_width = 634;
                        mk_video_height = 643
                    } 
                    /*Stop on page link from navigating away */
                    dojo.attr(mk_video_ele,"onclick",'window.open("'+mk_video_url+'","Video","width='+mk_video_width+', height='+mk_video_height+', menubar=no, top=0");return false;');
                    dojo.attr(mk_video_ele,'href','javascript:void(0);');
        }
        
         /* add link on page above the fold*/
        if( mk_video_ele !== null && mk_video_ele !== undefined ){
            var protocol = document.location.protocol;
            if (mk_video_url.indexOf(protocol) == -1) {
            mk_video_url = mk_video_url.replace('http:',protocol);/* mixed content*/
            }
            if (mk_video_ele_alt.length === 0 || useLightBox === true) { 
                this.insertLink(text,astyle,istyle,mk_video_id,iconImgSrc);
                this.playVideo(mk_video_url,mk_video_width,mk_video_height,mk_video_id);
            }
            /*popup window for videos in pages, all else*/
            if (mk_video_ele_alt.length > 0 && useLightBox === false  && allowPopup === true) {
                 this.insertPopupLink(text,astyle,istyle,mk_video_url,mk_video_width,mk_video_height,mk_video_id,iconImgSrc);
            }
            var self = this;
           if (dojo.byId(mk_video_id)) {
                dojo.connect(dojo.byId(mk_video_id), "onclick", function(e) {
                self.addPDPTracking (self.sku,"PDP Video Click");
                });    
            }
        }
    }

    this.insertLink = function(text,astyle,istyle,mk_video_id,iconImgSrc){

         videoHTML = '<a href="javascript:void(0);" id="'+mk_video_id+'" style="'+astyle+'"><img style="'+istyle+'" alt="'+text+'" src="'+iconImgSrc+'" />'+text+'</a>';
            
         dojo.place(videoHTML, 'productDescription', "last");

    }

    this.insertPopupLink = function(text,astyle,istyle,url,mk_video_width,mk_video_height,mk_video_id,iconImgSrc){

        videoHTML = '<a href="javascript:void(0);window.open(&quot;'+url+'&quot,&quot;Video&quot;,&quot;width='+mk_video_width+', height='+mk_video_height+', menubar=no, top=0&quot;)" id="'+mk_video_id+'" style="'+astyle+'"><img style="'+istyle+'" alt="'+text+'" src="'+iconImgSrc+'" />'+text+'</a>';
        dojo.place(videoHTML, 'productDescription', "last");

    }
   this.playVideo = function(vurl, width,height,mk_video_id){

                        objV = { 
                            sTargetID:mk_video_id,
                            sConnectID:"mk-lightbox-overlay2",
                            sTemplatePath:"/wcsstore/ExtendedSitesCatalogAssetStore/cms/asset/media/common/videoTemplates/",
                            sTemplateFilename:"videoTemplate4.txt",
                            sVideoURL:vurl,
                            iWidth:width,
                            iHeight:height,
                            sTitle: "&nbsp;",
                            sMessage: "&nbsp;"
                        };

                        mkPfjs.toggleLightbox(objV);

    }

  this.addPDPTracking = function(sku,valueToPassToOmniture) {
   if (typeof s_gi == 'undefined' ) { return; } /*ignore if omniture not active*/
   if (typeof valueToPassToOmniture == "undefined" ) {return;}
   if (pf.tagging.data.omniture.reportSuiteId === undefined) { return; } /* ignore if omniture account isn't defined*/
    
    var s=s_gi(pf.tagging.data.omniture.reportSuiteId); 
    /*
     * Utility manageVars v1.4 - clear variable values (requires split 1.5)
     */

    s.manageVars=new Function("c","l","f",""
    +"var s=this,vl,la,vla;l=l?l:'';f=f?f:1 ;if(!s[c])return false;vl='pa"
    +"geName,purchaseID,channel,server,pageType,campaign,state,zip,events"
    +",products,transactionID';for(var n=1;n<76;n++){vl+=',prop'+n+',eVar"
    +"'+n+',hier'+n;}if(l&&(f==1||f==2)){if(f==1){vl=l;}if(f==2){la=s.spl"
    +"it(l,',');vla=s.split(vl,',');vl='';for(x in la){for(y in vla){if(l"
    +"a[x]==vla[y]){vla[y]='';}}}for(y in vla){vl+=vla[y]?','+vla[y]:'';}"
    +"}s.pt(vl,',',c,0);return true;}else if(l==''&&f==1){s.pt(vl,',',c,0"
    +");return true;}else{return false;}");

    s.clearVars=new Function("t","var s=this;s[t]='';");

    s.lowercaseVars=new Function("t",""
    +"var s=this;if(s[t]&&t!='events'){s[t]=s[t].toString();if(s[t].index"
    +"Of('D=')!=0){s[t]=s[t].toLowerCase();}}");
 
    s.linkTrackVars = 'eVar11,prop5,products,events';
    s.linkTrackEvents = 'event81';
    s.eVar11 = valueToPassToOmniture;
    s.prop5 = valueToPassToOmniture;
    s.products= ';' + sku; //71T6942
    s.events = 'event81'; //Clicks /* Variables to Set */
    s.tl(this,'o',valueToPassToOmniture);
    s.manageVars("clearVars");
    }      
  

}
/*-----------------------Define Class: Product end--------------------------------------------------------------------------------------------*/
 
/*-----------------------Define Class: FullReel extend Product Class start--------------------------------------------------------------------*/
FullReel.prototype = new Product(); 
FullReel.prototype.constructor = FullReel;
function FullReel(){ 
    this.productType = 0; /*-------0: match nothing; 1: match 'Cut Tape'; 2: match 'Full Reel';--------*/
    this.reelLink = '';
	this.outputHTML = '';
    this.minQty = 1;
    this.packagingText = i18n.cut_tape;
    this.trackingEvts = {};
 
}
/*-----------------------Define Class: FullReel extend Product Class end------------------------------------------------------------*/

/*-----------------------Define function: B360 start--------------------------------------------------------------------*/
function B360(prod){
    dojo.registerModulePath("wcsstore", "../../../../../../wcsstore");
    var css = [dojo.moduleUrl("wcsstore", "ExtendedSitesCatalogAssetStore/cms/asset/js/common/360/button360.css")];
    var head = document.getElementsByTagName("head").item(0), link; 
    for (var i = 0, il = css.length; i < il; i++) { 
      link = document.createElement("link"); 
      link.type = "text/css"; 
      link.rel = "stylesheet"; 
      link.href = css[i]; 
      head.appendChild(link); 
    } 
 this.start = function(url,buttonText,directions1,directions2,closeText){

      var button360HTML = '<a href="javascript:void(0);"  id="view360Button"><img id="view360Img" alt="View 360" src="/wcsstore/ExtendedSitesCatalogAssetStore/cms/asset/images/common/view360Icon.png" />'+buttonText+'</a>';
        
      dojo.place(button360HTML, 'productDescription', "last");
        
      var button = dojo.byId('view360Button');
        
      dojo.connect(button, "onclick", function(evt){
          var mktg_popDiv = document.createElement('div');
          mktg_popDiv.setAttribute('id','foWrapper');
          var mktg_popUpHtml = '<div id="lightbox360" ><div class="close closeOverlay closeOverlayWrap mk-360-close"> <a class="closeIconWrap" href="#"><span class="pfIcon pfClose"></span>&nbsp;'+closeText+'</a> </div><iframe style="display:block" width="100%" height="100%" src="'+url+'" frameborder="0" scrolling="no"></iframe><div class="mk-360-text"><p>'+directions1+'</p><p>'+directions2+'</p></div></div>';
          mktg_popDiv.innerHTML = mktg_popUpHtml;
          document.body.appendChild(mktg_popDiv);
          prod.addPDPTracking(prod.sku,"360 Click");			
          mktg_popDiv.onclick = function(e) {
            dojo.destroy('foWrapper');
          };
      });
 }
}
/*-----------------------Define function: B360 end--------------------------------------------------------------------*/

/*-----------------------Define function: getCustomProductData start--------------------------------------------------------------------*/
function getCustomProductData(prod){
       var skuQuery = prod.sku;/*dojo.byId('itemsArray').value;*/
       if (typeof skuQuery != "undefined")
       {
        dojo.xhrGet({
          url:"/wcsstore/ExtendedSitesCatalogAssetStore/cms/asset/js/common/data/"+skuQuery+".js", handleAs:"json",
          load: function(data){
            if (typeof data.sku != "undefined"){
              if (typeof data.sku.GIS != "undefined"){
                  if (dojo.locale === "en-us"  || dojo.locale === "en-ca") {
                      emphasizeGuaranteeInStock(data);
                  }
               }

              if (typeof data.sku.url != "undefined"){
                   var l360 = new B360(prod);
                   var directions1 = i18n.directions1_360;/*"Click and drag to rotate.";*/
                   var directions2 = i18n.directions2_360;/*"Click on the image to zoom.";*/
                   var buttonText =  i18n.view360;/*"View 360&deg;";*/
                   var closeText = i18n.close;
                   var url = data.sku.url[0];
                   var urlFrag = url.split("/");
                   var page = urlFrag[urlFrag.length-1];
                   var protocol = document.location.protocol; 
                   var page360 = "//www.farnell.com/product360s/product360.php?productshortname="+page.split(".")[0];
                   l360.start(page360,buttonText,directions1,directions2,closeText);
              }
            }
        
          },
         error: function(error){
           console.log("An unexpected error occurred: " + error);
         },
        handle: function(data) {
            /*console.log("handle",data);*/
        },
        failOk : true
        });
       }

 }
/*-----------------------Define function: getCustomProductData end--------------------------------------------------------------------*/


