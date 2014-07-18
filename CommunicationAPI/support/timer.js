/*
 * Simple sample code to toggle state of timers.
 */
var counter = 0;
var timer = document.getElementById("timer");
var source = document.getElementById("source");
var timerid = null;

function handlePause(msg) {
    var e = document.getElementById("status");

    if (msg === "pause")
    {
        e.innerHTML = "Topic: [paused]";

        if (timer && timerid !== null)
        {
            clearInterval(timerid);
            timerid = null;
        }
    }
    else
    {
        e.innerHTML = "Topic: [running]";
        if (timer && timerid == null)
        {
            timerid = window.setInterval(function () {
                timer.innerHTML = counter;
                counter += 500;
            }, 500);
        }
    }
}

source.innerHTML = window.document.URL;
handlePause("resume");