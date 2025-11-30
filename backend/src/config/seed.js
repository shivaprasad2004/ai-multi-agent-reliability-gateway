const bcrypt = require('bcryptjs');
const waitForDb = require('./waitForDb');
require('./associations');
const { User } = require('../modules/users/userModel');
const { Provider } = require('../modules/providers/providerModel');
const { Model } = require('../modules/models/modelModel');
const { Agent } = require('../modules/agents/agentModel');

async function seed() {
  try {
    await waitForDb();
    // Create admin user
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('Admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash,
        role: 'ADMIN'
      });
      console.log('Admin user created: admin@example.com / Admin123');
    }

    // Create mock provider
    let mockProvider = await Provider.findOne({ where: { name: 'mock' } });
    if (!mockProvider) {
      mockProvider = await Provider.create({
        name: 'mock',
        baseUrl: null,
        enabled: true
      });
      console.log('Mock provider created');
    }

    // Create mock model
    const existingModel = await Model.findOne({ 
      where: { providerId: mockProvider.id, modelName: 'mock-basic' } 
    });
    if (!existingModel) {
      const mockModel = await Model.create({
        providerId: mockProvider.id,
        modelName: 'mock-basic',
        costPerToken: 0,
        contextWindow: 4096,
        enabled: true
      });
      console.log('Mock model created');

      // Create default agents
      await Agent.create({
        name: 'Generator Agent',
        role: 'generator',
        modelId: mockModel.id,
        orderIndex: 0,
        taskType: null
      });

      await Agent.create({
        name: 'Safety Agent',
        role: 'safety',
        modelId: mockModel.id,
        orderIndex: 1,
        taskType: null
      });

      await Agent.create({
        name: 'Quality Agent',
        role: 'quality',
        modelId: mockModel.id,
        orderIndex: 2,
        taskType: null
      });

      console.log('Default agents created');
    }

    console.log('Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();

