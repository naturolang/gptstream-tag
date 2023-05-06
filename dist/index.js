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
Object.defineProperty(exports, "__esModule", { value: true });
exports.gptstream = exports.useModel = void 0;
const openai_1 = require("openai");
var model = 'gpt-3.5-turbo';
const useModel = (str) => model = str;
exports.useModel = useModel;
const openai = new openai_1.OpenAIApi(new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}));
function gptstream(literals, ...args) {
    if (typeof literals === 'string') {
        literals = [literals];
    }
    let content = literals[0];
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg && arg.kind === 'Document') {
            content += arg.loc.source.body;
        }
        else {
            content += arg;
        }
        content += literals[i + 1];
    }
    return (fn) => __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const response = yield openai.createChatCompletion({
                messages: [{
                        role: 'user',
                        content: content,
                    }],
                model: model,
                stream: true,
            }, {
                responseType: 'stream'
            });
            // @ts-expect-error
            response.data.on('data', (data) => {
                var _a, _b, _c;
                const lines = data.toString().split('\n').filter((line) => line.trim() !== '');
                for (const line of lines) {
                    const message = line.replace(/^data: /, '');
                    if (message === '[DONE]') {
                        resolve();
                        return;
                    }
                    const content = (_c = (_b = (_a = JSON.parse(message)) === null || _a === void 0 ? void 0 : _a.choices[0]) === null || _b === void 0 ? void 0 : _b.delta) === null || _c === void 0 ? void 0 : _c.content;
                    if (content) {
                        fn(content);
                    }
                }
            });
        }));
    });
}
exports.gptstream = gptstream;
