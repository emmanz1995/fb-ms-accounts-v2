import axios, { AxiosInstance } from 'axios';
import jwt from 'jsonwebtoken';
import { NodeCache } from '../helper';

interface TinkConnectorOptions {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
}

class TinKConnector {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly api: AxiosInstance;
  constructor(options: TinkConnectorOptions) {
    const { client_id, client_secret, redirect_uri } = options;
    this.clientId = client_id;
    this.clientSecret = client_secret;
    this.redirectUri = redirect_uri;
    this.api = axios.create({
      baseURL: 'https://api.tink.com/api/v1',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  public getToken = async (scope: string, grantType: string) => {
    const payload = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope,
      grant_type: grantType,
    };

    const opt = {
      url: '',
      method: 'POST',
      data: new URLSearchParams(payload),
    };

    try {
      const { data } = await this.api(opt);
      return data;
    } catch (err: any) {
      console.log(err);
      throw new Error(
        `Error authorizing Tink app: ${err?.response?.data?.errorMessage || err.message}`
      );
    }
  };

  cachedToken = async () => {
    const cachedToken = NodeCache.get('access_token');
    if (cachedToken) return cachedToken;

    const token = await this.getToken('user:create', 'client_credentials');

    const decodeToken: any = jwt.decode(token);
    const expiresIn = Math.round(decodeToken.exp * 1000 - Date.now());

    NodeCache.set('access_token', token, expiresIn);

    return NodeCache.get('access_token');
  };

  createNewUser = async (extUserId: string, locale: string, market: string) => {
    const accessToken = await this.cachedToken();
    try {
      const { data } = await axios({
        url: `/user/create`,
        method: 'POST',
        data: new URLSearchParams({
          external_user_id: extUserId,
          locale,
          market,
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      return data;
    } catch (err: any) {
      console.log(err);
      throw new Error(
        `Error authorizing Tink app: ${err?.response?.data?.errorMessage || err.message}`
      );
    }
  };
}

export default TinKConnector;
