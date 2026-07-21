import { test, expect } from 'playwright/test'
import { getGamesForGrade } from '../src/lib/game-catalog.js'
import { STRINGS } from '../src/lib/i18n.js'

const expectedTitles = {
  1: ['Number Train', 'Sari-Sari Shop', 'Shape & Time Playground', 'Pattern Picnic'],
  2: ['Number City', 'Market Math', 'Sharing Camp', 'Measure & Picture Lab'],
  3: ['Number Expedition', 'Market Masters', 'Measure & Shape Lab', 'Data Carnival'],
  4: ['Big Number Mission', 'Fraction & Decimal Kitchen', 'Geometry Workshop', 'Data Studio'],
  5: ['Time Zone Mission', 'Fraction & Decimal Café', 'Data Detective', 'Solid Builder'],
  6: ['Store Game', 'Garden Game', 'House Builder', 'Fiesta Booth'],
}

async function seedProfile(page, grade) {
  await page.goto('/')
  await page.evaluate(async ({ grade }) => {
    await new Promise((resolve, reject) => {
      const request = indexedDB.open('keyval-store', 1)
      request.onupgradeneeded = () => request.result.createObjectStore('keyval')
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const transaction = request.result.transaction('keyval', 'readwrite')
        transaction.objectStore('keyval').put(grade, 'gabay:selectedGrade')
        transaction.objectStore('keyval').put('Playwright Learner', 'gabay:studentName')
        transaction.objectStore('keyval').put('en', 'pref:lang')
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      }
    })
  }, { grade })
  await page.reload()
  await page.getByRole('button', { name: 'START' }).click()
  await expect(page.getByText(`Grade ${grade}`, { exact: true })).toBeVisible()
  await page.locator('nav').getByRole('button', { name: 'Games' }).click()
}

for (const grade of [1, 2, 3, 4, 5, 6]) {
  test(`Grade ${grade} shows and starts only its configured games`, async ({ page }) => {
    let requestBody
    await page.route('**/api/questions', async (route) => {
      requestBody = route.request().postDataJSON()
      await route.fulfill({ status: 503, contentType: 'application/json', body: '{}' })
    })
    await seedProfile(page, grade)

    for (const title of expectedTitles[grade]) await expect(page.getByText(title, { exact: true })).toBeVisible()
    for (const [otherGrade, titles] of Object.entries(expectedTitles)) {
      if (Number(otherGrade) === grade) continue
      for (const title of titles.filter((value) => !expectedTitles[grade].includes(value))) {
        await expect(page.getByText(title, { exact: true })).toHaveCount(0)
      }
    }

    const firstGame = getGamesForGrade(grade)[0]
    const firstTitle = STRINGS[`games.${firstGame.key}.name`].en
    await page.getByRole('button').filter({ hasText: firstTitle }).click()
    await page.getByRole('button', { name: '5', exact: true }).click()
    await page.getByRole('button', { name: /\(5 questions\)$/ }).click()

    await expect(page.getByText('Question 1 / 5')).toBeVisible()
    expect(new Set(requestBody.refs)).toEqual(new Set(firstGame.refs))
    expect(requestBody.grade).toBe(grade)
  })
}
