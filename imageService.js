// This service will handle all image generation and management
// We're keeping this separate to maintain a clean architecture

export class ImageService {
  constructor() {
    this.imageCache = [];
    this.currentDescription = '';
  }

  async analyzeImage(imageUrl) {
    try {
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Describe this Meridian 59 game image in detail. Focus on the medieval fantasy aesthetic, colors, and atmosphere."
              },
              {
                type: "image_url",
                image_url: { url: imageUrl }
              }
            ]
          }
        ]
      });
      
      this.currentDescription = completion.content;
      return this.currentDescription;
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw new Error("Failed to analyze image");
    }
  }

  async generateImage(seed = Math.floor(Math.random() * 100)) {
    if (!this.currentDescription) {
      throw new Error("No image description available");
    }

    try {
      const result = await websim.imageGen({
        prompt: `Create a nostalgic 90s style fantasy RPG game scene similar to Meridian 59 based on this description: ${this.currentDescription}. Use a pixelated or early 3D rendering style with rich colors and magical elements.`,
        width: 640,
        height: 480,
        seed: seed
      });
      
      return result.url;
    } catch (error) {
      console.error("Error generating image:", error);
      throw new Error("Failed to generate image");
    }
  }
}

