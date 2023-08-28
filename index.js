"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer = require("puppeteer-extra");
var StealthPlugin = require("puppeteer-extra-plugin-stealth");
var telegramBot = require("node-telegram-bot-api");
require("dotenv").config();
var TELEGRAM_TOKEN_BCV = process.env.TELEGRAM_TOKEN_BCV;
var ID_MARCE = process.env.ID_MARCE;
var ID_JAHN = process.env.ID_JAHN;
var bot_bcv = new telegramBot(TELEGRAM_TOKEN_BCV, { polling: true });
puppeteer.use(StealthPlugin());
var executablePath = require("puppeteer").executablePath;
var url = "https://monitordolarvenezuela.com";
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, page, bcv, monitor, chatIds, currentDate, formattedDate, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer.launch({
                    headless: true,
                    executablePath: executablePath(),
                })];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, page.goto(url)];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.evaluate(function () {
                        var dolar = document.querySelector("#promedios > div > div:nth-child(2) > div:nth-child(2) > div > p");
                        return dolar.textContent.trim();
                    })];
            case 4:
                bcv = _a.sent();
                return [4 /*yield*/, page.evaluate(function () {
                        var monitor = document.querySelector("#promedios > div > div:nth-child(2) > div:nth-child(3) > div > p");
                        return monitor.textContent.trim();
                    })];
            case 5:
                monitor = _a.sent();
                chatIds = [ID_MARCE, ID_JAHN];
                currentDate = new Date();
                formattedDate = currentDate.toLocaleString("es-VE", {
                    timeZone: "America/Caracas",
                });
                message = "Fecha: ".concat(formattedDate, "\n\n  Cambio del dolar a Bs \n\n   \uD83D\uDD35BCV: Bs = ").concat(bcv, " \n\n   \uD83D\uDFE1Monitor: ").concat(monitor);
                chatIds.forEach(function (chatId) {
                    bot_bcv.sendMessage(chatId, message);
                });
                return [4 /*yield*/, browser.close()];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
main().catch(function (err) {
    console.error(err);
    process.exit(1);
});
// Ejecuta la función main cada dos horas (7200000 milisegundos)
setInterval(main, 7200000);
