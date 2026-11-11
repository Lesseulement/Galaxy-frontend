
export interface BodyCreateDraftApiGalaxiesPost {
  /**
   * Title
   * Название галактики
   * @minLength 1
   * @maxLength 100
   */
  title: string;
  /**
   * Image
   * Файл фото
   */
  image: string;
  /**
   * Video
   * Файл видео
   */
  video: string;
}

/** GalaxyOut */
export interface GalaxyOut {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Supernova */
  supernova: string | null;
  /** Apparent Magnitude */
  apparent_magnitude: number | null;
  /** Distance Mpc */
  distance_mpc: number | null;
  /** Description */
  description: string | null;
  /** Image Url */
  image_url: string;
  /** Video Url */
  video_url: string;
  /** Likes Count */
  likes_count: number;
  /** Is Liked */
  is_liked: number;
  /** Is Mine */
  is_mine: number;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** LikeIn */
export interface LikeIn {
  /**
   * Like
   * @min 0
   * @max 1
   */
  like: number;
}

/** LikeOut */
export interface LikeOut {
  /** Likes Count */
  likes_count: number;
  /** Is Liked */
  is_liked: number;
}

/**
 * PublishIn
 * Поля, которые вводятся перед кнопкой «Опубликовать».
 */
export interface PublishIn {
  /**
   * Supernova
   * @minLength 1
   * @maxLength 30
   */
  supernova: string;
  /** Apparent Magnitude */
  apparent_magnitude: number;
  /**
   * Distance Mpc
   * @exclusiveMin 0
   */
  distance_mpc: number;
  /** Description */
  description?: string | null;
}

/** UserIn */
export interface UserIn {
  /**
   * Username
   * @minLength 3
   * @maxLength 50
   */
  username: string;
  /**
   * Password
   * @minLength 6
   * @maxLength 128
   */
  password: string;
}

/** UserOut */
export interface UserOut {
  /** Id */
  id: number;
  /** Username */
  username: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
  /** Input */
  input?: any;
  /** Context */
  ctx?: object;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Galaxy API
 * @version 4.0
 *
 *
 * Определение расстояния до галактик по сверхновым типа Ia.
 *
 * **Авторизация** — через сессию: метод `POST /api/users/login` создаёт сессию в Redis
 * и возвращает куку `session_id`. Браузер и Swagger дальше отправляют куку сами.
 *
 * * без входа (гость) — только чтение: список галактик и лента;
 * * после входа (создатель) — черновик, «Далее», «Опубликовать», «Удалить», лайк, выход.
 *
 * Методы с замком 🔒 требуют входа, без куки сессии возвращают **401**.
 * Ошибки возвращаются только кодом ответа, тело пустое.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  galaxies = {
    /**
     * @description Только опубликованные галактики. Фильтр по видимой звёздной величине `magnitude_from`–`magnitude_to`, необязательный поиск по названию `title`. Доступно без входа; для вошедшего пользователя заполняются `is_liked` и `is_mine`.
     *
     * @tags Галактики
     * @name ListGalaxiesApiGalaxiesGet
     * @summary Список галактик (плитка)
     * @request GET:/api/galaxies
     */
    listGalaxiesApiGalaxiesGet: (
      query?: {
        /**
         * Magnitude From
         * Видимая звёздная величина от
         */
        magnitude_from?: number | null;
        /**
         * Magnitude To
         * Видимая звёздная величина до
         */
        magnitude_to?: number | null;
        /**
         * Title
         * Часть названия
         */
        title?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<GalaxyOut[], HTTPValidationError>({
        path: `/api/galaxies`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Передаются название и файлы фото и видео. Файлы сохраняются в MinIO под латинскими именами. Создатель проставляется автоматически из сессии. Требуется вход.
     *
     * @tags Галактики
     * @name CreateDraftApiGalaxiesPost
     * @summary Кнопка «Далее»: создать черновик
     * @request POST:/api/galaxies
     * @secure
     */
    createDraftApiGalaxiesPost: (data: BodyCreateDraftApiGalaxiesPost, params: RequestParams = {}) =>
      this.request<GalaxyOut, void | HTTPValidationError>({
        path: `/api/galaxies`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Без `id` — первая опубликованная галактика; `id` — эта галактика; `id` и `next=true` — следующая после неё (по кругу). Доступно без входа.
     *
     * @tags Галактики
     * @name FeedApiGalaxiesFeedGet
     * @summary Лента
     * @request GET:/api/galaxies/feed
     */
    feedApiGalaxiesFeedGet: (
      query?: {
        /**
         * Id
         * id текущей галактики
         */
        id?: number | null;
        /**
         * Next
         * true — следующая после id
         * @default false
         */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<GalaxyOut, void | HTTPValidationError>({
        path: `/api/galaxies/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Черновик текущего пользователя (у пользователя не больше одного). Требуется вход.
     *
     * @tags Галактики
     * @name ReadDraftApiGalaxiesDraftGet
     * @summary Поля черновика
     * @request GET:/api/galaxies/draft
     * @secure
     */
    readDraftApiGalaxiesDraftGet: (params: RequestParams = {}) =>
      this.request<GalaxyOut, void>({
        path: `/api/galaxies/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Сохраняет поля формы (сверхновая, видимая звёздная величина, расстояние, описание) и меняет статус черновика на published. Требуется вход.
     *
     * @tags Галактики
     * @name PublishDraftApiGalaxiesDraftPublishPut
     * @summary Кнопка «Опубликовать»
     * @request PUT:/api/galaxies/draft/publish
     * @secure
     */
    publishDraftApiGalaxiesDraftPublishPut: (data: PublishIn, params: RequestParams = {}) =>
      this.request<GalaxyOut, void | HTTPValidationError>({
        path: `/api/galaxies/draft/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Мягкое удаление (статус deleted). Удалять можно только свои галактики. Требуется вход.
     *
     * @tags Галактики
     * @name DeleteGalaxyApiGalaxiesGalaxyIdDelete
     * @summary Кнопка «Удалить»
     * @request DELETE:/api/galaxies/{galaxy_id}
     * @secure
     */
    deleteGalaxyApiGalaxiesGalaxyIdDelete: (galaxyId: number, params: RequestParams = {}) =>
      this.request<any, void | HTTPValidationError>({
        path: `/api/galaxies/${galaxyId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description `like`: 1 — поставить лайк, 0 — отменить. Лайк ставится от текущего пользователя. Требуется вход.
     *
     * @tags Галактики
     * @name LikeGalaxyApiGalaxiesGalaxyIdLikePost
     * @summary Сердечко: лайк
     * @request POST:/api/galaxies/{galaxy_id}/like
     * @secure
     */
    likeGalaxyApiGalaxiesGalaxyIdLikePost: (galaxyId: number, data: LikeIn, params: RequestParams = {}) =>
      this.request<LikeOut, void | HTTPValidationError>({
        path: `/api/galaxies/${galaxyId}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Создаёт пользователя. Пароль хранится в БД только в виде хэша. Доступно без входа.
     *
     * @tags Пользователи
     * @name RegisterApiUsersRegisterPost
     * @summary Регистрация
     * @request POST:/api/users/register
     */
    registerApiUsersRegisterPost: (data: UserIn, params: RequestParams = {}) =>
      this.request<UserOut, void | HTTPValidationError>({
        path: `/api/users/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Проверяет логин и пароль, создаёт сессию в Redis и возвращает куку `session_id`. Браузер (и Swagger) дальше отправляет куку сам.
     *
     * @tags Пользователи
     * @name LoginApiUsersLoginPost
     * @summary Аутентификация (вход)
     * @request POST:/api/users/login
     */
    loginApiUsersLoginPost: (data: UserIn, params: RequestParams = {}) =>
      this.request<UserOut, void | HTTPValidationError>({
        path: `/api/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет сессию из Redis и куку `session_id`. Требуется вход.
     *
     * @tags Пользователи
     * @name LogoutApiUsersLogoutPost
     * @summary Деавторизация (выход)
     * @request POST:/api/users/logout
     * @secure
     */
    logoutApiUsersLogoutPost: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/api/users/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
