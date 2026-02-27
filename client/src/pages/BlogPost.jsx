import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Tag, ArrowLeft, ArrowRight, Share2, Copy, Check } from 'lucide-react'

const translations = {
  es: {
    nav: { home: 'Inicio', blog: 'Blog', howItWorks: 'Cómo funciona', pricing: 'Precios', faq: 'FAQ', startNow: 'Empezar ahora' },
    backToBlog: 'Volver al blog',
    relatedPosts: 'Artículos relacionados',
    readMore: 'Leer más',
    share: 'Compartir',
    copyLink: 'Copiar enlace',
    linkCopied: 'Enlace copiado',
    shareWhatsApp: 'WhatsApp',
    shareFacebook: 'Facebook',
    readAlsoIn: 'Leer en',
    notFound: 'Artículo no encontrado',
    notFoundDesc: 'El artículo que buscas no existe o ha sido eliminado.',
    loading: 'Cargando artículo...'
  },
  en: {
    nav: { home: 'Home', blog: 'Blog', howItWorks: 'How it works', pricing: 'Pricing', faq: 'FAQ', startNow: 'Get started' },
    backToBlog: 'Back to blog',
    relatedPosts: 'Related articles',
    readMore: 'Read more',
    share: 'Share',
    copyLink: 'Copy link',
    linkCopied: 'Link copied',
    shareWhatsApp: 'WhatsApp',
    shareFacebook: 'Facebook',
    readAlsoIn: 'Read in',
    notFound: 'Article not found',
    notFoundDesc: 'The article you are looking for does not exist or has been removed.',
    loading: 'Loading article...'
  },
  fi: {
    nav: { home: 'Etusivu', blog: 'Blogi', howItWorks: 'Miten se toimii', pricing: 'Hinnat', faq: 'UKK', startNow: 'Aloita nyt' },
    backToBlog: 'Takaisin blogiin',
    relatedPosts: 'Aiheeseen liittyvät artikkelit',
    readMore: 'Lue lisää',
    share: 'Jaa',
    copyLink: 'Kopioi linkki',
    linkCopied: 'Linkki kopioitu',
    shareWhatsApp: 'WhatsApp',
    shareFacebook: 'Facebook',
    readAlsoIn: 'Lue kielellä',
    notFound: 'Artikkelia ei löytynyt',
    notFoundDesc: 'Etsimääsi artikkelia ei ole tai se on poistettu.',
    loading: 'Ladataan artikkelia...'
  },
  de: {
    nav: { home: 'Startseite', blog: 'Blog', howItWorks: 'So funktioniert es', pricing: 'Preise', faq: 'FAQ', startNow: 'Jetzt starten' },
    backToBlog: 'Zurück zum Blog',
    relatedPosts: 'Ähnliche Artikel',
    readMore: 'Weiterlesen',
    share: 'Teilen',
    copyLink: 'Link kopieren',
    linkCopied: 'Link kopiert',
    shareWhatsApp: 'WhatsApp',
    shareFacebook: 'Facebook',
    readAlsoIn: 'Lesen auf',
    notFound: 'Artikel nicht gefunden',
    notFoundDesc: 'Der gesuchte Artikel existiert nicht oder wurde entfernt.',
    loading: 'Artikel wird geladen...'
  }
}

const langNames = { es: 'Español', en: 'English', fi: 'Suomi', de: 'Deutsch' }
const langFlags = { es: '🇪🇸', en: '🇬🇧', fi: '🇫🇮', de: '🇩🇪' }

const BlogPost = () => {
  const { lang: urlLang, slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [articleTranslations, setArticleTranslations] = useState([])
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)

  const lang = urlLang && ['es', 'en', 'fi', 'de'].includes(urlLang) ? urlLang : 'es'
  const t = translations[lang] || translations.es

  const changeLang = (l) => {
    localStorage.setItem('dedosfacil-lang', l)
    const targetTranslation = articleTranslations.find(tr => tr.lang === l)
    if (targetTranslation) {
      navigate(`/blog/${l}/${targetTranslation.slug}`)
    } else {
      navigate(`/blog?lang=${l}`)
    }
  }

  useEffect(() => {
    localStorage.setItem('dedosfacil-lang', lang)
    fetchPost()
  }, [lang, slug])

  const fetchPost = async () => {
    setLoading(true)
    setNotFound(false)
    try {
      const res = await fetch(`/api/blog/post/${lang}/${slug}`)
      if (!res.ok) {
        setNotFound(true)
        setLoading(false)
        return
      }
      const data = await res.json()
      setPost(data.post)
      setArticleTranslations(data.translations || [])
      setRelated(data.related || [])

      // Update page title and meta
      if (data.post) {
        document.title = data.post.meta_title || data.post.title
        updateMeta('description', data.post.meta_description || data.post.excerpt)
        updateMeta('og:title', data.post.meta_title || data.post.title)
        updateMeta('og:description', data.post.meta_description || data.post.excerpt)
        if (data.post.featured_image) updateMeta('og:image', data.post.featured_image)
        updateMeta('og:type', 'article')
        updateMeta('og:url', window.location.href)

        // Remove old hreflang links
        document.querySelectorAll('link[hreflang]').forEach(el => el.remove())
        // Add hreflang links
        if (data.translations) {
          data.translations.forEach(tr => {
            const link = document.createElement('link')
            link.rel = 'alternate'
            link.hreflang = tr.lang
            link.href = `https://dedosfacil.es/blog/${tr.lang}/${tr.slug}`
            document.head.appendChild(link)
          })
        }
      }
    } catch (err) {
      console.error(err)
      setNotFound(true)
    }
    setLoading(false)
  }

  const updateMeta = (name, content) => {
    if (!content) return
    const isProperty = name.startsWith('og:')
    const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
    let meta = document.querySelector(selector)
    if (!meta) {
      meta = document.createElement('meta')
      if (isProperty) meta.setAttribute('property', name)
      else meta.setAttribute('name', name)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString(lang === 'es' ? 'es-ES' : lang === 'de' ? 'de-DE' : lang === 'fi' ? 'fi-FI' : 'en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
    }
  }

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`, '_blank')
  }

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
  }

  if (loading) {
    return (
      <div className="blog-page">
        <header className="header">
          <div className="container">
            <a href="/" className="logo" style={{ textDecoration: 'none' }}>
              <span className="logo-icon">DF</span>
              <span className="logo-text">DedosFácil</span>
            </a>
          </div>
        </header>
        <div className="blog-post-loading">
          <div className="container">
            <p>{t.loading}</p>
          </div>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="blog-page">
        <header className="header">
          <div className="container">
            <a href="/" className="logo" style={{ textDecoration: 'none' }}>
              <span className="logo-icon">DF</span>
              <span className="logo-text">DedosFácil</span>
            </a>
            <nav className="nav">
              <a href="/blog">{t.nav.blog}</a>
            </nav>
            <a href="/formulario" className="btn btn-primary">{t.nav.startNow}</a>
          </div>
        </header>
        <div className="blog-not-found">
          <div className="container">
            <h1>{t.notFound}</h1>
            <p>{t.notFoundDesc}</p>
            <a href="/blog" className="btn btn-primary">{t.backToBlog}</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-page">
      {/* Language Selector */}
      <div className="lang-selector">
        {['es', 'en', 'fi', 'de'].map(l => (
          <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => changeLang(l)}>
            {langFlags[l]}
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

      {/* Article */}
      <article className="blog-article">
        <div className="container">
          {/* Breadcrumb */}
          <div className="blog-breadcrumb">
            <a href="/">{t.nav.home}</a> &rsaquo;
            <a href="/blog">{t.nav.blog}</a> &rsaquo;
            {post.category_name && (
              <>
                <a href={`/blog?category=${post.category_slug}`}>{post.category_name}</a> &rsaquo;
              </>
            )}
            <span>{post.title}</span>
          </div>

          {/* Back link */}
          <a href="/blog" className="blog-back-link">
            <ArrowLeft size={16} /> {t.backToBlog}
          </a>

          {/* Article Header */}
          <div className="blog-article-header">
            {post.category_name && (
              <span className="blog-card-category">
                <Tag size={14} /> {post.category_name}
              </span>
            )}
            <h1>{post.title}</h1>
            <div className="blog-article-meta">
              <span><Calendar size={16} /> {formatDate(post.published_at)}</span>
              {post.author && <span>| {post.author}</span>}
            </div>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="blog-article-image">
              <img src={post.featured_image} alt={post.title} />
            </div>
          )}

          {/* Article Content */}
          <div className="blog-article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Share Buttons */}
          <div className="blog-share">
            <span className="blog-share-label"><Share2 size={16} /> {t.share}:</span>
            <button className="blog-share-btn blog-share-whatsapp" onClick={shareWhatsApp}>
              {t.shareWhatsApp}
            </button>
            <button className="blog-share-btn blog-share-facebook" onClick={shareFacebook}>
              {t.shareFacebook}
            </button>
            <button className="blog-share-btn blog-share-copy" onClick={handleCopyLink}>
              {copied ? <><Check size={14} /> {t.linkCopied}</> : <><Copy size={14} /> {t.copyLink}</>}
            </button>
          </div>

          {/* Language versions */}
          {articleTranslations.length > 1 && (
            <div className="blog-translations">
              <span>{t.readAlsoIn}:</span>
              {articleTranslations.filter(tr => tr.lang !== lang).map(tr => (
                <a
                  key={tr.lang}
                  href={`/blog/${tr.lang}/${tr.slug}`}
                  className="blog-translation-link"
                >
                  {langFlags[tr.lang]} {langNames[tr.lang]}
                </a>
              ))}
            </div>
          )}

          {/* Schema.org Article markup */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.meta_description || post.excerpt,
            "image": post.featured_image || '',
            "author": { "@type": "Organization", "name": post.author || 'DedosFácil' },
            "publisher": { "@type": "Organization", "name": "DedosFácil", "logo": { "@type": "ImageObject", "url": "https://dedosfacil.es/favicon.svg" } },
            "datePublished": post.published_at,
            "dateModified": post.published_at,
            "mainEntityOfPage": { "@type": "WebPage", "@id": window.location.href },
            "inLanguage": lang
          }) }} />
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="blog-related">
          <div className="container">
            <h2>{t.relatedPosts}</h2>
            <div className="blog-related-grid">
              {related.map(rp => (
                <article
                  key={rp.id}
                  className="blog-card"
                  onClick={() => navigate(`/blog/${lang}/${rp.slug}`)}
                >
                  {rp.featured_image && (
                    <div className="blog-card-image">
                      <img src={rp.featured_image} alt={rp.title} loading="lazy" />
                    </div>
                  )}
                  <div className="blog-card-body">
                    {rp.category_name && (
                      <span className="blog-card-category">
                        <Tag size={14} /> {rp.category_name}
                      </span>
                    )}
                    <h3 className="blog-card-title">{rp.title}</h3>
                    <p className="blog-card-excerpt">{rp.excerpt}</p>
                    <span className="blog-card-read-more">
                      {t.readMore} <ArrowRight size={14} />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

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

export default BlogPost
