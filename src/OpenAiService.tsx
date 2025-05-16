// openaiService.ts
import axios from 'axios';

const OPENAI_API_KEY = 'sk-proj-Pf6KCYilYLt1QH-2lH4vUkymeMVgn4MDTXeNhsQep9WsEdBFes2K'+
'-2vp6V9gkRTUVYhNjKFvRCT3BlbkFJBTPC-us2nLwbDjRvD1BCWhgGzSPR2X6l4UtH-'+
'SngwJGZ6CQQCl-HDafUtENZmH4lPbSFMPSI8A'; // Replace with your actual key
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const getChatbotResponse = async (userInput: string): Promise<string> => {
	const prompt = `You are a helpful assistant. Respond to: "${userInput}"`;

	try {
		const response = await axios.post(
			OPENAI_API_URL,
			{
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: 'system', content: 'You are a helpful assistant.' },
					{ role: 'user', content: prompt }
				],
				temperature: 0.7,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${OPENAI_API_KEY}`,
				},
			}
		);

		const message = response.data.choices[0].message.content.trim();
		return message;
	} catch (error) {
		console.error('OpenAI API error:', error);
		return 'Sorry, I had trouble processing your request.';
	}
};
