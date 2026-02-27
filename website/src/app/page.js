import Head from 'next/head';
import Link from 'next/link';
import TerminalText from '@/components/TerminalText';
import SkillCard from '@/components/SkillCard';
import ContactPrinter from '@/components/ContactPrinter';

export default function Home() {
  return (
    <div className="animate-fade-in">
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: "url('/profile.jpg')" }} />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <h1 className="hero-title">I'm <span>CJ Chien</span></h1>
          <p className="hero-subtitle">Photographer and Programmer, also Ceramist.</p>
        </div>
      </section>

      <main className="container">

        <section id="about" className="section">
          <h2>About me</h2>
          <TerminalText text="我是簡志融，我是一位Photographer，同時我也是一位Programer。攝影與我而言不僅是一種記錄生活的方式，更是探索世界與自我表達的重要途徑。透過鏡頭，沉浸在拍攝中，我捕捉細節與光影的變化，並感受專注的力量。" />
        </section>

        <section id="skills" className="section">
          <h2>Skills</h2>

          {/* GitHub 3D Contribution Graph */}
          <div className="gh-contrib-wrapper">
            <img
              src="https://raw.githubusercontent.com/Jung217/Jung217/main/profile-3d-contrib-simplify/profile-night-rainbow.svg"
              alt="GitHub Contribution Graph"
              className="gh-contrib-img"
            />
          </div>

          {/* GitHub PR 風格技能卡片 */}
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

        <section id="contact" className="section">
          <h2>Contact Me</h2>
          {/* contact-info 佔滿整行，移除原本空的 contact-form */}
          <div className="contact-info">
            <div style={{ marginTop: '0px' }}>
              <ContactPrinter />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
