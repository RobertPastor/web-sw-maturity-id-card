/*
* author : Robert PASTOR
* date : 14th January 2018
* 
* this sub class of the super class worker-javascript
* implements init and validate function
*  
*/
"no use strict";
JavaScriptWorker = require('JavaScriptWorker')

// implement heritage
SubClassWorker.prototype = Object.create(JavaScriptWorker.ErrorListener.prototype);
SubClassWorker.prototype.constructor = SubClassWorker;


/**
 * this function allows to initialized the antrl4 environment
 */
SubClassWorker.prototype.init = function() {
	
	try {
		ace_require = require;
		window.require = undefined;
		//console.log('worker - validate - require is now undefined ');
		
		//console.log('window location origin= ' + window.location.origin);
		window.Smoothie = { 'requirePath': ['/static/js/'] }; // walk up to js folder, see Smoothie docs

		importScripts(window.location.origin + "/static/js/smoothie-require.js");
		//console.log('worker -- init -- require for antlr4 is loaded');
			    		
	    antlr4 = window.require('antlr4/index');
	    //console.log('worker -- init -- antlr4 is loaded');
	    
		CalculatorLanguage = window.require("generated-javascript/index");
	    //console.log('worker -- init -- generated javascript calculator index loaded');
	    
	    AnnotatingListener = window.require("annotating-error-listener");
	    //console.log('worker -- init -- annotating error listener loaded');
	    
	    AnnotatingConsoleListener = window.require("annotating-console-error-listener");
	    //console.log('worker -- init -- annotating console error listener loaded');

	} catch (e) {
	    console.log('worker -- init -- error= ' + String(e));
	} finally {
	    require = ace_require;
	}
	
};



/**
 * this function overrides the onUpdate function of the Javascript worker
 */
SubClassWorker.prototype.onUpdate = function(recognizer, offendingSymbol, line, column, msg, e) {
	// annotation array
	//console.log('AnnotatingErrorListener -- message is= ' + String(msg));
    this.annotations.push({
        row: line - 1,
        column: column,
        text: msg,
        type: "error",
        raw: String(offendingSymbol)
 });
};