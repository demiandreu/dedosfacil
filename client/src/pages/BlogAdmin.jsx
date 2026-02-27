import React, { useState, useEffect, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'

const LANGS = ['es', 'en', 'fi', 'de']
const LANG_LABELS = { es: '🇪🇸 Español', en: '🇬🇧 English', fi: '🇫🇮 Suomi', de: '🇩🇪 Deutsch' }

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// TipTap Editor component
const RichEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false })
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
  }, [content])

  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="blog-editor-wrapper">
      <div className="blog-editor-toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''} title="Bold"><strong>B</strong></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''} title="Italic"><em>I</em></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''} title="Underline"><u>U</u></button>
        <span className="blog-editor-divider" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''} title="H2">H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'active' : ''} title="H3">H3</button>
        <span className="blog-editor-divider" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''} title="Bullet list">• List</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'active' : ''} title="Ordered list">1. List</button>
        <span className="blog-editor-divider" />
        <button type="button" onClick={addLink} className={editor.isActive('link') ? 'active' : ''} title="Link">🔗</button>
        {editor.isActive('link') && (
          <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link">✕ Link</button>
        )}
        <span className="blog-editor-divider" />
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'active' : ''} title="Quote">❝</button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">—</button>
      </div>
      <EditorContent editor={editor} className="blog-editor-content" />
    </div>
  )
}

const emptyTranslation = (lang) => ({
  lang,
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  meta_title: '',
  meta_description: ''
})

const BlogAdmin = () => {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // 'list' | 'edit' | 'preview'
  const [editingPost, setEditingPost] = useState(null)
  const [activeLang, setActiveLang] = useState('es')
  const [saving, setSaving] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [message, setMessage] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    category_id: '',
    author: 'DedosFácil',
    featured_image: '',
    status: 'draft',
    published_at: '',
    translations: LANGS.map(l => emptyTranslation(l))
  })

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/blog/posts')
      const data = await res.json()
      if (Array.isArray(data)) setPosts(data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/blog/categories?lang=es')
      const data = await res.json()
      if (Array.isArray(data)) setCategories(data)
    } catch (err) { console.error(err) }
  }

  const handleNew = () => {
    setEditingPost(null)
    setFormData({
      category_id: '',
      author: 'DedosFácil',
      featured_image: '',
      status: 'draft',
      published_at: new Date().toISOString().slice(0, 16),
      translations: LANGS.map(l => emptyTranslation(l))
    })
    setActiveLang('es')
    setView('edit')
  }

  const handleEdit = async (postId) => {
    try {
      const res = await fetch(`/api/admin/blog/posts/${postId}`)
      const data = await res.json()

      const translationsMap = {}
      if (data.translations) {
        data.translations.forEach(t => { translationsMap[t.lang] = t })
      }

      setFormData({
        category_id: data.category_id || '',
        author: data.author || 'DedosFácil',
        featured_image: data.featured_image || '',
        status: data.status || 'draft',
        published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : '',
        translations: LANGS.map(l => translationsMap[l] || emptyTranslation(l))
      })
      setEditingPost(postId)
      setActiveLang('es')
      setView('edit')
    } catch (err) {
      console.error(err)
      showMessage('Error al cargar el post')
    }
  }

  const handleDelete = async (postId) => {
    if (!window.confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return
    try {
      await fetch(`/api/admin/blog/posts/${postId}`, { method: 'DELETE' })
      fetchPosts()
      showMessage('Artículo eliminado')
    } catch (err) { console.error(err) }
  }

  const updateTranslation = (lang, field, value) => {
    setFormData(prev => ({
      ...prev,
      translations: prev.translations.map(t => {
        if (t.lang !== lang) return t
        const updated = { ...t, [field]: value }
        // Auto-generate slug from title
        if (field === 'title' && (!t.slug || t.slug === generateSlug(t.title))) {
          updated.slug = generateSlug(value)
        }
        return updated
      })
    }))
  }

  const getTranslation = (lang) => {
    return formData.translations.find(t => t.lang === lang) || emptyTranslation(lang)
  }

  const handleSave = async (publishStatus) => {
    setSaving(true)
    const payload = {
      ...formData,
      status: publishStatus || formData.status
    }

    try {
      const url = editingPost ? `/api/admin/blog/posts/${editingPost}` : '/api/admin/blog/posts'
      const method = editingPost ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()

      if (data.error) {
        showMessage('Error: ' + data.error)
      } else {
        showMessage(publishStatus === 'published' ? 'Artículo publicado' : 'Borrador guardado')
        fetchPosts()
        setView('list')
      }
    } catch (err) {
      console.error(err)
      showMessage('Error al guardar')
    }
    setSaving(false)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formDataUpload = new FormData()
    formDataUpload.append('image', file)

    try {
      const res = await fetch('/api/admin/blog/upload-image', {
        method: 'POST',
        body: formDataUpload
      })
      const data = await res.json()
      if (data.url) {
        setFormData(prev => ({ ...prev, featured_image: data.url }))
        showMessage('Imagen subida')
      }
    } catch (err) {
      console.error(err)
      showMessage('Error al subir imagen')
    }
  }

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const filteredPosts = posts.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (categoryFilter !== 'all' && String(p.category_id) !== categoryFilter) return false
    return true
  })

  const styles = {
    input: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '4px' },
    card: { background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', marginBottom: '12px' },
    btnPrimary: { padding: '10px 20px', background: 'linear-gradient(135deg, #2563eb, #10b981)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    btnSecondary: { padding: '10px 20px', background: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' },
    btnDanger: { padding: '8px 16px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
    badge: (color) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: color === 'green' ? '#D1FAE5' : color === 'yellow' ? '#FEF3C7' : '#E5E7EB', color: color === 'green' ? '#065F46' : color === 'yellow' ? '#92400E' : '#374151' })
  }

  // ============ LIST VIEW ============
  if (view === 'list') {
    return (
      <div>
        {message && <div style={{ padding: '12px 20px', background: '#D1FAE5', color: '#065F46', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{message}</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>📝 Artículos del Blog</h3>
          <button onClick={handleNew} style={styles.btnPrimary}>+ Nuevo artículo</button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...styles.input, width: 'auto' }}>
            <option value="all">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
          </select>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ ...styles.input, width: 'auto' }}>
            <option value="all">Todas las categorías</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Posts list */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>Cargando...</p>
        ) : filteredPosts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>No hay artículos.</p>
        ) : (
          filteredPosts.map(post => {
            const esTitle = post.translations?.find(t => t.lang === 'es')?.title || post.translations?.[0]?.title || '(Sin título)'
            const langCount = post.translations?.length || 0

            return (
              <div key={post.id} style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={styles.badge(post.status === 'published' ? 'green' : 'yellow')}>
                        {post.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                      {post.category_name && <span style={styles.badge('gray')}>{post.category_name}</span>}
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>{langCount}/4 idiomas</span>
                    </div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{esTitle}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('es-ES') : 'Sin fecha'} · {post.author}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => handleEdit(post.id)} style={styles.btnSecondary}>✏️ Editar</button>
                    <button onClick={() => handleDelete(post.id)} style={styles.btnDanger}>🗑️</button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    )
  }

  // ============ PREVIEW VIEW ============
  if (view === 'preview') {
    const t = getTranslation(activeLang)
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>👁️ Vista previa — {LANG_LABELS[activeLang]}</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => setActiveLang(l)} style={{ ...styles.btnSecondary, ...(activeLang === l ? { borderColor: '#2563eb', color: '#2563eb' } : {}) }}>
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setView('edit')} style={{ ...styles.btnSecondary, marginBottom: '20px' }}>← Volver al editor</button>

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '40px', maxWidth: '800px' }}>
          {t.title && <h1 style={{ fontSize: '32px', marginBottom: '16px', fontFamily: "'Space Grotesk', sans-serif" }}>{t.title}</h1>}
          {t.excerpt && <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>{t.excerpt}</p>}
          {formData.featured_image && <img src={formData.featured_image} alt="" style={{ width: '100%', borderRadius: '12px', marginBottom: '24px' }} />}
          <div className="blog-article-content" dangerouslySetInnerHTML={{ __html: t.content }} />
        </div>
      </div>
    )
  }

  // ============ EDIT VIEW ============
  const currentT = getTranslation(activeLang)

  return (
    <div>
      {message && <div style={{ padding: '12px 20px', background: '#D1FAE5', color: '#065F46', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{message}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>{editingPost ? '✏️ Editar artículo' : '📝 Nuevo artículo'}</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setView('preview')} style={styles.btnSecondary}>👁️ Vista previa</button>
          <button onClick={() => setView('list')} style={styles.btnSecondary}>← Volver</button>
        </div>
      </div>

      {/* Shared fields */}
      <div style={styles.card}>
        <h4 style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280', textTransform: 'uppercase' }}>Campos compartidos</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={styles.label}>Categoría</label>
            <select value={formData.category_id} onChange={e => setFormData(prev => ({ ...prev, category_id: e.target.value }))} style={styles.input}>
              <option value="">Sin categoría</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>Autor</label>
            <input type="text" value={formData.author} onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))} style={styles.input} />
          </div>
          <div>
            <label style={styles.label}>Fecha de publicación</label>
            <input type="datetime-local" value={formData.published_at} onChange={e => setFormData(prev => ({ ...prev, published_at: e.target.value }))} style={styles.input} />
          </div>
          <div>
            <label style={styles.label}>Imagen destacada</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: '14px' }} />
            {formData.featured_image && (
              <div style={{ marginTop: '8px' }}>
                <img src={formData.featured_image} alt="" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                <button onClick={() => setFormData(prev => ({ ...prev, featured_image: '' }))} style={{ ...styles.btnDanger, display: 'block', marginTop: '4px', fontSize: '12px' }}>Eliminar imagen</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Language tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '0', borderBottom: '2px solid #e5e7eb' }}>
        {LANGS.map(l => {
          const hasContent = getTranslation(l).title.length > 0
          return (
            <button
              key={l}
              onClick={() => setActiveLang(l)}
              style={{
                padding: '12px 24px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                borderBottom: activeLang === l ? '3px solid #2563eb' : '3px solid transparent',
                color: activeLang === l ? '#2563eb' : '#6b7280',
                background: 'none',
                position: 'relative'
              }}
            >
              {LANG_LABELS[l]}
              {hasContent && <span style={{ marginLeft: '6px', color: '#10b981' }}>✓</span>}
            </button>
          )
        })}
      </div>

      {/* Translation fields */}
      <div style={{ ...styles.card, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: 'none' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Título ({activeLang.toUpperCase()})</label>
          <input
            type="text"
            value={currentT.title}
            onChange={e => updateTranslation(activeLang, 'title', e.target.value)}
            placeholder="Título del artículo"
            style={{ ...styles.input, fontSize: '18px', fontWeight: '600' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Slug (URL)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>/blog/{activeLang}/</span>
            <input
              type="text"
              value={currentT.slug}
              onChange={e => updateTranslation(activeLang, 'slug', e.target.value)}
              placeholder="titulo-del-articulo"
              style={{ ...styles.input, fontFamily: 'monospace' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Extracto / Resumen</label>
          <textarea
            value={currentT.excerpt}
            onChange={e => updateTranslation(activeLang, 'excerpt', e.target.value)}
            placeholder="Breve resumen del artículo (1-2 frases)"
            style={styles.textarea}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Contenido</label>
          <RichEditor
            content={currentT.content}
            onChange={(html) => updateTranslation(activeLang, 'content', html)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={styles.label}>Meta Title (SEO)</label>
            <input
              type="text"
              value={currentT.meta_title}
              onChange={e => updateTranslation(activeLang, 'meta_title', e.target.value)}
              placeholder="Título para buscadores"
              style={styles.input}
            />
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: currentT.meta_title.length > 60 ? '#dc2626' : '#9ca3af' }}>{currentT.meta_title.length}/60 caracteres</p>
          </div>
          <div>
            <label style={styles.label}>Meta Description (SEO)</label>
            <input
              type="text"
              value={currentT.meta_description}
              onChange={e => updateTranslation(activeLang, 'meta_description', e.target.value)}
              placeholder="Descripción para buscadores"
              style={styles.input}
            />
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: currentT.meta_description.length > 160 ? '#dc2626' : '#9ca3af' }}>{currentT.meta_description.length}/160 caracteres</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
        <button onClick={() => setView('list')} style={styles.btnSecondary} disabled={saving}>Cancelar</button>
        <button onClick={() => handleSave('draft')} style={{ ...styles.btnSecondary, borderColor: '#f59e0b', color: '#92400E' }} disabled={saving}>
          {saving ? 'Guardando...' : '💾 Guardar borrador'}
        </button>
        <button onClick={() => handleSave('published')} style={styles.btnPrimary} disabled={saving}>
          {saving ? 'Publicando...' : '🚀 Publicar'}
        </button>
      </div>
    </div>
  )
}

export default BlogAdmin
