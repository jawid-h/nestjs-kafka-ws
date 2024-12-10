import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isIpPort', async: false })
export class IsIpPortValidator implements ValidatorConstraintInterface {
    validate(value: string): boolean {
        // Regular expression to validate IP:port format
        const ipPortRegex =
            /^((([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}|localhost|((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?))):(\d{1,5})$/;

        if (!value) return false; // Ensure value exists
        if (!ipPortRegex.test(value)) return false;

        // Ensure port is in valid range (1-65535)
        const port = parseInt(value.split(':')[1], 10);
        return port >= 1 && port <= 65535;
    }

    defaultMessage(args: ValidationArguments): string {
        return `${args.property} must be a valid IP:port combination (e.g., 192.168.1.1:8080)`;
    }
}
