pfPackagingOptionsJS={
		/** language ID to be used, default to -1 (English) */
		langId: "-1",
		
		/** store ID to be used */
		storeId: "",
		
		/** catalog ID to be used */
		catalogId: "",
		hideOLTimeout: {},
		setCommonParameters:function(langId,storeId,catalogId,orderId)
		{
				this.langId = langId;
				this.storeId = storeId;
				this.catalogId = catalogId;
			
		},
		init: function(){
			pfPackagingOptionsJS.addEvents();
		},
		
		addEvents: function(){
			var e = {
				'.priceTooltip' : {
					onmouseover : function(evt) {
						evt.preventDefault();
						//console.log("priceTooltip over: ",evt.target);
						var partno = dojo.attr(evt.target,"data-partno");
						if(partno){
							//console.log("priceTooltip display: ",evt.target);
							pfPackagingOptionsJS.showRepoisitionedOverlay(evt, partno);
						}
					},
					onmouseout : function(evt) {
						evt.preventDefault();
						//console.log("priceTooltip out: ",evt.target);
						var partno = dojo.attr(evt.target,"data-partno");
						if(partno){
							//console.log("priceTooltip close: ",evt.target);
							pfPackagingOptionsJS.hideCheckStockOverlay(evt, partno);
						}
					}
				},
				'.pdpPackOptRadioBtnWrap input[type="radio"]' : {
					onclick : function(evt) {
						var selected = dojo.query('.pdpPackOptRadioBtnWrap input[type="radio"]:checked');
						//console.log("radio...",selected);
						//toggle package price
						if(selected.length){
							dojo.forEach(dojo.query("div.pdpPackOptCalWrap"),function(ent,i){
								//console.log("ent.id: ",ent.id);
								if(ent.id == 'calc_'+selected[0].value){
									//show area
									dojo.removeClass(ent,"displayNone");
								} else {
									dojo.addClass(ent,"displayNone");
								}
							});
						}
						
					}
				}
				
			}
			dojo.behavior.add(e);
			dojo.behavior.apply();
		},
		
		saveSelectedOption :function(optionValue)
		{
			if(document.getElementById("selectedOption") != null)
			document.getElementById("selectedOption").value=optionValue;
		},

		showPackageOptionsPDP:function(element) {
		    document.getElementById(element).style.display = "block";
		    document.getElementById("hideOptions").style.display = "block";
		    document.getElementById("showOptions").style.display = "none";
	    	
		},
		hidePriceOverlay: function(){
			if (window.parent.dijit.byId('priceBreaksSearch') != null)
				window.parent.dijit.byId('priceBreaksSearch').hide();

			if (window.parent.dijit.byId('priceBreaks') != null)
				window.parent.dijit.byId('priceBreaks').hide();
		},
		
	    hidePriceBreakOverlay: function(){
			if (window.parent.dijit.byId('priceBreaks') != null)
		        {
				window.parent.dijit.byId('priceBreaks').hide();
				parent.window.location = "https://"+window.location.hostname+"/help-pricing-availability";
		     }		
		},
	
		displayCheckStockOverlay: function(a,productId) {
			console.log("displayCheckStockOverlay: ",productId);
			
			var overlay = document.getElementById("pricingStockOverlayDiv_"+productId);
			console.log("overlay: ",overlay);
			if(pfPackagingOptionsJS.hideOLTimeout[productId]){
				clearTimeout(pfPackagingOptionsJS.hideOLTimeout[productId]);
			}
			
			if(document.getElementsByName("pricingStockOverlayDiv") !=null){
				var altProdLink = document.getElementsByName("pricingStockOverlayDiv");
				for (var j=0; j<altProdLink.length; j++)
				{
					altProdLink[j].style.display = "none";
				}
			}
			else if(document.getElementsByName("pricingStockOverlayDivPDP") !=null){
				var altProdLink = document.getElementsByName("pricingStockOverlayDivPDP");
				for (var j=0; j<altProdLink.length; j++)
				{
					altProdLink[j].style.display = "none";
				}
			}
				

			if(productId != null && document.getElementById("pricingStockOverlayDiv_"+productId) !=null)
				document.getElementById("pricingStockOverlayDiv_"+productId).style.display = "block";
		},
		hideCheckStockOverlay: function(a,productId) {
			if(!productId){
				return;//no prod id
			}
			//console.log("hideCheckStockOverlay fire");
			pfPackagingOptionsJS.hideOLTimeout[productId] = setTimeout(function(){
				document.getElementById("pricingStockOverlayDiv_"+productId).style.display = "none";
			},500);			
		},
		stopHideOL: function(productId){
			//console.log("stopHideOL");
			clearTimeout(pfPackagingOptionsJS.hideOLTimeout[productId]);
		},
		showRepoisitionedOverlay: function(a,productId){
			if(!productId){
				return;//no prod id
			}
			var ovEle = dojo.byId("pricingStockOverlayDiv_"+productId),
			thisLink = a.target,
			thisLinkCoords = dojo.coords(thisLink),
			ovEleCoords = dojo.coords(ovEle);			
			var newT = thisLinkCoords.y+18;
			var newL = thisLinkCoords.x;
			ovEle.style.position = 'fixed';
			ovEle.style.top = newT+'px';
			ovEle.style.left = newL+'px';
			pfPackagingOptionsJS.displayCheckStockOverlay(a,productId);			
			
		},
		showPackageOptionsDiv:function(element) {
		    document.getElementById(element).style.display = "block";
		    document.getElementById("hideOptions").style.display = "block";
		    document.getElementById("showOptions").style.display = "none";
		    if(document.getElementById("showReelMessage") !=null)
		    	document.getElementById("showReelMessage").style.display = "block";
		    
		    if(document.getElementById("divOpened") != null)
		    	document.getElementById("divOpened").value="true";
			
		},
		hidePackageOptionsDiv:function(element) {
			document.getElementById(element).style.display = "none"; 
			document.getElementById("showOptions").style.display = "block";
			document.getElementById("hideOptions").style.display = "none";
			if(document.getElementById("showReelMessage") !=null)
				document.getElementById("showReelMessage").style.display = "block";
		},
		getPricingDetails:function(fullQty,partialQty,fullPartNum,partialASPartNum,fName,sName,packageName,backOrderMsg)
		{
			var dataVars = {};
			dataVars.fullQty = fullQty;
			dataVars.partialQty = partialQty;
			dataVars.fullPartNumber = fullPartNum;
			dataVars.partialASPartNum = partialASPartNum;
			dataVars.fullName = fName;
			dataVars.partialASName = sName;
			dataVars.packageName = packageName;
			var uId = pf.connections.getUniqueId();
			
			if(backOrderMsg !=null && backOrderMsg != ""){
				document.getElementById("backOrderMessage").innerHTML = backOrderMsg;
				document.getElementById("backOrderMessage").style.display = "block";
			}
			var xhrArgs = {
				url : 'ShowPackagePrices?storeId=' + this.storeId
				+ '&catalogId=' + this.catalogId + '&langId=' + this.langId,
				content : dataVars,
				handleAs : "text",
				preventCache : true,
				load : function(data) {
					pf.connections.finalise(uId);
					
					// Remove previously added packaging options area
					
					if(data != ""){
						// Insert the ajax response
						
						document.getElementById("packagePriceDetailsId").innerHTML = data.trim();
											
						// Re-apply behaviours
						dojo.behavior.apply();
					}
									
				},
				error : function(error) {
					pf.connections.finalise(uId);
					console
							.log('Error ')
				}
			}
			//to prevent the call from getting fired for every key pressed, a delay is added for the Ajax call
			clearTimeout(pf.pdp.ajaxCall);
						
			pf.connections.init(xhrArgs,'post','queue','packageoptions',uId);
			
		}
}
pfPackagingOptionsJS.init();