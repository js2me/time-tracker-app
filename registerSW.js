if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/time-tracker-app/sw.js', { scope: '/time-tracker-app/' })})}