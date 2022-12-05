import type { FieldStateParams } from '../utils/FieldState';

export type FieldParams<ValueType> = FieldStateParams<ValueType> & { hint?: string };

export type AnnotatedPrivateFieldProps = '_state' | '_presentedError';
