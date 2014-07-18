wapi.subscribe("profile", function (msg) {
    var status = document.getElementById("status");
    if (status)
    {
        status.innerHTML = "Topic: [profiling] 15 seconds of profiling remain.";

        var count = eventMonitor.getEventCount();
        eventMonitor.stopCounters();
        window.console.profile();
        var timeLeft = 15;
        var interval = setInterval(function () {
            timeLeft -= 1;
            status.innerHTML = "Topic: [profiling] " + timeLeft + " seconds of profiling remain.";
        }, 1000);

        setTimeout(function () {
            window.console.profileEnd();
            window.clearInterval(interval);
            count = eventMonitor.getEventCount() - count;
            eventMonitor.startCounters();
            alert("Profiling done: " + count);
            status.innerHTML = "Topic: ";
        }, 15000);
    }
});

