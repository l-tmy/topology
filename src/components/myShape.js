import { Node } from '@topology/core'
export const myShape = (ctx, node) => {
  ctx.beginPath()
  // Make my shape.
  // 必须判空再填充
  if (node.fillStyle || node.bkType) {
    ctx.fill()
    ctx.stroke()
  }
}
