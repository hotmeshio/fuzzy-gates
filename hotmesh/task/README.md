The 'task' entity is simultaneously a transactional workflow AND a database record.

The code in the [Task](./index.ts) class is primarily used to connect `workers` and `hooks`. Because it extends `BaseEntity`, this class also provides a way to interact with record data, using the sibliing [schema.ts](./schema.ts) file. Standard CRUD operations are supported with NO additional configuration required beyond including the schema:

- create
- retrieve
- update
- delete

Additionally, the following ANALYTICAL operations are supported with NO additional configuration:

- find
- count
- aggregate

As would be expected, calling one of the standard C/U/D 'write' methods will update the record data as a single transactional method call. It is therefore easy to reason about the application as a set of database tables with standard interfaces for reading and writing record data. This is pretty standard and is common with opinionated, model-driven frameworks.

What is unique is the ability to target any database record and orchestrate its change over time transactionally without requiring sophisticated changes to infrustructure, the database, or the code itself. Standard, procedurally-oriented (temporal-like) syntax is supported, so the functions are run transactionally.

For example, the standard `create` method is subclassed/overidden and will  instead trigger the `generateTaskTree` workflow, turning the original 'create' event into a multi-step workflow that both saves the record data (as it does by default) WHILE ALSO transactionally guaranteeing all subordinated workflows that are spawned will complete as well.
