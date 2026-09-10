-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Create study_materials table
create table if not exists study_materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create document_chunks table with vector column
create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  material_id uuid references study_materials(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  embedding vector(768) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table study_materials enable row level security;
alter table document_chunks enable row level security;

-- 5. Create RLS Policies
create policy "Users can view own study materials" 
on study_materials for select 
using (auth.uid() = user_id);

create policy "Users can insert own study materials" 
on study_materials for insert 
with check (auth.uid() = user_id);

create policy "Users can delete own study materials" 
on study_materials for delete 
using (auth.uid() = user_id);

create policy "Users can view own document chunks" 
on document_chunks for select 
using (auth.uid() = user_id);

create policy "Users can insert own document chunks" 
on document_chunks for insert 
with check (auth.uid() = user_id);

create policy "Users can delete own document chunks" 
on document_chunks for delete 
using (auth.uid() = user_id);

-- 6. Create matching function for RAG (Retrieval-Augmented Generation)
create or replace function match_document_chunks (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  p_user_id uuid
)
returns table (
  id uuid,
  material_id uuid,
  content text,
  similarity float
)
language sql stable
as $$
  select
    document_chunks.id,
    document_chunks.material_id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  where document_chunks.user_id = p_user_id
    and 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
$$;
