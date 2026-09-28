import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.medibook.app',
  appName: 'MediBook',
  webDir: 'build',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
