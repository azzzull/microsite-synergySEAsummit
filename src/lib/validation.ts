import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

export interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  country: string;
  memberId: string;
  ticketQuantity: number;
}

export class InputValidator {
  
  /**
   * Validate and sanitize registration data
   */
  static validateRegistration(data: any): ValidationResult {
    const errors: string[] = [];
    const sanitized: Partial<RegistrationData> = {};

    // Full Name validation
    if (!data.fullName || typeof data.fullName !== 'string') {
      errors.push('Full name is required');
    } else {
      const cleanName = DOMPurify.sanitize(data.fullName.trim());
      if (cleanName.length < 2 || cleanName.length > 100) {
        errors.push('Full name must be between 2-100 characters');
      } else if (!/^[a-zA-Z\s\-'.]+$/.test(cleanName)) {
        errors.push('Full name contains invalid characters');
      } else {
        sanitized.fullName = cleanName;
      }
    }

    // Email validation
    if (!data.email || typeof data.email !== 'string') {
      errors.push('Email is required');
    } else {
      const email = data.email.toLowerCase().trim();
      if (!validator.isEmail(email)) {
        errors.push('Invalid email format');
      } else {
        sanitized.email = validator.normalizeEmail(email) || email;
      }
    }

    // Phone validation
    if (!data.phone || typeof data.phone !== 'string') {
      errors.push('Phone number is required');
    } else {
      const phone = data.phone.replace(/\D/g, ''); // Remove non-digits
      if (!/^(\+?62|0)[0-9]{9,13}$/.test(data.phone)) {
        errors.push('Invalid Indonesian phone number format');
      } else {
        sanitized.phone = data.phone.trim();
      }
    }

    // Date of birth validation
    if (!data.dob) {
      errors.push('Date of birth is required');
    } else {
      if (!validator.isDate(data.dob)) {
        errors.push('Invalid date format');
      } else {
        const dobDate = new Date(data.dob);
        const now = new Date();
        const age = now.getFullYear() - dobDate.getFullYear();
        
        if (age < 16 || age > 120) {
          errors.push('Age must be between 16-120 years');
        } else {
          sanitized.dob = data.dob;
        }
      }
    }

    // Address validation
    if (!data.address || typeof data.address !== 'string') {
      errors.push('Address is required');
    } else {
      const cleanAddress = DOMPurify.sanitize(data.address.trim());
      if (cleanAddress.length < 10 || cleanAddress.length > 500) {
        errors.push('Address must be between 10-500 characters');
      } else {
        sanitized.address = cleanAddress;
      }
    }

    // Country validation
    if (!data.country || typeof data.country !== 'string') {
      errors.push('Country is required');
    } else {
      const validCountries = [
        'Indonesia', 'Singapore', 'Malaysia', 'Thailand', 'Philippines',
        'Vietnam', 'Brunei', 'Cambodia', 'Laos', 'Myanmar'
      ];
      
      if (!validCountries.includes(data.country)) {
        errors.push('Invalid country selection');
      } else {
        sanitized.country = data.country;
      }
    }

    // Member ID validation
    if (!data.memberId || typeof data.memberId !== 'string') {
      errors.push('Member ID is required');
    } else {
      const memberId = data.memberId.replace(/\D/g, ''); // Remove non-digits
      if (!/^\d{6,}$/.test(memberId)) {
        errors.push('Member ID must contain at least 6 digits');
      } else {
        sanitized.memberId = memberId;
      }
    }

    // Ticket quantity validation
    if (!data.ticketQuantity || typeof data.ticketQuantity !== 'number') {
      if (typeof data.ticketQuantity === 'string') {
        const qty = parseInt(data.ticketQuantity);
        if (isNaN(qty) || qty < 1 || qty > 10) {
          errors.push('Ticket quantity must be between 1-10');
        } else {
          sanitized.ticketQuantity = qty;
        }
      } else {
        errors.push('Invalid ticket quantity');
      }
    } else {
      if (data.ticketQuantity < 1 || data.ticketQuantity > 10) {
        errors.push('Ticket quantity must be between 1-10');
      } else {
        sanitized.ticketQuantity = data.ticketQuantity;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? sanitized : undefined
    };
  }

  /**
   * Validate admin login data
   */
  static validateAdminLogin(data: any): ValidationResult {
    const errors: string[] = [];
    const sanitized: any = {};

    // Username validation
    if (!data.username || typeof data.username !== 'string') {
      errors.push('Username is required');
    } else {
      const username = DOMPurify.sanitize(data.username.trim().toLowerCase());
      if (username.length < 3 || username.length > 50) {
        errors.push('Username must be between 3-50 characters');
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
      } else {
        sanitized.username = username;
      }
    }

    // Password validation (don't sanitize passwords, just validate)
    if (!data.password || typeof data.password !== 'string') {
      errors.push('Password is required');
    } else if (data.password.length < 8 || data.password.length > 128) {
      errors.push('Password must be between 8-128 characters');
    } else {
      sanitized.password = data.password; // Keep original password
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? sanitized : undefined
    };
  }

  /**
   * Validate voucher code
   */
  static validateVoucherCode(code: any): ValidationResult {
    const errors: string[] = [];
    
    if (!code || typeof code !== 'string') {
      errors.push('Voucher code is required');
      return { isValid: false, errors };
    }

    const cleanCode = DOMPurify.sanitize(code.trim().toUpperCase());
    
    if (!/^[A-Z0-9]{3,20}$/.test(cleanCode)) {
      errors.push('Invalid voucher code format');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? { code: cleanCode } : undefined
    };
  }

  /**
   * Validate pricing data
   */
  static validatePricingData(data: any): ValidationResult {
    const errors: string[] = [];
    const sanitized: any = {};

    // Price validation
    if (data.price === undefined || data.price === null) {
      errors.push('Price is required');
    } else {
      const price = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
      if (isNaN(price) || price < 0 || price > 10000000) {
        errors.push('Price must be between 0 and 10,000,000');
      } else {
        sanitized.price = Math.round(price);
      }
    }

    // Normal price validation
    if (data.normal_price !== undefined && data.normal_price !== null) {
      const normalPrice = typeof data.normal_price === 'string' ? parseFloat(data.normal_price) : data.normal_price;
      if (isNaN(normalPrice) || normalPrice < 0 || normalPrice > 10000000) {
        errors.push('Normal price must be between 0 and 10,000,000');
      } else {
        sanitized.normal_price = Math.round(normalPrice);
      }
    }

    // Early bird date validation
    if (data.early_bird_until && !validator.isISO8601(data.early_bird_until)) {
      errors.push('Invalid early bird date format');
    } else if (data.early_bird_until) {
      sanitized.early_bird_until = data.early_bird_until;
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? sanitized : undefined
    };
  }

  /**
   * General purpose sanitization for string data
   */
  static sanitizeString(input: any, maxLength: number = 1000): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    const cleaned = DOMPurify.sanitize(input.trim());
    return cleaned.substring(0, maxLength);
  }

  /**
   * Validate and sanitize query parameters
   */
  static validateQueryParams(params: any, allowedParams: string[]): any {
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(params)) {
      if (allowedParams.includes(key) && value !== undefined) {
        if (typeof value === 'string') {
          sanitized[key] = this.sanitizeString(value, 100);
        } else if (typeof value === 'number' && !isNaN(value)) {
          sanitized[key] = value;
        }
      }
    }
    
    return sanitized;
  }
}
