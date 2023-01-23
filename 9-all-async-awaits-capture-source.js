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
  const source = new Error('');
  try {
    return await nodeFetchMock()
  } catch (e) {
    Error.captureStackTrace(e, polyfillWrapper);
    e.stack = e.stack.split('\n')[0] + '\n' + source.stack.split('\n').slice(2).join('\n');
    throw e;
  }
}

export default foo()
/*
Error: failed to request
    at baz (file:///Users/jridgewell/tmp/stack-trace-async-event/9-all-async-awaits-capture-source.js:26:16)
    at bar (file:///Users/jridgewell/tmp/stack-trace-async-event/9-all-async-awaits-capture-source.js:22:16)
    at foo (file:///Users/jridgewell/tmp/stack-trace-async-event/9-all-async-awaits-capture-source.js:18:16)
    at file:///Users/jridgewell/tmp/stack-trace-async-event/9-all-async-awaits-capture-source.js:47:16
    at ModuleJob.run (node:internal/modules/esm/module_job:194:25)
*/
