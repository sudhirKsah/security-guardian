// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

// interface EmotionAnalysisResult {
//   emotion: string;
//   confidence: number;
//   details?: string;
// }

// interface PhishingAnalysisResult {
//   isMalicious: boolean;
//   confidence: number;
//   type?: string;
//   details?: string;
// }

// export async function analyzeAudio(audioUri: string): Promise<EmotionAnalysisResult> {
//   try {
//     const formData = new FormData();
//     formData.append('audio', {
//       uri: audioUri,
//       type: 'audio/m4a',
//       name: 'recording.m4a',
//     });

//     const response = await fetch(`${API_BASE_URL}/analyze/audio`, {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Accept': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to analyze audio');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error analyzing audio:', error);
//     throw error;
//   }
// }

// export async function analyzeSMS(message: string): Promise<PhishingAnalysisResult> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/analyze/sms`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ message }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to analyze SMS');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error analyzing SMS:', error);
//     throw error;
//   }
// }

// export async function analyzeURL(url: string): Promise<PhishingAnalysisResult> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/analyze/url`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ url }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to analyze URL');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error analyzing URL:', error);
//     throw error;
//   }
// }








const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface EmotionAnalysisResult {
  emotion: string;
  confidence: number;
  details?: string;
}

interface PhishingAnalysisResult {
  isMalicious: boolean;
  confidence: number;
  type?: string;
  details?: string;
}

// Rule-based URL checking for common phishing patterns
const checkURLForPhishingPatterns = (url: string): PhishingAnalysisResult => {
  const suspiciousPatterns = [
    /login|signin|verify|account|secure|update|password/i,
    /[^\w\s-]\.[^\w\s-]/, // Suspicious characters in domain
    /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // IP address instead of domain
    /http:\/\/[^https]/, // Non-HTTPS URLs
  ];

  const suspiciousTLDs = ['.xyz', '.top', '.club', '.online', '.site'];

  let isMalicious = false;
  let type = '';
  let details = '';
  let confidence = 0;

  // Check for suspicious patterns
  suspiciousPatterns.forEach((pattern, index) => {
    if (pattern.test(url)) {
      isMalicious = true;
      type = 'phishing';
      details += `Suspicious pattern detected: ${pattern.toString()}. `;
      confidence += 0.2;
    }
  });

  // Check for suspicious TLDs
  suspiciousTLDs.forEach((tld) => {
    if (url.toLowerCase().includes(tld)) {
      isMalicious = true;
      type = 'phishing';
      details += `Suspicious TLD detected: ${tld}. `;
      confidence += 0.15;
    }
  });

  // Check URL length (overly long URLs are often suspicious)
  if (url.length > 100) {
    isMalicious = true;
    type = 'phishing';
    details += 'URL is unusually long. ';
    confidence += 0.1;
  }

  return {
    isMalicious,
    confidence: Math.min(confidence, 0.95),
    type: isMalicious ? type : undefined,
    details: isMalicious ? details : undefined,
  };
};

// Rule-based text checking for SMS/Clipboard content
const checkTextForPhishingPatterns = (text: string): PhishingAnalysisResult => {
  const suspiciousPhrases = [
    /urgent|immediate|action required|verify now|login now|update your/i,
    /win|prize|lottery|free|gift card|reward/i,
    /your account has been|your payment|invoice|billing/i,
    /click here|follow this link|open this/i,
  ];

  let isMalicious = false;
  let type = '';
  let details = '';
  let confidence = 0;

  suspiciousPhrases.forEach((phrase) => {
    if (phrase.test(text)) {
      isMalicious = true;
      type = 'phishing';
      details += `Suspicious phrase detected: ${phrase.toString()}. `;
      confidence += 0.25;
    }
  });

  // Check for URLs in text
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/g;
  const urls = text.match(urlRegex) || [];
  urls.forEach((url) => {
    const urlAnalysis = checkURLForPhishingPatterns(url);
    if (urlAnalysis.isMalicious) {
      isMalicious = true;
      type = urlAnalysis.type || 'phishing';
      details += `Malicious URL detected: ${url}. `;
      confidence += 0.3;
    }
  });

  return {
    isMalicious,
    confidence: Math.min(confidence, 0.95),
    type: isMalicious ? type : undefined,
    details: isMalicious ? details : undefined,
  };
};

// Gemini API analysis for text (SMS or Clipboard content)
const analyzeTextWithGemini = async (text: string): Promise<PhishingAnalysisResult> => {
  try {
    const prompt = `
      Analyze the following text for potential phishing, scam, or malicious intent. Look for deceptive language, urgency, suspicious links, or any patterns that might indicate a scam. Provide a detailed analysis.

      Text: "${text}"

      Respond in JSON format with the following structure:
      {
        "isMalicious": boolean,
        "confidence": number (0 to 1),
        "type": string (optional, e.g., "phishing", "scam"),
        "details": string (optional, explanation of findings)
      }
    `;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze text with Gemini API');
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;

    // Parse the JSON response from Gemini
    const result = JSON.parse(generatedText);

    return {
      isMalicious: result.isMalicious || false,
      confidence: result.confidence || 0,
      type: result.type,
      details: result.details,
    };
  } catch (error) {
    console.error('Error analyzing text with Gemini API:', error);
    return {
      isMalicious: false,
      confidence: 0,
      details: 'Failed to analyze with Gemini API',
    };
  }
};

// Combined analysis for SMS/Clipboard content (rules + Gemini)
export async function analyzeSMS(message: string): Promise<PhishingAnalysisResult> {
  try {
    const ruleBasedResult = checkTextForPhishingPatterns(message);
    const geminiResult = await analyzeTextWithGemini(message);

    // Combine results: take the more severe outcome
    const isMalicious = ruleBasedResult.isMalicious || geminiResult.isMalicious;
    const confidence = Math.max(ruleBasedResult.confidence, geminiResult.confidence);
    const type = geminiResult.type || ruleBasedResult.type;
    const details = `${ruleBasedResult.details || ''}${geminiResult.details || ''}`;

    return {
      isMalicious,
      confidence,
      type: isMalicious ? type : undefined,
      details: isMalicious ? details : undefined,
    };
  } catch (error) {
    console.error('Error analyzing SMS:', error);
    throw error;
  }
}

export async function analyzeURL(url: string): Promise<PhishingAnalysisResult> {
  try {
    const ruleBasedResult = checkURLForPhishingPatterns(url);

    // For URLs, we can also try to fetch the website content and analyze it with Gemini
    let geminiResult: PhishingAnalysisResult = { isMalicious: false, confidence: 0 };
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        const text = await response.text();
        geminiResult = await analyzeTextWithGemini(text.slice(0, 1000)); // Limit to first 1000 chars
      }
    } catch (error) {
      console.warn('Could not fetch URL content for Gemini analysis:', error);
    }

    const isMalicious = ruleBasedResult.isMalicious || geminiResult.isMalicious;
    const confidence = Math.max(ruleBasedResult.confidence, geminiResult.confidence);
    const type = geminiResult.type || ruleBasedResult.type;
    const details = `${ruleBasedResult.details || ''}${geminiResult.details || ''}`;

    return {
      isMalicious,
      confidence,
      type: isMalicious ? type : undefined,
      details: isMalicious ? details : undefined,
    };
  } catch (error) {
    console.error('Error analyzing URL:', error);
    throw error;
  }
}

export async function analyzeAudio(audioUri: string): Promise<EmotionAnalysisResult> {
  try {
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    });

    const response = await fetch(`${API_BASE_URL}/analyze/audio`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to analyze audio');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing audio:', error);
    throw error;
  }
}