import type { Galaxy } from './types'

// Mock-коллекция галактик: используется, когда веб-сервис недоступен.
// У части галактик нет фото и видео (null) — для них показываются файлы по умолчанию.
export const GALAXIES_MOCK: Galaxy[] = [
  {
    id: 1, title: 'NGC 1300', supernova: 'SN 2002fk', apparent_magnitude: 12.8, distance_mpc: 18.5,
    description: 'Спиральная галактика с перемычкой в созвездии Эридан',
    image_url: 'http://localhost:9000/galaxies.media/ngc1300.jpg', video_url: null,
    likes_count: 3, is_liked: 0, is_mine: 0,
  },
  {
    id: 2, title: 'M 82 (Сигара)', supernova: 'SN 2014J', apparent_magnitude: 10.5, distance_mpc: 3.5,
    description: 'Галактика со вспышкой звездообразования в Большой Медведице',
    image_url: null, video_url: null,
    likes_count: 1, is_liked: 0, is_mine: 0,
  },
  {
    id: 3, title: 'NGC 4527', supernova: 'SN 1991T', apparent_magnitude: 11.5, distance_mpc: 13.0,
    description: 'Спиральная галактика в созвездии Девы',
    image_url: null, video_url: null,
    likes_count: 2, is_liked: 0, is_mine: 0,
  },
  {
    id: 4, title: 'NGC 5128 (Центавр A)', supernova: 'SN 1986G', apparent_magnitude: 11.4, distance_mpc: 3.8,
    description: 'Линзовидная галактика, мощный радиоисточник',
    image_url: 'http://localhost:9000/galaxies.media/ngc5128.gif', video_url: null,
    likes_count: 2, is_liked: 0, is_mine: 0,
  },
  {
    id: 5, title: 'NGC 3982', supernova: 'SN 1998aq', apparent_magnitude: 12.3, distance_mpc: 20.0,
    description: 'Спиральная галактика в Большой Медведице',
    image_url: null, video_url: null,
    likes_count: 1, is_liked: 0, is_mine: 0,
  },
]
