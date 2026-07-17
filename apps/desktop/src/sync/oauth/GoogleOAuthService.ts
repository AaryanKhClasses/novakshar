import { GoogleAccount } from '@sync/models/GoogleAccount'
import { shell } from 'electron'
import * as api from './GoogleOAuthAPI'
import { OAuthServer } from './OAuthServer'

export class GoogleOAuthService {
    constructor(private readonly clientID: string, private readonly clientSecret: string) { }

    public async connect(): Promise<GoogleAccount> {
        const server = new OAuthServer()
        const authURL = api.getAuthorizationUrl(this.clientID)
        await shell.openExternal(authURL)
        const code = await server.getAuthorizationCode()
        const tokens = await api.exchangeCodeForTokens(this.clientID, this.clientSecret, code)
        const email = await api.fetchUserEmail(tokens.accessToken)
        return {
            email,
            refreshToken: tokens.refreshToken
        }
    }

    public async disconnect(): Promise<void> { }

    public async getAccessToken(refreshToken: string): Promise<string> {
        return await api.refreshAccessToken(this.clientID, this.clientSecret, refreshToken)
    }
}
