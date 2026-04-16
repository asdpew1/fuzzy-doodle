# Guidelines

This document outlines the essential guidelines and workflow for making code contributions to the fuzzy-doodle project.
You **must** adhere to these rules to ensure consistency, quality, and stability.

## 1. Project Overview

- **Framework:** Symfony 7.2
- **PHP:** 8.4
- **Database:** MySQL 8.4
- **Containerization:** Docker (PHP-FPM + Nginx + MySQL)

## 2. Core Principles

- **Environment Consistency:** All operations **must** be performed within the project's Docker container to ensure a consistent environment.
- **Safety First:** Never modify code outside the scope of the immediate task without explicit permission.
- **Quality is Key:** All code changes must be accompanied by unit tests and must pass all code quality checks before the task is considered complete.

## 3. Docker Setup

### Starting the project
```bash
docker compose up -d
```

### Accessing the application
- **Web:** http://localhost:8080
- **PHP container:** `fuzzy-doodle-php`
- **Database:** localhost:3306 (user: `app`, password: `secret`, database: `app`)

## 4. Command Execution

All shell commands **must** be executed inside the `fuzzy-doodle-php` Docker container.

**Pattern:**
```bash
docker exec fuzzy-doodle-php sh -c "<your_command_here>"
```

**Examples:**
```bash
docker exec fuzzy-doodle-php sh -c "composer install"
docker exec fuzzy-doodle-php sh -c "php bin/console cache:clear"
docker exec fuzzy-doodle-php sh -c "php bin/console debug:router"
```

## 5. Writing and Modifying Code

- **Style:** Adhere strictly to the existing code style (naming, formatting, architectural patterns).
- **Comments:** Do not write explanatory comments. Code should be self-documenting. PHPDoc comments are permitted only when required by static analysis tools.
- **Controller classes:** All controller classes **must** be declared `final`.
- **Symbols per line:** Keep maximum 120 symbols per line.

## 6. Unit Tests

Place unit tests in the `tests/` directory, mirroring the `src/` directory structure.

### Test File Structure & Naming
- **File Name:** `[ClassName]Test.php` (e.g., `UserService.php` -> `UserServiceTest.php`).
- **Namespace:** `App\Tests\` followed by the path matching `src/`.
- **Method Names:** Test methods **must** start with the prefix `test` (e.g., `testCreateUserSuccessfully`).

### Running Tests
```bash
docker exec fuzzy-doodle-php sh -c "./vendor/bin/phpunit"
docker exec fuzzy-doodle-php sh -c "./vendor/bin/phpunit tests/path/to/TestFile.php"
```

## 7. Code Quality and Verification

After making changes, you **must** run the following checks. **All checks must pass before the task is considered complete.**

#### Step 1: Run Unit Tests
```bash
docker exec fuzzy-doodle-php sh -c "./vendor/bin/phpunit"
```

#### Step 2: Run Static Analysis (when phpstan is installed)
```bash
docker exec fuzzy-doodle-php sh -c "php -d memory_limit=1G ./vendor/bin/phpstan analyse -c phpstan.neon --level=max <path_to_changed_files>"
```

#### Step 3: Fix Coding Standards (when php-cs-fixer or phpcs is installed)
```bash
docker exec fuzzy-doodle-php sh -c "./vendor/bin/php-cs-fixer fix <path_to_changed_files>"
```

## 8. Frontend Application (React)

### Stack
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** React Query (TanStack Query) for server state, React Context for local state
- **HTTP Client:** Axios (or native fetch with a configured wrapper)
- **Styling:** CSS Modules (or Tailwind CSS — pick one and note it here)

### Project Structure
The frontend lives in a separate `frontend/` directory at the project root.

### Core Frontend Principles
- **TypeScript is mandatory.** All files must use `.ts` or `.tsx` extensions. No `any` types unless explicitly justified.
- **Components must be functional.** Do not use class components.
- **One component per file.** The file name must match the component name in PascalCase (e.g., `UserList.tsx`).
- **API types must mirror backend DTOs.** Request/response interfaces in `api/` or `types/` must match the Symfony API contracts exactly.
- **No hardcoded API URLs.** All API base URLs must come from environment variables (`VITE_API_BASE_URL`).
- **No business logic in components.** Extract logic into custom hooks or utility functions.
- **Comments:** Same rule as backend — no explanatory comments. Code should be self-documenting.
- **Symbols per line:** Keep maximum 120 symbols per line.

### API Communication
- The React app communicates with the Symfony backend via its REST API.
- All API calls must go through a centralized API client configured in `src/api/client.ts`.
- Authentication tokens (JWT or session) must be handled in the API client layer, not in individual components.
- All API functions must have typed request and response interfaces.

### Docker Setup
The frontend runs in its own container: `fuzzy-doodle-frontend`.

```bash
docker compose up -d
```

- **Dev server:** http://localhost:3000
- **API proxy:** Requests to `/api` are proxied to the Symfony backend.

### Command Execution
All frontend commands **must** be executed inside the `fuzzy-doodle-frontend` Docker container.

**Pattern:**
```bash
docker exec fuzzy-doodle-frontend sh -c "<your_command_here>"
```

**Examples:**
```bash
docker exec fuzzy-doodle-frontend sh -c "npm install"
docker exec fuzzy-doodle-frontend sh -c "npm run dev"
docker exec fuzzy-doodle-frontend sh -c "npm run build"
```

### Frontend Tests

- **Test Runner:** Vitest
- **Component Testing:** React Testing Library
- Place tests next to the file they test with a `.test.tsx` suffix (e.g., `UserList.tsx` → `UserList.test.tsx`).
- Test method names must be descriptive: `it('renders user list after successful fetch', ...)`.

```bash
docker exec fuzzy-doodle-frontend sh -c "npm run test"
docker exec fuzzy-doodle-frontend sh -c "npm run test -- src/features/users/components/UserList.test.tsx"
```

### Frontend Code Quality and Verification

After making frontend changes, you **must** run the following checks. **All checks must pass before the task is considered complete.**

#### Step 1: Run Tests
```bash
docker exec fuzzy-doodle-frontend sh -c "npm run test"
```

#### Step 2: Run Linting
```bash
docker exec fuzzy-doodle-frontend sh -c "npm run lint"
```

#### Step 3: Run Type Checking
```bash
docker exec fuzzy-doodle-frontend sh -c "npm run typecheck"
```

#### Step 4: Verify Build
```bash
docker exec fuzzy-doodle-frontend sh -c "npm run build"
```
