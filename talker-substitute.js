//
// A Talker plugin to do live substitutions of previous message
//
//    string example: s/wordl/world
//    regexp example: r/^w/W
//
plugin.onMessageSend = function (event) {
    var match;
    if (match = event.content.match(/^([sr])\/(.+?)\/([^\/]*)(?:\/([gi])?)?$/)) {
        event.substitute = {
            type: match[1],
            match: match[2],
            replace: match[3],
            options: match[4] || ''
        };
        Talker.sendMessage(event, "");
        Talker.getMessageBox().val('');
        return false;
    }
};
plugin.onMessageReceived = function (event) {
  var match, row, messages, search;  
  if (event.substitute) {
    row = $("#log tr[author='" + event.user.name + "'].message:last");

    messages = row.find('.line');

    if (event.substitute.type == 'r') {
        search = new(RegExp)(event.substitute.match, event.substitute.options);
    } else { search = event.substitute.match }
    
    for (var i = 0; i < messages.length; i++) {
      messages[i].innerHTML = messages[i].innerHTML
        .replace(search, "<span style='text-decoration: line-through'>" +
                         event.substitute.match + "</span> " +
                         event.substitute.replace);
    }
    return false;
  }
};

