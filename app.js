import { createApp } from 'vue';
import { ImageService } from './imageService.js';

const app = createApp({
  data() {
    return {
      referenceImage: '/a/352d378d-57db-46b4-946c-0dc36e4becfd',
      currentImage: null,
      imageIndex: 0,
      timerInterval: 7000, // 7 seconds
      timer: null,
      imageService: new ImageService()
    };
  },
  mounted() {
    this.initializeImages();
  },
  methods: {
    async initializeImages() {
      try {
        // Analyze the reference image
        await this.imageService.analyzeReferenceImage(this.referenceImage);
        
        // Generate the first image
        const imageUrl = await this.imageService.generateImage(1);
        if (imageUrl) {
          this.currentImage = imageUrl;
          this.startImageCycleTimer();
        }
      } catch (error) {
        console.error("Error initializing images:", error);
      }
    },
    
    async cycleOrGenerateImage() {
      if (this.imageService.hasMaxImages()) {
        // Just cycle through existing images
        const imageCache = this.imageService.getImageCache();
        this.imageIndex = (this.imageIndex + 1) % imageCache.length;
        this.currentImage = imageCache[this.imageIndex];
      } else {
        // Generate a new image
        const nextSeed = this.imageService.getImageCache().length + 1;
        const imageUrl = await this.imageService.generateImage(nextSeed);
        if (imageUrl) {
          this.currentImage = imageUrl;
          this.imageIndex = this.imageService.getImageCache().length - 1;
        }
      }
    },
    
    startImageCycleTimer() {
      this.timer = setInterval(() => {
        this.cycleOrGenerateImage();
      }, this.timerInterval);
    },
    
    handleLogin() {
      // In the future, this will handle the login process
      alert("Login functionality will be implemented in future updates!");
    }
  }
});

app.mount('#app');