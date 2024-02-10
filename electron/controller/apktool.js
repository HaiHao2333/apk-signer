const {Controller} = require("ee-core");
const Ps = require('ee-core/ps');
const {exec} = require("child_process");
const path = require('path');
const {createInterface} = require("readline");
const fs = require("fs");
const {readSettingsConfig} = require("../components/settings_config");


class ApkToolController extends Controller {
    constructor(ctx) {
        super(ctx);
    }

    async signer(fileName) {

        // const {
        //     keyPath: keyPath,
        //     keyAlias: keyAlias,
        //     keystorePassword: keystorePassword,
        //     keyPassword: keyPassword,
        //     apkPath: apkPath,
        //     newApkName: newApkName
        // }
        const storageDir = Ps.getStorageDir();
        const resourcesDir = Ps.getExtraResourcesDir();

        // 读取 JSON 文件路径
        let keyFileName = null;

        const data = readSettingsConfig();
        let jsonObject = null
        try {
            // 将 JSON 数据解析为 JavaScript 对象
            jsonObject = JSON.parse(data);
            keyFileName = jsonObject.keyFileName;


            // 在这里你可以使用 jsonObject 对象
            console.log('read JSON config success:', jsonObject);
        } catch (error) {
            console.error('read JSON  config fail:', error);
        }

        if (keyFileName == null) {
            return "not config"
        }
        console.log("keyFileName:", keyFileName)


        const apkPath = storageDir + "\\" + fileName;
        const keyAlias = jsonObject.keyAlias
        const keyPath = storageDir + "\\" + keyFileName;
        const keystorePassword = jsonObject.storePassword
        const keyPassword = jsonObject.keyPassword;
        const newApkName = "newApk.apk"


        const apksigner = resourcesDir + "\\" + "apksigner"


        const cmd = apksigner +
            " sign --ks " + keyPath
            + " --ks-key-alias " + keyAlias +
            " --ks-pass pass:" + keystorePassword +
            " --key-pass pass:" + keyPassword +
            " --out " + storageDir + "\\" + newApkName + " " + apkPath;

        console.log("signer cmd:", cmd)

        const result = await this.command(cmd);
        console.log("signer result:", result)
        // 返回新的APK名称
        return newApkName;
    }


    async verify(apkName) {
        const storageDir = Ps.getStorageDir();
        const apksigner = Ps.getExtraResourcesDir() + "\\" + "apksigner"
        const cmd = apksigner + " verify -v " + storageDir + "\\" + apkName
        console.log("verify cmd:", cmd)
        const result = await this.command(cmd);
        console.log("verify result :", result);

        return result;
    }

    async command(command) {
        try {
            let output = ''; // 初始化为空字符串
            const {stdout, stderr} = await exec(command);

            // 处理标准输出
            const stdoutRl = createInterface({
                input: stdout,
                output: process.stdout,
                terminal: false
            });
            for await (const line of stdoutRl) {
                output += line + '\n'; // 将每行输出都追加到 output 变量中
                process.stdout.write(line + '\n'); // 打印每行输出到控制台
            }

            // // 处理标准错误输出
            // const stderrRl = createInterface({
            //     input: stderr,
            //     output: process.stderr,
            //     terminal: false
            // });
            //
            // if (stderrRl != null) {
            //     for await (const line of stderrRl) {
            //         output += line + '\n'; // 将每行错误输出都追加到 output 变量中
            //         process.stderr.write(line + '\n'); // 打印每行错误输出到控制台
            //     }
            // }

            return output;
        } catch (error) {
            // 处理错误
            console.error(error);
            return ''; // 或者返回其他默认值
        }
    }
}

ApkToolController.toString = () => '[class ApkToolController]';
module.exports = ApkToolController;
