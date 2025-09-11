#!/usr/bin/env node

/**
 * Custom Admin Password Setup Utility
 * 
 * This allows you to set your own custom password for admin login.
 * Usage: node set-custom-password.js
 */

const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const BCRYPT_ROUNDS = 12;

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function askPassword(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    
    let password = '';
    
    process.stdin.on('data', function(ch) {
      ch = ch.toString('utf8');
      
      switch(ch) {
        case '\n':
        case '\r':
        case '\u0004':
          // Enter pressed
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          // Ctrl+C
          console.log('\nOperation cancelled');
          process.exit();
          break;
        case '\u007f':
        case '\b':
          // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          // Regular character
          password += ch;
          process.stdout.write('*');
      }
    });
  });
}

function validatePassword(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return errors;
}

async function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

async function updateEnvFile(hash) {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    return false;
  }
  
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Replace existing ADMIN_PASS_HASH or add it
  const hashLine = `ADMIN_PASS_HASH=${hash}`;
  
  if (envContent.includes('ADMIN_PASS_HASH=')) {
    // Replace existing hash
    envContent = envContent.replace(/ADMIN_PASS_HASH=.*/g, hashLine);
  } else {
    // Add new hash line after ADMIN_USER
    if (envContent.includes('ADMIN_USER=')) {
      envContent = envContent.replace(/ADMIN_USER=.*/g, `ADMIN_USER=admin\n${hashLine}`);
    } else {
      // Add at the end of security section
      envContent += `\n# Admin Authentication\nADMIN_USER=admin\n${hashLine}\n`;
    }
  }
  
  fs.writeFileSync(envPath, envContent);
  return true;
}

async function main() {
  console.log('🔐 Custom Admin Password Setup');
  console.log('==============================\n');
  
  try {
    // Get custom password
    const password = await askPassword('Enter your custom admin password (input hidden): ');
    
    if (!password) {
      console.log('❌ Password cannot be empty');
      process.exit(1);
    }
    
    // Validate password
    const errors = validatePassword(password);
    if (errors.length > 0) {
      console.log('\n❌ Password validation failed:');
      errors.forEach(error => console.log(`   - ${error}`));
      process.exit(1);
    }
    
    // Confirm password
    const confirmPassword = await askPassword('Confirm password (input hidden): ');
    
    if (password !== confirmPassword) {
      console.log('\n❌ Passwords do not match');
      process.exit(1);
    }
    
    console.log('\n🔐 Generating secure password hash...');
    
    // Generate hash
    const hash = await hashPassword(password);
    
    console.log('✅ Password hash generated successfully!');
    
    // Update .env.local file
    const updated = await updateEnvFile(hash);
    
    if (updated) {
      console.log('✅ .env.local file updated successfully!');
      console.log('\n📋 Your new admin credentials:');
      console.log(`Username: admin`);
      console.log(`Password: ${password}`);
      console.log('\n⚠️  IMPORTANT:');
      console.log('1. Remember your password - it\'s not stored anywhere in plain text');
      console.log('2. Restart your development server: npm run dev');
      console.log('3. You can now login with your custom password');
      console.log('\n🔒 Your password is now securely hashed in .env.local');
    } else {
      console.log('❌ Failed to update .env.local file');
      console.log(`\nManually add this line to your .env.local:`);
      console.log(`ADMIN_PASS_HASH="${hash}"`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nOperation cancelled');
  rl.close();
  process.exit();
});

if (require.main === module) {
  main();
}

module.exports = { hashPassword, validatePassword };
