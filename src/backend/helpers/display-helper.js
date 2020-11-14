import { Generator } from '../generators/generator'

const ErrorTypeByName = new Map()
ErrorTypeByName.set('arithmeticexception', 1)
ErrorTypeByName.set('indexoutofbounds', 2)
ErrorTypeByName.set('uncaughtexception', 3)
ErrorTypeByName.set('nullpointerexception', 4)
ErrorTypeByName.set('invalidcastingexception', 5)
ErrorTypeByName.set('heapoverflowerror', 6)
ErrorTypeByName.set('stackoverflowerror', 7)

const ErrorEnum = Array.from(ErrorTypeByName.values())

class ErrorHelpers {
  constructor () {
    this.ErrorMapping = new Map()
  }

  createLabel (exceptionname) {
    let error = -1
    if ((error = ErrorTypeByName.get(exceptionname)) === undefined) {
      throw new Error("UNKNOWN ERROR CAN'T CONTINUE PARSING")
    } else {
      const label = Generator.genLabel()
      this.ErrorMapping.set(error, label)
      return label
    }
  }

  fillDefaultExceptions (defaultlabel) {
    const labels = Array.from(this.ErrorMapping.keys())
    for (const key of ErrorEnum) {
      if (labels.includes(key)) continue
      else { this.ErrorMapping.set(key, defaultlabel) }
    }
  }
}

export class DisplayHelper {
  constructor () {
    this.Cicles = []
    this.TryCatchErrors = []
    this.NativeFunc = []
    this.FunctionCallStack = []
    this.OutLabel = ''
    this.LeftHandSide = false
  }

  clear () {
    this.Cicles.clear()
    this.NativeFunc.clear()
    this.FunctionCallStack.clear()
    this.TryCatchErrors.clear()
  }

  createTryCatchEnv () {
    this.TryCatchErrors.push(new ErrorHelpers())
    return this.TryCatchErrors[this.TryCatchErrors.length - 1]
  }

  exitTryCatchEnv () {
    this.TryCatchErrors.pop()
  }

  getError (type) {
    return this.TryCatchErrors[this.TryCatchErrors.length - 1].ErrorMapping.get(type)
  }
}
