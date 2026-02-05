import { Message, Role } from '../types';

const API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; // Replace with your actual API key
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const SYSTEM_PROMPT = `You are Duoplee, an AI Romance Assistant specialized in helping people with Valentine's Day planning. Your expertise includes:

1. **Gift Recommendations**: Suggest thoughtful, personalized gifts based on the partner's interests, budget, and relationship dynamics
2. **Date Planning**: Create romantic date ideas ranging from intimate home experiences to grand adventures
3. **Love Messages**: Help craft heartfelt messages, love letters, cards, and romantic texts
4. **Relationship Advice**: Provide warm, supportive guidance on expressing love and appreciation

**Your Personality**:
- Warm, romantic, and empathetic
- Creative and detail-oriented
- Respectful of all relationship types and budgets
- Encouraging and positive

**Guidelines**:
- Always ask clarifying questions to personalize suggestions
- Provide specific, actionable recommendations
- Consider budget constraints when mentioned
- Be inclusive of different relationship stages and types
- Use romantic but not overly cheesy language
- Format responses with clear sections using markdown (### for headers, * for bullet points, **bold** for emphasis)

Remember: Every love story is unique. Help make this Valentine's Day special and memorable!`;

export async function sendMessageToGemini(conversationHistory: Message[], userMessage: string): Promise<string> {
  try {
    // Build the conversation context
    const contents = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: 'I understand! I\'m Duoplee, your AI Romance Assistant. I\'m here to help you create the perfect Valentine\'s Day experience. How can I help you today?' }]
      }
    ];

    // Add conversation history
    conversationHistory.forEach(msg => {
      contents.push({
        role: msg.role === Role.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });

    // Make API request
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the response text
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return candidate.content.parts[0].text;
      }
    }

    throw new Error('No response generated');
    
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Fallback response
    return generateFallbackResponse(userMessage);
  }
}

function generateFallbackResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('gift') || lowerMsg.includes('present')) {
    return `### Gift Ideas 🎁

I'd love to help you find the perfect gift! To give you the best recommendations, could you tell me:

* What are your partner's main interests or hobbies?
* What's your budget range?
* Are you looking for something romantic, practical, or experiential?

**Popular Valentine's Gift Categories:**
* **Personalized items**: Custom jewelry, photo albums, engraved items
* **Experiences**: Spa day, cooking class, weekend getaway
* **Classic romance**: Flowers, chocolates, perfume/cologne
* **Tech & gadgets**: Smartwatch, wireless earbuds, e-reader
* **Handmade**: DIY photo book, handwritten letters, custom playlist

Let me know more details and I'll suggest specific options!`;
  }
  
  if (lowerMsg.includes('date') || lowerMsg.includes('dinner') || lowerMsg.includes('restaurant')) {
    return `### Romantic Date Ideas 💕

I can help you plan the perfect date! Here are some ideas to get started:

**Intimate Indoor Dates:**
* **Home-cooked dinner**: Cook their favorite meal together with candles and music
* **Movie marathon**: Create a cozy setup with their favorite films and snacks
* **Game night**: Board games, card games, or video games you both enjoy

**Outdoor Adventures:**
* **Sunset picnic**: Pack favorite foods and watch the sunset together
* **Nature walk**: Hiking trail or botanical garden visit
* **Stargazing**: Find a quiet spot away from city lights

**Special Experiences:**
* **Cooking class**: Learn to make a new cuisine together
* **Wine tasting**: Visit a local winery or create a tasting at home
* **Concert or show**: Live music or theater performance

What type of experience sounds most appealing to you both?`;
  }
  
  if (lowerMsg.includes('letter') || lowerMsg.includes('message') || lowerMsg.includes('write') || lowerMsg.includes('card')) {
    return `### Writing a Love Letter 💌

I'd be happy to help you express your feelings! Here's a structure to get started:

**Opening:**
Start with a warm greeting and set the tone - "My Dearest [Name]" or "To my beloved"

**Share Specific Memories:**
* Mention when you first met or a special moment
* Describe what you love about them specifically
* Share how they've impacted your life

**Express Your Feelings:**
* Be genuine and speak from the heart
* Use "I" statements: "I love how you...", "I appreciate when you..."
* Don't worry about being poetic - authenticity matters most

**Look to the Future:**
* Share your hopes and dreams together
* Express excitement about what's to come

**Closing:**
End with a loving sign-off like "Forever yours" or "All my love"

Would you like me to help you draft specific sections based on your relationship?`;
  }
  
  return `### How Can I Help? 💝

I'm here to assist you with your Valentine's Day planning! I can help with:

* **🎁 Gift Ideas**: Personalized recommendations based on interests and budget
* **🕯️ Date Planning**: Romantic activities from cozy nights in to special outings  
* **💌 Love Messages**: Crafting heartfelt letters, cards, or text messages
* **💐 Relationship Tips**: Advice on expressing love and appreciation

What would you like help with today? Feel free to share details about your situation and I'll provide personalized suggestions!`;
}