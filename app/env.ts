export function getEnv() {
    return {
        PROFILE_URL: "https://lens.k3l.io",
        CONTENT_URL: "https://content.lens.k3l.io",
    }
}

type ENV = ReturnType<typeof getEnv>

declare global {
    var ENV: ENV;
    interface Window {
        ENV: ENV;
    }
}