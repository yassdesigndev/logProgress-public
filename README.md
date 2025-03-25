# logProgress - Track Finances, Health, and Daily Habits

A Progressive Web App (PWA) for tracking finances, health metrics, and daily habits. Built with React, Vite, and TypeScript.

![logProgress Screenshot](https://via.placeholder.com/800x400?text=logProgress+Screenshot)


## Features

- 📱 Progressive Web App (PWA) with offline support
- 📊 Beautiful charts and visualizations
- 🌓 Dark/Light mode support
- 📱 Responsive design
- 🔒 Security-focused implementation
- 💾 Local storage for data persistence

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yassdesigndev/logProgress-public.git
cd logProgress-public
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

### Essential Configuration
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_CSP_CONNECT_SRC`: Allowed domains for Content Security Policy
- `VITE_CORS_ORIGIN`: Allowed origins for CORS

### Optional Configuration
- `VITE_ANALYTICS_ID`: Analytics tracking ID
- `VITE_PWA_NAME`: PWA full name
- `VITE_PWA_SHORT_NAME`: PWA short name
- `VITE_PWA_THEME_COLOR`: PWA theme color
- `VITE_PWA_BACKGROUND_COLOR`: PWA background color

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Security Features

1. **Content Security Policy (CSP)**
   - Restricts resource loading to trusted sources
   - Prevents XSS attacks
   - Configure allowed domains in `.env`

2. **CORS Protection**
   - Restricts API access to allowed origins
   - Configure allowed origins in `.env`

3. **Additional Security Headers**
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection
   - Referrer-Policy
   - Permissions-Policy

4. **Data Protection**
   - Local storage encryption for sensitive data
   - Secure session management
   - Input sanitization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari
- Chrome for Android

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## Security

For security best practices and configuration, please refer to our [Security Guide](SECURITY.md).

## License

This project is licensed under the GNU Affero General Public License v3 (AGPL-3.0) - see the [LICENSE](LICENSE) file for details.

### Why AGPL-3.0?

We chose the AGPL-3.0 license to ensure that:
1. The software remains free and open source
2. Any modifications to the software, even when run as a service over a network, must be made available to users
3. Users have the right to study, modify, and distribute the software

This means that if you modify logProgress and provide it as a service to others (e.g., hosting it on a server), you must make your modifications available under the same license.