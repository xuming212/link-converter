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

    showLoading();

    try {
        let fileInfo;
        
        if (inputUrl.includes('pan-yz.cldisk.com')) {
            try {
                // 使用 URL 对象解析链接
                const url = new URL(inputUrl);
                const encodedFileName = url.searchParams.get('name');
                const fileId = url.pathname.split('/').pop();
                
                if (!encodedFileName || !fileId) {
                    throw new Error("无效的文件链接");
                }

                const fileName = decodeURIComponent(encodedFileName);
                const fileExtension = fileName.split('.').pop().toUpperCase();

                fileInfo = {
                    name: fileName,
                    type: fileExtension,
                    // 使用原始链接作为下载链接
                    download: inputUrl
                };
            } catch (e) {
                throw new Error("无效的文件链接格式");
            }
        } else if (inputUrl.includes('chaoxing.com')) {
            const match = inputUrl.match(/objectId=([^&]+)/);
            if (!match) {
                throw new Error("无法识别的超星链接格式");
            }

            const objectId = match[1];
            fileInfo = {
                name: '超星文件',
                type: '未知',
                download: `https://sharewh.chaoxing.com/share/download/${objectId}`
            };
        } else {
            throw new Error("不支持的链接格式");
        }

        // 构建显示内容
        let displayContent = `
            <div class="file-info">
                <p><strong>文件名：</strong>${fileInfo.name}</p>
                <p><strong>文件类型：</strong>${fileInfo.type}</p>
                <p><strong>下载链接：</strong><a href="${fileInfo.download}" target="_blank" class="download-link">点击下载</a></p>
            </div>`;

        outputElement.innerHTML = displayContent;

    } catch (error) {
        console.error("处理链接时出错：", error);
        outputElement.textContent = error.message || "处理链接时发生错误！";
    } finally {
        hideLoading();
    }
}
