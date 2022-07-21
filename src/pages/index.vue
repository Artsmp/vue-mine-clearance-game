<script setup lang="ts">
import Confetti from '~/components/Confetti.vue'
const play = new GamePlay(9, 9, 10)

const now = useNow({ interval: 1000 })
const timerNS = computed(() => {
  if (play.state.value.gameState === 'playing' || play.state.value.gameState === 'won')
    return Math.round(((play.state.value.endMS ?? +now.value) - play.state.value.startMS) / 1000)
  return 0
})
useStorage('vue-minesweeper', play.state)

const board = computed(() => play.board)
const restCount = computed(() => {
  if (!play.state.value.mineGenerated)
    return play.mineCount
  return play.blocks.reduce((a, b) => a - (b.flagged ? 1 : 0), play.mineCount)
})

function newGame(difficulty: 'easy' | 'hard' | 'hell') {
  switch (difficulty) {
    case 'easy':
      play.reset(9, 9, 10)
      break
    case 'hard':
      play.reset(16, 16, 40)
      break
    case 'hell':
      play.reset(16, 30, 99)
      break
    default:
      break
  }
}
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
      <button btn bg-green-600 hover:bg-green-700 @click="newGame('easy')">
        EASY
      </button>
      <button btn bg-purple-600 hover:bg-purple-700 @click="newGame('hard')">
        HARD
      </button>
      <button btn bg-red-600 hover:bg-red-700 @click="newGame('hell')">
        HELL
      </button>
    </div>
    <div mb-5 flex="~ gap-10 wrap" text-2xl>
      <div flex="~ gap-1" items-center h-full>
        <div i-mdi-mine />
        <span>{{ restCount }}</span>
      </div>
      <div flex="~ gap-1" items-center h-full>
        <div i-carbon-timer />
        <span>{{ timerNS }}</span>
      </div>
    </div>
    <div class="w-full overflow-auto">
      <div
        v-for="row, y in board" :key="y"
        flex="~ gap-1 items-center justify-center"
        w-max mx-a mb-1
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
