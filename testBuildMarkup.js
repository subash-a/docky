var sampleData = [
    {"content":"Hello","type":"h3"},
    [
	{"content":"This is a para","type":"text"},
	{"content":"This is also a para","type":"text"},
	{"content":"This is a footnote","type":"footnote"},
	{"content":"This is an emphasised text","type":"emphasis"},
	{"content":"Link","attribute":"http://www.google.com","type":"link"}
    ]
];

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
	    case "text": parseText(fragment);
		break;
	    case "emphasis": parseEmphasis(fragment);
		break;
	    case "footnote": parseFootnote(fragment);
		break;
	    case "link": parseLink(fragment);
		break;
	    default: parseText(fragment);
		break;
	    };
	};
	var content = "";
	paragraph.map(parseFragment);
	console.log(buildTag("p",content,{},false));
    };

    var parseHeader = function (paragraph) {
	console.log(buildTag(paragraph.type, paragraph.content));
    };
    
    var showData = function (paragraph) {
	if(paragraph.length) {
	    parseParagraph(paragraph);
	}
	else {
	    parseHeader(paragraph);
	}
    };
    data.map(showData);
}

buildMarkup(sampleData);
