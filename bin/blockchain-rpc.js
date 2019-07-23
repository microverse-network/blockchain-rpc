#!/usr/bin/env node

require('@microverse-network/core/node')
require('@microverse-network/core/plugins-standard')

const TendermintRPC = require('../index')
global.rpc = new TendermintRPC({ id: 'tendermint-rpc' })
