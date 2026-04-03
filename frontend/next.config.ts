/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        // Aqui você pode adicionar regras específicas se precisar no futuro
      },
    },
  },
  // Se o auto-refresh ainda falhar, o Turbopack geralmente resolve 
  // isso nativamente sem precisar do 'poll' do Webpack.
};

export default nextConfig;