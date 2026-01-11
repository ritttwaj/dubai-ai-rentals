// services/aiService.ts

import { Property, ChatMessage } from '../types';

const SAMBANOVA_API_KEY = '6b4a7c9b-c0ba-4bff-a8f3-8f392613b5f8';
const API_URL = 'https://api.sambanova.ai/v1/chat/completions';
const MODEL = 'Meta-Llama-3.1-8B-Instruct'; // Fast and good quality

export const getPropertyResponse = async (
  property: Property,
  userQuestion: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> => {
  try {
    const systemPrompt = `You are a helpful AI assistant for a Dubai rental property platform.

Property Details:
- Title: ${property.title}
- Area: ${property.area}
- Building: ${property.building}
- Price: AED ${property.price.toLocaleString()}/year
- Payment: ${property.cheques} cheque(s)
- Property Type: ${property.propertyType}
- Bedrooms: ${property.bedrooms || 'Studio'}
- Bathrooms: ${property.bathrooms}
- Size: ${property.sqft} sqft
- Furnishing: ${property.furnishing}
- Floor: ${property.floor === 0 ? 'Ground Floor' : `Floor ${property.floor}`}
- View: ${property.viewType}
- Parking: ${property.parking} space(s)
- Maintenance: ${property.maintenance}
- Amenities: ${property.amenities.join(', ')}
- Move-in Date: ${property.moveInDate}
- Description: ${property.description}
- Summary: ${property.aiSummary}

Instructions:
- Provide helpful, accurate, concise answers about this property
- If information is not available, politely say so and suggest contacting the landlord
- Be friendly and professional
- Use specific property details when answering
- Keep responses under 100 words unless more detail is needed
- Focus on Dubai rental market context`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: userQuestion
      }
    ];

    console.log('Sending request to SambaNova...');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SAMBANOVA_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('SambaNova API Error:', errorData);
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    console.log('SambaNova response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from SambaNova');
    }
    
    return data.choices[0].message.content;

  } catch (error: any) {
    console.error('AI Service Error:', error);
    
    if (error.message.includes('API key')) {
      throw new Error('Invalid API key. Please check your SambaNova configuration.');
    }
    
    if (error.message.includes('quota') || error.message.includes('rate limit')) {
      throw new Error('API rate limit reached. Please try again in a moment.');
    }
    
    throw new Error('Sorry, I encountered an error. Please try again.');
  }
};

export const getSuggestedQuestions = (property: Property): string[] => {
  const questions = [
    "What's included in maintenance?",
    `How far is ${property.building} from metro?`,
    "Is it available for immediate move-in?",
    "Can I schedule a viewing?",
    `Tell me about living in ${property.area}`,
    "Are pets allowed?",
    "What are the payment terms?",
    "What amenities are nearby?",
    "Is parking included?",
    "Can I negotiate the price?"
  ];

  return questions.sort(() => 0.5 - Math.random()).slice(0, 3);
};