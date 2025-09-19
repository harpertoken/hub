module.exports = async () => {
  // Global teardown - runs once after all tests
  console.log('🛑 E2E test suite completed');

  // Clean up any global resources
  // For example: database cleanup, file cleanup, etc.

  console.log('✅ Test environment cleaned up');
};