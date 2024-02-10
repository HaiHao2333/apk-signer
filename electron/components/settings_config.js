const Ps = require("ee-core/ps");
const path = require("path");
const fs = require("fs");


function readSettingsConfig() {
    const storageDir = Ps.getStorageDir();

    const jsonFilePath = path.join(storageDir, 'config.json');

    // 读取 JSON 文件
    return  fs.readFileSync(jsonFilePath, 'utf8');
}

module.exports = {
    readSettingsConfig: readSettingsConfig,

}
