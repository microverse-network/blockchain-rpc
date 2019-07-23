const shortid = require('shortid')

const JSONRPC = require('@microverse-network/core/json-rpc')

const ABCI = require('./abci')
const Node = require('./node')

module.exports = class BlockchainRPC extends JSONRPC {
  constructor(options = {}) {
    super(options)
    this.abci = new ABCI()
    this.abci.server.once('connection', () => {
      this.node = new Node({ url: process.argv.pop() })
    })
  }

  tx(tx = {}) {
    if (!this.node) return
    Object.assign(tx, {
      id: shortid.generate(),
      local: this.network.id,
      module: this.label,
    })
    return this.node.tx(Buffer.from(JSON.stringify(tx)).toString('base64'))
  }

  handleRemote(remote) {
    Object.keys(remote).forEach(name => {
      const value = remote[name]
      if (value instanceof Function) {
        remote[name] = async (...args) => {
          const tx = await this.tx({
            type: 'request',
            remote: remote.$nodeId,
            args,
          })
          if (tx) {
            args.hash = tx.hash
          }
          value.call(remote, ...args)
        }
      }
    })
    super.handleRemote(remote)
  }

  getMethods(methods = {}) {
    const self = this
    return Object.assign(methods, {
      $properties() {
        const { label } = self
        const { id } = self.network
        return {
          $label: label,
          $nodeId: id,
        }
      },
      $ping(timeout = 90) {
        const { $label, $nodeId } = this.remote
        self.debug('ping from %s on %s', $label, $nodeId)
        setTimeout(() => this.remote.$ping(timeout), timeout * 1000)
        self.tx({
          type: 'response',
          remote: this.remote.$nodeId,
        })
      },
    })
  }
}
