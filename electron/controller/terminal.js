const {Controller} = require("ee-core");
const {exec} = require("child_process");
const Ps = require('ee-core/ps');
const Log = require('ee-core/log');
const path = require("path");
const fs = require("fs");
const {createInterface} = require("readline");

class TerminalController extends Controller {
    constructor(ctx) {
        super(ctx);
    }

    async command(command) {
        try {
            let output = '1';
            const {stdout} = await exec(Ps.getExtraResourcesDir() + "\\" + command);
            const rl = createInterface({
                input: stdout,
                output: process.stdout,
                terminal: false
            });
            let data = '';
            for await (const line of rl) {
                data += line + '\n';
            }
            return data;
        } catch (error) {
            // 处理错误
            console.error(error);
            return ''; // 或者返回其他默认值
        }
    }


    /**
     * 调用其它程序（exe、bash等可执行程序）
     */
    openSoftware(softName) {
        if (!softName) {
            return false;
        }

        let softwarePath = path.join(Ps.getExtraResourcesDir(), softName);
        Log.info('[openSoftware] softwarePath:', softwarePath);

        // 检查程序是否存在
        if (!fs.existsSync(softwarePath)) {
            return false;
        }

        // 命令行字符串 并 执行
        let cmdStr = 'start ' + softwarePath;
        exec(cmdStr);
        return true;
    }
}

TerminalController.toString = () => '[class TerminalController]';
module.exports = TerminalController;
