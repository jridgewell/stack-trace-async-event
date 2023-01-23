# stack-trace-async-event

Tests stitching together a stack trace across an async EventEmitter.

There are 3 styles, each written into 3 tests:

1. Current (no `Error.captureStack`)
   1. Only promises (no `await`s)
   2. Using `await`, but with 1 promise thrown in
   3. Using `await` everywhere.
2. PR (`Error.captureStack`, but no `source` stack)
   1. Only promises (no `await`s)
   2. Using `await`, but with 1 promise thrown in
   3. Using `await` everywhere.
3. Final (`Error.captureStack` with `source` stack stitching)
   1. Only promises (no `await`s)
   2. Using `await`, but with 1 promise thrown in
   3. Using `await` everywhere.

This generates a total of 9 test cases (the number is the file number, the emoji is whether it passes):

| Case    | Promises  | Some await  | All await  |
|---------|-----------|-------------|------------|
| Current | 1 ❌      | 2 ❌        | 3 ❌       |
| PR      | 4 ❌      | 5 🟨        | 6 ✅       |
| Final   | 7 ✅      | 8 ✅        | 9 ✅       |


The Current behavior is entirely broken, we've not preserved any usable
stack trace for our users:

```
// 1, 2, and 3 all look like:
Error: failed to request
    at ClientRequest.<anonymous> (file:///Users/jridgewell/tmp/stack-trace-async-event/1-async-await-broken.js:8:14)
    at ClientRequest.emit (node:events:513:28)
    at Socket.socketErrorListener (node:_http_client:496:9)
    at Socket.emit (node:events:513:28)
    at emitErrorNT (node:internal/streams/destroy:151:8)
    at emitErrorCloseNT (node:internal/streams/destroy:116:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
```

The PR behavior is _almost_ fixed, but breaks if any code is using
promises. If so, than the promise using code is ommitted (but any
`await` higher and lower in the call stack is preserved). This isn't
ideal.

```
// 5. Notice "bar" is missing, but "foo" and "baz" are present.
Error: failed to request
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async baz (file:///Users/jridgewell/tmp/stack-trace-async-event/5-some-async-awaits-capture-broken.js:26:10)
    at async foo (file:///Users/jridgewell/tmp/stack-trace-async-event/5-some-async-awaits-capture-broken.js:18:10)
    at async file:///Users/jridgewell/tmp/stack-trace-async-event/test.js:12:5
```

The Final behavior is always correct. We preserve all asynchronous stack
frames, whether they original from a Promise or a `await`:

```
// 7, 8, and 9 all look like:
Error: failed to request
    at baz (file:///Users/jridgewell/tmp/stack-trace-async-event/7-async-await-capture-source.js:26:10)
    at bar (file:///Users/jridgewell/tmp/stack-trace-async-event/7-async-await-capture-source.js:22:10)
    at foo (file:///Users/jridgewell/tmp/stack-trace-async-event/7-async-await-capture-source.js:18:10)
    at file:///Users/jridgewell/tmp/stack-trace-async-event/7-async-await-capture-source.js:47:16
    at ModuleJob.run (node:internal/modules/esm/module_job:194:25)
```
