import type {
  BrainModelOption,
  PlatformOption,
  ReviewStylePreset,
  VideoTypeOption,
  VoiceMoodPreset,
  VoicePreset,
  VoiceSpeedPreset,
} from '../types/app';

export const platforms: PlatformOption[] = [
  { name: 'Instagram / FB', icon: 'Square', ratio: '1:1', label: '1:1' },
  { name: 'TikTok / Reels', icon: 'Smartphone', ratio: '9:16', label: '9:16' },
  { name: 'YouTube', icon: 'Tv', ratio: '16:9', label: '16:9' },
  { name: 'Portrait', icon: 'RectangleVertical', ratio: '3:4', label: '3:4' },
  { name: 'Landscape', icon: 'RectangleHorizontal', ratio: '4:3', label: '4:3' },
];

export const brainModels: BrainModelOption[] = [
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', description: 'Fast & Smart' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3 Pro', description: 'Deep Reasoning' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Classic Efficiency' },
];

export const videoTypes: VideoTypeOption[] = [
  { id: 'grok', name: 'Grok (6-7s)', description: 'Quick cinematic motion' },
  { id: 'flow', name: 'Flow (8-9s)', description: 'Extended cinematic flow' },
];

export const voicePresets: VoicePreset[] = [
  {
    id: 'female-warm-sulafat',
    label: 'ผู้หญิงอบอุ่นปิดการขาย',
    category: 'female',
    voiceName: 'Sulafat',
    description: 'นุ่ม ฟังง่าย ดูน่าเชื่อถือ เหมาะกับรีวิวขายของสายจริงใจ',
    energy: 'Warm',
  },
  {
    id: 'female-bright-autonoe',
    label: 'ผู้หญิงสดใสสายไลฟ์',
    category: 'female',
    voiceName: 'Autonoe',
    description: 'โทนสว่าง คล่องตัว เหมาะกับไลฟ์สดและการเชียร์ตะกร้า',
    energy: 'Bright',
  },
  {
    id: 'male-trust-kore',
    label: 'ผู้ชายน่าเชื่อถือ',
    category: 'male',
    voiceName: 'Kore',
    description: 'น้ำเสียงหนักแน่น ฟังดูมืออาชีพ ใช้กับสินค้าสุขภาพและพรีเมียมได้ดี',
    energy: 'Firm',
  },
  {
    id: 'male-host-gacrux',
    label: 'ผู้ชายพิธีกรขายเก่ง',
    category: 'male',
    voiceName: 'Gacrux',
    description: 'โทนใหญ่ ชัด ฟังดูเหมือนพิธีกรขายของหน้ากล้อง',
    energy: 'Mature',
  },
  {
    id: 'kid-cute-leda',
    label: 'เด็กใสขี้อ้อน',
    category: 'kid',
    voiceName: 'Leda',
    description: 'ฟีลใส น่ารัก ใช้กับสินค้าครอบครัวหรือคอนเทนต์น่าเอ็นดู',
    energy: 'Youthful',
  },
  {
    id: 'kid-playful-aoede',
    label: 'เด็กสนุกสดชื่น',
    category: 'kid',
    voiceName: 'Aoede',
    description: 'โทนพริ้วและเป็นกันเอง เหมาะกับงานน่ารักสนุก ๆ',
    energy: 'Breezy',
  },
  {
    id: 'teen-hype-puck',
    label: 'วัยรุ่นสายไฮป์',
    category: 'teen',
    voiceName: 'Puck',
    description: 'คึกคัก ติดหู เหมาะกับสินค้าวัยรุ่นและสไตล์เร่งเอ็นเกจ',
    energy: 'Upbeat',
  },
  {
    id: 'teen-fun-sadachbia',
    label: 'วัยรุ่นเฮฮา',
    category: 'teen',
    voiceName: 'Sadachbia',
    description: 'สดใสเป็นธรรมชาติ ใช้กับคอนเทนต์สนุกและรีวิวสั้น ๆ ได้ดี',
    energy: 'Lively',
  },
];

export const reviewStyles: ReviewStylePreset[] = [
  {
    id: 'review',
    label: 'รีวิวใช้จริง',
    shortLabel: 'รีวิว',
    description: 'เล่าแบบใช้จริง น่าเชื่อถือ เน้นประสบการณ์และข้อดีชัด ๆ',
    scriptDirection: 'Write the Thai copy like a trustworthy real-user review. Sound natural, persuasive, credible, and easy to believe. Emphasize product experience, texture, visible benefit, and why the viewer should trust the recommendation.',
    sceneDirection: 'Scene prompts should feel like authentic review content with product close-ups, practical usage moments, reaction shots, and believable proof-style framing.',
    deliveryDirection: 'Read in Thai with a trustworthy reviewer tone. Warm, clear, persuasive, not robotic. Keep the pitch natural and easy to trust.',
    previewTemplate: 'วันนี้ขอมารีวิว {product} แบบใช้จริงนะคะ ตัวนี้เด่นมาก ใช้ง่าย เห็นผลไว ใครเล็งอยู่ปักตะกร้าไว้ก่อนเลย',
  },
  {
    id: 'live-sell',
    label: 'ไลฟ์สดปิดการขาย',
    shortLabel: 'ไลฟ์สด',
    description: 'ฟีลแม่ค้าไลฟ์สด พูดไว มีจังหวะชวนกดตะกร้าและสร้างความเร่งด่วน',
    scriptDirection: 'Write the Thai copy like a strong live-selling host. Use fast-paced phrases, clear urgency, basket-click prompts, and energetic transitions that sound native to Thai live commerce.',
    sceneDirection: 'Scene prompts should feel like live commerce with direct-to-camera presentation, hand gestures, quick product show-and-tell, strong CTA framing, and shopping urgency.',
    deliveryDirection: 'Read in Thai like a confident live-selling host. Energetic, fast, sharp, interactive, and exciting without becoming unclear.',
    previewTemplate: 'ทุกคนคะดูนี่ก่อน {product} ตัวนี้กระแสดีมาก ตอนนี้ราคาน่ารักสุด ๆ ใครอยากได้รีบปักตะกร้าก่อนเลยค่ะ',
  },
  {
    id: 'cheer',
    label: 'เชียร์ขายพลังสูง',
    shortLabel: 'เชียร์',
    description: 'เชียร์เก่ง เร้าใจ เหมาะกับคลิปที่ต้องการแรงส่งและความมั่นใจ',
    scriptDirection: 'Write the Thai copy like a high-energy seller cheering the audience into action. Bold, punchy, persuasive, and full of confidence. Strong CTA rhythm is required.',
    sceneDirection: 'Scene prompts should include expressive poses, animated hand movement, stronger camera motion, and visually exciting product hero moments.',
    deliveryDirection: 'Read in Thai with cheering sales energy. Confident, punchy, upbeat, and exciting. Push the CTA clearly and rhythmically.',
    previewTemplate: 'ตัวนี้เชียร์เลยค่ะ {product} ใช้แล้วว้าวจริง งานดีมาก ใครชอบของเด็ดแบบนี้กดตะกร้าแล้วไปต่อกันเลย',
  },
  {
    id: 'excited',
    label: 'ตื่นเต้นเร่งอารมณ์',
    shortLabel: 'ตื่นเต้น',
    description: 'มีความว้าว มีความรีบ มีแรงกระตุ้นให้คนอยากกดซื้อทันที',
    scriptDirection: 'Write the Thai copy with elevated excitement and urgency. Make it feel surprising, hot, and worth grabbing immediately while still sounding natural in Thai.',
    sceneDirection: 'Scene prompts should emphasize speed, dynamic reveals, punch-in shots, dramatic product entrances, and emotional reactions.',
    deliveryDirection: 'Read in Thai with excited momentum. Bright, urgent, dramatic, and emotional. Keep clarity while sounding thrilled.',
    previewTemplate: 'โอ้โห {product} ตัวนี้คือเกินคาดมาก ใช้แล้วชอบทันที ฟีลดีสุด ๆ ใครเห็นคลิปนี้ต้องรีบกดตะกร้าก่อนหมดนะ',
  },
  {
    id: 'fun',
    label: 'สนุกสนานเป็นกันเอง',
    shortLabel: 'สนุก',
    description: 'ฟีลคอนเทนต์เพลิน ๆ ดูง่าย ยิ้มตามได้ แต่ยังขายของเก่ง',
    scriptDirection: 'Write the Thai copy in a fun, charming, entertaining way. Keep it playful and easy to watch while still driving the sale and product understanding.',
    sceneDirection: 'Scene prompts should feel playful and social-first with smiley performance, friendly camera movement, relatable actions, and entertaining product interaction.',
    deliveryDirection: 'Read in Thai with playful fun energy. Charming, lively, friendly, and enjoyable, like a content creator who sells naturally while entertaining.',
    previewTemplate: 'ถ้าใครอยากได้คอนเทนต์ขายของแบบเพลิน ๆ ต้องลอง {product} ตัวนี้เลย ใช้ง่าย ฟีลดี ดูแล้วอยากกดตะกร้าตามทันที',
  },
];

export const voiceSpeedPresets: VoiceSpeedPreset[] = [
  {
    id: 'slow',
    label: 'ช้าชัด',
    description: 'พูดช้าลงเล็กน้อย ชัดถ้อยชัดคำ ฟังง่ายขึ้น',
    ttsDirection: 'Speak slightly slower than normal with crisp articulation and intentional pauses for clarity.',
    scriptDirection: 'Prefer shorter phrases and clear sentence breaks so the Thai narration sounds clean and easy to follow.',
  },
  {
    id: 'balanced',
    label: 'สมดุล',
    description: 'จังหวะพอดี ฟังลื่น เหมาะกับรีวิวส่วนใหญ่',
    ttsDirection: 'Speak at a balanced natural pace, smooth and easy to listen to.',
    scriptDirection: 'Keep the Thai phrasing balanced, smooth, and natural for general social commerce delivery.',
  },
  {
    id: 'fast',
    label: 'เร็วขายของ',
    description: 'สปีดไวขึ้น เหมาะกับไลฟ์สดและคลิปเร่งปิดการขาย',
    ttsDirection: 'Speak faster with energetic cadence while keeping the Thai words understandable and punchy.',
    scriptDirection: 'Use tighter Thai phrasing and momentum-driven wording that still stays clear when spoken quickly.',
  },
];

export const voiceMoodPresets: VoiceMoodPreset[] = [
  {
    id: 'warm',
    label: 'อบอุ่นน่าเชื่อถือ',
    description: 'น้ำเสียงจริงใจ ฟังน่าเชื่อถือ เหมาะกับสายรีวิวและสินค้าสุขภาพ',
    ttsDirection: 'Keep the voice warm, caring, sincere, and trustworthy.',
    scriptDirection: 'Use Thai wording that feels honest, reassuring, and credible.',
    sceneDirection: 'Scenes should feel clean, trustworthy, and confidence-building with warm expressions and believable product interaction.',
  },
  {
    id: 'excited',
    label: 'ตื่นเต้นว้าว',
    description: 'พลังบวกสูง ดูมีความว้าว เหมาะกับคลิปปั้นอารมณ์',
    ttsDirection: 'Keep the voice excited, bright, animated, and emotionally elevated.',
    scriptDirection: 'Use Thai copy that feels enthusiastic, vivid, and high-energy without losing clarity.',
    sceneDirection: 'Scenes should have surprise, delight, expressive reactions, and stronger emotional lift.',
  },
  {
    id: 'urgent',
    label: 'เร่งด่วนปิดการขาย',
    description: 'ฟีลต้องกดตอนนี้ มีแรงเร่งเรื่องราคา โปร หรือของมีจำกัด',
    ttsDirection: 'Keep the voice urgent, persuasive, and conversion-focused with strong call-to-action timing.',
    scriptDirection: 'Use Thai copy with urgency, scarcity cues, and stronger buying momentum.',
    sceneDirection: 'Scenes should create urgency with direct-to-camera CTA, active gestures, and stronger shopping cues.',
  },
  {
    id: 'playful',
    label: 'สนุกเป็นกันเอง',
    description: 'ดูสนุก คุยง่าย เข้าถึงง่าย ฟังแล้วไม่แข็ง',
    ttsDirection: 'Keep the voice playful, friendly, and socially engaging.',
    scriptDirection: 'Use Thai wording that feels casual, charming, and entertaining.',
    sceneDirection: 'Scenes should feel lively, social, and creator-like with smiley expressions and fun interaction.',
  },
  {
    id: 'luxury',
    label: 'พรีเมียมหรู',
    description: 'ฟังพรีเมียม สุขุม ดูแพง เหมาะกับสินค้า high-end',
    ttsDirection: 'Keep the voice polished, premium, elegant, and composed.',
    scriptDirection: 'Use refined Thai wording that feels premium, aspirational, and selective.',
    sceneDirection: 'Scenes should feel elevated and premium with poised performance, elegant styling, and hero product presentation.',
  },
];
