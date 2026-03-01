'use client';

// 將圖片 round-robin 分配到 N 個欄位
function splitIntoColumns(images, cols) {
    const columns = Array.from({ length: cols }, () => []);
    images.forEach((img, i) => columns[i % cols].push(img));
    return columns;
}

const COLUMN_COUNT = 3;
// 欄位方向：0=上, 1=下, 2=上
const DIRECTIONS = ['up', 'down', 'up'];

export default function PotteryCarousel({ images = [] }) {
    if (images.length === 0) {
        return (
            <p className="text-secondary">
                No pottery images found. Add images directly to <code>public/gallery/pottery/</code>
            </p>
        );
    }

    const columns = splitIntoColumns(images, COLUMN_COUNT);
    // 每欄速度基於該欄圖片數量（每張約 4 秒）
    return (
        <div className="pc-scene">
            {columns.map((colImages, colIdx) => {
                const dir = DIRECTIONS[colIdx];
                const duration = colImages.length * 4;
                // 複製讓捲動無縫循環
                const looped = [...colImages, ...colImages];
                return (
                    <div key={colIdx} className={`pc-column pc-column-${colIdx + 1}`}>
                        <div
                            className={`pc-strip pc-strip-${dir}`}
                            style={{ animationDuration: `${duration}s` }}
                        >
                            {looped.map((src, idx) => (
                                <div key={idx} className="pc-item">
                                    <img
                                        src={src}
                                        alt={`Pottery ${(idx % colImages.length) + 1}`}
                                        className="pc-img"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
