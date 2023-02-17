# Field

This is the base, abstract class for all fields. `T` is a generic, and is the type of the field's value.

```ts
class Field<T>
```

## Methods

The class has the following methods and attributes:

### constructor

```ts
constructor( params: FieldParams<T> ): Field<T>
```

Constructs a new field.

**Parameters**

| Name | Type | Description | Required/Default |
| ---- | ---- | ----------- | ---------------------- | 
| `label` | `string` | The field's label. | `''` |
| `hint` | `string` | The field's hint text. | `''` |
| `value` | `T` | The field's initial value. | Required |
| `validators` | `FieldValidator<T>[]` | An array of validators. | `[]` |
| `disabled` | `boolean` | Whether the field is disabled or not. | `false` |

### label

```ts
label: string
```

Returns the label passed in constructor.

### hint

```ts
hint: string
```

Returns the hint passed in constructor.

### isDisabled

```ts
isDisabled: boolean
```

Returns whether the field is disabled or not.

### value

```ts
value: T
```

Returns the current value.

### isValid

```ts
isValid: boolean
```

Returns `true` if at least one validator fails for the current value.

### isDirty

```ts
isDirty: boolean
```

Returns `true` if the current value does not equal the initial value passed in constructor (compared with `!==`).

### error

```ts
error: string
```

Returns the error message being shown. This may or may not equal the error message reported by the current failing validator, if any; this behavior will depend on the particular `Field` subclass.

### reset

```ts
reset(): void
```

Resets the value of the field to the initial one given in constructor, and also clears any error message that was being shown.

### showError

```ts
showError( errorMessage: string ): void
```

Forces the field to show the given error message, overriding whatever `error` was returning. This does not depend on, nor affect at all, the validity state of the field. The method is intended to show errors coming from the backend, with an informative purpose only (for the end user). Ideal for "email already registered" or similar errors.

### syncError

```ts
syncError(): void
```

For internal usage. Synchronizes the field's error message with its current value and what the validators return for it. In other words, it does two things:
- If all validators currently accept the field's value (i.e. `isValid` returns `true`), then it stops showing an error message if there was one. This means `error` will start returning an empty string.
- If some validators fail for the current value, then it starts showing the error message returned by the first failing validator. The order of the validators is given by the order in which they were specified in the constructor.

This method is used by the form itself to report any errors on submit, and by subclasses of `Field<T>` to implement their error-display behavior.

Normally you'll never use this method unless you are creating your own subclass of `Field<T>` or implementing something very specific for your app.

### attachToForm

```ts
attachToForm( form: Form ): void
```

For internal usage. Attaches the field to a particular form. This method is used by the form constructor to attach the fields passed to it in the constructor. Field attachment is a simple way of relating fields to a form, that:
- Facilitates form construction, because its constructor can receive direct instances of `Field<T>` subclasses.
- Makes the form instance available for the validators passed to the fields, which allows fields to be validated depending on other fields.

Calling `attachToForm` on a field that was already attached will result in a runtime exception.
