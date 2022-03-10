"use strict";

import BinaryManager from "./binary_manager/main.mjs";
import Game from "./game.mjs";
import Elements from "./elements.mjs";

import "./uint8array_extensions.mjs";

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

window.load = async function(file) {
	Elements.find("#filename").innerText = file.name;
	//Using too much window.*??
	window.filename = file.name;
	window.elf = await loadElf(file);
	if(window.elf === null) return;

	const console_name = {
		PowerPC64: "PlayStation 3",
		MIPS: "PSP",
		ARM: "PS Vita"
	};

	Elements.find("#console").innerText = console_name[window.elf.machine];

	window.game = null
	try {
		window.game = Game.findFromElf(window.elf);
	} catch(error) {
		alert(error);
		return;
	}

	Elements.find("#game").innerText = window.game.title;
	Elements.find("#patch-script", "PatchScript").value = window.game.patch;
	if(elf.encrypt) Elements.find("#download-self-button").show();

	Elements.get("FilePicker").hide();
	Elements.get("PatchContainer").show();
}

window.execute = async function(button_element) {
	if(button_element) button_element.disabled = true;

	console.log("Executing the contents of the textarea");
	const script = new AsyncFunction(`"use strict"; ${Elements.get("PatchScript").value}`);
	try {
		let alert_string = "Done!\nDownload your new binary with the button(s) below!"
		await script();
		alert(alert_string);
	} catch(e) {
		alert(`Error: ${e}`);
	}

	console.log("Textarea script exited");
	if(button_element) button_element.disabled = false;
}

window.downloadElf = async function() {
	if(!window.elf) throw "No ELF loaded";
	await downloadDialog(window.elf, `${window.filename}_altered.elf`);
}

async function loadElf(file) {
	const bytes = new Uint8Array(await file.arrayBuffer());
	try {
		return await BinaryManager.loadFromUint8Array(bytes, true);
	} catch(error) {
		alert(error);
		return null;
	}
}

async function downloadDialog(elf_or_self, filename="file.bin") {
	const blob = new Blob([elf_or_self.bytes]);
	const download_url = URL.createObjectURL(blob);
	Elements.create("a", {download: filename, href: download_url}).click();
	URL.revokeObjectURL(download_url);
}

async function main() {
	Elements.find("#loading").style.display = "none";
	Elements.find("#file-picker", "FilePicker").show();
	Elements.find("#patch-container", "PatchContainer");
}

main();