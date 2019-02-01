import { Config } from 'src/assets/config';

export const environment = {
  production: true,
  apiUrl: `${Config.getHttp()}://${Config.getDomain()}/api/`
};
