import assert from 'node:assert/strict';
import test from 'node:test';
import { approvedOsteopaths } from '../src/data/approved-osteopaths';
import { getPracticeLocations } from '../src/lib/directory-search';

test('Menoufia search returns Loay Serour at the matching published location', () => {
  const matches = approvedOsteopaths
    .map((profile) => ({ profile, locations: getPracticeLocations(profile, 'Menoufia') }))
    .filter(({ locations }) => locations.length > 0);

  assert.deepEqual(matches.map(({ profile }) => profile.name), ['Loay Mohamed Monir Serour']);
  assert.deepEqual(matches[0]?.locations, [{ city: 'Menoufia', cityAr: 'المنوفية' }]);
});

test('practice location search covers Arabic names and published address text', () => {
  const loay = approvedOsteopaths.find(({ name }) => name.includes('Loay'))!;

  assert.deepEqual(getPracticeLocations(loay, 'المنوفية'), [
    { city: 'Menoufia', cityAr: 'المنوفية' },
  ]);
  assert.ok(getPracticeLocations(loay, 'Shebin El-Kom').length > 0);
  assert.ok(getPracticeLocations(loay, 'شبين الكوم').length > 0);
  assert.deepEqual(getPracticeLocations(loay, 'Alexandria'), []);
});
