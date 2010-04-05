//
// talker-markup
//
//     `var x = 1;`
//     *bold*
//
plugin.onMessageReceived = function (event) { var str;
  if (Talker.isPaste(event)) { return true }
  if (event.content.indexOf('`') !== -1 && event.content.indexOf('\n') === -1) {
     str = event.content.replace(/`(.*?)`/g, function (all, code) {
        return '<span style="padding: 1px; background-color: #fff; font-family: monaco, monospace">' + code + '</span>';
     });     
  }
  if (event.content.indexOf('*') !== -1) {
     str = (str || event.content).replace(/\*(.*?)\*/g, function (all, code) {
        return '<strong>' + code + '</strong>';
     });
  }
  if (str) {
     Talker.insertMessage(event, str);
     return false;
  }
};

