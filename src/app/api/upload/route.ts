import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import pdfParse from 'pdf-parse'
import { google } from '@ai-sdk/google'
import { embedMany } from 'ai'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Read the file as an array buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text using pdf-parse
    const pdfData = await pdfParse(buffer)
    const text = pdfData.text

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Could not extract text from PDF' }, { status: 400 })
    }

    // Basic chunking: split by paragraphs and group
    const chunks = text.split(/\n\s*\n/).map(c => c.trim()).filter(c => c.length > 50)
    
    if (chunks.length === 0) {
      return NextResponse.json({ error: 'Document contains no useful text' }, { status: 400 })
    }

    // Generate embeddings using Gemini
    const { embeddings } = await embedMany({
      model: google.textEmbeddingModel('text-embedding-004'),
      values: chunks,
    })

    // Store in Supabase
    // 1. Create study material record
    const { data: material, error: materialError } = await supabase
      .from('study_materials')
      .insert([
        {
          user_id: user.id,
          title: file.name,
        }
      ])
      .select()
      .single()

    if (materialError || !material) {
      console.error('Material Insert Error:', materialError)
      return NextResponse.json({ error: 'Failed to save document metadata' }, { status: 500 })
    }

    // 2. Prepare chunks for insertion
    const chunksToInsert = chunks.map((content, i) => ({
      material_id: material.id,
      user_id: user.id,
      content,
      embedding: embeddings[i],
    }))

    // 3. Insert chunks
    const { error: chunksError } = await supabase
      .from('document_chunks')
      .insert(chunksToInsert)

    if (chunksError) {
      console.error('Chunks Insert Error:', chunksError)
      return NextResponse.json({ error: 'Failed to save document chunks' }, { status: 500 })
    }

    return NextResponse.json({ success: true, materialId: material.id })

  } catch (error) {
    console.error('Upload API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
