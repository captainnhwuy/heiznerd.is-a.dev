<template>
  <div class="star-trails-container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'StarTrailsAnimation',
  data() {
    return {
      speed: 3.0,
      starCount: 230,
      trailLength: 0.85,
      colorScheme: [
        // Sunset colors
        '#7f1d1d', '#dc2626', '#f97316', '#fbbf24', '#fef3c7',
        // Pink/Magenta
        '#ec4899', '#f472b6', '#fbbf24', '#fb7185',
        // Purple/Violet
        '#9333ea', '#a855f7', '#c084fc', '#d8b4fe',
        // Blue/Cyan
        '#3b82f6', '#60a5fa', '#0ea5e9', '#22d3ee', '#67e8f9',
        // Teal/Green
        '#14b8a6', '#2dd4bf', '#5eead4', '#10b981',
        // Warm orange
        '#ea580c', '#fb923c', '#fdba74'
      ],
      stars: [],
      centerX: 0,
      centerY: 0,
      animationId: null,
      isVisible: true,
      ctx: null,
      canvas: null,
      lastTime: 0
    };
  },
  mounted() {
    this.initCanvas();
    this.initStars();
    this.animate(0);
    
    // Optimize: Pause animation when tab is not visible
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Optimize: Throttle resize event
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.handleResize(), 250);
    };
    window.addEventListener('resize', handleResize);
    
    this._resizeHandler = handleResize;
  },
  beforeUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('resize', this._resizeHandler);
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.canvas.getContext('2d', { 
        alpha: false,
        desynchronized: true // Better performance
      });
      
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      
      this.centerX = this.canvas.width / 2;
      this.centerY = this.canvas.height / 2;

      this.ctx.fillStyle = '#0a0a0a';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    initStars() {
      this.stars = [];
      
      // Calculate max distance to cover entire screen
      const maxDistance = Math.sqrt(
        Math.pow(this.canvas.width / 2, 2) + 
        Math.pow(this.canvas.height / 2, 2)
      );
      
      for (let i = 0; i < this.starCount; i++) {
        // Distribute stars across entire screen radius
        const distance = Math.random() * maxDistance;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.7;
        const size = 0.5 + Math.random() * 2;
        const colorIndex = Math.floor(Math.random() * this.colorScheme.length);
        const color = this.colorScheme[colorIndex];
        
        this.stars.push({
          distance,
          angle,
          speed,
          size,
          color, // Cache color
          trail: [],
          x: 0,
          y: 0
        });
      }
    },
    animate(currentTime) {
      if (!this.isVisible) {
        this.animationId = requestAnimationFrame(this.animate);
        return;
      }

      // Calculate delta time for smooth animation
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      
      // Limit frame rate to reduce CPU usage
      if (deltaTime < 16.67) { // ~60fps
        this.animationId = requestAnimationFrame(this.animate);
        return;
      }

      const ctx = this.ctx;
      
      // Create trailing effect
      ctx.fillStyle = `rgba(10, 10, 10, ${1 - this.trailLength})`;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Batch drawing operations
      this.stars.forEach(star => {
        // Update angle
        star.angle += this.speed * star.speed * 0.002;

        // Calculate position
        star.x = this.centerX + Math.cos(star.angle) * star.distance;
        star.y = this.centerY + Math.sin(star.angle) * star.distance;

        // Add to trail (limit trail length for performance)
        star.trail.push({ x: star.x, y: star.y });
        if (star.trail.length > 40) { // Reduced from 60 to 40
          star.trail.shift();
        }
      });

      // Draw all trails in one pass
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      this.stars.forEach(star => {
        if (star.trail.length > 1) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = star.size;

          ctx.beginPath();
          ctx.moveTo(star.trail[0].x, star.trail[0].y);
          
          // Simplified trail drawing - skip more points for performance
          const step = Math.max(2, Math.floor(star.trail.length / 20)); // Sample fewer points
          for (let i = step; i < star.trail.length; i += step) {
            const alpha = i / star.trail.length;
            ctx.globalAlpha = alpha * 0.7;
            ctx.lineTo(star.trail[i].x, star.trail[i].y);
          }
          
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Draw star point (no glow for better performance)
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      this.animationId = requestAnimationFrame(this.animate);
    },
    handleVisibilityChange() {
      this.isVisible = !document.hidden;
    },
    handleResize() {
      this.initCanvas();
      // Keep existing stars but update their positions
      this.stars.forEach(star => {
        star.trail = [];
      });
    }
  }
};
</script>

<style scoped>
.star-trails-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #0a0a0a;
  overflow: hidden;
  z-index: -1;
  pointer-events: none; /* Prevent blocking interactions */
  will-change: transform; /* GPU acceleration hint */
}

canvas {
  position: absolute;
  inset: 0;
  display: block;
  transform: translateZ(0); /* Force GPU acceleration */
  -webkit-transform: translateZ(0);
}
</style>