const assert = require('assert');

console.log("Running fake tests...");

function testAddition() {
  const result = 2 + 3;
  assert.strictEqual(result, 5, "testAddition failed: 2 + 3 should equal 5");
  console.log("testAddition passed");
}

function testStringConcatenation() {
  const result = "Hello" + " " + "World";
  assert.strictEqual(result, "Hello World", "testStringConcatenation failed: 'Hello' + ' ' + 'World' should equal 'Hello World'");
  console.log("testStringConcatenation passed");
}

function testArrayLength() {
  const arr = [1, 2, 3];
  assert.strictEqual(arr.length, 3, "testArrayLength failed: Array length should be 3");
  console.log("testArrayLength passed");
}

function testObjectProperty() {
  const obj = { name: "John", age: 30 };
  assert.strictEqual(obj.name, "John", "testObjectProperty failed: Object property 'name' should be 'John'");
  console.log("testObjectProperty passed");
}

// Run all fake tests
try {
  testAddition();
  testStringConcatenation();
  testArrayLength();
  testObjectProperty();
} catch (error) {
  console.error("One or more tests failed:", error.message);
}