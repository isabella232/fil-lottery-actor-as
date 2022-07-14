deps:
	yarn install
	cargo install wizer --all-features

build:
	yarn asbuild
	wizer build/release.wasm -f init -o fil-lottery-actor.wasm
	rm build/release.wasm build/release.wat

test:
	cd testing && cargo r

test-rpc: build
	yarn tests:rpc

.PHONY: deps build test
