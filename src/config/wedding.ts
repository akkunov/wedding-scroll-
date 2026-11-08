/** Все данные приглашения редактируются здесь. Дата, место и программа демонстрационные. */
export const wedding = {
  groom: 'Адилет',
  bride: 'Элина',
  monogram: 'А & Э',
  edition: 'НАША БЕЛАЯ ИСТОРИЯ',
  description: 'Интерактивное свадебное приглашение в белых и бежевых оттенках.',
  date: { iso: '2027-08-24T16:00:00+06:00', display: '24 · 08 · 2027' },
  venue: { name: 'Светлый зал', address: 'Адрес места проведения', mapUrl: '' },
  schedule: [
    { time: '16:00', title: 'Церемония' },
    { time: '17:00', title: 'Встречи и фотографии' },
    { time: '18:00', title: 'Праздничный ужин' },
  ],
  chapters: [
    { id: 'invitation', nav: 'Приглашение', eyebrow: 'МЫ ЖЕНИМСЯ', title: '', accent: '', text: 'Две истории.\nОдно прекрасное начало.', footer: 'Листайте — история начинается', location: 'ПЕРВОЕ МГНОВЕНИЕ' },
    { id: 'story', nav: 'Наша история', eyebrow: '01 / НАША ИСТОРИЯ', title: 'Всё начинается', accent: 'с «мы».', text: 'Среди миллионов встреч — наша.\nСреди всех дней — этот.', footer: 'Мы будем счастливы разделить\nнаш день с самыми близкими.', location: 'САД ОБЕЩАНИЙ' },
    { id: 'day', nav: 'Программа', eyebrow: '02 / ТОТ САМЫЙ ДЕНЬ', title: 'Мгновения,', accent: 'которые останутся.', text: 'Встречаемся, чтобы создать\nещё одно общее воспоминание.', footer: 'Светлый зал · Тёплый вечер', location: 'ВЕЧЕР В ЦВЕТЕ АЙВОРИ' },
    { id: 'rsvp', nav: 'Ваш ответ', eyebrow: '03 / ДО ВСТРЕЧИ', title: 'Самое важное —', accent: 'вы рядом.', text: 'Обнимемся, будем смеяться\nи запомним этот день.', footer: 'Демонстрационное приглашение', location: 'НАША НОВАЯ ГЛАВА' },
  ],
  rsvp: { button: 'Я буду рядом', title: 'Будем ждать.', description: 'Это тестовая форма. Ответ сохраняется только в этом браузере и не отправляется организаторам.', storageKey: 'ivory-wedding-demo-rsvp', maxGuests: 4 },
  appearance: { background: '#f4eee5', text: '#665241', accent: '#a88c73' },
  music: { enabled: true, title: 'Белая история · инструментальная миниатюра', volume: 0.3 },
  model: { url: 'models/adilet-elina.glb' },
  animation: { scrollScreens: 5, damping: 7, maxPixelRatio: 1.6, rotation: Math.PI * 2 },
} as const;
