/**
 * 主进程与渲染进程通信频道定义
 * Definition of communication channels between main process and rendering process
 */
const ipcApiRoute = {
    uploadFile: "controller.upload.saveFile",
    exportFile: "controller.upload.exportFile",
    command: "controller.terminal.command",
    signer: "controller.apktool.signer",
    verify: "controller.apktool.verify",
    openSoftware: "controller.terminal.openSoftware",
    createWindow: "controller.window.createWindow",
    saveSettings: "controller.settings.saveSettingsConfig",
    readSettings: "controller.settings.readSettingsConfig"
}


export {
    ipcApiRoute
}
