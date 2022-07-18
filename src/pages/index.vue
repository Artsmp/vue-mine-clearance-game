<script setup lang="ts">
interface BlockState {
  x: number
  y: number
  /** 是否被翻开 */
  revealed?: boolean
  /** 是否是炸弹 */
  mine?: boolean
  /** 是否插旗 */
  flagged?: boolean
  /** 周围炸弹个数 */
  adjacentMines: number
}

const HEIGHT = 10
const WIDTH = 10
const state = reactive(
  Array.from({ length: HEIGHT }, (_, y) =>
    Array.from({ length: WIDTH }, (_, x): BlockState => ({ x, y, adjacentMines: 0 }),
    )))

const directions = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
]

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

function updateNumbers() {
  state.forEach((row, y) => {
    row.forEach((block, x) => {
      getSiblings(block).forEach((b) => {
        if (b.mine)
          block.adjacentMines++
      })
    })
  })
}

function generateMines(initial: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) <= 1)
        continue
      if (Math.abs(initial.y - block.y) <= 1)
        continue
      block.mine = Math.random() < 0.3
    }
  }
  updateNumbers()
}

function getBlockClass(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray-500/30'
  return block.mine ? 'bg-red-500/50' : numberColors[block.adjacentMines]
}
let mineGenerated = false
const dev = true
function onCLick(block: BlockState) {
  if (!mineGenerated) {
    generateMines(block)
    mineGenerated = true
  }
  block.revealed = true
  if (block.mine)
    alert('BOOOM!')
  expendZero(block)
}

function expendZero(block: BlockState) {
  if (block.adjacentMines)
    return
  const sibs = getSiblings(block)
  sibs.forEach((b) => {
    if (!b.revealed) {
      b.revealed = true
      expendZero(b)
    }
  })
}

function getSiblings(block: BlockState) {
  return directions.map(([dx, dy]) => {
    const x2 = block.x + dx
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
      return undefined
    return state[y2][x2]
  }).filter(Boolean) as BlockState[]
}
</script>

<template>
  <div>
    <div>
      Minesweeper
    </div>
    <div p-5>
      <div
        v-for="row, y in state" :key="y"
        flex="~"
        gap-1 items-center justify-center
        m-1
      >
        <button
          v-for="block, x in row" :key="x"
          flex="~"
          items-center justify-center gap-1
          w-10 h-10
          hover="bg-gray/30"
          border="1 gray/30"
          :class="getBlockClass(block)"
          @click="onCLick(block)"
        >
          <template v-if="block.revealed || dev">
            <div v-if="block.mine" i-mdi-mine />
            <div v-else>
              {{ block.adjacentMines }}
            </div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
