import http from "http";

function nodeFetchMock() {
  return new Promise((resolve, reject) => {
    const req = http.request('http://hello.world.tio')

    req.on('error', (err) => {
      reject(new Error('failed to request', { cause: err }))
    })

    req.on('response', () => {
      resolve('finished')
    })
  })
}

async function foo() {
  return await bar();
}

async function bar() {
  return await baz();
}

async function baz() {
  return await polyfillWrapper().then(
    (v) => {
      console.log(v)
    },
    (e) => {
      console.error(e.stack)
    }
  )
}

async function polyfillWrapper() {
  try {
    return await nodeFetchMock()
  } catch (e) {
    Error.captureStackTrace(e, polyfillWrapper);
    throw e;
  }
}

export default foo()
/*
Error: failed to request
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async baz (file:///Users/jridgewell/tmp/stack-trace-async-event/6-all-async-awaits-capture-broken.js:26:10)
    at async bar (file:///Users/jridgewell/tmp/stack-trace-async-event/6-all-async-awaits-capture-broken.js:22:10)
    at async foo (file:///Users/jridgewell/tmp/stack-trace-async-event/6-all-async-awaits-capture-broken.js:18:10)
    at async file:///Users/jridgewell/tmp/stack-trace-async-event/test.js:12:5
*/
