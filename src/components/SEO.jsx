import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://partyplann.com';
const DEFAULT_IMAGE = '/logo.jpg';

export default function SEO({
  title,
  description,
  keywords = '',
  canonicalPath = '',
  ogImage = DEFAULT_IMAGE,
  type = 'website',
}) {
  const fullTitle = title ? `${title} | Party Plann` : 'Party Plann - Free Birthday Party Planner App';
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Party Plann" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Helmet>
  );
}
