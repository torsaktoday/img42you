import { GoogleGenAI } from '@google/genai';
import { addWavHeader } from '../utils/audio';
import type {
  CinematicPrompts,
  ReferenceImage,
  SalesReview,
  VeoModel,
  VideoType,
} from '../types/app';

interface VideoPlanParams {
  apiKey: string;
  brainModel: string;
  prompt: string;
  aspectRatio: string;
  platformName?: string;
  videoType: VideoType;
}

interface VideoRenderParams {
  apiKey: string;
  veoModel: VeoModel;
  prompt: string;
  imageDataUrl: string;
  aspectRatio: string;
}

interface SceneImageParams {
  apiKey: string;
  prompt: string;
  imagePrompt: string;
  aspectRatio: string;
  masterImage: string | null;
  referenceImages: ReferenceImage[];
}

function createClient(apiKey: string) {
  return new GoogleGenAI({ apiKey });
}

function getImageParts(referenceImages: ReferenceImage[]) {
  return referenceImages.map((image) => ({
    inlineData: {
      data: image.data,
      mimeType: image.mimeType,
    },
  }));
}

function extractImageUrl(response: any) {
  const parts = response.candidates?.[0]?.content?.parts ?? [];

  for (const part of parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
    }
  }

  throw new Error('No image was returned by the model. Please try a different prompt.');
}

function getDataUrlParts(dataUrl: string) {
  const [mimePart, dataPart] = dataUrl.split(',');
  const mimeType = mimePart.match(/:(.*?);/)?.[1] || 'image/png';

  return { mimeType, data: dataPart };
}

export async function generateMarketingImage(params: {
  apiKey: string;
  prompt: string;
  referenceImages: ReferenceImage[];
  aspectRatio: string;
}) {
  const ai = createClient(params.apiKey);
  const parts = getImageParts(params.referenceImages);

  parts.push({
    text: `Generate a high-quality marketing image for: ${params.prompt}. 
    
    PRODUCT INSTRUCTION:
    - The product must be the central focus, shown with extreme clarity.
    - The product label, text, and branding must be 100% accurate and legible (e.g., "Naturel Extra Virgin Olive Oil").
    - Match the bottle shape, colors, and design from the reference images exactly.
    
    CHARACTER INSTRUCTION:
    - The character's face must match the reference image exactly.
    - Ensure the character is holding or interacting with the product naturally.
    
    STYLE INSTRUCTION:
    - Professional studio lighting or high-end lifestyle photography.
    - Clean background that doesn't distract from the product.
    - ABSOLUTELY NO watermarks, NO text overlays, NO logos (except product label), and NO UI elements.`,
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: params.aspectRatio,
      },
    },
  });

  return extractImageUrl(response);
}

export async function enhanceIdeaPrompt(params: {
  apiKey: string;
  brainModel: string;
  prompt: string;
}) {
  const ai = createClient(params.apiKey);
  const response = await ai.models.generateContent({
    model: params.brainModel,
    contents: `You are an expert AI image prompt engineer. Take the following short idea and expand it into a highly detailed, descriptive, and visually rich prompt suitable for an AI image generator. Include details about lighting, style, composition, and mood. Return ONLY the enhanced prompt text, without any conversational filler or quotes.\n\nIdea: ${params.prompt}`,
  });

  if (!response.text) {
    throw new Error('Failed to enhance prompt.');
  }

  return response.text.trim();
}

export async function generateCinematicPrompts(params: VideoPlanParams): Promise<CinematicPrompts> {
  const ai = createClient(params.apiKey);
  const response = await ai.models.generateContent({
    model: params.brainModel,
    contents: `You are a professional film director and scriptwriter. 
    Create a cinematic video script and motion description optimized for ${params.platformName} (${params.aspectRatio}).
    The duration should be ${params.videoType === 'grok' ? '6-7' : '8-9'} seconds.
    
    Original Idea: "${params.prompt}"
    
    Requirements:
    1. Script: A powerful, natural spoken script (max 20 words) that fits the platform's style.
    2. Motion Prompt: A technical, high-quality description for AI video generators (Grok/Flow/Veo). Include camera angles (Close-up, Wide, etc.), specific movements (Dolly, Pan), lighting (Cinematic, Moody), and subject action.
    
    Return the result in JSON format:
    {
      "script": "The spoken text",
      "motion": "The technical motion prompt"
    }`,
    config: { responseMimeType: 'application/json' },
  });

  const data = JSON.parse(response.text || '{}');
  return {
    script: data.script || '',
    motion: data.motion || '',
  };
}

export async function generateVideoPlan(params: VideoPlanParams) {
  const ai = createClient(params.apiKey);
  const response = await ai.models.generateContent({
    model: params.brainModel,
    contents: `Based on this image prompt: "${params.prompt}", create a cinematic video script and motion description.
    The video is for ${params.platformName} with aspect ratio ${params.aspectRatio}.
    The duration is ${params.videoType === 'grok' ? '6-7' : '8-9'} seconds.
    
    Requirements:
    - A short, impactful spoken script (max 20 words).
    - A detailed cinematic motion description for the AI video generator (camera movement, subject action, lighting changes).
    - Ensure it follows professional cinematography principles.
    
    Return the result in JSON format:
    {
      "script": "The spoken text",
      "motion_prompt": "The description for the video generator"
    }`,
    config: { responseMimeType: 'application/json' },
  });

  const data = JSON.parse(response.text || '{}');
  return {
    script: data.script || '',
    motionPrompt: data.motion_prompt || '',
  };
}

export async function generateSpeechAudio(params: {
  apiKey: string;
  script: string;
  voiceName: string;
  deliveryDirection?: string;
}) {
  const ai = createClient(params.apiKey);
  const speechPrompt = [
    'Read the following Thai script naturally.',
    params.deliveryDirection || 'Use a natural Thai speaking style.',
    'Keep the wording exactly as written in the SCRIPT block.',
    '',
    'SCRIPT:',
    params.script,
  ].join('\n');

  const ttsResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: [{ parts: [{ text: speechPrompt }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: params.voiceName },
        },
      },
    },
  });

  const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!base64Audio) {
    throw new Error('Failed to generate audio.');
  }

  const audioUrl = addWavHeader(base64Audio);

  if (!audioUrl) {
    throw new Error('Failed to process audio data.');
  }

  return audioUrl;
}

export async function generateVideoFromImage(params: VideoRenderParams) {
  const ai = createClient(params.apiKey);
  const { data, mimeType } = getDataUrlParts(params.imageDataUrl);

  let operation = await ai.models.generateVideos({
    model: params.veoModel === 'fast' ? 'veo-3.1-fast-generate-preview' : 'veo-3.1-generate-preview',
    prompt: params.prompt,
    image: {
      imageBytes: data,
      mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: params.veoModel === 'fast' ? '720p' : '1080p',
      aspectRatio: params.aspectRatio as any,
    },
  });

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

  if (!downloadLink) {
    throw new Error('Failed to generate video link.');
  }

  const videoResponse = await fetch(downloadLink, {
    method: 'GET',
    headers: {
      'x-goog-api-key': params.apiKey,
    },
  });

  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
}

export async function generateSalesReview(params: {
  apiKey: string;
  brainModel: string;
  prompt: string;
  aspectRatio: string;
  platformName?: string;
  referenceImages: ReferenceImage[];
  voiceLabel: string;
  voiceEnergy: string;
  deliveryProfile: string;
  styleDescription: string;
  scriptDirection: string;
  sceneDirection: string;
  deliveryDirection: string;
}): Promise<SalesReview> {
  const ai = createClient(params.apiKey);
  const parts = getImageParts(params.referenceImages);

  parts.push({
    text: `You are a world-class Thai marketing expert and video creator specializing in "TikTok Shop" and "Affiliate Marketing" style reviews. 
    
    STEP 1: Use Google Search to research the product shown in the reference images and described as "${params.prompt}". 
    Identify the exact brand (e.g., Naturel), the product type (e.g., Extra Virgin Olive Oil), its key benefits, ingredients, and how it is typically used in Thai cooking or health contexts.
    
    STEP 2: Create a high-converting sales script in Thai based on your research.
    The target platform is ${params.platformName} (${params.aspectRatio}).
    The total duration should be between 45 - 90 seconds.
    
    CREATIVE DIRECTION:
    - Seller voice persona: ${params.voiceLabel}
    - Voice energy: ${params.voiceEnergy}
    - Delivery profile: ${params.deliveryProfile}
    - Style description: ${params.styleDescription}
    - Script direction: ${params.scriptDirection}
    - Scene direction: ${params.sceneDirection}
    - Spoken delivery direction: ${params.deliveryDirection}
    - The narration must sound excellent when spoken out loud in Thai with this selected voice persona and delivery profile.
    
    Requirements for the script:
    - Use persuasive, energetic, and natural Thai language (Expert level).
    - Include emotional triggers and clear benefits discovered in your research.
    - Structure the script with these 4 parts:
      1. HOOK: Stop the scroll in 3 seconds.
      2. PAIN POINT: Deeply empathize with the user's problem.
      3. SOLUTION: How this product solves it perfectly. Highlight unique features.
      4. CALL TO ACTION: Urgency to click the basket/link.
    - The copy must match the selected selling style, speaking speed, mood, and performance energy.
    
    Also, provide 6 cinematic scene descriptions. For each scene, provide:
    - description: Motion Prompt for video generation (camera movement, action). Make sure the motion and performance reflect the chosen selling style and mood.
    - imagePrompt: A high-quality, detailed prompt for generating a static image. 
      CRITICAL: Describe the product with extreme detail (labels, colors, bottle shape) based on your research. 
      Ensure the character's appearance (face) is consistent with the reference image.
      Describe the clothing clearly (e.g., "wearing a clean white t-shirt") to maintain consistency.
      The image must be clean with NO watermarks, NO text, and NO logos except the product label.
      The pose, facial expression, and styling must reflect the chosen style direction and emotional tone.
    - narration: The specific Thai dialogue/narration for this exact scene.
    
    Return the result in JSON format:
    {
      "hook": "Thai hook text",
      "painPoint": "Thai pain point text",
      "solution": "Thai solution text",
      "cta": "Thai CTA text",
      "fullScript": "The complete narration script in Thai",
      "scenes": [
        { "description": "...", "imagePrompt": "...", "narration": "..." }
      ]
    }`,
  });

  const response = await ai.models.generateContent({
    model: params.brainModel,
    contents: { parts },
    config: {
      responseMimeType: 'application/json',
      tools: [{ googleSearch: {} }],
    },
  });

  const data = JSON.parse(response.text || '{}');
  return {
    script: data.fullScript || '',
    hook: data.hook || '',
    painPoint: data.painPoint || '',
    solution: data.solution || '',
    cta: data.cta || '',
    scenes: data.scenes || [],
  };
}

export async function generateConsistentSceneImage(params: SceneImageParams) {
  const ai = createClient(params.apiKey);
  const parts: Array<Record<string, unknown>> = [];

  if (params.masterImage) {
    const { data, mimeType } = getDataUrlParts(params.masterImage);
    parts.push({
      inlineData: {
        data,
        mimeType,
      },
    });
  } else {
    parts.push(...getImageParts(params.referenceImages));
  }

  parts.push({
    text: `CRITICAL INSTRUCTION: The provided reference image is the GENERATED MASTER IMAGE. 
    You MUST maintain 100% consistency with this MASTER IMAGE for the character's FACE, BODY SIZE, and EXACT CLOTHING.
    
    1. CHARACTER & COMPOSITION CONSISTENCY:
       - Match the FACE exactly as seen in the MASTER IMAGE.
       - Match the BODY SIZE, PROPORTIONS, and FRAMING (how much of the body is visible in the frame) exactly as seen in the MASTER IMAGE.
       - Maintain the EXACT SAME ASPECT RATIO and composition style as the MASTER IMAGE.
    
    2. CLOTHING CONSISTENCY (ABSOLUTE REQUIREMENT):
       - You MUST use the EXACT SAME CLOTHING (color, fabric, style, fit) seen in the MASTER IMAGE.
       - If she is wearing a pink shirt and denim shorts in the MASTER IMAGE, she MUST wear that exact same outfit in this scene.
       - DO NOT look at any other reference images; ONLY use the MASTER IMAGE for clothing and appearance.
    
    3. PRODUCT CONSISTENCY:
       - Match the product (bottle, label, size) exactly as seen in the MASTER IMAGE.
    
    4. SCENE VARIATION:
       - Change ONLY the background environment and the character's pose/action to match the Scene Description below.
       - The lighting style should remain consistent with the MASTER IMAGE.
    
    Scene Description: ${params.imagePrompt}
    
    Original Master Prompt for context: ${params.prompt}`,
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: params.aspectRatio as any,
      },
    },
  });

  return extractImageUrl(response);
}
