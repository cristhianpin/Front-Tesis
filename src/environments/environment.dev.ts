/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { NgxLoggerLevel } from 'ngx-logger';
import { version } from '../../package.json';

export const environment = {
  production: false,
  VERSION: version,
  ENVIRONMENT: 'dev',
  TOKEN_KEY: 'currentUser',
  // REST_URL: '/backend-dev-h2/api/v1/',
  // REST_AUTH_URL: '/backend-dev-h2/auth/',
  REST_URL: '/api/v1/',
  DATE_FORMAT_LONG: 'dd-MM-yyyy HH:mm:ss',
  DATE_FORMAT_SHORT: 'dd-MM-yyyy',
  EXCEL_EXTENSION: 'xlsx',
  CSV_EXTENSION: 'csv',
  PDF_EXTENSION: 'pdf',
  CSV_SEPARATOR: ',',
  LOCALE: 'en-US',
  TZ: 'UTC +0',
  NUMBER_FORMAT: '1.2-2',
  LOG_LEVEL: NgxLoggerLevel.TRACE,
  SERVER_LOG_LEVEL: NgxLoggerLevel.OFF,
  ENABLE_SOURCE_MAPS: true,
  DISABLE_FILE_DETAILS: false,
  DISABLE_CONSOLE_LOGGING: false,
};
