declare interface BuildEnvVariables {
  VERSION: string;
  DEV: boolean;
  BASE_URL: string;
  PREVIEW: boolean;
  MOCKS: boolean;
  LOGGER?: boolean;
  POLYFILLS: {
    RESIZE_OBSERVER: boolean;
  };
}

declare interface SharedEnvVariables {
  apiUrl?: string;
}

declare const buildEnvs: BuildEnvVariables;

interface Window {
  sharedEnvs?: SharedEnvVariables;
}
