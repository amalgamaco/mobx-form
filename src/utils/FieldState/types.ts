import type { FieldValidator } from '../../validators';
import type Form from '../../Form';

export type FieldOnChangeCallback<ValueType> = (
	newValue: ValueType, parentForm?: Form
) => void;

export interface FieldStateParams<ValueType> {
	label?: string,
	defaultValue: ValueType,
	value?: ValueType,
	validators?: FieldValidator<ValueType>[],
	disabled?: boolean,
	onChange?: FieldOnChangeCallback<ValueType>
}
