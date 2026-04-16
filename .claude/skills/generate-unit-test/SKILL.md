---
name: generate-unit-test
description: Generates unit test according to project structure
---


# Generate Unit Test

Generate a comprehensive unit test for a PHP class following the project's strict testing conventions.

## Instructions

1. **Locate the target class file** based on the user's request
2. **Analyze the class** to understand its dependencies, methods, and logic
3. **Create the test file** in `tests/Unit/` mirroring the `src/` structure

## Strict Conventions

### File Structure
- **File Name:** `[ClassName]Test.php`
- **Namespace:** Same namespace as the class under test, but starting with `App\Tests\Unit\`
- **Location:** Mirror the source structure in `tests/Unit/`

### Test Class Rules
- Method names **must** start with `should` (e.g., `shouldCreateUserSuccessfully`)
- Use `setUp()` method for initialization (never `#[Before]` attribute)
- Mock typing: `private MockObject & ClassName $mockedClassName;`
- Maximum 120 characters per line
- Use concrete `expects()` counts (never `atLeastOnce()`)
- Write `expects(self::never())` in one line
- Always provide `with()` and `willReturn()` for methods with arguments/returns

### Mocking Rules
- **Never use** `withConsecutive()` - use `ConsecutiveCallsTrait` instead
- **Avoid** `willReturnOnConsecutiveCalls` - use `willReturn()` with multiple values
- For consecutive calls with multiple arguments:
  ```php
  $mock->expects($this->exactly(2))
      ->method('myMethod')
      ->with(
          $this->consecutiveArguments('foo1', 'foo2'),
          $this->consecutiveArguments('bar1', 'bar2')
      );
  ```

### Code Quality
- No explanatory comments (code should be self-documenting)
- Use Yoda conditions correctly
- Hardcode enum values instead of `enum::something->value`
- No string concatenation in tests (write final strings)
- Replace unused class properties with local variables
- Full isolation from external services (APIs, databases)

### Reference Files
When in doubt, refer to:
- `tests/Unit/MessageHandler/Portal/ImagePullTest.php`
- `tests/Unit/Service/Image/Orchestrator/Resolver/Step/ApplyImagePlacementTest.php`

## Workflow

1. Read the target class file
2. Identify all public methods and their logic branches
3. Create comprehensive test cases covering all scenarios
4. Generate mocks for all dependencies
5. Write assertions using Yoda conditions
6. Ensure 100% code coverage for new/modified logic
7. Run quality checks (do not run automatically, just create the test)

## Output

Create the test file and inform the user that they should run the quality-check skill next.
