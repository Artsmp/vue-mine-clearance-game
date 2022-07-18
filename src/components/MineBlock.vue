<script setup lang="ts">
import type { BlockState } from '~/types'

defineProps<{ block: BlockState }>()
const numberColors = [
  'text-transparent',
  'text-green',
  'text-cyan',
  'text-amber',
  'text-orange',
  'text-fuchsia',
  'text-pink',
  'text-purple',
  'text-rose',
]
function getBlockClass(block: BlockState) {
  if (block.flagged)
    return 'bg-gray-500/30'
  if (!block.revealed)
    return 'bg-gray-500/30 hover:bg-gray-300/50'
  return block.mine ? 'bg-red-500/50' : numberColors[block.adjacentMines]
}
</script>

<template>
  <button
    flex="~"
    items-center justify-center gap-1
    w-6 h-6 text-sm
    sm="w-10 h-10 text-lg"
    border="1 gray/30"
    :class="getBlockClass(block)"
  >
    <template v-if="block.flagged">
      <div i-mdi-flag text-red />
    </template>
    <template v-else-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi-mine />
      <div v-else>
        {{ block.adjacentMines }}
      </div>
    </template>
  </button>
</template>

<style>

</style>
