
/**
* Javascript-based Enumeration Class
* @param {Array | Object}	arr 		Enumeration items. Can be array of strings ['RED', 'GREEN', 'BLUE'] or array of objects [{'RED': 0}, {'GREEN': 1}, {'BLUE': 2}] or object (e.g. {RED: 0, GREEN: 1, BLUE: 2}
* @param {Object} 			options		
*/
var Enumeration = function(arr, options) {
	
	/**
	* Checks if passed parameter is of Array type or not
	* @param {Object || Any type}	o 		The variable to be tested
	* @return {Boolean}						The result of test 
	*/
	function isArray(o) {
	  return (Object.prototype.toString.call(o) === '[object Array]');
	}

	/**
	* Checks if passed parameter is of Object type or not
	* @param {Object || Any type}	o 		The variable to be tested
	* @return {Boolean}						The result of test 
	*/
	function isObject(o) {
	  return (Object.prototype.toString.call(o) === '[object Object]');
	}

	/**
	* Capitalizes the first character of a string
	* @param {String}	str 	The string to be capitalized
	* @return {String}			The capitalized string
	*/
	function capitalize(str){
		//if parameter is empty, return empty
		if(str.length === 0) {
			return '';
		}

		//replace underscores with spaces
		str = str.replace(/_/g, ' ');

		//capitalize first letter and turn the rest to lowercase		
		return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
	}

	/**
	* Class wrapper for items in the enumeration
	* @param {Number}	value 			The value of enumeration item
	* @param {String}	stringValue 	The custom string representation of the enumeration item
	*/
	function EnumerationItem(value, stringValue) {
		this.value = value;
		this._stringValue = stringValue;
	}

	EnumerationItem.prototype = {
		valueOf: function() {
			return this.value;
		},

		toString: function() {
			return this.value;
		},

		toJSON: function() {
			return this.value;
		},

		toStringValue: function() {
			return this._stringValue;
		}
	}

	var isArrayParam = isArray(arr);
	var isObjectParam = isObject(arr);


	if(!isArrayParam && !isObjectParam) {
		throw new Error('Argument must be array of strings (e.g ["RED", "GREEN", "BLUE"]) or array of objects (e.g [{RED : 0}, {GREEN: 1}, {BLUE: 2}]) or object (e.g. {RED: 0, GREEN: 1, BLUE: 2})');
		//return;
	}

	var oThis = this;
	var startAt = 0;	//default starting value of enums in array of strings format
	
	if(options) {

		//override starting value if specified
		if(options.startAt) {
			startAt = options.startAt;
		}
	}


	//if passed parameter is an array
	if(isArrayParam) {
		arr.forEach(function(item, index, array) {
			if(typeof item === 'string') {
				var value = index + startAt;
				oThis[item] = new EnumerationItem(value, capitalize(item));
			}
			else if (typeof item === 'object') {
				var keys = Object.keys(item);

				if((keys.length === 1) || (keys.length === 2 && keys[1] === 'stringValue')) {
					var enumKey = keys[0];
					var stringValue = capitalize(enumKey);

					if(keys.length === 2 && keys[1] === 'stringValue') {
						stringValue = item['stringValue'];
					}

					oThis[enumKey] = new EnumerationItem(item[enumKey], stringValue);
				}
			}

		})
	}
	//if passed parameter is an object
	else if(isObjectParam) {
		var keys = Object.keys(arr);

		keys.forEach(function(item, index, array) {
			oThis[item] = new EnumerationItem(arr[item], capitalize(item));
		})
	}	
}



Enumeration.prototype = {
	_get: function(column) {
		var result = [];
		var oThis = this;

		var keys = oThis.getKeys();

		keys.forEach(function(item, index) {			
			if(column === 'value') {
				result.push(oThis[item]);
			}
			else if(column === 'stringValue') {
				result.push(oThis[item].toStringValue());
			}
		})

		return result;
	},

	getKeys: function() {
		return Object.keys(this);
	},

	getValues: function() {
		return this._get('value');
	},

	getStringValues: function() {
		return this._get('stringValue');
	},

	getItems: function() {
		return this.getValues();
	},

	getValue: function(value, defaultValue) {
		var result = defaultValue;
		var items = this.getItems();

		for(var i=0,l=items.length;i<l;i++) {
			var item = items[i];
			if(item.value === value) {
				result = item;
				break;
			}
		}

		return result;
	},

	getStringValue: function(value, defaultValue) {
		var item = this.getValue(value, null);

		if(item) {
			return item.toStringValue();
		}
		else {
			return defaultValue;
		}
	},

	hasValue: function(value) {
		var item = this.getValue(value, null);

		return item !== null;
	}
}


module.exports = Enumeration;



	