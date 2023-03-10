# Getting started

## Creating a form
If you need a form in your app, then just create an instance of `Form` with the fields you need. For example, this creates a sign up form with two text inputs, `email` and `password`, and performs the sign up on submit:

```ts
import {
	email,
	Form,
	minLength,
	required,
	textInput
} from '@amalgama/mobx-form';

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

Where do you create this form? If you follow Amalgama's MobX architecture then you will probably want to create it inside a presenter that models the screen in which you need the form, storing it as a property.

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
} from '@amalgama/mobx-form';

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
const email = form.select<TextInput>( 'email' );
// Idem for 'password'
const password = form.select<TextInput>( 'password' );
```

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
