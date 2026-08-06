import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'

test('the app has no remaining Nova branding', async () => {
  const result = await import('node:child_process').then(({ execFileSync }) => execFileSync(
    process.platform === 'win32' ? 'rg.exe' : 'rg',
    ['-n', '-i', '--hidden', '--glob', '!.git', '--glob', '!node_modules', '--glob', '!test/branding.test.js', '\\bnova\\b', '.'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
  ).trim()).catch((error) => {
    if (error.status === 1) return ''
    throw error
  })

  assert.equal(result, '')
})

test('renamed mascot assets exist', async () => {
  await Promise.all([
    access(new URL('../src/assets/gabay.png', import.meta.url)),
    access(new URL('../src/assets/gabay-clean.png', import.meta.url)),
    access(new URL('../public/gabay.png', import.meta.url)),
  ])

  const [main, clean, publicAsset] = await Promise.all([
    readFile(new URL('../src/assets/gabay.png', import.meta.url)),
    readFile(new URL('../src/assets/gabay-clean.png', import.meta.url)),
    readFile(new URL('../public/gabay.png', import.meta.url)),
  ])
  assert.equal(main.length, clean.length)
  assert.equal(main.length, publicAsset.length)
})
