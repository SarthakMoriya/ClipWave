const { ipcRenderer } = require("electron");

const feed = document.getElementById("feed");
const status = document.getElementById("status");

// 🔹 STATUS
ipcRenderer.on("status", (_, data) => {
  if (data === "connected") {
    status.innerText = "🟢 Connected";
  } else {
    status.innerText = "🔴 Disconnected";
  }
});

// 🔹 ACTIVITY FEED
ipcRenderer.on("activity", (_, item) => {
  const div = document.createElement("div");
  div.className = "item";

  if (item.type === "text") {
    div.innerText = "📋 " + item.data;
  }

  if (item.type === "image") {
    div.innerHTML = `<img src="${item.data}" width="150"/>`;
  }

  if (item.type === "file") {
    div.innerText = "📦 " + item.fileName;
    div.id = item.fileName; // for progress update
  }

  if (item.type === "url") {
    div.innerText = "🔗 " + item.data;
  }

  if (item.type === "apk") {
    div.innerText = "📦 " + item.fileName;
    div.id = item.fileName; // for progress update
  }

  if (item.type === "apk-chunk") {
    div.innerText = "📦 " + item.fileName;
    div.id = item.fileName; // for progress update
  }

  if (item.type === "apk-complete") {
    div.innerText = "📦 " + item.fileName;
    div.id = item.fileName; // for progress update
  }

  if (item.type === "device-info") {
    div.innerText = "📱 " + item.data.deviceName + " - " + item.data.modelName;
  }

  feed.prepend(div);
});

// 🔹 DEVICE LIST
ipcRenderer.on("device-list", (_, devices) => {
  const list = document.getElementById("deviceList");
  list.innerHTML = "";
  console.log(devices);
  devices.data.forEach((device) => {
    const div = document.createElement("div");
    div.className = "device-item";
    div.innerHTML = `
            <span class="device-name">${device.deviceName}</span>
            <span class="device-status">${device.modelName}</span>
        `;
    list.appendChild(div);
  });
});

// 🔹 PROGRESS UPDATE
ipcRenderer.on("progress", (_, data) => {
  const el = document.getElementById(data.fileName);
  if (el) {
    el.innerText = `📦 ${data.fileName} (${data.progress}%)`;
  }
});
