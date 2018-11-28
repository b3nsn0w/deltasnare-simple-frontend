const { EventEmitter } = require('events')
const core = require('@deltasnare/core')

class SimpleSnare extends EventEmitter {
  constructor (delta, options) {
    super()

    this.core = core(delta, options)
    this.peerId = options.peerId || options.singleplayer ? 'player' : null

    this.currentTick = this.core.current
    this.tickInputReceived = false

    this.on('tick', () => {
      this.currentTick = this.core.current
      this.tickInputReceived = false
    })

    if (options.singleplayer) {
      this.core.setControl(options.startingPoint || 0, {
        'deltasnare/peers': [this.peerId]
      })
    }
  }

  setInput (input) {
    if (!this.peerId) throw new Error('Cannot set input: peer ID not set')
    if (this.tickInputReceived) throw new Error('Cannot set input twice for the same tick')

    this.tickInputReceived = true
    this.core.setInput(this.currentTick, this.peerId, input)
    this.emit('input', this.currentTick, this.peerId, input)
  }

  setPeerInput (peerId, tick, input) {
    if (peerId === this.peerId) throw new Error('Cannot set own input remotely')

    this.core.setInput(tick, input)
  }

  setControl (tick, control) {
    this.core.setControl(tick, control)
  }

  advance () {
    this.core.setCurrent(this.currentTick + 1)
    this.emit('tick', this.core.getTick(this.currentTick + 1), this.core.getTick(this.currentTick))
  }

  advanceTo (tick) {
    if (tick > this.core.current + this.core.windowSize * 2) throw new RangeError(`Tick ${tick} is too far ahead`)

    while (this.currentTick < tick) this.advance()
  }

  // TODO add validate, sync, and desync
}

module.exports = SimpleSnare
