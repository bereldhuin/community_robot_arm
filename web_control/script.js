/*
WebSerial example
Reads from a webSerial serial port, and writes to it.
Works on Chrome and Edge and Opera browsers. 

created 28 Jan 2022
modified 15 May 2022
by Tom Igoe
*/


// the DOM elements that might be changed by various functions:
let btnConnect;   // the open/close port button
let logs; // DOM element where the incoming readings go
let timeSpan;     // DOM element for one special reading
let webserial;

function sleep(sleepDuration) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) { /* Do nothing */ }
}

function setup() {
    // get the DOM elements and assign any listeners needed:
    // user text input:
    const btnsGcode = document.querySelectorAll(".btn-gcode");
    logs = document.getElementById("logs");

    btnsGcode.forEach(btnGcode => {
        btnGcode.addEventListener('click', sendGcode);
    });

    const btnSequence = document.querySelector("#btnSequence");
    btnSequence.addEventListener('click', sendSequence);


    document.querySelector("#sequence").value = localStorage.getItem("sequence");

    webserial = new WebSerialPort();
    if (webserial) {
        webserial.on("data", serialRead);
        // port open/close button:
        btnConnect = document.getElementById("btnConnect");
        btnConnect.addEventListener("click", openClosePort);
    }
}

async function openClosePort() {
    // label for the button will change depending on what you do:
    let buttonLabel = "Open port";
    // if port is open, close it; if closed, open it:
    if (webserial.port) {
        await webserial.closePort();
    } else {
        await webserial.openPort();
        buttonLabel = "Close port";
    }
    // change button label:
    btnConnect.innerHTML = buttonLabel;
}


function addToLog(text) {
    logs.innerHTML += text;
}

async function serialRead(event) {
    addToLog(">>>" + event.detail.data);
}


/**
 * Sends a list of gcode separated by ;
 * @param {*} event Event retrieve from listener (button click)
 */
function sendGcode(event) {
    let gcodes = event.target.dataset.gcode.split(";");

    gcodes.forEach(function (gcode) {
        console.log(gcode);
        addToLog(gcode + "\r");
        webserial.sendSerial(gcode);
    });
}


/**
 * Execute a sequence
 * @param {*} event Event retrieve from listener (button click)
 */
function sendSequence() {
    let gcodes = document.querySelector("#sequence").value.split("\r");

    localStorage.setItem("sequence", document.querySelector("#sequence").value);

    gcodes.forEach(function (gcode) {
        console.log(gcode);
        addToLog(gcode + "\r");
        webserial.sendSerial(gcode);
        //sleep(5000);
        //serialRead();
    });


}

// run the setup function when all the page is loaded:
document.addEventListener("DOMContentLoaded", setup);