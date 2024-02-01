let timeout;
let started = false;

const runTimer = (delay) => {
  timeout = setTimeout(() => {
    if (!started) return;
    self.postMessage({ type: 'tick' });
    runTimer(delay);
  }, delay);
};

self.onmessage = ({ data }) => {
  if (data.type === 'start') {
    clearTimeout(timeout);
    started = true;
    runTimer(data.delay);
  }

  if (data.type === 'stop') {
    started = false;
    clearTimeout(timeout);
  }
};
