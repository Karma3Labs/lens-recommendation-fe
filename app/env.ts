export function getEnv() {
    return {
        PROFILE_URL: "https://lens-staging.k3l.io",
        CONTENT_URL: "https://content.lens-staging.k3l.io",
    }
}

type ENV = ReturnType<typeof getEnv>

declare global {
    var ENV: ENV;
    interface Window {
        ENV: ENV;
    }
}