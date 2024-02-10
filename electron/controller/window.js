const {Controller} = require("ee-core");
const Ps = require('ee-core/ps');
const {app: electronApp} = require("electron");
const Addon = require('ee-core/addon');

class WindowController extends Controller {
    constructor(ctx) {
        super(ctx);
    }

    createWindow(args) {
        const {type, content, windowName, windowTitle} = args;
        let contentUrl = null;
        if (type == 'html') {
            contentUrl = path.join('file://', electronApp.getAppPath(), content)
        } else if (type == 'web') {
            contentUrl = content;
        } else if (type == 'vue') {
            let addr = 'http://localhost:10086'
            if (Ps.isProd()) {
                const mainServer = Conf.getValue('mainServer');
                if (Conf.isFileProtocol(mainServer)) {
                    addr = mainServer.protocol + path.join(Ps.getHomeDir(), mainServer.indexPath);
                } else {
                    addr = mainServer.protocol + mainServer.host + ':' + mainServer.port;
                }
            }

            contentUrl = addr + content;
        } else {
            // some
        }

        console.log('contentUrl: ', contentUrl);
        let opt = {
            title: windowTitle
        }
        const win = Addon.get('window').create(windowName, opt);
        const winContentsId = win.webContents.id;

        // load page
        win.loadURL(contentUrl);

        return winContentsId;
    }


}

WindowController.toString = () => '[class WindowController]';
module.exports = WindowController;
