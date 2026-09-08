## Module

When creating a feature, follow the CQRS pattern:

- Use queries for read operations whenever appropriate.
- Use commands for write or state-changing operations.
- Use events when they provide a clear benefit, such as reacting to completed actions or decoupling side effects.

### Folder Structure

- `queries` — contains queries, with the following subfolders: handlers and impl
- `commands` — contains commands, with the following subfolders: handlers and impl
- `controllers` — contains controllers.
- `interfaces` — contains shared types and interfaces. Do not define types directly inside controllers, queries, commands, handlers, or events.
- `helpers` — contains reusable helpers used across the module.
- `dto` — contains DTOs.
- `entities` — contains entities.

### Rules

Do not access another module's repository directly from within a module. Instead, create a query or command in the module that owns the repository, then use that query or command from the module that requires the data or operation.

Refer to the existing codebase for:

- Project structure
- Naming conventions
- Formatting and spacing
- CQRS implementation patterns
- Code quality standards

Keep implementations simple and practical. Avoid unnecessary abstractions, overengineering, and unrealistic edge cases. Handle edge cases that are reasonably expected in the application's actual usage.
