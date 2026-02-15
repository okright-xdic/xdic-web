// scripts/generate-corpus.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ 오류: .env.local 파일 확인 필요");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ★ 저장할 경로를 사용자님 폴더로 지정!
const SAVE_PATH = 'C:\\dictionary_upload\\corpus.json';

async function fetchAndSaveCorpus() {
  console.log("🚀 1:1 말뭉치 추출 시작 (Materialized View 사용)...");
  
  const corpusMap = Object.create(null);
  const pageSize = 5000; // 속도 업!
  
  let lastId = null; 
  let totalCount = 0;
  let hasMore = true;

  while (hasMore) {
    // view_clean_corpus (아까 만든 고속 테이블)에서 조회
    let query = supabase
      .from('view_clean_corpus')
      .select('id, line_text')
      .order('id', { ascending: true })
      .limit(pageSize);

    if (lastId) {
      query = query.gt('id', lastId);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`❌ DB 에러:`, error.message);
      break;
    }

    if (data && data.length > 0) {
      data.forEach(row => {
        const text = row.line_text.trim();
        const parts = text.split(/\s+/); // 공백으로 분리
        
        // 딱 2단어인 경우만 (사랑 Love)
        if (parts.length === 2) {
          const [wordA, wordB] = parts;
          const cleanA = wordA.toLowerCase().replace(/[.,?!()~]/g, '');
          const cleanB = wordB.toLowerCase().replace(/[.,?!()~]/g, '');

          if (cleanA && cleanB) {
             if (!corpusMap[cleanA]) corpusMap[cleanA] = [];
             if (!corpusMap[cleanA].includes(cleanB)) corpusMap[cleanA].push(cleanB);

             if (!corpusMap[cleanB]) corpusMap[cleanB] = [];
             if (!corpusMap[cleanB].includes(cleanA)) corpusMap[cleanB].push(cleanA);
          }
        }
      });

      lastId = data[data.length - 1].id;
      totalCount += data.length;
      process.stdout.write(`\r📦 ${totalCount}개 수집 완료`);
    } else {
      hasMore = false;
    }
  }

  console.log(`\n✅ 추출 완료! 파일 저장 중...`);
  
  // 파일 저장
  fs.writeFileSync(SAVE_PATH, JSON.stringify(corpusMap, null, 2), 'utf-8');
  console.log(`💾 저장 완료: ${SAVE_PATH}`);
}

fetchAndSaveCorpus();