import type { Ref } from 'vue'
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

interface GameState {
  board: BlockState[][]
  mineGenerated: boolean
  gameState: 'playing' | 'won' | 'lost' | 'init'
  startMS: number
  endMS: number | null
}

export class GamePlay {
  state = ref() as Ref<GameState>
  constructor(
    public width: number,
    public height: number,
    public mineCount: number = 10,
  ) {
    this.reset()
  }

  get board() {
    return this.state.value.board
  }

  get blocks() {
    return this.state.value.board.flat()
  }

  random(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  randomInt(min: number, max: number) {
    return Math.round(this.random(min, max))
  }

  reset(width = this.width, height = this.height, mines = this.mineCount) {
    this.width = width
    this.height = height
    this.mineCount = mines
    this.state.value = {
      endMS: null,
      startMS: +Date.now(),
      gameState: 'init',
      mineGenerated: false,
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width }, (_, x): BlockState => ({ x, y, adjacentMines: 0 }),
        )),
    }
  }

  updateNumbers() {
    this.blocks.forEach((block) => {
      // 如果自己是炸弹那就没必要开始计算了
      if (block.mine)
        return
        // 获取到自己的兄弟，如果兄弟是炸弹就＋1
      this.getSiblings(block).forEach((b) => {
        if (b.mine)
          block.adjacentMines++
      })
    })
  }

  /** 生成炸弹 */
  generateMines(state: BlockState[][], initial: BlockState) {
    const placeRandom = () => {
      const x = this.randomInt(0, this.width - 1)
      const y = this.randomInt(0, this.height - 1)
      const block = state[y][x]
      if (block.mine)
        return false
      if (Math.abs(initial.x - block.x) <= 1)
        return false
      if (Math.abs(initial.y - block.y) <= 1)
        return false
      return block.mine = true
    }
    for (let count = 0; count < this.mineCount; count++) {
      let placed = false
      while (!placed)
        placed = placeRandom()
    }
    this.updateNumbers()
  }

  /** 展开 0 的区块 */
  expendZero(block: BlockState) {
    // 不为 0，直接返回，不进行展开
    if (block.adjacentMines)
      return
    // 获取兄弟，为 0 的且未被翻开的再进行翻开
    const sibs = this.getSiblings(block)
    sibs.forEach((b) => {
      if (!b.revealed) {
        b.revealed = true
        this.expendZero(b)
      }
    })
  }

  checkGameStatus() {
    // mineGenerated 为 true 才表明开始了游戏
    if (!this.state.value.mineGenerated)
      return
    // 打平，判断如果每一个都翻开或者被标记了。才开始判断游戏状态
    if (this.blocks.every(b => b.revealed || b.flagged)) {
      // 但凡有一个被标记但是不是炸弹的就输了游戏
      if (this.blocks.some(b => b.flagged && !b.mine))
        this.showLostGame()
      else
        this.showWonGame()
    }
  }

  /** 输了游戏的话翻开所有牌子，显示炸弹，隐藏旗子 */
  showLostGame() {
    this.state.value.gameState = 'lost'
    this.board.flat().forEach((b) => {
      b.flagged = false
      b.revealed = true
    })
    // eslint-disable-next-line no-alert
    alert('you lost！！！')
  }

  showWonGame() {
    this.state.value.gameState = 'won'
    this.state.value.endMS = +Date.now()
  }

  getSiblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined
      return this.board[y2][x2]
    }).filter(Boolean) as BlockState[]
  }

  onRightClick(block: BlockState) {
    if (block.revealed)
      return
    block.flagged = !block.flagged
    this.checkGameStatus()
  }

  onCLick(block: BlockState) {
    // 已经翻开的就暂停
    if (block.revealed || block.flagged)
      return
    // 在首次点击的时候判断是否已经生成过炸弹
    if (!this.state.value.mineGenerated) {
      this.generateMines(this.board, block)
      this.state.value.mineGenerated = true
      this.state.value.gameState = 'playing'
      this.state.value.startMS = Date.now()
    }
    // 翻开
    block.revealed = true
    if (block.mine) {
      // 是炸弹
      this.showLostGame()
      return
    }
    // 展开逻辑
    this.expendZero(block)
    // 检查游戏是否完成
    this.checkGameStatus()
  }
}
