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

async function extractFileInfo() {
    const inputUrl = document.getElementById('inputUrl').value.trim();
    const outputElement = document.getElementById('linkInfo');
    
    console.log("输入的链接是：", inputUrl);

    if (!inputUrl) {
        outputElement.textContent = "请输入链接！";
        return;
    }

    // 显示加载动画
    showLoading();

    try {
        // 从链接中提取 objectId
        const match = inputUrl.match(/objectId=([^&]+)/);
        if (!match) {
            outputElement.textContent = "无法识别的链接格式！";
            hideLoading();
            return;
        }

        const objectId = match[1];
        const apiUrl = `https://sharewh.chaoxing.com/share/info/${objectId}`;

        // 发送请求获取文件信息
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === false) {
            outputElement.textContent = "获取文件信息失败，请检查链接是否有效！";
        } else {
            const fileInfo = {
                name: data.data.name || '未知',
                size: ((data.data.filesize || 0) / (1024 * 1024)).toFixed(2) + ' MB',
                type: data.data.suffix || '未知',
                download: `https://sharewh.chaoxing.com/share/download/${objectId}`
            };

            outputElement.innerHTML = `
文件名：${fileInfo.name}<br>
文件大小：${fileInfo.size}<br>
文件类型：${fileInfo.type}<br>
下载链接：<a href="${fileInfo.download}" target="_blank">点击下载</a>`;
        }
    } catch (error) {
        console.error("获取文件信息时出错：", error);
        outputElement.textContent = "获取文件信息时发生错误，请稍后重试！";
    } finally {
        hideLoading();
    }
}
