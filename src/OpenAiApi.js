import axios from "axios";
import axiosThrottle from "axios-request-throttle";
/**
 * Available models
 * @url https://platform.openai.com/docs/models/overview
 * GPT-4 Limited beta	A set of models that improve on GPT-3.5 and can understand as well as generate natural language or code
 * gpt-3.5-turbo  ChatGPT3, a model trained on a large dataset of human conversations. This model is designed for chat bots and other conversational applications. It is the fastest model in the GPT-3 series, and the lowest cost.
 * text-davinci-003	Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.
 * text-curie-001	Very capable, but faster and lower cost than Davinci.
 * text-babbage-001	Capable of straightforward tasks, very fast, and lower cost.
 * text-ada-001	Capable of very simple tasks, usually the fastest model in the GPT-3 series, and lowest cost.
 * code-davinci-002	Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code.
 * code-cushman-001	Almost as capable as Davinci Codex, but slightly faster. This speed advantage may make it preferable for real-time applications.
 */


axiosThrottle.use(axios, { requestsPerSecond: 5 });

const api = axios.create({
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`,
      "Access-Control-Allow-Origin": "*",
    },
    baseURL: "https://api.openai.com/v1",
    //baseURL: "/api/openai",
  });


  
export const GPT3 = {
    textEngine: "text-davinci-003",
    chatEngine: "gpt-3.5-turbo",
    maxTokens: 2048,
    temperature: 0.7,
    presencePenalty: 0.6,
    frequencyPenalty: 0,
    topP: 1,
    stop: "",
    logTokens: (response) => {
      console.log("🚀 ~ file: GPT3:40 ~ response:", response);
  
      
      if (!response) return;
      if (!response.data) return;
      if (!response.data.usage) return;
  
   
      // publish(CustomEvents.TOKENS_USED, {
      //   date: new Date(),
      //   model: response.data.model,
      //   tokens: tokens,
      // });
      console.log(response.data.model);
    },
    generateText: async (
      prompt,
      temp = GPT3.temperature,
      maxLength = GPT3.maxTokens,
      stops = GPT3.stop
    ) => {
      let params = {
        prompt: prompt,
        model: GPT3.textEngine,
        max_tokens: maxLength,
        temperature: temp,
        top_p: GPT3.topP,
        frequency_penalty: GPT3.frequencyPenalty,
        presence_penalty: GPT3.presencePenalty,
        stop: stops,
      };
  
      const response = await api.post("/completions", params);
  
      GPT3.logTokens(response);
  
      return response.data;
    },
    /**
     * Function to generate a chat response using the OpenAI API and ChatGPT3
     * @param {Array} messages An array of chatGPT message objects. Follows the format of:
     * [
        {“role”: “system”, “content”: “You are a helpful assistant that translates English to French.”},
        {“role”: “user”, “content”: ‘Translate the following English text to French: “{text}”’}
      ]
     * @param {Number} temp How creative to get with responses
     * @param {Int} maxLength The maximum number of tokens to generate
     * @returns {Object} The response from the OpenAI API as an Object. Responses are contained in the choices array.
     */
    generateChat: async (
      messages,
      temp = GPT3.temperature,
      maxLength = GPT3.maxTokens
    ) => {
      let params = {
        model: GPT3.chatEngine,
        messages: messages,
        temperature: temp,
        max_tokens: maxLength,
      };
  
      const response = await api.post("/chat/completions", params);
  
      GPT3.logTokens(response);
  
      return response.data;
    },
  };
  