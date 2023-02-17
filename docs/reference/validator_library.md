# Validator library

Everything mentioned about validators in the **FieldValidator** reference is enough for you to implement your own set of validators and use them where needed. However, `mobx-form` has its own set of common validators that you can optionally use.

Each validator offered comes with the following:
- A function that creates it for you, which you can just import from the package. E.g. for creating the common "required" validator you create it like `required()`.
- That function accepts some parameters:
  - Necessary parameters that the validator needs. For example, the `minLength` validator needs the length to be validated. These are passed as positional arguments.
  - An optional config parameter, which configures things like error message to display. Each validator has a default config but you can override it when creating the validator.

## Validators

### `required<T>`

Validates the value is present. For this it evaluates whether `!!value` is `true` or `false`. Its config object consists of a `message` parameter that sets the error to return.

Examples:
```ts
// With the default message
const myInput = new TextInput( {
	...
	validators: [ required() ]
} );

// With a custom message
const myInput = new TextInput( {
	...
	validators: [ required( { message: 'This field is required' } ) ]
} );
```

### `email`
Validates the string value has a valid email format. Uses the `isEmail` function from [validator.js](https://github.com/validatorjs/validator.js/) without any specific option.

Accepts a `message` parameter in its config object for overriding the default message.

Example:
```ts
// With the default message
const email = new TextInput( {
	...
	validators: [ email() ]
} );

// With a custom message
const email = new TextInput( {
	...
	validators: [ email( { message: 'That format is not correct' } ) ]
} );
```

### `minLength`

Validates the string value has `length` greater than or equal to the one specified. Accepts a `message` parameter in its config as well. If the message includes the `:length` keyword, it will be replaced with the expected minimum length given.

Examples:
```ts
// With the default message
new TextInput( {
	...
	validators: [ minLength( 8 ) ]
} );

// With a custom message
new TextInput( {
	...
	validators: [ minLength( 8, { message: 'You must type at least :length characters' } ) ]
} );
```

### `maxLength`
Exactly the same as `minLenth`, but validates the value's length is less that or equal than the given length.

Its config object also accepts a `message` that supports the `:length` keyword for interpolating the desired length.

### `length`
Validates the string's length equals the one given. Like `minLenght` and `maxLength`, accepts a `message` parameter supporting the `:length` keyword.

Examples:
```ts
// With the default message
new TextInput( {
	...
	validators: [ length( 6 ) ]
} );

// With a custom message
new TextInput( {
	...
	validators: [ length( 6, { message: 'You must type at least :length characters' } ) ]
} );
```

## Using the label of the field in the error message
When you specify a custom message for any of the validators available, you can use the `:label` keyword, which will be replaced with the label of the field being validated.

This may be useful if you are defining generic custom messages for all of the validators and you want to include the labels in them.

If the validator for which you are using the `:label` keyword is applied to a field without label, `:label` will be replaced with the word `'Field'`.

Examples:

```ts
const myRequiredValidator = required( { message: ':label must be present' } );

// Will show 'Password must be present'
const myField = new TextInput( { label: 'Password' , validators: [ myRequiredValidator ] } );

// Will show 'Field must be present'
const myLabelessField = new TextInput( { validators: [ myRequiredValidator ] } );
```
