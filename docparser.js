var fs = require("fs");
var http = require("http");

var HEADER = /%+/;
var PARAGRAPH = /\r\n\r\n/; 	
var EMPHASIS = /\*[\w\s]+\*/g;
var FOOTNOTE = /{[\w\s]+}/g;

var getParagraphs = function(string) {
	var paragraphs = string.split(PARAGRAPH);
	return paragraphs;
}

var getHeader = function(paragraph) {
	var match = HEADER.exec(paragraph)
	var count = match[0].split("").length;
	var content = paragraph.replace(HEADER,"");
	return {"content":content, "type":"h"+count};
}	

var getNormalParagraph = function(paragraph) {
	var result = [];
var getEmphasis = function() {
	var match = EMPHASIS.exec(paragraph)
	while(match) {
		var content = match[0].split("*")[1];
		result.push({"content":content, "type":"b"});
		paragraph = paragraph.replace(match[0],"");
		match = EMPHASIS.exec(paragraph);
	}
}

var getFootnote = function() {
	var match = FOOTNOTE.exec(paragraph);
	while(match) {
		var content = match[0].split("{")[1].split("}")[0];
		result.push({"content":content,"type":"quote"});
		paragraph = paragraph.replace(match[0],"");
		match = FOOTNOTE.exec(paragraph);
	}
}
	getEmphasis();
	getFootnote();
	if(paragraph !== "") {
		result.push({"content":paragraph,"type":"p"});
	}
	return result;
}
var processParagraph = function(paragraph) {
	if(HEADER.test(paragraph)) {
		return getHeader(paragraph)
	}
	else {
		return getNormalParagraph(paragraph);
	}
}

var getFileContents = function(filename, callback) {
	var reader = fs.readFile(filename,callback);
}

getFileContents("sample_text_markdown.txt",function(err,data){
	string = data.toString();
	paragraphs = getParagraphs(string);
	result = paragraphs.map(processParagraph);
	console.log(result);
});
	
