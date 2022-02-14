import Axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  CancelToken,
  CancelTokenSource,
} from 'axios';
import { localStorageService } from '../LocalStorageService';

interface RequestConfig extends AxiosRequestConfig {
  requestId?: string;
  redirectIfUnauthorized?: boolean;
}

export declare type QueryParams = {
  [key: string]: string | string[];
};

const BASE_URL = '';

export class BaseApiService {
  private static instance: BaseApiService;

  private requestMap = new Map<string, CancelTokenSource>();

  public static getInstance(): BaseApiService {
    if (!this.instance) {
      this.instance = new BaseApiService();
    }
    return this.instance;
  }

  public get<T = any>(
    url: string,
    opts?: {
      params?: QueryParams;
      headers?: AxiosRequestHeaders;
      extras?: {
        requestId?: string;
        useAuth?: boolean;
      };
    }
  ): Promise<T> {
    return this.request<T>(
      {
        method: 'GET',
        url,
        headers: opts?.headers,
        params: opts?.params,
        requestId: opts?.extras?.requestId,
      },
      opts?.extras?.useAuth
    );
  }

  public delete<T = any>(
    url: string,
    opts?: {
      params?: QueryParams;
      headers?: AxiosRequestHeaders;
      extras?: {
        requestId?: string;
        useAuth?: boolean;
      };
    }
  ) {
    return this.request<T>(
      {
        method: 'DELETE',
        url,
        headers: opts?.headers,
        params: opts?.params,
        requestId: opts?.extras?.requestId,
      },
      opts?.extras?.useAuth
    );
  }

  public post<T = any>(
    url: string,
    data?: any,
    opts?: {
      headers?: AxiosRequestHeaders;
      params?: QueryParams;
      extras?: {
        requestId?: string;
        useAuth?: boolean;
      };
    }
  ) {
    return this.request<T>(
      {
        method: 'POST',
        url,
        data,
        headers: opts?.headers,
        params: opts?.params,
        requestId: opts?.extras?.requestId,
      },
      opts?.extras?.useAuth
    );
  }

  public put<T = any>(
    url: string,
    data?: any,
    opts?: {
      headers?: AxiosRequestHeaders;
      params?: QueryParams;
      extras?: {
        requestId?: string;
        useAuth?: boolean;
      };
    }
  ) {
    return this.request<T>(
      {
        method: 'PUT',
        url,
        data,
        headers: opts?.headers,
        params: opts?.params,
        requestId: opts?.extras?.requestId,
      },
      opts?.extras?.useAuth
    );
  }

  public patch<T = any>(
    url: string,
    data?: any,
    opts?: {
      headers?: AxiosRequestHeaders;
      params?: QueryParams;
      extras?: {
        requestId?: string;
        useAuth: boolean;
      };
    }
  ) {
    return this.request<T>(
      {
        method: 'PATCH',
        url,
        data,
        headers: opts?.headers,
        params: opts?.params,
        requestId: opts?.extras?.requestId,
      },
      opts?.extras?.useAuth
    );
  }

  generateHeaders = async (
    headers?: AxiosRequestHeaders,
    useAuth?: boolean
  ) => {
    let defaultHeaders = {};

    if (useAuth) {
      defaultHeaders = {
        ...defaultHeaders,
        Authorization: `bearer ${localStorageService.getAuthToken()}`,
      };
    }

    if (!headers) {
      return defaultHeaders;
    }
    return {
      ...defaultHeaders,
      ...headers,
    };
  };

  private async request<T>(
    config: RequestConfig,
    useAuth?: boolean
  ): Promise<T> {
    const cancelToken = this.addToRequestMap(config.requestId);
    try {
      const response = await Axios.request({
        baseURL: BASE_URL,
        cancelToken,
        ...config,
        headers: await this.generateHeaders(config.headers, useAuth ?? true),
      });
      this.removeFromRequestMap(config.requestId);
      return response?.data as T;
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
      } else {
        console.log(error);
      }
      throw error;
    }
  }

  private addToRequestMap(requestId?: string): CancelToken | undefined {
    if (!requestId) {
      return undefined;
    }

    const source = Axios.CancelToken.source();
    this.requestMap.set(requestId, source);
    return source.token;
  }

  private removeFromRequestMap(requestId?: string) {
    if (!requestId) {
      return;
    }

    this.requestMap.delete(requestId);
  }
}

export const baseApiService = BaseApiService.getInstance();
