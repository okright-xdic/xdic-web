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
const CATEGORY_ID = 1; // 기본영어

// 💡 밸런스 및 이어올리기 설정
const BATCH_SIZE = 50; 
const SKIP_LINES = 162450; // 💡 멈춘 지점 162,450번 줄부터 정확히 재시작!

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function generateHash(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

async function uploadData() {
    console.log(`🚀 [기본영어] 업로드 (단일 해시 방어) 시작... 대상 파일: ${FILE_PATH}`);
    console.log(`⏩ 앞의 ${SKIP_LINES}줄은 스킵하고 진행합니다!`);

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

        // 지정된 라인 수까지 무조건 패스
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

        if (batch.length >= BATCH_SIZE) {
            // 💡 [핵심 해결 포인트] onConflict를 'line_hash' 단일로 변경! 
            // 전체 DB를 통틀어 동일한 해시가 있으면 조용히 무시합니다.
            const { error } = await supabase.from('dictionary_lines').upsert(batch, {
                onConflict: 'line_hash', 
                ignoreDuplicates: true
            });
            
            if (error) {
                console.error(`❌ 업로드 에러 (Row ${currentLine - batch.length + 1} ~ ${currentLine}):`, error);
                return;
            }
            
            totalInserted += batch.length;
            console.log(`✅ 텍스트 파일의 ${currentLine}번째 줄까지 통과... (이번 턴 실제 처리: ${totalInserted}개)`);
            
            await delay(1000); 
            batch = []; 
        }
    }

    // 남은 자투리 데이터 업로드
    if (batch.length > 0) {
        const { error } = await supabase.from('dictionary_lines').upsert(batch, {
            onConflict: 'line_hash',
            ignoreDuplicates: true
        });
        if (error) {
            console.error(`❌ 마지막 배치 업로드 에러:`, error);
            return;
        }
        totalInserted += batch.length;
        console.log(`✅ 텍스트 파일의 ${currentLine}번째 줄까지 모두 통과 완료!`);
    }

    console.log(`🎉 [기본영어] 이번 실행으로 총 ${totalInserted}줄 추가 처리 완료! 🚀`);
}

uploadData();