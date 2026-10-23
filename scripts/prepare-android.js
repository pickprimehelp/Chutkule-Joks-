import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const androidDir = path.join(rootDir, 'android');
const appBuildGradle = path.join(androidDir, 'app', 'build.gradle');

console.log('--- 🛠️ Preparing Capacitor Android Platform ---');

// 1. Verify dist folder
const distDir = path.join(rootDir, 'dist');
if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'index.html'))) {
  console.log('Building web assets (npm run build)...');
  execSync('npm run build', { stdio: 'inherit' });
}

// 2. Add android platform if not present
if (!fs.existsSync(androidDir)) {
  console.log('Android folder not found. Adding Android platform via Capacitor CLI...');
  execSync('npx cap add android', { stdio: 'inherit' });
} else {
  console.log('Syncing Android platform via Capacitor CLI...');
  execSync('npx cap sync android', { stdio: 'inherit' });
}

// 3. Patch android/app/build.gradle for Release Keystore signing safely
if (fs.existsSync(appBuildGradle)) {
  let content = fs.readFileSync(appBuildGradle, 'utf8');

  if (!content.includes('signingConfigs {')) {
    console.log('Injecting signingConfigs into android/app/build.gradle...');
    const signingBlock = `    signingConfigs {
        release {
            def ksPath = System.getenv("KEYSTORE_PATH") ?: "release.jks"
            if (file(ksPath).exists()) {
                storeFile file(ksPath)
                storePassword System.getenv("KEYSTORE_PASSWORD") ?: "chutkule123"
                keyAlias System.getenv("KEY_ALIAS") ?: "chutkule"
                keyPassword System.getenv("KEY_PASSWORD") ?: "chutkule123"
            }
        }
    }\n`;

    if (content.includes('buildTypes {')) {
      content = content.replace('buildTypes {', signingBlock + '    buildTypes {');
    }
  }

  // Ensure release buildType uses signingConfig
  if (!content.includes('signingConfig signingConfigs.release')) {
    console.log('Connecting signingConfig to release buildType...');
    content = content.replace(
      /buildTypes\s*\{\s*release\s*\{/,
      `buildTypes {\n        release {\n            def ksPath = System.getenv("KEYSTORE_PATH") ?: "release.jks"\n            if (file(ksPath).exists()) {\n                signingConfig signingConfigs.release\n            }`
    );
  }

  fs.writeFileSync(appBuildGradle, content, 'utf8');
  console.log('✔ android/app/build.gradle successfully verified and configured.');
}

// 4. Ensure clean strings.xml
const stringsXml = path.join(androidDir, 'app', 'src', 'main', 'res', 'values', 'strings.xml');
if (fs.existsSync(stringsXml)) {
  const xmlContent = `<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">चुटकुले और विचार</string>
    <string name="title_activity_main">चुटकुले और विचार</string>
    <string name="package_name">com.chutkule.vichar.hindistatus</string>
    <string name="custom_url_scheme">com.chutkule.vichar.hindistatus</string>
</resources>\n`;
  fs.writeFileSync(stringsXml, xmlContent, 'utf8');
}

// 5. Ensure gradlew is executable
const gradlewPath = path.join(androidDir, 'gradlew');
if (fs.existsSync(gradlewPath)) {
  try {
    fs.chmodSync(gradlewPath, 0o755);
    console.log('✔ gradlew marked as executable.');
  } catch {
    // Windows ignore
  }
}

console.log('--- 🚀 Android Preparation Complete ---');
