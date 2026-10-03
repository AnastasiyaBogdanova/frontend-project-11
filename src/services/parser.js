// Чистая функция: принимает XML-строку, возвращает объект с данными фида
// (или выбрасывает Error('notRss') при проблемах парсинга).
const getText = (parent, tag) =>
  parent.querySelector(tag)?.textContent?.trim() ?? '';

const parseRss = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  // DOMParser не бросает исключение, а кладёт <parsererror> в документ
  if (doc.querySelector('parsererror')) {
    throw new Error('notRss');
  }

  const channel = doc.querySelector('channel');
  if (!channel) {
    throw new Error('notRss');
  }

  const title = getText(channel, 'title');
  const description = getText(channel, 'description');

  const posts = [...channel.querySelectorAll('item')].map((item) => ({
    title: getText(item, 'title'),
    link: getText(item, 'link'),
  }));

  return { title, description, posts };
};

export default parseRss;
