<template>
  <div class="random-shapes-container">
    <div 
      v-for="(shape, index) in shapes" 
      :key="index"
      class="random-shape"
      :style="getShapeStyle(shape)"
    >
      <svg 
        :width="shape.size" 
        :height="shape.size" 
        :viewBox="`0 0 ${shape.size} ${shape.size}`"
        fill="none"
        :stroke="shape.color"
        :stroke-width="shape.strokeWidth"
      >
        <component :is="shape.type" v-bind="shape.props" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  count: {
    type: Number,
    default: 5
  }
});

const shapes = ref([]);
const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', '#ffffff'];
const geometryTypes = ['circle', 'rect', 'line', 'polygon'];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateShapes = () => {
  const newShapes = [];
  for (let i = 0; i < props.count; i++) {
    const size = getRandomInt(30, 80);
    const typeIndex = getRandomInt(0, geometryTypes.length - 1);
    const type = geometryTypes[typeIndex];
    
    let svgComponent = '';
    let svgProps = {};

    if (type === 'circle') {
      svgComponent = 'circle';
      svgProps = { cx: size/2, cy: size/2, r: (size/2) - 2 };
    } else if (type === 'rect') {
      svgComponent = 'rect';
      svgProps = { x: 2, y: 2, width: size - 4, height: size - 4 };
    } else if (type === 'line') {
      svgComponent = 'line';
      svgProps = { x1: 0, y1: size, x2: size, y2: 0 };
    } else if (type === 'polygon') {
      svgComponent = 'polygon';
      // Triangle
      svgProps = { points: `${size/2},0 ${size},${size} 0,${size}` };
    }

    newShapes.push({
      id: i,
      type: svgComponent,
      props: svgProps,
      size: size,
      color: colors[getRandomInt(0, colors.length - 1)],
      strokeWidth: getRandomInt(1, 4),
      top: getRandomInt(0, 100) + '%',
      left: getRandomInt(0, 100) + '%',
      animationDuration: getRandomInt(10, 30) + 's',
      animationDelay: getRandomInt(0, 5) + 's',
      rotation: getRandomInt(0, 360) + 'deg'
    });
  }
  shapes.value = newShapes;
};

const getShapeStyle = (shape) => ({
  top: shape.top,
  left: shape.left,
  animation: `float ${shape.animationDuration} ease-in-out infinite alternate`,
  animationDelay: shape.animationDelay,
  transform: `rotate(${shape.rotation})`
});

onMounted(() => {
  generateShapes();
});
</script>

<style scoped>
.random-shapes-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.random-shape {
  position: absolute;
  opacity: 0.15;
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(30px, -30px) rotate(10deg); }
}
</style>
