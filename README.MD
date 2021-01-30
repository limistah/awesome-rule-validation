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

// Response:
// {
//     "message": "field missions.count successfully validated.",
//     "status": "success",
//     "data": {
//         "validation": {
//             "error": false,
//             "field": "missions.count",
//             "field_value": 45,
//             "condition": "gt",
//             "condition_value": 30
//         }
//     }
// }
```

## Usage

To carryout a validation make a POST requet to /validate-rule with the body containing:

- **data** <_string_ | _number_ | _object_ | _array_>: Data to be validated

- **rule** <_object_>: An object that must have three properties
  1. **field** <_string_>: The property in the data to be validated. It supports nesting (just like above), and could be the index of an array or string of the data property
  2. **condition_value** <_string_ | _number_>: The expected value that the field should have in the data.
  3. **condition** <_string_>: One of
  - `gt`: If the field value is greater than the condition value
  - `gte`: If the field value is greater than or equal to the condition value
  - `contains`: If the field value contains the condition value.
  - `eq`: If the field value is equal to the condition value.
  - `neq`: If the field value is not equal to the condition value.
