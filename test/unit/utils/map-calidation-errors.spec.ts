import { mapValidationErrors } from '../../../src/utils/map-validation-errors';
import { ValidationErrorItem } from 'joi';

describe('mapValidationErrors', () => {
    it('should map single validation error correctly', () => {
        const errors: ValidationErrorItem[] = [
            {
                message: 'username should not be empty',
                path: ['username'],
                type: 'any.empty',
                context: {
                    label: 'username',
                    key: 'username',
                },
            },
        ];

        const result = mapValidationErrors(errors);

        expect(result).toContainEqual('username: username should not be empty');
    });

    it('should map multiple validation errors correctly', () => {
        const errors: ValidationErrorItem[] = [
            {
                message: 'username should not be empty',
                path: ['username'],
                type: 'any.empty',
                context: {
                    label: 'username',
                    key: 'username',
                },
            },
            {
                message:
                    'password must be longer than or equal to 6 characters',
                path: ['password'],
                type: 'string.min',
                context: {
                    limit: 6,
                    label: 'password',
                    key: 'password',
                },
            },
        ];

        const result = mapValidationErrors(errors);

        expect(result).toContainEqual('username: username should not be empty');
        expect(result).toContainEqual(
            'password: password must be longer than or equal to 6 characters',
        );
    });

    it('should handle nested validation errors', () => {
        const errors: ValidationErrorItem[] = [
            {
                message: 'email must be an email',
                path: ['user', 'profile', 'email'],
                type: 'string.email',
                context: {
                    label: 'email',
                    key: 'email',
                },
            },
        ];

        const result = mapValidationErrors(errors);

        expect(result).toContainEqual(
            'user.profile.email: email must be an email',
        );
    });

    it('should return an empty object if no errors are provided', () => {
        const errors: ValidationErrorItem[] = [];

        const result = mapValidationErrors(errors);

        expect(result).toEqual([]);
    });
});
