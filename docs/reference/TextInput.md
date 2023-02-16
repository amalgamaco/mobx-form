# TextInput

The most common type of field. A `TextInput` is just an `Input<string>`. These are the only differences:
- The `value` parameter in the constructor is optional, and if it's not provided, it will default to an empty string.
- To avoid typing `new TextInput` for creating the inputs and passing them to the form constructor, a simple `textInput` function is provided which directly creates a `TextInput` for you with the parameters you pass to it, which are exactly the ones expected by the constructor.

Example:

```ts
import { textInput } from '@amalgama/mobx-form';

const form = new Form( {
	fields: {
		// Initial value will be ''
		firstName: textInput( {
			label: 'First name',
			placeholder: 'Enter your first name'
		} ),
		// Initial value will be 'Rodriguez'
		lastName: textInput( {
			label: 'Last name',
			placeholder: 'Enter your last name',
			value: 'Rodriguez'
		} )
	},
	...
} );
```
