import { Message, Role } from '../types';
import { GEMINI_API_KEY, GEMINI_API_URL } from '../constants';

const SYSTEM_PROMPT = `You are Duoplee, an expert Valentine's Day romantic assistant. Your purpose is to help people create memorable romantic experiences.

Your expertise includes:
- Thoughtful gift recommendations based on interests, budget, and personality
- Creative date ideas for all budgets and preferences
- Help writing heartfelt love letters, messages, and romantic gestures
- Advice on romantic planning and relationship enhancement

Guidelines:
- Be warm, enthusiastic, and genuinely helpful
- Provide specific, actionable suggestions
- Consider budget constraints when mentioned
- Be culturally sensitive and inclusive
- Focus on creating genuine emotional connections
- Use formatting with markdown (headers ###, bold **text**, bullet points *)

Always respond with practical, creative ideas that help people express their love meaningfully.`;

export async function sendMessageToGemini(
  conversationHistory: Message[],
  newMessage: string
): Promise<string> {
  try {
    // Check if API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'AIzaSyACBuXqYCtKiEhR1SC_4y5UHmaGHELqCRQ') {
      // Return a helpful mock response for development/demo
      return generateMockResponse(newMessage);
    }

    // Build conversation context
    const contents = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role === Role.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: newMessage }]
      }
    ];

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
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
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Error:', errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error('Unexpected response format');

  } catch (error) {
    console.error('Gemini API Error:', error);
    // Return helpful mock response on error
    return generateMockResponse(newMessage);
  }
}

// Mock responses for development/demo when API key is not configured
function generateMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Gift suggestions
  if (lowerMessage.includes('gift') || lowerMessage.includes('present')) {
    return `### Perfect Gift Ideas 🎁

Based on your request, here are some thoughtful suggestions:

* **Personalized Photo Album**: Create a custom album with your favorite memories together. Budget-friendly and deeply meaningful.

* **Experience Gift**: Concert tickets, cooking class, or spa day. Experiences create lasting memories.

* **Handmade Gift**: A scrapbook, painted portrait, or handwritten letter collection. Shows effort and thoughtfulness.

* **Tech Gadget**: Wireless earbuds, smartwatch, or portable speaker for the tech enthusiast.

* **Subscription Box**: Monthly delivery of their favorite things - coffee, books, snacks, or self-care items.

**Pro Tip**: The best gifts show you listen and understand what makes them happy. Combine a physical gift with a heartfelt handwritten note for maximum impact!

Would you like more specific suggestions based on their interests or your budget?`;
  }

  // Date ideas
  if (lowerMessage.includes('date') || lowerMessage.includes('romantic')) {
    return `### Romantic Date Ideas 💕

Here are some wonderful options to create special moments:

* **Cozy Home Date**: Cook their favorite meal together, set up candles, create a playlist of "your songs," and have a movie marathon.

* **Sunset Picnic**: Pack a basket with snacks, wine, and a cozy blanket. Find a scenic spot to watch the sunset together.

* **Adventure Date**: Try something new together - rock climbing, pottery class, dance lessons, or exploring a new neighborhood.

* **Nostalgic Date**: Recreate your first date or visit places that hold special memories.

* **Star Gazing**: Drive out of the city, bring blankets and hot chocolate, and spend the evening under the stars.

**Budget Tip**: Romance is about thoughtfulness, not expense. A heartfelt picnic in the park can be more meaningful than an expensive restaurant.

What type of experience does your partner enjoy most?`;
  }

  // Love letter/message help
  if (lowerMessage.includes('letter') || lowerMessage.includes('message') || lowerMessage.includes('write')) {
    return `### Crafting the Perfect Love Message 💌

Here's a framework to express your feelings authentically:

**Opening:**
Start with something specific about them that made you smile recently. Example: "I keep thinking about how you laughed at that terrible joke yesterday..."

**The Heart:**
* Share a specific memory that means a lot to you
* Describe what you love about who they are (not just what they do)
* Explain how they've changed your life for the better

**The Future:**
* Express excitement about experiences you'll share
* Make a small promise or commitment
* End with how they make you feel

**Example Template:**
"Every time I see you [specific action], my heart skips a beat. I love how you [personality trait]. Thank you for [specific thing they did]. I can't wait to [future plan]. You make me feel [emotion]."

**Remember**: Authenticity beats perfection. Write from your heart, and they'll cherish every word.

Would you like help with a specific type of message?`;
  }

  // General relationship advice
  return `### I'm Here to Help! 💝

I'd love to assist you with Valentine's Day planning! I can help with:

* **Gift Ideas**: Personalized suggestions for any budget or interest
* **Date Planning**: Creative ideas from cozy nights to adventurous outings
* **Love Letters**: Help expressing your feelings perfectly
* **Romantic Gestures**: Thoughtful ways to show you care

Tell me more about what you're looking for, and I'll provide specific suggestions tailored to your needs!

What aspect of Valentine's Day planning can I help you with today?`;
}