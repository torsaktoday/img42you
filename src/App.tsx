import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import {
  platforms,
  reviewStyles,
  voiceMoodPresets,
  voicePresets,
  voiceSpeedPresets,
} from './constants/app';
import { AppHeader } from './components/AppHeader';
import { CinematicPromptsPanel } from './components/CinematicPromptsPanel';
import { ControlPanel } from './components/ControlPanel';
import { ImageLightbox } from './components/ImageLightbox';
import { OutputPanel } from './components/OutputPanel';
import { ReviewVoiceStylePanel } from './components/ReviewVoiceStylePanel';
import { SalesReviewPanel } from './components/SalesReviewPanel';
import { SettingsModal } from './components/SettingsModal';
import {
  enhanceIdeaPrompt,
  generateCinematicPrompts,
  generateConsistentSceneImage,
  generateMarketingImage,
  generateSalesReview,
  generateSpeechAudio,
  generateVideoFromImage,
  generateVideoPlan,
} from './services/gemini';
import type {
  CinematicPrompts,
  ReferenceImage,
  SalesReview,
  VeoModel,
  VideoType,
  VoiceCategory,
  VoiceMood,
  VoiceSpeed,
} from './types/app';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<VideoType>('grok');
  const [cinematicPrompts, setCinematicPrompts] = useState<CinematicPrompts | null>(null);
  const [salesReview, setSalesReview] = useState<SalesReview | null>(null);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [isGeneratingReview, setIsGeneratingReview] = useState(false);
  const [isGeneratingReviewAudio, setIsGeneratingReviewAudio] = useState(false);
  const [reviewAudioUrl, setReviewAudioUrl] = useState<string | null>(null);
  const [isGeneratingSceneVideo, setIsGeneratingSceneVideo] = useState<number | null>(null);
  const [isGeneratingSceneImage, setIsGeneratingSceneImage] = useState<number | null>(null);
  const [sceneVideoUrls, setSceneVideoUrls] = useState<Record<number, string>>({});
  const [sceneImageUrls, setSceneImageUrls] = useState<Record<number, string>>({});
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [veoModel, setVeoModel] = useState<VeoModel>('fast');
  const [brainModel, setBrainModel] = useState('gemini-3-flash-preview');
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [selectedVoiceCategory, setSelectedVoiceCategory] = useState<VoiceCategory>('female');
  const [selectedVoiceId, setSelectedVoiceId] = useState('female-warm-sulafat');
  const [selectedStyleId, setSelectedStyleId] = useState('review');
  const [selectedSpeedId, setSelectedSpeedId] = useState<VoiceSpeed>('balanced');
  const [selectedMoodId, setSelectedMoodId] = useState<VoiceMood>('warm');
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false);
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isEnvironmentKeyAvailable = !!process.env.GEMINI_API_KEY;
  const selectedPlatform = platforms.find((platform) => platform.ratio === aspectRatio);
  const selectedVoice = voicePresets.find((voice) => voice.id === selectedVoiceId) || voicePresets[0];
  const selectedStyle = reviewStyles.find((style) => style.id === selectedStyleId) || reviewStyles[0];
  const selectedSpeed = voiceSpeedPresets.find((speed) => speed.id === selectedSpeedId) || voiceSpeedPresets[1];
  const selectedMood = voiceMoodPresets.find((mood) => mood.id === selectedMoodId) || voiceMoodPresets[0];

  const deliveryDirection = [
    selectedStyle.deliveryDirection,
    selectedSpeed.ttsDirection,
    selectedMood.ttsDirection,
  ].join(' ');

  const reviewScriptDirection = [
    selectedStyle.scriptDirection,
    selectedSpeed.scriptDirection,
    selectedMood.scriptDirection,
  ].join(' ');

  const reviewSceneDirection = [selectedStyle.sceneDirection, selectedMood.sceneDirection].join(' ');
  const deliveryProfile = `${selectedStyle.label} / ${selectedSpeed.label} / ${selectedMood.label}`;

  useEffect(() => {
    if (isEnvironmentKeyAvailable) {
      setApiKey(process.env.GEMINI_API_KEY as string);
      return;
    }

    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setTempApiKey(storedKey);
    } else {
      setIsSettingsOpen(true);
    }
  }, [isEnvironmentKeyAvailable]);

  useEffect(() => {
    return () => {
      if (previewAudioUrl) {
        URL.revokeObjectURL(previewAudioUrl);
      }
    };
  }, [previewAudioUrl]);

  const saveSettings = () => {
    localStorage.setItem('gemini_api_key', tempApiKey);
    setApiKey(tempApiKey);
    setIsSettingsOpen(false);
    if (error?.includes('API Key')) {
      setError(null);
    }
  };

  const clearPreviewAudio = () => {
    if (previewAudioUrl) {
      URL.revokeObjectURL(previewAudioUrl);
    }
    setPreviewAudioUrl(null);
  };

  const buildPreviewScript = () => {
    const product = prompt.trim() || 'สินค้าตัวนี้';
    return selectedStyle.previewTemplate.replace('{product}', product);
  };

  const createReviewAudio = async (script: string) => {
    return generateSpeechAudio({
      apiKey,
      script,
      voiceName: selectedVoice.voiceName,
      deliveryDirection,
    });
  };

  const processFiles = (files: FileList | File[]) => {
    const newImages: ReferenceImage[] = [];
    let processedCount = 0;
    const filesArray = Array.from(files);
    const filesToProcess = filesArray.slice(0, 3 - referenceImages.length);

    if (filesToProcess.length === 0) {
      return;
    }

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        processedCount++;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const mimeType = base64String.split(';')[0].split(':')[1];
        const data = base64String.split(',')[1];
        newImages.push({
          id: Math.random().toString(36).substring(7),
          mimeType,
          data,
          previewUrl: base64String,
        });
        processedCount++;
        if (processedCount === filesToProcess.length) {
          setReferenceImages((prev) => [...prev, ...newImages]);
          setError(null);
        }
      };
      reader.onerror = () => {
        processedCount++;
        setError('Failed to read an image file.');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      processFiles(event.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      processFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = (idToRemove: string) => {
    setReferenceImages((prev) => prev.filter((image) => image.id !== idToRemove));
  };

  const requireApiKey = () => {
    if (apiKey) {
      return true;
    }

    setError('Please configure your Gemini API Key in settings first.');
    setIsSettingsOpen(true);
    return false;
  };

  const handleVoiceCategoryChange = (category: VoiceCategory) => {
    setSelectedVoiceCategory(category);
    const firstVoiceInCategory = voicePresets.find((voice) => voice.category === category);
    if (firstVoiceInCategory) {
      setSelectedVoiceId(firstVoiceInCategory.id);
    }
    clearPreviewAudio();
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    clearPreviewAudio();
  };

  const handleStyleChange = (styleId: string) => {
    setSelectedStyleId(styleId);
    clearPreviewAudio();
  };

  const handleSpeedChange = (speedId: VoiceSpeed) => {
    setSelectedSpeedId(speedId);
    clearPreviewAudio();
  };

  const handleMoodChange = (moodId: VoiceMood) => {
    setSelectedMoodId(moodId);
    clearPreviewAudio();
  };

  const handlePreviewVoice = async () => {
    if (!requireApiKey()) {
      return;
    }

    setIsPreviewingVoice(true);
    setError(null);

    try {
      const audioUrl = await createReviewAudio(buildPreviewScript());
      if (previewAudioUrl) {
        URL.revokeObjectURL(previewAudioUrl);
      }
      setPreviewAudioUrl(audioUrl);
    } catch (err: any) {
      console.error('Voice preview error:', err);
      setError(err.message || 'Failed to preview the selected voice.');
    } finally {
      setIsPreviewingVoice(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!requireApiKey()) {
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await generateMarketingImage({
        apiKey,
        prompt,
        referenceImages,
        aspectRatio,
      });
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!requireApiKey()) {
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a basic idea to enhance.');
      return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
      const enhancedPrompt = await enhanceIdeaPrompt({
        apiKey,
        brainModel,
        prompt,
      });
      setPrompt(enhancedPrompt);
    } catch (err: any) {
      console.error('Enhance error:', err);
      setError(err.message || 'Failed to enhance prompt. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!requireApiKey()) {
      return;
    }

    if (!generatedImage) {
      setError('Please generate an image first.');
      return;
    }

    if (window.aistudio?.hasSelectedApiKey) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey?.();
      }
    }

    setIsGeneratingVideo(true);
    setError(null);
    setGeneratedVideoUrl(null);
    setGeneratedAudioUrl(null);

    try {
      const { script, motionPrompt } = await generateVideoPlan({
        apiKey,
        brainModel,
        prompt,
        aspectRatio,
        platformName: selectedPlatform?.name,
        videoType,
      });

      const audioUrl = await createReviewAudio(script);
      setGeneratedAudioUrl(audioUrl);

      const videoUrl = await generateVideoFromImage({
        apiKey,
        veoModel,
        prompt: motionPrompt,
        imageDataUrl: generatedImage,
        aspectRatio,
      });
      setGeneratedVideoUrl(videoUrl);
    } catch (err: any) {
      console.error('Video generation error:', err);
      setError(err.message || 'Failed to generate video. Please try again.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleGeneratePromptsOnly = async () => {
    if (!requireApiKey()) {
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt first.');
      return;
    }

    setIsGeneratingPrompts(true);
    setError(null);

    try {
      const prompts = await generateCinematicPrompts({
        apiKey,
        brainModel,
        prompt,
        aspectRatio,
        platformName: selectedPlatform?.name,
        videoType,
      });
      setCinematicPrompts(prompts);
    } catch (err: any) {
      console.error('Prompt generation error:', err);
      setError(err.message || 'Failed to generate cinematic prompts.');
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  const handleGenerateSalesReview = async () => {
    if (!requireApiKey()) {
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a product description or idea first.');
      return;
    }

    setIsGeneratingReview(true);
    setError(null);
    setSalesReview(null);
    setReviewAudioUrl(null);
    setSceneVideoUrls({});
    setSceneImageUrls({});

    try {
      const review = await generateSalesReview({
        apiKey,
        brainModel,
        prompt,
        aspectRatio,
        platformName: selectedPlatform?.name,
        referenceImages,
        voiceLabel: selectedVoice.label,
        voiceEnergy: selectedVoice.energy,
        deliveryProfile,
        styleDescription: selectedStyle.description,
        scriptDirection: reviewScriptDirection,
        sceneDirection: reviewSceneDirection,
        deliveryDirection,
      });

      setSalesReview(review);

      if (review.script) {
        setIsGeneratingReviewAudio(true);
        try {
          const audioUrl = await createReviewAudio(review.script);
          setReviewAudioUrl(audioUrl);
        } catch (audioError: any) {
          console.error('Auto review audio error:', audioError);
          setError(audioError.message || 'Thai review created, but auto voice generation failed. You can regenerate the voice below.');
        } finally {
          setIsGeneratingReviewAudio(false);
        }
      }
    } catch (err: any) {
      console.error('Sales review error:', err);
      setError(err.message || 'Failed to generate sales review.');
    } finally {
      setIsGeneratingReview(false);
    }
  };

  const handleGenerateReviewAudio = async () => {
    if (!apiKey || !salesReview) {
      return;
    }

    if (!salesReview.script) {
      setError('No script found to generate audio.');
      return;
    }

    setIsGeneratingReviewAudio(true);
    setError(null);

    try {
      const audioUrl = await createReviewAudio(salesReview.script);
      setReviewAudioUrl(audioUrl);
    } catch (err: any) {
      console.error('Review audio error:', err);
      setError(err.message || 'Failed to generate audio for the review.');
    } finally {
      setIsGeneratingReviewAudio(false);
    }
  };

  const handleGenerateSceneVideo = async (scenePrompt: string, index: number) => {
    const baseImage = sceneImageUrls[index] || generatedImage;
    if (!apiKey || !baseImage) {
      setError('Please generate an image first (either for this scene or the main product image).');
      return;
    }

    setIsGeneratingSceneVideo(index);
    setError(null);

    try {
      const videoUrl = await generateVideoFromImage({
        apiKey,
        veoModel,
        prompt: scenePrompt,
        imageDataUrl: baseImage,
        aspectRatio,
      });
      setSceneVideoUrls((prev) => ({ ...prev, [index]: videoUrl }));
    } catch (err) {
      console.error('Scene video error:', err);
      setError(`Failed to generate video for Scene ${index + 1}.`);
    } finally {
      setIsGeneratingSceneVideo(null);
    }
  };

  const handleGenerateSceneImage = async (imagePrompt: string, index: number) => {
    if (!requireApiKey()) {
      return;
    }

    setIsGeneratingSceneImage(index);
    setError(null);

    try {
      const imageUrl = await generateConsistentSceneImage({
        apiKey,
        prompt,
        imagePrompt,
        aspectRatio,
        masterImage: generatedImage,
        referenceImages,
      });
      setSceneImageUrls((prev) => ({ ...prev, [index]: imageUrl }));
    } catch (err) {
      console.error('Scene image error:', err);
      setError(`Failed to generate image for Scene ${index + 1}.`);
    } finally {
      setIsGeneratingSceneImage(null);
    }
  };

  const handleVideoPlay = () => {
    if (videoRef.current && audioRef.current) {
      videoRef.current.currentTime = 0;
      audioRef.current.currentTime = 0;
      videoRef.current.play();
      audioRef.current.play();
    }
  };

  const handleAspectRatioChange = (ratio: string) => {
    setAspectRatio(ratio);
    setGeneratedImage(null);
    setGeneratedVideoUrl(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-50 font-sans selection:bg-indigo-500/30">
      <AppHeader
        showSettingsButton={!isEnvironmentKeyAvailable}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <ControlPanel
            prompt={prompt}
            onPromptChange={setPrompt}
            onEnhancePrompt={handleEnhancePrompt}
            isEnhancing={isEnhancing}
            brainModel={brainModel}
            onBrainModelChange={setBrainModel}
            aspectRatio={aspectRatio}
            onAspectRatioChange={handleAspectRatioChange}
            videoType={videoType}
            onVideoTypeChange={setVideoType}
            veoModel={veoModel}
            onVeoModelChange={setVeoModel}
            referenceImages={referenceImages}
            fileInputRef={fileInputRef}
            onImageUpload={handleImageUpload}
            onImageDrop={handleDrop}
            onImageDragOver={handleDragOver}
            onRemoveImage={removeImage}
            error={error}
            isGenerating={isGenerating}
            isGeneratingVideo={isGeneratingVideo}
            isGeneratingPrompts={isGeneratingPrompts}
            isGeneratingReview={isGeneratingReview}
            hasGeneratedImage={!!generatedImage}
            onGenerateImage={handleGenerateImage}
            onGeneratePrompts={handleGeneratePromptsOnly}
            onGenerateSalesReview={handleGenerateSalesReview}
            onGenerateVideo={handleGenerateVideo}
            reviewVoiceStyleSlot={
              <ReviewVoiceStylePanel
                selectedCategory={selectedVoiceCategory}
                selectedVoiceId={selectedVoiceId}
                selectedStyleId={selectedStyleId}
                selectedSpeedId={selectedSpeedId}
                selectedMoodId={selectedMoodId}
                isPreviewingVoice={isPreviewingVoice}
                previewAudioUrl={previewAudioUrl}
                onCategoryChange={handleVoiceCategoryChange}
                onVoiceChange={handleVoiceChange}
                onStyleChange={handleStyleChange}
                onSpeedChange={handleSpeedChange}
                onMoodChange={handleMoodChange}
                onPreviewVoice={handlePreviewVoice}
              />
            }
          />

          <SalesReviewPanel
            salesReview={salesReview}
            reviewAudioUrl={reviewAudioUrl}
            isGeneratingReviewAudio={isGeneratingReviewAudio}
            isGeneratingSceneVideo={isGeneratingSceneVideo}
            isGeneratingSceneImage={isGeneratingSceneImage}
            sceneVideoUrls={sceneVideoUrls}
            sceneImageUrls={sceneImageUrls}
            aspectRatio={aspectRatio}
            generatedImage={generatedImage}
            onClose={() => setSalesReview(null)}
            onGenerateReviewAudio={handleGenerateReviewAudio}
            onGenerateSceneImage={handleGenerateSceneImage}
            onGenerateSceneVideo={handleGenerateSceneVideo}
            onExpandImage={setExpandedImage}
          />

          <CinematicPromptsPanel
            cinematicPrompts={cinematicPrompts}
            onClose={() => setCinematicPrompts(null)}
          />
        </aside>

        <div className="lg:col-span-8">
          <OutputPanel
            isGenerating={isGenerating}
            isGeneratingVideo={isGeneratingVideo}
            generatedVideoUrl={generatedVideoUrl}
            generatedAudioUrl={generatedAudioUrl}
            generatedImage={generatedImage}
            audioRef={audioRef}
            videoRef={videoRef}
            onPlayVideo={handleVideoPlay}
          />
        </div>
      </main>

      <ImageLightbox imageUrl={expandedImage} onClose={() => setExpandedImage(null)} />

      <SettingsModal
        isOpen={isSettingsOpen}
        tempApiKey={tempApiKey}
        onTempApiKeyChange={setTempApiKey}
        onClose={() => setIsSettingsOpen(false)}
        onSave={saveSettings}
      />
    </div>
  );
}
