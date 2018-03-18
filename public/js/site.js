
var worker = undefined;

$(document).ready(function () {

    console.log("Site.js - document is ready!");

    startWorker();

    // Get the element with id="defaultOpen" and click on it
    // define the default tab that will be displayed
    document.getElementById("defaultOpen").click();

    // show the progress bars related to the images loading process
    $('#prepImages').show();
    $('#loadImages').show();

});

/**
 * start worker
 */
function startWorker() {

    // Worker with an upper case is a global class
    if (typeof (Worker) !== "undefined") {
        // Yes! Web worker support!
        // Some code.....
        if (typeof (worker) == "undefined") {
            worker = new Worker("/js/worker.js");
            worker.onmessage = function (event) {

                var workerProgressBar = document.getElementById('workerId');
                workerProgressBar.value = event.data;

                var workerProgressValue = document.getElementById('workerVal');
                workerProgressValue.innerHTML = event.data;
            };
        }

    } else {
        // Sorry! No Web Worker support..
    }

}


function stopWorker() {
    worker.terminate();
    worker = undefined;
    console.log("worker is stopped !!!");
    // hide the progress bars
    $('#prepImages').hide();
    $('#loadImages').hide();
    $("#workerId").hide();
    $("#progressId").hide();
}

var imagesIndex = 0;

function updateProgress() {
    var progressBar = document.getElementById('progressId');
    progressBar.value = String(imagesIndex++);
    var progressValue = document.getElementById('progressVal');
    if (progressValue != undefined) {
        progressValue.innerHTML = String(imagesIndex);
    }
}

function initProgressBar() {
    // Gets the number of image elements
    var numberImages = $('img').length;
    var progressBar = document.getElementById('progressId');
    if (progressBar != undefined) {
        progressBar.max = String(numberImages);
    }
}


function slugify(text) {
    // Replace spaces with -
    return text.toString().replace(/\s+/g, '-')
}

/**
 * manage the tabbed content
 * @param {*} evt
 * @param {*} tabName
 */
function openTab(evt, tabName) {

    console.log(" Open Tab - tabName= " + tabName);
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    if (document.getElementById(tabName)) {
        document.getElementById(tabName).style.display = "block";
    }

    evt.currentTarget.className += " active";
}
