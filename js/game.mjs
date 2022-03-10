"use strict";

import "./uint8array_extensions.mjs";

const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

async function getPatch(name) {
	return await (await fetch(`./patches/${name}.js`)).text();
}

async function applyPatchBase(base_name, name) {
	const base_contents = await (await fetch(`./patches/${base_name}.js`)).text();
	const patch_contents = await (await fetch(`./patches/${name}.js`)).text();
	const patch = new AsyncFunction("base", patch_contents);
	return await patch(base_contents) || base_contents;
}

const games = {
	None: {
		title: "Unknown",
		platform: null,
		identifier: null,
		patch: null
	},

	LittleBigPlanet: {
		title: "LittleBIGPlanet",
		platform: "PowerPC64",
		identifier: Uint8Array.fromAsciiString("LittleBigPlanet\x99\x00"),
		patch: await applyPatchBase("base_littlebigplanet", "littlebigplanet")
	},

	LittleBigPlanet_2: {
		title: "LittleBIGPlanet 2",
		platform: "PowerPC64",
		identifier: Uint8Array.fromAsciiString("LittleBigPlanet\xe2\x84\xa22\x00"),
		patch: await applyPatchBase("base_littlebigplanet", "littlebigplanet_2")
	},

	LittleBigPlanet_3: {
		title: "LittleBIGPlanet 3",
		platform: "PowerPC64",
		identifier: Uint8Array.fromAsciiString("LittleBigPlanet\xe2\x84\xa23\x00"),
		patch: await applyPatchBase("base_littlebigplanet", "littlebigplanet_3")
	},

	LittleBigPlanet_Vita: {
		title: "LittleBIGPlanet Vita",
		platform: "ARM",
		identifier: Uint8Array.fromAsciiString("LittleBigPlanet\xe2\x84\xa2 PS Vita\x00"),
		patch: "no"
	},

	LittleBigPlanet_PSP: {
		title: "LittleBIGPlanet",
		platform: "MIPS",
		identifier: Uint8Array.fromAsciiString("LittleBigPlanet\xe2\x84\xa2\x00"),
		patch: "no"
	}
}

export const GameLoading = {
	findFromElf: (elf) => {
		const platform_matches = [];
		for(const game_info of Object.values(games)) {
			if(elf.machine === game_info.platform) platform_matches.push(game_info);
		}

		if(platform_matches.length === 0) throw "No pre-configured games that match this ELF's ISA have been found";
		if(platform_matches.length === 1) return platform_matches[0];

		let found_game = undefined;
		for(const game_info of platform_matches) {
			if(elf.bytes.indexOfSubArray(game_info.identifier) !== -1) {
				if(found_game !== undefined) throw `Multiple matches for game in ELF: ${game_info.title} and ${found_game.title}`;
				found_game = game_info;
			}
		}

		if(found_game === undefined) throw "No pre-configured games for this ELF have been found";
		return found_game;
	}
};

export default GameLoading;