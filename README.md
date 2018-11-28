Frontend for single-chunk apps, ready to plug into the public API

# Usage

```javascript
const SimpleSnare = require('.')

// const delta = function (state, inputs, options) { ... }
// const state = { ... }

const chunk = new SimpleSnare(delta, {
  state,
  singleplayer: true
})

chunk.on('tick', tick => console.log(tick.state))

chunk.advance()
chunk.setInput('bar')
chunk.advance()
```

A class named `SimpleSnare` is exported, with the following methods:

## `SimpleSnare(delta, options)`

The constructor, where

 - `delta`: is the delta function
 - `options`: are the options for the snare. It is forwarded to the core, and the following extra parameters are supported:
   - `peerId`: ID of the local peer
   - `singleplayer`: if true, sets up singleplayer mode, which sets `peerId` to `'player'` and automatically joins the peer in the first tick

### `SimpleSnare.setInput(input)`

Sets the local peer's input for the current tick. This can only be done once per tick, if it's attempted multiple times, an error is thrown.

### `SimpleSnare.setPeerInput(peerId, tick, input)`

Sets a remote peer's input for a given tick.

### `SimpleSnare.setControl(tick, control)`

Sets the server's control message for a given tick

### `SimpleSnare.advance()`

Advances the current tick by 1 and emits a `tick` event

### `SimpleSnare.advanceTo(tick)`

Advances to the specified tick and emits `tick` events on the way. Does not advance backwards and cannot go further than the double of the core's window size.

### `SimpleSnare.currentTick`

The current tick ID. Read-only.

### `SimpleSnare.peerId`

The local peer's ID. Writable, but not recommended to modify. Make sure to remove the old peer and add the new one.

# Events

`SimpleSnare` is an event emitter. It emits two kind of events:

## `tick`

The tick event is emitted every time there is a new tick. It has two parameters, the current and the previous tick.

## `input`

When the local peer's input is set, an input event is emitted. This allows the network layer to listen directly to the snare frontend.