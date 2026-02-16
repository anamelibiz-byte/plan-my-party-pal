import React from 'react';
import { Facebook, Instagram, Music, Mail } from 'lucide-react';

export default function BusinessSocialLinks() {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://www.facebook.com/planmypartypal',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/planmypartypal',
      color: 'bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600'
    },
    {
      name: 'TikTok',
      icon: Music,
      url: 'https://www.tiktok.com/@planmypartypal',
      color: 'bg-gray-900 hover:bg-black'
    },
    {
      name: 'Email',
      icon: Mail,
      url: 'mailto:hello@partyplann.com',
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  return (
    <div className="flex items-center justify-center gap-4">
      {socialLinks.map(({ name, icon: Icon, url, color }) => (
        <a
          key={name}
          href={url}
          target={name !== 'Email' ? '_blank' : undefined}
          rel={name !== 'Email' ? 'noopener noreferrer' : undefined}
          className={`${color} text-white w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg`}
          aria-label={name}
        >
          <Icon size={20} />
        </a>
      ))}
    </div>
  );
}
