//
// A Talker plugin to do live substitutions of previous message
//
//    string example: s/wordl/world
//    regexp example: r/^w/W
//
plugin.onMessageReceived = function (event) {
  var match, row, messages, search;  
  if (match = event.content.match(/^([sr])\/(.+?)\/([^\/]*)(?:\/([gi])?)?$/)) {
    row = $("#log tr[author='" + event.user.name + "'].message:last");

    if (Talker.getMessageBox().val() === match[0]) { Talker.getMessageBox().val('') }
    messages = row.find('.line');

    if (match[1] == 'r') { search = new(RegExp)(match[2], match[3] || '') }
    else { search = match[2] }
    
    for (var i = 0; i < messages.length; i++) {
      messages[i].innerHTML = messages[i].innerHTML.replace(search, match[3]);
    }
    return false;
  }
};

