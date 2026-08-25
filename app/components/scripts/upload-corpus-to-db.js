require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ .env.local 설정을 확인해주세요.");
  process.exit(1);
}

// Timeout 시간을 늘리기 위해 옵션 추가
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  db: { schema: 'public' },
  global: {
    headers: { 'x-my-custom-header': 'dictionary-upload' },
  },
});

const FILE_PATH = 'C:\\dictionary_upload\\corpus.json'; 

async function uploadCorpus() {
  console.log(`🚀 파일 읽는 중... (${FILE_PATH})`);

  try {
    if (!fs.existsSync(FILE_PATH)) {
      throw new Error(`파일을 찾을 수 없습니다: ${FILE_PATH}`);
    }

    const rawData = fs.readFileSync(FILE_PATH, 'utf-8');
    let rowsToInsert = [];
    const processedPairs = new Set();

    // 데이터 파싱 (JSON 또는 텍스트)
    try {
        const corpusMap = JSON.parse(rawData);
        console.log("✅ JSON 형식 확인됨! 변환 중...");
        for (const [keyWord, val] of Object.entries(corpusMap)) {
            const targets = Array.isArray(val) ? val : [val];
            targets.forEach(targetWord => {
                const lineText = `${targetWord} ${keyWord}`;
                if (!processedPairs.has(lineText)) {
                    rowsToInsert.push({ category_id: 0, line_text: lineText, line_hash: lineText });
                    processedPairs.add(lineText);
                }
            });
        }
    } catch (e) {
        console.log("💡 텍스트 모드로 읽습니다.");
        const lines = rawData.split(/\r?\n/);
        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.length > 0 && !processedPairs.has(trimmedLine)) {
                rowsToInsert.push({ 
                    category_id: 0, 
                    line_text: trimmedLine, 
                    line_hash: trimmedLine 
                });
                processedPairs.add(trimmedLine);
            }
        });
    }

    console.log(`📦 총 ${rowsToInsert.length}개의 데이터 업로드 시작...`);
    console.log(`⚠️ 속도를 늦춰서 안전하게 보냅니다. (시간이 좀 걸립니다)`);

    // ★★★ [수정 1] 배치 사이즈를 50개로 대폭 축소 (DB 부담 최소화) ★★★
    const BATCH_SIZE = 50; 
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < rowsToInsert.length; i += BATCH_SIZE) {
      const batch = rowsToInsert.slice(i, i + BATCH_SIZE);
      
      // ★★★ [수정 2] upsert (덮어쓰기) 대신 ignoreDuplicates 옵션 사용
      const { error } = await supabase
        .from('dictionary_lines')
        .insert(batch, { onConflict: 'line_hash', ignoreDuplicates: true }); // 중복이면 무시

      if (error) {
        // 타임아웃 에러면 잠시 멈췄다 가기
        if (error.message.includes('timeout')) {
            console.log(`⏳ DB 휴식 중... (Timeout 발생)`);
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5초 휴식
        } else if (error.message.includes('duplicate')) {
             // 중복 에러는 무시
        } else {
            console.error(`❌ 구간 에러:`, error.message);
        }
      } else {
        successCount += batch.length;
        process.stdout.write(`\r✅ ${successCount} / ${rowsToInsert.length} 처리 중...`);
      }
      
      // ★★★ [수정 3] 매 전송마다 0.2초씩 쉬어줌
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log("\n\n🎉 [완료] 업로드가 끝났습니다!");

  } catch (err) {
    console.error("\n❌ 오류 발생:", err.message);
  }
}

uploadCorpus();