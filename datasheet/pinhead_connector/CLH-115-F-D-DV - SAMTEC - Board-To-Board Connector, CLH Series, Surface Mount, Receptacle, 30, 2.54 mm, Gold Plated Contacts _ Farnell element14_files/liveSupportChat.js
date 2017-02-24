// LivePerson

lcHostname = document.location.hostname;
if (lcHostname === "www.newark.com" || lcHostname === "canada.newark.com" || lcHostname === "mexico.newark.com" || lcHostname === "no.farnell.com" || lcHostname === "uk.farnell.com" || lcHostname === "dk.farnell.com" || lcHostname === "fi.farnell.com" || lcHostname === "se.farnell.com" || lcHostname === "at.farnell.com" || lcHostname === "ch.farnell.com" || lcHostname === "de.farnell.com" || lcHostname === "es.farnell.com" || lcHostname === "it.farnell.com" || lcHostname === "pt.farnell.com" || lcHostname === "bg.farnell.com" || lcHostname === "cz.farnell.com" || lcHostname === "ee.farnell.com" || lcHostname === "hu.farnell.com" || lcHostname === "lt.farnell.com" || lcHostname === "lv.farnell.com" || lcHostname === "nl.farnell.com" || lcHostname === "pl.farnell.com" || lcHostname === "ro.farnell.com" || lcHostname === "ru.farnell.com" || lcHostname === "si.farnell.com" || lcHostname === "sk.farnell.com" || lcHostname === "be.farnell.com" || lcHostname === "ie.farnell.com" || lcHostname === "nl.farnell.com" || lcHostname === "onecall.farnell.com" || lcHostname === "export.farnell.com" || lcHostname === "fr.farnell.com" || lcHostname === "il.farnell.com" || lcHostname === "tr.farnell.com" || lcHostname === "cpc.farnell.com" || lcHostname === "cpcie.farnell.com"  || lcHostname === "au.element14.com" || lcHostname === "cn.element14.com" || lcHostname === "hk.element14.com" || lcHostname === "in.element14.com" || lcHostname === "my.element14.com" || lcHostname === "nz.element14.com" || lcHostname === "ph.element14.com" || lcHostname === "sg.element14.com" || lcHostname === "kr.element14.com" || lcHostname === "th.element14.com" || lcHostname === "tw.element14.com") {
	var lpNum = '11634543';
} else {
	var lpNum = '84663598';
}

var lpMTagConfig = {
'lpServer' : 'server.iad.liveperson.net',
'lpNumber' : lpNum,
'lpProtocol' : (document.location.toString().indexOf('https:')==0) ? 'https' : 'http',
'lpTagLoaded' : false,
'pageStartTime' : (new Date()).getTime(), //pageStartTime is set with a timestamp as soon as the page starts loading
'defaultUnit' : 'sales'
};

lpMTagConfig.deploymentConfigPath = lpMTagConfig.lpServer+'/visitor/addons/deploy.asp';

lpMTagConfig.lpLoadScripts = function(){
lpAddMonitorTag(lpMTagConfig.lpProtocol + '://' + lpMTagConfig.deploymentConfigPath + '?site=' + lpMTagConfig.lpNumber + '&d_id=' + lpMTagConfig.deploymentID);
}

function lpAddMonitorTag(src) {
if (!lpMTagConfig.lpTagLoaded) {if (typeof(src) == 'undefined' || typeof(src) == 'object') {if (lpMTagConfig.lpMTagSrc) {src = lpMTagConfig.lpMTagSrc;}else {if (lpMTagConfig.lpTagSrv) {src = lpMTagConfig.lpProtocol + '://' +lpMTagConfig.lpTagSrv + '/hcp/html/mTag.js';}else {src = '/hcp/html/mTag.js';};};};if (src.indexOf('http') != 0) {src = lpMTagConfig.lpProtocol + '://' + lpMTagConfig.lpServer + src + '?site=' + lpMTagConfig.lpNumber;} else {if (src.indexOf('site=') < 0) {if (src.indexOf('?') < 0) {src = src + '?';} else{src = src + '&';} src = src + 'site=' + lpMTagConfig.lpNumber;  };};var s = document.createElement('script');s.setAttribute('type', 'text/javascript');s.setAttribute('charset', 'iso-8859-1');s.setAttribute('src', src);document.getElementsByTagName('head').item(0).appendChild(s);}
}

//The code below send a PAGEVAR to LP with the time [in seconds] it took the page to load. Code is executed in the onload event
lpMTagConfig.calculateSentPageTime = function () {
var t = (new Date()).getTime() - lpMTagConfig.pageStartTime;
lpAddVars('page','pageLoadTime', Math.round(t/1000)+' sec');
};

//Variables Arrays - By Scope
if (typeof(lpMTagConfig.pageVar)=='undefined') { lpMTagConfig.pageVar = []; }
if (typeof(lpMTagConfig.sessionVar)=='undefined') { lpMTagConfig.sessionVar = []; }
if (typeof(lpMTagConfig.visitorVar)=='undefined') { lpMTagConfig.visitorVar = []; }
//Extra actions to be taken once the code executes
if (typeof(lpMTagConfig.onLoadCode)=='undefined') { lpMTagConfig.onLoadCode = []; }
//Dynamic Buttons Array
if(typeof(lpMTagConfig.dynButton)=='undefined') { lpMTagConfig.dynButton = []; }
// This need to be add to afterStartPage will work
if(typeof(lpMTagConfig.ifVisitorCode)=='undefined') {lpMTagConfig.ifVisitorCode = []; }


// Function that sends variables to LP - By Scope
function lpAddVars(scope,name,value) {
if (name.indexOf('OrderTotal')!=-1 || name.indexOf('OrderNumber')!=-1){
if  (value=='' || value==0) return; // pass 0 value to all but OrderTotal
else lpMTagConfig.sendCookies = false;
}
value=lpTrimSpaces(value.toString());
//Remove cut long variables names and values. Trims suffix of the variable name above the 25th character onwards
if (name.length>50) {
name=name.substr(0,50);
}
if (value.length>50) { // Trims suffix of the variable value above the 50th character onwards
value=value.substr(0,50);
}
switch (scope){
case 'page': lpMTagConfig.pageVar[lpMTagConfig.pageVar.length] = escape(name)+'='+escape(value); break;
case 'session': lpMTagConfig.sessionVar[lpMTagConfig.sessionVar.length] = escape(name)+'='+escape(value); break;
case 'visitor': lpMTagConfig.visitorVar[lpMTagConfig.visitorVar.length] = escape(name)+'='+escape(value); break;
}
}

// Preventing long cookie transfer for IE based browsers.
function onloadEMT() {
var LPcookieLengthTest=document.cookie;
if (lpMTag.lpBrowser == 'IE' && LPcookieLengthTest.length>1000){
lpMTagConfig.sendCookies=false;
}
}

//The Trim function returns a text value with the leading and trailing spaces removed
function lpTrimSpaces(stringToTrim) {
return stringToTrim.replace(/^\s+|\s+$/g,'');
}

// Immediate Data submission function
function lpSendData(varscope,varname,varvalue) {
if(typeof(lpMTag)!='undefined' && typeof(lpMTag.lpSendData)!='undefined')
lpMTag.lpSendData(varscope.toUpperCase() +'VAR!'+ varname + '=' + varvalue, true);
}

// The unit variable purpose is to route the chat or call to the designated skill. <LOB> should be replaced with the skill name, i.e. : sales
try{
	if (typeof(lpUnit)=='undefined') { var lpUnit='en_US'; }
	if(typeof(lpAddVars)!='undefined') { 
		lpAddVars('page','unit',lpUnit); 
	}
	lpMTagConfig.defaultInvite ='chat'+'-' + lpUnit;
}catch(e){}

lpMTagConfig.onLoadCode[lpMTagConfig.onLoadCode.length] = onloadEMT;

//Scan dynButton and removes buttons which doesnt have Div on the page
lpMTagConfig.onLoadCode[lpMTagConfig.onLoadCode.length] = function () {
if(typeof(lpMTagConfig.dynButton)!='undefined') {
for (i=0;i<lpMTagConfig.dynButton.length;i++){
if (typeof(lpMTagConfig.dynButton[i].pid)!='undefined' && document.getElementById(lpMTagConfig.dynButton[i].pid) == null) {
lpMTagConfig.dynButton.splice(i,1);
i--;
}
}
}
};

//The folowing functions will be load after the page will finish loading
lpMTagConfig.onLoadAll = function () {
lpMTagConfig.calculateSentPageTime();
lpMTagConfig.lpLoadScripts();
};

if (window.attachEvent) {
window.attachEvent('onload',lpMTagConfig.onLoadAll);
} else {
window.addEventListener('load',lpMTagConfig.onLoadAll,false);
}

