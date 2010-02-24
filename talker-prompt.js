//
// JS Prompt - a Talker plugin <http://talkerapp.com>
//
//     to activate/deactivate the js prompt:    /prompt
//     to share variables amongst users:        this.foo = 1;
//
plugin.usage = '/prompt';
plugin.command = 'prompt';
plugin.evalMode = false;
 
plugin.onCommand = function (event) {
    var action;
    if (event.command == "prompt") {
        plugin.evalMode = !plugin.evalMode;
        Talker.getMessageBox().val('');
        event.user = Talker.getCurrentUser();
        action = plugin.evalMode ? "activated" : "deactivated";
        Talker.insertNotice(event, event.user.name + " " + action + " prompt mode");
        return false;
    }
};

plugin.onMessageReceived = function (event) {
    var msg, js, result, match;
    if (event.jsprompt) {
         plugin.context = $.extend({}, plugin.context || {}, event.jsprompt.context);
         for (var k in plugin.context) {
             if (typeof(plugin.context[k]) === 'string' &&
                 /^function\s*\(.*?\)\s*\{.*?\};?$/.test(plugin.context[k])) {
                 plugin[k] = eval('(' + plugin[k] + ')');
             }
         }
         msg = "<span style='background-color: #fff; padding: 0 2px; font-family: monaco, monospace'>" + event.jsprompt.js + "</span>" +
               "<span style='float: right; color: grey; font-family: monaco, monospace'>" + event.jsprompt.result + "</span>";
         Talker.insertMessage(event, msg);
         return false;
    }
};

plugin.onMessageSend = function (event) {
    var str = event.content, result;
    var context = plugin.context || {};
    if (plugin.evalMode && str.length > 0) {
        if (str === '/prompt') { return true }
        try {
            result = eval('(function () { return (' + str + '); })').apply(context, []);
            result = Orbited.JSON.stringify(result, function (k, v) {
                if (typeof v === 'function') { return v.toString() }
                else { return v }
            });
        } catch (e) {
            alert("JS evaluation error");
            return false;
        }
        event.user = Talker.getCurrentUser();
        event.jsprompt = { js: str, result: result, context: context };
        Talker.sendMessage(event, "");
        Talker.getMessageBox().val('');
        return false;
    }
};

