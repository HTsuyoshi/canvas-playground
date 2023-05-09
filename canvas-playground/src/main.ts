import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'


const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: App},
//		{ path: '/about', component: AboutComponent },
//		{ path: '/home', component: HomeComponent },
	]
})

createApp(App).use(router).mount('#app')
