export function getEnv() {
    return {
        PROFILE_URL: "https://profile.sandbox-orb.k3l.io",
        CONTENT_URL: "https://content.sandbox-orb.k3l.io",
    }
}

type ENV = ReturnType<typeof getEnv>

declare global {
    var ENV: ENV;
    interface Window {
        ENV: ENV;
    }
}