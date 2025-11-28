// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Password validation
  export const isValidPassword = (password: string): {
    valid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
  
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
  
    return {
      valid: errors.length === 0,
      errors
    };
  };
  
  // Phone number validation (Indian format)
  export const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleaned = phone.replace(/\D/g, '');
    return phoneRegex.test(cleaned);
  };
  
  // Amount validation
  export const isValidAmount = (amount: string | number): boolean => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return !isNaN(num) && num > 0;
  };
  
  // Name validation
  export const isValidName = (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 50;
  };
  
  // Required field validation
  export const isRequired = (value: string | number | null | undefined): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  };
  
  // Date validation
  export const isValidDate = (date: string): boolean => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  };
  
  // Future date validation
  export const isFutureDate = (date: string): boolean => {
    const d = new Date(date);
    const now = new Date();
    return d > now;
  };
  
  // Past date validation
  export const isPastDate = (date: string): boolean => {
    const d = new Date(date);
    const now = new Date();
    return d < now;
  };
  
  // Form validation helper
  export const validateForm = (
    fields: { [key: string]: any },
    rules: { [key: string]: (value: any) => boolean | { valid: boolean; errors: string[] } }
  ): { valid: boolean; errors: { [key: string]: string[] } } => {
    const errors: { [key: string]: string[] } = {};
  
    Object.keys(rules).forEach(field => {
      const value = fields[field];
      const validator = rules[field];
      const result = validator(value);
  
      if (typeof result === 'boolean') {
        if (!result) {
          errors[field] = [`${field} is invalid`];
        }
      } else {
        if (!result.valid) {
          errors[field] = result.errors;
        }
      }
    });
  
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  };