var fs = require("fs");
var http = require("http");

var HEADER = /%+/;
var PARAGRAPH_UNIX = /\r\n\r\n/;
var PARAGRAPH_DOS = /\n\n/;
var EMPHASIS = /\*[\w\s]+\*/g;
var FOOTNOTE = /{[\w\s]+}/g;
var LINK = /\[[\w\s\.\/,:-]+\]/g;
var FILENAME = "sample_text_markdown.txt";
var HEADER_TYPE = "h";
var PARAGRAPH_TYPE = "p";
var EMPHASIS_TYPE = "emphasis";
var FOOTNOTE_TYPE = "footnote";
var TEXT_TYPE = "text";
var LINK_TYPE = "link";
var EMPTY_STRING = "";


var getParagraphs = function(string) {
    var paragraphs = string.split(PARAGRAPH_DOS);
    return paragraphs;
}

var getHeader = function(paragraph) {
    var match = HEADER.exec(paragraph)
    var count = match[0].split(EMPTY_STRING).length;
    var content = paragraph.replace(HEADER,EMPTY_STRING);
    return {"content":content, "type":HEADER_TYPE+count};
}	

var getNormalParagraph = function(paragraph) {
    var result = [];
    
    var getEmphasis = function() {
	var match = EMPHASIS.exec(paragraph)
	while(match) {
	    var content = match[0].split("*")[1];
	    var parts = paragraph.split(match[0]);
	    if(parts[0] !== EMPTY_STRING) {
		result.push({"content":parts[0], "type":TEXT_TYPE});
	    }
	    result.push({"content":content, "type":EMPHASIS_TYPE});
	    paragraph = parts[1];
	    match = EMPHASIS.exec(paragraph);
	}
    }

    var getFootnote = function() {
	var match = FOOTNOTE.exec(paragraph);
	while(match) {
	    var content = match[0].split("{")[1].split("}")[0];
	    var parts = paragraph.split(match[0]);
	    if(parts[0] !== EMPTY_STRING) {
		result.push({"content":parts[0], "type":TEXT_TYPE});
	    }
	    result.push({"content":content,"type":FOOTNOTE_TYPE});
	    paragraph = parts[1];
	    match = FOOTNOTE.exec(paragraph);
	}
    }

    var getLink = function () {
	var match = LINK.exec(paragraph);
	while(match) {
	    var content = match[0].split("[")[1].split("]")[0];
	    var parts = paragraph.split(match[0]);
	    var link = content.split(",");
	    if(parts[0] !== EMPTY_STRING) {
		result.push({"content":parts[0], "type":TEXT_TYPE});
	    }
	    result.push({"content":link[0], "type":LINK_TYPE,"attribute":link[1]});
	    paragraph = parts[1];
	    match = LINK.exec(paragraph);
	}
    }
    
    getEmphasis();
    getFootnote();
    getLink();
    if(paragraph !== EMPTY_STRING) {
	result.push({"content":paragraph,"type":TEXT_TYPE});
    }
    return {"content":result,type:PARAGRAPH_TYPE};
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

