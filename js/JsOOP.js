/*
 *  Tool to verify that a web application follows the 
 *	object-oriented programming principles. It checks 
 *	all the JavaScript code used on a web page and make 
 *	sure it is correctly written. Error messages are 
 *	presented to the user/developer via popup messages. 
 *	Descriptions of error messages is given through the 
 *	JavaScript console.
 *  
 *	@copyright	Copyright (c) 2013.
 *	@license	Creative Commons (BY-NC-SA)
 *	@version	1.5.2
 *	@since		2013-05-17
 *	@author		Henrik Andersen <henrik.andersen@lnu.se>
 *				Emil Johansson <emil.johansson@lnu.se>
 */
var JsOOP = (function() {

	//---------------------------------------------------
	//  Private properties
	//---------------------------------------------------
	
	/**
	 *	Contains a list of the objects that your browser 
	 *	creates at startup. If this list contains properties 
	 *	or methods, it means that the program code will not 
	 *	be validated. These properties or methods will be 
	 *	treated as misplaced instances.
	 * 
	 *	@var array
	 */
	var startWindowObjects = Object.getOwnPropertyNames(window);

	/**
	 *	Contains a list of the JavaScript classes that the 
	 *	developer specified via script tags.
	 *
	 *	@var array
	 */
	var classList = [];

	//---------------------------------------------------
	//  Private constants
	//---------------------------------------------------

	/**
	 *	Keycode for runtime validation.
	 *
	 *	@var int
	 */
	var KEYBOARD_SHORTCUT_KEY = 86;

	/**
	 *	Message for when a Web application fails validation.
	 *
	 *	@var String
	 */
	var ERROR_VALIDATION_FAILD = "JsOOP ERROR: Your application is not valid. See list presented in the console for more information.";

	/**
	 *	Message that gives a description of why the web 
	 *	application did not pass validation.
	 *
	 *	@var String
	 */
	var ERROR_PROHIBITED_WINDOW_OBJECT = "JsOOP ERROR: The following list contains objects, properties or methods that are stored in the browser's window object. The error is corrected when these objects, properties or methods have been addressed to its proper class:";

	/**
	 *	Message for when the developer calls on classes that 
	 *	do not exist.
	 *
	 *	@var String
	 */
	var ERROR_UNDEFINED_CLASS = 'JsOOP ERROR: Class "%C" is undefined and can not be found, please check that the class is imported correctly.';

	//---------------------------------------------------
	//  Private method
	//---------------------------------------------------
	
	/** 
	 *	The class constructor.
	 *
	 *	@return undefined
	 */
	function init() {
		initEvent();
		initCheck();
	}

	/** 
	 *	Creates and activates the object's basic event 
	 *	listeners.
	 *
	 *	@return undefined
	 */
	function initEvent() {
		document.addEventListener("keydown", onKeydownEvent, false);
	}

	/** 
	 *	Allows the developer to run validations of the 
	 *	application code via keyboard shortcuts (shift + v).
	 *
	 *	@param	event 	The event that triggered this method. 
	 *
	 *	@return undefined
	 */
	function onKeydownEvent(event) {
		if (event.shiftKey && event.keyCode == KEYBOARD_SHORTCUT_KEY) {
			initCheck();
		}
	}

	/** 
	 *	Starts a new validation of the program code. This 
	 *	method retrieves all imported JavaScript classes and 
	 *	checks if the classes are instantiated correctly.
	 *
	 *	@return undefined
	 */
	function initCheck() {
		getJavaScriptFiles();
		validateJavaScriptObjects();
	}

	/** 
	 *	Finds and saves all the JavaScript code defined by 
	 *	the developer via script tags.
	 *
	 *	@return undefined
	 */
	function getJavaScriptFiles() {
		var scripts = document.getElementsByTagName("script");
		for (var i = 0; i < scripts.length; i++) {
			if (scripts[i].src) addClass(scripts[i].src);
			else console.log(i,scripts[i].innerHTML);
		}
	}

	/** 
	 *	Retrieves the class name from the file path and 
	 *	adds it to the list of classes.
	 *
	 *	@param	path 	File path to JavaScript class file.
	 *
	 *	@return undefined
	 */
	function addClass(path) {
		var fileName    = path.split("/").pop(),
			className   = fileName.split(".")[0];
		if (typeof window[className] === 'undefined') {
			alert(ERROR_UNDEFINED_CLASS.replace("%C", className));
			console.log(ERROR_UNDEFINED_CLASS.replace("%C", className));
		}
		classList.push(className);
	}

	/** 
	 *	Checks to see if any new objects have been added to 
	 *	the browser's window object. The program code is only 
	 *	valid if each object is represented by a class.
	 *
	 *	@param	path 	File path to JavaScript class file.
	 *
	 *	@return undefined
	 */
	function validateJavaScriptObjects() {
		var objs        = Object.getOwnPropertyNames(window);
		var startUpDiff = diff(objs, startWindowObjects);
		var classDiff   = diff(startUpDiff, classList);
		if (classDiff.length > 0) {
			console.log(ERROR_PROHIBITED_WINDOW_OBJECT);
			console.log(classDiff);
			alert(ERROR_VALIDATION_FAILD);
		}
	}

	/**
	 *	Returns the different elements between two 
	 *	arrays.
	 * 
	 *	@param   a1	The first array object.
	 *	@param   a2	The second array object.
	 *
	 *	@return The The difference between the two arrays.
	 */
	function diff(a1, a2) {
		return a1.filter(function(i) {return !(a2.indexOf(i) > -1);});
	}

	// CLASS BOOTSTRAP
	window.addEventListener("load", init, "false");
	return this;
}());