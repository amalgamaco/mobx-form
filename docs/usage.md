# Usage

## Table of Contents

- [Creating a form](#creating-a-form)
	* [Forms for updating some information](#forms-for-updating-some-information)
- [Using form methods](#using-form-methods)
- [Rendering a form](#rendering-a-form)
- [Triggering side effects when interacting with fields](#triggering-side-effects-when-interacting-with-fields)
	* [onChange](#onchange)
	* [onFocus and onBlur](#onfocus-and-onblur)
- [Tweaking global configuration](#tweaking-global-configuration)

## Creating a form

If you need a form in your app, then just create an instance of `Form` with the fields you need. For example, this creates a sign up form with two text inputs, `email` and `password`, and performs the sign up on submit:

```ts
import {
	email,
	Form,
	minLength,
	required,
	textInput
} from '@amalgamaco/mobx-form';

...

// A sign up form
const form = new Form( {
	fields: {
		email: textInput( {
			label: 'Email',
			placeholder: 'myemail@gmail.com',
			validators: [ required(), email() ],
			disabled: false
		} ),
		password: textInput( {
			label: 'Password',
			hint: 'Provide at least 8 characters',
			validators: [ required(), minLength( 8 ) ],
			disabled: false
		} )
	},
	onSubmit: async ( form ) => {
		// Suppose signUpUser is an interactor
		await signUpUser.execute( form.values as MySignUpParams );
	}
} );
```

Where do you create this form? The simplest way is to create it as part of the state of the component in which you will render the form, i.e. create it with a `useState` call. The form instance will always be the same but, since it is a MobX observable, the actions on it will trigger the appropriate re-renders as long as you wrap your component with the [`observer`](https://mobx.js.org/react-integration.html#react-integration) HoC from `mobx-react` or `mobx-react-lite` packages.

However, you are free to use any variant you wish, such us accessing it through a prop, through a React context, storing it inside another, bigger MobX observable object that your component uses, etc.

### Forms for updating some information

If you want a form for *updating* something, then you will probably want to:
- Auto-fill the form's fields with some values. E.g. if you are editing your username, then you want your `username` field to start with your existing username so that you can edit it as you wish.
- When submitting, only take into account what you actually changed.

Here is how you can make a form for updating a "post" in a social network, that has a title, description and visibility (`'public'` or `'private'`):

```ts
import {
	Form,
	maxLength,
	required,
	select,
	textInput
} from '@amalgamaco/mobx-form';

...

// Suppose that, in this variable, you have the instance of the "Post" you want to update.
// You will probably retrieve it from your global app state.
const post = ...;

// A form for updating the post
const form = new Form( {
	fields: {
		title: textInput( {
			label: 'Title',
			placeholder: 'My awesome post',
			validators: [ required(), maxLength( 30 ) ],
			value: post.title
		} ),
		description: textInput( {
			label: 'Description',
			placeholder: 'I wanted to share some important thoughts...',
			validators: [ maxLength( 250 ) ],
			value: post.description
		} ),
		visibility: select( {
			label: 'Visibility',
			validators: [ required() ],
			value: post.visibility
		} )
	},
	onSubmit: async ( form ) => {
		// Suppose updatePost is an interactor
		const attributesToUpdate = form.dirtyValues as PostUpdateParams;
		await updatePost.execute( post.id, attributesToUpdate );
	}
} );
```

Note that we gave each field a `value`, which is the initial value we want the field to have. Also, when submitting, we ask the form for its `dirtyValues`, that gives as the values that actually changed, so that you don't send to your backend values that didn't change at all.

## Using form methods
Once you created your form you can ask it several things, for instance, `isValid`, `isDirty`, `values`, `dirtyValues`, and perform some actions on it like `submit()` and `reset()`. You can find more information in the [Form](reference/Form.md) section of the [Reference](reference.md).

You can also get any of its fields. Each field is an instance of some subclass of `Field<T>`. In the example above, we defined the `email` and `password` fields as text inputs (because we used the `textInput` constructor), that's why they are instances of `TextInput`, subclass of `Input<string>`, which is itself subclass of `Field<string>`.

The form stores the fields internally in a key-value object and it has no way of knowing the *type* of each field, that's why you need to specify them when retrieving them from the form:

```ts
// Returns the 'email' field we described above, as a TextInput
const email = form.field<TextInput>( 'email' );
// Idem for 'password'
const password = form.field<TextInput>( 'password' );
```

And then you can ask the field for its `value`, `error`, whether it `isValid`, `isDirty`, `isDisabled`, etc. You can find more information in the [Field](reference/Field.md) section of the reference.

## Rendering a form
Ok, we have a form and we have its fields. How do we actually show them in the UI? By rendering your form components with props that use those fields and the form itself. Remember that the created form and fields are observable in MobX terms, so if your components are wrapped with the `observer` decorator from `mobx-react-lite` package, then they will be re-rendered with changes that occur in the form and any of its fields.

```jsx
...
<TextInput
	label={email.label}
	hint={email.hint}
	placeholder={email.placeholder}
	value={email.value}
	error={email.error}
	disabled={email.isDisabled}
	onChangeText={text => email.write( text )}
	onFocus={() => email.focus()}
	onBlur={() => email.blur()}
/>
// ... The same with password
<Button onPress={() => form.submit()}>Sign Up</Button>
```

Here, `TextInput` would be some component in your app which renders a text input including a label, error message, etc. That component is expected to be controlled, because all the field logic is driven by the `Field` object.

**IMPORTANT**: for inputs, like in the example, **you must always focus and blur it when the input component itself is focused or blurred**. If you forget this then the error messages triggered by the validators won't be properly shown, since the logic behind showing or hiding them relies on the input being focused and blurred.

You can quickly see that rendering your `TextInput` like that for each field you have would be quite tedious. That's why it is a good idea to define a hook or something that, given a particular type of field, returns all the props necessary for your UI component that corresponds to that type of field, ready to be passed in a single line with the spread notation `...` .

## Triggering side effects when interacting with fields

If you want your form's fields to trigger custom side effects when you perform actions on them, you can use a set of callbacks that you associate to these actions.

### onChange

One of these actions is changing the value of a field. Each particular type of field offers its own way of changing the inner value, but the fact is that it eventually changes. You can pass an `onChange` callback when constructing a field so that, when the value changes, the callback gets executed:

```ts
const form = new Form( {
	fields: {
		title: textInput( {
			label: 'Title',
			validators: [ required(), maxLength( 30 ) ],
			onChange: () => console.log( 'Title changed!' )
		} ),
		...
	}
} );

const title = form.field<TextInput>( 'title' );
title.write( 'Special title' ); // Logs 'Title changed!'
```

In the callback, you can receive both the new value and the form itself if you need. This brings the possibility of implementing very specific and custom behaviour for your forms in an elegant way. For instance, here is a somewhat strange example in which we want the title of a post to be prepended with `'Private - '` when the user selects private visibility.

```ts
const form = new Form( {
	fields: {
		title: textInput( {
			label: 'Title',
			validators: [ required(), maxLength( 30 ) ]
		} ),
		visibility: select( {
			label: 'Visibility',
			validators: [ required() ],
			onChange: ( newVisibility, form ) => {
				if ( newVisibility === 'private' ) {
					const title = form?.field<TextInput>( 'title' );
					title?.write( `Private - ${title.value}` );
				}
			}
		} )
	}
} );
```

### onFocus and onBlur

For the particular case of inputs, you can trigger side effects when focusing and blurring them, with the callbacks `onFocus` and `onBlur` respectively. These callbacks accept the `Form` instance as parameter.

For example, you could have a "city" field that is just a text input, but your app may show suggestions in a dropdown when the input is focused. It could look something like this:

```ts
const form = new Form( {
	fields: {
		city: textInput( {
			label: 'City',
			onFocus: () => logicForShowingCitySuggestions(),
			onBlur: () => logicForHidingCitySuggestions()
		} ),
		...
	}
} );
```

## Tweaking global configuration

There are some configuration options that affect multiple parts of the library; their primary purpose is to provide default values for several optional parameters like error messages for field validators and error-display behaviour for inputs.

If you want to change the default validation messages across your app, and, for example, you want all of your inputs to display their error messages only when the form is submitted (by default) then you can easily achieve this by tweaking the global `config` object (typically in some module initialization):

```ts
import { config } from '@amalgamaco/mobx-form';

// Change the default error-display behaviour for inputs
config.inputs.showErrors = 'onSubmit';

// Change several error messages
config.validators.email.message = 'The email is not valid';
config.validators.maxLength.message = 'Cannot type more than :length characters';
config.validators.required.message = 'This field is required';
```

You can also use the function `configure` that lets you specify only the options you want to override in a single object. This is how you would use it to change the same options from above:

```ts
import { configure } from '@amalgamaco/mobx-form';

configure( {
	inputs: {
		showErrors: 'onSubmit';
	},
	validators: {
		email: { message: 'The email is not valid' },
		maxLength: { message: 'Cannot type more than :length characters' },
		required: { message: 'This field is required' },
	}
} );
```
