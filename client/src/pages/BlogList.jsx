import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowRight, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react'

const translations = {
  es: {
    title: 'Blog',
    subtitle: 'Noticias, guías y consejos sobre alquiler turístico en España',
    allCategories: 'Todas',
    readMore: 'Leer más',
    noPosts: 'No hay artículos publicados en esta categoría.',
    page: 'Página',
    of: 'de',
    nav: { home: 'Inicio', blog: 'Blog', howItWorks: 'Cómo funciona', pricing: 'Precios', faq: 'FAQ', startNow: 'Empezar ahora' },
    rss: 'RSS Feed'
  },
  en: {
    title: 'Blog',
    subtitle: 'News, guides and tips about tourist rental in Spain',
    allCategories: 'All',
    readMore: 'Read more',
    noPosts: 'No articles published in this category.',
    page: 'Page',
    of: 'of',
    nav: { home: 'Home', blog: 'Blog', howItWorks: 'How it works', pricing: 'Pricing', faq: 'FAQ', startNow: 'Get started' },
    rss: 'RSS Feed'
  },
  fi: {
    title: 'Blogi',
    subtitle: 'Uutisia, oppaita ja vinkkejä matkailuvuokrauksesta Espanjassa',
    allCategories: 'Kaikki',
    readMore: 'Lue lisää',
    noPosts: 'Tässä kategoriassa ei ole julkaistuja artikkeleita.',
    page: 'Sivu',
    of: '/',
    nav: { home: 'Etusivu', blog: 'Blogi', howItWorks: 'Miten se toimii', pricing: 'Hinnat', faq: 'UKK', startNow: 'Aloita nyt' },
    rss: 'RSS-syöte'
  },
  de: {
    title: 'Blog',
    subtitle: 'Nachrichten, Anleitungen und Tipps zur Ferienvermietung in Spanien',
    allCategories: 'Alle',
    readMore: 'Weiterlesen',
    noPosts: 'Keine Artikel in dieser Kategorie veröffentlicht.',
    page: 'Seite',
    of: 'von',
    nav: { home: 'Startseite', blog: 'Blog', howItWorks: 'So funktioniert es', pricing: 'Preise', faq: 'FAQ', startNow: 'Jetzt starten' },
    rss: 'RSS-Feed'
  }
}

const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const page = parseInt(searchParams.get('page')) || 1
  const category = searchParams.get('category') || ''

  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('dedosfacil-lang')
    if (saved && ['es', 'en', 'fi', 'de'].includes(saved)) return saved
    const browserLang = navigator.language.slice(0, 2)
    if (['es', 'en', 'fi', 'de'].includes(browserLang)) return browserLang
    return 'es'
  })

  const t = translations[lang] || translations.es

  const changeLang = (l) => {
    setLang(l)
    localStorage.setItem('dedosfacil-lang', l)
  }

  useEffect(() => {
    fetchCategories()
  }, [lang])

  useEffect(() => {
    fetchPosts()
  }, [lang, page, category])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/blog/categories?lang=${lang}`)
      const data = await res.json()
      if (Array.isArray(data)) setCategories(data)
    } catch (err) { console.error(err) }
  }

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const url = `/api/blog/posts?lang=${lang}&page=${page}&limit=10${category ? `&category=${category}` : ''}`
      const res = await fetch(url)
      const data = await res.json()
      setPosts(data.posts || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleCategoryFilter = (slug) => {
    const params = new URLSearchParams()
    if (slug) params.set('category', slug)
    setSearchParams(params)
  }

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    setSearchParams(params)
    window.scrollTo(0, 0)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString(lang === 'es' ? 'es-ES' : lang === 'de' ? 'de-DE' : lang === 'fi' ? 'fi-FI' : 'en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  return (
    <div className="blog-page">
      {/* Language Selector */}
      <div className="lang-selector">
        {['es', 'en', 'fi', 'de'].map(l => (
          <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => changeLang(l)}>
            {l === 'es' ? '🇪🇸' : l === 'en' ? '🇬🇧' : l === 'fi' ? '🇫🇮' : '🇩🇪'}
          </button>
        ))}
      </div>

      {/* Header */}
      <header className="header">
        <div className="container">
          <a href="/" className="logo" style={{ textDecoration: 'none' }}>
            <span className="logo-icon">DF</span>
            <span className="logo-text">DedosFácil</span>
          </a>
          <nav className="nav">
            <a href="/#como-funciona">{t.nav.howItWorks}</a>
            <a href="/#precios">{t.nav.pricing}</a>
            <a href="/blog" className="nav-nrua-link">{t.nav.blog}</a>
          </nav>
          <a href="/formulario" className="btn btn-primary">{t.nav.startNow}</a>
        </div>
      </header>

      {/* Blog Hero */}
      <section className="blog-hero">
        <div className="container">
          <div className="blog-breadcrumb">
            <a href="/">{t.nav.home}</a> &rsaquo; <span>{t.nav.blog}</span>
          </div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="blog-categories-bar">
        <div className="container">
          <div className="blog-category-pills">
            <button
              className={`blog-category-pill ${!category ? 'active' : ''}`}
              onClick={() => handleCategoryFilter('')}
            >
              {t.allCategories}
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`blog-category-pill ${category === cat.slug ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="blog-content">
        <div className="container">
          {loading ? (
            <div className="blog-loading">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="blog-card-skeleton" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="blog-empty">
              <p>{t.noPosts}</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map(post => (
                <article
                  key={post.id}
                  className="blog-card"
                  onClick={() => navigate(`/blog/${lang}/${post.slug}`)}
                >
                  {post.featured_image && (
                    <div className="blog-card-image">
                      <img src={post.featured_image} alt={post.title} loading="lazy" />
                    </div>
                  )}
                  <div className="blog-card-body">
                    {post.category_name && (
                      <span className="blog-card-category">
                        <Tag size={14} />
                        {post.category_name}
                      </span>
                    )}
                    <h2 className="blog-card-title">{post.title}</h2>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-footer">
                      <span className="blog-card-date">
                        <Calendar size={14} />
                        {formatDate(post.published_at)}
                      </span>
                      <span className="blog-card-read-more">
                        {t.readMore} <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="blog-pagination">
              <button
                className="blog-page-btn"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="blog-page-info">
                {t.page} {page} {t.of} {totalPages}
              </span>
              <button
                className="blog-page-btn"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* RSS Link */}
          <div className="blog-rss">
            <a href={`/blog/feed.xml?lang=${lang}`} target="_blank" rel="noopener noreferrer">
              {t.rss}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="blog-footer">
        <div className="container">
          <div className="blog-footer-content">
            <div className="blog-footer-brand">
              <span className="logo-icon">DF</span>
              <span className="logo-text">DedosFácil</span>
            </div>
            <div className="blog-footer-links">
              <a href="/aviso-legal">Aviso Legal</a>
              <a href="/privacidad">Privacidad</a>
              <a href="/cookies">Cookies</a>
            </div>
            <p>&copy; {new Date().getFullYear()} DedosFácil</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default BlogList
