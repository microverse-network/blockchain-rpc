all: up

build:
	docker build --tag microversenetwork/tendermint docker

prepare: build
	mkdir --parents data
	docker run --rm --interactive --tty \
		--volume $(CURDIR)/data:/tmp/data \
		microversenetwork/tendermint testnet \
			--config /tendermint/default.toml \
			--hostname-prefix node_ \
			--node-dir-prefix node_ \
			--populate-persistent-peers \
			--o /tmp/data \
			--v 4
	docker run --rm --interactive --tty \
		--volume $(CURDIR)/..:/usr/local/src/microverse-network/blockchain-rpc \
		--workdir /usr/local/src/microverse-network/blockchain-rpc \
		microversenetwork/blockchain-rpc npm install

up: clean prepare
	docker-compose up

clean:
	docker-compose down --remove-orphans
	rm -rf data

dev: clean-dev prepare
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

clean-dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down --remove-orphans
	rm -rf data

.PHONY: dev
