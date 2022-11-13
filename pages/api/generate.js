import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API,
});

const openai = new OpenAIApi(configuration);

export default async function generate(req, res) {
  const completion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: req.body.character,
    temperature: 0.7,
    max_tokens: 1328,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}
