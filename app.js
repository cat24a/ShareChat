
// code from internet

// by revolunet

// LZW-compress a string
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}

// end code from internet


const chatbox = document.querySelector("chatbox");
const message_template = document.querySelector("#message");


function addMessage(content, author="system", ontop=false) {
    const message = message_template.content.cloneNode(true);
    message.querySelector("content").innerText = content;
    message.querySelector("author").innerText = author;
    if(ontop) {
        chatbox.insertBefore(message, chatbox.firstChild);
    } else {
        chatbox.appendChild(message);
    }
}

async function loadChat(id) {
    chatbox.innerHTML = "";
    location.hash = id;
    const response = await fetch("api.php", {
        method: "POST",
        body: lzw_encode(JSON.stringify({
            action: "get_latest",
            chat: id,
        })),
    });
    const chat = JSON.parse(lzw_decode(await response.text()));
    chat.messages.forEach(data => {
        const message = JSON.parse(data.content);
        addMessage(message.content, message.author);
    })
}