const Module = require('@microverse-network/core/module')

const { Client } = require('rpc-websockets')

module.exports = class TendermintNode extends Module {
  constructor(options = {}) {
    super(options)
    this.client = new Client(`ws://${this.options.url}`)
  }

  tx(...args) {
    if (!this.client.ready) return
    return this.client.call('broadcast_tx_async', args)
  }
}
