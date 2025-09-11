#!/usr/bin/env node

/**
 * Password Hash Generator for Admin Setup
 * 
 * Usage: node generate-admin-password.js [password]
 * 
 * This utility generates a secure bcrypt hash for the admin password.
 * The hash should be stored in ADMIN_PASS_HASH environment variable.
 */

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const BCRYPT_ROUNDS = 12;

async function generatePasswordHash(password) {
  if (!password) {
    console.error('❌ Password is required');
    process.exit(1);
  }

  if (password.length < 12) {
    console.error('❌ Password must be at least 12 characters long');
    process.exit(1);
  }

  // Check password complexity
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUpper || !hasLower || !hasNumber || !hasSymbol) {
    console.error('❌ Password must contain:');
    console.error('   - At least one uppercase letter');
    console.error('   - At least one lowercase letter');
    console.error('   - At least one number');
    console.error('   - At least one special character');
    process.exit(1);
  }

  try {
    console.log('🔐 Generating secure password hash...');
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    
    console.log('\n✅ Password hash generated successfully!');
    console.log('\n📋 Add this to your environment variables:');
    console.log(`ADMIN_PASS_HASH="${hash}"`);
    
    console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
    console.log('1. Remove any ADMIN_PASS environment variable');
    console.log('2. Store this hash securely in your production environment');
    console.log('3. Never commit this hash to version control');
    console.log('4. Consider rotating passwords every 90 days');
    
    return hash;
  } catch (error) {
    console.error('❌ Error generating password hash:', error.message);
    process.exit(1);
  }
}

function generateSecurePassword(length = 16) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const allChars = uppercase + lowercase + numbers + symbols;

  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[crypto.randomInt(uppercase.length)];
  password += lowercase[crypto.randomInt(lowercase.length)];
  password += numbers[crypto.randomInt(numbers.length)];
  password += symbols[crypto.randomInt(symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[crypto.randomInt(allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Password Hash Generator for Synergy Admin');
    console.log('\nUsage:');
    console.log('  node generate-admin-password.js [password]');
    console.log('  node generate-admin-password.js --generate');
    console.log('\nOptions:');
    console.log('  --generate    Generate a secure random password');
    console.log('  --help        Show this help message');
    process.exit(0);
  }
  
  if (args.includes('--generate')) {
    const securePassword = generateSecurePassword(16);
    console.log('🎲 Generated secure password:', securePassword);
    console.log('\n⚠️  Save this password securely - it won\'t be shown again!');
    generatePasswordHash(securePassword);
  } else if (args.length > 0) {
    generatePasswordHash(args[0]);
  } else {
    console.log('Password Hash Generator for Synergy Admin');
    console.log('\nUsage:');
    console.log('  node generate-admin-password.js <your-secure-password>');
    console.log('  node generate-admin-password.js --generate');
    console.log('\nFor help: node generate-admin-password.js --help');
  }
}

module.exports = { generatePasswordHash, generateSecurePassword };
