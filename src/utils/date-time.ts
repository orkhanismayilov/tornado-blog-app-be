export function getDateForFileName() {
  const date = new Date();
  return Intl.DateTimeFormat('en-us', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .split('/')
    .reverse()
    .join('-');
}
