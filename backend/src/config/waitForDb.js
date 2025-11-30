const sequelize = require('./db');

async function waitForDatabase(maxRetries = 30, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await sequelize.authenticate();
      console.log('Database connection established successfully.');
      return true;
    } catch (error) {
      console.log(`Database connection attempt ${i + 1}/${maxRetries} failed. Retrying in ${delay}ms...`);
      if (i === maxRetries - 1) {
        console.error('Failed to connect to database after all retries:', error);
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

module.exports = waitForDatabase;

