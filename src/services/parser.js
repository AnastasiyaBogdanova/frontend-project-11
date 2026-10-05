const findDirectChild = (parent, localName) => {
  for (const child of parent.children) {
    if (child.localName === localName) {
      return child;
    }
  }
  return null;
};

const getText = (parent, localName) => {
  const el = findDirectChild(parent, localName);
  return el ? el.textContent.trim() : '';
};

const getLink = (item) => {
  const linkEl = findDirectChild(item, 'link');
  if (!linkEl) return '';

  const href = linkEl.getAttribute('href');
  if (href) return href.trim();

  return linkEl.textContent.trim();
};

const findChildrenByLocalName = (parent, localName) =>
  [...parent.children].filter((el) => el.localName === localName);

const parseRss = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  if (doc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('notRss');
  }

  const root = doc.documentElement;

  if (root.localName === 'rss') {
    const channel = findDirectChild(root, 'channel');
    if (!channel) throw new Error('notRss');

    const items = findChildrenByLocalName(channel, 'item');

    return {
      title: getText(channel, 'title'),
      description: getText(channel, 'description'),
      posts: items.map((item) => ({
        title: getText(item, 'title'),
        link: getLink(item),
        description: getText(item, 'description'),
      })),
    };
  }

  if (root.localName === 'feed') {
    const entries = findChildrenByLocalName(root, 'entry');

    return {
      title: getText(root, 'title'),
      description: getText(root, 'subtitle') || getText(root, 'description'),
      posts: entries.map((entry) => ({
        title: getText(entry, 'title'),
        link: getLink(entry),
        description:
          getText(entry, 'summary') || getText(entry, 'content'),
      })),
    };
  }

  throw new Error('notRss');
};

export default parseRss;