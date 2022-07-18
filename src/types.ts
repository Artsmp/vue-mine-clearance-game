export interface BlockState {
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
