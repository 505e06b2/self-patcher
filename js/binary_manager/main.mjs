"use strict";

import {SELF, SELFData} from "./self.mjs";
import {ELF, ELFData} from "./elf.mjs";

const text_decoder = new TextDecoder("utf8");

async function loadFromUint8Array(byte_array, decrypt_if_possible = false) {
	//works on the basis that both magic bytestrings are 4 bytes long
	const magic_string = text_decoder.decode(byte_array.slice(0, 4));

	switch(magic_string) {
		case SELFData.magic_string: {
			const self = new SELF(byte_array);
			if(decrypt_if_possible) return self.decrypt();
			return self;
		}

		case ELFData.magic_string:
			return new ELF(byte_array);
	}

	throw "!! Unrecognised file type !!\nYou will likely need to manually decrypt your binary";
}

export default {
	loadFromUrl: async (url_string, decrypt_if_possible) => {
		const r = await fetch(url_string);
		const bytes = new Uint8Array(await r.arrayBuffer());
		return await loadFromUint8Array(bytes, decrypt_if_possible);
	},

	loadFromUint8Array: loadFromUint8Array
};