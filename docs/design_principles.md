# Design principles

## Field classes
One of the core ideas of the library relies on the fact that forms typically have different types of fields. Each of these offers a particular way of interacting with its instances. Text inputs are just one type of field, but there are also checkboxes, selects, multi-selects, date pickers, etc. You could even consider a "profile avatar" selector as a special kind of field.

The idea is to take advantage of object-oriented design to model these interactions. The library provides an abstract `Field` class from which particular field classes can inherit to define their own behavior. The most important and common one provided by the library is `TextInput`.

The `Form` class represents the form itself and is a set of `Field`'s, and provides properties and actions that work over those fields.

The library aims to be extendable to satisfy the need for different types of fields and avoid being an obstacle; this means that if you need a particular type of field which is not yet provided, you can **define your own subclass of `Field`** for it and use it in your forms and integrate its instances however you want with your UI components.

If there are different field classes, then what do they have in common? This is covered in detail in the [Field](reference/Field.md) section of the [Reference](reference.md), but we can briefly enumerate them:
- A label.
- A hint text.
- A value.
- Validators and valid/invalid state.
- Error message.
- Enabled/disabled state.
- Action for resetting the value.
- Action for manually showing an error message.

## Field value and validations
Each field has a *value*, which is an instance of some generic type `T` (number, string, array, etc) that represents the *current state* of the field. For text inputs this is simply the written string, for a date picker it could be a `Date`, for a multi-select probably an array of something, etc.

Since fields have values, they also have *validators*, which conceptually are functions that:
- Check if the value is valid.
- Provide an error message if it's not.

An important principle (and opinionated) the library follows, is that the "validity" state (e.g. valid or not valid) of a field (and form as well) is always synchronized with its current state. The act of "validating" the field is not driven from outside; in other words, if you use the getter `isValid` on some field, it will always return `true` or `false` according to its current value and what the validators return. For instance, in case the field is an input, it doesn't matter if you still didn't blur it, or you didn't submit the form, `isValid` always returns an up-to-date result; this isn't true for the error message that accompanies the field, as is noted in the following section.

The goal of this is to make it easier and intuitive to reason about the state of the field, and potentially condition some behavior in other parts of your code according to the validity status of your fields and form.

## Error messages
Error messages behave differently. They are produced by the validators, but the moment in which they are actually shown (through the `error` property) will depend on the type of the field and maybe how it is configured. For example, `TextInput`'s can be configured to show errors only when they are blurred, which is a common style followed in many apps. But they can also be updated as the input is written. Or, on the contrary, they can be updated only when the form is submitted.
