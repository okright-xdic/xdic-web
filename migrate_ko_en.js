const fs = require('fs');
const path = require('path');

// 💡 한영 엔진 경로 (translate-search)
const ROUTE_FILE = path.join(__dirname, 'app', 'api', 'translate-search', 'route.ts');
const OUTPUT_FILE = path.join(__dirname, 'app', 'api', 'translate-search', 'rules-ko-en.json');

async function migrate() {
  console.log('🚀 [1단계] translate-search/route.ts 파일에서 한국어 예문 패턴을 스캔합니다...');

  if (!fs.existsSync(ROUTE_FILE)) {
    console.error('❌ route.ts 파일을 찾을 수 없습니다. 프로젝트 최상단인지 확인하세요!');
    return;
  }

  const code = fs.readFileSync(ROUTE_FILE, 'utf-8');
  
  // .replace 안의 첫 번째 인자(정규식)를 낚아채는 패턴
  const regex = /\.replace\(\/(.*?)\/[a-z]*\s*,\s*'/g;

  let match;
  const sentences = new Set();

  while ((match = regex.exec(code)) !== null) {
    let s = match[1];

    // 💡 [수프로 엣지] 정규식 기호를 사람이 읽는 자연스러운 한국어로 스마트 복원!
    s = s.replace(/^\(\^\|\\s\)/, '');         // (^|\s) 제거
    s = s.replace(/\\\.\?\(\?\!\\w\)$/, '');   // \.?(?!\w) 제거
    s = s.replace(/\(\?\!\\w\)$/, '');         // (?!\w) 제거
    s = s.replace(/\\\.\?$/, '');              // \.? 제거
    s = s.replace(/\\s\*/g, ' ').replace(/\\s\+/g, ' '); // 공백 처리
    s = s.replace(/\(([^|()]+)\|[^()]*\)/g, '$1');       // (했다|하였다) -> 했다 (첫 번째 선택지 채택)
    s = s.replace(/\(([^()]+)\)\?/g, '$1');              // (그 )? -> 그 (생략 가능한 단어 포함)
    s = s.replace(/\\\?/g, '?');
    s = s.replace(/\\/g, '');                  // 남은 역슬래시 제거
    s = s.replace(/\s+/g, ' ').trim();         // 다중 공백 깔끔하게 1개로 압축

    // 한국어가 포함되어 있고, 엔진 내부 부품(Token)이 아닌 순수 예문만 필터링!
    if (/[가-힣]/.test(s) && !s.includes('Token') && !s.includes('_Tk')) {
      sentences.add(s);
    }
  }

  const koreanList = Array.from(sentences);
  console.log(`✅ 총 ${koreanList.length}개의 한국어 문장 패턴을 완벽하게 추출했습니다!`);
  console.log('\n🚀 [2단계] 로컬 엑스딕 한영 엔진을 가동하여 영어 번역을 뽑아옵니다...');
  console.log('⚠️ 주의: 다른 터미널에서 [ npm run dev ] 로 서버가 켜져 있어야 합니다!\n');

  let rules = {};
  if (fs.existsSync(OUTPUT_FILE)) {
     rules = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
  }

  let successCount = 0;

  for (let i = 0; i < koreanList.length; i++) {
    const ko = koreanList[i];

    // 이미 JSON에 번역이 있으면 패스 (이어 올리기 지원)
    if (rules[ko]) {
        successCount++;
        continue;
    }

    try {
      // 💡 선생님의 엑스딕 한영 엔진(translate-search)에 직접 API 요청!
      const res = await fetch('http://127.0.0.1:3000/api/translate-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: ko })
      });

      const data = await res.json();
      if (data.ok && data.best && data.best.target_text) {
        const en = data.best.target_text.replace(/\.$/, '').trim();
        if (en !== '') {
           rules[ko] = en;
           successCount++;
           console.log(`[${i + 1}/${koreanList.length}] 🟢 변환 성공: ${ko} ➔ ${en}`);
        }
      }
    } catch (err) {
      console.error(`\n❌ 서버 연결 실패! 다른 터미널 창에서 'npm run dev'가 실행 중인지 확인해 주세요!`);
      return;
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(rules, null, 2), 'utf-8');
  console.log(`\n🎉 [3단계] 마이그레이션 대성공! 총 ${successCount}개의 규칙이 'rules-ko-en.json'에 이사 완료되었습니다.`);
}

migrate();