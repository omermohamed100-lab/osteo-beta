import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { approvedOsteopaths } from '../src/data/approved-osteopaths';

test('Samira uses the approved missing practice-address wording in both languages', () => {
  const samira = approvedOsteopaths.find(({ name }) => name === 'Samira Sayed Mahmoud');
  assert.equal(samira?.location, 'Practice address not provided. Contact this practitioner for location details.');
  assert.equal(samira?.locationAr, 'لم يُقدَّم عنوان الممارسة. تواصل مع الممارِسة للحصول على تفاصيل الموقع.');
});

test('public profiles use a consistent evidence-backed information structure', async () => {
  const [detail, directory] = await Promise.all([
    readFile('src/app/find-osteopath/[id]/page.tsx', 'utf8'),
    readFile('src/components/directory/FindOsteopathDirectory.tsx', 'utf8'),
  ]);
  for (const heading of ['Qualifications and professional biography', 'Practice locations', 'Contact and appointments']) {
    assert.match(detail, new RegExp(heading));
  }
  assert.match(directory, /Qualifications and biography/);
  assert.match(directory, /Practice locations/);
  assert.match(directory, /Contact and appointments/);
  assert.match(detail, /No verified credential record is displayed/);
  assert.match(detail, /profile-review date refers to the published profile information, not credential verification/);
});

test('database records receive the clarified missing-address copy without inferred data', async () => {
  const migration = await readFile('database/migrations/20260905010000_clarify_samira_practice_location/migration.sql', 'utf8');
  assert.match(migration, /Practice address not provided\. Contact this practitioner for location details\./);
  assert.match(migration, /LOWER\("email"\) = 'meros\.frd@gmail\.com'/);
  assert.match(migration, /"location" = 'Not available right now\.'/);
});
