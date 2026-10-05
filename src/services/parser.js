// Чистая функция: XML-строка -> объект фида с постами.
const getText = (parent, tag) =>
  parent.querySelector(tag)?.textContent?.trim() ?? '';

const parseRss = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

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
    description: getText(item, 'description'),
  }));

  return { title, description, posts };
};

export default parseRss;
