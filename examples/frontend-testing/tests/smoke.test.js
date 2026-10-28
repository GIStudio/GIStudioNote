import assert from "node:assert/strict"
import { test } from "node:test"
import { fileURLToPath } from "node:url"
import { createServer } from "vite"

test("serves the example homepage", async () => {
  const server = await createServer({
    configFile: false,
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { host: "127.0.0.1", port: 0, strictPort: true },
  })
  try {
    await server.listen()
    const address = server.httpServer.address()
    assert.ok(address && typeof address === "object")
    const response = await fetch(`http://127.0.0.1:${address.port}/`, {
      signal: AbortSignal.timeout(5000),
    })
    assert.equal(response.status, 200)
    assert.match(await response.text(), /<h1>GIStudio 测试示例<\/h1>/)
  } finally {
    await server.close()
  }
})
