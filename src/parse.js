const parse = (data) => {
  const document = new window.DOMParser().parseFromString(data, 'text/xml');

  return {
    title: document.querySelector('title').textContent,
    description: document.querySelector('description').textContent,
    link: document.querySelector('link').textContent,
    items: [...document.querySelectorAll('item')].map((item) => ({
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    })),
  };
};

export default parse;
