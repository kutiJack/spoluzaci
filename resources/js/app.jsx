import './bootstrap';
import '../css/app.css';
import '../css/style.css'
import '../css/bootstrap/css/bootstrap.min.css'
import '../css/bootstrap/js/bootstrap.min'


import {RecoilRoot,} from 'recoil';
import {createRoot} from 'react-dom/client';
import {createInertiaApp} from '@inertiajs/react';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Titulek';

createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({el, App, props}) {


        const root = createRoot(el);

        root.render(
            <RecoilRoot>

                <App {...props} />

            </RecoilRoot>
        );


    },
    progress: {
        color: '#4B5563',
    },
});
