function extractLinkInfo() {
    const inputUrl = document.getElementById('inputUrl').value.trim();
    const outputElement = document.getElementById('linkInfo');
    
    if (!inputUrl) {
        outputElement.textContent = "请输入链接！";
        return;
    }

    // 模拟从链接提取信息
    const fileInfo = parseLink(inputUrl);

    if (fileInfo) {
        outputElement.textContent = `
文件名：${fileInfo.name}
文件大小：${fileInfo.size}
上传时间：${fileInfo.uploadTime}
下载链接：${fileInfo.downloadUrl}`;
    } else {
        outputElement.textContent = "无法提取信息，请检查链接格式！";
    }
}

// 模拟解析链接中的信息
function parseLink(url) {
    // 检查链接是否符合特定格式
    if (url.startsWith("https://pan-yz.cldisk.com/external/m/file/")) {
        const urlParams = new URL(url);
        const fileName = urlParams.searchParams.get('name') || '未知文件名';
        
        // 模拟生成文件信息
        return {
            name: decodeURIComponent(fileName),
            size: "23.5 MB", // 示例数据，可以用实际逻辑替换
            uploadTime: "2024-01-01", // 示例数据
            downloadUrl: url
        };
    }

    return null; // 返回null表示无效链接
}
