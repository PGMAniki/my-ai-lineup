<script setup lang="ts">
import { computed } from 'vue'
import { DIMENSIONS } from '../config/dimensions'
import { createRadarPoint, createRadarPolygon, toSvgPoints } from '../core/radarGeometry'
import type { DimensionScores } from '../types'

const props = defineProps<{
  scores: DimensionScores
}>()

const center = 160
const maximumRadius = 105
const labelRadius = 137

const gridPolygons = [0.25, 0.5, 0.75, 1].map((ratio) =>
  toSvgPoints(
    DIMENSIONS.map((_, index) =>
      createRadarPoint(index, DIMENSIONS.length, maximumRadius * ratio, center),
    ),
  ),
)

const axes = DIMENSIONS.map((_, index) => ({
  start: { x: center, y: center },
  end: createRadarPoint(index, DIMENSIONS.length, maximumRadius, center),
}))

const labels = DIMENSIONS.map((dimension, index) => ({
  ...dimension,
  ...createRadarPoint(index, DIMENSIONS.length, labelRadius, center),
  score: computed(() => props.scores[dimension.key]),
  anchor: index === 0 || index === 3 ? 'middle' : index < 3 ? 'start' : 'end',
  offsetY: index === 0 ? -4 : index === 3 ? 12 : 4,
}))

const resultPoints = computed(() =>
  toSvgPoints(
    createRadarPolygon(
      DIMENSIONS.map((dimension) => props.scores[dimension.key]),
      100,
      maximumRadius,
      center,
    ),
  ),
)

const resultVertices = computed(() =>
  createRadarPolygon(
    DIMENSIONS.map((dimension) => props.scores[dimension.key]),
    100,
    maximumRadius,
    center,
  ),
)

const accessibleSummary = computed(() =>
  DIMENSIONS.map((dimension) => `${dimension.name}${props.scores[dimension.key]}分`).join('，'),
)
</script>

<template>
  <figure class="radar-chart">
    <svg viewBox="0 0 320 320" role="img" :aria-label="`六维能力图：${accessibleSummary}`">
      <g class="radar-chart__grid">
        <polygon v-for="(points, index) in gridPolygons" :key="index" :points="points" />
        <line
          v-for="(axis, index) in axes"
          :key="`axis-${index}`"
          :x1="axis.start.x"
          :y1="axis.start.y"
          :x2="axis.end.x"
          :y2="axis.end.y"
        />
      </g>

      <polygon class="radar-chart__result" :points="resultPoints" />
      <circle
        v-for="(point, index) in resultVertices"
        :key="`point-${index}`"
        class="radar-chart__point"
        :cx="point.x"
        :cy="point.y"
        r="3.5"
      />

      <text
        v-for="label in labels"
        :key="label.key"
        class="radar-chart__label"
        :x="label.x"
        :y="label.y + label.offsetY"
        :text-anchor="label.anchor"
      >
        <tspan :x="label.x">{{ label.shortName }}</tspan>
        <tspan class="radar-chart__score" :x="label.x" dy="15">{{ label.score.value }}</tspan>
      </text>
    </svg>
    <figcaption class="sr-only">{{ accessibleSummary }}</figcaption>
  </figure>
</template>

<style scoped>
.radar-chart {
  width: 100%;
  margin: 0;
}

.radar-chart svg {
  display: block;
  width: 100%;
  overflow: visible;
}

.radar-chart__grid polygon,
.radar-chart__grid line {
  fill: none;
  stroke: rgb(255 255 255 / 11%);
  stroke-width: 1;
}

.radar-chart__grid polygon:last-of-type {
  stroke: rgb(122 156 255 / 34%);
}

.radar-chart__result {
  fill: rgb(132 255 106 / 18%);
  stroke: var(--color-accent);
  stroke-width: 2;
  stroke-linejoin: round;
  transform-origin: center;
  animation: radar-grow 650ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.radar-chart__point {
  fill: var(--color-background);
  stroke: var(--color-accent);
  stroke-width: 2;
}

.radar-chart__label {
  fill: var(--color-text-secondary);
  font-size: 11px;
  font-weight: 600;
}

.radar-chart__score {
  fill: var(--color-text);
  font-size: 12px;
  font-weight: 800;
}

@keyframes radar-grow {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .radar-chart__result {
    animation: none;
  }
}
</style>

