import browserslist from 'browserslist';
import { agents as caniuseAgents } from 'caniuse-lite';

function roundNumber(value) {
  return Math.round(value * 100) / 100;
}

function getCoverage(data, version) {
  const [lastVersion] = Object.keys(data).sort((a, b) => Number(b) - Number(a));

  // If specific version coverage is missing, fall back to 'version zero'
  return data[version] !== undefined ? data[version] : data[lastVersion];
}

export function getBrowsers(query, region = 'alt-ww') {
  let browsersByQuery = [];

  try {
    browsersByQuery = browserslist(query);
  } catch (error) {
    throw error.browserslist
      ? error
      : new Error(`Unknown browser query \`${query}\`.`);
  }

  const browsersCoverageByQuery = {};

  for (const browser of browsersByQuery) {
    const [id, version] = browser.split(' ');
    let versionCoverage;

    // The Node.js is not in the Can I Use db
    if (id === 'node') {
      versionCoverage = null;
    } else {
      versionCoverage = roundNumber(
        getCoverage(caniuseAgents[id].usage_global, version),
      );
    }

    if (!browsersCoverageByQuery[id]) {
      browsersCoverageByQuery[id] = {};
    }

    browsersCoverageByQuery[id][version] = versionCoverage;
  }

  const browsers = Object.entries(browsersCoverageByQuery)
    .map(([id, versions]) => {
      let name;
      let coverage;

      // The Node.js is not in the Can I Use db
      if (id === 'node') {
        name = 'Node';
        coverage = null;
      } else {
        name = caniuseAgents[id].browser;
        coverage = roundNumber(
          Object.values(versions).reduce((a, b) => a + b, 0),
        );
      }

      return {
        id,
        name,
        coverage,
        versions,
      };
    })
    .sort((a, b) => b.coverage - a.coverage);

  let coverage = roundNumber(browserslist.coverage(browsersByQuery, region));

  // BUG `caniuse-db` returns coverage >100% https://github.com/Fyrd/caniuse/issues/6426
  coverage = coverage > 100 ? 100 : coverage;

  return {
    query,
    region,
    coverage,
    browsers,
  };
}
