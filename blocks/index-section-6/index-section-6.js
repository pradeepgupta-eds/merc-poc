export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('index-section-6-row');
    [...row.children].forEach((cell) => {
      cell.classList.add('index-section-6-content');
    });
  });
}
