import type { BlockState } from '~/types'
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
export class GamePlay {
  state = ref<BlockState[][]>([])
  mineGenerated = false
  constructor(public width: number, public height: number) {
    this.reset()
  }

  reset() {
    this.mineGenerated = false
    this.state.value = Array.from({ length: this.height }, (_, y) =>
      Array.from({ length: this.width }, (_, x): BlockState => ({ x, y, adjacentMines: 0 }),
      ))
  }

  updateNumbers() {
    this.state.value.forEach((row) => {
      row.forEach((block) => {
        this.getSiblings(block).forEach((b) => {
          if (b.mine)
            block.adjacentMines++
        })
      })
    })
  }

  generateMines(initial: BlockState) {
    for (const row of this.state.value) {
      for (const block of row) {
        if (Math.abs(initial.x - block.x) <= 1)
          continue
        if (Math.abs(initial.y - block.y) <= 1)
          continue
        block.mine = Math.random() < 0.3
      }
    }
    this.updateNumbers()
  }

  expendZero(block: BlockState) {
    if (block.adjacentMines)
      return
    const sibs = this.getSiblings(block)
    sibs.forEach((b) => {
      if (!b.revealed) {
        b.revealed = true
        this.expendZero(b)
      }
    })
  }

  // watchEffect(checkGameStatus)

  checkGameStatus() {
    if (!this.mineGenerated)
      return

    const blocks = this.state.value.flat()
    if (blocks.every(b => b.revealed || b.flagged)) {
      if (blocks.some(b => b.flagged && !b.mine))
        alert('You cheat!!!')
      else
        alert('You win!!!')
    }
  }

  getSiblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined
      return this.state.value[y2][x2]
    }).filter(Boolean) as BlockState[]
  }

  onRightClick(block: BlockState) {
    if (block.revealed)
      return
    block.flagged = !block.flagged
    this.checkGameStatus()
  }

  onCLick(block: BlockState) {
    if (block.revealed)
      return
    if (!this.mineGenerated) {
      this.generateMines(block)
      this.mineGenerated = true
    }
    block.revealed = true
    if (block.mine) {
      alert('BOOOM!')
      this.state.value.flat().forEach((b) => {
        b.flagged = false
        b.revealed = true
      })
      return
    }
    this.expendZero(block)
    this.checkGameStatus()
  }
}
