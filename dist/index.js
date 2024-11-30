"use strict";
// plugin.ts
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var process_1 = __importDefault(require("process"));
var webito_plugin_sdk_1 = __importDefault(require("webito-plugin-sdk"));
var starter = new webito_plugin_sdk_1.default.WebitoPlugin('starter');
starter.registerHook(webito_plugin_sdk_1.default.hooks.delivertypesCalculate, function (_a) {
    var vars = _a.vars, data = _a.data;
    return __awaiter(void 0, void 0, void 0, function () {
        var datainput, baseurl;
        return __generator(this, function (_b) {
            datainput = JSON.stringify({
                'transport_type': 'motor_taxi',
                'addresses': [{
                        'type': 'origin',
                        'lat': data.warehouse.location.lat,
                        'lng': data.warehouse.location.lng,
                    },
                    {
                        'type': 'destination',
                        'lat': data.billing.location.lat,
                        'lng': data.billing.location.lng,
                    },
                ],
                'has_return': false,
                'cashed': false
            });
            baseurl = 'https://api.alopeyk.com/api/v2/';
            axios_1.default.post("".concat(baseurl, "orders/price/calc"), datainput, {
                headers: {
                    'Authorization': 'Bearer ' + vars.token,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                if (response.status == 200)
                    return {
                        status: true,
                        cost: response.data.object.final_price,
                        currency: 'IRT'
                    };
                else
                    return {
                        status: false,
                    };
            })
                .catch(function (error) {
                return {
                    status: false,
                };
            });
            return [2 /*return*/];
        });
    });
});
var runPlugin = function (inputData) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, starter.executeHook(inputData.hook, inputData.data)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
process_1.default.stdin.on('data', function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var msg, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                msg = JSON.parse(input.toString());
                return [4 /*yield*/, runPlugin(msg)];
            case 1:
                result = _a.sent();
                starter.response({ status: result === null || result === void 0 ? void 0 : result.status, data: result === null || result === void 0 ? void 0 : result.data });
                return [2 /*return*/];
        }
    });
}); });
