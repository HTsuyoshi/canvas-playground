import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Hover from './pages/Hover.vue'
import Gravity from './pages/Gravity.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/canvas',
			name: 'CanvasHome',
			component: Home
		},
		{
			path: '/canvas/hover',
			name: 'Hover',
			component: Hover
		},
		{
			path: '/canvas/gravity',
			name: 'Gravity',
			component: Gravity
		},
	]
})

export default router;
