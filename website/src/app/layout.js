import "./globals.css";

export const metadata = {
  title: "CJ Chien | Photographer & Programmer",
  description: "Portfolio of CJ Chien, featuring photography and pottery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="main-nav animate-fade-in">
          <div className="container nav-content">
            <a href="/" className="nav-logo">CJ Chien</a>
            <div className="nav-links">
              <a href="/"><span className="inner">Home</span></a>
              <a href="/pottery"><span className="inner">Pottery</span></a>
              <a href="/photography"><span className="inner">Photography</span></a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
