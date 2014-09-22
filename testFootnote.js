var FOOTNOTE = /\{[\w\s]+\}/g;
var result = [];
var footnotes = [];
var FOOTNOTE_TYPE = "footnote";
var TEXT_TYPE = "text";
var EMPTY_STRING = "";
var FOOTNOTE_COUNT = 0;
var paragraph = "This is a sample text that needs a footnote {This is a footnote}";

var getFootnote = function() {
    var match = FOOTNOTE.exec(paragraph);
    while(match) {
	var content = match[0].split("{")[1].split("}")[0];
	var parts = paragraph.split(match[0]);
	if(parts[0] !== EMPTY_STRING) {
	    result.push({"content":parts[0], "type":TEXT_TYPE});
	}
	FOOTNOTE_COUNT = FOOTNOTE_COUNT + 1;
	result.push({"content":FOOTNOTE_COUNT,"type":FOOTNOTE_TYPE});
	footnotes.push({"content":content,"index":FOOTNOTE_COUNT});
	paragraph = parts[1];
	match = FOOTNOTE.exec(paragraph);
    }
}

getFootnote();
console.log(result);
console.log(footnotes);
