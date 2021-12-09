const recordAudio = () =>
    new Promise(async resolve => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
            console.log(event);
            audioChunks.push(event.data);
        });

        const start = () => mediaRecorder.start();

        const stop = () =>
            new Promise(resolve => {
                mediaRecorder.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks, { 'type': 'audio/wav; codecs=0' });
                    const upload = () => {
                        var filename = "audio.wav";
                        var xhr = new XMLHttpRequest();
                        xhr.onload = function (e) {
                            if (this.readyState === 4) {
                                console.log("Server returned: ", e.target.responseText);
                            }
                        };
                        var fd = new FormData();
                        fd.append("audio_file", audioBlob, filename);
                        fd.append("type", 'audio/wav');
                        xhr.open("POST", "upload", true);
                        xhr.send(fd);
                    }
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    const play = () => audio.play();
                    resolve({ audioBlob, audioUrl, upload, play });
                });

                mediaRecorder.stop();
            });

        resolve({ start, stop });
    });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const handleAction = async () => {
    const recorder = await recordAudio();
    const actionButton = document.getElementById("action");
    actionButton.disabled = true;
    recorder.start();
    await sleep(15000);
    const audio = await recorder.stop();
    actionButton.disabled = false;
    audio.upload();
    audio.play();
    await sleep(15000);

};