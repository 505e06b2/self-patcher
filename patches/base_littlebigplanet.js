//
// Click Execute! to replace the URL of the Master server
//

function BinaryUrl(url) {
	this.string = url;
	this.byte_array = Uint8Array.fromAsciiString(url);
	this.index = elf.bytes.indexOfSubArray(this.byte_array);
	this.length = url.length;
}

//implemented a bit funny, but should consistently work and allow for multiple tries
if(!window.patch_config) {
	window.patch_config = new (function() {
		this.urls = GAME_URLS;
		this.max_url_length = Math.min(...Object.values(this.urls).map(x => x.length));
	})();
}

const config = window.patch_config;

const new_url = prompt("Enter URL to use for GAME_NAME");
if(!new_url) throw "No URL given; no changes have been made";
if(new_url.length > config.max_url_length) throw `Input URL is too long: it cannot be greater than ${config.max_url_length} characters`;

const replace_urls_with = Uint8Array.fromAsciiString(new_url);

//remove original URLS
for(const x of Object.values(config.urls)) {
	elf.bytes.fill(0x00, x.index, x.index + x.length);
}

//set new URL
for(const x of Object.values(config.urls)) {
	elf.bytes.set(replace_urls_with, x.index);
}