dev:
	npx webpack-dev-server

install:
	npm install

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .

fix:
	eslint . --fix

test:
	npm test

test-coverage:
	npm test -- --coverage

webpack:
	npx webpack