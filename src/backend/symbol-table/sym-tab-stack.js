export class SymTabStack {
  constructor () {
    this.runtimeEnv = []
  }

  peek () {
    return this.runtimeEnv[this.runtimeEnv - 1]
  }

  getCurrentEnv () {
    return this.runtimeEnv[this.runtimeEnv.length - 1]
  }

  /**
     * This will work with the imports i suppose
     *
     * @param current: the Environment we are accessing
     */
  enterEnv (env = 0) {
    this.runtimeEnv.push([env.toString(), 0])
  }

  exitEnv () {
    this.runtimeEnv.pop()
  }

  enterScope () {
    const old = this.runtimeEnv[this.runtimeEnv.length - 1]
    const latest = [`${old[0]}.${old[1]}`, 0]
    old[1] = old[1] + 1

    this.runtimeEnv.push(latest)
  }

  /**
     * This will also pop the stack but will not affect other Enviroments
     */
  exitScope () {
    this.runtimeEnv.pop()
  }

  getSymTabStack () {
    return this.runtimeEnv
  }

  currentNestingLevel () {
    return (this.runtimeEnv.length === 0) ? '0' : (this.runtimeEnv[this.runtimeEnv.length - 1])[0]
  }

  clear () {
    this.runtimeEnv = []
  }
}
