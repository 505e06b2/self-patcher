"use strict";

import "./uint8array_extensions.mjs";

async function getPatch(name) {
	return await (await fetch(`./patches/${name}.js`)).text();
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
		patch: await getPatch("littlebigplanet")
	},

	LittleBigPlanet_2: {
		title: "LittleBIGPlanet 2",
		platform: "PowerPC64",
		identifier: Uint8Array.fromAsciiString("LittleBigPlanet\xe2\x84\xa22\x00"),
		patch: "no"//await getPatch("littlebigplanet_2")
	},

	LittleBigPlanet_3: {
		title: "LittleBIGPlanet 3",
		platform: "PowerPC64",
		identifier: Uint8Array.fromAsciiString("LittleBigPlanet\xe2\x84\xa23\x00"),
		patch: "no"
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