const os = require('os');

module.exports = function getIPAddresses() {
    const interfaces = os.networkInterfaces();
    const ipAddresses = [];

    Object.keys(interfaces, (key) => {
        const addresses = interfaces[key];
        for (let i = 0; i < addresses.length; i++) {
            const addressInfo = addresses[i];

            if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    });

    return ipAddresses;
};
