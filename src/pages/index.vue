<script setup lang="ts">
const play = new GamePlay(12, 12)
useStorage('vue-minesweeper', play.state)
const board = computed(() => play.board)
</script>

<template>
  <div>
    <div>
      Minesweeper
    </div>
    <div my-5>
      <button mx-1 btn text-sm @click="toggleDev()">
        {{ isDev ? 'NORMAL' : 'DEV' }}
      </button>
      <button mx-1 btn text-sm @click="play.reset()">
        RESET
      </button>
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
  </div>
</template>
