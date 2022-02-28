"use strict";

function encodeIdentifier(identifier) {
	const buffer = [];
	for(const x of identifier) {
		const char_code = x.charCodeAt(0);
		if(char_code > 255) throw `Use hex values instead of pasting non-ascii in identifier: (${identifier})`;
		buffer.push(char_code);
	}
	return new Uint8Array(buffer);
}

function findIdentifier(needle, haystack) {
	const innerCheck = (i) => {
		for(let x = 1; x < needle.length; x++) {
			if(needle[x] !== haystack[i+x]) return false;
		}
		return true;
	};

	for(let i = 0; i < haystack.length; i++) {
		if(haystack[i] === needle[0]) {
			if(innerCheck(i)) return true;
		}
	}
	return false;
}

const games = {
	None: {
		title: "Unknown",
		platform: null,
		identifier: null,
		applyPatch: null
	},

	LittleBigPlanet: {
		title: "LittleBIGPlanet",
		platform: "PowerPC64",
		identifier: encodeIdentifier("LittleBigPlanet\x99\x00"),
		applyPatch: () => {
			console.log(":)");
		}
	},

	LittleBigPlanet_2: {
		title: "LittleBIGPlanet 2",
		platform: "PowerPC64",
		identifier: encodeIdentifier("LittleBigPlanet\xe2\x84\xa22\x00"),
		applyPatch: () => {
			console.log("lbp2 :)");
		}
	},

	LittleBigPlanet_3: {
		title: "LittleBIGPlanet 3",
		platform: "PowerPC64",
		identifier: encodeIdentifier("LittleBigPlanet\xe2\x84\xa23\x00"),
		applyPatch: () => {
			console.log("lbp3 :)");
		}
	},

	LittleBigPlanet_Vita: {
		title: "LittleBIGPlanet Vita",
		platform: "ARM",
		identifier: encodeIdentifier("LittleBigPlanet\xe2\x84\xa2 PS Vita\x00"),
		applyPatch: () => {
			console.log("lbp vita :)");
		}
	},

	LittleBigPlanet_PSP: {
		title: "LittleBIGPlanet",
		platform: "MIPS",
		identifier: encodeIdentifier("LittleBigPlanet\xe2\x84\xa2\x00"),
		applyPatch: () => {
			console.log("lbp psp :)");
		}
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
			if(findIdentifier(game_info.identifier, elf.bytes)) {
				if(found_game !== undefined) throw `Multiple matches for game in ELF: ${game_info.title} and ${found_game.title}`;
				found_game = game_info;
			}
		}

		if(found_game === undefined) throw "No pre-configured games for this ELF have been found";
		return found_game;
	}
};

export default GameLoading;