import { createApp, h, ref } from 'vue';
import pingpp from 'pingpp-js';
import { runPaymentChecks } from './checks.js';

createApp({
  setup() {
    const results = ref([]);
    return () => h('main', [
      h('h1', 'Ping++ Vue npm integration'),
      h('button', { onClick: () => { results.value = runPaymentChecks(pingpp); } }, 'Run payment checks'),
      h('pre', { id: 'results' }, JSON.stringify(results.value, null, 2))
    ]);
  }
}).mount('#root');
