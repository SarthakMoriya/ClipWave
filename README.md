# 📲 Clipboard Sync App (React Native + Node.js + Socket.IO)

A mobile-first clipboard synchronization app that allows you to copy text or images from your **laptop** and instantly send them to your **mobile device** using **Socket.IO**. Built using **React Native**, **Redux Toolkit**, and **Expo**, with backend support from a **Node.js server**.

---

## 🔧 Tech Stack

### 🔹 Frontend (Mobile App)
- **React Native** (Expo)
- **React Navigation**
- **Redux Toolkit** (with `react-redux`)
- **@ui-kitten/components** for UI styling
- **Socket.IO Client**
- **AsyncStorage** (for token handling)
- **expo-clipboard** (for accessing clipboard data)

### 🔹 Backend (Laptop/Desktop)
- **Node.js** + **Express**
- **Socket.IO**
- **Electron (optional)** – for clipboard access on desktop
- **clipboardy / robotjs** – for reading clipboard content

---

## 🚀 Features

- 📋 **Clipboard Monitoring (Laptop)**  
  Monitors clipboard for text or images and emits updates through a socket connection.

- 📱 **Clipboard Listener (Mobile)**  
  Listens for clipboard updates and displays received text or image data.

- 🔄 **Real-Time Sync**  
  Uses Socket.IO for real-time two-way communication between devices.

- 🔐 **Authentication Placeholder**  
  Structure in place for login/signup functionality using AsyncStorage (token handling under development).

- 📷 **Image Sync Support**  
  Converts images to Base64 on the laptop and emits them to the phone. Displaying image data on mobile is a work-in-progress.

---

## 🗂️ Folder Structure

root/
│
├── client-mobile/          # React Native mobile app
│   ├── .expo/
│   ├── assets/
│   ├── screens/
│   ├── store/
│   ├── components/         # Suggested: reusable UI components
│   ├── navigation/         # Suggested: navigation config (React Navigation)
│   ├── App.js
│   ├── app.json
│   ├── SocketHandler.js
│   ├── tailwind.config.js
│   └── package.json
│
├── desktop/                # Desktop frontend (Electron?)
│   ├── public/             # Suggested: static assets if applicable
│   ├── src/                # Suggested: organize main code
│   │   └── index.js
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── sockets/
│   ├── utils/              # Suggested: helper functions
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md

## Run on Device
cd client-mobile > npm i > npm run start // for android ios 
cd server > npm i >node server.js // starts backend server + socket
cd desktop > npm i > npm run start // start electron

## ⚠️ Known Issues
On Android, image display is pending

Clipboard polling may result in repeated image emissions

Token-based navigation isn't fully implemented yet

## 🤝 Contributing
Pull requests are welcome! If you’d like to help add features or improve performance, feel free to fork the repo and open a PR.

## 📄 License
This project is licensed under the MIT License.

## 👨‍💻 Author  
Made with ❤️ by **Sarthak Moriya**  
🔗 [LinkedIn](linkedin.com/in/sarthak-moriya-71ab5321b/) | 🌐 [Portfolio](https://sarthakportfoliofs.netlify.app/) | 🐙 [GitHub](https://github.com/SarthakMoriya)

