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

function fetchFileInfo(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            window.fileinfo = data; // 假设服务器返回的数据格式与 fileinfo 相同
            updateFileInfo();
        })
        .catch(error => {
            console.error('获取文件信息失败:', error);
            document.getElementById('linkInfo').textContent = "无法提取信息，请检查链接格式！";
        });
}

function updateFileInfo() {
    const outputElement = document.getElementById('linkInfo');
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

function extractFileInfo() {
    const inputUrl = document.getElementById('inputUrl').value.trim();
    console.log("输入的链接是：", inputUrl);

    if (!inputUrl) {
        document.getElementById('linkInfo').textContent = "请输入链接！";
        return;
    }

    // 调用 fetchFileInfo 以获取数据
    fetchFileInfo(inputUrl);
}

function parseFileInfo() {
    // 确保 fileinfo 是全局变量
    if (!window.fileinfo) {
        console.error("fileinfo 对象未定义");
        return null;
    }

    const name = fileinfo.name;
    const size = (fileinfo.filesize / (1024 * 1024)).toFixed(2) + ' MB'; // 将字节转换为 MB
    const type = fileinfo.suffix;
    const download = fileinfo.download;

    console.log("提取的信息：", { name, size, type, download });

    return {
        name: name,
        size: size,
        type: type,
        download: download
    };
}
