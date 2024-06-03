import { version } from '../../package.json';
import * as process from 'process';

export interface ServiceConfig {
  serverPort: number;
  serviceName: string;
  serviceVersion: string;
  logLevel: string;
}

export default (): ServiceConfig => ({
  serverPort: parseInt(process.env.PORT, 10) || 8080,
  serviceName: 'DMS',
  serviceVersion: version,
  logLevel: process.env.LOGLEVEL,
});
