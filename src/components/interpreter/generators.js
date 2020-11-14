export const programGen = function * program (ast) {
  var astNode = ast

  while (astNode && astNode.type !== 26) {
    var reset = yield astNode
    astNode = astNode.next

    if (reset) {
      astNode = reset
    }
  }
}
