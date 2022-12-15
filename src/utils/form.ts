export function isValidEmail(email: string): boolean {
  // Create a regular expression to match the email address format
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  // Use the regular expression to check if the email address is in the correct format
  return emailRegex.test(email)
}
