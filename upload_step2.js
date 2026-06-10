const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 업로드 설정
const FILE_PATH = 'C:\\dictionary_upload\\한글영어말뭉치.txt';
const CATEGORY_ID = 0; // 기초영어

// 💡 [초안전 주행 설정] 
const BATCH_SIZE = 70; // 한 입 크기를 200개 -> 100개로 더 축소!
const SKIP_LINES = 83870; // 83,870번째 줄까지 빛의 속도로 스킵!

// 💡 DB 휴식 시간을 1초 -> 2초(2000ms)로 대폭 늘려 완벽한 소화 보장
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function generateHash(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

async function uploadData() {
    console.log(`🚀 [기초영어] 업로드 시작... 대상 파일: ${FILE_PATH}`);
    console.log(`⏩ 앞의 ${SKIP_LINES}줄은 DB 작업 없이 빛의 속도로 건너뜁니다!`);

    if (!fs.existsSync(FILE_PATH)) {
        console.error('❌ 파일을 찾을 수 없습니다. 경로를 확인해주세요.');
        return;
    }

    const seenHashes = new Set();
    let duplicateCount = 0;

    const fileStream = fs.createReadStream(FILE_PATH, 'utf-8');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let batch = [];
    let currentLine = 0;   
    let totalInserted = 0; 

    for await (const line of rl) {
        currentLine++;

        // 💡 지정된 라인 수까지는 무조건 패스!
        if (currentLine <= SKIP_LINES) {
            continue;
        }

        const lineText = line.trim();
        if (!lineText) continue;

        const lineHash = generateHash(lineText);

        if (seenHashes.has(lineHash)) {
            duplicateCount++;
            continue;
        }
        
        seenHashes.add(lineHash);

        batch.push({
            category_id: CATEGORY_ID,
            source_order: currentLine, 
            line_text: lineText,
            line_hash: lineHash
        });

        // BATCH_SIZE(100)만큼 모이면 Supabase에 전송
        if (batch.length >= BATCH_SIZE) {
            const { error } = await supabase.from('dictionary_lines').upsert(batch, {
                onConflict: 'category_id, line_hash',
                ignoreDuplicates: true
            });
            
            if (error) {
                console.error(`❌ 업로드 에러 (Row ${currentLine - batch.length + 1} ~ ${currentLine}):`, error);
                return;
            }
            
            totalInserted += batch.length;
            console.log(`✅ 텍스트 파일의 ${currentLine}번째 줄까지 통과... (이번 턴 실제 업로드: ${totalInserted}개)`);
            
            await delay(2000); // 💡 2초씩 아주아주 넉넉하게 휴식
            batch = []; 
        }
    }

    // 남은 자투리 데이터 업로드
    if (batch.length > 0) {
        const { error } = await supabase.from('dictionary_lines').upsert(batch, {
            onConflict: 'category_id, line_hash',
            ignoreDuplicates: true
        });
        if (error) {
            console.error(`❌ 마지막 배치 업로드 에러:`, error);
            return;
        }
        totalInserted += batch.length;
        console.log(`✅ 텍스트 파일의 ${currentLine}번째 줄까지 모두 통과 완료!`);
    }

    console.log(`🎉 [기초영어] 이번 실행으로 총 ${totalInserted}줄 추가 업로드 완료! (제거된 파일 내 중복: ${duplicateCount}개)`);
}

uploadData();
