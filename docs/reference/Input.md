# Input

Base class for inputs. Inherits from [`Field<T>`](./Field.md). This input class still accepts an arbitrary type `T` for its value, which means you can have `Input<number>` apart from `Input<string>` if it's suitable for you.

```ts
class Input<T>
```

## Methods
It inherits everything from [`Field<T>`](./Field.md) and adds the following properties and methods.

### constructor

```ts
constructor( params: InputParams<T> ): Input<T>
```

Constructs a new input.

**Parameters**

Every parameter accepted by [`Field<T>`'s constructor](./Field.md#constructor), plus:

| Name | Type | Description | Required/Default |
| ---- | ---- | ----------- | ---------------------- | 
| `placeholder` | `string` | The input's placeholder. | `''` |
| `showErrors` | `'onWrite' \| 'onBlur' \| 'onSubmit'` | Error-display behavior. | `'onBlur'` |
| `onFocus` | `( form?: Form ) => void` | Callback to execute when input is focused. | `() => undefined` |
| `onBlur` | `( form?: Form ) => void` | Callback to execute when input is blurred. | `() => undefined` |

The input will show and hide errors according to the `showErrors` parameter, that can take the following values:
- `onWrite`: displayed error message is always synchronized with the current input's value. It shows and hides errors as the end user writes on the input. The only exception occurs at the beginning, when nothing was written yet; no error will be displayed at that moment until something is actually written.
- `onBlur`: when the input becomes invalid, no error message will be shown until the input is blurred. Once it is blurred, the message will be displayed until a valid value is written again, in which case the error message will be gone immediately, without the need of blurring the input again. The idea behind this is to let the end user know as soon as possible that he/she has "fixed" the invalidity of the field.
- `onSubmit`: the displayed error message won't change at all. It will only be updated by the form itself when it is submitted. However, if an error is being shown, the behavior of "hide it as soon as the input is valid again" provided by the `onBlur` config is also true for `onSubmit`.

### placeholder

```ts
placeholder: string
```

Returns the placeholder passed in constructor.

### isFocused

```ts
isFocused: boolean
```

Returns whether the input is focused or not.

### focus

```ts
focus(): void
```

Focuses the input. This executes the `onFocus` callback passing the parent form as parameter, if the input was not previously focused.

### write

```ts
write( newValue: T ): void
```

Writes a value in the input. The entered value overwrites the previous one.

This method will focus the input if it was not already focused, and may change the displayed error message according to the configuration given in constructor.

### blur

```ts
blur(): void
```

Blurs the input. This method may change the displayed error message according to the configuration given in constructor. It also executes the `onBlur` callback passing the parent form as parameter, if the input was previously focused.
