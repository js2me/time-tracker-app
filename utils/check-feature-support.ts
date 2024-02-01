import * as lite from 'caniuse-lite';
import didYouMean from 'didyoumean';

import { getBrowsers } from './get-browsers';

export const checkFeatureSupport = (
  featureName: string,
  browsersList: unknown,
) => {
  if (!(featureName in lite.features)) {
    didYouMean.threshold = 0.75;
    const possibleVariant = didYouMean(featureName, Object.keys(lite.features));
    console.error(`unknown feature name - ${featureName}`);
    possibleVariant && console.error(`did you mean - ${possibleVariant} ? `);
    console.error(`Possible features:\n` + Object.keys(lite.features));
    throw 'e';
  }
  const feature = lite.feature(lite.features[featureName]);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const result = getBrowsers(browsersList);
  for (const browser of result.browsers) {
    const version = Object.keys(browser.versions)
      .map((v) => +v.split('-')[0])
      .filter(Boolean)
      .sort((a, b) => a - b)[0];
    const featureStat = feature.stats[browser.id];

    if (!featureStat) continue;

    const featureStatVersion =
      featureStat[version] || featureStat[Math.round(version)];

    if (!featureStatVersion) continue;

    if (featureStatVersion !== 'y') return false;
  }

  return true;
};
