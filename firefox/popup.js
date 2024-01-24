var port = browser.runtime.connect({
    name: "Sample Communication"
});

function loaded() {
    port.postMessage("get-stuff");
    port.onMessage.addListener(function(msg) {
        console.log("message received yea: ", msg);
        browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            selectedId = tabs[0].id;
            listListeners(msg.listeners[selectedId]);
        });
    });
}

document.addEventListener('DOMContentLoaded', loaded);

function highlightString(text) {
    // Highlight and make the matched string bold
    return '<b style="color: red;">' + text + '</b>';
}

function listListeners(listeners) {
    var x = document.getElementById('x');
    x.parentElement.removeChild(x);
    x = document.createElement('ol');
    x.id = 'x';
    //console.log(listeners);
    document.getElementById('h').innerText = listeners.length ? listeners[0].parent_url : '';

    for (var i = 0; i < listeners.length; i++) {
        listener = listeners[i]
        el = document.createElement('li');

        bel = document.createElement('b');
        bel.innerText = listener.domain + ' ';
        win = document.createElement('code');
        win.innerText = ' ' + (listener.window ? listener.window + ' ' : '') + (listener.hops && listener.hops.length ? listener.hops : '');
        el.appendChild(bel);
        el.appendChild(win);

        sel = document.createElement('span');
        if (listener.fullstack) sel.setAttribute('title', listener.fullstack.join("\n\n"));
        seltxt = document.createTextNode(listener.stack);

        sel.appendChild(seltxt);
        el.appendChild(sel);

        pel = document.createElement('pre');
        // Highlight and make the matched strings bold
        var listenerText = listener.listener.replace(/(eval\()|(\.indexOf\()|(\.startsWith\()|(\.endsWith\()|(location\.href)|(\.url)|(\.source)|(\"\*\")|(\'\*\')|(\.search\()|(document\.write)|(\.innerHTML)|(\.includes\()|(\.match\()|(window\.origin)/g,
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
