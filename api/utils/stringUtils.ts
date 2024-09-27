/**
 * Escapes special characters in a string for use in a regular expression.
 * @param string The string to escape.
 * @returns The escaped string.
 */
export const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
