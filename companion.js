'use strict';

var messaging = require('messaging');
var settings = require('settings');

console.log("Companion Started");
messaging.peerSocket.onopen = function () {
    console.log("Companion Socket Open");
    restoreSettings();
};
messaging.peerSocket.close = function () {
    console.log("Companion Socket Closed");
};
settings.settingsStorage.onchange = function (evt) {
    var data = {
        key: evt.key,
        newValue: evt.newValue
    };
    sendVal(data);
};
function restoreSettings() {
    for (var index = 0; index < settings.settingsStorage.length; index++) {
        var key = settings.settingsStorage.key(index);
        if (key) {
            var data = {
                key: key,
                newValue: settings.settingsStorage.getItem(key)
            };
            sendVal(data);
        }
    }
}
function sendVal(data) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send(data);
    }
}
