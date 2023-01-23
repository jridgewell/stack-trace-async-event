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

function foo() {
  return bar();
}

function bar() {
  return baz();
}

function baz() {
  return polyfillWrapper().then(
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
    at baz (file:///Users/jridgewell/tmp/stack-trace-async-event/7-promises-capture-source.js:26:10)
    at bar (file:///Users/jridgewell/tmp/stack-trace-async-event/7-promises-capture-source.js:22:10)
    at foo (file:///Users/jridgewell/tmp/stack-trace-async-event/7-promises-capture-source.js:18:10)
    at file:///Users/jridgewell/tmp/stack-trace-async-event/7-promises-capture-source.js:47:16
    at ModuleJob.run (node:internal/modules/esm/module_job:194:25)
*/
