import TerminalText from '@/components/TerminalText';
import SkillCard from '@/components/SkillCard';
import ContactPrinter from '@/components/ContactPrinter';
import SocialFloat from '@/components/SocialFloat';
import CurrentlyPlaying from '@/components/CurrentlyPlaying';
import { getTopTracks } from '@/lib/spotify';

export default async function Home() {
  const topTracks = await getTopTracks();

  return (
    <>
      <div className="animate-fade-in">
        <section className="hero">
          <div className="hero-bg" style={{ backgroundImage: "url('/profile.jpg')" }} />
          <div className="hero-overlay" />
          <div className="container hero-content">
            <h1 className="hero-title">I'm <span>CJ Chien</span></h1>
            <div className="hero-subtitle">
              <TerminalText typingSpeed={50} text="Always Be Willful, Follow No One." />
            </div>
          </div>
        </section>

        <main className="container">

          <section id="about" className="section">
            <h2>About me</h2>
            <p style={{ lineHeight: '1.8', marginBottom: '1rem', textAlign: 'justify' }}>
              I am CJ Chien, a multidisciplinary enthusiast specializing in Photography, Programming, and Ceramics. In programming, I focus on building efficient and aesthetic systems. With hands-on experience in Frontend development, Embedded Systems (C/C++), and automation tool creation, I excel at transforming complex logic into clean solutions. Photography is my lens to explore the world and express myself, while ceramics is the silent dialogue between hands and clay.
            </p>
            <p style={{ lineHeight: '1.8', textAlign: 'justify' }}>
              我是簡志融，一位熱衷於攝影、程式開發與陶藝創作的跨領域實踐者。在程式開發領域，我專注於構建高效且美觀的系統。具備前端開發、嵌入式系統 (C/C++) 以及自動化工具開發的實戰經驗，擅長將複雜的邏輯轉化為簡潔的解決方案。攝影與我而言不僅是記錄生活，更是探索世界與自我表達的重要途徑；而陶藝則是雙手與泥土之間的無聲對話。
            </p>
          </section>

          <section id="skills" className="section">
            <h2>Skills</h2>

            <div className="gh-contrib-wrapper">
              <img
                src="https://raw.githubusercontent.com/Jung217/Jung217/main/profile-3d-contrib-simplify/profile-night-rainbow.svg"
                alt="GitHub Contribution Graph"
                className="gh-contrib-img"
              />
            </div>

            <SkillCard />
          </section>

          <section id="education" className="section">
            <h2>Education</h2>
            <ul className="education-list">
              <li className="blob-card-base">
                <div className="blob-card-bg" />
                <div className="blob-card-blob" />
                <div className="education-watermark" style={{ backgroundImage: 'url(https://www.secretariat.ntust.edu.tw/var/file/63/1063/img/177523079.png)' }} />
                <div className="blob-card-content">
                  <div className="education-text">
                    <h3>M.S. Department of Electrical Engineering</h3>
                    <p>National Taiwan University of Science and Technology. (Sep. 2025 ~ Now)</p>
                  </div>
                </div>
              </li>
              <li className="blob-card-base">
                <div className="blob-card-bg" />
                <div className="blob-card-blob" />
                <div className="education-watermark" style={{ backgroundImage: 'url(https://mbm.nqu.edu.tw/wp-content/uploads/2021/07/%E9%87%91%E5%A4%A7LOGO%E5%9C%93-1.svg)' }} />
                <div className="blob-card-content">
                  <div className="education-text">
                    <h3>B.S. Department of Computer Science &amp; Information Engineering</h3>
                    <p>National Quemoy University. (Sep. 2021 ~ May. 2025)</p>
                  </div>
                </div>
              </li>
            </ul>
          </section>

          <section id="spotify" className="section">
            <h2>Spotify</h2>

            <div className="spotify-layout">
              <div className="spotify-left">
                <CurrentlyPlaying />
              </div>

              <div className="spotify-right">
                {topTracks && topTracks.length > 0 && (
                  <div className="spotify-top-tracks">
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>My Top Tracks</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      {topTracks.map((track, index) => (
                        <li key={track.id} className="top-track-item">
                          <a
                            href={track.external_urls?.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="top-track-link"
                          >
                            <span className="top-track-index">{index + 1}.</span>
                            {track.album?.images?.[2]?.url && (
                              <img
                                src={track.album.images[2].url}
                                alt={track.album.name}
                                className="top-track-img"
                              />
                            )}
                            <div className="top-track-info">
                              <div className="top-track-name">{track.name}</div>
                              <div className="top-track-artist">
                                {track.artists.map(artist => artist.name).join(', ')}
                              </div>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <iframe
              data-testid="embed-iframe"
              style={{ borderRadius: '0', marginBottom: '2rem', display: 'block' }}
              src="https://open.spotify.com/embed/artist/2AfmfGFbe0A0WsTYm0SDTx?utm_source=generator&theme=0"
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>

          </section>

          <section id="contact" className="section">
            <h2>Contact Me</h2>
            <div className="contact-info">
              <div>
                <ContactPrinter />
              </div>
            </div>
          </section>
        </main>
      </div>
      <SocialFloat />
    </>
  );
}
