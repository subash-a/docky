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

/*
 * NOTE: The below section contains the code for building a html from ground
 * up and builds all the supported tags in the markdown. This code needs to
 * be changed when the support for additional components come into the module
 */
var buildMarkup = function (data) {
    var escapeHTML = function(text) {
	return text.replace(/&/g,"&amp;")
	.replace(/>/g,"&gt;")
	.replace(/</g,"&lt;");
    };
    var buildTag = function(tag, content, attributes, escapeContent) {
	var buildAttributes = function (attributes) {
	    return Object.keys(attributes).map(function(key) {
		return key+"='"+attributes[key]+"' "; 
	    }).join("");
	};
	var contentString = escapeContent ? escapeHTML(content) : content;
	var attributeString = attributes ? buildAttributes(attributes) : "";
	return "<"+tag+" "+attributeString+">"+contentString+"</"+tag+">";
    };
    var parseParagraph = function(paragraph) {
	var parseText = function (fragment) {
	    content = content + fragment.content;
	    return content;
	};
	var parseEmphasis = function(fragment) {
	    content = content + buildTag(fragment.type,fragment.content);
	    return content;
	};
	var parseFootnote = function (fragment) {
	    content = content + buildTag(fragment.type, fragment.content);
	    return content;
	};
	var parseLink = function (fragment) {
	    fragment.attribute = {"href":fragment.attribute};
	    content = content + buildTag(fragment.type,fragment.content,fragment.attribute);
	    return content;
	};
	var parseFragment = function(fragment) {
	    switch(fragment.type) {
	    case TEXT_TYPE: parseText(fragment);
		break;
	    case EMPHASIS_TYPE: parseEmphasis(fragment);
		break;
	    case FOOTNOTE_TYPE: parseFootnote(fragment);
		break;
	    case LINK_TYPE: parseLink(fragment);
		break;
	    default: parseText(fragment);
		break;
	    };
	};
	var content = "";
	paragraph.content.map(parseFragment);
	console.log(buildTag(paragraph.type,content,{},false));
    };

    var parseHeader = function (paragraph) {
	console.log(buildTag(paragraph.type, paragraph.content));
    };
    
    var showData = function (paragraph) {
	if(paragraph.type === PARAGRAPH_TYPE) {
	    parseParagraph(paragraph);
	}
	else {
	    parseHeader(paragraph);
	}
    };
    data.map(showData);
}

var getFileContents = function(filename, callback) {
    var reader = fs.readFile(filename,callback);
}


getFileContents("sample_text_markdown.txt",function(err,data){
    string = data.toString();
    paragraphs = getParagraphs(string);
    result = paragraphs.map(processParagraph);
    console.log(result);
    console.log(result[5].content);
    console.log("================ Parsed ==================");
    output = buildMarkup(result);

});

