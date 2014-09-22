var EMPHASIS = /\*[\w\s]+\*/g;
var FOOTNOTE = /{[\w\s]+}/g;

var getNormalParagraph = function(paragraph) {
    var result = [];
    var getEmphasis = function() {
	var match = EMPHASIS.exec(paragraph)
	while(match) {
	    var content = match[0].split("*")[1];
	    var parts = paragraph.split(match[0]);
	    result.push({"content":parts[0],"type":"text"});
	    result.push({"content":content, "type":"emphasis"});
	    paragraph = parts[1];
	    match = EMPHASIS.exec(paragraph);
	}
    }

    var getFootnote = function() {
	var match = FOOTNOTE.exec(paragraph);
	while(match) {
	    var content = match[0].split("{")[1].split("}")[0];
	    var parts = paragraph.split(match[0]);
	    result.push({"content":parts[0],"type":"text"});
	    result.push({"content":content,"type":"quote"});
	    paragraph = parts[1];
	    match = FOOTNOTE.exec(paragraph);
	}
    }
    getEmphasis();
    getFootnote();
    if(paragraph !== "") {
	result.push({"content":paragraph,"type":"text"});
    }
    return {"content":result,type:"p"};
}

var string = "This tool can be used in a very *small* team to write up documents {to quickly} build a html for web usage."
console.log(getNormalParagraph(string));
