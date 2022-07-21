<script setup lang="ts">
import Confetti from '~/components/Confetti.vue'
const play = new GamePlay(5, 5, 1)
useStorage('vue-minesweeper', play.state)
const board = computed(() => play.board)
const restCount = computed(() => play.blocks.reduce((a, b) => {
  if (b.flagged)
    return a - 1
  return a
}, play.mineCount))
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div>
      Minesweeper
    </div>
    <div my-5 flex="~ gap-2 wrap">
      <button btn @click="toggleDev()">
        {{ isDev ? 'NORMAL' : 'DEV' }}
      </button>
      <button btn @click="play.reset()">
        REPLAY
      </button>
    </div>
    <div mb-5 flex="~ gap-2 wrap">
      <button btn bg-green-600 hover:bg-green-700 @click="play.reset()">
        SIMPLE
      </button>
      <button btn bg-purple-600 hover:bg-purple-700 @click="play.reset()">
        HARD
      </button>
      <button btn bg-red-600 hover:bg-red-700 @click="play.reset()">
        HELL
      </button>
    </div>
    <div mb-5 flex="~ gap-2 wrap">
      <div flex="~ gap-1" items-center h-full>
        <div i-mdi-mine />
        <span>{{ restCount }}</span>
      </div>
    </div>
    <div>
      <div
        v-for="row, y in board" :key="y"
        flex="~ gap-1 items-center justify-center"
        m-1
      >
        <MineBlock
          v-for="block, x in row" :key="x" :block="block"
          @click="play.onCLick(block)"
          @contextmenu.prevent="play.onRightClick(block)"
        />
      </div>
    </div>
    <Confetti :passed="play.state.value.gameState === 'won'" />
  </div>
</template>
