import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Balls from './pages/Balls.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/canvas',
			name: 'CanvasHome',
			component: Home
		},
		{
			path: '/canvas/balls',
			name: 'Balls',
			component: Balls
		},
	]
})

export default router;
