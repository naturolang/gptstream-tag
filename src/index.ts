import { Configuration, OpenAIApi } from 'openai';

var model = 'gpt-3.5-turbo'

export const useModel = (str: string) => model = str

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}))

export function gptstream(
  literals: string | readonly string[],
  ...args: any[]
): any {
  if (typeof literals === 'string') {
    literals = [literals]
  }
  let content = literals[0]
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg && arg.kind === 'Document') {
      content += arg.loc.source.body
    } else {
      content += arg
    }
    content += literals[i + 1]
  }
  return async (fn: Function) => await new Promise<void>(async (resolve, reject) => {
    const response = await openai.createChatCompletion({
      messages: [{
        role: 'user',
        content: content,
      }],
      model: model,
      stream: true,
    }, {
      responseType: 'stream'
    })
    // @ts-expect-error
    response.data.on('data', (data) => {
      const lines = data.toString().split('\n').filter((line: string) => line.trim() !== '')
      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          resolve()
          return
        }
        const content = JSON.parse(message)?.choices[0]?.delta?.content
        if (content) {
          fn(content)
        }
      }
    })
  })
}
