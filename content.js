var greenLightUrl = chrome.extension.getURL('greenlight.jpg');
$('body').prepend("<div style=\"position: fixed; bottom:0;\">Autocopy: <img height=25 src=\"" + greenLightUrl + "\" /></div>");
$('body').mouseup(function(d){
	document.execCommand('copy');
});