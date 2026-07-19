const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

const GOOGLE_SCOPE = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/userinfo.email'].join(' ')
const REDIRECT_URI = 'http://localhost:42813'

export function getAuthorizationUrl(clientID: string): string {
    const params = new URLSearchParams({
        client_id: clientID,

        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
        scope: GOOGLE_SCOPE
    })

    return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

export async function exchangeCodeForTokens(clientID: string, clientSecret: string, code: string): Promise<{ accessToken: string, refreshToken: string }> {
    const response = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: clientID,
            client_secret: clientSecret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI
        })
    })
    if(!response.ok) throw new Error(`Failed to exchange code for tokens: ${response.statusText}`)
    const json = await response.json()
    return {
        accessToken: json.access_token,
        refreshToken: json.refresh_token
    }
}

export async function refreshAccessToken(clientID: string, clientSecret: string, refreshToken: string): Promise<string> {
    const response = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: clientID,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        })
    })
    if(!response.ok) throw new Error(`Failed to refresh access token: ${response.statusText}`)
    const json = await response.json()
    return json.access_token
}

export async function fetchUserEmail(accessToken: string): Promise<string> {
    const response = await fetch(GOOGLE_USERINFO_URL, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    if(!response.ok) throw new Error(`Failed to fetch user email: ${response.statusText}`)
    const json = await response.json()
    return json.email
}
