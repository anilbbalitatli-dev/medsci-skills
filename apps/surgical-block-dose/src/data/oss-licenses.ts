// ÜRETİLMİŞ DOSYA — elle düzenlemeyin.
// Kaynak: scripts/collect-licenses.js · 403 paket
//
// Uygulamayla dağıtılan açık kaynak paketlerin telif bildirimleri. İzin veren
// lisansların tamamı bildirimin dağıtımla birlikte taşınmasını şart koşar;
// bu liste onun karşılığıdır.

export interface OssPackage {
  name: string;
  version: string;
  license: string;
  copyright?: string;
}

export const OSS_PACKAGES: OssPackage[] = [
  {
    "name": "@babel/code-frame",
    "version": "7.10.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/compat-data",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/core",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/generator",
    "version": "7.29.8",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/helper-compilation-targets",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/helper-globals",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/helper-module-imports",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/helper-module-transforms",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/helper-plugin-utils",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/helper-string-parser",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/helper-validator-identifier",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/helper-validator-option",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/helpers",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/highlight",
    "version": "7.25.9",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/parser",
    "version": "7.29.8",
    "license": "MIT",
    "copyright": "Copyright (C) 2012-2014 by various contributors (see AUTHORS)"
  },
  {
    "name": "@babel/plugin-syntax-async-generators",
    "version": "7.8.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-bigint",
    "version": "7.8.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-class-properties",
    "version": "7.12.13",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-class-static-block",
    "version": "7.14.5",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-import-attributes",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-import-meta",
    "version": "7.10.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-json-strings",
    "version": "7.8.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-logical-assignment-operators",
    "version": "7.10.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-nullish-coalescing-operator",
    "version": "7.8.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-numeric-separator",
    "version": "7.10.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-object-rest-spread",
    "version": "7.8.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-optional-catch-binding",
    "version": "7.8.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-optional-chaining",
    "version": "7.8.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-private-property-in-object",
    "version": "7.14.5",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/plugin-syntax-top-level-await",
    "version": "7.14.5",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/runtime",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/template",
    "version": "7.29.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/traverse",
    "version": "7.29.8",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/traverse--for-generate-function-map",
    "version": "7.29.8",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@babel/types",
    "version": "7.29.8",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present Sebastian McKenzie and other contributors"
  },
  {
    "name": "@expo/config",
    "version": "12.0.14",
    "license": "MIT",
    "copyright": "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
  },
  {
    "name": "@expo/config-plugins",
    "version": "54.0.5",
    "license": "MIT",
    "copyright": "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
  },
  {
    "name": "@expo/config-types",
    "version": "54.0.10",
    "license": "MIT",
    "copyright": "Copyright (c) 2020-present 650 Industries, Inc. (aka Expo)"
  },
  {
    "name": "@expo/devtools",
    "version": "0.1.8",
    "license": "MIT",
    "copyright": "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
  },
  {
    "name": "@expo/env",
    "version": "2.0.12",
    "license": "MIT",
    "copyright": "Copyright (c) 2023-present 650 Industries, Inc. (aka Expo)"
  },
  {
    "name": "@expo/fingerprint",
    "version": "0.15.5",
    "license": "MIT",
    "copyright": "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
  },
  {
    "name": "@expo/image-utils",
    "version": "0.8.15",
    "license": "MIT",
    "copyright": "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
  },
  {
    "name": "@expo/json-file",
    "version": "10.2.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
  },
  {
    "name": "@expo/metro",
    "version": "54.2.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "@expo/metro-runtime",
    "version": "6.1.2",
    "license": "MIT",
    "copyright": "650 Industries, Inc."
  },
  {
    "name": "@expo/plist",
    "version": "0.4.9",
    "license": "MIT"
  },
  {
    "name": "@expo/prebuild-config",
    "version": "54.0.9",
    "license": "MIT",
    "copyright": "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
  },
  {
    "name": "@expo/schema-utils",
    "version": "0.1.9",
    "license": "MIT",
    "copyright": "Copyright (c) 2025-present 650 Industries, Inc. (aka Expo)"
  },
  {
    "name": "@expo/sdk-runtime-versions",
    "version": "1.0.0",
    "license": "MIT",
    "copyright": "Expo"
  },
  {
    "name": "@expo/spawn-async",
    "version": "1.8.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2015 650 Industries"
  },
  {
    "name": "@expo/vector-icons",
    "version": "15.1.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2015 Joel Arvidsson"
  },
  {
    "name": "@isaacs/ttlcache",
    "version": "1.4.1",
    "license": "ISC",
    "copyright": "Copyright (c) 2022-2023 - Isaac Z. Schlueter and Contributors"
  },
  {
    "name": "@istanbuljs/load-nyc-config",
    "version": "1.1.0",
    "license": "ISC",
    "copyright": "Copyright (c) 2019, Contributors"
  },
  {
    "name": "@istanbuljs/schema",
    "version": "0.1.6",
    "license": "MIT",
    "copyright": "Copyright (c) 2019 CFWare, LLC"
  },
  {
    "name": "@jest/create-cache-key-function",
    "version": "29.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "@jest/environment",
    "version": "29.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "@jest/fake-timers",
    "version": "29.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "@jest/schemas",
    "version": "29.6.3",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "@jest/transform",
    "version": "29.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "@jest/types",
    "version": "29.6.3",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "@jridgewell/gen-mapping",
    "version": "0.3.13",
    "license": "MIT",
    "copyright": "Copyright 2024 Justin Ridgewell <justin@ridgewell.name>"
  },
  {
    "name": "@jridgewell/remapping",
    "version": "2.3.5",
    "license": "MIT",
    "copyright": "Copyright 2024 Justin Ridgewell <justin@ridgewell.name>"
  },
  {
    "name": "@jridgewell/resolve-uri",
    "version": "3.1.2",
    "license": "MIT",
    "copyright": "Copyright 2019 Justin Ridgewell <jridgewell@google.com>"
  },
  {
    "name": "@jridgewell/source-map",
    "version": "0.3.11",
    "license": "MIT",
    "copyright": "Copyright 2024 Justin Ridgewell <justin@ridgewell.name>"
  },
  {
    "name": "@jridgewell/sourcemap-codec",
    "version": "1.5.5",
    "license": "MIT",
    "copyright": "Copyright 2024 Justin Ridgewell <justin@ridgewell.name>"
  },
  {
    "name": "@jridgewell/trace-mapping",
    "version": "0.3.31",
    "license": "MIT",
    "copyright": "Copyright 2024 Justin Ridgewell <justin@ridgewell.name>"
  },
  {
    "name": "@radix-ui/react-compose-refs",
    "version": "1.1.2",
    "license": "MIT"
  },
  {
    "name": "@radix-ui/react-slot",
    "version": "1.2.0",
    "license": "MIT"
  },
  {
    "name": "@react-native/assets-registry",
    "version": "0.81.5",
    "license": "MIT"
  },
  {
    "name": "@react-native/codegen",
    "version": "0.81.5",
    "license": "MIT"
  },
  {
    "name": "@react-native/community-cli-plugin",
    "version": "0.81.5",
    "license": "MIT"
  },
  {
    "name": "@react-native/debugger-frontend",
    "version": "0.81.5",
    "license": "BSD-3-Clause"
  },
  {
    "name": "@react-native/dev-middleware",
    "version": "0.81.5",
    "license": "MIT"
  },
  {
    "name": "@react-native/gradle-plugin",
    "version": "0.81.5",
    "license": "MIT"
  },
  {
    "name": "@react-native/js-polyfills",
    "version": "0.81.5",
    "license": "MIT"
  },
  {
    "name": "@react-native/normalize-colors",
    "version": "0.81.5",
    "license": "MIT"
  },
  {
    "name": "@react-navigation/bottom-tabs",
    "version": "7.18.14",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 React Navigation Contributors"
  },
  {
    "name": "@react-navigation/core",
    "version": "7.21.11",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 React Navigation Contributors"
  },
  {
    "name": "@react-navigation/elements",
    "version": "2.9.36",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 React Navigation Contributors"
  },
  {
    "name": "@react-navigation/native",
    "version": "7.3.14",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 React Navigation Contributors"
  },
  {
    "name": "@react-navigation/native-stack",
    "version": "7.18.6",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 React Navigation Contributors"
  },
  {
    "name": "@react-navigation/routers",
    "version": "7.6.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 React Navigation Contributors"
  },
  {
    "name": "@sinclair/typebox",
    "version": "0.27.12",
    "license": "MIT",
    "copyright": "Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>"
  },
  {
    "name": "@sinonjs/commons",
    "version": "3.0.1",
    "license": "BSD-3-Clause",
    "copyright": "Copyright (c) 2018, Sinon.JS"
  },
  {
    "name": "@sinonjs/fake-timers",
    "version": "10.3.0",
    "license": "BSD-3-Clause",
    "copyright": "Copyright (c) 2010-2014, Christian Johansen, christian@cjohansen.no. All rights reserved."
  },
  {
    "name": "@types/babel__core",
    "version": "7.20.5",
    "license": "MIT",
    "copyright": "Copyright (c) Microsoft Corporation."
  },
  {
    "name": "@types/babel__generator",
    "version": "7.27.0",
    "license": "MIT",
    "copyright": "Copyright (c) Microsoft Corporation."
  },
  {
    "name": "@types/babel__template",
    "version": "7.4.4",
    "license": "MIT",
    "copyright": "Copyright (c) Microsoft Corporation."
  },
  {
    "name": "@types/babel__traverse",
    "version": "7.28.0",
    "license": "MIT",
    "copyright": "Copyright (c) Microsoft Corporation."
  },
  {
    "name": "@types/graceful-fs",
    "version": "4.1.9",
    "license": "MIT",
    "copyright": "Copyright (c) Microsoft Corporation."
  },
  {
    "name": "@types/istanbul-lib-coverage",
    "version": "2.0.6",
    "license": "MIT",
    "copyright": "Copyright (c) Microsoft Corporation."
  },
  {
    "name": "@types/istanbul-lib-report",
    "version": "3.0.3",
    "license": "MIT",
    "copyright": "Copyright (c) Microsoft Corporation."
  },
  {
    "name": "@types/istanbul-reports",
    "version": "3.0.4",
    "license": "MIT",
    "copyright": "Copyright (c) Microsoft Corporation."
  },
  {
    "name": "@types/node",
    "version": "26.1.2",
    "license": "MIT",
    "copyright": "Copyright (c) Microsoft Corporation."
  },
  {
    "name": "@types/stack-utils",
    "version": "2.0.3",
    "license": "MIT",
    "copyright": "Copyright (c) Microsoft Corporation."
  },
  {
    "name": "@types/yargs",
    "version": "17.0.35",
    "license": "MIT",
    "copyright": "Copyright (c) Microsoft Corporation."
  },
  {
    "name": "@types/yargs-parser",
    "version": "21.0.3",
    "license": "MIT",
    "copyright": "Copyright (c) Microsoft Corporation."
  },
  {
    "name": "@ungap/structured-clone",
    "version": "1.3.3",
    "license": "ISC",
    "copyright": "Copyright (c) 2021, Andrea Giammarchi, @WebReflection"
  },
  {
    "name": "@xmldom/xmldom",
    "version": "0.8.13",
    "license": "MIT",
    "copyright": "Copyright 2019 - present Christopher J. Brody and other contributors, as listed in: https://github.com/xmldom/xmldom/graphs/contributors"
  },
  {
    "name": "abort-controller",
    "version": "3.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 Toru Nagashima"
  },
  {
    "name": "accepts",
    "version": "1.3.8",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Jonathan Ong <me@jongleberry.com>"
  },
  {
    "name": "acorn",
    "version": "8.18.0",
    "license": "MIT",
    "copyright": "Copyright (C) 2012-2022 by various contributors (see AUTHORS)"
  },
  {
    "name": "agent-base",
    "version": "7.1.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2013 Nathan Rajlich <nathan@tootallnate.net>"
  },
  {
    "name": "anser",
    "version": "1.4.10",
    "license": "MIT",
    "copyright": "Copyright (c) 2012-20 Ionică Bizău <bizauionica@gmail.com> (https://ionicabizau.net)"
  },
  {
    "name": "ansi-regex",
    "version": "5.0.1",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "ansi-styles",
    "version": "3.2.1",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "any-promise",
    "version": "1.3.0",
    "license": "MIT",
    "copyright": "Copyright (C) 2014-2016 Kevin Beaty"
  },
  {
    "name": "anymatch",
    "version": "3.1.3",
    "license": "ISC",
    "copyright": "Copyright (c) 2019 Elan Shanker, Paul Miller (https://paulmillr.com)"
  },
  {
    "name": "arg",
    "version": "5.0.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2021 Vercel, Inc."
  },
  {
    "name": "argparse",
    "version": "1.0.10",
    "license": "MIT",
    "copyright": "Copyright (C) 2012 by Vitaly Puzrin"
  },
  {
    "name": "asap",
    "version": "2.0.6",
    "license": "MIT",
    "copyright": "Copyright 2009–2014 Contributors. All rights reserved."
  },
  {
    "name": "await-lock",
    "version": "2.2.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2015-present James Ide"
  },
  {
    "name": "babel-jest",
    "version": "29.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "babel-plugin-istanbul",
    "version": "6.1.1",
    "license": "BSD-3-Clause",
    "copyright": "Copyright (c) 2016, Istanbul Code Coverage"
  },
  {
    "name": "babel-plugin-jest-hoist",
    "version": "29.6.3",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "babel-plugin-syntax-hermes-parser",
    "version": "0.29.1",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "babel-preset-current-node-syntax",
    "version": "1.2.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2020 Nicolò Ribaudo and other contributors"
  },
  {
    "name": "babel-preset-jest",
    "version": "29.6.3",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "balanced-match",
    "version": "4.0.4",
    "license": "MIT"
  },
  {
    "name": "base64-js",
    "version": "1.5.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Jameson Little"
  },
  {
    "name": "baseline-browser-mapping",
    "version": "2.11.11",
    "license": "Apache-2.0",
    "copyright": "copyright notice that is included in or attached to the work"
  },
  {
    "name": "big-integer",
    "version": "1.6.52",
    "license": "Unlicense",
    "copyright": "Peter Olson"
  },
  {
    "name": "boolbase",
    "version": "1.0.0",
    "license": "ISC",
    "copyright": "Felix Boehm"
  },
  {
    "name": "bplist-creator",
    "version": "0.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2012 Near Infinity Corporation"
  },
  {
    "name": "bplist-parser",
    "version": "0.3.1",
    "license": "MIT",
    "copyright": "Joe Ferner"
  },
  {
    "name": "brace-expansion",
    "version": "5.0.9",
    "license": "MIT",
    "copyright": "Copyright Julian Gruber <julian@juliangruber.com>"
  },
  {
    "name": "braces",
    "version": "3.0.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present, Jon Schlinkert."
  },
  {
    "name": "browserslist",
    "version": "4.28.7",
    "license": "MIT",
    "copyright": "Copyright 2014 Andrey Sitnik <andrey@sitnik.es> and other contributors"
  },
  {
    "name": "bser",
    "version": "2.1.1",
    "license": "Apache-2.0",
    "copyright": "Wez Furlong"
  },
  {
    "name": "buffer",
    "version": "5.7.1",
    "license": "MIT",
    "copyright": "Copyright (c) Feross Aboukhadijeh, and other contributors."
  },
  {
    "name": "buffer-from",
    "version": "1.1.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2016, 2018 Linus Unnebäck"
  },
  {
    "name": "camelcase",
    "version": "6.3.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)"
  },
  {
    "name": "caniuse-lite",
    "version": "1.0.30001806",
    "license": "CC-BY-4.0",
    "copyright": "copyright and certain other rights. Our licenses are"
  },
  {
    "name": "chalk",
    "version": "2.4.2",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "chrome-launcher",
    "version": "0.15.2",
    "license": "Apache-2.0",
    "copyright": "copyright notice that is included in or attached to the work"
  },
  {
    "name": "chromium-edge-launcher",
    "version": "0.2.0",
    "license": "Apache-2.0",
    "copyright": "copyright notice that is included in or attached to the work"
  },
  {
    "name": "ci-info",
    "version": "2.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2016-2018 Thomas Watson Steen"
  },
  {
    "name": "client-only",
    "version": "0.0.1",
    "license": "MIT"
  },
  {
    "name": "cliui",
    "version": "8.0.1",
    "license": "ISC",
    "copyright": "Copyright (c) 2015, Contributors"
  },
  {
    "name": "color",
    "version": "4.2.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2012 Heather Arthur"
  },
  {
    "name": "color-convert",
    "version": "1.9.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2011-2016 Heather Arthur <fayearthur@gmail.com>"
  },
  {
    "name": "color-name",
    "version": "1.1.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2015 Dmitry Ivanov"
  },
  {
    "name": "color-string",
    "version": "1.9.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2011 Heather Arthur <fayearthur@gmail.com>"
  },
  {
    "name": "commander",
    "version": "7.2.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2011 TJ Holowaychuk <tj@vision-media.ca>"
  },
  {
    "name": "connect",
    "version": "3.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2010 Sencha Inc."
  },
  {
    "name": "convert-source-map",
    "version": "2.0.0",
    "license": "MIT",
    "copyright": "Copyright 2013 Thorsten Lorenz."
  },
  {
    "name": "cross-fetch",
    "version": "3.2.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 Leonardo Quixadá"
  },
  {
    "name": "cross-spawn",
    "version": "7.0.6",
    "license": "MIT",
    "copyright": "Copyright (c) 2018 Made With MOXY Lda <hello@moxy.studio>"
  },
  {
    "name": "css-in-js-utils",
    "version": "3.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 Robin Frischmann"
  },
  {
    "name": "css-select",
    "version": "5.2.2",
    "license": "BSD-2-Clause",
    "copyright": "Copyright (c) Felix Böhm"
  },
  {
    "name": "css-tree",
    "version": "1.1.3",
    "license": "MIT",
    "copyright": "Copyright (C) 2016-2019 by Roman Dvornov"
  },
  {
    "name": "css-what",
    "version": "6.2.2",
    "license": "BSD-2-Clause",
    "copyright": "Copyright (c) Felix Böhm"
  },
  {
    "name": "debug",
    "version": "4.4.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-2017 TJ Holowaychuk <tj@vision-media.ca>"
  },
  {
    "name": "decode-uri-component",
    "version": "0.2.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2017, Sam Verschueren <sam.verschueren@gmail.com> (github.com/SamVerschueren)"
  },
  {
    "name": "deepmerge",
    "version": "4.3.1",
    "license": "MIT"
  },
  {
    "name": "depd",
    "version": "2.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-2018 Douglas Christopher Wilson"
  },
  {
    "name": "destroy",
    "version": "1.2.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Jonathan Ong me@jongleberry.com"
  },
  {
    "name": "dom-serializer",
    "version": "2.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 The cheeriojs contributors"
  },
  {
    "name": "domelementtype",
    "version": "2.3.0",
    "license": "BSD-2-Clause",
    "copyright": "Copyright (c) Felix Böhm"
  },
  {
    "name": "domhandler",
    "version": "5.0.3",
    "license": "BSD-2-Clause",
    "copyright": "Copyright (c) Felix Böhm"
  },
  {
    "name": "domutils",
    "version": "3.2.2",
    "license": "BSD-2-Clause",
    "copyright": "Copyright (c) Felix Böhm"
  },
  {
    "name": "dotenv",
    "version": "16.4.7",
    "license": "BSD-2-Clause",
    "copyright": "Copyright (c) 2015, Scott Motte"
  },
  {
    "name": "dotenv-expand",
    "version": "11.0.7",
    "license": "BSD-2-Clause",
    "copyright": "Copyright (c) 2016, Scott Motte"
  },
  {
    "name": "ee-first",
    "version": "1.1.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Jonathan Ong me@jongleberry.com"
  },
  {
    "name": "electron-to-chromium",
    "version": "1.5.399",
    "license": "ISC",
    "copyright": "Copyright 2018 Kilian Valkhof"
  },
  {
    "name": "emoji-regex",
    "version": "8.0.0",
    "license": "MIT",
    "copyright": "Mathias Bynens"
  },
  {
    "name": "encodeurl",
    "version": "1.0.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2016 Douglas Christopher Wilson"
  },
  {
    "name": "entities",
    "version": "4.5.0",
    "license": "BSD-2-Clause",
    "copyright": "Copyright (c) Felix Böhm"
  },
  {
    "name": "error-stack-parser",
    "version": "2.1.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 Eric Wendelin and other contributors"
  },
  {
    "name": "escalade",
    "version": "3.2.0",
    "license": "MIT",
    "copyright": "Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)"
  },
  {
    "name": "escape-html",
    "version": "1.0.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2012-2013 TJ Holowaychuk"
  },
  {
    "name": "escape-string-regexp",
    "version": "1.0.5",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "esprima",
    "version": "4.0.1",
    "license": "BSD-2-Clause",
    "copyright": "Ariya Hidayat"
  },
  {
    "name": "etag",
    "version": "1.8.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-2016 Douglas Christopher Wilson"
  },
  {
    "name": "event-target-shim",
    "version": "5.0.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2015 Toru Nagashima"
  },
  {
    "name": "expo",
    "version": "54.0.36",
    "license": "MIT",
    "copyright": "Expo"
  },
  {
    "name": "expo-constants",
    "version": "18.0.13",
    "license": "MIT",
    "copyright": "650 Industries, Inc."
  },
  {
    "name": "expo-font",
    "version": "57.0.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
  },
  {
    "name": "expo-linking",
    "version": "8.0.12",
    "license": "MIT",
    "copyright": "650 Industries, Inc."
  },
  {
    "name": "expo-modules-autolinking",
    "version": "3.0.26",
    "license": "MIT",
    "copyright": "650 Industries, Inc."
  },
  {
    "name": "expo-modules-core",
    "version": "3.0.30",
    "license": "MIT",
    "copyright": "650 Industries, Inc."
  },
  {
    "name": "expo-router",
    "version": "6.0.24",
    "license": "MIT",
    "copyright": "650 Industries, Inc."
  },
  {
    "name": "expo-server",
    "version": "1.0.7",
    "license": "MIT"
  },
  {
    "name": "expo-splash-screen",
    "version": "31.0.13",
    "license": "MIT",
    "copyright": "650 Industries, Inc."
  },
  {
    "name": "expo-sqlite",
    "version": "16.0.10",
    "license": "MIT",
    "copyright": "650 Industries, Inc."
  },
  {
    "name": "expo-status-bar",
    "version": "3.0.9",
    "license": "MIT",
    "copyright": "650 Industries, Inc."
  },
  {
    "name": "exponential-backoff",
    "version": "3.1.3",
    "license": "Apache-2.0",
    "copyright": "copyright notice that is included in or attached to the work"
  },
  {
    "name": "fast-deep-equal",
    "version": "3.1.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 Evgeny Poberezkin"
  },
  {
    "name": "fast-json-stable-stringify",
    "version": "2.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 Evgeny Poberezkin"
  },
  {
    "name": "fb-watchman",
    "version": "2.0.2",
    "license": "Apache-2.0",
    "copyright": "Wez Furlong"
  },
  {
    "name": "fbjs",
    "version": "3.0.5",
    "license": "MIT",
    "copyright": "Copyright (c) 2013-present, Facebook, Inc."
  },
  {
    "name": "fbjs-css-vars",
    "version": "1.0.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2013-present, Facebook, Inc."
  },
  {
    "name": "fill-range",
    "version": "7.1.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present, Jon Schlinkert."
  },
  {
    "name": "filter-obj",
    "version": "1.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "finalhandler",
    "version": "1.1.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-2017 Douglas Christopher Wilson <doug@somethingdoug.com>"
  },
  {
    "name": "find-up",
    "version": "4.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "flow-enums-runtime",
    "version": "0.0.6",
    "license": "MIT",
    "copyright": "Copyright (c) Facebook, Inc. and its affiliates."
  },
  {
    "name": "fontfaceobserver",
    "version": "2.3.0",
    "license": "BSD-2-Clause",
    "copyright": "Copyright (c) 2014 - Bram Stein"
  },
  {
    "name": "fresh",
    "version": "0.5.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2012 TJ Holowaychuk <tj@vision-media.ca>"
  },
  {
    "name": "gensync",
    "version": "1.0.0-beta.2",
    "license": "MIT",
    "copyright": "Copyright 2018 Logan Smyth <loganfsmyth@gmail.com>"
  },
  {
    "name": "get-caller-file",
    "version": "2.0.5",
    "license": "ISC",
    "copyright": "Copyright 2018 Stefan Penner"
  },
  {
    "name": "get-package-type",
    "version": "0.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2020 CFWare, LLC"
  },
  {
    "name": "getenv",
    "version": "2.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2012-2019 Christoph Tavan <dev@tavan.de>"
  },
  {
    "name": "glob",
    "version": "13.0.6",
    "license": "BlueOak-1.0.0",
    "copyright": "copyright in it."
  },
  {
    "name": "graceful-fs",
    "version": "4.2.11",
    "license": "ISC",
    "copyright": "Copyright (c) 2011-2022 Isaac Z. Schlueter, Ben Noordhuis, and Contributors"
  },
  {
    "name": "has-flag",
    "version": "3.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "hermes-estree",
    "version": "0.32.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "hermes-parser",
    "version": "0.32.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "http-errors",
    "version": "2.0.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Jonathan Ong me@jongleberry.com"
  },
  {
    "name": "https-proxy-agent",
    "version": "7.0.6",
    "license": "MIT",
    "copyright": "Copyright (c) 2013 Nathan Rajlich <nathan@tootallnate.net>"
  },
  {
    "name": "hyphenate-style-name",
    "version": "1.1.0",
    "license": "BSD-3-Clause",
    "copyright": "Copyright (c) 2015, Espen Hovlandsdal"
  },
  {
    "name": "ieee754",
    "version": "1.2.1",
    "license": "BSD-3-Clause",
    "copyright": "Copyright 2008 Fair Oaks Labs, Inc."
  },
  {
    "name": "ignore",
    "version": "5.3.2",
    "license": "MIT",
    "copyright": "kael"
  },
  {
    "name": "image-size",
    "version": "1.2.1",
    "license": "MIT",
    "copyright": "Copyright © 2013-Present Aditya Yadav, http://netroy.in"
  },
  {
    "name": "imurmurhash",
    "version": "0.1.4",
    "license": "MIT",
    "copyright": "Jens Taylor"
  },
  {
    "name": "inherits",
    "version": "2.0.4",
    "license": "ISC",
    "copyright": "Copyright (c) Isaac Z. Schlueter"
  },
  {
    "name": "inline-style-prefixer",
    "version": "7.0.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2015 Robin Frischmann"
  },
  {
    "name": "invariant",
    "version": "2.2.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2013-present, Facebook, Inc."
  },
  {
    "name": "is-arrayish",
    "version": "0.3.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2015 JD Ballard"
  },
  {
    "name": "is-docker",
    "version": "2.2.1",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)"
  },
  {
    "name": "is-fullwidth-code-point",
    "version": "3.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "is-number",
    "version": "7.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present, Jon Schlinkert."
  },
  {
    "name": "is-wsl",
    "version": "2.2.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "isexe",
    "version": "2.0.0",
    "license": "ISC",
    "copyright": "Copyright (c) Isaac Z. Schlueter and Contributors"
  },
  {
    "name": "istanbul-lib-coverage",
    "version": "3.2.2",
    "license": "BSD-3-Clause",
    "copyright": "Copyright 2012-2015 Yahoo! Inc."
  },
  {
    "name": "istanbul-lib-instrument",
    "version": "5.2.1",
    "license": "BSD-3-Clause",
    "copyright": "Copyright 2012-2015 Yahoo! Inc."
  },
  {
    "name": "jest-environment-node",
    "version": "29.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "jest-get-type",
    "version": "29.6.3",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "jest-haste-map",
    "version": "29.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "jest-message-util",
    "version": "29.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "jest-mock",
    "version": "29.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "jest-regex-util",
    "version": "29.6.3",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "jest-util",
    "version": "29.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "jest-validate",
    "version": "29.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "jest-worker",
    "version": "29.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "jimp-compact",
    "version": "0.16.1",
    "license": "MIT"
  },
  {
    "name": "js-tokens",
    "version": "4.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2014, 2015, 2016, 2017, 2018 Simon Lydell"
  },
  {
    "name": "js-yaml",
    "version": "3.15.1",
    "license": "MIT",
    "copyright": "Copyright (C) 2011-2015 by Vitaly Puzrin"
  },
  {
    "name": "jsc-safe-url",
    "version": "0.2.4",
    "license": "0BSD",
    "copyright": "Rob Hogan"
  },
  {
    "name": "jsesc",
    "version": "3.1.0",
    "license": "MIT",
    "copyright": "Mathias Bynens"
  },
  {
    "name": "json5",
    "version": "2.2.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2012-2018 Aseem Kishore, and [others]."
  },
  {
    "name": "leven",
    "version": "3.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "lighthouse-logger",
    "version": "1.4.2",
    "license": "Apache-2.0",
    "copyright": "copyright notice that is included in or attached to the work"
  },
  {
    "name": "lines-and-columns",
    "version": "1.2.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2015 Brian Donovan"
  },
  {
    "name": "locate-path",
    "version": "5.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "lodash.throttle",
    "version": "4.1.1",
    "license": "MIT",
    "copyright": "Copyright jQuery Foundation and other contributors <https://jquery.org/>"
  },
  {
    "name": "loose-envify",
    "version": "1.4.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2015 Andres Suarez <zertosh@gmail.com>"
  },
  {
    "name": "lru-cache",
    "version": "5.1.1",
    "license": "ISC",
    "copyright": "Copyright (c) Isaac Z. Schlueter and Contributors"
  },
  {
    "name": "makeerror",
    "version": "1.0.12",
    "license": "BSD-3-Clause",
    "copyright": "Copyright (c) 2014, Naitik Shah. All rights reserved."
  },
  {
    "name": "marky",
    "version": "1.3.0",
    "license": "Apache-2.0",
    "copyright": "copyright owner that is granting the License."
  },
  {
    "name": "mdn-data",
    "version": "2.0.14",
    "license": "CC0-1.0",
    "copyright": "Copyright and Related Rights in the Work and the meaning and intended legal"
  },
  {
    "name": "memoize-one",
    "version": "5.2.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2019 Alexander Reardon"
  },
  {
    "name": "merge-stream",
    "version": "2.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) Stephen Sugden <me@stephensugden.com> (stephensugden.com)"
  },
  {
    "name": "metro",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "metro-babel-transformer",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "metro-cache",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "metro-cache-key",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "metro-config",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "metro-core",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "metro-file-map",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "metro-minify-terser",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "metro-resolver",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "metro-runtime",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "metro-source-map",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "metro-symbolicate",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "metro-transform-plugins",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "metro-transform-worker",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "micromatch",
    "version": "4.0.8",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present, Jon Schlinkert."
  },
  {
    "name": "mime",
    "version": "1.6.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2010 Benjamin Thomas, Robert Kieffer"
  },
  {
    "name": "mime-db",
    "version": "1.52.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Jonathan Ong <me@jongleberry.com>"
  },
  {
    "name": "mime-types",
    "version": "2.1.35",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Jonathan Ong <me@jongleberry.com>"
  },
  {
    "name": "minimatch",
    "version": "10.2.6",
    "license": "BlueOak-1.0.0",
    "copyright": "copyright in it."
  },
  {
    "name": "minipass",
    "version": "7.1.3",
    "license": "BlueOak-1.0.0",
    "copyright": "copyright in it."
  },
  {
    "name": "mkdirp",
    "version": "1.0.4",
    "license": "MIT",
    "copyright": "Copyright James Halliday (mail@substack.net) and Isaac Z. Schlueter (i@izs.me)"
  },
  {
    "name": "ms",
    "version": "2.1.3",
    "license": "MIT"
  },
  {
    "name": "mz",
    "version": "2.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-2016 Jonathan Ong me@jongleberry.com and Contributors"
  },
  {
    "name": "nanoid",
    "version": "3.3.17",
    "license": "MIT",
    "copyright": "Copyright 2017 Andrey Sitnik <andrey@sitnik.ru>"
  },
  {
    "name": "negotiator",
    "version": "0.6.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2012-2014 Federico Romero"
  },
  {
    "name": "node-fetch",
    "version": "2.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2016 David Frank"
  },
  {
    "name": "node-int64",
    "version": "0.4.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Robert Kieffer"
  },
  {
    "name": "node-releases",
    "version": "2.0.51",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 Sergey Rubanov (https://github.com/chicoxyzzy)"
  },
  {
    "name": "normalize-path",
    "version": "3.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-2018, Jon Schlinkert."
  },
  {
    "name": "nth-check",
    "version": "2.1.1",
    "license": "BSD-2-Clause",
    "copyright": "Copyright (c) Felix Böhm"
  },
  {
    "name": "nullthrows",
    "version": "1.1.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2016 Andres Suarez"
  },
  {
    "name": "ob1",
    "version": "0.83.3",
    "license": "MIT"
  },
  {
    "name": "object-assign",
    "version": "4.1.1",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "on-finished",
    "version": "2.3.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2013 Jonathan Ong <me@jongleberry.com>"
  },
  {
    "name": "open",
    "version": "7.4.2",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)"
  },
  {
    "name": "p-limit",
    "version": "3.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)"
  },
  {
    "name": "p-locate",
    "version": "4.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "parse-png",
    "version": "2.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) Kevin Mårtensson <kevinmartensson@gmail.com> (github.com/kevva)"
  },
  {
    "name": "parseurl",
    "version": "1.3.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Jonathan Ong <me@jongleberry.com>"
  },
  {
    "name": "path-exists",
    "version": "4.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "path-key",
    "version": "3.1.1",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "path-scurry",
    "version": "2.0.2",
    "license": "BlueOak-1.0.0",
    "copyright": "copyright in it."
  },
  {
    "name": "picocolors",
    "version": "1.1.1",
    "license": "ISC",
    "copyright": "Copyright (c) 2021-2024 Oleksii Raspopov, Kostiantyn Denysov, Anton Verinov"
  },
  {
    "name": "picomatch",
    "version": "2.3.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2017-present, Jon Schlinkert."
  },
  {
    "name": "pirates",
    "version": "4.0.7",
    "license": "MIT",
    "copyright": "Copyright (c) 2016-2018 Ari Porad"
  },
  {
    "name": "plist",
    "version": "3.1.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2010-2017 Nathan Rajlich <nathan@tootallnate.net>"
  },
  {
    "name": "pngjs",
    "version": "3.4.0",
    "license": "MIT"
  },
  {
    "name": "postcss-value-parser",
    "version": "4.2.0",
    "license": "MIT",
    "copyright": "Copyright (c) Bogdan Chadkin <trysound@yandex.ru>"
  },
  {
    "name": "pretty-format",
    "version": "29.7.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "promise",
    "version": "8.3.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Forbes Lindesay"
  },
  {
    "name": "punycode",
    "version": "2.3.1",
    "license": "MIT",
    "copyright": "Mathias Bynens"
  },
  {
    "name": "query-string",
    "version": "7.1.3",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (http://sindresorhus.com)"
  },
  {
    "name": "queue",
    "version": "6.0.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Jesse Tane <jesse.tane@gmail.com>"
  },
  {
    "name": "range-parser",
    "version": "1.2.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2012-2014 TJ Holowaychuk <tj@vision-media.ca>"
  },
  {
    "name": "react",
    "version": "19.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "react-devtools-core",
    "version": "6.1.5",
    "license": "MIT"
  },
  {
    "name": "react-dom",
    "version": "19.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "react-fast-compare",
    "version": "3.2.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2018 Formidable Labs"
  },
  {
    "name": "react-freeze",
    "version": "1.0.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2021 Software Mansion"
  },
  {
    "name": "react-is",
    "version": "19.2.8",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "react-native",
    "version": "0.81.5",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "react-native-is-edge-to-edge",
    "version": "1.3.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2024 Mathieu Acthernoene"
  },
  {
    "name": "react-native-safe-area-context",
    "version": "5.6.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2019 Th3rd Wave"
  },
  {
    "name": "react-native-screens",
    "version": "4.16.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2018 Software Mansion <swmansion.com>"
  },
  {
    "name": "react-native-svg",
    "version": "15.12.1",
    "license": "MIT",
    "copyright": "Copyright (c) [2015-2016] [Horcrux]"
  },
  {
    "name": "react-native-web",
    "version": "0.21.2",
    "license": "MIT",
    "copyright": "Copyright (c) Nicolas Gallagher."
  },
  {
    "name": "react-refresh",
    "version": "0.14.2",
    "license": "MIT",
    "copyright": "Copyright (c) Facebook, Inc. and its affiliates."
  },
  {
    "name": "regenerator-runtime",
    "version": "0.13.11",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-present, Facebook, Inc."
  },
  {
    "name": "require-directory",
    "version": "2.1.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2011 Troy Goode <troygoode@gmail.com>"
  },
  {
    "name": "require-from-string",
    "version": "2.0.2",
    "license": "MIT",
    "copyright": "Copyright (c) Vsevolod Strukchinsky <floatdrop@gmail.com> (github.com/floatdrop)"
  },
  {
    "name": "resolve-from",
    "version": "5.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "resolve-workspace-root",
    "version": "2.0.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2024-present Cedric van Putten <me@cedric.dev>"
  },
  {
    "name": "rimraf",
    "version": "3.0.2",
    "license": "ISC",
    "copyright": "Copyright (c) Isaac Z. Schlueter and Contributors"
  },
  {
    "name": "sax",
    "version": "1.6.1",
    "license": "BlueOak-1.0.0",
    "copyright": "copyright in it."
  },
  {
    "name": "scheduler",
    "version": "0.26.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "semver",
    "version": "7.8.5",
    "license": "ISC",
    "copyright": "Copyright (c) Isaac Z. Schlueter and Contributors"
  },
  {
    "name": "send",
    "version": "0.19.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2012 TJ Holowaychuk"
  },
  {
    "name": "serialize-error",
    "version": "2.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "serve-static",
    "version": "1.16.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2010 Sencha Inc."
  },
  {
    "name": "server-only",
    "version": "0.0.1",
    "license": "MIT"
  },
  {
    "name": "setimmediate",
    "version": "1.0.5",
    "license": "MIT",
    "copyright": "Copyright (c) 2012 Barnesandnoble.com, llc, Donavon West, and Domenic Denicola"
  },
  {
    "name": "setprototypeof",
    "version": "1.2.0",
    "license": "ISC",
    "copyright": "Copyright (c) 2015, Wes Todd"
  },
  {
    "name": "sf-symbols-typescript",
    "version": "2.2.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2023 Fernando Rojo"
  },
  {
    "name": "shallowequal",
    "version": "1.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 Alberto Leal <mailforalberto@gmail.com> (github.com/dashed)"
  },
  {
    "name": "shebang-command",
    "version": "2.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) Kevin Mårtensson <kevinmartensson@gmail.com> (github.com/kevva)"
  },
  {
    "name": "shebang-regex",
    "version": "3.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "shell-quote",
    "version": "1.10.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2013 James Halliday (mail@substack.net)"
  },
  {
    "name": "signal-exit",
    "version": "3.0.7",
    "license": "ISC",
    "copyright": "Copyright (c) 2015, Contributors"
  },
  {
    "name": "simple-plist",
    "version": "1.3.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2013 Joe Wollard"
  },
  {
    "name": "simple-swizzle",
    "version": "0.2.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2015 Josh Junon"
  },
  {
    "name": "slash",
    "version": "3.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "slugify",
    "version": "1.6.9",
    "license": "MIT",
    "copyright": "Copyright (c) Simeon Velichkov <simeonvelichkov@gmail.com>"
  },
  {
    "name": "source-map",
    "version": "0.5.7",
    "license": "BSD-3-Clause",
    "copyright": "Copyright (c) 2009-2011, Mozilla Foundation and contributors"
  },
  {
    "name": "source-map-support",
    "version": "0.5.21",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Evan Wallace"
  },
  {
    "name": "split-on-first",
    "version": "1.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "sprintf-js",
    "version": "1.0.3",
    "license": "BSD-3-Clause",
    "copyright": "Copyright (c) 2007-2014, Alexandru Marasteanu <hello [at) alexei (dot] ro>"
  },
  {
    "name": "stack-utils",
    "version": "2.0.6",
    "license": "MIT",
    "copyright": "Copyright (c) 2016-2022 Isaac Z. Schlueter <i@izs.me>, James Talmage <james@talmage.io> (github.com/jamestalmage), and Contributors"
  },
  {
    "name": "stackframe",
    "version": "1.3.4",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 Eric Wendelin and other contributors"
  },
  {
    "name": "stacktrace-parser",
    "version": "0.1.11",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-2019 Georg Tavonius"
  },
  {
    "name": "standard-navigation",
    "version": "0.0.8",
    "license": "MIT",
    "copyright": "Satyajit Sahoo"
  },
  {
    "name": "statuses",
    "version": "1.5.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Jonathan Ong <me@jongleberry.com>"
  },
  {
    "name": "stream-buffers",
    "version": "2.2.0",
    "license": "Unlicense",
    "copyright": "Sam Day"
  },
  {
    "name": "strict-uri-encode",
    "version": "2.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) Kevin Martensson <kevinmartensson@gmail.com> (github.com/kevva)"
  },
  {
    "name": "string-width",
    "version": "4.2.3",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "strip-ansi",
    "version": "6.0.1",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "styleq",
    "version": "0.1.3",
    "license": "MIT",
    "copyright": "Copyright (c) Nicolas Gallagher"
  },
  {
    "name": "sucrase",
    "version": "3.35.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2012-2018 various contributors (see AUTHORS)"
  },
  {
    "name": "supports-color",
    "version": "5.5.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "terser",
    "version": "5.49.0",
    "license": "BSD-2-Clause",
    "copyright": "Copyright 2012-2018 (c) Mihai Bazon <mihai.bazon@gmail.com>"
  },
  {
    "name": "test-exclude",
    "version": "6.0.0",
    "license": "ISC",
    "copyright": "Copyright (c) 2016, Contributors"
  },
  {
    "name": "thenify",
    "version": "3.3.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-2016 Jonathan Ong me@jongleberry.com and contributors"
  },
  {
    "name": "thenify-all",
    "version": "1.6.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2014 Jonathan Ong me@jongleberry.com"
  },
  {
    "name": "throat",
    "version": "5.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2013 Forbes Lindesay"
  },
  {
    "name": "tinyglobby",
    "version": "0.2.17",
    "license": "MIT",
    "copyright": "Copyright (c) 2024 Madeline Gurriarán"
  },
  {
    "name": "tmpl",
    "version": "1.0.5",
    "license": "BSD-3-Clause",
    "copyright": "Copyright (c) 2014, Naitik Shah. All rights reserved."
  },
  {
    "name": "to-regex-range",
    "version": "5.0.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2015-present, Jon Schlinkert."
  },
  {
    "name": "toidentifier",
    "version": "1.0.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2016 Douglas Christopher Wilson <doug@somethingdoug.com>"
  },
  {
    "name": "tr46",
    "version": "0.0.3",
    "license": "MIT",
    "copyright": "Sebastian Mayr"
  },
  {
    "name": "ts-interface-checker",
    "version": "0.1.13",
    "license": "Apache-2.0",
    "copyright": "copyright notice that is included in or attached to the work"
  },
  {
    "name": "type-detect",
    "version": "4.0.8",
    "license": "MIT",
    "copyright": "Copyright (c) 2013 Jake Luer <jake@alogicalparadox.com> (http://alogicalparadox.com)"
  },
  {
    "name": "type-fest",
    "version": "0.7.1",
    "license": "(MIT OR CC0-1.0)",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
  },
  {
    "name": "ua-parser-js",
    "version": "1.0.41",
    "license": "MIT",
    "copyright": "Faisal Salman"
  },
  {
    "name": "undici-types",
    "version": "8.3.0",
    "license": "MIT",
    "copyright": "Copyright (c) Matteo Collina and Undici contributors"
  },
  {
    "name": "unpipe",
    "version": "1.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2015 Douglas Christopher Wilson <doug@somethingdoug.com>"
  },
  {
    "name": "update-browserslist-db",
    "version": "1.2.3",
    "license": "MIT",
    "copyright": "Copyright 2022 Andrey Sitnik <andrey@sitnik.ru> and other contributors"
  },
  {
    "name": "use-latest-callback",
    "version": "0.2.6",
    "license": "MIT",
    "copyright": "Copyright (c) 2023 Satyajit Sahoo"
  },
  {
    "name": "use-sync-external-store",
    "version": "1.6.0",
    "license": "MIT",
    "copyright": "Copyright (c) Meta Platforms, Inc. and affiliates."
  },
  {
    "name": "utils-merge",
    "version": "1.0.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2013-2017 Jared Hanson"
  },
  {
    "name": "uuid",
    "version": "7.0.3",
    "license": "MIT",
    "copyright": "Copyright (c) 2010-2016 Robert Kieffer and other contributors"
  },
  {
    "name": "vaul",
    "version": "1.1.2",
    "license": "MIT",
    "copyright": "Copyright (c) 2023 Emil Kowalski"
  },
  {
    "name": "vlq",
    "version": "1.0.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2017 [these people](https://github.com/Rich-Harris/vlq/graphs/contributors)"
  },
  {
    "name": "walker",
    "version": "1.0.8",
    "license": "Apache-2.0",
    "copyright": "Copyright 2013 Naitik Shah"
  },
  {
    "name": "warn-once",
    "version": "0.1.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2022 Satyajit Sahoo"
  },
  {
    "name": "webidl-conversions",
    "version": "5.0.0",
    "license": "BSD-2-Clause",
    "copyright": "Copyright (c) 2014, Domenic Denicola"
  },
  {
    "name": "whatwg-fetch",
    "version": "3.6.20",
    "license": "MIT",
    "copyright": "Copyright (c) 2014-2023 GitHub, Inc."
  },
  {
    "name": "whatwg-url",
    "version": "5.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) 2015–2016 Sebastian Mayr"
  },
  {
    "name": "whatwg-url-without-unicode",
    "version": "8.0.0-3",
    "license": "MIT",
    "copyright": "Copyright (c) 2015–2016 Sebastian Mayr"
  },
  {
    "name": "which",
    "version": "2.0.2",
    "license": "ISC",
    "copyright": "Copyright (c) Isaac Z. Schlueter and Contributors"
  },
  {
    "name": "wrap-ansi",
    "version": "7.0.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)"
  },
  {
    "name": "write-file-atomic",
    "version": "4.0.2",
    "license": "ISC",
    "copyright": "Copyright (c) 2015, Rebecca Turner"
  },
  {
    "name": "ws",
    "version": "7.5.13",
    "license": "MIT",
    "copyright": "Copyright (c) 2011 Einar Otto Stangvik <einaros@gmail.com>"
  },
  {
    "name": "xcode",
    "version": "3.0.1",
    "license": "Apache-2.0",
    "copyright": "copyright notice that is included in or attached to the work"
  },
  {
    "name": "xml2js",
    "version": "0.6.0",
    "license": "MIT",
    "copyright": "Copyright 2010, 2011, 2012, 2013. All rights reserved."
  },
  {
    "name": "xmlbuilder",
    "version": "15.1.1",
    "license": "MIT",
    "copyright": "Copyright (c) 2013 Ozgur Ozcitak"
  },
  {
    "name": "y18n",
    "version": "5.0.8",
    "license": "ISC",
    "copyright": "Copyright (c) 2015, Contributors"
  },
  {
    "name": "yallist",
    "version": "3.1.1",
    "license": "ISC",
    "copyright": "Copyright (c) Isaac Z. Schlueter and Contributors"
  },
  {
    "name": "yaml",
    "version": "2.9.0",
    "license": "ISC",
    "copyright": "Copyright Eemeli Aro <eemeli@gmail.com>"
  },
  {
    "name": "yargs",
    "version": "17.7.3",
    "license": "MIT",
    "copyright": "Copyright 2010 James Halliday (mail@substack.net); Modified work Copyright 2014 Contributors (ben@npmjs.com)"
  },
  {
    "name": "yargs-parser",
    "version": "21.1.1",
    "license": "ISC",
    "copyright": "Copyright (c) 2016, Contributors"
  },
  {
    "name": "yocto-queue",
    "version": "0.1.0",
    "license": "MIT",
    "copyright": "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)"
  }
];

/** Listede geçen farklı lisans türleri. */
export const OSS_LICENSE_TYPES: string[] = [
  "(MIT OR CC0-1.0)",
  "0BSD",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "BlueOak-1.0.0",
  "CC-BY-4.0",
  "CC0-1.0",
  "ISC",
  "MIT",
  "Unlicense"
];
