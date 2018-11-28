const Snare = require('.')

const chunk = new Snare((state, inputs) => {
  return { increment: state.increment + 1, inputs }
}, {
  state: { increment: 0 },
  singleplayer: true
})

chunk.on('tick', tick => console.log(tick.state, tick.peers))

chunk.advance()
chunk.setInput('bar')
chunk.advanceTo(5)
chunk.advanceTo(5)
