const { ipcRenderer } = require("electron");

const feed = document.getElementById("feed");
const status = document.getElementById("status");

// 🔹 STATUS
ipcRenderer.on("status", (_, data) => {
    if (data === "connected") {
        status.innerText = "🟢 Connected";
        status.style.color = "#10B981";
    } else {
        status.innerText = "🔴 Disconnected";
        status.style.color = "#EF4444";
    }
});

// 🔹 ACTIVITY FEED
ipcRenderer.on("activity", (_, item) => {
    const div = document.createElement("div");
    div.className = "item";

    let headerText = "ACTIVITY";
    let contentHtml = "";

    if (item.type === "text") {
        headerText = "TEXT CLIPBOARD";
        contentHtml = `<div class="item-content">${item.data}</div>`;
    } else if (item.type === "image") {
        headerText = "IMAGE CLIPBOARD";
        contentHtml = `<img src="${item.data}" />`;
    } else if (item.type === "url") {
        headerText = "LINK";
        contentHtml = `<div class="item-content"><a href="${item.data}" style="color: #F59E0B">${item.data}</a></div>`;
    } else if (item.type === "apk" || item.type === "apk-complete") {
        headerText = "FILE";
        contentHtml = `
            <div class="item-file" id="${item.fileName}">
                <span class="file-icon">📦</span>
                <div class="file-info">
                    <span class="file-name">${item.fileName}</span>
                </div>
            </div>
        `;
    } else if (item.type === "new-file") {
        headerText = "SHARED CONTENT";
        const isImage = item.data.mimeType && item.data.mimeType.startsWith("image/");
        const isVideo = item.data.mimeType && item.data.mimeType.startsWith("video/");
        
        if (isImage) {
            contentHtml = `
                <div class="item-content">Shared an image:</div>
                <img src="${item.data.url}" />
                <div style="margin-top: 8px"><a href="${item.data.url}" class="file-action">Open Original</a></div>
            `;
        } else {
            contentHtml = `
                <div class="item-file">
                    <span class="file-icon">${isVideo ? "🎥" : "📄"}</span>
                    <div class="file-info">
                        <span class="file-name">${item.data.name}</span>
                        <a href="${item.data.url}" target="_blank" class="file-action">Download File</a>
                    </div>
                </div>
            `;
        }
    }

    div.innerHTML = `
        <div class="item-header">${headerText}</div>
        ${contentHtml}
    `;

    feed.prepend(div);
});

// 🔹 DEVICE LIST
ipcRenderer.on("device-list", (_, devices) => {
    const list = document.getElementById("deviceList");
    list.innerHTML = "";
    devices.data.forEach((device) => {
        const div = document.createElement("div");
        div.className = "device-item";
        div.innerHTML = `
            <div class="device-avatar">${device.deviceName.charAt(0)}</div>
            <div class="device-info">
                <span class="device-name">${device.deviceName}</span>
                <span class="device-status">${device.modelName}</span>
            </div>
        `;
        list.appendChild(div);
    });
});

// 🔹 PROGRESS UPDATE
ipcRenderer.on("progress", (_, data) => {
    const el = document.getElementById(data.fileName);
    if (el) {
        const nameEl = el.querySelector(".file-name");
        if (nameEl) {
            nameEl.innerText = `${data.fileName} (${data.progress}%)`;
        }
    }
});

// 🔹 SEND FILE BUTTON
document.getElementById("sendFileBtn").addEventListener("click", () => {
    ipcRenderer.send("open-file-dialog");
});
