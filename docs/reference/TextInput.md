# TextInput

The most common type of field. A `TextInput` is just an [`Input<string>`](./Input.md). These are the only differences:
- The `defaultValue` parameter in the constructor is optional, and if it's not provided, it will default to an empty string.
- To avoid typing `new TextInput` for creating the inputs and passing them to the form constructor, a simple `textInput` function is provided which directly creates a `TextInput` for you with the parameters you pass to it, which are exactly the ones expected by the constructor.

Example:

```ts
import { textInput } from '@amalgamaco/mobx-form';

const form = new Form( {
	fields: {
		// Both initial value and default value will be ''
		firstName: textInput( {
			label: 'First name',
			placeholder: 'Enter your first name'
		} ),
		// Initial value will be 'Rodriguez'
		// However, calling clear() on it will set the value to ''
		lastName: textInput( {
			label: 'Last name',
			placeholder: 'Enter your last name',
			value: 'Rodriguez'
		} )
	},
	...
} );
```
