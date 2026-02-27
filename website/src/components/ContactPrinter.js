import React from 'react';

const ContactPrinter = () => {
    // 獲取當前日期與時間 (強制 GMT+8)
    const now = new Date();
    const options = { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    const formatter = new Intl.DateTimeFormat('en-CA', options);
    const parts = formatter.formatToParts(now);
    const formattedDate = `${parts.find(p => p.type === 'year').value}-${parts.find(p => p.type === 'month').value}-${parts.find(p => p.type === 'day').value}`;
    const formattedTime = `${parts.find(p => p.type === 'hour').value}:${parts.find(p => p.type === 'minute').value}`;

    return (
        <div className="cp-outer-wrapper">
            <div className="cp-wrapper">
                <div className="cp-printer" />
                <div className="cp-printer-display">
                    <span className="cp-printer-message"> Click to print information</span>
                    <div className="cp-letter-wrapper">
                        <span className="cp-letter">P</span>
                        <span className="cp-letter">r</span>
                        <span className="cp-letter">i</span>
                        <span className="cp-letter">n</span>
                        <span className="cp-letter">t</span>
                        <span className="cp-letter">i</span>
                        <span className="cp-letter">n</span>
                        <span className="cp-letter">g</span>
                        <span className="cp-letter">.</span>
                        <span className="cp-letter">.</span>
                        <span className="cp-letter">.</span>
                    </div>
                </div>
                <button className="cp-print-button">⬅︎</button>
                <div className="cp-receipt-wrapper">
                    <div className="cp-receipt">
                        <div className="cp-receipt-subheader">
                            Contact Information <br />
                            {formattedDate} - {formattedTime}
                        </div>
                        <div className="cp-divider" />
                        <div className="cp-receipt-header">
                            CJ Chien <br />
                            <span style={{ fontSize: '0.85em', fontWeight: 400 }}>
                                EE610, No. 43, Sec. 4, Keelung Rd., <br />
                                Da'an Dist., Taipei City 106335, <br />
                                Taiwan (R.O.C.)
                            </span>
                        </div>
                        <div className="cp-receipt-contact">
                            <div className="cp-contact-row">
                                <span className="cp-label">Email:</span>
                                <span className="cp-value">cjchien17@gmail.com</span>
                            </div>
                            <div className="cp-contact-row">
                                <span className="cp-label">Phone TW:</span>
                                <span className="cp-value">+886 909160217</span>
                            </div>
                            <div className="cp-contact-row">
                                <span className="cp-label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CN:</span>
                                <span className="cp-value">+86 15859212926</span>
                            </div>
                        </div>
                        <div className="cp-divider" />
                        <table className="cp-receipt-table">
                            <tbody>
                                <tr>
                                    <th>Service</th>
                                    <th>Level</th>
                                    <th>Experience</th>
                                </tr>
                                <tr>
                                    <td>Photography</td>
                                    <td>Pro</td>
                                    <td>10+ yrs</td>
                                </tr>
                                <tr>
                                    <td>Programming</td>
                                    <td>Dev</td>
                                    <td>6+ yrs</td>
                                </tr>
                                <tr>
                                    <td>Ceramics</td>
                                    <td>Art</td>
                                    <td>4+ yrs</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="cp-divider" />
                        <div className="cp-jack-trades">Jack-of-all-trades</div>
                        <div className="cp-receipt-message" style={{ fontSize: '0.85em', lineHeight: '1.2em' }}>
                            Feel free to reach out for collaborations or just to say hi!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPrinter;
