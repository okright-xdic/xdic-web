import { PARTICLES } from './particles';
import { AnalysisResult } from './types';

export function analyzeKoreanParticles(word: string): AnalysisResult {
  let stem = word;
  const particles: string[] = [];
  let searching = true;

  while (searching) {
    searching = false;
    for (const particle of PARTICLES) {
      if (stem.length > particle.length && stem.endsWith(particle)) {
        stem = stem.slice(0, -particle.length);
        particles.unshift(particle);
        searching = true;
        break;
      }
    }
  }
  return { original: word, stem, particles };
}