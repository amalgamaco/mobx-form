# select

A *select* is a field that initially has no content, and lets the user *select* a value from a set of possible values. This selection is done instantly and there are no other interactions with the field apart from the common ones (clearing, resetting, etc.).

This is a broad and somewhat vague definition, that applies to these and many other specific fields you can find in any app:
- Simple dropdowns.
- Radio button lists.
- Date pickers (the ones that don't let you write a date manually, only pick).

In terms of this library, it is essentially a [`ManualField`](ManualField.md), that has `null` as its default value. That's why selects are provided with the function `select` and not with a separate class:

```ts
select<T = string>( params: SelectParams<T> ): ManualField<T | null>
```

As you can see the value type is `string` by default, since many UI libraries use strings for the values of select components. The parameters accepted are the same as the ones accepted by `Field` constructor, with the only difference being that `defaultValue` is optional and defaults to `null`.

The library also exports the `Select<T>` type definition for convenience:

```ts
type Select<T> = ManualField<T | null>;
```

Remember that, since a select is just a `ManualField`, for changing its value you can use either `change`, `set` or `select`, which are all aliases.

**Example**:

```ts
import { select } from '@amalgama/mobx-form';

const form = new Form( {
	fields: {
		favoriteLanguage: select( {
			label: 'Favorite language'
		} )
	},
	...
} );

const favoriteLanguage = form.field<Select<string>>( 'favoriteLanguage' );
favoriteLanguage.value; // null
favoriteLanguage.set( 'Ruby' );
favoriteLanguage.value; // 'Ruby'
favoriteLanguage.set( 'Typescript' );
favoriteLanguage.value; // 'Typescript'
favoriteLanguage.clear();
favoriteLanguage.value; // null
```
