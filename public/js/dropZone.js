
$(document).ready(function () {

    console.log("dropZone.js - document is ready!");

    initDropZone();

});


/**
 * this function is activated as soon as the configuration file is dropped and received by the server
 * this function is called:
 * 1) for an initial project version configuration file
 * 2) for a final project version configuration file
 * 3) for a initial final project version configuration file
 *
 * @param {*} uploadedVersionConfFileId 
 * @param {*} response 
 */
function dropZoneSuccess(uploadedVersionConfFileId, response) {

    console.log("drop zone success");
    // suppress all rows in the body
    $("#" + uploadedVersionConfFileId + " > tbody").empty();
    var errors = response.errors;
    if (errors != undefined) {
        alert('Errors raised during file analysis - err= ' + String(errors));
    } else {
        if (response.hasOwnProperty("results")) {
            console.log("response has a results attribute");
            var results = response.results;
            if (results.hasOwnProperty("componentData")) {

                var componentData = results.componentData;

                var componentName = componentData.name;
                var data = [];
                var gitArray = [];
                componentData.git.forEach(function (element) {
                    gitArray.push({ 'text': String(element) });
                });
                data.push({
                    'text': 'ClearQuest',
                    'state': { 'opened': true, 'selected': false },
                    'children': [
                        { 'text': 'assigned' },
                        { 'text': 'base' }
                    ]
                });
                data.push({
                    'text': 'Doors',
                    'state': { 'opened': true, 'selected': false },
                    'children': [{ 'text': 'baseline' },
                    { 'text': 'component' },
                    { 'text': 'project' }]
                });
                data.push({
                    'text': 'Git',
                    'state': { 'opened': true, 'selected': false },
                    'children': gitArray
                });
                // create the jstree instance
                $('#jstree_demo_div').jstree({
                    'core': {
                        'data': data
                    }
                });

            }
            if (results.hasOwnProperty("xml")) {
                var xml = results.xml;

                var editor = ace.edit("editor");
                editor.setTheme("ace/theme/chrome");
                //editor.setTheme("ace/theme/monokai");
                editor.getSession().setMode("ace/mode/xml");
                editor.setFontSize(10);
                editor.setAutoScrollEditorIntoView(true);
                editor.getSession().setValue(String(xml), -1);
                editor.$blockScrolling = Infinity;

            }



        } else {
            alert("Project Versions.js - Expecting an object with a results key");
        }
    }
}

/**
 * there are TWO drop zones (one for the initial conf file and another for the final conf file) but one can be hidden...
 */
function initDropZone() {

    console.log("drop zone.js - init drop zone");
    // avoid auto Discovering by DropZone according to class = dropzone => avoid it => dropzones created on the fly by Javascript code
    Dropzone.autoDiscover = true;
    /**
     * initial drop zone for the Initial Project Version Configuration 
     */
    // warning => do not modify the following id
    Dropzone.options.dropZoneId = {
        dictDefaultMessage: "Please drop your XML Configuration file here <br>(only XML Mime Type)",
        accept: function (file, done) {
            console.log("Drop Zone XML configuration File - file uploaded");
            done();
        },
        init: function () {
            this.on("addedfile", function () {
                // ensure that only one file is dropped
                if (this.files[1] != null) {
                    this.removeFile(this.files[0]);
                }
            });
        },
        success: function (file, response) {
            console.log("Initial Conf File= " + file.name);
            // set the file name
            $("#" + String("divXMLConfigurationFileNameId")).html(String(file.name));
            dropZoneSuccess("uploadedXmlConfigurationFileId", response);
        }
    };


}