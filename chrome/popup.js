var port = chrome.extension.connect({
	name: "Sample Communication"
});

const highlightedWords = [
	".add(",
	".after(",
	".ajax(",
	".animate(",
	".append(",
	".assign",
	".attribute",
	".backgroundImage",
	".before(",
	".constructor(",
	".cssText",
	".eval(",
	".execCommand(",
	".execScript(",
	".has(",
	".hostname",
	".html(",
	".index(",
    ".indexOf(",
	".init(",
	".innerText",
	".innerHTML",
	".insertAdjacentHTML",
	".insertAfter(",
	".insertBefore(",
	".open(",
	".onevent(",
	".outerText",
	".outerHtml",
	".parseHTML(",
	".pathname",
	".prepend(",
	".protocol",
	".replace",
	".replaceAll(",
	".replaceWith(",
	".send(",
	".setAttribute(",
	".setImmediate(",
	".setInterval(",
	".setTimeout(",
	".wrap(",
	".wrapAll(",
	".wrapInner(",
	".write(",
	".writeln(",
    ".startsWith(",
    ".endsWith(",
    ".location.href",
    ".location.source",
    ".location.url",
    ".window.origin",
    ".match(",
    ".origin",
];


function loaded() {
	port.postMessage("get-stuff");
	port.onMessage.addListener(function(msg) {
		console.log("message recieved yea: ", msg);
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			selectedId = tabs[0].id;
			listListeners(msg.listeners[selectedId]);
		});
	});
}

function htmlEncode(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function highlightString(text) {
    // Highlight and make the matched string bold
    return '<b style="color: red;">' + text + '</b>';
}

window.onload = loaded
//addEventListener('DOMContentLoaded', loaded);

function listListeners(listeners) {
	var x = document.getElementById('x');
	x.parentElement.removeChild(x);
	x = document.createElement('ol');
	x.id = 'x';
	//console.log(listeners);
	document.getElementById('h').innerText = listeners.length ? listeners[0].parent_url : '';

	for(var i = 0; i < listeners.length; i++) {
		listener = listeners[i]
		el = document.createElement('li');

		bel = document.createElement	('b');
		bel.innerText = listener.domain + ' ';
		win = document.createElement('code');
		win.innerText = ' ' + (listener.window ? listener.window + ' ' : '') + (listener.hops && listener.hops.length ? listener.hops : '');
		el.appendChild(bel);
		el.appendChild(win);

		sel = document.createElement('span');
		if(listener.fullstack) sel.setAttribute('title', listener.fullstack.join("\n\n"));
		seltxt = document.createTextNode(listener.stack);
		
		sel.appendChild(seltxt);
		el.appendChild(sel);

		pel = document.createElement('pre');
		// Highlight and make the matched strings bold

		const regexString = highlightedWords.map(word => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
        var listenerText = htmlEncode(listener.listener).replace(new RegExp(regexString),
            function(match) {
                return highlightString(match);
            });

		pel.innerHTML = listenerText;
		el.appendChild(pel);

		x.appendChild(el);
	}
	document.getElementById('content').appendChild(x);
	/*setTimeout(function() {
		document.body.style.display = 'block';
	}, 150);*/
}