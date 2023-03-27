# multiSelect

A *multi select* is very similar to a [`select`](./select.md), but lets the user select multiple values instead of only one.

According to this definition, a very common concrete type of field that behaves like a multi select is the *checklist*, which is basically a set of checkboxes.

Just like with selects, multi selects are provided as special cases of [`ManualField`](ManualField.md). Their value type is an array, and the defualt value for the field is `[]`.

```ts
multiSelect<T = string>( params: MultiSelectParams<T> ): ManualField<T[]>
```

The parameters accepted are the same as the ones accepted by `Field` constructor, with the only difference being that `defaultValue` is optional and defaults to `[]`.

The library also exports the `MultiSelect<T>` type definition for convenience:

```ts
type MultiSelect<T> = ManualField<T[]>;
```

Remember that, since a multi select is just a `ManualField`, for changing its value you can use either `change`, `set` or `select`, which are all aliases.

**Example**:

```ts
import { multiSelect } from '@amalgamaco/mobx-form';

const form = new Form( {
	fields: {
		interests: multiSelect( {
			label: 'Interests'
		} )
	},
	...
} );

const interests = form.field<MultiSelect<string>>( 'interests' );
interests.value; // []
interests.set( [ 'music', 'sports' ] );
interests.value; // [ 'music', 'sports' ]
interests.set( [ 'music' ] );
interests.value; // [ 'music' ]
interests.clear();
interests.value; // []
```
