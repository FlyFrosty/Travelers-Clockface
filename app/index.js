'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var document = _interopDefault(require('document'));
var messaging = require('messaging');
var clock = _interopDefault(require('clock'));
var userActivity = require('user-activity');

function stripQuotes(str) {
    return str ? str.replace(/"/g, "") : "";
}
function myPicString(str) {
    return str.substring(35, str.length - 14);
}
function zeroPad(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

var myLabel = document.getElementById("myLabel");
var myUTCLabel = document.getElementById("myUTCLabel");
var myCal = document.getElementById("myCal");
var mySteps = document.getElementById("mySteps");
var myImage = document.getElementById("myImage");
console.log("App Started");
myImage.href = "Hawaii.png";
messaging.peerSocket.onmessage = function (evt) {
    console.log("App received: " + JSON.stringify(evt));
    if (evt.data.key === "color" && evt.data.newValue) {
        var color = stripQuotes(evt.data.newValue);
        console.log("Setting background color: " + color);
        myLabel.style.fill = color;
        myUTCLabel.style.fill = color;
        myCal.style.fill = color;
        mySteps.style.fill = color;
    }
    else if (evt.data.key === "myPic" && evt.data.newValue) {
        var pic = myPicString(evt.data.newValue);
        myImage.href = pic;
        console.log("image selected: " + pic);
    }
};
messaging.peerSocket.onopen = function () {
    console.log("App Socket Open");
};
messaging.peerSocket.close = function () {
    console.log("App Socket Closed");
};
clock.granularity = "minutes";
function formatDate(date) {
    var monthNames = [
        "Jan", "Feb", "Mar",
        "April", "May", "June", "July",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
    ];
    var dayNames = [
        "Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"
    ];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var todayIndex = date.getDay();
    return dayNames[todayIndex] + ', ' + day + ' ' + monthNames[monthIndex];
}
function mainClock() {
    var today$$1 = new Date();
    var hours = zeroPad(today$$1.getHours());
    var mins = zeroPad(today$$1.getMinutes());
    myLabel.text = hours + ":" + mins;
}
function UTCClock() {
    var today$$1 = new Date();
    var mins = zeroPad(today$$1.getMinutes());
    var UTChours = zeroPad(today$$1.getUTCHours());
    myUTCLabel.text = UTChours + ":" + mins + "Z";
}
function myFormCal() {
    myCal.text = "" + formatDate(new Date());
}
function updateSteps() {
    var stepCt = userActivity.today.adjusted.steps;
    mySteps.text = (stepCt);
}
function updateAll() {
    var today$$1 = new Date();
    mainClock();
    UTCClock();
    myFormCal();
    updateSteps();
}
clock.ontick = function () { return updateAll(); };
mainClock();
UTCClock();
myUTCLabel.style.display = "none";
updateSteps();
mySteps.style.display = "none";
myFormCal();
myCal.onclick = function (e) {
    myCal.style.display = "none";
    myUTCLabel.style.display = "inline";
};
myUTCLabel.onclick = function (e) {
    myUTCLabel.style.display = "none";
    updateSteps();
    mySteps.style.display = "inline";
};
mySteps.onclick = function (e) {
    mySteps.style.display = "none";
    myCal.style.display = "inline";
};
