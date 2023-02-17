# FieldValidator

This is not a class, but simply a type. It corresponds to the validators you pass to a field in its constructor. A validator is defined as:

```ts
type FieldValidator<T> = ( value: T, form?: Form, label?: string ) => ValidationResult;
```

As you can see, it is a function that essentially takes a value of a generic type `T` and returns a validation result for it. It also accepts, optionally:
- A `Form` instance, for making the validation result depend on the state of other fields. This, for instance, allows you to validate that a "password confirmation" input has a value that matches whatever the user entered in another "password" input.
- A label, which will actually be the label of the field being validated. This could be useful for producing a generic error message that includes the label of the field being validated.

The `ValidationResult` determines both the valid/invalid result and the message. It is a type defined as:

```ts
interface ValidationResult {
	isValid: boolean,
	error: string
}
```

## Constructor functions
Two constructor functions are defined for creating `ValidationResult`s easily:

### valid

```ts
valid(): ValidationResult
```

Returns `{ isValid: true, error: '' }`.

### invalid

```ts
invalid( error: string ): ValidationResult
```

Returns `{ isValid: false, error }`.

## Examples

```ts
const zipCodeValidator = ( value: string, _, label?: string ) => (
	isZipCode( value ) ? valid() : invalid( `${label || 'This field'} has an invalid format` )
);

const passwordConfirmationValidator = ( value: string, form?: Form ) => (
	value === form?.select<TextInput>( 'password' ).value
		? valid()
		: invalid( 'Must match the password you entered' )
);
```
