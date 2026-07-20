/**** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {},
        colors: {
            "editor": "var(--bg-editor)",
            "explorer": "var(--bg-explorer)",
            "tab": "var(--bg-tab)",
            "title-bar": "var(--bg-title-bar)",
            "tool-bar": "var(--bg-tool-bar)",
            "status-bar": "var(--bg-status-bar)",
            "overlay": "var(--bg-overlay)",
            "explorer-selected": "var(--bg-explorer-selected)",
            "explorer-hover": "var(--bg-explorer-hover)",
            "tab-selected": "var(--bg-tab-selected)",
            "tab-hover": "var(--bg-tab-hover)",
            "editor-toolbar": "var(--bg-editor-toolbar)",
            "title-hover": "var(--bg-title-hover)",
            "text": "var(--text)",
            "text-alt": "var(--text-alt)",
            "text-muted": "var(--text-muted)",
            "text-inverted": "var(--text-inverted)",
            "border": "var(--border)",
            "border-alt": "var(--border-alt)",
            "border-focus": "var(--border-focus)",
            "primary": "var(--primary)",
            "secondary": "var(--secondary)",
            "success": "var(--success)",
            "warning": "var(--warning)",
            "danger": "var(--danger)",
            "info": "var(--info)"
        }
    },
    plugins: []
}
