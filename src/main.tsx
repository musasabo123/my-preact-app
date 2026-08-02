import { render } from 'preact'
import './index.css'
import { App } from './app.tsx'

const root = document.getElementById('app')!

function showError(payload: any) {
	try {
		const message = typeof payload === 'string' ? payload : JSON.stringify(payload, Object.getOwnPropertyNames(payload), 2)
		root.innerHTML = `
			<div style="padding:24px;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#fff;background:#1f2937;min-height:100vh;">
				<h2 style="color:#ff6b6b;margin:0 0 12px">Application error — details below</h2>
				<pre style="white-space:pre-wrap;color:#fff;background:#111827;padding:12px;border-radius:6px;overflow:auto;">${message}</pre>
			</div>
		`
	} catch (e) {
		root.textContent = 'Fatal error. Open the devtools console for details.'
	}
}

window.addEventListener('error', (ev) => {
	console.error('Uncaught error', ev.error || ev.message)
	showError(ev.error || ev.message || ev)
})

window.addEventListener('unhandledrejection', (ev) => {
	console.error('Unhandled promise rejection', ev.reason)
	showError(ev.reason || ev)
})

try {
	render(<App />, root)
} catch (err) {
	console.error('Render error', err)
	showError(err)
}
