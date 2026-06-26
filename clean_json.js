const fs = require('fs');
const path = require('path');

const JSON_FILE = path.join(__dirname, 'app', 'api', 'translate-en-ko', 'rules-en-ko.json');

async function cleanJson() {
  console.log('🚀 JSON 파일 청소를 시작합니다...');

  if (!fs.existsSync(JSON_FILE)) {
    console.error('❌ rules-en-ko.json 파일을 찾을 수 없습니다.');
    return;
  }

  const rules = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
  const cleanRules = {};

  for (let [en, ko] of Object.entries(rules)) {
    // 1. 영어 문장에 묻은 정규식 기호들 싹 청소
    let cleanEn = en
      .replace(/\\\.\?\(\?\!\\w\)/g, '')  // \.?(?!\w) 제거
      .replace(/\.\?\(\?\!\\w\)/g, '')    // .?(?!\w) 제거
      .replace(/\\\(\?to\\\)\?/g, 'to')   // \(?to\)? -> to 로 복원
      .replace(/\(\?to\)\?/g, 'to')       // (?to)? -> to 로 복원
      .replace(/\(consitutional\|constitutional\)/g, 'constitutional') // 오타 방어식 복원
      .replace(/wee\[kl\]/g, 'week')      // week/weel 방어식 복원
      .replace(/\\/g, '')                 // 혹시 남은 역슬래시 제거
      .replace(/\s+/g, ' ')               // 띄어쓰기 정리
      .trim();

    // 2. 한국어 문장 끝에 잘못 붙은 물음표(?) 제거
    let cleanKo = ko.replace(/\?$/, '').trim();

    // 3. 417번 외계어 번역 강제 교정
    if (cleanEn.includes('uphold constitutional government')) {
      cleanKo = '입헌정치를 유지하고 신민들의 행복과 번영을 증진시키는 것이 나의 의무이다';
    }

    cleanRules[cleanEn] = cleanKo;
  }

  // 청소된 데이터를 다시 예쁘게 덮어쓰기
  fs.writeFileSync(JSON_FILE, JSON.stringify(cleanRules, null, 2), 'utf-8');
  console.log('✨ 청소 완료! 정규식 기호와 물음표가 모두 깔끔하게 사라졌습니다!');
}

cleanJson();