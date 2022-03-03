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
		const element = document.createElement(tag_name);

		_addElementExtensions(element);

		Object.assign(element, attributes);

		_addToSavedElements(element, name);

		return element;
	};

	for(const x of tag_list) this[x] = (attributes, name) => this.create(x, attributes, name);

	this.get = (...names) => {
		const ret = [];
		for(const x of names) {
			ret.push(saved_elements[x]);
		}
		if(names.length === 1) return ret[0];
		return ret;
	};

	this.find = (selector, name = "") => {
		const element = document.querySelector(selector);
		_addElementExtensions(element);
		_addToSavedElements(element, name);
		return element;
	};

	this.findAll = (selector) => {
		const elements = document.querySelectorAll(selector);
		for(const x of elements) _addElementExtensions(x);
		return elements;
	};

	const _addElementExtensions = (element) => {
		if(element === null || element === undefined) return;

		element.original_append = element.append;
		element.append = (...elements) => {
			element.original_append(...elements);
			return element;
		};

		element.show = () => {
			element.style.display = "";
			return element;
		};

		element.hide = () => {
			element.style.display = "none";
			return element;
		};

		element.delete = () => {
			element.outerHTML = "";
			if(element === saved_elements[name]) saved_elements[name] = undefined;
		};
		return element;
	};

	const _addToSavedElements = (element, name = "") => {
		if(name) {
			if(saved_elements[name]) console.warn(`Overwriting element: ${name}`);
			saved_elements[name] = element;
			return true;
		}
		return false;
	};
};

export default new Elements();