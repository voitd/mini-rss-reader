/* eslint-disable implicit-arrow-linebreak */
import { hasIn, uniqueId } from 'lodash';

const parse = (data) => {
  const id = uniqueId();
  const items = [];
  const iter = (coll) =>
    [...coll.children].reduce((acc, node) => {
      const { nodeName, children, textContent } = node;
      const value = !children.length ? textContent : iter(node);
      if (hasIn(children, nodeName)) {
        items.push(value);
        return { id, ...acc, [nodeName]: items };
      }
      return { id, ...acc, [nodeName]: value };
    }, {});
  const document = new window.DOMParser().parseFromString(data, 'text/xml');
  return iter(document);
};
export default parse;
