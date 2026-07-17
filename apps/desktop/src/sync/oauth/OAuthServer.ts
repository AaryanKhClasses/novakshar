import http from 'node:http'

const PORT = 42813
const SUCCESS_PAGE = `
<!DOCTYPE html>
<html>
<head><title>Novakshar OAuth Success</title></head>
<body>
    <h1>Authorization Successful</h1>
    <p>You can close this window and return to the application.</p>
</body>
</html>
`

export class OAuthServer {
    public async getAuthorizationCode(): Promise<string> {
        return await new Promise((resolve, reject) => {
            const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
                try {
                    const url = new URL(req.url || '', `http://localhost:${PORT}`)
                    const code = url.searchParams.get('code')
                    if(!code) {
                        res.writeHead(400, { 'Content-Type': 'text/html' })
                        res.end('<h1>Authorization code not found in the request.</h1>')
                        server.close()
                        reject(new Error('Authorization code not found in the request.'))
                        return
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' })
                    res.end(SUCCESS_PAGE)
                    server.close()
                    resolve(code)
                } catch(err) {
                    server.close()
                    reject(err)
                }
            })
            server.on('error', reject)
            server.listen(PORT, '127.0.0.1')
        })
    }
}
