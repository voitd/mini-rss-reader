const parse = (data) => {
  const document = new window.DOMParser().parseFromString(data, 'text/xml');
  const prepareTextContent = (tag) => tag.textContent.replace('<![CDATA[', '').replace(']]>', '');
  const items = [...document.querySelectorAll('item')].map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));

  return {
    title: prepareTextContent(document.querySelector('title')),
    description: prepareTextContent(document.querySelector('description')),
    link: document.querySelector('link').textContent,
    items,
  };
};

export default parse;
