import { hydrate } from 'svelte';
const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });
const path = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
const page = pages[`/src/routes${path}/+page.svx`];
if (page) hydrate(page.default, { target: document.body });
