import React from 'react';

const ContactPrinter = () => {
    // 獲取當前日期與時間 (強制 GMT+8)
    const now = new Date();
    const options = { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
    const formatter = new Intl.DateTimeFormat('en-CA', options);
    const parts = formatter.formatToParts(now);
    const formattedDate = `${parts.find(p => p.type === 'year').value}-${parts.find(p => p.type === 'month').value}-${parts.find(p => p.type === 'day').value}`;
    const formattedTime = `${parts.find(p => p.type === 'hour').value}:${parts.find(p => p.type === 'minute').value}`;

    const renderPrinterHead = () => (
        <>
            <div className="cp-printer" />
            <div className="cp-printer-display">
                <span className="cp-printer-message"> Click to print information</span>
                <div className="cp-letter-wrapper">
                    {"Printing...".split("").map((char, index) => (
                        <span key={index} className="cp-letter" style={{ animationDelay: `${index * 0.05}s` }}>
                            {char}
                        </span>
                    ))}
                </div>
            </div>
            <button className="cp-print-button">⬅︎</button>
        </>
    );

    const renderContactInfo = () => (
        <div className="cp-receipt-contact">
            {[
                { label: 'Email:', value: 'cjchien17@gmail.com' },
                { label: 'Phone TW:', value: '+886 909160217' },
                { label: '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0CN:', value: '+86 15859212926' }
            ].map((item, idx) => (
                <div key={idx} className="cp-contact-row">
                    <span className="cp-label">{item.label}</span>
                    <span className="cp-value">{item.value}</span>
                </div>
            ))}
        </div>
    );

    const renderServiceTable = () => (
        <table className="cp-receipt-table">
            <thead>
                <tr>
                    <th>Service</th>
                    <th>Level</th>
                    <th>Experience</th>
                </tr>
            </thead>
            <tbody>
                {[
                    { s: 'Photography', l: 'Pro', e: '10+ yrs' },
                    { s: 'Programming', l: 'Dev', e: '6+ yrs' },
                    { s: 'Ceramics', l: 'Art', e: '4+ yrs' }
                ].map((item, idx) => (
                    <tr key={idx}>
                        <td>{item.s}</td>
                        <td>{item.l}</td>
                        <td>{item.e}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="cp-outer-wrapper">
            <div className="cp-wrapper">
                {renderPrinterHead()}
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
                        {renderContactInfo()}
                        <div className="cp-divider" />
                        {renderServiceTable()}
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
};

export default ContactPrinter;
