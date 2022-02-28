"use strict";

//https://developer.mozilla.org/en-US/docs/Web/HTML/Element
//console.log(Array.from($0.querySelectorAll('tr > td:first-child')).map(x => `"${x.innerText.slice(1,-1)}",`).join("\n"));
const tag_list = [
	//main root
	"html",
	//document metadata
	"base",
	"head",
	"link",
	"meta",
	"style",
	"title",
	//sectioning root
	"body",
	//content sectioning
	"address",
	"article",
	"aside",
	"footer",
	"header",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"main",
	"nav",
	"section",
	//text content
	"blockquote",
	"dd",
	"div",
	"dl",
	"dt",
	"figcaption",
	"figure",
	"hr",
	"li",
	"menu",
	"ol",
	"p",
	"pre",
	"ul",
	//inline text semantics
	"a",
	"abbr",
	"b",
	"bdi",
	"bdo",
	"br",
	"cite",
	"code",
	"data",
	"dfn",
	"em",
	"i",
	"kbd",
	"mark",
	"q",
	"rp",
	"rt",
	"ruby",
	"s",
	"samp",
	"small",
	"span",
	"strong",
	"sub",
	"sup",
	"time",
	"u",
	"var",
	"wbr",
	//image and multimedia
	"area",
	"audio",
	"img",
	"map",
	"track",
	"video",
	//embedded content
	"embed",
	"iframe",
	"object",
	"param",
	"picture",
	"portal",
	"source",
	//svg and mathml
	"svg",
	"math",
	//scripting
	"canvas",
	"noscript",
	"script",
	//Demarcating edits
	"del",
	"ins",
	//Table content
	"caption",
	"col",
	"colgroup",
	"table",
	"tbody",
	"td",
	"tfoot",
	"th",
	"thead",
	"tr",
	//Forms
	"button",
	"datalist",
	"fieldset",
	"form",
	"input",
	"label",
	"legend",
	"meter",
	"optgroup",
	"option",
	"output",
	"progress",
	"select",
	"textarea",
	//Interactive Elements
	"details",
	"dialog",
	"summary",
	//Web Components
	"slot",
	"template"
];

export function Elements() {
	const saved_elements = {};

	this.create = (tag_name = "span", attributes = {}, name = "") => {
		const tag = document.createElement(tag_name);

		tag.original_append = tag.append;
		tag.append = (...elements) => {
			tag.original_append(...elements);
			return tag;
		}

		tag.delete = () => {
			tag.outerHTML = "";
			if(tag === saved_elements[name]) saved_elements[name] = undefined;
		}

		if(name) {
			if(saved_elements[name]) console.warn(`Overwriting element: ${name}`);
			saved_elements[name] = tag;
		}

		return Object.assign(tag, attributes);
	};

	for(const x of tag_list) this[x] = (attributes, name) => this.create(x, attributes, name);

	this.get = (name = "") => saved_elements[name];
};

export default new Elements();