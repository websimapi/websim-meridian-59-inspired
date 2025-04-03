// This service will handle all image generation and management
// We're keeping this separate to maintain a clean architecture

export class ImageService {
  constructor() {
    this.imageCache = [];
    this.imageDescription = '';
    this.maxImages = 5;
    this.isGenerating = false;
  }

  async analyzeReferenceImage(referenceImageUrl) {
    try {
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Describe this Meridian 59 game image in detail. Focus on the medieval fantasy aesthetic, the room interior with its stone walls, the magical elements like the glowing potion, and the owl. Describe the castle visible through the window and the overall mystical atmosphere. Your description will be used to generate similar fantasy RPG scenes, so include rich details about colors, lighting, and the magical medieval setting."
              },
              {
                type: "image_url",
                image_url: { url: referenceImageUrl }
              }
            ]
          }
        ]
      });
      
      this.imageDescription = completion.content;
      return this.imageDescription;
    } catch (error) {
      console.error("Error analyzing reference image:", error);
      throw error;
    }
  }

  async generateImage(seed = Math.floor(Math.random() * 100)) {
    if (this.isGenerating) return null;
    if (this.imageCache.length >= this.maxImages) {
      return null;
    }
    
    this.isGenerating = true;
    
    try {
      const result = await websim.imageGen({
        prompt: `Create a nostalgic 90s style fantasy RPG game scene similar to Meridian 59 based on this description: ${this.imageDescription}. Use a pixelated or early 3D rendering style with rich colors and magical elements. Include medieval fantasy elements, stone interiors, magical items, and a mystical atmosphere.`,
        width: 640,
        height: 480,
        seed: seed
      });
      
      this.imageCache.push(result.url);
      this.isGenerating = false;
      return result.url;
    } catch (error) {
      console.error("Error generating image:", error);
      this.isGenerating = false;
      throw error;
    }
  }
  
  getImageCache() {
    return this.imageCache;
  }
  
  hasMaxImages() {
    return this.imageCache.length >= this.maxImages;
  }
}