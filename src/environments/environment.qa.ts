/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { NgxLoggerLevel } from 'ngx-logger';
import { version } from '../../package.json';

export const environment = {
  production: true,
  VERSION: version,
  ENVIRONMENT: 'qa',
  TOKEN_KEY: 'currentUser',
  REST_URL: 'https://common-api-qa.hacesbyallpa.link/backend-qa/api/v1/',
  REST_AUTH_URL: 'https://common-api-qa.hacesbyallpa.link/backend-qa/auth/',
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
  SERVER_LOG_LEVEL: NgxLoggerLevel.TRACE,
  ENABLE_SOURCE_MAPS: false,
  DISABLE_FILE_DETAILS: true,
  DISABLE_CONSOLE_LOGGING: false,
};
