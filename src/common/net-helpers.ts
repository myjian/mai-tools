export function removeScrollControl(dom: Document) {
  let button = dom.getElementById('page-top');
  if (button) button.remove();

  button = dom.getElementById('page-bottom');
  if (button) button.remove();
}
