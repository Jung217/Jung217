import React from 'react';

const ContactPrinter = () => {
    // 獲取當前日期與時間
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toTimeString().split(' ')[0].substring(0, 5);

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
                        <div className="cp-receipt-header">
                            CJ Chien <br />
                            <span style={{ fontSize: '0.85em', fontWeight: 400 }}>
                                EE610, No. 43, Sec. 4, Keelung Rd., <br />
                                Da'an Dist., Taipei City 106335, <br />
                                Taiwan (R.O.C.)
                            </span>
                        </div>
                        <table className="cp-receipt-table">
                            <tbody>
                                <tr>
                                    <th>Service</th>
                                    <th>Level</th>
                                    <th>Rate</th>
                                </tr>
                                <tr>
                                    <td>Photography</td>
                                    <td>Pro</td>
                                    <td>★ ★ ★</td>
                                </tr>
                                <tr>
                                    <td>Programming</td>
                                    <td>Dev</td>
                                    <td>★ ★ ★</td>
                                </tr>
                                <tr>
                                    <td>Ceramics</td>
                                    <td>Art</td>
                                    <td>★ ★ ☆</td>
                                </tr>
                                <tr className="cp-receipt-subtotal">
                                    <td colSpan={2}>Experience</td>
                                    <td>4+ Yrs</td>
                                </tr>
                                <tr className="cp-receipt-total">
                                    <td colSpan={1}>Phone TW</td>
                                    <td colSpan={2}>+886 909160217</td>
                                </tr>
                                <tr className="cp-receipt-total">
                                    <td colSpan={1}>Phone CN</td>
                                    <td colSpan={2}>+86 15859212926</td>
                                </tr>
                                <tr className="cp-receipt-total">
                                    <td colSpan={1}>Email</td>
                                    <td colSpan={2} style={{ fontSize: '0.9em' }}>cjchien17@gmail.com</td>
                                </tr>
                            </tbody>
                        </table>
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
