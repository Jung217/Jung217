// GitHub Repo List 風格的技能展示卡片

// Sparkline SVG 元件：高點深綠 → 低點淡綠漸層
function Sparkline({ points, id }) {
    const W = 82, H = 28;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    const n = points.length;
    const xs = points.map((_, i) => (i / (n - 1)) * W);
    const ys = points.map(v => H - 2 - ((v - min) / range) * (H - 6));
    const line = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
    const area = `0,${H} ${line} ${W},${H}`;
    const gradId = `spark-g-${id}`;
    const fillId = `spark-f-${id}`;
    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flexShrink: 0, display: 'block' }}>
            <defs>
                {/* 折線漸層：頂部（高點）深綠，底部（低點）淡綠 */}
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#498d49" />
                    <stop offset="100%" stopColor="#182913" />
                </linearGradient>
                {/* 填充區漸層：從深綠半透明 → 幾乎透明 */}
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#498d49" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#182913" stopOpacity="0.03" />
                </linearGradient>
            </defs>
            <polygon points={area} fill={`url(#${fillId})`} />
            <polyline points={line} fill="none" stroke={`url(#${gradId})`} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
}

export default function SkillCard() {
    return (
        <div className="gc-outer">
            {/* SVG 濾鏡：用於旋轉邊框的光暈效果 */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="unopaq" y="-100%" height="300%" x="-100%" width="300%">
                    <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 0" />
                </filter>
                <filter id="unopaq2" y="-100%" height="300%" x="-100%" width="300%">
                    <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 0" />
                </filter>
                <filter id="unopaq3" y="-100%" height="300%" x="-100%" width="300%">
                    <feColorMatrix values="1 0 0 1 0  0 1 0 1 0  0 0 1 1 0  0 0 0 2 0" />
                </filter>
            </svg>

            <div className="gc-container">
                <div className="gc-spin gc-spin-blur" />
                <div className="gc-spin gc-spin-intense" />
                <div className="gc-backdrop" />
                <div className="gc-card-border">
                    <div className="gc-spin gc-spin-inside" />
                </div>

                <div className="gc-card">
                    {/* 頂部 Header */}
                    <div className="gc-header">
                        <div className="gc-top-header">
                            <div className="gc-icon">
                                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z" />
                                </svg>
                            </div>
                            <a className="gc-gh-icon" href="https://github.com/" target="_blank" rel="noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                                </svg>
                            </a>
                            <div className="gc-repo">
                                <a className="gc-repo-owner" href="https://github.com/Jung217" target="_blank" rel="noreferrer">Jung217</a>
                            </div>
                            <div className="gc-space" />
                            <div className="gc-icon">
                                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
                                </svg>
                            </div>
                            <div className="gc-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path d="M2.8 2.06A1.75 1.75 0 0 1 4.41 1h7.18c.7 0 1.333.417 1.61 1.06l2.74 6.395c.04.093.06.194.06.295v4.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25v-4.5c0-.101.02-.202.06-.295Zm1.61.44a.25.25 0 0 0-.23.152L1.887 8H4.75a.75.75 0 0 1 .6.3L6.625 10h2.75l1.275-1.7a.75.75 0 0 1 .6-.3h2.863L11.82 2.652a.25.25 0 0 0-.23-.152Zm10.09 7h-2.875l-1.275 1.7a.75.75 0 0 1-.6.3h-3.5a.75.75 0 0 1-.6-.3L4.375 9.5H1.5v3.75c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25Z" />
                                </svg>
                            </div>
                            {/* 頭像：使用真實 GitHub 大頭貼 */}
                            <a href="https://github.com/Jung217" target="_blank" rel="noreferrer" className="gc-pfp-link">
                                <img
                                    className="gc-pfp"
                                    src="https://avatars.githubusercontent.com/u/99934895?v=4&size=64"
                                    alt="Jung217"
                                    width="28"
                                    height="28"
                                />
                            </a>
                        </div>

                        {/* Tab 列：Overview / Repositories / Projects */}
                        <div className="gc-btm-header">
                            {/* Overview - active */}
                            <div className="gc-tab gc-tab-active">
                                <div className="gc-tab-icon">
                                    <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z" />
                                    </svg>
                                </div>
                                <div className="gc-tab-text">Overview</div>
                            </div>
                            {/* Repositories */}
                            <a className="gc-tab" href="https://github.com/Jung217?tab=repositories" target="_blank" rel="noreferrer">
                                <div className="gc-tab-icon">
                                    <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                                    </svg>
                                </div>
                                <div className="gc-tab-text">Repositories</div>
                            </a>
                            {/* Projects */}
                            <div className="gc-tab">
                                <div className="gc-tab-icon">
                                    <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25ZM6.5 6.5v8h7.75a.25.25 0 0 0 .25-.25V6.5Zm8-1.5V1.75a.25.25 0 0 0-.25-.25H6.5V5Zm-13 1.5v7.75c0 .138.112.25.25.25H5v-8ZM5 5V1.5H1.75a.25.25 0 0 0-.25.25V5Z" />
                                    </svg>
                                </div>
                                <div className="gc-tab-text">Projects</div>
                            </div>
                        </div>
                    </div>

                    {/* PR 列表內容 */}
                    <div className="gc-content">
                        <div className="gc-prs">
                            {[
                                { lang: 'C', key: 'c', color: '#555555', pts: [1, 1, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 4, 2] },
                                { lang: 'C#', key: 'csharp', color: '#178600', pts: [2, 3, 2, 4, 3, 5, 4, 3, 5, 4, 6, 5, 4, 5] },
                                { lang: 'Dart', key: 'dart', color: '#00B4AB', pts: [1, 1, 2, 2, 3, 2, 3, 4, 3, 5, 4, 5, 5, 6] },
                                { lang: 'HTML', key: 'html', color: '#e34c26', pts: [5, 6, 5, 7, 6, 5, 8, 6, 7, 6, 7, 8, 7, 6] },
                                { lang: 'Java', key: 'java', color: '#b07219', pts: [6, 5, 7, 5, 6, 4, 5, 4, 3, 4, 3, 2, 3, 2] },
                                { lang: 'JavaScript', key: 'javascript', color: '#f1e05a', pts: [3, 5, 4, 8, 6, 5, 9, 7, 8, 6, 9, 8, 7, 9] },
                                { lang: 'Jupyter Notebook', key: 'jupyter-notebook', color: '#DA5B0B', pts: [1, 1, 1, 5, 1, 1, 7, 1, 1, 6, 1, 1, 8, 1] },
                                { lang: 'Python', key: 'python', color: '#3572A5', pts: [4, 5, 6, 5, 7, 6, 7, 8, 7, 8, 9, 8, 9, 8] },
                                { lang: 'Scilab', key: 'scilab', color: '#a7a7a7', pts: [1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1] },
                                { lang: 'Swift', key: 'swift', color: '#F05138', pts: [2, 3, 2, 4, 3, 4, 5, 4, 5, 6, 5, 6, 7, 6] },
                                { lang: 'TypeScript', key: 'typescript', color: '#3178c6', pts: [2, 3, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7, 8, 9] },
                            ].map((item, i) => (
                                <a
                                    className="gc-repo-item"
                                    key={i}
                                    href={`https://github.com/Jung217?tab=repositories&q=&type=&language=${item.key}&sort=`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {/* 左：色點 + 語言名稱 */}
                                    <span className="gc-lang-dot" style={{ backgroundColor: item.color }} />
                                    <span className="gc-lang-name">{item.lang}</span>
                                    {/* 右：起伏 sparkline */}
                                    <span className="gc-sparkline-wrap">
                                        <Sparkline points={item.pts} id={i} />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
