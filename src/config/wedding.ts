/** Все данные приглашения редактируются здесь. Дата, место и программа демонстрационные. */
export const wedding = {
  groom: 'Адилет',
  bride: 'Элина',
  monogram: 'А & Э',
  edition: 'ПОД ОДНОЙ ЛУНОЙ',
  description: 'Романтическая готическая сказка: Адилет и Элина, Jack & Sally и одна общая история.',
  date: { iso: '2027-08-24T16:00:00+06:00', display: '24 · 08 · 2027' },
  venue: { name: 'Место нашей сказки', address: 'Адрес места проведения', mapUrl: '' },
  schedule: [
    { time: '16:00', title: 'Церемония' },
    { time: '17:00', title: 'Встречи и фотографии' },
    { time: '18:00', title: 'Праздничный ужин' },
  ],
  chapters: [
    { id: 'invitation', nav: 'Приглашение', eyebrow: 'МЫ ЖЕНИМСЯ', title: '', accent: '', text: 'В этом странном, прекрасном мире\nмы нашли друг друга.', footer: 'Листайте — история начинается', location: 'ПОД ОДНОЙ ЛУНОЙ' },
    { id: 'story', nav: 'Наша история', eyebrow: '01 / НАША ИСТОРИЯ', title: 'Странные миры.', accent: 'Одна любовь.', text: 'Ты — моя самая невероятная встреча.\nИ самая настоящая история.', footer: 'Мы будем счастливы разделить\nнаш день с самыми близкими.', location: 'ПО ТУ СТОРОНУ ОБЫЧНОГО' },
    { id: 'day', nav: 'Программа', eyebrow: '02 / ТОТ САМЫЙ ДЕНЬ', title: 'Вечер, полный', accent: 'маленьких чудес.', text: 'Встречаемся, чтобы создать\nещё одно общее воспоминание.', footer: 'Светлый зал · Тёплый вечер', location: 'КОГДА ЗАЖГУТСЯ ЗВЁЗДЫ' },
    { id: 'rsvp', nav: 'Ваш ответ', eyebrow: '03 / ДО ВСТРЕЧИ', title: 'Самое важное —', accent: 'вы рядом.', text: 'Обнимемся, будем смеяться\nи запомним этот день.', footer: 'Демонстрационное приглашение', location: 'НАША НОВАЯ ГЛАВА' },
  ],
  rsvp: { button: 'Я буду рядом', title: 'Будем ждать.', description: 'Это тестовая форма. Ответ сохраняется только в этом браузере и не отправляется организаторам.', storageKey: 'ivory-wedding-demo-rsvp', maxGuests: 4 },
  appearance: { background: '#0c0a14', text: '#eee5d7', accent: '#d3ac68' },
  music: { enabled: true, title: 'Под одной луной · авторская инструментальная миниатюра', volume: 0.3 },
  model: { url: 'models/adilet-elina.glb', uid: '84dfe9166e0946b7a5a6976408483ec1', title: 'Jack And Sally', author: 'svyART', authorUrl: 'https://sketchfab.com/svyART', pageUrl: 'https://sketchfab.com/3d-models/jack-and-sally-84dfe9166e0946b7a5a6976408483ec1' },
  animation: { scrollScreens: 5, damping: 7, maxPixelRatio: 1.6, rotation: Math.PI * 2 },
} as const;
