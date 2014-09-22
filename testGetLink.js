var result = [];
var paragraph = "[linkname,http://www.thisisalink.com][link,http://www.google.com]";
var LINK = /\[[\w\s:\/\.,]+\]/;
var LINK_TYPE = "link";
var TEXT_TYPE = "text";

var getLink = function () {
    var match = LINK.exec(paragraph);
    while(match) {
	var content = match[0].split("[")[1].split("]")[0];
	var parts = paragraph.split(match[0]);
	var link = content.split(",");
	result.push({"content":parts[0], "type":TEXT_TYPE});
	result.push({"content":link[0], "type":LINK_TYPE,"attribute":link[1]});
	paragraph = parts[1];
	match = LINK.exec(paragraph);
    }
}
getLink();
console.log(result);
