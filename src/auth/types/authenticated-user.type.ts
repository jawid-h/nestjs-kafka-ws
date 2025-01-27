/**
 * Represents an authenticated KeyCloack user.
 *
 * @typedef {Object} KeycloackAuthenticatedUser
 * @property {string} sub - The subject identifier for the user.
 * @property {string} preferred_username - The preferred username of the user.
 * @property {string} [email] - The email address of the user (optional).
 * @property {string} [name] - The full name of the user (optional).
 * @property {Object} [realm_access] - The realm access information (optional).
 * @property {string[]} [realm_access.roles] - The roles assigned to the user within the realm.
 * @property {Object} [resource_access] - The resource access information (optional).
 * @property {Object.<string, {roles: string[]}>} [resource_access] - The roles assigned to the user for each client.
 * @property {number} [iat] - The issued at time (optional).
 * @property {number} [exp] - The expiration time (optional).
 */
export type KeycloackAuthenticatedUser = {
    sub: string;
    preferred_username: string;
    email?: string;
    name?: string;
    realm_access?: {
        roles: string[];
    };
    resource_access?: {
        [clientId: string]: {
            roles: string[];
        };
    };
    iat?: number;
    exp?: number;
};
