export default () => {
  console.log(' > Testing noting...');

  const s = Date.now() + 1500;
  while (s > Date.now());

  console.log(' > OK !');
};
