window.addEventListener("mousemove", function (e) {
    var tracker = document.getElementById("mousetracker");
    if (tracker)
    {
        tracker.innerHTML = e.screenX + ", " + e.screenY;
    }
});

window.addEventListener("touchmove", function (e) {
    var tracker = document.getElementById("mousetracker");
    if (tracker)
    {
        tracker.innerHTML = "touchmove: " + e.timeStamp;
    }
    e.preventDefault();
});
