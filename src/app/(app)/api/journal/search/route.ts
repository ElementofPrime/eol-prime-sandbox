import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { dbConnect } from '@/lib/db'
import JournalEntry from '@/models/JournalEntry'
import { json, error } from '@/lib/http'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return error('Unauthorized', 401)

  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  if (!q) return json({ items: [] })

  await dbConnect()

  // Case-insensitive regex search across title/content/tags (no index needed)
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')

  const items = await JournalEntry.find({
    userId: session.user.id,
    $or: [{ title: rx }, { content: rx }, { tags: rx }],
  })
    .sort({ createdAt: -1 })
    .limit(20)

  return json({ items })
}

// Ensure the file is always treated as a module even if edited later
export {}
