deps:
	yarn install
	cargo install --force wizer --all-features

build:
	yarn asbuild
	wizer build/release.wasm -f init -o build/fil-lottery-actor.wasm
	rm build/release.wasm build/release.wat

test:
	cd testing/fvm && cargo r

test-rpc: build
	yarn tests:rpc

.PHONY: deps build test
