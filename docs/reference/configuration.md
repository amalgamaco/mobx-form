# Configuration

The library exports the global `config` object which is initialized as:

```ts
const config: Config = {
	inputs: {
		// Default error-display behaviour for instances of Input<T>
		showErrors: 'onBlur'
	},
	validators: {
		// Default configurations for the corresponding validators
		email: { message: 'This email does not have a valid format' },
		length: { message: 'Must have exactly :length characters' },
		maxLength: { message: 'Must have at most :length characters' },
		minLength: { message: 'Must have at least :length characters' },
		required: { message: 'This field is mandatory' }
	}
};
```

The type `Config` is defined as:

```ts
interface Config {
	inputs: {
		showErrors: InputErrorDisplayConfig
	},
	validators: {
		email: EmailValidatorConfig,
		length: LengthValidatorConfig,
		maxLength: MaxLengthValidatorConfig,
		minLength: MinLengthValidatorConfig,
		required: RequiredValidatorConfig
	}
}
```

For more information about the configuration accepted by each validator, see the [Validator library](./validator_library.md) section.

The `config` object can have its properties explicitly assigned, or the function `configure` can be used.

### configure

```ts
configure( options: ConfigOptions ): void
```

Changes the `config` object by deep-merging it with the given `options`.

The type of `options`, `ConfigOptions`, is the same as `Config` but with all of its properties made optional.
