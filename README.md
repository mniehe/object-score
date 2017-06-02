# Object Score
A simple way to score how well an object matches a model.

### Usage:
- Install the library `npm install object-score`. 
- Optionally install the library [validator](https://github.com/chriso/validator.js) for a collection of pre-made validators using `npm install validator`.

```javascript
const validator = require('validator');
const { ScoringModel } = require('object-score');

const EXAMPLE_DATA = [{
  username: 'jdiggity',
  firstName: 'Joe',
  lastName: 'Diggity',
  email: 'joe@diggity.org',
  password: '5f4dcc3b5aa765d61d8327deb882cf99'
}, {
  username: 'franci$',
  firstName: 'Frank',
  email: 'fakeaddress'
}];

const userModel = new ScoringModel('User');

userModel
  .field('username', 0.2)
  .validator(validator.isAlphanumeric, 'Username must be alphanumeric')
  .validator((value) => value.length > 3, 'Username must be at least 3 characters');

userModel
  .field('firstName', 0.15)
  .validator(validator.isAlphanumeric, 'First name must be alphanumeric');

userModel
  .field('lastName', 0.15)
  .validator(validator.isAlphanumeric, 'Last name must be alphanumeric');

userModel
  .field('email', 0.2)
  .validator(validator.isEmail, 'Email must be a valid email address');

userModel
  .field('password', 0.3)
  .validator(validator.isMD5, 'Password MUST be hashed');

scoredData = EXAMPLE_DATA.map((user) => {
  user['score'] = userModel.score(user);
  return user;
})
console.log(JSON.stringify(scoredData, null, 2));

EXAMPLE_DATA.forEach((user) => {
  const result = userModel.score(user, true);
  console.log(JSON.stringify(result, null, 2))
});
```

#### Output without messages
```json
[
  {
    "username": "jdiggity",
    "firstName": "Joe",
    "lastName": "Diggity",
    "email": "joe@diggity.org",
    "password": "5f4dcc3b5aa765d61d8327deb882cf99",
    "score": 1
  },
  {
    "username": "franci$",
    "firstName": "Frank",
    "email": "fakeaddress",
    "score": 0.3833333333333333
  }
]
```
#### Output with messages
```json
{
  "score": 1,
  "fields": {
    "username": {
      "score": 0.2,
      "messages": []
    },
    "firstName": {
      "score": 0.15,
      "messages": []
    },
    "lastName": {
      "score": 0.15,
      "messages": []
    },
    "email": {
      "score": 0.2,
      "messages": []
    },
    "password": {
      "score": 0.3,
      "messages": []
    }
  }
}
{
  "score": 0.3833333333333333,
  "fields": {
    "username": {
      "score": 0.13333333333333333,
      "messages": [
        "Username must be alphanumeric"
      ]
    },
    "firstName": {
      "score": 0.15,
      "messages": []
    },
    "lastName": {
      "score": 0,
      "messages": [
        "Field lastName is not defined."
      ]
    },
    "email": {
      "score": 0.1,
      "messages": [
        "Email must be a valid email address"
      ]
    },
    "password": {
      "score": 0,
      "messages": [
        "Field password is not defined."
      ]
    }
  }
}
```

### To do
- Add way to handle nested objects
- Choose the weighting distribution per validator as well as per field.

### License (MIT)

```
Copyright (c) 2017 Mark Niehe <mniehe@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
