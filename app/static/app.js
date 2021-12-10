// This code is heavily based on the following blog post:
// https://blog.addpipe.com/using-recorder-js-to-capture-wav-audio-in-your-html5-web-site/

URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");

var potter = document.getElementById("potter");
var starwars = document.getElementById("starwars");
var error = document.getElementById("error");
var loader = document.getElementById("loader");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

function startRecording() {
    console.log("recordButton clicked");
    var constraints = { audio: true, video: false }
    recordButton.setAttribute("disabled", "");
    starwars.setAttribute("hidden", "");
    potter.setAttribute("hidden", "");
    error.setAttribute("hidden", "");
    stopButton.removeAttribute("disabled");
    loader.classList.remove("active");
    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device
        */
        audioContext = new AudioContext();
        gumStream = stream;
        input = audioContext.createMediaStreamSource(stream);

        /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 2 channels  will double the file size
        */
        rec = new Recorder(input, { numChannels: 1 })

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function (err) {
        //enable the record button if getUserMedia() fails
        stopButton.setAttribute("disabled", "");
        recordButton.removeAttribute("disabled");
    });
}

function stopRecording() {
    console.log("stopButton clicked");

    //disable the stop button, enable the record too allow for new recordings
    stopButton.setAttribute("disabled", "");
    recordButton.removeAttribute("disabled");
    loader.classList.add("active");
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to uploadFile
    rec.exportWAV(uploadFile);
}

function uploadFile(blob) {
    //name of .wav file to use during upload and download (without extendion)
    var filename = new Date().toISOString();
    var xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
        if (this.readyState === 4) {
            const out = JSON.parse(this.responseText);
            if (out.prediction == "Potter") {
                potter.removeAttribute("hidden");
            } else if (out.prediction == "StarWars") {
                starwars.removeAttribute("hidden");
            } else {
                error.removeAttribute("hidden");
            }
            loader.classList.remove("active");
            console.log("Server returned: ", e.target.responseText);
        }
    };
    var fd = new FormData();
    fd.append("audio_file", blob, filename);
    xhr.open("POST", "upload", true);
    xhr.send(fd);
}