import http from "http";

function nodeFetchMock() {
  return new Promise((resolve, reject) => {
    const req = http.request("http://hello.world.tio");

    req.on("error", (err) => {
      reject(new Error("failed to request", { cause: err }));
    });

    req.on("response", () => {
      resolve("finished");
    });
  });
}

async function foo() {
  return await bar();
}

function bar() {
  return baz();
}

async function baz() {
  return await polyfillWrapper().then(
    (v) => {
      console.log(v);
    },
    (e) => {
      console.error(e.stack);
    }
  );
}

async function polyfillWrapper() {
  return await nodeFetchMock();
}

export default foo();
/*
Error: failed to request
    at ClientRequest.<anonymous> (file:///Users/jridgewell/tmp/stack-trace-async-event/2-some-async-awaits-broken.js:8:14)
    at ClientRequest.emit (node:events:513:28)
    at Socket.socketErrorListener (node:_http_client:496:9)
    at Socket.emit (node:events:513:28)
    at emitErrorNT (node:internal/streams/destroy:151:8)
    at emitErrorCloseNT (node:internal/streams/destroy:116:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
*/

