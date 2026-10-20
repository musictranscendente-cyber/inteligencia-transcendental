// Dá mais memória ao Gradle e ao Kotlin no build do Android.
// Sem isso o build no EAS morre por falta de memória ("Gradle build daemon disappeared unexpectedly").
const { withGradleProperties } = require('expo/config-plugins');

const PROPERTIES = {
  'org.gradle.jvmargs': '-Xmx4096m -XX:MaxMetaspaceSize=1024m',
  'kotlin.daemon.jvmargs': '-Xmx2048m',
  'org.gradle.workers.max': '2',
};

module.exports = function withGradleMemory(config) {
  return withGradleProperties(config, (cfg) => {
    for (const [key, value] of Object.entries(PROPERTIES)) {
      const item = cfg.modResults.find((p) => p.type === 'property' && p.key === key);
      if (item) item.value = value;
      else cfg.modResults.push({ type: 'property', key, value });
    }
    return cfg;
  });
};
