function convertLinks() {
    const inputText = document.getElementById('inputLinks').value;
    const links = inputText.split('\n');
    const outputElement = document.getElementById('outputLinks');
    
    // 显示加载动画
    showLoading();
    
    // 使用 setTimeout 模拟异步处理
    setTimeout(() => {
        const convertedLinks = links.map(link => {
            link = link.trim();
            if (!link) return ''; // 跳过空行
            const match = link.match(/objectId=([^&]+)/);
            if (match) {
                return `https://sharewh.chaoxing.com/share/download/${match[1]}`;
            } else {
                return `无效链接: ${link}`;
            }
        });

        outputElement.value = convertedLinks.filter(link => link).join('\n');
        
        // 隐藏加载动画
        hideLoading();
    }, 100);
}

function copyOutput() {
    const outputElement = document.getElementById('outputLinks');
    outputElement.select();
    document.execCommand('copy');
    alert('结果已复制！');
}

function showLoading() {
    document.getElementById('loadingIndicator').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

function extractFileInfo() {
    const inputUrl = document.getElementById('inputUrl').value.trim();
    const outputElement = document.getElementById('linkInfo');
    
    console.log("输入的链接是：", inputUrl);

    if (!inputUrl) {
        outputElement.textContent = "请输入链接！";
        return;
    }

    const fileInfo = parseFileInfo(inputUrl);

    if (fileInfo) {
        outputElement.innerHTML = `
文件名：${fileInfo.name}<br>
文件大小：${fileInfo.size}<br>
文件类型：${fileInfo.type}<br>
下载链接：<a href="${fileInfo.download}" target="_blank">点击下载</a>`;
    } else {
        outputElement.textContent = "无法提取信息，请检查链接格式！";
    }
}

function parseFileInfo(url) {
    // 检查链接是否包含 "cldisk.com"
    if (url.includes("cldisk.com")) {
        // 使用正则表达式从链接中提取 objectId 和 name
        const objectIdMatch = url.match(/objectId=([^&]+)/);
        const nameMatch = url.match(/name=([^&]+)/);

        if (objectIdMatch && nameMatch) {
            const objectId = objectIdMatch[1];
            const name = decodeURIComponent(nameMatch[1]);

            return {
                name: name,
                size: "未知大小", // 如果无法从链接中获取大小，可以设置为未知
                type: "未知类型", // 如果无法从链接中获取类型，可以设置为未知
                download: `https://d0.cldisk.com/download/${objectId}`
            };
        }
    }
    return null;
}
