// Галактика (услуга) — те же поля, что отдаёт веб-сервис GET /api/galaxies
export interface Galaxy {
  id: number
  title: string
  supernova: string | null            // обозначение сверхновой типа Ia
  apparent_magnitude: number | null   // видимая звёздная величина m
  distance_mpc: number | null         // расстояние, Мпк
  description: string | null
  image_url: string | null            // фото в S3 (MinIO); null — фото по умолчанию
  video_url: string | null            // видео в S3 (MinIO); null — видео по умолчанию
  likes_count: number
  is_liked: number
  is_mine: number
}

// Фильтр плитки по видимой звёздной величине
export interface MagnitudeRange {
  from: number
  to: number
}

// Ответ API-слоя: данные и признак, что они взяты из mock
export interface Loaded<T> {
  data: T
  fromMock: boolean
}
