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

    const fileInfo = parseFileInfo();

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

function parseFileInfo() {
    // 从页面中提取信息
    const nameElement = document.getElementById('name');
    const sizeElement = document.querySelector('.fileDx');

    if (!nameElement || !sizeElement) {
        console.error("无法找到所需的 DOM 元素");
        return null;
    }

    const name = nameElement.textContent;
    const size = sizeElement.textContent.replace('大小：', '');
    const download = fileinfo.download; // 假设 fileinfo 是全局变量

    console.log("提取的信息：", { name, size, download });

    return {
        name: name,
        size: size,
        type: fileinfo.suffix, // 假设类型是后缀
        download: download
    };
}
