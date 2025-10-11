import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { dbConnect } from '@/lib/db'
import JournalEntry from '@/models/JournalEntry'
import { JournalUpdateSchema } from '@/lib/validation/journal'
import { json, error } from '@/lib/http'

// 👇 Next 15 checker expects params to be a Promise
type RouteContext = { params: Promise<{ id: string }> }

async function ensureOwner(userId: string, id: string) {
  const doc = await JournalEntry.findById(id)
  if (!doc) throw new Error('Not found')
  if (doc.userId !== userId) throw new Error('Forbidden')
  return doc
}

export async function GET(_req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return error('Unauthorized', 401)

  const { id } = await context.params
  await dbConnect()
  const doc = await JournalEntry.findOne({ _id: id, userId: session.user.id })
  if (!doc) return error('Not found', 404)
  return json({ item: doc })
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return error('Unauthorized', 401)

  const { id } = await context.params
  await dbConnect()
  const doc = await ensureOwner(session.user.id, id).catch(() => null)
  if (!doc) return error('Not found', 404)

  const body = await req.json()
  const parsed = JournalUpdateSchema.safeParse(body)
  if (!parsed.success) return error(parsed.error.issues[0]?.message || 'Invalid body', 422)

  Object.assign(doc, parsed.data)
  await doc.save()
  return json({ item: doc })
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return error('Unauthorized', 401)

  const { id } = await context.params
  await dbConnect()
  const doc = await ensureOwner(session.user.id, id).catch(() => null)
  if (!doc) return error('Not found', 404)

  await doc.deleteOne()
  return json({ ok: true })
}
