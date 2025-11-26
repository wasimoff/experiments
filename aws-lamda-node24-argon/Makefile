function.zip: index.mjs
	zip -r $@ index.mjs node_modules/ package.json

.PHONY: deploy
deploy: function.zip
	aws lambda update-function-code --function-name argon --zip-file fileb://$<

.PHONY: invoke
invoke:
	aws lambda invoke --function-name argon /dev/stderr >/dev/null
