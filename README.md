# Salut Wonomulyo - Website Profil Lembaga

Website profil lembaga/organisasi lokal dengan sistem admin untuk mengelola konten.

## Fitur

### Frontend
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Hero Section**: Gambar latar full-width dengan overlay gelap
- **Tentang Kami**: Informasi lengkap tentang lembaga
- **Berita Terbaru**: Grid artikel dengan thumbnail dan ringkasan
- **Galeri Foto**: Grid foto dengan lightbox popup
- **Kontak**: Formulir kontak dan informasi lengkap
- **Footer**: Link penting dan informasi hak cipta

### Admin Dashboard
- **Authentication**: Login admin yang aman
- **Kelola Berita**: Tambah, edit, hapus artikel
- **Kelola Galeri**: Upload dan kelola foto
- **Pesan Masuk**: Lihat dan balas pesan dari pengunjung
- **Statistik**: Overview data dan analytics

## Teknologi

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Routing**: React Router
- **Icons**: Lucide React
- **Toast Notifications**: Sonner

## Setup

### Prerequisites
- Node.js 18+
- Akun Supabase

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd salut-wonomulyo
```

2. Install dependencies
```bash
npm install
```

3. Setup Supabase
- Buat project baru di [Supabase](https://supabase.com)
- Copy URL dan anon key
- Buat file `.env` dari `.env.example`
- Isi environment variables

4. Setup Database Tables
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news table
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  summary TEXT,
  image_url TEXT,
  author TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. Create Admin User
```sql
-- Insert admin user (set password in Supabase dashboard)
INSERT INTO profiles (id, email, role) 
VALUES ('your-user-id', 'admin@salutwonomulyo.com', 'admin');
```

6. Run development server
```bash
npm run dev
```

## Default Admin Login

- **Email**: admin@salutwonomulyo.com
- **Password**: admin123

## Kustomisasi

### Mengubah Logo
1. Ganti file logo di `public/logo.png`
2. Update komponen `Navbar` dan `Footer`

### Mengubah Warna
Edit `tailwind.config.ts` dan `src/globals.css`

### Mengubah Konten
- Hero section: `src/components/hero-section.tsx`
- Tentang kami: `src/components/about-section.tsx`
- Berita: Melalui admin dashboard
- Galeri: Melalui admin dashboard

## Deployment

### Build untuk Production
```bash
npm run build
```

### Environment Variables untuk Production
Set semua environment variables di hosting platform Anda.

## Struktur File

```
src/
├── components/
│   ├── ui/           # Shadcn/UI components
│   ├── admin/        # Admin components
│   ├── navbar.tsx    # Navigation bar
│   ├── hero-section.tsx
│   ├── about-section.tsx
│   ├── news-section.tsx
│   ├── gallery-section.tsx
│   ├── contact-section.tsx
│   └── footer.tsx
├── pages/
│   ├── Index.tsx     # Landing page
│   ├── NotFound.tsx
│   └── admin/
│       ├── login.tsx
│       └── dashboard.tsx
├── lib/
│   ├── supabase.ts   # Supabase client
│   └── utils.ts
└── utils/
    └── toast.ts      # Toast utilities
```

## Kontribusi

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

© 2024 Salut Wonomulyo. All rights reserved.