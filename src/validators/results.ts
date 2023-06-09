import type { ValidationResult } from './types';

export const valid = (): ValidationResult => ( {
	isValid: true, error: ''
} );

export const invalid = ( error: string ): ValidationResult => ( {
	isValid: false, error
} );
