import App from './App.svelte';
import Generator from './base';

var app = new App({
	target: document.body
});

Generator.init();
for (let i = 0; i < 12; i++) {
	Generator.addBox();
}

export default app;
