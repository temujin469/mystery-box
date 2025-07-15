/**
 * Currency utility functions for handling decimal prices and formatting
 * 
 * This module provides robust currency handling for real money transactions
 * with proper decimal precision (2 decimal places) and validation.
 */

/**
 * Validates and formats decimal currency values
 * @param value - The value to validate (can be string or number)
 * @returns Valid decimal number with 2 decimal places or null if invalid
 * @example
 * validateDecimalCurrency(123.456) // returns 123.46
 * validateDecimalCurrency("123.45") // returns 123.45
 * validateDecimalCurrency("-10") // returns null
 * validateDecimalCurrency("abc") // returns null
 */
export const validateDecimalCurrency = (value: number | string): number | null => {
  // Convert string to number if needed
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (typeof numValue !== 'number' || numValue < 0 || !Number.isFinite(numValue)) {
    return null;
  }
  
  // Round to 2 decimal places for currency
  const rounded = Math.round(numValue * 100) / 100;
  return parseFloat(rounded.toFixed(2));
};

/**
 * Formats currency value for display
 * @param value - The currency value to format (can be string or number)
 * @returns Formatted currency string with ₮ symbol
 * @example
 * formatCurrency(123.45) // returns "123.45₮"
 * formatCurrency("123.45") // returns "123.45₮"
 * formatCurrency(0) // returns "0.00₮"
 */
export const formatCurrency = (value: number | string): string => {
  const validatedValue = validateDecimalCurrency(value);
  if (validatedValue === null) return "0.00₮";
  return `${validatedValue.toFixed(2)}₮`;
};

/**
 * Checks if user has sufficient balance for a transaction
 * @param userCoins - User's current coin balance (can be string or number)
 * @param requiredAmount - Amount needed for the transaction (can be string or number)
 * @returns True if user has sufficient balance
 * @example
 * hasSufficientBalance(100.50, 50.25) // returns true
 * hasSufficientBalance("100.50", "150.00") // returns false
 */
export const hasSufficientBalance = (userCoins: number | string, requiredAmount: number | string): boolean => {
  const validUserCoins = validateDecimalCurrency(userCoins) || 0;
  const validRequiredAmount = validateDecimalCurrency(requiredAmount);
  
  return validRequiredAmount !== null && validUserCoins >= validRequiredAmount;
};
