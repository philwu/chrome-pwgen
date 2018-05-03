const btn = document.getElementById('regenerate');
const pwd = document.getElementById('pwd');
const lengthRange = document.getElementById("lengthRange");
const length = document.getElementById("length");
const lower = "abcdefghijklmnopqrstuvwxyz";
const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const num = "1234567890";
const symbol = "~!@#$%^*()_-,.?";
var rule;
chrome.storage.sync.get('rule', function (data) {
    rule = data.rule;
    console.log(rule);
    document.getElementById("lower").checked = rule.lower;
    document.getElementById("upper").checked = rule.upper;
    document.getElementById("num").checked = rule.num;
    document.getElementById("symbol").checked = rule.symbol;
    document.getElementById("lengthRange").value = rule.length;
    document.getElementById("length").value = rule.length;
    reGenerate();
});
btn.onclick = reGenerate;
lengthRange.oninput = function () {
    length.value = this.value
};
lengthRange.addEventListener("change", changeSetting);
length.addEventListener("keyup", (e) => {
    let value = e.target.value;
    if (value > 64)
        value = 64;
    e.target.value = value;
    lengthRange.value = value;
    changeSetting();
});
document.querySelectorAll("input.input-setting").forEach((v) => {
    v.addEventListener("change", changeSetting);
});

function changeSetting() {
    rule.lower = document.getElementById("lower").checked;
    rule.upper = document.getElementById("upper").checked;
    rule.num = document.getElementById("num").checked;
    rule.symbol = document.getElementById("symbol").checked;
    rule.length = document.getElementById("lengthRange").value;
    chrome.storage.sync.set({
        rule: rule
    });
    reGenerate();
}

function reGenerate() {
    const length = document.getElementById("lengthRange").value;
    let result = "";
    let dic = "";
    if (rule.lower) dic += lower;
    if (rule.upper) dic += upper;
    if (rule.num) dic += num;
    if (rule.symbol) dic += symbol;

    while (dic.length > 0 && result.length < length) {
        // let index = Math.floor(Math.random() * (dic.length));
        var array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        let index = array[0] % dic.length;
        result += dic[index];
    }
    pwd.value = result;
    copyTextToClipboard(result);
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}