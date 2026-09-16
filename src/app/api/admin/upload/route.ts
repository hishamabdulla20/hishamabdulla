import { randomUUID } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { getAdminUser } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/admin'
import { safeError } from '@/lib/validation'

const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
  ['application/pdf', 'pdf'],
])

function hasExpectedSignature(type: string, bytes: Uint8Array): boolean {
  const textPrefix = new TextDecoder().decode(bytes)
  if (type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  if (type === 'image/png') return bytes.slice(0, 8).every((byte, index) => byte === [137, 80, 78, 71, 13, 10, 26, 10][index])
  if (type === 'image/webp') return textPrefix.slice(0, 4) === 'RIFF' && textPrefix.slice(8, 12) === 'WEBP'
  if (type === 'image/avif') return textPrefix.slice(4, 8) === 'ftyp' && ['avif', 'avis'].includes(textPrefix.slice(8, 12))
  if (type === 'application/pdf') return textPrefix.startsWith('%PDF-')
  return false
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ message: 'Invalid request origin.' }, { status: 403 })
  }

  const user = await getAdminUser()
  if (!user) return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 })

  const admin = createAdminSupabaseClient()
  if (!admin) return NextResponse.json({ message: 'Storage is not configured.' }, { status: 503 })

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'Choose a file to upload.' }, { status: 400 })
    }

    const extension = allowedTypes.get(file.type)
    if (!extension || file.size <= 0 || file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Use a JPG, PNG, WebP, AVIF, or PDF file no larger than 5 MB.' },
        { status: 400 },
      )
    }

    const signature = new Uint8Array(await file.slice(0, 16).arrayBuffer())
    if (!hasExpectedSignature(file.type, signature)) {
      return NextResponse.json({ message: 'The file contents do not match its declared type.' }, { status: 400 })
    }

    const objectPath = `${user.id}/${randomUUID()}.${extension}`
    const { error } = await admin.storage
      .from('portfolio-assets')
      .upload(objectPath, file, { contentType: file.type, upsert: false })
    if (error) throw error

    const { data } = admin.storage.from('portfolio-assets').getPublicUrl(objectPath)
    return NextResponse.json({ url: data.publicUrl }, { status: 201 })
  } catch (error) {
    safeError('asset-upload', error)
    return NextResponse.json({ message: 'Unable to upload the file. Please try again.' }, { status: 500 })
  }
}
