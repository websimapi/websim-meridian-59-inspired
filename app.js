import { createApp } from 'vue';

const app = createApp({
  data() {
    return {
      referenceImage: '/a/352d378d-57db-46b4-946c-0dc36e4becfd',
      currentImage: null,
      imageDescription: '',
      generatedImages: [],
      imageIndex: 0,
      maxImages: 5,
      timerInterval: 7000, // 7 seconds
      timer: null,
      isGenerating: false
    };
  },
  mounted() {
    this.analyzeReferenceImage();
  },
  methods: {
    async analyzeReferenceImage() {
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
                  image_url: { url: this.referenceImage }
                }
              ]
            }
          ]
        });

        this.imageDescription = completion.content;
        console.log("Image description:", this.imageDescription);
        this.generateFirstImage();
      } catch (error) {
        console.error("Error analyzing reference image:", error);
      }
    },
    
    async generateNewImage() {
      if (this.isGenerating) return;
      
      // If we already have the maximum number of images, just cycle through them
      if (this.generatedImages.length >= this.maxImages) {
        this.cycleToNextImage();
        return;
      }
      
      this.isGenerating = true;
      
      try {
        const result = await websim.imageGen({
          prompt: `Create a nostalgic 90s style fantasy RPG game scene similar to Meridian 59 based on this description: ${this.imageDescription}. Use a pixelated or early 3D rendering style with rich colors and magical elements. Include medieval fantasy elements, stone interiors, magical items, and a mystical atmosphere.`,
          width: 640,
          height: 480,
          seed: this.generatedImages.length + 1 // Use different seeds for variety
        });
        
        this.generatedImages.push(result.url);
        this.currentImage = result.url;
        this.imageIndex = this.generatedImages.length - 1;
        
        console.log(`Generated image ${this.generatedImages.length} of ${this.maxImages}`);
        
        // Start timer if this is the first image
        if (this.generatedImages.length === 1 && !this.timer) {
          this.startImageCycleTimer();
        }
      } catch (error) {
        console.error("Error generating image:", error);
      } finally {
        this.isGenerating = false;
      }
    },
    
    generateFirstImage() {
      this.generateNewImage();
    },
    
    cycleToNextImage() {
      this.imageIndex = (this.imageIndex + 1) % this.generatedImages.length;
      this.currentImage = this.generatedImages[this.imageIndex];
    },
    
    startImageCycleTimer() {
      this.timer = setInterval(() => {
        if (this.generatedImages.length < this.maxImages) {
          this.generateNewImage();
        } else {
          this.cycleToNextImage();
        }
      }, this.timerInterval);
    },
    
    handleLogin() {
      // In the future, this will handle the login process
      alert("Login functionality will be implemented in future updates!");
    }
  }
});

app.mount('#app');

