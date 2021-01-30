# RULE Validation API

This is a NodeJS api that can assist to perform a basic validation by applying some specific rules.

## Example

```bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{ "rule": { "field": "missions.count", "condition": "gte","condition_value": 30},"data": {"name": "James Holden","crew": "Rocinante","age": 34,"position": "Captain","missions": {count: 45,successful: 44,failed: 1} } }' \
  https://awesome-rule-validation.herokuapp.com/

```
