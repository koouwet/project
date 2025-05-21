import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { config } from './config.js';

export async function aiMsg(text){
    const { api_key, proxy, system_prompt } = config;
    const sourceText = system_prompt + "\n\n" + text;
    const agent = new HttpsProxyAgent(proxy);
    let answer = '❌ Ошибка связи с сервером'
  
    const data = {
        contents: [
        {
            role: 'user',
            parts: [{ text: sourceText }]
        }]
    };
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + api_key,
        data,
        {
          httpsAgent: agent,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      answer = response.data.candidates[0]?.content?.parts[0]?.text;
    } catch (error) {
      console.error(error.response?.data);
    }
    return answer;
  }