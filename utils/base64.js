// utils/base64.js
const fs = require('fs');

function encodeBase64(filePath) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        return fileBuffer.toString('base64');
    } catch (error) {
        throw new Error('Error encoding file to base64: ' + error.message);
    }
}

function decodeBase64(base64String, outputPath) {
    try {
        const fileBuffer = Buffer.from(base64String, 'base64');
        fs.writeFileSync(outputPath, fileBuffer);
    } catch (error) {
        throw new Error('Error decoding base64 string: ' + error.message);
    }
}

module.exports = {
    encodeBase64,
    decodeBase64,
};
