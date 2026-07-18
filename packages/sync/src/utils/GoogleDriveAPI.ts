export interface GoogleDriveResource {
    id: string
    name: string
    mimeType: string
}

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files'
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files'

function getHeaders(accessToken: string): HeadersInit {
    return {
        Authorization: `Bearer ${accessToken}`
    }
}

export async function createFolder(
    accessToken: string, name: string, parentID?: string
): Promise<GoogleDriveResource> {
    const body = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentID ? [parentID] : undefined
    }
    const response = await fetch(`${DRIVE_API_URL}?fields=id,name,mimeType`, {
        method: 'POST',
        headers: {
            ...getHeaders(accessToken),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    if(!response.ok) throw new Error(`Failed to create folder: "${name}"\n${await response.text()}`)
    return await response.json()
}

export async function findFolder(
    accessToken: string, name: string, parentID?: string
): Promise<GoogleDriveResource | null> {
    const parentQuery = parentID ? ` '${parentID}' in parents` : ''
    const query = [
        `mimeType='application/vnd.google-apps.folder'`,
        `name='${name}'`,
        parentQuery,
        'trashed=false'
    ].filter(Boolean).join(' and ')

    const response = await fetch(`${DRIVE_API_URL}?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType)`, {
        headers: getHeaders(accessToken)
    })
    if(!response.ok) throw new Error(`Failed to find folder: "${name}"\n${await response.text()}`)
    const data = await response.json()
    return data.files.length > 0 ? data.files[0] : null
}

export async function uploadFile(
    accessToken: string, name: string, content: string, mimeType: string, parentID?: string
): Promise<GoogleDriveResource | null> {
    const metadata = {
        name,
        mimeType,
        parents: parentID ? [parentID] : undefined
    }

    const boundary = `novakshar-sync-boundary-${Date.now()}`
    const body = [
        `--${boundary}`,
        'Content-Type: application/json; charset=UTF-8',
        '',
        JSON.stringify(metadata),
        `--${boundary}`,
        `Content-Type: ${mimeType}`,
        '',
        content,
        `--${boundary}--`
    ].join('\r\n')

    const response = await fetch(`${DRIVE_UPLOAD_URL}?uploadType=multipart&fields=id,name,mimeType`, {
        method: 'POST',
        headers: {
            ...getHeaders(accessToken),
            'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body
    })
    if(!response.ok) throw new Error(`Failed to upload file: "${name}"\n${await response.text()}`)
    return await response.json()
}

export async function findFile(
    accessToken: string, name: string, parentID?: string
): Promise<GoogleDriveResource | null> {
    const parentQuery = parentID ? ` '${parentID}' in parents` : ''
    const query = [
        `name='${name}'`,
        parentQuery,
        'trashed=false'
    ].filter(Boolean).join(' and ')

    const response = await fetch(`${DRIVE_API_URL}?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType)`, {
        headers: getHeaders(accessToken)
    })
    if(!response.ok) throw new Error(`Failed to find file: "${name}"\n${await response.text()}`)
    const data = await response.json()
    return data.files.length > 0 ? data.files[0] : null
}

export async function downloadFile(
    accessToken: string, fileID: string
): Promise<string> {
    const response = await fetch(`${DRIVE_API_URL}/${fileID}?alt=media`, {
        headers: getHeaders(accessToken)
    })
    if(!response.ok) throw new Error(`Failed to download file: "${fileID}"\n${await response.text()}`)
    return await response.text()
}

export async function updateFile(
    accessToken: string, fileID: string, content: string, mimeType: string
): Promise<GoogleDriveResource | null> {
    const response = await fetch(`${DRIVE_UPLOAD_URL}/${fileID}?uploadType=media&fields=id,name,mimeType`, {
        method: 'PATCH',
        headers: {
            ...getHeaders(accessToken),
            'Content-Type': mimeType
        },
        body: content
    })
    if(!response.ok) throw new Error(`Failed to update file: "${fileID}"\n${await response.text()}`)
    return await response.json()
}
