# Form

The class for representing forms.

## Methods
The `Form` class has the following methods:

### constructor

```ts
constructor( params: FormParams ): Form
```

Constructs a new form.

**Parameters**

| Name | Type | Description | Required/Default |
| ---- | ---- | ----------- | ---------------------- | 
| `fields` | `Record<string, Field<any>>` | An object where each key is the identifier of a field and the value is the field itself. | Required |
| `onSubmit` | `( form: Form ) =>  void \| Promise<void>` | A callback to execute when the form is submitted. | Required |

Note that the `onSubmit` callback may or may not return a promise, but the form will wrap it in a promise anyway.

This means that, when submitting the form, you can opt to do something synchronously, or asynchronously; the latter is the most common option since a request is usually sent to a web service.

### values

```ts
values: Record<string, unknown>
```

Returns an object where each key is the identifier of a field and the value is the identified field's value. Example:

```ts
const form = new Form( {
	fields: {
		first: textInput( { value: 'first value' } ),
		second: new Input<number>( { value: 25 } )
	}
} );

form.values;
// returns { first: 'first value', second: 25 } as Record<string, unknown>
```  

### dirtyValues

```ts
dirtyValues: Record<string, unknown>
```

Same as `values`, but only for the dirty fields, i.e. for the fields whose values have changed from their initial ones.

Following the example above:

```ts
form.dirtyValues; // returns {}
form.select<TextInput>( 'first' ).write( 'Now is dirty' );
form.dirtyValues; // returns { first: 'Now is dirty' }
```

This is useful for forms destined to edit/update some information. In these forms you usually provide initial values to the fields, which are obtained from some entity that already exists in the backend. When submitting the form, you want to make a PATCH request to update the entity. A good idea is to only send, in the request body, the properties that actually changed, so that the web service has less work to do. And a quick way of knowing which properties have to be changed, is to ask the form itself with `dirtyValues`.

### isValid

```ts
isValid: boolean
```

Returns `true` if all of the **enabled** form's fields are valid, and `false` otherwise. Disabled fields are ignored.

### isDirty

```ts
isDirty: boolean
```

Returns `true` if at least one field is dirty.

### isReadyToSubmit

```ts
isReadyToSubmit: boolean
```

Returns `true` if all the following conditions are true:
- The form is valid.
- The form is dirty.
- The form is not being submitted.

The motivation for this method is that it's common for some apps to disable submit buttons as long as one of those conditions is not satisfied. In Amalgama's MobX architecture this logic tends to be repeated in all presenters, so this method, with a not so happy name, tries to facilitate it.

### isSubmitting

```ts
isSubmitting: boolean
```

Returns `true` if `submit()` was called on the form, it called the `onSubmit` callback passed in constructor, and the promise returned by the callback was not resolved nor rejected yet.

For example, if your `onSubmit` makes a request to the WS, returning the corresponding promise, then `isSubmitting` will return `true` until the request is finished.

Can be useful for showing loaders at the UI level while the end user waits for the form to be submitted.

### select

```ts
select<T>( fieldKey: string ): T
```

Returns the field whose key (the identifier it was given when constructing the form) is `fieldKey`, as a field of type `T`. Here `T` must satisfy the constraint of being a `Field<V>` for some `V`. If `T` is not provided, it defaults to `Field<unknown>`.

```ts
form.select<TextInput>( 'email' ); // Returns the field as a TextInput
form.select( 'email' ); // Returns the field as a Field<unknown>
form.select<OtherFieldType>( 'email' ); // Returns the field as an OtherFieldType
```

This is currently a limitation, since the form internally stores the fields in a key-value object, and at compile time there is no information about the concrete types of them. Ideally, obtaining a form's field would return something with the expected field type, without requiring any type assertions or other similar workarounds, but it's currently not possible.

One way to mitigate this is to define your own `Form` subclasses for the different forms in your app, where you can define getters for your fields with consistent typing, and you can even make the getters `values` and `dirtyValues` return something more specific than `Record<string, unknown>`.

```ts
class LoginForm extends Form {
	constructor() {
		super( {
			fields: {
				username: textInput( { ... } ),
				password: textInput( { ... } )
			},
			onSubmit: ...
		} );
	}

	get username() {
		return this.select<TextInput>( 'username' );
	}

	get password() {
		return this.select<TextInput>( 'password' );
	}

	get values() {
		return super() as { username: string, password: string };
	}

	...
}
```

This way you centralize all type assertions so that, from the outside, you have no typing issues when accessing the form or its fields. You can even perform additional logic like converting empty text input values to `null` if you don't want to send empty strings to the web service.

However there are some drawbacks:
- It's a bit of boilerplate code.
- Care must be taken when overriding `values` and `dirtyValues`, since they are MobX computeds. An alternative, perhaps even better, is to use composition over inheritance, e.g. `LoginForm` would internally store the `Form` instance. You would need to delegate all `Form` getters and methods though.

Do what is more convenient and comfortable for you ;)

### submit

```ts
submit(): Promise<void>
```

Submits the form. Calling the method will make the form:
1) Call `syncError` on all of its fields. so that they show any error they have to show in case they are invalid. This way the end user knows exactly what is invalid and what not at the moment of submitting, independent of the types of the fields.
2) Return a resolved promise if the form is invalid or is already being submitted. In other words, the submit action is ignored.
3) Call the `onSubmit` callback passed in constructor, with the form itself as parameter, and return a promise that will be resolved or rejected when the one returned by `onSubmit` is resolved or rejected, respectively. If the `onSubmit`'s promise is rejected, the one returned by `submit` will be rejected with the same reason.

All these steps are performed synchronously, and this essentially protects against the common problem of double submits, in which the end user clicks the submit button twice, very quickly, and the form is effectively submitted twice. If your button's `onClick`/`onPress` callback synchronously calls `submit` on your form, double submits should not occur.

Step 3 is where the form is considered to be submitting, i.e. at that point `isSubmitting` will start returning `true`.

### clear

```ts
clear(): void
```

Clears all the fields (calls [`clear`](Field.md#clear)) on each of them).

### reset

```ts
reset(): void
```

Resets all the fields (calls [`reset`](Field.md#reset) on each of them).

### showErrors

```ts
showErrors( errors: Record<string, string> ): void
```

This method is like a shortcut for calling `showError` on each field. Basically, for each key-error pair in the given `errors` object, shows the error message in the field identified by the key. Can be useful if the backend returns errors for each field and they can be directly shown on the form.
