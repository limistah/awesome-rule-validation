# RULE Validation API

This is a NodeJS api that can assist to perform a basic validation by applying some specific rules.

## Example

```js
const body = {
  rule: {
    field: "missions.count",
    condition: "gte",
    condition_value: 30,
  },
  data: {
    name: "James Holden",
    crew: "Rocinante",
    age: 34,
    position: "Captain",
    missions: {
      count: 45,
      successful: 44,
      failed: 1,
    },
  },
};
fetch("https://awesome-rule-validation.herokuapp.com/", {
  body: JSON.stringify(body),
  method: "POST",
});
```
