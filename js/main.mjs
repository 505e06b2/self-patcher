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

async function load(file) {
	window.elf = await loadElf(file);
	if(window.elf === null) return;

	Elements.get("FilePicker").delete();
	const console_name = {
		PowerPC64: "PlayStation 3",
		MIPS: "PSP",
		ARM: "PS Vita"
	};

	document.body.append(
		Elements.div({className: "page-centre patch-container"}, "PatchContainer").append(
			Elements.div({innerText: `Console: ${console_name[elf.machine]}`}),
			Elements.input({
				type: "button",
				value: "Determine Game (For AutoPatching)",
				style: "display: block",
				onclick: function() {
					let game;
					try {
						game = Game.findFromElf(elf);
					} catch(error) {
						alert(error);
						return;
					}

					const patch_container = Elements.get("PatchContainer");
					patch_container.insertBefore(
						Elements.div({
							innerText: `Game: ${game.title}`
						}),
					patch_container.children[1]);
					this.outerHTML = "";
				}
			}),
			Elements.textarea({placeholder: "Paste your patching script here..."})
		)
	);
}

async function main() {
	document.body.innerHTML = "";
	document.body.append(
		Elements.div({className: "page-centre"}, "FilePicker").append(
			Elements.input({
				type: "file",
				accept: ".elf,.self,.bin",
				onchange: function(e) {load(this.files[0])}
			})
		)
	);
}

main();