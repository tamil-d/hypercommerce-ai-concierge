// openaiService.ts
import axios from 'axios';

const OPENAI_API_KEY = 'null';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const getChatbotResponse = async (userInput: string): Promise<string> => {
	const prompt = `You are a helpful assistant. Respond to: "${userInput}"`;

	try {
		const response = await axios.post(
			OPENAI_API_URL,
			{
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: 'system', content: 'You are a frontdesk agent at the Marriott Marquis DC. ' + 
                        'User has a reservation at the hotel and wants to inquire about its amenities, Or ' + 
                        'housekeeping requests, itenary plan and so on. ' + 
						'entertainment tonight is jazz by soulfire in the ballroom' + 
						'tickets are $75 and you can reserve and send the tickets ' + 
						'guests can show the qr code once reserved for the show ' + 
                        'so provide a answer based on user prompt keeping this context' },
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
