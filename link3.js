function convertLinks() {
    const inputText = document.getElementById('inputLinks').value;
    const links = inputText.split('\n');
    const convertedLinks = links.map(link => {
        const match = link.match(/objectId=([^&]+)/);
        return match ? `https://sharewh.chaoxing.com/share/download/${match[1]}` : link;
    });
    document.getElementById('outputLinks').value = convertedLinks.join('\n');
}

function copyOutput() {
    const outputText = document.getElementById('outputLinks');
    outputText.select();
    document.execCommand('copy');
    alert('结果已复制到剪贴板');
}