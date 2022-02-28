"use strict";

//https://refspecs.linuxfoundation.org/elf/gabi4+/ch4.eheader.html

import SCETool from "./scetool.mjs";
import SELF from "./self.mjs";

export const ELFData = {
	magic_string: "\x7fELF",
	class: {
		ThirtyTwoBit: "32-bit",
		SixtyFourBit: "64-bit"
	},
	endianness: { //data
		Little: "Little",
		Big: "Big"
	},
	machine: {
		0x08: "MIPS",
		0x15: "PowerPC64",
		0x28: "ARM"
	}
};

const text_decoder = new TextDecoder("utf8");

export function ELF(bytes_in) {
	this.length = bytes_in.length;
	this.ident = {
		mag: text_decoder.decode(bytes_in.slice(0x00, ELFData.magic_string.length)),
		class: [undefined, ELFData.class.ThirtyTwoBit, ELFData.class.SixtyFourBit][bytes_in[0x04]],
		data: [undefined, ELFData.endianness.Little, ELFData.endianness.Big][bytes_in[0x05]],
		version: bytes_in[0x06],
		os_abi: bytes_in[0x07],
		os_abi_version: bytes_in[0x08]
	};

	const use_little_endian = this.ident.data === ELFData.endianness.Little;
	const data_view = new DataView(bytes_in.buffer);
	this.type = data_view.getUint16(0x10, use_little_endian);
	this.machine_raw = data_view.getUint16(0x12, use_little_endian);
	this.machine = ELFData.machine[this.machine_raw];
	this.version = data_view.getUint32(0x14, use_little_endian);

	if(use_little_endian) {
		this.entry = data_view.getUint32(0x18, use_little_endian);
		this.phoff = data_view.getUint32(0x1c, use_little_endian);
		this.shoff = data_view.getUint32(0x20, use_little_endian);
		this.flags = data_view.getUint32(0x24, use_little_endian);
		this.ehsize = data_view.getUint16(0x28, use_little_endian);
		this.phentsize = data_view.getUint16(0x2a, use_little_endian);
		this.phnum = data_view.getUint16(0x2c, use_little_endian);
		this.shentsize = data_view.getUint16(0x2e, use_little_endian);
		this.shnum = data_view.getUint16(0x30, use_little_endian);
		this.shstrndx = data_view.getUint16(0x32, use_little_endian);
	} else {
		this.entry = data_view.getBigUint64(0x18, use_little_endian);
		this.phoff = data_view.getBigUint64(0x20, use_little_endian);
		this.shoff = data_view.getBigUint64(0x28, use_little_endian);
		this.flags = data_view.getUint32(0x30, use_little_endian);
		this.ehsize = data_view.getUint16(0x34, use_little_endian);
		this.phentsize = data_view.getUint16(0x36, use_little_endian);
		this.phnum = data_view.getUint16(0x38, use_little_endian);
		this.shentsize = data_view.getUint16(0x3a, use_little_endian);
		this.shnum = data_view.getUint16(0x3c, use_little_endian);
		this.shstrndx = data_view.getUint16(0x3e, use_little_endian);
	}

	this.isELF = this.length >= this.ehsize && this.ident.mag === ELFData.magic_string;
	this.bytes = bytes_in;

	if(this.machine === "PowerPC64") this.encrypt = () => new SELF(SCETool.encrypt(this.bytes));
}

export default ELF;