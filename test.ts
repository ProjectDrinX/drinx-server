import Test from './tests/test.test';

// Run tests

try {
  console.log('------ Test "test.test.ts" -----');
  Test();
} catch (error) {
  console.error('============= TEST FAILED =============');
  console.error(` > ${error}`);
  console.error(error);
  console.error('=======================================\n');
  process.exit(1);
}

console.log('\nAll tests done !\n');
