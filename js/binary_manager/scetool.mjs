"use strict";

import EmscriptenSCETool from "./emscripten_scetool.mjs";

const scetool = await EmscriptenSCETool();

const wrapped = {
	decrypt: scetool.cwrap("decrypt_self", "number", ["string", "string"]),
	encrypt: scetool.cwrap("encrypt_elf", "number", ["string", "string"])
};

function useWrapped(func, bytes_in) {
	const in_filename = "/tmp/file.in";
	const out_filename = "/tmp/file.out";
	let ret = null;

	if(scetool.FS.isFile(in_filename)) FS.unlink(in_filename);
	if(scetool.FS.isFile(out_filename)) FS.unlink(out_filename);

	scetool.FS.writeFile(in_filename, bytes_in);

	try {
		func(in_filename, out_filename);
		ret = scetool.FS.readFile(out_filename);
		scetool.FS.unlink(out_filename);
	} catch {}

	scetool.FS.unlink(in_filename);
	return ret;
}

export default {
	decrypt: (bytes_in) => useWrapped(wrapped.decrypt, bytes_in),
	encrypt: (bytes_in) => useWrapped(wrapped.encrypt, bytes_in)
};