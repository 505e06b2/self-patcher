"use strict";

import BinaryManager from "./binary_manager/main.mjs";
import Game from "./game.mjs";
import Elements from "./elements.mjs";

async function loadElf(file) {
	const bytes = new Uint8Array(await file.arrayBuffer());
	try {
		return await BinaryManager.loadFromUint8Array(bytes, true);
	} catch(error) {
		alert(error);
		return null;
	}
}

window.load = async function(file) {
	Elements.find("#filename").innerText = file.name;
	window.elf = await loadElf(file);
	if(window.elf === null) return;

	Elements.get("FilePicker").hide();
	Elements.get("PatchContainer").show();
	const console_name = {
		PowerPC64: "PlayStation 3",
		MIPS: "PSP",
		ARM: "PS Vita"
	};

	Elements.find("#console").innerText = console_name[window.elf.machine];

	let game;
	try {
		game = Game.findFromElf(window.elf);
	} catch(error) {
		alert(error);
		return;
	}

	Elements.find("#game").innerText = game.title;
	Elements.find("#patch-script").value = game.applyPatch.toString();
}

async function main() {
	Elements.find("#loading").style.display = "none";
	Elements.find("#file-picker", "FilePicker").show();
	Elements.find("#patch-container", "PatchContainer");
}

main();