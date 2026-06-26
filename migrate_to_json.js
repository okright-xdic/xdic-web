const fs = require('fs');
const path = require('path');

// 파일 경로 설정 (선생님의 프로젝트 구조에 맞춤)
const ROUTE_FILE = path.join(__dirname, 'app', 'api', 'translate-en-ko', 'route.ts');
const OUTPUT_FILE = path.join(__dirname, 'app', 'api', 'translate-en-ko', 'rules-en-ko.json');

async function migrate() {
  console.log('🚀 [1단계] route.ts 파일에서 영어 예문 패턴을 스캔합니다...');
  
  if (!fs.existsSync(ROUTE_FILE)) {
    console.error('❌ route.ts 파일을 찾을 수 없습니다. 프로젝트 최상단 폴더에서 실행 중인지 확인하세요!');
    return;
  }

  const code = fs.readFileSync(ROUTE_FILE, 'utf-8');
  // .replace 안의 영어 패턴을 낚아채는 정규식
  const regex = /\.replace\(\/(?:\(\^\|\\s\))?(.*?)(?:\\\.?\(\?!\\w\))?\/gi/g;
  
  let match;
  const sentences = new Set();

  while ((match = regex.exec(code)) !== null) {
    let s = match[1];
    
    // 한국어 보정 로직(.replace(/하늘을/g...))은 무시하고 영어만 추출
    if (/[가-힣]/.test(s)) continue; 

    // 정규식 기호들을 사람이 읽는 자연스러운 영문장으로 복원
    s = s.split('\\s+').join(' ');
    s = s.split('\\s*').join(' ');
    s = s.split("'?").join("'");
    s = s.split("[m]?").join("m");
    s = s.split("(?:\\(?that\\)? )?").join("");
    s = s.split("(?:that )?").join("");
    s = s.split("adm\\.? ").join("adm. ");
    s = s.split("\\?").join("?");
    s = s.trim();
    
    if (s) sentences.add(s);
  }

  const englishList = Array.from(sentences);
  console.log(`✅ 총 ${englishList.length}개의 영어 문장 패턴을 완벽하게 추출했습니다!`);
  console.log('\n🚀 [2단계] 로컬 엑스딕 엔진을 가동하여 한국어 번역을 뽑아옵니다...');
  console.log('⚠️ 주의: 터미널을 하나 더 열어서 [ npm run dev ] 로 서버를 켜둔 상태여야 합니다!\n');

  let rules = {};
  if (fs.existsSync(OUTPUT_FILE)) {
     rules = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
  }

  let successCount = 0;

  for (let i = 0; i < englishList.length; i++) {
    const en = englishList[i];
    
    // 이미 JSON에 번역이 있으면 패스
    if (rules[en]) {
        successCount++;
        continue;
    }

    try {
      // 선생님의 엑스딕 엔진(API)에 직접 번역을 요청합니다!
      const res = await fetch('http://127.0.0.1:3000/api/translate-en-ko', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: en })
      });
      
      const data = await res.json();
      if (data.ok && data.best && data.best.target_text) {
        // 끝에 붙은 마침표 제거 후 깔끔하게 저장
        const ko = data.best.target_text.replace(/\.$/, '').trim();
        if (ko !== '') {
           rules[en] = ko;
           successCount++;
           console.log(`[${i + 1}/${englishList.length}] 🟢 변환 성공: ${en} ➔ ${ko}`);
        }
      }
    } catch (err) {
      console.error(`\n❌ 서버 연결 실패! 다른 터미널에서 'npm run dev'로 서버가 돌아가고 있는지 확인해 주세요!`);
      return;
    }
  }

  // 완성된 사전을 JSON 파일로 예쁘게 저장
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(rules, null, 2), 'utf-8');
  console.log(`\n🎉 [3단계] 마이그레이션 대성공! 총 ${successCount}개의 규칙이 'rules-en-ko.json'에 이사 완료되었습니다.`);
  console.log(`이제 route.ts에 있는 길고 긴 .replace 기차들을 과감하게 지우셔도 됩니다! 🚀`);
}

migrate();