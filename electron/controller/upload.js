const {Controller, Utils} = require('ee-core');
const fs = require('fs');
const path = require("path");
const {exec} = require("child_process");
const Ps = require('ee-core/ps');
const {dialog} = require('electron');


class UploadController extends Controller {
    constructor(ctx) {
        super(ctx);
    }

    // todo 这里应该支持指定上传文件的目标路径，基于路径存储下的子路径
    async saveFile(fileData) {
        try {
            // 在这里执行文件保存操作，使用 Node.js 的 fs 模块等
            // 示例：将文件从 filePath 复制到 targetPath
            // 注意要进行错误处理
            // 示例代码：(需要引入 fs 模块)
            console.log("fileData ", fileData)

            const {filePath: inputPath, fileName: fileName} = JSON.parse(fileData);

            const targetPath = path.join(Ps.getStorageDir(), fileName);

            await fs.copyFile(inputPath, targetPath, function (err) {
                if (err != null) {
                    console.log("copyFileError:", err);
                }
            });

            return {inputPath, targetPath};
        } catch (error) {
            return {success: false, message: 'Error saving file'};
        }
    }

    async exportFile() {

        const fileContent = fs.readFileSync(Ps.getStorageDir() + "\\newApk.apk", null);


        // 弹出保存文件对话框
        const filePath = dialog.showSaveDialogSync({
            title: 'APK 导出',
            defaultPath: 'newApk.apk',
            filters: [{name: 'Apk Files', extensions: ['apk']}, {name: 'All Files', extensions: ['*']}]
        });
        // 如果用户取消保存，返回
        if (!filePath) {
            console.log('文件取消导出！');
            return;
        }

        // 写入文件
        fs.writeFileSync(filePath, fileContent);

        console.log('文件已成功导出到：', filePath);

    }


}

UploadController.toString = () => '[class UploadController]';
module.exports = UploadController;
