function getBack() {
  $("#infos-pts").hide();
  $("#info-main").show();
}

function fixUnclosedOlTag(string, type) {
  // Count occurrences of <ol> and </ol> tags
  var openTagRegex = new RegExp("<" + type + ">", "g");
  var closeTagRegex = new RegExp("<\/" + type + ">", "g");

  // Count occurrences of opening and closing tags
  var openTagsCount = (string.match(openTagRegex) || []).length;
  var closeTagsCount = (string.match(closeTagRegex) || []).length;
  
  // If there are more opening tags than closing tags, add a closing tag
  if (openTagsCount > closeTagsCount) {
    string += "</" + type + ">";
  }

  
  return string;
}

function convOl(string) {
  string = string.replaceAll(": \d{1}\.", "<ol><li>");
  string = string.replaceAll("\d{1}\.", "</li><li>");

  // fix unclosed tag
  string = fixUnclosedOlTag(string, "ol");

  return string;
}

function convUl(string) {
  // Must use a RegExp class to match start of line
  var startRegex = new RegExp("^-", "gm");
  string = string.replaceAll(startRegex, "<ul><li>");
  string = string.replaceAll(": -", " : <ul><li>");
  string = string.replaceAll(" - ", "</li><li>");

  // fix unclosed tag
  string = fixUnclosedOlTag(string, "ul");

  return string;
}

function toList(string) {
  string = convOl(string);
  string = convUl(string);

  return string;
}
