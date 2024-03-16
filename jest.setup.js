const originalConsoleWarn = console.warn;

console.warn = (message) => {
  if (
    message.includes(
      'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.'
    )
  ) {
    return;
  }
  originalConsoleWarn(message);
};
