window.addEventListener("focus", function (e) {
    var focus = document.getElementById("focus_status");
    if (focus)
    {
        focus.innerHTML = "focused";
    }
});

window.addEventListener("blur", function (e) {
    var focus = document.getElementById("focus_status");
    if (focus)
    {
        focus.innerHTML = "blurred";
    }
});