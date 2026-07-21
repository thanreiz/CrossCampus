import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'

test('client curriculum loader fetches and caches one grade at a time', async () => {
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] },
  })
  try {
    const { getContentByRef, loadContentByGrade } = await server.ssrLoadModule('/src/lib/content.js')
    assert.equal(getContentByRef('1MG-Ia-1'), null)
    const grade1 = await loadContentByGrade(1)
    assert.equal(grade1.length, 47)
    assert.equal(getContentByRef('1MG-Ia-1')?.grade, 1)
    assert.strictEqual(await loadContentByGrade(1), grade1)
  } finally {
    await server.close()
  }
})
