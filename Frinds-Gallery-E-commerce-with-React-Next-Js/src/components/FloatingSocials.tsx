import React from 'react';

const socialLinks = [
  {
    name: 'Messenger',
    href: '#',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 5.79 2 10.5C2 13.62 3.89 16.33 6.69 17.85c.34.19.51.56.44.95l-.45 2.51c-.11.64.55 1.15 1.15.93l2.84-.94c.32-.11.68-.06.96.14c.94.67 2.04 1.04 3.2 1.04c5.52 0 10-3.79 10-8.5S17.52 2 12 2m3.61 7.17l-2.43 2.97l-2.9-2.97l-3.61 3.26l2.43-2.97l2.9 2.97z"></path></svg>,
  },
  {
    name: 'WhatsApp',
    href: '#',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-5.46-4.45-9.91-9.91-9.91zM17.5 14.3c-.28-.14-1.67-.82-1.93-.91c-.26-.1-.45-.14-.64.14c-.19.28-.73.91-.9 1.1c-.17.19-.34.21-.61.07c-.28-.14-1.17-.43-2.23-1.37c-.83-.72-1.39-1.62-1.56-1.89c-.17-.28-.02-.43.12-.57c.13-.13.28-.34.42-.51c.14-.17.19-.28.28-.47c.1-.19.05-.36-.02-.5c-.07-.14-.64-1.54-.87-2.1c-.23-.56-.47-.48-.64-.49c-.17-.01-.36-.01-.55-.01c-.19 0-.5.07-.76.35c-.26.28-.99 1-.99 2.42c0 1.42 1.02 2.82 1.16 3.01c.14.19 1.99 3.16 4.83 4.26c.68.26 1.22.42 1.63.53c.6.18 1.15.15 1.58.09c.48-.06 1.67-.68 1.9-1.33c.24-.65.24-1.21.17-1.33c-.07-.12-.26-.2-.53-.34z"></path></svg>,
  }
];

export const FloatingSocials: React.FC = () => {
  return (
    <div className="fixed right-6 bottom-32 sm:bottom-10 z-[60] flex flex-col space-y-4">
      {socialLinks.map(link => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-green-deep text-brand-yellow w-14 h-14 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 border border-white/10 group active:scale-95"
          aria-label={link.name}
        >
          <div className="transition-transform duration-300 group-hover:rotate-12">
            {link.icon}
          </div>
        </a>
      ))}
    </div>
  );
};