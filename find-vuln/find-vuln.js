var process = require('process');

function check() {
	if ({}.test == "123" || {}.test == 123) {
		delete Object.prototype.test;
		return true;
	}
	return false;
}

function run(fnct, sig, name, totest) {
	// Reinitialize to avoid issue if the previous function changed attributes.
	BAD_JSON = JSON.parse('{"__proto__":{"test":123}}');

	try {
		fnct(totest);
	} catch (e) {}

	if (check()) {
		console.log("Detected : " + name + " (" + sig + ")");
	}
}

var BAD_JSON = {};
var args = process.argv.slice(2);

process.on('uncaughtException', function(err) { });

var pattern = [{
	fnct : function (totest) {
		totest(BAD_JSON);
	},
	sig: "function (BAD_JSON)"
},{
	fnct : function (totest) {
		totest(BAD_JSON, {});
	},
	sig: "function (BAD_JSON, {})"
},{
	fnct : function (totest) {
		totest({}, BAD_JSON);
	},
	sig: "function ({}, BAD_JSON)"
},{
	fnct : function (totest) {
		totest(BAD_JSON, BAD_JSON);
	},
	sig: "function (BAD_JSON, BAD_JSON)"
},{
	fnct : function (totest) {
		totest({}, {}, BAD_JSON);
	},
	sig: "function ({}, {}, BAD_JSON)"
},{
	fnct : function (totest) {
		totest({}, {}, {}, BAD_JSON);
	},
	sig: "function ({}, {}, {}, BAD_JSON)"
},{
	fnct : function (totest) {
		totest({}, "__proto__.test", "123");
	},
	sig: "function ({}, BAD_PATH, VALUE)"
},{
	fnct : function (totest) {
		totest({}, "__proto__[test]", "123");
	},
	sig: "function ({}, BAD_PATH, VALUE)"
},{
	fnct : function (totest) {
		totest("__proto__.test", "123");
	},
	sig: "function (BAD_PATH, VALUE)"
},{
	fnct : function (totest) {
		totest("__proto__[test]", "123");
	},
	sig: "function (BAD_PATH, VALUE)"
},{
	fnct : function (totest) {
		totest({}, "__proto__", "test", "123");
	},
	sig: "function ({}, BAD_STRING, BAD_STRING, VALUE)"
},{
	fnct : function (totest) {
		totest("__proto__", "test", "123");
	},
	sig: "function (BAD_STRING, BAD_STRING, VALUE)"
}]

if (args.length < 1) {
	console.log("First argument must be the library name");
	exit();
}

try {
	var lib = require(args[0]);
} catch (e) {
	console.log("Missing library : " + args[0] );
	exit();
}

var parsedObject = [];

function exploreLib(lib, prefix, depth) {
	if (depth == 0) return;
	if (parsedObject.indexOf(lib) !== -1) return;

	parsedObject.push(lib);

	for (var k in lib) {
		if (k == "abort") continue;
		if (k == "__proto__") continue;
		if (+k == k) continue;

		console.log(k);
	
		if (lib.hasOwnProperty(k)) {
			for (p in pattern) {
				if (pattern.hasOwnProperty(p)) {
					run(pattern[p].fnct, pattern[p].sig, prefix + "." + k, lib[k]);
				}
			}

			exploreLib(lib[k], prefix + "." + k, depth - 1);
		}
	}

	if (typeof lib == "function") {
		for (p in pattern) {
			if (pattern.hasOwnProperty(p)) {
				run(pattern[p].fnct, pattern[p].sig, args[0], lib);
			}
		}
	}
}

exploreLib(lib, args[0], 5);
