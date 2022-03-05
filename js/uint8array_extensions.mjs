"use strict";

//be wary of importing this as it will be added at the global scope

Uint8Array.fromAsciiString = function(str) {
	const buffer = [];
	for(const x of str) {
		const char_code = x.charCodeAt(0);
		if(char_code > 255) throw `Invalid ASCII charcode in "${str}"`;
		buffer.push(char_code);
	}
	return new Uint8Array(buffer);
}

Uint8Array.prototype.indexOfSubArray = function(sub_array) {
	const innerCheck = (i) => {
		for(let x = 1; x < sub_array.length; x++) {
			if(sub_array[x] !== this[i+x]) return false;
		}
		return true;
	};

	for(let i = 0; i < this.length; i++) {
		if(this[i] === sub_array[0]) {
			if(innerCheck(i)) return i;
		}
	}
	return -1;
};