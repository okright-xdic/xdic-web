import { analyzeKoreanParticles } from './analyzer';

export function sovToSvo(sentence: string) {
  const words = sentence.split(' ');
  // 1. 형태소/조사 분석 및 성분 분리
  const subject = words.find(w => analyzeKoreanParticles(w).particles.some(p => ['이', '가', '은', '는'].includes(p)))?.replace(/이|가|은|는/g, '');
  const object = words.find(w => analyzeKoreanParticles(w).particles.some(p => ['을', '를'].includes(p)))?.replace(/을|를/g, '');
  const verbWord = words[words.length - 1]; // 문장 끝 동사
  const verb = analyzeKoreanParticles(verbWord).stem;

  // 2. SVO 재배열 로직 (규칙 기반)
  return `${subject || 'I'} ${verb} ${object || ''}`.trim();
}