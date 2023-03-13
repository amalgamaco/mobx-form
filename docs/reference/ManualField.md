# ManualField

Base class for manual fields. Inherits from [`Field<T>`](./Field.md).

```ts
class ManualField<T>
```

A *manual field* is a field that has no particular behavior at all. It is essentially a [`Field<T>`](./Field.md), but with the ability to manually set the value. Validation errors will be displayed immediately if an invalid value is set.

In what situation a manual field would be useful? Basically, if you have a React component that renders some kind of controlled field, but it already handles a big part of the interaction with the end user and it simply needs a `value` prop and an `onChange` callback (plus the common props like `label` and `error`), then a `ManualField` could be enough: you simply change its value in the `onChange` callback. There are no special interactions like focusing and bluring which apply to inputs, or maybe they exist, but are irrelevant for the field's state and they are handled completely at the component/UI level.

For example, in a checklist you can press any of the options, and depending on whether the option was already checked or not, different things happen. But you may have a `Checklist` component that already handles the checked/unchecked status of each option, and it simply provides you the array of new selected options in an `onChange` callback, while taking the actual selected options in a `value` prop. In this case you could use a `ManualField<string[]>` for keeping track of the checklist's selected options.

You could also use it for date pickers. The functionality of choosing a date through the picker is implemented in some component, and then in its `onChange` callback you can update the value of a `ManualField<Date>` that keeps track of the selected date.

These examples are so common, that the library already provides the [`select`](./select.md) and [`multiSelect`](multiSelect.md) fields, which are manual fields under the hood but have some facilities for the two examples given above.

## Methods
It inherits everything from [`Field<T>`](./Field.md) and adds the following methods.

### change

```ts
change( newValue: T ): void
```

Sets a new value, overwriting the previous one.

The field's error message is immediately synchronized with the entered value:
- If the value is valid, `error` will start returning `''`.
- If the value is invalid, `error` will start returning the associated error message.

### set

```ts
set( newValue: T ): void
```

Alias of `change`.

### select

```ts
select( newValue: T ): void
```

Alias of `change`.
