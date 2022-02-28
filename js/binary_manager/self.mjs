"use strict";

//https://www.psdevwiki.com/ps3/Certified_File#Structure

import SCETool from "./scetool.mjs";
import ELF from "./elf.mjs";

export const SELFData = {
	magic_string: "SCE\x00",
	version: {
		Vita: "Vita",
		PlayStation3: "PS3"
	}
};

const text_decoder = new TextDecoder("utf8");

export function SELF(bytes_in) {
	this.length = bytes_in.length;
	this.magic_string = text_decoder.decode(bytes_in.slice(0x00, SELFData.magic_string.length));
	this.version = () => {
		const data_view = new DataView(bytes_in.buffer, 0x04, 4);
		const big_endian = data_view.getUint32(0, false);
		const little_endian = data_view.getUint32(0, true);

		if(big_endian === 2) return SELFData.version.PlayStation3;
		if(little_endian === 3) return SELFData.version.Vita;
	};

	this.isSELF = this.magic_string === SELFData.magic_string;
	this.bytes = bytes_in;

	this.decrypt = () => new ELF(SCETool.decrypt(this.bytes));
}

export default SELF;