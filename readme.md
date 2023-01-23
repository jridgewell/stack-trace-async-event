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
