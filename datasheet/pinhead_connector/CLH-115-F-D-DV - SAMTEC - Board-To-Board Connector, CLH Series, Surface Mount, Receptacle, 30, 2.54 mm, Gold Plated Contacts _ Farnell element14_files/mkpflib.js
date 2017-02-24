/*
 * Premier Farnell
 * Marketing Javascript Library
 * 
 */		
var  mkPfjs = {}, initMk = function (dojo) {
	
	mkPfjs = new (function(){
	
	var version = 'Version 1.82 - 12/11/15';
	
	var bDebugmode = true;
	var varObj = {}; // Global var store

	/* @private
	 * @description ECMA IsArray test
	 * @param {array} varObject - Array object to test
	 */
	var isArrayTest = function(varObject) {
		if (Object.prototype.toString.call( varObject ) === '[object Array]' ) {
			return true;
		} else {
			return false;
		}
	}
	
	/* @private
	 * @description Object test
	 * @param {Array} varObject - Array object to test
	 * @returns {boolean}
	 */
	var isObjectTest = function (varObject) {
		
        if (typeof varObject === 'object' && (isArrayTest(varObject) == false)) { // Is Object but not Array type
        	return true;
       	} else {
       		return false;
       	}
       	
    }
	
	/* @private
	 * @description IsString Test
	 * @param varString - String to test
	 * @returns {boolean}
	 */
	var isStringTest = function(varString) {
		if (typeof varString === 'string' ) {
			return true;
		} else {
			return false;
		}
	}
	
	/* @private
	 * @descripion Truncate text
	 * @param sText {string} Text to truncate
	 * @param iTrunc {integer} Number of characters to truncate text by
	 * @returns {integer}
	 */
    var txtTrunc = function (sText, iTrunc){
        if (sText.length > iTrunc){
            return sText.substring(0,iTrunc) + "...";
        }
    }
	
	/* @private
	 * @description Remove text from a String
	 * @param sText {string} Text content
	 * @param regex {regular expression} Text to remove
	 * @returns {boolean}
	 */
	var txtRemove = function (sText, regex) {
		//if (t.constructor == RegExp) {
			return sText.replace(regex,"");
		//	return sText;
		
	}
    
    /* @private
     * @description Return trailing digits from a string
     * @param {string} sSearchString Text to search
     * @returns {string}
     */
    var getTrailingDigits = function (sSearchString) {
		var re = /.*(\d)/;
		return sSearchString.replace(re,"$1");
	}
	
	/* @private
	 * @description URL param parser
	 * @returns key value pairs
	 */
	var parseParamsFromUrl = function() {
    	var params = {};
        var parts = window.location.search.substr(1).split('&');
        for (var i = 0; i < parts.length; i++) {
        	var keyValuePair = parts[i].split('=');
            var key = decodeURIComponent(keyValuePair[0]);
            params[key] = keyValuePair[1] ? decodeURIComponent(keyValuePair[1].replace(/\+/g, ' ')) : keyValuePair[1];
        }
        return params;
    }
	
	/* @private
	 * @description is IE
	 * @returns {integer || boolean} IE version
	 */
	var isIexplorer = (function() {
	  var patt = /MSIE/, 
		ua = navigator.userAgent
		
	  if (patt.test(ua) === true) { return true; }
	})();
	
	/* @private
	 * @description Get IE version num
	 * @returns {integer || boolean} IE version
	 */
	var ieVersion = (function() {
	  var patt = /MSIE/, 
		ua = navigator.userAgent,
		patt2, msStr, ieVer;
	
	  if (patt.test(ua) === false) { return false; }
	  patt2 = /MSIE [0-9]{1,2}/;
	  msStr = ua.match(patt2)[0];
	  ieVer = msStr.substr(msStr.indexOf(' ')+1);
	  
	  return parseInt(ieVer);
	})();
    
    //ADD Link to element
    var addLink = function (object) {
    	if(dojo.byId(object.id)) {
        	dojo.byId(object.id).href = object.link;
       	} else {
       		return false;
       }
    }
	
	
	// getfeed(feed url, feedType('socialGroup','communityGroup'), feedGroup(community, max results (integer), html elementID)
	var getE14Feed = function (url, feedType, feedGroup, amount, el){
        if(feedType === "communityGroup") {
            var contentObj = {feedType: "json", community: feedGroup};
        } else {
            var contentObj = {feedType: "json", socialGroup: feedGroup}; 
        }
        
        // Called by 'dojo.io.script.get' onLoad  
        dojo.io.script.get({
            // Use the get method
            url: url,
            // The callback parameter
            handleAs: "json",
            callbackParamName: "callback", // Name of callback function
            content: contentObj,
             // The success callback
            load: function(feedData) {
                //Call helper function
                onE14FeedLoad(feedData, amount, el);
            }
        });
	
    }
    
    // getE14Feed: onload FeedData helper function
    function onE14FeedLoad (feedData, amount, el) {
        var entries = feedData.entries;
        var entriesLength = entries.length;
        var message = "";
        
            // Populate 'view all' links to header and foot of discussion feed
            addLink({id:"e14-all-discussions-head", link: feedData.link});
            addLink({id:"e14-all-discussions-foot", link: feedData.link});
            
            //if(dojo.byId("e14-all-discussions-head")) {
                //dojo.byId("e14-all-discussions-head").href = feedData.link;
            //}
            //if(dojo.byId("e14-all-discussions-foot")) {
                //dojo.byId("e14-all-discussions-foot").href = feedData.link;
            //}
            
            // If there are entries returned...
            if(entries && entriesLength) {
                // For every entry returned
                // Iterate thru data
                if (entriesLength < amount) { // Manage cap on 'entries' received
                    amount = entriesLength;
                }
                // TO DO: ForEach: include
                for(var i = 0; i < amount ;i++){
                	var entriesi = entries[i];   
                    message += "<p><a href='" + entriesi.link + "' class='title' target='_blank'>" + entriesi.title + "</a></p>";
                }
                    
            } else { // Output "no entries" message
                message = "<p>Unfortunately this feed is unavailable at the moment</p>";
            }
            // Set html
            dojo.byId(el).innerHTML = message;
    }
    
    var twitterCallback = function(feedData,twitterFrom,twitterAmount,twitterEl) {
		var feedData = feedData;
					
		// Build url's in Twitter body text
		function urlify(rawText) {
			var urlRegex = /(http:\/\/t\.co\/[a-zA-Z0-9]+)/g;
			return rawText.replace(urlRegex, function(url) {
				return '<a href="' + url + ' target="_blank">' + url + '</a>';
			})
		 }
						
		function parseHashtagsUsers(rawText) {
			var urlRegex = /([@#]+[a-zA-Z0-9]+)/g;
			return rawText.replace(urlRegex, function(url) {
				return '<a href="http://www.twitter.com/' + url + ' target="_blank">' + url + '</a>';
			})
		}
		 
		// Populate 'View all link' at head of Twitter module
		addLink({id:"mk-twtr-view-all", link: "http://twitter.com/@" + twitterFrom});
		
		var res = feedData;
		var resLength = res.length;
		var message = "";

		if(res && resLength) {
			if (resLength < twitterAmount) { // Set maximum feeds limit
				var maxRes = resLength;
			}
			else {
				var maxRes = twitterAmount;
			}
					
			for(var i = 0; i < maxRes ;i++){     
				var twtrBody = urlify(res[i].text); // URLify tweet body
				var twtrBody = parseHashtagsUsers(twtrBody); //Parse users and hashtags to links
				message += "<div class='mk-twtr-tweet-wrap'><p class='mk-twtr-tweet-bodytext'><a target='_blank' href='http://twitter.com/" + res[i].user.screen_name + "'>@" + res[i].user.screen_name + " </a>" + twtrBody + "</p></div>";
			}
		} else { // Output "no entries" message
			message = "<p class='mk-twtr-tweet-bodytext'>Unfortunately this feed is unavailable at the moment</p>";
		}
		dojo.byId(twitterEl).innerHTML = message;
	}
    
    // @description Twitter Feed    
    var getTwtrFeed = function (url, twtrFrom, twtrAmount, twtrEl){
		twitterUrl = url;
		twitterFrom = twtrFrom;
		twitterAmount = twtrAmount;
		twitterEl = twtrEl;
		dojo.io.script.get({ 
			url: twitterUrl,
			handleAs: "json",
			callbackParamName: "callback", // Name of callback function
			content: {
				screen_name: twitterFrom
				//callback: 'mkPfjs.twitterCallback'
			},
			load: function(feedData) {
                //Call helper function
                mkPfjs.twitterCallback(feedData, twitterFrom, twitterAmount, twitterEl);
            }
		});
    };
    
    
     // youTube player, with Playlist
    var yt_player = function (url) {

		var playlist_limit = 10;

        var ytplayer_playlist; // Global Playlist Object
        var ytplayer_playitem; // Global Playlist item

        // yt_player onLoad callback function
        var on_yt_playerLoad = function (data){

            var videos = data.items;

            if (videos.length > 0) { // Videos present in Playlist

                // Ascertain ceiling video count
                if (videos.length > playlist_limit) {
                    var maxVideos = playlist_limit;
                } else{
                    var maxVideos = videos.length;
                }

                // Build attribute object for each video entry in playlist
                var playlist = new Array();
                for (var i=0; i < maxVideos; i++) {
                    var dfEntry = videos[i];

                    var video = {
                        id: dfEntry.contentDetails.videoId,
                        title: dfEntry.snippet.title,
                        description: dfEntry.snippet.description,
                        videourl: "https://www.youtube.com/embed/3NK3whdJFx0?list=" + dfEntry.contentDetails.videoId,
                        thumburl: dfEntry.snippet.thumbnails['default']['url'],
                        thumbheight: dfEntry.snippet.thumbnails['default']['height'],
                        thumbwidth: dfEntry.snippet.thumbnails['default']['width']
                    };

                    playlist.push(video);
                }

                // Set global playlist variables
                ytplayer_playlist = playlist;
                ytplayer_playitem = 0;

                // Call player render functions
                ytplayer_render_player(playlist);
                ytplayer_render_playlist(playlist);
            }

        }

        // Render Main iFrame Player
        var ytplayer_render_player = function (playlist) {
            // Write iFrame
            var iVideo ="<iframe src='http://www.youtube.com/embed/" + playlist[0].id + "?html5=1' class='mk-mod7-iframe'></iframe>"


            dojo.byId("mk-ytplayer_div1").innerHTML = iVideo;

        }

        // Instantiate Playlist
        var ytplayer_render_playlist = function (playlist) {

    	   for ( var i = 0; i < playlist.length; i++ ){

               var row = dojo.doc.createElement( "div" );
               row.className = "mk-col-100 mk-mod7-thumb-row mk-fixed-left-125-fluid-right";

                var leftcol = dojo.doc.createElement( "div" );
                leftcol.className = "mk-left-fixed";

               var rightcol = dojo.doc.createElement( "div" );
                rightcol.className = "mk-right-fluid";

               var textA = dojo.doc.createElement( "a" );
                textA.href = "#ytplayer";
                textA.onclick = (
                function( j ){
                    return function( )
                    {
                        ytplayer_playitem = j;
                        ytplayer_playlazy( 1000 );
                    };
                }
              )( i );

               var text = dojo.doc.createTextNode(playlist[i].title);
              textA.appendChild(text);
              textA.className = "mk-novisited-text";

               var playlistHeader = dojo.doc.createElement("div");
			  playlistHeader.className = "mk-mod7-playlist-header";
              playlistHeader.appendChild(textA);
              rightcol.appendChild( playlistHeader );

               var img = dojo.doc.createElement( "img" );
              img.src = playlist[i].thumburl;
              img.className = "mk-mod7-thumb-img";

               var imgA = dojo.doc.createElement( "a" );
              imgA.href = "#ytplayer";
              imgA.onclick = (
              function( j ){
                return function( )
                {
                        ytplayer_playitem = j;
                        ytplayer_playlazy( 1000 );
                    };
                }
              )( i );

               imgA.appendChild( img );
              leftcol.appendChild( imgA );

               var p = dojo.doc.createElement("p")

               // Remove URL at head of description
			  var urlRegex = /^http:\/\/.+\/ /g;
			  var sDesc = txtRemove(playlist[i].description, urlRegex);

               // Truncate description text to 55 characters
			  sDesc = txtTrunc(sDesc, 80);
		      var text = dojo.doc.createTextNode(sDesc);
			  p.appendChild(text);

               rightcol.appendChild( p );


               row.appendChild( leftcol );
              row.appendChild( rightcol );

               dojo.byId( "mk-ytplayer_div2" ).appendChild( row );
            }

        }


        var ytplayer_playlazy = function ( delay ) {
            // Static variables
            if ( typeof ytplayer_playlazy.timeoutid != 'undefined' ) {
              window.clearTimeout( ytplayer_playlazy.timeoutid );
            }

            ytplayer_playlazy.timeoutid = window.setTimeout( ytplayer_play, delay );
        }

        // Populate Main Player
        var ytplayer_play = function ( ) {
            var o = document.getElementById( 'ytplayer_object' );
            if ( o ) { // Flash Object (NOTE: NOT USED)
                o.loadVideoById( ytplayer_playlist[ytplayer_playitem].id );
            } else { // HTML5
                var iVideo ="<iframe src='http://www.youtube.com/embed/" + ytplayer_playlist[ytplayer_playitem].id + "?html5=1' class='mk-mod7-iframe'></iframe>"
                dojo.byId("mk-ytplayer_div1").innerHTML = iVideo;
            }

        }

        // Ready Handler (this function is called automatically by YouTube JavaScript Player when it is ready)
        // * Sets up handler for other events
        var onYouTubePlayerReady = function ( playerid ) {
            var o = document.getElementById( 'ytplayer_object' );
            if ( o ) {
                o.addEventListener( "onStateChange", "ytplayerOnStateChange" );
                o.addEventListener( "onError", "ytplayerOnError" );
            }
        }

        // State Change Handler
        // * Sets up the video index variable
        // * Calls the lazy play function
        var ytplayerOnStateChange = function ( state ) {
          if ( state == 0 ) {
            ytplayer_playitem += 1;
            ytplayer_playitem %= ytplayer_playlist.length;
            ytplayer_playlazy( 5000 );
          }
        }

        // Error Handler
        // * Sets up the video index variable
        // * Calls the lazy play function
        var ytplayerOnError = function ( error ) {
          if ( error ) {
            ytplayer_playitem += 1;
            ytplayer_playitem %= ytplayer_playlist.length;
            ytplayer_playlazy( 5000 );
          }
        }

        //format the url for youTube v3 api
        var playlistId = url.substr(url.lastIndexOf('/') + 1);
        var v3Url = "https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,%20snippet%20&playlistId=" + playlistId + "&key=AIzaSyC4JsZ45zu5WG22QAgMk-tso-fsvWe5zxo";

        // Get youTube data
        dojo.io.script.get({
            callbackParamName: "callback",
            handleAs: "json",
            url: v3Url,
            content: {format: "5", v: "2"},
            load: function(data){
                on_yt_playerLoad(data);
            }
        });
       
     }
    
    /* @public
     * @description Tabbed content, mirroring Salmon implementation
     * @see pfLib.js
     * @param {object} oTabParam
     * @param {boolean} [oTabParam.bDualMenuBar = false] - optional boolean parameter, Tabbed Content has dual tabbed menu bar 
     */
    // init function will run on page load. Called from pf.base.init() which is
    // called instantiated by dojo.addOnLoad
    var tabInit = function(oTabParam) {
    	if (isObjectTest(oTabParam))
    		var bDualMenuBar = typeof oTabParam.bDualMenu !== 'undefined' ? oTabParam.bDualMenu : false; // default Dual Menu to false
    	else
    		var bDualMenuBar = false;
    	    	
        initialiseTabs();
        addEvents(bDualMenuBar);
        
    }

    /** * PRIVATE FUNCTIONS ** */
    var addEvents = function (bDualMenuBar) {
		var elements = {};
	        
        var e = {
            "ul[id^='mk-tabs-list'] li a" : { // all tabs lists
                // event names become event connections:
            	onclick : function(evt) {
		        	if (!dojo.byId('bom')) {
		            	evt.preventDefault(); // stop the default event handler
		            }
		            /* Content and Menu ID's */
		            var contentId = this ? this.rel : this.parentNode.rel;
		            elements[contentId] = dojo.byId(contentId);
		
		            var menuEle = this == '' ? this.parentNode : this;
		            
		            setupTabs(elements[contentId], menuEle, bDualMenuBar);
            
        		}
		    },
		    "a.tabLink" : {
		        // event names become event connections:
		        onclick : function(evt) {
		    	    evt.preventDefault(); // stop the default event handler
		            elements[evt.target.rel] = dojo.byId(evt.target.rel);
		            elements['tabLink'] = dojo.query('#' + evt.target.rev + ' li a[rel~=' + evt.target.rel + ']');
		            // setupTabs(elements[evt.target.rel], elements['tabLink']);
		        }
		    }
        };

        dojo.behavior.add(e);
        dojo.behavior.apply();
        
    }

    var initialiseTabs = function () {
        //dojo.forEach(dojo.query('ul.tabsMenu li a'), function(entry, i) {
        dojo.forEach(dojo.query('ul#mk-tabs-list li a'), function(entry, i) {
            if (dojo.hasClass(entry.parentNode, 'mk-tab-header-active')) {
             	dojo.addClass(entry.rel, 'mk-tab-pane-active');
                return true;
            }
        });
    }

    var setupTabs = function (eleContent, eleMenu, bDualMenuBar) {		
        // Loops all content regions to remove class 'mk-tab-pane-active'
        var contentDivs = dojo.query('> div', eleContent.parentNode);
        dojo.forEach(contentDivs, function(entry, i) {
            dojo.removeClass(entry, 'mk-tab-pane-active');
        });
		
		// Get all tabs
		if (bDualMenuBar) {
			var menuLis = dojo.query('li[class^="mk-tab"]', eleContent.parentNode.parentNode);
		} else {
			var menuLis = dojo.query('> li', eleMenu.parentNode);
		}
						
        // Loops all menu regions to remove class 'mk-tab-header-active'
        dojo.forEach(menuLis, function(entry, i) {
            dojo.removeClass(entry, 'mk-tab-header-active');
        });

        // Adds 'selected' and 'displayBlock' classes to the appropriate content
        // and menu elements
        dojo.addClass(eleMenu, 'mk-tab-header-active');
        dojo.addClass(eleContent, 'mk-tab-pane-active');

    }


	/* Show/Hide function
	 * @param {array | object | string} idTargetConnection - Target ID node name
	 * @param {object} idTargetConnection.targetID - Base Target ID name to be iterated
	 * @param {object} idTargetConnection.connectionID - Base Connection ID name to be iterated
	 * @param {array} idTargetConnection - Array of Objects as above
	 * @param {string} idTargetConnection - Name of Target ID node
	 * @param {string} [idConnection] - Name of  Connection ID node, required when 'idTargetConnection' is a string
	 * @param {integer} [iNumTooltips] Number of Connections, required when 'idTargetConnection' is an object
	 * @param {boolean} [bTooltip=true] Tooltip behaviour
	 * @param {boolean} [bOnCLick=true] OnMouse Click event behaviour
	 * @param {boolean} [bFadein=true] Fade-in animation
	 */
    var showHide = function (idTargetConnection, idConnection, iNumTooltips, bTooltip, bOnClick, bFadeIn) {
        /* @private
		 * @description return string with trailing digits removed
		 * @param {string} sSearchString
		 */
		var removeTrailingDigits = function (sSearchString) {
			var re = /(.*)\d/;
			return sSearchString.replace(re,"$1");
		}
        
        var idTargetConnection = idTargetConnection;
        var idConnection = idConnection;
        var iNumTooltips = iNumTooltips;
        
        var bTooltip = bTooltip;
        var bOnClick = bOnClick;
        var bFadeIn = bFadeIn;
        
        // Set default Tooltip behaviour
        bTooltip = typeof bTooltip !== 'undefined' ? bTooltip : false; 
        
        // Set mouse onClick event to false; therefore mouse on over/out true
        bOnClick = typeof bOnClick !== 'undefined' ? bOnClick : false; 
        
        // Set fadeIn to True, by default
        bFadeIn = typeof bFadeIn !== 'undefined' ? bFadeIn : true; 
        
        // Helper functions
        /* Check if correctly formed Target/Connection object with key/value pairs of node name IDs
         * @param {object} idTargetConnection - Object to test
         * 
         * TO DO: Deprecate this for 'isObjectTest' helper function
         */
        var targetConnectionObjectTest = function (idTargetConnection) {
        	if (typeof idTargetConnection === 'object' && (isArrayTest(idTargetConnection) == false)) { // Is Object but not Array type
        		if ((typeof idTargetConnection.targetID !== 'undefined') && (typeof idTargetConnection.connectionID !== 'undefined')) {
        			return true;
 
        		} else if (bDebugmode === true) {
        			console.log("'idTargetConnection' requires the following key/value pairs: 'targetBaseID' and 'connectionBaseID'");
        			return false;
        		}
        	} else {
        		return false;
        	}
        }
        
        
        /*
         * Create Show/Hide Connection
         * @param {string} idTarget - Target node connection ID
         * @param {string} idConnection - Connection node connection ID
         */
        var create = function (idTarget, idConnection) {
            var target = dojo.byId(idTarget);
            var connection = dojo.byId(idConnection);
            var sSavedConnectionID; // saved connection for onclick toggle connection
            
            if (bOnClick !== true) { // Connect onMouseOver events
            	var eIn = 'onmouseenter';
            	var eOut = 'onmouseleave';
            } else {
            	var eIn = 'onclick';
            }
            
            dojo.connect(target, eIn, function(evt){
            	// If 'tooltip' behaviour, take Connection Tooltip and add it as a child of the Target div
            	if (bTooltip === true) {      		
            		dojo.place(connection, target, "first"); // add Connection to the node Target as the first-child
            	}
               	
            	if (eIn === 'onclick') {
            		evt.preventDefault(); // stop the default event handler
            		// Hide previous connection
            		if (typeof create.sSavedConnectionID !== 'undefined'){
            	        if (create.sSavedConnectionID !== connection.id){ // only hide regions if state changed
            	        	dojo.forEach( // hide all regions
						    	dojo.query('div[id^="' + removeTrailingDigits(create.sSavedConnectionID) + '"]'),
					        	function(nConnection){ // Get initial active button
					        		dojo.style(nConnection, "display", "none");
					        	}
		    				);
            	        }

            		}
            		create.sSavedConnectionID = connection.id; // save connection id
            	}
            	
            	// Show connection for all events
				dojo.style(connection,"display", "block"); // Show connection
				if (bFadeIn === true) {
                	dojo.style(connection, "opacity", "0");
                	var fadeArgs = {
                   		node: connection
                   	};
                   	dojo.fadeIn(fadeArgs).play();
               	}
				
            	sSavedConnectionID = connection.id; // save this ConnectionID
                    
            });
            
            if (eOut === 'onmouseleave') { // Close on it's connection
            	dojo.connect(target, eOut, function(){ // TO DO: Consolidate Duplicate code as above
					// If FadeIn, then FadeOut
					if (bFadeIn === true) {
	                	dojo.style(connection, "opacity", "1");
	                	var fadeArgs = {
	                   		node: connection
	                   	};
	                   	dojo.fadeOut(fadeArgs).play();
		            }
		            	
		            dojo.style(connection,"display", "none"); // Hide toolTip
      
	            });
	            
            }
			
        }
        
        // Parameter Check
        if (targetConnectionObjectTest(idTargetConnection)) { // ** Object of Target/Connection Key/Value pairs Mode 
        	
        	// Require Number of tooltips count (iNumTooltips)
        	if (typeof iNumTooltips === 'number') {
        		for(var i = 0; i < iNumTooltips; i++) {	
	        		var idTarget = idTargetConnection.targetID+i;
	        		var idConnection = idTargetConnection.connectionID+i;

	        		create(idTarget, idConnection);
	        	}
 				return true;
 				
        	} else if (bDebugmode === true) {
        		console.log("'iNumTooltips' parameter is required with an integer Tooltip count");
        		return false;	
        	}
        	

        } else if (isArrayTest(idTargetConnection) == true) { // ** Array of Objects Mode
       		
        	for(i=0; i<idTargetConnection.length; i++) {

        		if (targetConnectionObjectTest(idTargetConnection[i])) {
        			
        			var idTarget = idTargetConnection[i].targetID;
        			var idConnection = idTargetConnection[i].connectionID;

        			create(idTarget, idConnection);
        			
        		} else if (bDebugmode === true) {
        			console.log(idTargetConnection[i], 'is not a correctly formed Target/Connection')
        			return false;
        		}
        		
        	}
        } else if (typeof idTargetConnection === 'string') { // ** Legacy Mode
        	//Requires associated 'idConnection' String
        	if (typeof idConnection === 'string') {
        		
        		var idTarget = idTargetConnection;
        		var idConnection = idConnection;
        			
        		create(idTarget, idConnection);
        		
        	} else if (bDebugmode === true) {
        		console.log("Require an 'idConnection' String");
        		return false;
        	}
        	
        }

    }
    
    /*
     * @description Annotation, with tooltip, optionally linking to overlay
     * @see 'lab-supplies-selector-tool'
     * @param {string} annotionBaseID
     * @param {string} tooltipBaseID
     * @param {string} overlayBaseID
     * @requires 'showHide' function, within this library
     * @enum {string} 'data-tooltip' attribute on each annotation element
     * @enum {string} 'data-overlay' attribute on each tooltip element [optional]
     */
    var tooltipWithOverlay = function(annotionBaseID, tooltipBaseID, overlayBaseID) {

    	// connect tooltips
    	dojo.forEach(
			dojo.query('div[id^="' + annotionBaseID + '"]'), function(annotationTag) {
				if(dojo.hasAttr(annotationTag,'data-tooltip')){
					var annotatationID = dojo.attr(annotationTag,'id');
					var tooltipID = dojo.attr(annotationTag,'data-tooltip');
					showHide(annotatationID,tooltipID,false,true,false,false);
				}
			}
		);	
		// connect overlays
		dojo.forEach(
			dojo.query('div[id^="' + tooltipBaseID + '"]'), function(tooltipTag) {
				if(dojo.hasAttr(tooltipTag,'data-overlay')){
					var tooltipID = dojo.attr(tooltipTag,'id');
					var overlayID = dojo.attr(tooltipTag,'data-overlay');
					var nOverlay = dojo.query('.mk-close a',dojo.byId(overlayID))[0];
					showHide(tooltipID,overlayID,false,false,true,false);

				}
			}
		);
		// connect close buttons
		dojo.forEach(
			dojo.query('div[id^="' + overlayBaseID + '"]'), function(overlayBaseTag) {
				dojo.connect(dojo.query('.mk-close a',dojo.byId(overlayBaseTag))[0],'onclick',overlayBaseTag,function(e){
					e.preventDefault();
					dojo.style(this,"display", "none");
				});

			}
		);
		
		moveOverlays(overlayBaseID);
    }
    
	//load video content in iframe overlay
	var toggleVideoContent = function (url, idToggleMore, idToggleLess, idToggleContent){
		 dojo.connect(dojo.byId(idToggleMore),'onclick', function(evt){
	       	var iVideo ="<iframe src='"+ url +"' class='mk-mod7-iframe'></iframe>";
            dojo.byId("mk-ytplayer_div1").innerHTML = iVideo;
        });
		
		toggleExtendedContent(idToggleMore, idToggleLess, idToggleContent);	
	}
	
	var toggleVideoPlaylist = function (url, idToggleMore, idToggleLess, idToggleContent){
		 dojo.connect(dojo.byId(idToggleMore),'onclick', function(evt){
	        yt_player(url);
        });
		
		toggleExtendedContent(idToggleMore, idToggleLess, idToggleContent);	
	}
	
	/*
     * @description Toggle overlay
     * @see 'cem-propositional-video'
     * @param {string} linkBaseID
     * @param {string} overlayBaseID
     * @requires 'showHide' function, within this library
     * @enum {string} 'data-overlay' attribute on each tooltip element [optional]
     */
    var toggleOverlay = function(linkBaseID, overlayBaseID) {
		// connect overlays
		dojo.forEach(
			dojo.query('div[id^="' + linkBaseID + '"]'), function(linkTag) {
				if(dojo.hasAttr(linkTag,'data-overlay')){
					var linkID = dojo.attr(linkTag,'id');
					var overlayID = dojo.attr(linkTag,'data-overlay');
					
					var nOverlay = dojo.query('.mk-close a',dojo.byId(overlayID))[0];
					
					console.log('linkID',linkID);
					console.log('overlayID',overlayID);
					
					showHide(linkID,overlayID,false,false,true,false);

				}
			}
		);
		// connect close buttons
		dojo.forEach(
			dojo.query('div[id^="' + overlayBaseID + '"]'), function(overlayBaseTag) {
				dojo.connect(dojo.query('.mk-close a',dojo.byId(overlayBaseTag))[0],'onclick',overlayBaseTag,function(e){
					e.preventDefault();
					dojo.style(this,"display", "none");
				});

			}
		);
		
		moveOverlays(overlayBaseID);
    }
	
    
	//load video content in iframe overlay
	var toggleVideoContent = function (url, idToggleMore, idToggleLess, idToggleContent){
		 dojo.connect(dojo.byId(idToggleMore),'onclick', function(evt){
	       	var iVideo ="<iframe src='"+ url +"' class='mk-mod7-iframe'></iframe>";
            dojo.byId("mk-ytplayer_div1").innerHTML = iVideo;
        });
		
		toggleExtendedContent(idToggleMore, idToggleLess, idToggleContent);	
	}
	
	var toggleVideoPlaylist = function (url, idToggleMore, idToggleLess, idToggleContent){
		 dojo.connect(dojo.byId(idToggleMore),'onclick', function(evt){
	        yt_player(url);
        });
		
		toggleExtendedContent(idToggleMore, idToggleLess, idToggleContent);	
	}
	
	
	/*
     * @description Show/Hide video lightbox
     * @see 'new-web-features-3' / Matt Ulbert
     * @param {object} oVideo
     * @param {string} oVideo.sTargetID - Target ID name of link to open lightbox overlay
     * @param {string} oVideo.sConnectID - Connection ID name of lightbox overlay
     * @param {string} oVideo.sTitle - Title of video
     * @param {string} oVideo.sMessage - Message text for Video
     * @param {string} oVideo.sTemplatePath - Directory path to templates
     * @param {string} oVideo.sTemplateFilename - Overlay template name
     * @param {string} oVideo.sVideoURL - Video URL
     * @param {integer} oVideo.iWidth - Video width
     * @param {integer} oVideo.iHeight - Video height
     * 
     */
	var toggleLightbox = function(oVideo) {
		var iOverlay = getTrailingDigits(oVideo.sConnectID);
		
		var sVideoOverlayBaseID = oVideo.sConnectID.replace(/\d+/,"");
		var sVideoOverlayForeClass = "mk-overlay-fore";
		var sVideoCloseBaseID = "mk-lightbox-close"; // constants
		var sVideoContentBaseID = "mk-lightbox-content";
		var sVideoTitleBaseID = "mk-lightbox-title";
		var sVideoMessageBaseID = "mk-lightbox-message";
		var iVideoPadding = 12;
		
		var nTarget = dojo.byId(oVideo.sTargetID);
		var nConnection = dojo.byId(oVideo.sConnectID);
		
		// Connect Lightbox
		var connectLightBox = function (sTargetID, sLightBoxID, sVideoContentID, oVideo, sVideoTitleID, sVideoMessageID, sVideoCloseID) {
			var nTarget = dojo.byId(sTargetID);
			var nLightBox = dojo.byId(sLightBoxID);
			var nVideoClose = dojo.byId(sVideoCloseID);
			
			dojo.connect(nTarget,'onclick', nLightBox, function(evt){ // Setup connections
				evt.preventDefault();
				
				if (dojo.hasClass(this,"displayNone")) { // Make overlay visible
					dojo.removeClass(this, "displayNone");
				}
									
				nVideoContent = dojo.byId(sVideoContentID); // Set video src
				
				var iVideo ="<iframe src='"+ oVideo.sVideoURL +"'></iframe>";
				nVideoContent.innerHTML = iVideo;
				nIframe = dojo.query('> iframe',nVideoContent)[0];
	
				if (oVideo.iWidth !== null){ // Set video dimensions
					dojo.style(nIframe,"width", oVideo.iWidth + "px");
				}
				if(oVideo.iHeight !== null){
					dojo.style(nIframe,"height", oVideo.iHeight + 5 + "px");
				}
				
				if((ieVersion <= 7)) { // Set Lightbox width
		  		dojo.style(dojo.query('div[class="' + sVideoOverlayForeClass + '"]')[0],"width", oVideo.iWidth + (iVideoPadding * 2) + "px");
				}
				
				var nVideoTitle = dojo.byId(sVideoTitleID); // Set title and message
				var nVideoMessage = dojo.byId(sVideoMessageID);

				//if (nVideoTitle !== null && oVideo.sTitle !== null) {
					nVideoTitle.innerHTML = oVideo.sTitle;
				//}
				//if (nVideoMessage !== null && oVideo.sMessage !== null) {
					nVideoMessage.innerHTML = "<p>" + oVideo.sMessage + "</p>";
				//}
	
			});
			if (nVideoClose !== null) {
				dojo.connect(nVideoClose,'onclick', nLightBox, function(evt){
					evt.preventDefault();
					if (dojo.hasClass(this,"displayNone") === false) {
						dojo.addClass(this, "displayNone");
					}
					dojo.empty(sVideoContentID); // Remove video
				});
			}
				
		}
		
		// Helper: Parse Unique IDs into lightbox template
		function uniqueIDs(aPatt, rawText, iId) {
			if (isArrayTest(aPatt) === true) {
				for (sPatt in aPatt){
					var re = new RegExp('id="' + aPatt[sPatt] + '"', "g");
					var sTxt = rawText.replace(re, 'id="' + aPatt[sPatt] + iId + '"');
					rawText = sTxt
				}				
			    return sTxt;
			}
		}
		
		/* @private
     	* @description Get Template text from file
     	* @param {string} sFilePath Path to text file, if sFilePath == "" then sFilename includes path
     	* @param {string} sFilename Filename
     	* @param {object} returns callback function object, with response returned in it as a param
     	* @see toggleLightbox function
     	*/
		var connectionFromTemplate = function(sFilePath, sFilename) {
			var url = (sFilePath !== "") ? (sFilePath + sFilename) : sFilename;
			var getAjaxTemplate = dojo.xhrGet({
				url: url,
				handleAs: "text",
				timeout: 5000,
				preventCache: false,
				load: function(response, ioArgs){
					if (response !== null) {
						// rename incre ID names, based on current (Assume base number of template is '1')						
						var aIdBases = [sVideoOverlayBaseID, sVideoTitleBaseID, sVideoCloseBaseID, sVideoContentBaseID, sVideoMessageBaseID];
						var sTemp = uniqueIDs(aIdBases, response, iOverlay);				
						//Add to DOM
						var nNode = dojo.create("div", { innerHTML: sTemp }, dojo.body(), "last" );
						//Connect
						connectLightBox(oVideo.sTargetID, oVideo.sConnectID, sVideoContentBaseID + iOverlay, oVideo, sVideoTitleBaseID + iOverlay, sVideoMessageBaseID + iOverlay, sVideoCloseBaseID + iOverlay); // Make connection
					}
				},
				error: function(error){
					console.error('error fetching template:', error);
				}
			});
		}
		
		if( ieVersion ? (nTarget !== undefined) : (nTarget !== null) ) {				
			if( ieVersion ? (nConnection !== undefined) : (nConnection !== null) ) { // Overlay present, just connect it
				connectLightBox(oVideo.sTargetID, oVideo.sConnectID, sVideoContentBaseID + iOverlay, oVideo, sVideoTitleBaseID + iOverlay, sVideoMessageBaseID + iOverlay, sVideoCloseBaseID + iOverlay); // Make connection
			} else { // Create lightbox overlay from template
				connectionFromTemplate(oVideo.sTemplatePath, oVideo.sTemplateFilename); // Get and process template
			}
		}

	}
	
	// Toggle Extended Content
	var toggleExtendedContent = function (idToggleMore, idToggleLess, idToggleContent) {
	    
	    // TO DO: check for required page nodes
	    var elToggleMore = dojo.byId(idToggleMore);
	    var elToggleMoreParent = dojo.query(elToggleMore).parent()[0]; // Parent p tag of 'more' link
        var elToggleLess = dojo.byId(idToggleLess);
        var elToggleContent = dojo.byId(idToggleContent);
        
        // Connect 'More' toggle
        if((elToggleMore != null) && (elToggleMoreParent != null)) {
            dojo.connect(elToggleMore,'onclick', function(e){
                e.preventDefault();
                // Show extended content
                if(elToggleContent != null) {
                    dojo.style(elToggleContent,"display","block"); // Show extended block
                    dojo.style(elToggleMoreParent,"display","none"); // Hide 'More' toggle link
                }
            });
        }
       
       if((elToggleLess != null) && (elToggleMoreParent != null)) {
            // Connect 'less' toggle
            dojo.connect(elToggleLess,'onclick', function(e){
               e.preventDefault();
               
               if(elToggleContent != null) {
                   // Hide parent container (extended content)
                   dojo.style(elToggleContent,"display","none"); // Hide extended content
               }
               
               if(elToggleMoreParent != null) {
                   // Show 'More' toggle link
                   dojo.style(elToggleMoreParent,"display","inline"); // Show 'More' Toggle
    		   }
    		   
    		   if(idToggleContent == "mk-more-video-content-1"){
    				dojo.empty("mk-ytplayer_div1");
    				dojo.empty("mk-ytplayer_div2"); 
    			};
            });
        }
            
	}
	
	/* @description Toggle Class on target, potential replacement for showHide
	 * @param {string} conn Connection ID
	 * @param {string} targ Target ID
	 */
	var toggleShowHide = function(conn,targ,closeEl){
		dojo.connect(dojo.byId(conn),'onclick',dojo.byId(targ),function(e){
			e.preventDefault();
			
			if (dojo.hasClass(this,"displayNone")) {
				dojo.removeClass(this, "displayNone");
			} else {
				dojo.addClass(this, "displayNone");
			}
		});		
		dojo.connect(dojo.byId(closeEl),'onclick',dojo.byId(targ),function(e){
			e.preventDefault();
			if (dojo.hasClass(this,"displayNone")) {
				dojo.removeClass(this, "displayNone");
			} else {
				dojo.addClass(this, "displayNone");
				
			}
		});
		
	}
	
	/* @description ToggleQuestion - to toggle show/hide of answers to associated questions
	 * @see Help section FAQs
	 * @param {string} el - Class name of questions
	 */
	var toggleQuestion = function(el){
		dojo.query(el).connect("onclick", function(evt) {
	    	var tAttr = dojo.query(evt.currentTarget).attr("data-answer");    	
	    	dojo.toggleClass(tAttr[0], "displayNone");
	 	});
	}
	
	/* @description faqQuestion - to toggle show/hide of answers to associated questions
	 * @see Help section FAQs
	 * @param {string} ans - Class of answer (E.G. '.ux-answer')
	 * @param {string} ques - Class of answer (E.G. '.ux-question')
	 */
	var faqQuestion = function(ans, ques){
		//require hash tag library
		dojo.require("dojo.hash");
		var hv = dojo.hash();
		
		// Init - Hide all answers
	    dojo.query(ans).toggleClass("displayNone");
	    toggleQuestion(ques);
	    
	    // If Hash
	    if(hv !== ""){
			var splithv = hv.split('-');
			var hvid = 'ux-'+splithv[1];
			
	    	if(dojo.hasClass(hvid, "displayNone")){
	  			dojo.removeClass(hvid, "displayNone");
			}
	    }

	}
	
	
	/* @description Toggle all Questions
	 * @see Help section FAQs
	 * @param {string} el ID name of button/link (E.G. '#showHideAll') 
	 */
	var toggleAllQuestions = function(el) {
		var bExpand = true;
		dojo.query(el).connect("onclick", function(evt) {
			var innerTxt = dojo.query(evt.currentTarget)[0].innerText;
			dojo.query(evt.currentTarget)[0].innerText = dojo.query(evt.currentTarget).attr("data-altTxt")[0];
			dojo.query(evt.currentTarget).attr("data-altTxt",innerTxt);
	    	var tAttr = dojo.query(evt.currentTarget).attr("data-answer");
			dojo.forEach(
				dojo.query('div[class^="' + tAttr[0] +'"]'), function(nAnswer) {
					if (bExpand === true) {
						if(dojo.hasClass(nAnswer, "displayNone")) {
							dojo.removeClass(nAnswer, "displayNone");
						}
					} else {
						dojo.addClass(nAnswer, "displayNone");
					}
				}
			);
			if (bExpand === true) { // Set toggle state
				bExpand = false;
			} else {
				bExpand = true;	
			}
	 	});
	}
	
	/* @description ToggleCountryDropdown - with Z-Index fix (OT - 63352)
	 * @see Country Pulldown menu pf-header-espot-01
	 * @param {string} el - ID name of Country Select Menu Bar
	 * Takes country dropdown target from 'data-countries' attr on el param ID
	 * Take z-index fix target from 'data-zfix' for z-index fix (OT 63352) on el param ID
	 */
	
	var toggleCountryDropdown = function(el){
		var nEl = dojo.query(el)[0]
		var nWrapper = nEl.parentNode;	
		var sZfix = dojo.attr(nEl,"data-zfix");
		var sDataCountries = dojo.attr(nEl,"data-countries");
		var nZfix = dojo.byId(sZfix);
		var nDataCountries = dojo.byId(sDataCountries);
		dojo.query(el).connect("onmouseenter",nWrapper,function(evt){
			dojo.style(nDataCountries,"display","block");
			dojo.style(nDataCountries,"opacity","1");
			dojo.style(nZfix,"zIndex",900);
		});
		 dojo.connect(nWrapper,"onmouseleave",nDataCountries,function(){
           //dojo.style(this,"display","block");
           dojo.style(this,"display","none");//introduced to overcome country dropdown issues
           dojo.style(this,"opacity","0");
           //dojo.style(nZfix,"zIndex",999);
           dojo.style(nZfix,"zIndex",1);//introduced to overcome country dropdown issues
                                });
	}
	
	// SHOW/Hide Nav fix
    var showHideNav = function () {
    	dojo.query(".mk-hasSubNav").connect("onmouseenter", function(e){    		
    		var navEl = e.target;
    		var parent = navEl.parentNode;
    		if(navEl.className === "mk-hasSubNav") {
    			parent = navEl;
    		}
    		var childUl = parent.getElementsByTagName("ul").item(0);
   
            if(childUl.style.display = "none"){
            	childUl.style.display = "block";
            }
        });
        
        dojo.query(".mk-hasSubNav").connect("onmouseleave", function(e){
    		var navEl = e.target;
    		var parent = navEl.parentNode;
    		if(navEl.className === "mk-hasSubNav") {
    			parent = navEl;
    		}

            var childUl;
            if(parent.className !== "mk-hasSubNav") {
            	parent = navEl.parentNode.parentNode.parentNode;
            }
            childUl = parent.getElementsByTagName('ul').item(0);
            if(childUl.style.display = "block"){
            	childUl.style.display = "none";
            }
        });
	}
	
	/* @description Header Nav drop-down nav fix for IE7-6 / OT59789
	 * @see pf_header_espot_02
	 */
	var headerNavDropdownFix = function () {
		var IEdropdownInClass = 'IEdropdownIn';
		var IEdropdownOutClass = '';
		
		
		var connectMenus = function(sMenubarID,sDropdownID) {
			
			var nPreviousDropdown;
			dojo.connect(dojo.byId(sMenubarID), "onmouseenter", dojo.byId(sDropdownID), function(){
				if (nPreviousDropdown == undefined)
					nPreviousDropdown = this;
							
				if (nPreviousDropdown.id !== this.id) {
					nPreviousDropdown.className='';
					nPreviousDropdown = undefined; 					
				} 
				this.className = IEdropdownInClass;
				nPreviousDropdown = this; 
	
			});

				
			dojo.connect(dojo.byId(sMenubarID), "onmouseleave", dojo.byId(sDropdownID), function(){
				dojo.connect(this,'onmouseenter',null,function(){
					this.className = IEdropdownInClass;
				});
				
				dojo.connect(this,'onmouseleave',null,function(){
					this.className = IEdropdownOutClass;
				});
				
				dojo.connect(dojo.byId(sMenubarID),'onmouseleave',null,function(){
					dojo.byId(sDropdownID).className = IEdropdownOutClass;
				});
			});
			
		}
		
		if(ieVersion && ieVersion <= 6) {
		    dojo.forEach(
		   		dojo.query('li[id^="mainmenuBar"]'),
		        	function(nMainmenubar) {      		
		        		var sDropdown = "mainmenuDropdown" + getTrailingDigits(nMainmenubar.id);
			        	var nDropdown = dojo.byId(sDropdown);
			        	connectMenus(nMainmenubar.id,nDropdown.id);
		        	}
		   	);
	   }
 
	}
	
	/* @description Menubar Active state fix / OT61134
	 * @see pf_header_espot_02
	 */
	var activeMenubarFix = function() {
		if(ieVersion !== 6) {
			var menuBarActivate = 'menubarActive';
			
			var e = {
            "ul[id^='mainmenuDropdown'] li a" : { // all tabs lists
                // event names become event connections:
            	onmouseenter : function(evt) {      		
		        	var nMenuBar = dojo.byId("mainmenuBar" + getTrailingDigits(this.parentNode.parentNode.id));
		        	var nMenuBarLink = dojo.query('> a',nMenuBar)[0];
		        			        		
					if (!dojo.hasClass(nMenuBarLink, menuBarActivate)) // Activate menubar
						nMenuBarLink.className += (' ' + menuBarActivate); 
						
        		},
        		onmouseleave : function(evt) {        			
        			var nMenuBar = dojo.byId("mainmenuBar" + getTrailingDigits(this.parentNode.parentNode.id));	 // Deactivate menubar
					var nMenuBarLink = dojo.query('> a',nMenuBar)[0];
					dojo.removeClass(nMenuBarLink, menuBarActivate);
 
        		}
		    }
        };

        dojo.behavior.add(e);
        dojo.behavior.apply();

		}
	}
	
	/*
	 * @description Append div to container
	 * @see 'OrderPreferencesView' and 'NonAjaxBillOfMaterialsView'
	 * Add additional banner espot into 'OrderPreferencesView' and 'NonAjaxBillOfMaterialsView'
	 * for poulating video content where there is no espot available
	 * @param {array}} aEspotBanner
	 * @param {object} aEspotBanner[n]
	 * @param {string} aEspotBanner[n].sTargetPage - page string the espot is the be created on to ('OrderPreferencesView' || 'NonAjaxBillOfMaterialsView')
	 * @param {string} aEspotBanner[n].sTargetContainerID - String of container ID that espot is rooted ('OrderPreferences' || 'BOMUploadForm')
	 * @param {string} aEspotBanner[n].sBannerTplPath - Path to HTML and JSCode files (if path=="", then 'sBannerHtmlFile' and 'sBannerJsFile' include path)
	 * @param {string} aEspotBanner[n].sBannerHtmlFile - Filename of HTML, to get via AJAX
	 * @param {string} aEspotBanner[n].sBannerJsFile - Filename of JS calls, to get via AJAX
	 */
	var espotBannerFix = function(aEspotBanner) {
		//TODO: Make AJAX calls reusable, rather than nesting here
		var createBannerEspot = function(sTargetPage, sTargetContainerID, sBannerTplPath, sBannerHtmlFile, sBannerJsFile) {
			
	        if(pf.tagging.data.omniture.pageName === sTargetPage) {
	            
				var processOverlay = function(sBannerTplPath, sBannerHtmlFile, sBannerJsFile) { // Get HTML and JS
					var url = (sBannerTplPath !== "") ? (sBannerTplPath + sBannerHtmlFile) : sBannerHtmlFile;
 
					var getAjaxTemplate = dojo.xhrGet({
						url: url,
						handleAs: "text",
						timeout: 5000,
						preventCache: false,
						load: function(response, ioArgs) {

							if (response !== null) {
								// Instantiate video espot element
					        	var videoDiv = dojo.doc.createElement( "div" );
								videoDiv.innerHTML = response;
								
					            var formDiv = dojo.query('form[id="' + sTargetContainerID + '"]')[0]; // Append video espot
					            formDiv.appendChild(videoDiv);
					            
					            if (sBannerJsFile !== ""){ // Instantiate JS for eSpot
					            	var url = (sBannerTplPath !== "") ? (sBannerTplPath + sBannerJsFile) : sBannerJsFile;
					            	var getAjaxJS = dojo.xhrGet({
										url: url,
										handleAs: "text",
										timeout: 5000,
										preventCache: false,
										load: function(response, ioArgs){
											if (response !== null) {
												try {
													eval(response); // Call JS, against instantiated dynamic espot
												} catch(err) {
													console.error('Error parsing JS. ' + err.message);
												}
											}
										},
										error: function(error){
											console.error('error fetching JS:', error);
										}
					       });
					     }

							}
							
						},
						error: function(error){
							console.error('error fetching template:', error);
						}
					});
				}
				processOverlay(sBannerTplPath, sBannerHtmlFile, sBannerJsFile);
	        }
	    }
		if(isArrayTest(aEspotBanner) === true) {
			for(var i=0;i<aEspotBanner.length;i++){
				var sTargetPage = aEspotBanner[i].sTargetPage;
			    var sTargetContainerID = aEspotBanner[i].sTargetContainerID;
			    var sBannerTplPath = aEspotBanner[i].sBannerTplPath;
			    var sBannerHtmlFile = aEspotBanner[i].sBannerHtmlFile;
			    var sBannerJsFile = aEspotBanner[i].sBannerJsFile;
				createBannerEspot(sTargetPage, sTargetContainerID, sBannerTplPath, sBannerHtmlFile, sBannerJsFile);
			}
		}
	}

	// Move Overlays to end of doc div id='page'
	/* Move All Overlays to end of document
	 * @param {string} idBaseOverlays - base name of overlays to move
	 */
	var moveOverlays = function (idBaseOverlays) {
		var idBaseOverlays = idBaseOverlays;
		var targetDivID = "page";
		
		if (typeof idBaseOverlays !== 'undefined') {
			var overlays = dojo.query('div[id^="' + idBaseOverlays + '"]'); // Get all Overlay Divs
			for (var i=0;i < overlays.length;i++) { // Iterate thru' overlays
				
				var wrapper = dojo.doc.createElement( "div" ); // Wrap overlay in an 'mk-col-100' div
                wrapper.className = "mk-col-100";
                wrapper.appendChild(overlays[i]);
                
				dojo.place(wrapper, dojo.byId(targetDivID), "last"); // add wrapper to the node Page as the first-child

			}
			
		} else if (bDebugmode === true) {
    		console.log("Require an 'idBaseOverlays' String parameter");
    		
   		} else {
   			return false;
   		}
		
		
	}
	
	/* @public
	 * @description Carousel
	 * @param {object} oCarousel
	 * @param {string} oCarousel.sCarouselContainerID - Parent container ID name of Carousel
	 * @param {string} oCarousel.sCarouselScrollerID - Carousel Scroller ID name
	 * @param {string} oCarousel.sPrevID - Previous Button ID name
	 * @param {string} oCarousel.sNextID - Next Button ID name
	 * @param {string} oCarousel.sSlideID - Common base ID name of Slides
	 * @param {integer} oCarousel.iSlideCount - Total number of slides
	 * @param {boolean} [oCarousel.bFluidContext=True || False] - Carousel is in a fluid layout context (True by default)
	 * 
	 */
	var carousel = function (oCarousel){
		
		if (isObjectTest(oCarousel) === true) { // is an Object
			
		    var sCarouselContainerID = oCarousel.sCarouselContainerID; // parent container of carousel
		    var sCarouselScrollerID = oCarousel.sCarouselScrollerID; //carouselscroller
		    var sPrevID = oCarousel.sPrevID;
		    var sNextID = oCarousel.sNextID;
		    var sSlideID = oCarousel.sSlideID;
		    var bIsFluid = typeof oCarousel.bFluidContext !== 'undefined' ? oCarousel.bFluidContext : true;
		    var iSlideCount = typeof oCarousel.iSlideCount !== 'undefined' ? oCarousel.iSlideCount : 1;
		    
		    var nCarouselContainer = dojo.byId(sCarouselContainerID); // Nodes
		    var nCarouselScroller = dojo.byId(sCarouselScrollerID);
		    var nPrev = dojo.byId(sPrevID);
		    var nNext = dojo.byId(sNextID);
	    
		    var animationMethod = "chain"; // Init Animation
		    var animG, offsetW, offsetH = null;
		    var newLeft = 0;
		    var boxMixin = {duration: 1500};
		    
		    var slideCount = iSlideCount; // Number of slides
		    var slideIndex = 0; // init slide index
		
			//sliding to the right
			var slideRight = function(e) {
			   e.preventDefault();
		       if(slideIndex < (slideCount - 1)){ // If not got to the end
		          slideIndex += 1; // inc slide index
		       	  newLeft -= nCarouselContainer.offsetWidth; // dec x-pos, based on container width
		          //var style = nCarouselScroller.style;
			      var anim1 = dojo.animateProperty({
			         node: nCarouselScroller,
			         duration: boxMixin.duration/2,
			         properties: {
				        left: { end: newLeft, unit:"px" }
				     },
		             easing: dojo.fx.easing.expoIn
			      });
	              animG = dojo.fx[animationMethod]([anim1]).play();
	           }
	
	        }
			
			//sliding to the left
			var slideLeft = function(e) {
			   e.preventDefault();
	           if(slideIndex > 0) { // if not already at start
	              slideIndex -= 1;
	   	          newLeft += nCarouselContainer.offsetWidth;
		          //var style = nCarouselScroller.style;
		          var anim1 = dojo.animateProperty({
		             node: nCarouselScroller,
		             duration: boxMixin.duration/2,
		             properties: {
			            left: { end: newLeft, unit:"px" }
		             },
		             easing: dojo.fx.easing.expoIn
		          });
	              animG = dojo.fx[animationMethod]([anim1]).play();
	           }
	        }
	        
	        /* In fluid context set width of each slide */
	        var fixSlideWidth = function(e) {
	        	dojo.forEach( // iterate slides
	        		dojo.query('div[id^="' + sSlideID + '"]'),
	        		function(slideTag){
	        			dojo.style(slideTag,"width",nCarouselContainer.offsetWidth + "px"); // harmonise slide width with fluid container
	        			
	        		}
	        		
	        	);
	        	newLeft = -(nCarouselContainer.offsetWidth * (slideIndex)); // reset carousel to new fluid x-pos	
	        	dojo.style(nCarouselScroller,"left",newLeft + "px"); 	
	        }
	        
	        dojo.connect(nPrev,"onclick",null,slideLeft); // Connect 'prev' button
		    dojo.connect(nNext,"onclick",null,slideRight); // Connect 'next' button
		    
		    dojo.style(nCarouselScroller,"width",(nCarouselContainer.offsetWidth * (slideCount + 1)) + "px"); // Dynamically accomodate slides on carousel
		    
		    if (bIsFluid === true) { // Reset carousel in a fluid layout context
		    	dojo.connect (window, 'onresize',fixSlideWidth); // Re-calc slide width, in fluid width context
		    	fixSlideWidth(); // Init slide widths and carousel scroller x-pos
	    	}
	   }

    }
	
	/* @public
	 * @description espot carousel
	 * @see homepage-espot-03
	 * @param {object} oESpotCarousel
	 * @param {string} oESpotCarousel.sESpotCarouselID - Parent container ID name of ESpot Carousel
	 * @param {string} oESpotCarousel.sESpotCarouselScrollerID - ESpot Carousel Scroller ID name
	 * @param {string} oESpotCarousel.sESpotCarouselSlideBaseID - Common base ID name of Slides
	 * @param {string} oESpotCarousel.sESpotCarouselButtonBaseID - Common base ID name of Buttons
	 * @param {integer} oESpotCarousel.iESpotCarouselSlideCount - Total number of slides
	 * @param {boolean} [oESpotCarousel.bPlaySequence] animate through slides (Default=false)
	 * @param {boolean} [oESpotCarousel.bAnimScroll] animate=scroll (Default=false); if false then Fade slides
	 * @todo - Consolidate 'ntfCarousel' and 'espotCarousel' function
	 */
	var espotCarousel = function (oESpotCarousel) {
		/* @private
		 * @description return trailing digits
		 * @param {string} sSearchString
		 */
		/*
		var getTrailingDigits = function (sSearchString) {
			var re = /.*(\d)/;
			return sSearchString.replace(re,"$1");
		}
		*/
		/* @private 
		 * @description animate slide
		 * @param {string} sActiveButtonID - Active button node ID
		 * @param {boolean} [bInitial] - true if initial call to slideAnimate
		 */
		var slideAnimate = function(sActiveButtonID,bInitial) {
			
			var bInitial = typeof bInitial !== 'undefined' ? bInitial : false; // default to false
				
			/* init animation */
			var animationMethod = "chain";
			var animG, offsetW, offsetH = null;
			var newLeft = 0;
			var boxMixin = {duration: 250};
			
			// Scroll or fade
			if (bAnimScroll === true) { // Scroll
				var iNewSlide = getTrailingDigits(sActiveButtonID);
				newTop = - (iNewSlide - 1) * iSlideHeight; // new Top position
				var anim1 = dojo.animateProperty({
					node: nESpotCarouselScroller,
				    duration: boxMixin.duration/2,
				    properties: {
						top: { end: newTop, unit:"px" }
					},
			        easing: dojo.fx.easing.expoIn
				});
				animG = dojo.fx[animationMethod]([anim1]).play();
				
			} else { // Fade
                var iSavedSlideIndex = getTrailingDigits(sSavedActiveButtonID);
                var iNewSlideIndex = getTrailingDigits(sActiveButtonID);
                var sSavedSlideID = sESpotCarouselSlideBaseID + iSavedSlideIndex;
                var sNewSlideID = sESpotCarouselSlideBaseID + iNewSlideIndex;
                
                if ((iSavedSlideIndex !== iNewSlideIndex) || (bInitial == true)) { // animate if slide changed or initial call
                    if (bInitial === true) { // Clear all slides
                        dojo.forEach( // iterate slides
                            dojo.query('div[class^="' + sESpotCarouselSlideBaseID + '"]'),
                            function(nSlide){ // Get initial active button
                                dojo.style(nSlide, "opacity", "0");
                                dojo.style(nSlide, "display", "none");
                            }
                        );
                    }
                    // Fade in New Slide
                    dojo.style(sNewSlideID, "opacity", "0"); 
                    dojo.fadeIn({
                        node: sNewSlideID
                    }).play();
                    dojo.style(sNewSlideID, "display", "block");
                    // Fade out Saved Slide
                    if (iSavedSlideIndex !== iNewSlideIndex) {
                        dojo.style(sSavedSlideID, "opacity", "1"); 
                        dojo.fadeOut({
                            node: sSavedSlideID
                        }).play();
                        dojo.style(sSavedSlideID, "display", "none");
                    }
                    
                }
                
            }
        }
		
		/* @private 
		 * @description Activate button, and chain slide Animation
		 */
		var buttonActivate = function(nThisButton) {
			if (sSavedActiveButtonID !== "") { // Deacivate last button if it exists
				dojo.removeClass(sSavedActiveButtonID, 'mk-espot-carousel-button-active');				
			}
			dojo.addClass(nThisButton.id, 'mk-espot-carousel-button-active'); // Activate current button
			slideAnimate(nThisButton.id); // Activate slide
			sSavedActiveButtonID = nThisButton.id; // saved activated button ID
		}
		
		// INIT
		if (isObjectTest(oESpotCarousel) === true) { // is an Object
		    var sESpotCarouselID = oESpotCarousel.sESpotCarouselID; // Carousel Parent ID name
		    var sESpotCarouselScrollerID = oESpotCarousel.sESpotCarouselScrollerID; // Scroller ID name
		    var sESpotCarouselSlideBaseID = oESpotCarousel.sESpotCarouselSlideBaseID; // Base Slide ID name
		    var sESpotCarouselButtonBaseID = oESpotCarousel.sESpotCarouselButtonBaseID; // Base Button ID name
		    var iESpotCarouselSlideCount = oESpotCarousel.iESpotCarouselSlideCount; // Slide total
		    
		    var nESpotCarouselContainer = dojo.byId(sESpotCarouselID); // Nodes
		    var nESpotCarouselScroller = dojo.byId(sESpotCarouselScrollerID);
		    
		    // Default 'playSequence' to 'True' (play through slides onload, by default)
		    var bPlaySequence = typeof oESpotCarousel.bPlaySequence !== 'undefined' ? oESpotCarousel.bPlaySequence : true;
		    
		    // Default 'bAnimScroll' to 'False' (Fade slides by default)
		    var bAnimScroll = typeof oESpotCarousel.bAnimScroll !== 'undefined' ? oESpotCarousel.bAnimScroll : false;
		    
		    // Get slide height
		    var iSlideHeight = dojo.style(sESpotCarouselSlideBaseID + "1","height");
	    	
		    // Connect buttons
		    for(var i = 1; i <= iESpotCarouselSlideCount; i++){
		    	var nNextButton = dojo.byId(sESpotCarouselButtonBaseID + i);
		    	dojo.connect(nNextButton,"onmouseover",null,function(evt) {
		    		animateSlides.pauseSlideAnimation(); // Pause slide animation sequence
		    		buttonActivate(this); // activate button
		    	});
		    }
		    		    
			// Set initial active slide, based on initial active button
		    dojo.forEach( // iterate slides
		    	dojo.query('div[id^="' + sESpotCarouselButtonBaseID + '"]'),
	        	function(nButton){ // Get initial active button
	        		if(dojo.hasClass(nButton,"mk-espot-carousel-button-active")) {
	        			sSavedActiveButtonID = nButton.id; // initial button ID name
	        			slideAnimate(nButton.id, true); // animate to slide (initial=true to ensure fade-in slide is set)
	        			return true;
	        		}
	        	}
		    );
		    
		    // PLAY SLIDE SEQUENCE CLASS
		    var PlaySlideSequence = function() {
		    	// init
		    	var iSlideAnimationInterval = 4000; // slide animation interval
			    var iPauseCountdown = 16000; // pause period
			    var bIntervalPaused = false; // paused 'false'
			    var bPauseCountdownSet = false; // reset Countdown to animate timer
			    var slideInterval; // playSequence interval object
			    var self = this;
		    	
		    	// Countdown to restarting slide animation
			    var pauseCountdown = function() {
			    	bPauseCountdownSet = true; // Countdown timer set
			    	var pauseInterval = setTimeout(function() {
			    		bPauseCountdownSet = false; // reset Countdown timer
			    		bIntervalPaused = false; 
				    	self.playSlideAnimation(); // animate slides
				    },iPauseCountdown);
				    
				}
		    	
		    	// Iterate Slide
			    var iterateSlide = function() {
					var iSlideIndex = getTrailingDigits(sSavedActiveButtonID); // Get saved Active Button ID
					if (iSlideIndex < iESpotCarouselSlideCount) { // inc slide index
					   	iSlideIndex ++;
					} else {
					   	iSlideIndex = 1;
					}
					var sNextActiveButton = sESpotCarouselButtonBaseID + iSlideIndex; // next slide ID name
					buttonActivate(dojo.byId(sNextActiveButton)); // activate button and associated slide
				}
				
				// Play slide animation
				this.playSlideAnimation = function() {
					if(bIntervalPaused !== true) { // playsequence if not paused
			    		slideInterval = setInterval(iterateSlide,iSlideAnimationInterval);
			    	}
				}
				
		    	// Pause slide animation
			    this.pauseSlideAnimation = function() {
			    	bIntervalPaused = true; // paused state = 'true'
			    	clearInterval(slideInterval); // clear playSequence
			    	if (bPauseCountdownSet !== true){    	
			    		pauseCountdown(); // start pause counter
			    	}
			    }
		    	
		    }
		    
		    if (bPlaySequence === true) {
		    	var animateSlides = new PlaySlideSequence();
		    	animateSlides.playSlideAnimation(); // play sequence
		    }
 
		}
	}
	
	/* @public
	 * @description Header Carousel
	 * @see new-to-farnell
	 * @param {object} oESpotCarousel
	 * @param {string} oESpotCarousel.btnEvent - 'onclick'
	 * @param {integer} oESpotCarousel.AnimationInterval - Animiation interval (ms)
	 * @param {string} oESpotCarousel.PauseCountdown - Pause animation countdown (ms)
	 * @param {string} oESpotCarousel.bPlaySequence
	 * @param {integer} oESpotCarousel.bAnimScroll
	 * @todo - Consolidate 'headerCarousel' and 'espotCarousel' function
	 * @ignore - documenting 'sCarouselBtns', 'oCarouselParams' as this function with be consolidated
	 */
	var headerCarousel = function (sCarouselSlides, sCarouselBtns, oCarouselParams) {
		if (typeof arguments[0] == "object") {
    		var oCarouselParams = arguments[0];
  		} else {
    		var sCs = arguments[0];
			var sCb = arguments[1];
    		var oCarouselParams = arguments[2];
  		}

		// INIT
		var aCarouselSlides = sCs || dojo.query(".mk-header-carousel-slide");
		var aCarouselBtns = sCb || dojo.query(".mk-header-carousel-button");
		var iCSlidesLength = aCarouselSlides.length;
		var iCBtnLength = aCarouselSlides.length;


		// Default 'playSequence' to 'True' (play through slides onload, by default)
		var bPlaySequence = typeof oCarouselParams.bPlaySequence !== 'undefined' ? oCarouselParams.bPlaySequence : true;
		    
		// Default 'bAnimScroll' to 'False' (Fade slides by default)
		var bAnimScroll = typeof oCarouselParams.bAnimScroll !== 'undefined' ? oCarouselParams.bAnimScroll : false;
		    
		// Get slide height
		var iSlideHeight = dojo.style(aCarouselSlides[0],"height");

		var iSlideIndex = "0";
		var iSavedSlideIndex = "0";

		// Connect buttons
		aCarouselBtns.connect(oCarouselParams.btnEvent,null,function(evt) {
		   	animateSlides.pauseSlideAnimation(); // Pause slide animation sequence
		    buttonActivate(evt.target); // activate button
		    //console.log(evt.target);
		});

		/* @private 
		 * @description animate slide
		 * @param {string} sActiveButtonID - Active button node ID
		 * @param {boolean} [bInitial] - true if initial call to slideAnimate
		 */
		var slideAnimate = function(sIndex,bInitial) {
			
			var bInitial = typeof bInitial !== 'undefined' ? bInitial : false; // default to false
				
			/* init animation */
			var animationMethod = "chain";
			var animG, offsetW, offsetH = null;
			var newLeft = 0;
			var boxMixin = {duration: 250};
			
			// Scroll or fade
			if (bAnimScroll === true) { // Scroll
				var iNewSlide = sIndex;
				newTop = - iNewSlide * iSlideHeight; // new Top position
				var anim1 = dojo.animateProperty({
					node: nESpotCarouselScroller,
				    duration: boxMixin.duration/2,
				    properties: {
						top: { end: newTop, unit:"px" }
					},
			        easing: dojo.fx.easing.expoIn
				});
				animG = dojo.fx[animationMethod]([anim1]).play();
				
			} else { // Fade
					if (bInitial === true) { // Clear all slides
						dojo.forEach(aCarouselSlides,
				        	function(slide){
				        			dojo.style(slide, "opacity", "0");
				        			 // Get initial active button
				        	}
		    			);
					}
					// Fade in New Slide
					//dojo.style(aCarouselSlides[sIndex], "opacity", "0"); 
					dojo.fadeIn({
						node: aCarouselSlides[sIndex]
					}).play();
					// Fade out Saved Slide
					if (iSavedSlideIndex !== sIndex) {
						//console.log(iSavedSlideIndex, "iSaved");
						dojo.style(aCarouselSlides[iSavedSlideIndex], "opacity", "1"); 
						dojo.fadeOut({
							node: aCarouselSlides[iSavedSlideIndex]
						}).play();
					//}
					
				}
				iSavedSlideIndex = sIndex;
				
			}
		}
		// Set initial active slide, based on initial active button
		dojo.forEach(aCarouselBtns, function(cBtn){ // Get initial active button
	        	if(dojo.hasClass(cBtn,"mk-header-carousel-button-active")) {
	        		slideAnimate(dojo.attr(cBtn, "data-index"), true);
	        		return true;
	        	}
	        }
		);

		/* @private 
		 * @description Activate button, and chain slide Animation
		 */
		var buttonActivate = function(nThisButton) {
			aCarouselBtns.removeClass('mk-espot-carousel-button-active');
			dojo.addClass(nThisButton, 'mk-espot-carousel-button-active'); // Activate current button
			slideAnimate(dojo.attr(nThisButton, "data-index")); // Activate slide
		}
		    
		// PLAY SLIDE SEQUENCE CLASS
		var PlaySlideSequence = function() {
			// init
		   	var iSlideAnimationInterval = oCarouselParams.AnimationInterval || 4000; // slide animation interval
			var iPauseCountdown = oCarouselParams.PauseCountdown || 16000; // pause period
			var bIntervalPaused = false; // paused 'false'
			var bPauseCountdownSet = false; // reset Countdown to animate timer
			var slideInterval; // playSequence interval object
			var self = this;
		    	
		   	// Countdown to restarting slide animation
			var pauseCountdown = function() {
			    bPauseCountdownSet = true; // Countdown timer set
			    var pauseInterval = setTimeout(function() {
			    	bPauseCountdownSet = false; // reset Countdown timer
			    	bIntervalPaused = false; 
				    self.playSlideAnimation(); // animate slides
				},iPauseCountdown);	    
			}
		    	
	    	// Iterate Slide
		    var iterateSlide = function() {
				if (iSlideIndex < iCSlidesLength-1) { // inc slide index
				   	iSlideIndex ++;
				} else {
				   	iSlideIndex = 0;
				}
				//console.log(aCarouselBtns[iSlideIndex]);
				buttonActivate(aCarouselBtns[iSlideIndex]); // activate button and associated slide
			}
			
			// Play slide animation
			this.playSlideAnimation = function() {
				if(bIntervalPaused !== true) { // playsequence if not paused
		    		slideInterval = setInterval(iterateSlide,iSlideAnimationInterval);
		    	}
			}
			
	    	// Pause slide animation
		    this.pauseSlideAnimation = function() {
		    	bIntervalPaused = true; // paused state = 'true'
		    	clearInterval(slideInterval); // clear playSequence
		    	if (bPauseCountdownSet !== true){    	
		    		pauseCountdown(); // start pause counter
		    	}
		    }	
	    }
	    
	    if (bPlaySequence === true) {
	    	var animateSlides = new PlaySlideSequence();
	    	animateSlides.playSlideAnimation(); // play sequence
	    }
		    
	}
	
	/* @public
	 * @description npi carousel
	 * @param {object} oNpiCarousel
	 * @param {string} oNpiCarousel.sNpiCarouselID - Parent container ID name of Npi Carousel
	 * @param {string} oNpiCarousel.sNpiCarouselScrollerID - Npi Carousel Scroller ID name
	 * @param {string} oNpiCarousel.sNpiCarouselSlideBaseID - Common base ID name of Slides
	 * @param {string} oNpiCarousel.sNpiCarouselButtonBaseID - Common base ID name of Buttons
	 * @param {integer} oNpiCarousel.iNpiCarouselSlideCount - Total number of slides
	 * @param {boolean} [oNpiCarousel.bPlaySequence] animate through slides (Default=false)
	 * @param {boolean} [oNpiCarousel.bAnimScroll] animate=scroll (Default=false); if false then Fade slides
	 * @todo - Consolidate 'ntfCarousel' and 'npiCarousel' function
	 */
	var npiCarousel = function (oNpiCarousel) {
		/* @private
		 * @description return trailing digits
		 * @param {string} sSearchString
		 */
		/*
		var getTrailingDigits = function (sSearchString) {
			var re = /.*(\d)/;
			return sSearchString.replace(re,"$1");
		}
		*/
		/* @private 
		 * @description animate slide
		 * @param {string} sActiveButtonID - Active button node ID
		 * @param {boolean} [bInitial] - true if initial call to slideAnimate
		 */
		var slideAnimate = function(sActiveButtonID,bInitial) {
			
			var bInitial = typeof bInitial !== 'undefined' ? bInitial : false; // default to false
				
			/* init animation */
			var animationMethod = "chain";
			var animG, offsetW, offsetH = null;
			var newLeft = 0;
			var boxMixin = {duration: 250};
			
			// Scroll or fade
			if (bAnimScroll === true) { // Scroll
				var iNewSlide = getTrailingDigits(sActiveButtonID);
				newTop = - (iNewSlide - 1) * iSlideHeight; // new Top position
				var anim1 = dojo.animateProperty({
					node: nNpiCarouselScroller,
				    duration: boxMixin.duration/2,
				    properties: {
						top: { end: newTop, unit:"px" }
					},
			        easing: dojo.fx.easing.expoIn
				});
				animG = dojo.fx[animationMethod]([anim1]).play();
				
			} else { // Fade
                var iSavedSlideIndex = getTrailingDigits(sSavedActiveButtonID);
                var iNewSlideIndex = getTrailingDigits(sActiveButtonID);
                var sSavedSlideID = sNpiCarouselSlideBaseID + iSavedSlideIndex;
                var sNewSlideID = sNpiCarouselSlideBaseID + iNewSlideIndex;
                
                if ((iSavedSlideIndex !== iNewSlideIndex) || (bInitial == true)) { // animate if slide changed or initial call
                    if (bInitial === true) { // Clear all slides
                        dojo.forEach( // iterate slides
                            dojo.query('div[class^="' + sNpiCarouselSlideBaseID + '"]'),
                            function(nSlide){ // Get initial active button
                                dojo.style(nSlide, "opacity", "0");
                                dojo.style(nSlide, "display", "none");
                            }
                        );
                    }
                    // Fade in New Slide
                    dojo.style(sNewSlideID, "opacity", "0"); 
                    dojo.fadeIn({
                        node: sNewSlideID
                    }).play();
                    dojo.style(sNewSlideID, "display", "block");
                    // Fade out Saved Slide
                    if (iSavedSlideIndex !== iNewSlideIndex) {
                        dojo.style(sSavedSlideID, "opacity", "1"); 
                        dojo.fadeOut({
                            node: sSavedSlideID
                        }).play();
                        dojo.style(sSavedSlideID, "display", "none");
                    }
                    
                }
                
            }
        }
		
		/* @private 
		 * @description Activate button, and chain slide Animation
		 */
		var buttonActivate = function(nThisButton) {
			if (sSavedActiveButtonID !== "") { // Deacivate last button if it exists
				dojo.removeClass(sSavedActiveButtonID, 'mk-npi-carousel-button-active');				
			}
			dojo.addClass(nThisButton.id, 'mk-npi-carousel-button-active'); // Activate current button
			slideAnimate(nThisButton.id); // Activate slide
			sSavedActiveButtonID = nThisButton.id; // saved activated button ID
		}
		
		// INIT
		if (isObjectTest(oNpiCarousel) === true) { // is an Object
		    var sNpiCarouselID = oNpiCarousel.sNpiCarouselID; // Carousel Parent ID name
		    var sNpiCarouselScrollerID = oNpiCarousel.sNpiCarouselScrollerID; // Scroller ID name
		    var sNpiCarouselSlideBaseID = oNpiCarousel.sNpiCarouselSlideBaseID; // Base Slide ID name
		    var sNpiCarouselButtonBaseID = oNpiCarousel.sNpiCarouselButtonBaseID; // Base Button ID name
		    var iNpiCarouselSlideCount = oNpiCarousel.iNpiCarouselSlideCount; // Slide total
		    
		    var nNpiCarouselContainer = dojo.byId(sNpiCarouselID); // Nodes
		    var nNpiCarouselScroller = dojo.byId(sNpiCarouselScrollerID);
		    
		    // Default 'playSequence' to 'True' (play through slides onload, by default)
		    var bPlaySequence = typeof oNpiCarousel.bPlaySequence !== 'undefined' ? oNpiCarousel.bPlaySequence : true;
		    
		    // Default 'bAnimScroll' to 'False' (Fade slides by default)
		    var bAnimScroll = typeof oNpiCarousel.bAnimScroll !== 'undefined' ? oNpiCarousel.bAnimScroll : false;
		    
		    // Get slide height
		    var iSlideHeight = dojo.style(sNpiCarouselSlideBaseID + "1","height");
	    	
		    // Connect buttons
		    for(var i = 1; i <= iNpiCarouselSlideCount; i++){
		    	var nNextButton = dojo.byId(sNpiCarouselButtonBaseID + i);
		    	dojo.connect(nNextButton,"onmouseover",null,function(evt) {
		    		animateSlides.pauseSlideAnimation(); // Pause slide animation sequence
		    		buttonActivate(this); // activate button
		    	});
		    }
		    		    
			// Set initial active slide, based on initial active button
		    dojo.forEach( // iterate slides
		    	dojo.query('div[id^="' + sNpiCarouselButtonBaseID + '"]'),
	        	function(nButton){ // Get initial active button
	        		if(dojo.hasClass(nButton,"mk-npi-carousel-button-active")) {
	        			sSavedActiveButtonID = nButton.id; // initial button ID name
	        			slideAnimate(nButton.id, true); // animate to slide (initial=true to ensure fade-in slide is set)
	        			return true;
	        		}
	        	}
		    );
		    
		    // PLAY SLIDE SEQUENCE CLASS
		    var PlaySlideSequence = function() {
		    	// init
		    	var iSlideAnimationInterval = 4000; // slide animation interval
			    var iPauseCountdown = 16000; // pause period
			    var bIntervalPaused = false; // paused 'false'
			    var bPauseCountdownSet = false; // reset Countdown to animate timer
			    var slideInterval; // playSequence interval object
			    var self = this;
		    	
		    	// Countdown to restarting slide animation
			    var pauseCountdown = function() {
			    	bPauseCountdownSet = true; // Countdown timer set
			    	var pauseInterval = setTimeout(function() {
			    		bPauseCountdownSet = false; // reset Countdown timer
			    		bIntervalPaused = false; 
				    	self.playSlideAnimation(); // animate slides
				    },iPauseCountdown);
				    
				}
		    	
		    	// Iterate Slide
			    var iterateSlide = function() {
					var iSlideIndex = getTrailingDigits(sSavedActiveButtonID); // Get saved Active Button ID
					if (iSlideIndex < iNpiCarouselSlideCount) { // inc slide index
					   	iSlideIndex ++;
					} else {
					   	iSlideIndex = 1;
					}
					var sNextActiveButton = sNpiCarouselButtonBaseID + iSlideIndex; // next slide ID name
					buttonActivate(dojo.byId(sNextActiveButton)); // activate button and associated slide
				}
				
				// Play slide animation
				this.playSlideAnimation = function() {
					if(bIntervalPaused !== true) { // playsequence if not paused
			    		slideInterval = setInterval(iterateSlide,iSlideAnimationInterval);
			    	}
				}
				
		    	// Pause slide animation
			    this.pauseSlideAnimation = function() {
			    	bIntervalPaused = true; // paused state = 'true'
			    	clearInterval(slideInterval); // clear playSequence
			    	if (bPauseCountdownSet !== true){    	
			    		pauseCountdown(); // start pause counter
			    	}
			    }
		    	
		    }
		    
		    if (bPlaySequence === true) {
		    	var animateSlides = new PlaySlideSequence();
		    	animateSlides.playSlideAnimation(); // play sequence
		    }
 
		}
	}
	
	
	/* @public
	 * @description Sticky Nav
	 * @see new-to-farnell page
	 * @param {object} oStickyNav [targetID,trigger top distance, target object height]
	 * @param {string} oStickyNav.sTargetID - container ID name of Sticky Nav
	 * @param {string} oStickyNav.iTriggerTopPx - Distance from top to trigger nav
	 * @param {string} oStickyNav.iTargetHeightPx - Height (px) of target sticky object
	 */
	var stickyNav = function(oStickyNav){
		var x = 0;
		var y = 1;
		var timeOut = 0; 
		var isScroll = -1;
		var objArray = [];
		
		function scrollFinished(oStickyNav) {
			
			console.log('scroll');
			
			elem = document.getElementById(oStickyNav.sTargetID);
			trigger = oStickyNav.iTriggerTopPx;
			height = oStickyNav.iTargetHeightPx;
			
			x = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
			y = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		
			if (y >= trigger) {
				document.body.style.marginTop = height + "px";
				elem.style.position = "fixed";
				elem.style.top = "0px";
				elem.style.width = "753px";
			} else {
				elem.style.position = "";
				elem.style.top = "";
				elem.style.width = "100%";
			    document.body.style.margin = "0px 0px 0px 0px";
			}
			
		}

		function stickyNavInit(oStickyNav) {
			dojo.connect(window, "onscroll", function() {
				if(isScroll != -1) {
					clearTimeout(isScroll);
				}
				isScroll = setTimeout(function() {
    				scrollFinished(oStickyNav);
				}, timeOut);
			});
		}

		if((ieVersion === false) || (ieVersion > 7)) {
		  stickyNavInit(oStickyNav);
		}
	}
	
	/* @private
	 * @description - Form validation
	 * @param {string} sformID - ID of Form
	 * @param {string} sFormErrorMsgID - ID of div container for error message
	 * @param {string} sLeadingErrorMsg - Leading error Message
	 * @param {array} aRequiredFields - array of 'Required Field' Objects
	 * @param {string} aRequiredFields[n].id - id name of form element
	 * @param {string} aRequiredFields[n].constraint="isText" || "isEmail" || "isTelephone" - How to validate
	 * @param {string} aRequiredFields[n].errorTxt Error text to be displayed
	 */
	var validateForm = function (sFormID, sFormErrorMsgID, sLeadingErrorMsg, aRequiredFields){
		// START: Helper Functions
		var validateEmail = function (email) { // Validate Email
    		var reComplex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    		var reSimple = /\S+@\S+\.\S+/;
    		return reComplex.test(email);
		}
		var validateQuoteFile = function (filename) {
			if(filename.length > 0){
				var validFileExtensions = [".csv", ".xls", ".xlsx", ".txt"];
				var i = filename.lastIndexOf('.');
	     		if(i === -1 ) {
	     			return false;
	     		}else{
	    			return (dojo.indexOf(validFileExtensions, filename.slice(i)) === -1) ? false : true;
				}
			}else{
				return true;
			}
		}
		var validateTelephone = function (telephone) { // Validate Telephone
    		var re = /[0-9]+/;
    		return re.test(telephone);
		}
		var validateChecked = function (nFormEle) { // Validate if Checked
			return nFormEle.checked;
		}
		
		/* @private
		 * @description Validate that a 'selected' Select Option has a value
		 * @return true || false
		 * @param {node object} nFormEle - Form element Node Object
		 */
		var validateSelectOption = function (nFormEle) { // Validate if Checked
			if (nFormEle !== "undefined") {
				for (var i=0; i < nFormEle.options.length; i++) {
					if ((nFormEle.options[i].selected === true) && 
					 (nFormEle.options[i].value == "")) {
						return false;
						break;
					}
				}
				return true;
				
			} else if (bDebugmode === true) {
	    		console.log("Form Element Node with ID: " + sFormEleID + " not found");
	    		return false;
	   		} else {
	   			return false;
	   		}
			
		}
		
		/* @private
		 * @description Validate that a Radio Button has been selected
		 * @return true || false
		 * @param {node object} nFormEle - Form element Node Object
		 */
		var validateRadioOption = function (nFormEle) {
			if (nFormEle !== "undefined") {
				var aRadioButtons=dojo.query("input[id='" + nFormEle.id + "']");
				for (var i=0; i < aRadioButtons.length; i++) {
					if (aRadioButtons[i].checked === true) {
						return true;
						break;
					}
				}
				return false;
				
			} else if (bDebugmode === true) {
	    		console.log("Form Element Node with ID: " + sFormEleID + " not found");
	    		return false;
	   		} else {
	   			return false;
	   		}
		}
		
		/* @private
		 * @description validate formQuoteTable
		 * @param {dom node object} nFormEle
		 * @returns {object} oQuoteTableValidation
		 */
		var validateQuoteTable = function(nFormEle) {
			
			/* @private
			 * @param {array} aRow[n]
			 * @param {boolean} aRow[n].bCellValid
			 * @param {string} aRow[n].sInputId - input ID name of field
			 * @param {string} sKeyToValidate
			 */
			var isValid = function(aRowArray, sKeyToValidate) {
				var iValidCellCount = 0;
				for (var i=0;i<aRowArray.length;i++) {					
					if (aRowArray[i][sKeyToValidate] === true)
						iValidCellCount += 1; 
				}
				if (iValidCellCount == aRowArray.length) {
					return true; // If all objects are valid, Array is valid
				} else {
					return false; // if valid objects < aRowArray.length, array is not valid
				}

			}
			
			if (nFormEle !== "undefined") {
				var sFormTableID = "mk-quote-table";
				var sInputIDs = ["partNo_","manufacturerPartNo_","manufacturer_","quantity_","price_"]; // Quote Table Fields
				var nTable = dojo.byId(sFormTableID);
				
				oQuoteTableValidation = {bTableValid:true,aErrorRows:[]};
				var nRowCount = nTable.rows.length;
				for (var i=1;i<nRowCount;i++) { // iterate table rows after header row
					
					var oQuoteTableRowValidation = {bRowValid:true,aErrorCells:[]};
					for (var n=0;n<nTable.rows[0].cells.length;n++) { // iterate each row cell
						var sInputFieldID = sInputIDs[n] + i; // Build Input Field ID Name
						var nCellInputField = dojo.byId(sInputFieldID);
						var oQuoteTableRowCellValidation = {bCellValid:true,sInputId:sInputFieldID}; // Init cell validation obj
						
						if (nCellInputField !== null) { // Trap relavent cells
							if (nCellInputField.value == "") { // Error Cell
								oQuoteTableRowCellValidation.bCellValid = false;
							} else { // Valid Cell
								oQuoteTableRowCellValidation.bCellValid = true;
							}
							
						} else { // Null 'cell value is trapped as a valid cell
							oQuoteTableRowCellValidation.bCellValid = true;
							oQuoteTableRowCellValidation.sInputId = "";
						}
						oQuoteTableRowValidation.aErrorCells.push(oQuoteTableRowCellValidation); // Push Cell Validation object on to Row Validation
						
					} // End cell iteration
					oQuoteTableRowValidation.bRowValid = isValid(oQuoteTableRowValidation.aErrorCells, "bCellValid"); // Record row error
					oQuoteTableValidation.aErrorRows.push(oQuoteTableRowValidation); // Push row Validation into table
					
				} // End row iteration
				oQuoteTableValidation.bTableValid = isValid(oQuoteTableValidation.aErrorRows, "bRowValid"); // Record Table error. Did row have an error?
				
				return oQuoteTableValidation; // return table validation object

			} else if (bDebugmode === true) {
	    		console.log("Form Element Node with ID: " + sFormEleID + " not found");
	    		return false;
	   		} else {
	   			return false;
	   		}
		}
		
		
		// Test form element constraint, return 'true' for valid element value
		var testConstraint = function (nFormEle, eleConstraint, eleTxt, eleValue) {
			// Constraints: 'isText' || 'isEmail' || 'isTelephone' || 'isChecked' || 'isSelectOption' // 'isRadioOption' || 'isQuoteTable'
			if ((eleConstraint === "isText") && (eleValue.length === 0)) { // Text Error
				return false;
			} else if ((eleConstraint === "isEmail") && (validateEmail(eleValue) === false)) { // Email Error
				return false;
			} else if ((eleConstraint === "isTelephone") && (validateTelephone(eleValue) === false)) { // Telephone Error
				return false;
			} else if ((eleConstraint === "isChecked") && (validateChecked(nFormEle) === false)) { // Checkbox 'not checked' Error
				return false;
			} else if ((eleConstraint === "isSelectOption") && (validateSelectOption(nFormEle) === false)) { // Checkbox 'not checked' Error
				return false;
			} else if ((eleConstraint === "isRadioOption") && (validateRadioOption(nFormEle) === false)) { // Radio Button 'not selected'
				return false;
			} else if ((eleConstraint === "isQuoteTable") && (validateQuoteTable(nFormEle).bTableValid === false)) { // Table 'Cell' field Error
				return false;
			} else if ((eleConstraint === "isValidQuoteFile") && (validateQuoteFile(eleValue) === false)) { // Quote upload file field Error
				return false;
			}
			
			return true;
		}
		
		// Highlight form element error
		var highlightFormEle = function(nFormEle, eleConstraint) {
			if (eleConstraint === "isRadioOption") { // Highlight Radio Button Group
				var aRadioButtons=dojo.query("input[id='" + nFormEle.id + "']");
				for (var i=0; i < aRadioButtons.length; i++) { // Iterate over Radio Button Group
					if ((dojo.hasClass(aRadioButtons[i],sFormEleErrorClass)) === false) {
						dojo.addClass(aRadioButtons[i],sFormEleErrorClass); // Highlight error
					}
				}
			} else { // Highlight 'INPUT' or 'TEXTAREA' or 'SELECT' type (implicit)
				if (eleConstraint === "isQuoteTable") 
					nFormEle = nFormEle.parentNode; // Highlight table input field wrapper
				if ((dojo.hasClass(nFormEle,sFormEleErrorClass)) === false) { // No formele error flagged
					dojo.addClass(nFormEle,sFormEleErrorClass); // Highlight error
				}
			}
			return true;
		}
		
		// Reset form element error highlight
		var resetHighlightFormEle = function(nFormEle, eleConstraint) {
			if (eleConstraint === "isRadioOption") { // Reset Radio Button Group Highlight
				var aRadioButtons=dojo.query("input[id='" + nFormEle.id + "']");
				for (var i=0; i < aRadioButtons.length; i++) { // Iterate over Radio Button Group
					if ((dojo.hasClass(aRadioButtons[i],sFormEleErrorClass)) === true) {
						dojo.removeClass(aRadioButtons[i],sFormEleErrorClass); // Highlight error
					}
				}
			} else { // Reset highlight on 'INPUT' or 'TEXTAREA' or 'SELECT' type (implicit)
				if (eleConstraint === "isQuoteTable") 
					nFormEle = nFormEle.parentNode; // Reset highlight of table input field wrapper
				if ((dojo.hasClass(nFormEle,sFormEleErrorClass)) === true) {
					dojo.removeClass(nFormEle,sFormEleErrorClass); // Reset error
				}
			}
			return true;
		}
		
		// Highlight form element LABEL error
		var highlightFormEleLabel = function (nFormEle, eleConstraint) {
			if (eleConstraint === "isRadioOption") { // Set label highlight for Radio Button Group
				// In this scenario highlight all labels 'for' id
				var aLabels=dojo.query("label[for='" + nFormEle.id + "']");
				for (var i=0; i < aLabels.length; i++) { // Iterate over Radio Button Group
					if ((dojo.hasClass(aLabels[i],sFormEleLabelErrorClass)) === false ) {
						dojo.addClass(aLabels[i],sFormEleLabelErrorClass); // Highlight error
					}
				}
			} else { // Set label highlight for 'INPUT' or 'TEXTAREA' or 'SELECT' type (implicit)
				if(nFormEle.type != 'file'){
					if (nFormEle.label.nodeName === "LABEL") {
						if ((dojo.hasClass(nFormEle.label,sFormEleLabelErrorClass)) === false ) {
							dojo.addClass(nFormEle.label,sFormEleLabelErrorClass); // Highlight error
						}
					}
				}
			}
			return true;
			
		}
		
		// Reset form element LABEL error highlight
		var resetHighlightFormEleLabel = function(nFormEle, eleConstraint) {
			if (eleConstraint === "isRadioOption") { // Set label highlight for Radio Button Group
				// In this scenario highlight all labels 'for' id
				var aLabels=dojo.query("label[for='" + nFormEle.id + "']");
				for (var i=0; i < aLabels.length; i++) { // Iterate over Radio Button Group
					if ((dojo.hasClass(aLabels[i],sFormEleLabelErrorClass)) === true ) {
						dojo.removeClass(aLabels[i],sFormEleLabelErrorClass); // Highlight error
					}
				}
			} else { // Set label highlight for 'INPUT' or 'TEXTAREA' or 'SELECT' type (implicit)
				if(nFormEle.type != 'file'){
					if (nFormEle.label.nodeName === "LABEL") {
						if ((dojo.hasClass(nFormEle.label,sFormEleLabelErrorClass)) === true ) {
							dojo.removeClass(nFormEle.label,sFormEleLabelErrorClass); // Highlight error
						}
					}
				}
			}
			return true;
		}
		
		/* @description clear quote table errors
		 * @param {array} aErrorRows
		 * @param {string} element validation constraint
		 */ 
		var resetQuoteTableErrors = function(aErrorRows,eleConstraint) {
			for(var i=0;i < aErrorRows.length;i++){ // iterate rows
				if (aErrorRows.bRowValid !== true) { // Error on Row, so reset
					var aErrorCells = aErrorRows[i].aErrorCells;
					for(var n=0;n < aErrorCells.length;n++){ // iterate cells
						var nFormEle = dojo.byId(aErrorCells[n].sInputId);
						if (nFormEle !== null) {
							resetHighlightFormEle(nFormEle, eleConstraint); // Reset element error
						}
					}
				}
			}
		}
		
		// Build assignment references to form labels on each associated for element
		var assignFormLabelRefs = function () {
			var labels = dojo.doc.getElementsByTagName("LABEL");
			for (var i = 0; i < labels.length; i++) {
			    if (labels[i].htmlFor != '') {
			    	//var elem = dojo.query("*[id='" + labels[i].htmlFor + "']");
			         var elem = dojo.byId(labels[i].htmlFor); // can't ident by ID
			         if (elem) {
			            elem.label = labels[i];
			         }             
			    }
			}
			return true;
		}
		
		// validate form element
		var validateFormEle = function (requiredFormEle) {
			var eleId = requiredFormEle.id;
			var eleConstraint = requiredFormEle.constraint;
			var eleErrorTxt = requiredFormEle.errorTxt;
			
			var nFormEle = dojo.byId(eleId); // Return single id into array
			
			if (eleConstraint !== "isQuoteTable") // Trap Quote table ID's as values retrieved two dimensionally (row x col)
				var eleValue = nFormEle.value;
			else
				var eleValue = "";

			var isFormEleValid = testConstraint(nFormEle, eleConstraint, eleErrorTxt, eleValue);
				
			if (isFormEleValid !== true) {
				sErrorMessage += "<p class='" + sFormErrorMsgClass + "'>" + eleErrorTxt + "</p>"; // Append Error Message
				
				if (eleConstraint == "isQuoteTable") { // Highlight Quote Table
					var aErrorRows = oQuoteTableValidation.aErrorRows;
					resetQuoteTableErrors(aErrorRows, eleConstraint); // Clear quote table errors
					
					// oQuoteTableValidation = {bTableValid:true||false,aErrorRows:[{bRowValid:true||false,aErrorCells:[{bCellValid:true,sInputId:sInputFieldID}]}]
					for(var i=0;i < aErrorRows.length;i++){ // iterate rows
						if (aErrorRows.bRowValid !== true) { // Error on Row, so highlight
							var aErrorCells = aErrorRows[i].aErrorCells;
							for(var n=0;n < aErrorCells.length;n++){ // iterate cells
								if (aErrorCells[n].bCellValid === false) { // Highlight Cell
									var nFormEle = dojo.byId(aErrorCells[n].sInputId);
									highlightFormEle(nFormEle, eleConstraint); // Flag element error
								}
							}
						}
					}
					
				} else { // Highlight other elements
					highlightFormEle(nFormEle, eleConstraint); // Highlight error element
					highlightFormEleLabel(nFormEle, eleConstraint); // Highlighed associated Label text
					
				}

				bFormValid = false; // Flag form error for form submission
					
			} else {
				if (eleConstraint == "isQuoteTable") { // Reset Highlight Quote Table
					var aErrorRows = oQuoteTableValidation.aErrorRows;
					resetQuoteTableErrors(aErrorRows, eleConstraint); // Clear quote table errors
					
				} else { // Reset Highlight to other elements
					resetHighlightFormEle(nFormEle, eleConstraint); // Reset element error
					resetHighlightFormEleLabel(nFormEle, eleConstraint); // Reset any associated highlighted Label text
				}
					
			}

		}
		// END: Helper Functions
		
		// INIT
		var sFormID = sFormID; // Form ID
		var nForm;
		var sFormErrorMsgID = sFormErrorMsgID; // Error Message ID
		var sLeadingErrorMsg = sLeadingErrorMsg;
		var sErrorMessage ="";
		var aRequiredFields = aRequiredFields; // Required Fields Array
		var bFormValid = true; // Form is Valid Flag
		var oQuoteTableValidation; // QuoteTable Object
		
		// Form error styles
		var sFormErrorMsgClass = "mk-mandatory-text mk-bottommargin-6";
		var sFormEleErrorClass = "mk-simple-form1-error";
		var sFormEleLabelErrorClass = "mk-simple-form1-label-error";
		
		if (isStringTest(sFormID) === true){
			nForm = dojo.byId(sFormID); // Get form element ID
			
			if ((nForm !== null) && (isArrayTest(aRequiredFields) == true)) { // form ID exists and 'aRequiredFields' is an Array
				
				assignFormLabelRefs(); // Build associated label references to form elements
				
				for (var i = 0;i < aRequiredFields.length;i++) { // iterate Array of 'Required Fields' Objects
					
					if (isObjectTest(aRequiredFields[i]) === true) { // is an Object
							
						if ((typeof aRequiredFields[i].id !== 'undefined') && 
						 (typeof aRequiredFields[i].constraint !== 'undefined') && 
						 (typeof aRequiredFields[i].errorTxt !== 'undefined')) { // 'id', 'constraint', 'errorTxt' supplied
							
			        		validateFormEle(aRequiredFields[i]); // Process Field Requirement Object
			 
			       		} else if (bDebugmode === true) {
			        		console.log("'aRequiredFields' Array should contain valid Objects, with name and constraints attributes");
			        		return false;
			        	} else {
			        		return false;
			        	}
						
					} else if (bDebugmode === true) {
				    	console.log("'aRequiredFields' Array should contain valid Objects, with name and constraints attributes");
						return false;
				   	} else {
				   		return false;
					}
		
				}
				
				// Display Error Messages || Submit form
				var nFormMessage = dojo.byId(sFormErrorMsgID); // Error Message Node
				
				if (bFormValid !== true) { // Report Errors
					sErrorMessage = "<p class='" + sFormErrorMsgClass + "'><strong>" + 
					sLeadingErrorMsg + "</strong></p>" + sErrorMessage; // Error Message

					if (nFormMessage !== "undefined") { // Error Message Node exists
						nFormMessage.innerHTML = sErrorMessage;
					}
					
				} else { // No Errors
					// Clear reported Errors
					if (nFormMessage !== "undefined") // Error Message Node exists
						nFormMessage.innerHTML = ""; // Clear content
						
					nForm.submit(); // Submit form

				}

			} else if (bDebugmode === true) {
	    		console.log("'aRequiredFields' should be a vaild Array Object");
	    		return false;
	   		} else {
	   			return false;
	   		}
			
		} else if (bDebugmode === true) {
    		console.log("Require an 'formID' String parameter");
    		return false;
   		} else {
   			return false;
   		}
		
	}
	
	/* Form validation
	 * @public
	 * @param {string} sformID - ID of Form
	 * @param {string} sFormErrorMsgID - ID of div container for error message
	 * @param {string} sLeadingErrorMsg - Leading error Message
	 * @param {array} aRequiredFields - array of 'Required Field' Objects
	 * @param {string} aRequiredFields[n].id - id name of form element
	 * @param {string} aRequiredFields[n].constraint="isText" || "isEmail" || "isTelephone" - How to validate
	 * @param {string} aRequiredFields[n].errorTxt Error text to be displayed
	 * 
	 */
	var formCheck = function(sFormID, sFormErrorMessageID, sLeadingErrorMessage, aRequiredFields) {
		dojo.connect( dojo.byId(sFormID), 'onsubmit', dojoForm );
		function dojoForm(e) {
		  e.preventDefault();
		  validateForm(sFormID, sFormErrorMessageID, sLeadingErrorMessage, aRequiredFields);
		}
		
	}
	
	/* @private
	 * @description Helper function to setFormElementFromURL function to 'select' a given form option by value
	 * @see setFormElementFromURL
	 * @param {string} sIssueType="Product_Queries" || "Delivery_Queries" || 
	 *    "Order_Queries" || "Quality_Queries" || "General_Queries" || "Feedback_Queries"
	 * @param {string} sFormEleID - select form element ID
	 * @returns {boolean}
	 */
	var preSelectFormOption = function(sIssueType, sFormEleID ) {
		var selectFormEle = dojo.byId(sFormEleID);
		if (selectFormEle !== "undefined") {
			for (var i=0; i < selectFormEle.options.length; i++) {
				if (selectFormEle.options[i].value === sIssueType) {
					selectFormEle.options[i].selected = true; // Select the option
					break;
				} else {
					selectFormEle.options[0].selected = true; // Select first option, as fallback
				}	
			}
		} else if (bDebugmode === true) {
    		console.log("Form Element Node with ID: " + sFormEleID + " not found");
    		return false;
   		} else {
   			return false;
   		}
		return true;
	}
		

	/* @public
	 * @description Pre-select Form Select Option from param on URL stream
	 * @see <a href="http://uk.farnell.com/feedback-report-a-problem-form"Feedback/Report a Problem page</a>
	 * @param {string} sURLParam - parameter variable, that holds 'Issue Type'
	 * @param {string} sFormEleID - ID of 'Issue Type' form SELECT element to 'select'
	 */
	var setFormElementFromURL = function(sURLParam, sFormEleID) {
		var oUrl_params = (dojo.queryToObject(location.search.substr(1))); // Get URL Params
		
		if (isObjectTest(oUrl_params) === true) { // is an Object
							
			if (typeof oUrl_params[sURLParam] !== 'undefined') { // parameter returned
				var sIssueType = oUrl_params[sURLParam]; // Copy out 'Issue_Type' param
				preSelectFormOption(sIssueType, sFormEleID);
	
			} else if (bDebugmode === true) {
    			console.log("URL Parameter " + sURLParam + " not found");
	   		} else {
	   			return false;
	   		}
			
		} else if (bDebugmode === true) {
    		console.log("Unable to return a valid location param object");
    		return false;
   		} else {
   			return false;
   		}
		
	}	

	/* @public
	 * @description Add a row to the 'Request a Quote' form Parts List Table
	 * @see <a href="uk.farnell.com/request-a-quote">The Request a Quote page</a>
	 * @param {string} sAddButtonID - ID to Add Row Button
	 * @param {string} sFormTableID - ID to Parts List Table
	 * @param {array} sInputs - ID to Table
	 * @returns {boolean}
	 */
	var addFormTableRow = function(sAddButtonID, sFormTableID, sInputs) {
		var nButton = dojo.byId(sAddButtonID);
    	var nTable = dojo.byId(sFormTableID);
    	var sInputIDs = typeof sInputs === "undefined" ? ["partNo_","manufacturerPartNo_","manufacturer_","quantity_","price_"] : sInputs;
    	
    	if ((nButton !== "undefined") && (nTable !== "undefined")) { // Returned Table and Button node
    		
    		dojo.connect(nButton, "onclick", function(){
    			var rowCount = nTable.rows.length;
        		var row = nTable.insertRow(rowCount); // Insert row
        		
        		for (var i=0;i<nTable.rows[0].cells.length;i++){
					var cell = row.insertCell(i); // insert cell into row
//					var wrapperDiv = dojo.doc.createElement("div"); // create wrapper div
//					dojo.addClass(wrapperDiv,"mk-inputwrapper");
					var inputField = dojo.doc.createElement("input"); // create input field
					inputField.type = "text";
					inputField.name = sInputIDs[i] + rowCount;
					inputField.id = sInputIDs[i] + rowCount;
//					wrapperDiv.appendChild(inputField); // add input field as child of wrapper div
//					cell.appendChild(wrapperDiv); // add wrapper div as child of cell
					cell.appendChild(inputField); // add as child of cell
				}
				
				return true;
        		
    		});

    	} else if (bDebugmode === true) {
    		console.log("addFormTableRow: Unable to return a valid Button or Form Table node");
    		return false;
   		} else {
   			return false;
   		}

	}
	
	/* @public
	 * @description Delete a row from the 'Request a Quote' form Parts List Table
	 * @see <a href="uk.farnell.com/request-a-quote">The Request a Quote page</a>
	 * @param {string} sAddButtonID - ID to Add Row Button
	 * @param {string} sFormTableID - ID to Parts List Table
	 * @returns {boolean}
	 */
	var delFormTableRow = function(sDelButtonID, sFormTableID) {
		var nButton = dojo.byId(sDelButtonID);
    	var nTable = dojo.byId(sFormTableID);
    	
    	if ((nButton !== "undefined") && (nTable !== "undefined")) { // Returned Table and Button node
    		dojo.connect(nButton, "onclick", function(){
    			var rowCount = nTable.rows.length;
				if(rowCount>2) // Ensures to not delete the first row and the title row
				{
        		var row = nTable.deleteRow(rowCount - 1); // Delete row
        		return true;
				}
				return false;

    		});

    	} else if (bDebugmode === true) {
    		console.log("addFormTableRow: Unable to return a valid Button or Form Table node");
    		return false;
   		} else {
   			return false;
   		}
    }
    
    /* @public
     * @description Populate Special Offers, by manufacturer from SELECT pulldown value into link button (sSubBtn)
     * @see http://uk.farnell.com/special-offers
     * @param {string} id name of form SELECT element
     * @param {string} is name of mk-btn 'button' link
     * @param {string} placeholder link. Note: 'MANUFACTURER-VALUE' is replaced with value from SELECT menu
     */
	var specialOfferManSelect = function(sSelMan, sSubBtn, sHref) {
		var sSelMan = sSelMan;
		var sSubBtn = sSubBtn;
		var sHref = sHref;
		var nSelMan = dojo.byId(sSelMan);
		var nSubBtn = dojo.byId(sSubBtn);

		var sSearchPattern = "mf=MANUFACTURER-VALUE";
		var searchReplace = "mf=" + nSelMan.value;
		var sHref = sHref.replace(sSearchPattern, searchReplace);
	
		/* Update search pattern since string has been altered */
		searchPattern = searchReplace;

		nSubBtn.setAttribute('href', sHref);
		
		var manSelect = function(e) {
		  e.preventDefault();
		  searchReplace = "mf=" + e.target.value;
		  sHref = sHref.replace(searchPattern.trim(), searchReplace);
		  /* Update search pattern since string has been altered */
		  searchPattern = searchReplace;

		  nSubBtn.setAttribute('href', sHref);
		}
		dojo.connect( nSelMan, 'onchange', manSelect );
		dojo.connect( nSelMan, 'onkeyup', manSelect);
		return true;
	}

    /* @public
     * @description Select Anchor link
     * @see http://uk.farnell.com/special-offers
     * @param {string} sAnchor - reference to select menu element id, to get value of id to scroll too.
     */
    var selectAnchor = function(sAnchor) {
        var nSelect = dojo.byId(sAnchor);
        if (isObjectTest(nSelect)) {
            dojo.connect(nSelect, 'onchange', function(evt) {
                evt.preventDefault();
                dojo.byId(evt.target.value).scrollIntoView();
                //dojo.window.scrollIntoView(evt.target.value);
            });
        }
    }

	
	/* @public
     * @description Add to cart functionality, passing GUI IDs
     * @see add-to-cart URI
     * @param {object} oAddtoCartGUI
     * @param {string} oAddtoCartGUI.sDecreBtnID - Decrement button ID
     * @param {string} oAddtoCartGUI.sIncreBtnID - Increment Button ID
     * @param {string} oAddtoCartGUI.sQtyID - Quantity field ID
     * @param {string} oAddtoCartGUI.sAddtoBtnID - Add to Cart Button ID
     * @param {string} oAddtoCartGUI.sProdSKU - Product SKU
     */
    var addtoCartGUI = function(oAddtoCartGUI) {
		
    	if(isObjectTest(oAddtoCartGUI) === true) {
    		var sDecreBtnID = oAddtoCartGUI.sDecreBtnID;
    		var sIncreBtnID = oAddtoCartGUI.sIncreBtnID;
    		var sQtyID = oAddtoCartGUI.sQtyID;
    		var sAddtoBtnID = oAddtoCartGUI.sAddtoBtnID;
    		var sProdSKU = oAddtoCartGUI.sProdSKU;
    		
    		dojo.connect(dojo.byId(sDecreBtnID),"onclick",function(evt){
    			evt.preventDefault();
    			if (Number(dojo.byId(sQtyID).value) > 0) {
    				dojo.byId(sQtyID).value=(Number(dojo.byId(sQtyID).value)-1);
    			}
    		});
    		dojo.connect(dojo.byId(sIncreBtnID),"onclick",function(evt){
    			evt.preventDefault();
    			dojo.byId(sQtyID).value=(Number(dojo.byId(sQtyID).value)+1);
    		});
    		dojo.connect(dojo.byId(sAddtoBtnID),"onclick",function(evt){
    			evt.preventDefault();
    			if (Number(dojo.byId(sQtyID).value) < 0) {
    				dojo.byId(sQtyID).value = 1;
    			}
    			var sQty = dojo.byId(sQtyID).value;
    			dojo.doc.location="/?buy="+sProdSKU+"~"+sQty;
    		});
    		
    	} else {
    		return false;
    	}

    }
	
    /*
     * @description Commission Junction tracking, used on US store
     * @see www.newark.com
     * @param {object} oCjParams
     * @param {string} oCjParams.CID - Enterprise ID
     * @param {string} oCjParams.TYPE - Action ID
     * @param {string} oCjParams.CURRENCY
     * @param {string} oCjParams.containerTagId
     */
    var commissionJunction = function(oCjParams) {
    	/*
		var tagging = {};
		tagging.data = {};
		tagging.data.omniture = {};
		tagging.data.omniture["products"] = ";15J1245;1;10.53,;93C7943;1;8.20,;93C7950;1;9.82,;86R5782;1;24.16;event18=0.00|event19=0.00|event20=0.00|event21=0.00";
		tagging.data.omniture["purchaseID"] = "ABC1234";
		*/
		
		if(pf.tagging.tog.omniture) {
			
			//console.log('cj v9');
			
			// Cookie creation
			
			if(typeof s == "undefined" || s == ""){ 
				return; 
			}

			var sCjUri = s.pageURL; var sCjQuery = sCjUri.substring(sCjUri.indexOf("?") + 1, sCjUri.length);
			var sCjQueryObject = dojo.queryToObject(sCjQuery);
			if('source' in sCjQueryObject) {
				if(sCjQueryObject['source'] === 'CJ') {
					var cCJCookie = new siteCookies();
					cCJCookie.set('CommissionJunction','yes', 7);
					//dojo.cookie('CommissionJunction','yes',{ expires: 7 });
				}
			}
				
			if(pf.tagging.data.omniture.pageName === 'Checkout:Order Confirmation') {
				
				//console.log('cj order confirmation');
				
				var cCJCookie = new siteCookies();
				var sCjVal = cCJCookie.get('CommissionJunction');
				//var sCjVal = dojo.cookie('CommissionJunction');
				
				if(sCjVal!=null && 0 != sCjVal.length && sCjVal.trim()=='yes') {

					// Trim event sub-string
					var products = pf.tagging.data.omniture.products.replace(/^;|event.*|,/g,'').replace(/;$/g,'');
					var aProducts = products.split(";");
							
					var sCjComm = '&OID=' + pf.tagging.data.omniture.purchaseID; // Order ID
	
					var n = 0; var i = 1; var OrderTotal=0.00;
					while (n < aProducts.length) { // Build order
						
						var OrderCode = aProducts[n];
						var l = (n === 0) ? 0 : n / 3;
						
						sCjComm += '&' + 'ITEM' + i + '=' + OrderCode + '&';
						if (n+1 <= aProducts.length) {
							var OrderCodeQty = aProducts[n+1];
							sCjComm += 'QTY' + i + '=' + OrderCodeQty + '&';
						}
						if (n+2 <= aProducts.length) {
							var OrderCodePrice = aProducts[n+2];
							sCjComm += 'AMT' + i + '=' + (OrderCodePrice/OrderCodeQty);
						}
						n+=3;i++;

					}
					
					//console.log('sCjComm', sCjComm);
					
					// Create CJ container Tag
					var nContainerDiv = dojo.byId('bodyContainer');
					var nCj = dojo.create("div",{id:oCjParams['containerTagId']},nContainerDiv,"last");
					
					// Create CJ iFrame
					var sCjUrl = 'https://www.emjcd.com/tags/c?containerTagId=' + oCjParams['containerTagId'] + '&CID=' + oCjParams['CID'] + '&TYPE=' + oCjParams['TYPE'] + '&CURRENCY=' + oCjParams['CURRENCY'] + sCjComm;
					var sCjNode = '<iframe height="1" width="1" frameborder="0" scrolling="no" src="' + sCjUrl + '" name="cj_conversion" id="' + oCjParams['iFrameId'] + '" />';
					
					var nCjIframe = dojo.place(sCjNode, nCj, "first");
					
					// Expire cookie
					cCJCookie.set('CommissionJunction','yes', -1);
					//dojo.cookie('CommissionJunction', null, {expires: -1});

				} else {
					// Remove iFrame
					dojo.destroy(oCjParams['iFrameId']);
					
					// Remove container tag
					if (dojo.byId(oCjParams['containerTagId']) !== null) 
						dojo.destroy(oCjParams['containerTagId']);
						
				}
			}			
		}
    	
    	
    }
	
	/*
     * @description Cookie Class, taken from ATG platform
     * utilising this Class, as issues with the native Dojo.cookie (v1.5)
     * observed across http:// and https:// expiring Cookie
     */
	var siteCookies = function() {

		this.set = function(key, value, days){
			var today = new Date();
			var expire = new Date();
			if (days==null || days==0) days=1;
			expire.setTime(today.getTime() + 3600000*24*days);
			document.cookie = key+"="+escape(value)+ ";expires="+expire.toGMTString() + "; path=/";
	    };
	
		this.get = function(key){
			var theCookie=" "+document.cookie;
			var ind=theCookie.indexOf(" "+key+"=");
			if (ind==-1) ind=theCookie.indexOf(";"+key+"=");
			if (ind==-1 || key=="") return "";
			var ind1=theCookie.indexOf(";",ind+1);
			if (ind1==-1) ind1=theCookie.length;
			return unescape(theCookie.substring(ind+key.length+2,ind1));
	    };
		
	}
	
	/*
     * @description Change URL
     * Used on Country drop-down. (K.Kamati)
     */
	var chgDom = function(cVal){
    	var countryDom=cVal;
        cFrags=countryDom.match(/(\d)([a-z]*)/);
                                
        if(cFrags[1]=='1'){
        	window.location="http://www.newark.com/brazil-direct-ship";
        } else if(cFrags[1]=='2'){
            window.location="http://"+cFrags[2]+".newark.com";
        } else if(cFrags[1]=='3'){
        	window.location="http://www.newark.com";
        }else if(cFrags[1]=='4'){
            window.location="http://"+cFrags[2]+".farnell.com";
        }else if(cFrags[1]=='5'){
            window.location="http://"+cFrags[2]+".element14.com";
        }
    }


	/*
     * @description raspberry Pi pop-up message with overlay
     *
     */
    var raspberryPopup = function(path, store){
        var cookieName = "MK_PDP_POP_RASPBERRY", redirectURL = 'http://farnell.com/raspberrypi-consumer/approved-retailers.php';
        var cookie = dojo.cookie(cookieName);
        if (cookie != "business" || typeof cookie === 'undefined'){
            var bgImg = "RBPopup-bg-reseller.png";
			
			if(typeof store != 'undefined' && store== "uk"){
				bgImg = "RBPopup-bg-cpc.png";
				redirectURL = "http://cpc.farnell.com/raspberrypi";
			}			
            
            var outputHTML = '<div class="mk-overlay" id="raspberryPopup"><div class="mk-overlay-back">&nbsp;</div><div class="mk-overlay-fore"><a href="javascript:void(0)" id="mktg_pop_business"><img src="'+path+'/europe/common/btn-business.png" /></a><a href="'+redirectURL+'"><img src="'+path+'/europe/common/btn-personal.png" /></a></div></div>';
            dojo.place(outputHTML, dojo.body());
            
            dojo.style(dojo.query("#raspberryPopup .mk-overlay-fore")[0], {
                marginLeft: "-226px",
                paddingTop: "140px",
                borderRadius: "15px",
                textAlign: "center",
                width: "440px",
                height: "175px",
                background: "url('"+path+"/europe/common/"+bgImg+"') transparent no-repeat top left"  
            });
            dojo.query("#raspberryPopup a").style("margin", "0 15px");
            dojo.style(dojo.byId("raspberryPopup"), {
                display:"block"
            });
            
            dojo.connect(dojo.byId('mktg_pop_business'),'onclick',function(){
                dojo.style(dojo.byId("raspberryPopup"), {
                    display:"none"
                });
                dojo.cookie(cookieName, "business",  {expires: 365});
            });
            
        }
    }
    
    /*
      * @private
      * @description Ajax Snippets - Use XHR to pull in HTML content to areas outside of espots (Requires GIS approval of implementation before use)
      * @see 'cookieCompliance()' / Chris Rymer
      * @param {string} path - The path to the required snippet eg. ${asset.media/xxx/xxx/xxx.html}
      * @param {object} target - Dom object of the target element
      * @param {string} position - Placement of ajax content relative to the target object (before/after)
      * @param {function} fn - *Optional* Function to be run after content is apended, uses: hook in event listeners/change element states.
      */
    var ajaxSnippet = function(path, target, position, fn){
    	var error,ajax;

    	if(typeof path === "undefined" || typeof path !== "string") {
    		throw new Error("ajaxSnippet: path parameter is not a string");
    		return false;
    	} else if (typeof target === "undefined" || typeof target !== "object") {
    		throw new Error("ajaxSnippet: target element is not a object [Use a DOM element]");
    		return false;
    	} else if (typeof position === "undefined" || typeof position !== "string") {
    		throw new Error("ajaxSnippet: position parameter is not a string");
    		return false;
    	}

    	ajax = dojo.xhrGet({
    		url: path,
    		handleAs: "text",
    		timeout: 5000,
    		preventCache: false,
    		load: function(response, ioArgs) {
    			dojo.place(response,target,position);

    			/* Execute post process function */
    			if(typeof fn !== "undefined" && typeof fn === "function") {
    				fn();
    			} else if (typeof fn !== "undefined" && typeof fn !== "function") {
    				throw new Error('ajaxSnippet: the parameter provided is not a function');
    			}

    		},
    		error: function(error){
    			throw new Error('ajaxSnippet: XHR failure fetching template', error);
    		}
    	});
    }

   /*
    * @public
    * @description Cookie Compliance - Manages the Cookie compliance banner
    * @param {string} path - The path to the required snippet eg. ${asset.media/xxx/xxx/xxx.html}
    * @param {object} target - Dom object of the target element
    * @param {string} position - Placement of ajax content relative to the target object (before/after)
    * @param {function} fn - *Optional* Function to be run after content is apended, uses: hook in event listeners/change element states.
    */
    var cookieCompliance = function(cookieName, snippetPath, resetDate) {

        var sc = new siteCookies(),
            validFrom = resetDate || new Date("01/01/2014"),
            cookieVal = sc.get(cookieName),
            isCookieSet = (cookieVal !== "");

        if (/^\".*\"$/.test(cookieVal))
        {
            cookieVal = dojo.fromJson(cookieVal);
        }
        else
        {
            cookieVal = dojo.toJson(cookieVal);
        }

        function isReadyToReset() {
            var today = new Date();
            today.setHours(0,0,0,0);
            var cookieResetDate = new Date(resetDate);

            return today.valueOf() >= cookieResetDate.valueOf();
        }

    	function cookieAccept() {
    		var cookieWrapper = dojo.byId('mktg_Cookie_Wrap'),
    		cookieBtn = dojo.byId('mktg_Cookie_button'),
    		xhr;

    		/* Click event for cookie accepta1nce */
    		dojo.connect(cookieBtn,"onclick",function(evt) {
    			evt.preventDefault(evt);

                sc.set(cookieName, dojo.toJson(new Date().toDateString()), 365);

    			/* Hide cookie banner */
    			cookieWrapper.style.display = "none";
    		});
    	}

        if ((new Date(cookieVal) == "Invalid Date" || cookieVal == "010415") && isCookieSet) // current cookie value for uk or can be true
        {
            // set to new cookie value as date object
            sc.set(cookieName, dojo.toJson(new Date("01/01/2014").toDateString(), 365));
        }
        else if((!isCookieSet ||(isCookieSet && new Date(cookieVal) < new Date(validFrom) && isReadyToReset())))
        {
            var xhr = ajaxSnippet(snippetPath, dojo.body(), "first", cookieAccept);
            if(xhr === false) {
                throw new Error('cookieCompliance: ajaxSnippet - request failed - bad parameters');
            }
        }
    };



   /*
    * @public
    * @description APAC Combo Box
    * @param {object} dataArray - Select option list
    * @param {string} selectBoxID1 - Select box 1's ID
    * @param {string} selectBoxID2 - Select box 2's ID
    * @param {string} selectBoxID3 - Select box 3's ID
    * @param {string} searchButtonID - Search button's ID
    */
		var makeCombo = function(dataArray, selectBoxID1,selectBoxID2,searchButtonID){
		this.firstLevel = dojo.byId(selectBoxID1);
		this.secondLevel = dojo.byId(selectBoxID2);
		if (!Object.keys) {
    		Object.keys = function(obj) {
        	var keys = [],
            key;

        	for (key in obj) {
           	 if (obj.hasOwnProperty(key)) {
              	  keys.push(key);
           		 }
        	}

        	return keys;
    		};
		}
		for(var i=0; i<Object.keys(dataArray).length; i++){
			var option = document.createElement("option");
			option.text = Object.keys(dataArray)[i];
			option.value = i;
			this.firstLevel.add(option);
		}
		this.comboOnchange = function(level){
			var selectBox;
			if(level == 1){
				selectBox = this.secondLevel;
				this.secondLevel.options.length = 0; 
			}
			
			var secondLevel = dataArray[Object.keys(dataArray)[this.firstLevel.value]];
			
			var updateList = secondLevel;
			
			if(level == 2){
				updateList = secondLevel[Object.keys(secondLevel)[this.secondLevel.value]];
			}
			if(typeof(updateList) == 'object'){
				for(var j=0; j<Object.keys(updateList).length; j++){
					var option = document.createElement("option");
					option.text = Object.keys(updateList)[j];
					if(level == 1){
						option.value = updateList[Object.keys(updateList)[j]];
					}else{
						option.value = j;
					}
					if(j == 0){
						option.defaultSelected = true;
					}
					
					selectBox.add(option);
				}
			}
		};
		var _this = this;
		dojo.connect(this.firstLevel, "onchange", function(){	
			_this.comboOnchange(1);	
		});	
		dojo.connect(this.secondLevel, "onchange", function(){
			var URL = _this.secondLevel.value;
			if(URL){
				dojo.connect(dojo.byId(searchButtonID), "onclick", function(){
					location.href = URL;
		});	
			}
		});	
	}
	
	var makeCombo2 = function(dataArray, selectBoxID1,selectBoxID2,selectBoxID3,searchButtonID){
		this.firstLevel = dojo.byId(selectBoxID1);
		this.secondLevel = dojo.byId(selectBoxID2);
		this.thirdLevel = dojo.byId(selectBoxID3);
		if (!Object.keys) {
    		Object.keys = function(obj) {
        	var keys = [],
            key;

        	for (key in obj) {
           	 if (obj.hasOwnProperty(key)) {
              	  keys.push(key);
           		 }
        	}

        	return keys;
    		};
		}
		for(var i=0; i<Object.keys(dataArray).length; i++){
			var option = document.createElement("option");
			option.text = Object.keys(dataArray)[i];
			option.value = i;
			this.firstLevel.add(option);
		}
		this.comboOnchange = function(level){
			var selectBox;
			if(level == 1){
				selectBox = this.secondLevel;
				this.secondLevel.options.length = 0; 
			}else if(level == 2){
				selectBox = this.thirdLevel;
			}
			this.thirdLevel.options.length = 0; 
			
			var secondLevel = dataArray[Object.keys(dataArray)[this.firstLevel.value]];
			
			var updateList = secondLevel;
			
			if(level == 2){
				updateList = secondLevel[Object.keys(secondLevel)[this.secondLevel.value]];
			}
			if(typeof(updateList) == 'object'){
				for(var j=0; j<Object.keys(updateList).length; j++){
					var option = document.createElement("option");
					option.text = Object.keys(updateList)[j];
					if(level == 2){
						option.value = updateList[Object.keys(updateList)[j]];
					}else{
						option.value = j;
					}
					if(j == 0){
						option.defaultSelected = true;
					}
					
					selectBox.add(option);
				}
			}
		};
		var _this = this;
		dojo.connect(this.firstLevel, "onchange", function(){	
			_this.comboOnchange(1);	
		});	
		dojo.connect(this.secondLevel, "onchange", function(){
			_this.comboOnchange(2);
		});	
		dojo.connect(this.thirdLevel, "onchange", function(){
			var URL = _this.thirdLevel.value;
			if(URL){
				dojo.connect(dojo.byId(searchButtonID), "onclick", function(){
					location.href = URL;
				});	
			}
		});	
	}	
	
   /*
    * @public
    * @description APAC Weekly Deal
    * @param {integer} initYear - Deal start year
    * @param {integer} initMonth - Deal start month
    * @param {integer} initDay - Deal start day
    * @param {array} deals - Weekly deal feed data
    */
	var weeklyDeal = function(initYear, initMonth, initDay, deals){
		this.countdown = function(){
			var leftTime = this.calcage();
			var output = '';
			if(leftTime[0]>0){
				output += leftTime[0]+" day"+this.addS(leftTime[0])+" ";
			}
			if(leftTime[1]>0){
				output += leftTime[1]+" hour"+this.addS(leftTime[1])+" ";
			}
			if(leftTime[2]>0){
				output += leftTime[2]+" min"+this.addS(leftTime[2])+" ";
			}
			output += leftTime[3]+" sec"+this.addS(leftTime[3]);
			dojo.byId('countdown').innerHTML = output;
			if(this.leftSecond>0){
				this.leftSecond--;
			}
		};
		
		this.addS = function(number){
			return number < 2 ? "" : "s";
		};
		
		this.calcage = function(){
			var day = Math.floor(this.leftSecond/86400);
			var hour = Math.floor((this.leftSecond-day*86400)/3600);
			var minute = Math.floor((this.leftSecond-day*86400-hour*3600)/60);
			var second = this.leftSecond-day*86400-hour*3600-minute*60;
			return [day,hour,minute,second];
		};
		
		this.leftSecond = 0;
		var today = new Date();
		var initDate = new Date(initYear, initMonth-1, initDay);
		var endDate  = new Date(initDate.getTime() + 86400000*deals.length*7);
		if(today >= initDate && today < endDate){
			var currentDeal = 0;
			var seconds = 0;
			var dealStart = initDate;
			var dealEnd = new Date(dealStart.getTime() + 86400000*7);
			for(var i =0; i < deals.length; i++){
				if(today >= dealStart && today < dealEnd){
					currentDeal = i;
					this.leftSecond = Math.floor((dealEnd.getTime() - today.getTime())/1000);
					break;
				}
				dealStart = dealEnd;
				dealEnd = new Date(dealEnd.getTime() + 86400000*7);
			}
			
			dojo.byId('wd_title').innerHTML = deals[currentDeal].wd_title;
			dojo.byId('wd_prd_manu_logo').innerHTML = "<img src='"+deals[currentDeal].wd_prd_manu_logo+"'>";
			dojo.byId('wd_prd_img').innerHTML = "<img src='"+deals[currentDeal].wd_prd_img+"'>";
			dojo.byId('wd_percentage').innerHTML = deals[currentDeal].wd_percentage;
			dojo.byId('wd_usualprice_text').innerHTML = deals[currentDeal].wd_usualprice;
			dojo.byId('wd_price_text').innerHTML = deals[currentDeal].wd_price;
			dojo.byId('wd_prd_title').innerHTML = deals[currentDeal].wd_prd_title;
			dojo.byId('wd_prd_info_code').innerHTML = deals[currentDeal].wd_prd_info_code;
			dojo.byId('wd_prd_info_highlights').innerHTML = deals[currentDeal].wd_prd_info_highlights;
			dojo.byId('wd_buynow_link').href = deals[currentDeal].wd_buynow_link;
			
			var _this = this;
			setInterval(function(){
				_this.countdown();
			},1000);
	
			dojo.byId('weekly_deals').style.display = "block";
		}
	}
	
	/*
    * @public
    * @description Accordion pane toggle
    * @param {string} root id of accordion
    */
	var togglePanes = function(sToggleRoot) {
        
        dojo.require("dojo.fx");
        
        dojo.declare("mk.Toggler",null,{
            constructor:function(nTogglerNode) {
                
                this.isClicked = true;
                this.nTogglerNode = nTogglerNode;
                this.nTogglerButton = this.getTogglerButton();
                this.nTogglerPane = this.getTogglerPane();
                
                this.node = this.nTogglerNode;
                this.showFunc = dojo.fx.wipeIn;
                this.hideFunc = dojo.fx.wipeOut;
                
                this.paneToggler = new dojo.fx.Toggler({
                    node: this.nTogglerPane, showFunc: dojo.fx.wipeIn, hideFunc: dojo.fx.wipeOut
                });
                
                dojo.connect(this.nTogglerNode,"onclick",this,function(e){
                        
                        var previous = this.paneToggler;
                        
                        if (this.getPreviousPane() !== '') {
                            if (this.getPreviousPaneNode().id !== this.nTogglerPane.id) {
                                this.getPreviousPane().hide();
                                this.paneToggler.show(); 
                            } else {
                                this.paneToggler.hide();
                                previous = '';
                            }
                        } else {
                            this.paneToggler.show();
                            
                        }

                        this.setPreviousPane(previous);
                        this.setPreviousPaneNode(this.nTogglerPane);

                });

            },
            getTogglerPane:function() {
                var sTogglePane = dojo.attr(this.nTogglerButton, "data-togglepane");
                return dojo.query('#' + sTogglePane,this.nTogglerNode)[0];
            },
            getTogglerButton:function() {
                var sToggleButton = dojo.attr(this.nTogglerNode, "data-togglebutton");
                return dojo.query('#' + sToggleButton,this.nTogglerNode)[0];
            },
            getTogglerNode:function() {
                return this.nTogglerNode;   
            },
            setPreviousPane:function(tPane) {
                this.statics.tPane = tPane;  
            },
            setPreviousPaneNode:function(tPaneNode) {
                this.statics.tPaneNode = tPaneNode;  
            },
            getPreviousPane:function() {
                return this.statics.tPane;  
            },
            getPreviousPaneNode:function() {
                return this.statics.tPaneNode;  
            },
            statics: {tPane:'',tPaneNode:''}
        });
        
        var mkToggleRoot = new dojo.NodeList(dojo.byId(sToggleRoot));
        var mkToggle = mkToggleRoot.children();
        
        mkToggle.forEach(function(e) {
            var t = new mk.Toggler(e);
        });
        
    };

    var campaignUser = {};

	  // Return Function Objects
    return {
        isArrayTest: isArrayTest,
		version: version,
		varObj:varObj,
		getE14Feed: getE14Feed,
		getTwtrFeed: getTwtrFeed,
		twitterCallback: twitterCallback,
		yt_player: yt_player,
		tabInit: tabInit,
		showHide: showHide,
		tooltipWithOverlay: tooltipWithOverlay,
		toggleVideoContent: toggleVideoContent,
		toggleVideoPlaylist: toggleVideoPlaylist,
		toggleOverlay: toggleOverlay,
		toggleLightbox: toggleLightbox,
		toggleShowHide: toggleShowHide,
		toggleExtendedContent: toggleExtendedContent,
		toggleQuestion: toggleQuestion,
		faqQuestion: faqQuestion,
		toggleAllQuestions: toggleAllQuestions,
		toggleCountryDropdown: toggleCountryDropdown,
		showHideNav: showHideNav,
		headerNavDropdownFix: headerNavDropdownFix,
		activeMenubarFix: activeMenubarFix,
		espotBannerFix: espotBannerFix,
		moveOverlays: moveOverlays,
		carousel: carousel,
		espotCarousel: espotCarousel,
		headerCarousel: headerCarousel,
		npiCarousel: npiCarousel,
		stickyNav: stickyNav,
		formCheck: formCheck,
		setFormElementFromURL:setFormElementFromURL,
		addFormTableRow:addFormTableRow,
		delFormTableRow:delFormTableRow,
		specialOfferManSelect:specialOfferManSelect,
        selectAnchor:selectAnchor,
		addtoCartGUI:addtoCartGUI,
		commissionJunction:commissionJunction,
		siteCookies:siteCookies,
		raspberryPopup:raspberryPopup,
		chgDom:chgDom,
		cookieCompliance:cookieCompliance,
		makeCombo:makeCombo,
		weeklyDeal:weeklyDeal,
		togglePanes:togglePanes,
        campaignUser: campaignUser
    }
	})(dojo);
}