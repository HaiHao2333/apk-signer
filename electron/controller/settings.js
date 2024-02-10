'use strict';

const {Controller} = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');
const {writeFile} = require("fs");
const path = require("path");
const Ps = require("ee-core/ps");
const {readSettingsConfig} = require("../components/settings_config");

/**
 * example
 * @class
 */
class SettingsController extends Controller {

    constructor(ctx) {
        super(ctx);
    }

    async saveSettingsConfig(configStr) {
        const targetPath = path.join(Ps.getStorageDir(), "config.json");

        writeFile(targetPath, configStr, function (err) {
            if (err) {
                console.error(err);
            }
            console.log('save settings config success!');
        })
    }

    readSettingsConfig() {
        return readSettingsConfig();
    }


}

SettingsController.toString = () => '[class SettingsController]';
module.exports = SettingsController;
