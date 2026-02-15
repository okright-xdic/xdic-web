// scripts/convert-to-csv.js
const fs = require('fs');

const FILE_PATH = 'C:\\dictionary_upload\\corpus.json'; 
const CSV_PATH = 'C:\\dictionary_upload\\corpus.csv';

try {
    console.log("🚀 CSV 변환 시작...");
    const rawData = fs.readFileSync(FILE_PATH, 'utf-8');
    
    // JSON 파싱 (혹시 텍스트면 텍스트로 처리)
    let corpusMap;
    let isJson = true;
    try {
        corpusMap = JSON.parse(rawData);
    } catch (e) {
        isJson = false;
    }

    // CSV 헤더 작성 (category_id, line_text, line_hash)
    let csvContent = "category_id,line_text,line_hash\n";
    let count = 0;
    const processedPairs = new Set();

    const addLine = (text) => {
        if (!text) return;
        const cleanText = text.replace(/"/g, '""'); // 따옴표 이스케이프 처리
        // 0번 카테고리, 텍스트, 해시값
        csvContent += `0,"${cleanText}","${cleanText}"\n`;
        count++;
    };

    if (isJson) {
        for (const [key, val] of Object.entries(corpusMap)) {
            const targets = Array.isArray(val) ? val : [val];
            targets.forEach(target => {
                const lineText = `${target} ${key}`;
                if (!processedPairs.has(lineText)) {
                    addLine(lineText);
                    processedPairs.add(lineText);
                }
            });
        }
    } else {
        // 텍스트 파일인 경우
        const lines = rawData.split(/\r?\n/);
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !processedPairs.has(trimmed)) {
                addLine(trimmed);
                processedPairs.add(trimmed);
            }
        });
    }

    fs.writeFileSync(CSV_PATH, csvContent, 'utf-8');
    console.log(`\n✅ 변환 완료!`);
    console.log(`📂 파일 위치: ${CSV_PATH}`);
    console.log(`📊 총 데이터: ${count}개`);
    console.log(`\n이제 Supabase 대시보드에서 이 파일을 'Import' 하세요!`);

} catch (err) {
    console.error("❌ 오류:", err.message);
}