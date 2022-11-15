# MobX Form
Welcome to MobX Form, a Typescript package that provides form state management with MobX!

If you need to make a form in your ReactJS or React Native app, and you already have components for inputs, radio lists, checklists, date pickers, etc, but you need something to easily manage all the form logic, i.e. the state of the fields, their validations and error messages, and the general state of the form, then this library is for you.

It gives you a [Form](https://git.amalgama.co/amalgama/packages/npm/mobx-form/-/wikis/Reference/Form) class and classes for different types of fields. These classes provide you with MobX-observable instances whose behaviors involve changing field/form state, validating it, showing error messages at the correct time, handling submit, etc, in pure OOP style, and all you have to do is plug-in these instances in your form and field UI components which will need little to zero state management but will give life to your form.

## Installation

Run the following command to add the `MobX Form` library to your project:

```bash
yarn add @amalgama/mobx-form
```

## Getting started

If you want to take a quick look at how this library is used then you can go ahead with the [Getting started](https://git.amalgama.co/amalgama/packages/npm/mobx-form/-/wikis/Getting-started) section. Apart from that:
- The [Design principles](https://git.amalgama.co/amalgama/packages/npm/mobx-form/-/wikis/Design-principles) section covers the core ideas behind this library and how it is meant to be used.
- The [Reference](https://git.amalgama.co/amalgama/packages/npm/mobx-form/-/wikis/Reference) section provides details about available classes, methods, parameters, etc.
- The [Contributing](https://git.amalgama.co/amalgama/packages/npm/mobx-form/-/wikis/Contributing) section talks about how you can contribute to the project.
