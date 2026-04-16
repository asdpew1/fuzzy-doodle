---
name: code-review
description: Perform code review on current branch changes
---

# Code Review

Perform a comprehensive code review of changed files, ensuring they meet all project standards, conventions, and quality requirements.

## Instructions

This skill provides a systematic code review process covering:
1. **Code Quality & Style**
2. **Security & Vulnerabilities**
3. **Performance & Best Practices**
4. **Testing Coverage & Quality**
5. **Project Convention Compliance**

## Review Checklist

### 1. Code Quality & Style

#### Read the Changed Files
- Identify all modified/added files from git status or user input
- Read each file thoroughly

#### Verify Coding Standards
- **No explanatory comments** (code must be self-documenting)
- **PHPDoc only** when required by PHPStan/PHPCS
- **120 characters per line** maximum
- **Consistent naming** following project patterns
- **Proper formatting** (will be verified by PHPCS)
- **Yoda conditions** used correctly in comparisons
- **No unused variables** or class properties

### 2. Security Review

Check for common vulnerabilities:
- **SQL Injection:** Ensure parameterized queries
- **XSS:** Proper input/output sanitization
- **Command Injection:** No unescaped shell commands
- **Path Traversal:** Validate file paths
- **OWASP Top 10:** Screen for other common vulnerabilities
- **Sensitive Data:** No hardcoded credentials or secrets

### 3. Performance & Best Practices

- **Efficient algorithms:** No unnecessary loops or operations
- **Memory usage:** Appropriate data structures
- **Database queries:** Avoid N+1 problems
- **Caching:** Utilized where appropriate
- **Error handling:** Proper exception handling
- **Type safety:** Strong typing throughout

### 4. Testing Review

#### Unit Test Quality
- **Isolation:** Tests must not depend on external services
- **Coverage:** All new logic must be covered
- **Naming:** Methods start with `should`
- **Mocking:** Proper use of mocks following project conventions
  - Use `ConsecutiveCallsTrait` instead of `withConsecutive()`
  - Concrete `expects()` counts (never `atLeastOnce()`)
  - Always provide `with()` and `willReturn()` for methods with arguments
- **No enums in tests:** Use hardcoded values
- **No string concatenation:** Write final strings
- **Yoda conditions:** Correct usage in assertions

#### Reference Comparison
Compare test structure with reference files:
- `tests/Unit/MessageHandler/Portal/ImagePullTest.php`
- `tests/Unit/Service/Image/Orchestrator/Resolver/Step/ApplyImagePlacementTest.php`

### 5. Project Convention Compliance

#### Namespace & Structure
- **Namespace:** Matches directory structure
- **Test namespace:** Starts with `App\Tests\Unit\`
- **File location:** Correct directory placement
- **Class naming:** Follows conventions

#### Docker Execution
- Verify any new commands use the Docker execution pattern:
  ```bash
  DOCKER_CLI_HINTS="false" docker exec media-service sh -c "<command>"
  ```

#### Architectural Patterns
- **Consistency:** Follows existing architectural patterns
- **Dependency injection:** Proper use of services
- **Single responsibility:** Classes have clear, focused purposes

## Review Process

### Step 1: Identify Changed Files
Ask user or detect from git status which files were modified.

### Step 2: Read All Changed Files
Read each modified application and test file.

### Step 3: Perform Systematic Review
Go through each section of the checklist:
1. Code quality & style
2. Security vulnerabilities
3. Performance issues
4. Testing quality
5. Convention compliance

### Step 4: Verify Quality Checks
Ensure the following have been run (or run them):
- Unit tests with coverage
- PHPStan static analysis
- PHPCS coding standards

### Step 5: Document Findings

Create a structured review report:

#### ✅ Strengths
- List what was done well

#### ⚠️ Issues Found
For each issue:
- **Severity:** Critical / High / Medium / Low
- **Category:** Security / Performance / Style / Testing / Conventions
- **Location:** File path and line number
- **Description:** What the issue is
- **Recommendation:** How to fix it

#### 📋 Suggestions
- Optional improvements or considerations

### Step 6: Provide Verdict

- **APPROVED:** No issues found, ready to merge
- **APPROVED WITH SUGGESTIONS:** Minor improvements suggested but not required
- **CHANGES REQUESTED:** Issues must be fixed before merging
- **REJECTED:** Critical issues require significant rework

## Output Format

```markdown
# Code Review Report

## Files Reviewed
- src/path/to/File1.php
- tests/Unit/path/to/File1Test.php

## Summary
[Brief overview of changes and overall quality]

## ✅ Strengths
- [Positive aspects of the code]

## ⚠️ Issues Found

### Critical
[Critical issues requiring immediate attention]

### High Priority
[Important issues that should be fixed]

### Medium Priority
[Issues that should be addressed]

### Low Priority
[Minor issues or style concerns]

## 📋 Suggestions
[Optional improvements]

## Verdict
**[APPROVED / APPROVED WITH SUGGESTIONS / CHANGES REQUESTED / REJECTED]**

[Final recommendation]
```

## Best Practices

- Be thorough but constructive
- Provide specific file paths and line numbers
- Explain why something is an issue
- Suggest concrete solutions
- Reference project conventions and guidelines
- Focus on maintainability and code quality
