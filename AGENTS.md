## Module

When creating a feature, use the CQRS pattern: queries whenever possible, commands and events when possible. Use the barrel export pattern.

### Folder structure

- `queries` for queries with subfolders: `handlers` and `impl`
- `commands` for commands with subfolders: `handlers` and `impl`
- `controllers` for controllers
- `interfaces` for types. No types should be defined directly in controllers, queries, commands, or events.
- `helpers` for reusable helpers across the module
- `dto` for DTOs
- `entities` for entities

### Rule

Do not use another module's repository within a module; instead, create a query or command in the corresponding module and use it in the module that requires it.
