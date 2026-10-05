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

const findAllByLocalName = (root, localName) => {
  const byNs = root.getElementsByTagNameNS('*', localName);
  if (byNs.length > 0) return [...byNs];
  return [...root.getElementsByTagName(localName)];
};

const parseRss = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  if (doc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('notRss');
  }

  const channels = findAllByLocalName(doc, 'channel');
  if (channels.length === 0) {
    throw new Error('notRss');
  }
  const channel = channels[0];

  const title = getText(channel, 'title');
  const description = getText(channel, 'description');

  const itemElements = findAllByLocalName(channel, 'item');
  const posts = itemElements.map((item) => ({
    title: getText(item, 'title'),
    link: getText(item, 'link'),
    description: getText(item, 'description'),
  }));

  return { title, description, posts };
};

export default parseRss;
