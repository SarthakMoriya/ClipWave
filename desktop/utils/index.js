const os = require("os");
const path = require("path");

const getIP = () => {
  const interfaces = os.networkInterfaces();
  const address = [];
  for (const key in interfaces) {
    interfaces[key].forEach((item) => {
      if (item.family === "IPv4") {
        address.push(item.address);
      }
    });
  }
  return address;
};
const getIp = async () => {
  const res = await getIP();
  const ip = res[0];
  return ip;
};

module.exports = { getIp };
