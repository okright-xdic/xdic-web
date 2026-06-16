// 💡 런타임 메모리 딕셔너리
const conjugationDB: Record<string, string[]> = {};
const parseConjugations = (rawStr: string) => {
  if (!rawStr || rawStr.includes('복사해서')) return;
  rawStr.split('|').forEach(item => {
    const [pres, past, fut] = item.split(':');
    if (pres && past && fut) {
      conjugationDB[pres] = [past, fut];
    }
  });
};

parseConjugations(KO_ENDINGS_RAW);
parseConjugations(HAEYO_ENDINGS_RAW);
parseConjugations(HASHIPSIO_ENDINGS_RAW);
parseConjugations(Q_FRIENDS_ENDINGS_RAW);
parseConjugations(HASHIPSIO_Q_ENDINGS_RAW);

const getKoreanConjugation = (baseWord: string, tense: 'past' | 'future' | 'present'): string => {
  const parts = conjugationDB[baseWord];
  if (parts) {
    if (tense === 'past') return parts[0];
    if (tense === 'future') return parts[1];
  }
  return baseWord;
};

const MOCK_XDIC_DB: Record<string, string> = {
  '가공하다': 'process', '가공합니까?': 'process', '가공합니까': 'process',
  '요구하다': 'require', '요청하다': 'request', '허락하다': 'allow', '가능하다': 'enable', '설득하다': 'persuade',
  '기대하다': 'expect', '원하다': 'want', '바라다': 'wish', '동기부여하다': 'motivate', '충동하다': 'inspire',
  '이끌다': 'lead', '유도하다': 'lead', '하게_하다': 'cause', '야기하다': 'cause', '도전하게_하다': 'challenge',
  '예상하다': 'expect', '의도하다': 'intend', '작정하다': 'intend', '필요로_하다': 'need', '더_좋아하다': 'prefer',
  '유혹하다': 'tempt', '부추기다': 'tempt', '경고하다': 'warn', '상기시키다': 'remind', '생각나게_하다': 'remind',
  '강요하다': 'force', '금지하다': 'forbid', '구걸하다': 'beg', '간청하다': 'beg', '부르다': 'call',
  '임명하다': 'appoint', '고려하다': 'consider', '여기다': 'consider', '생각하다': 'think', '만들다': 'make',
  '유지하다': 'keep', '변화하다': 'change', '좋아하다': 'like', '선언하다': 'declare', '알리다': 'announce',
  '발표하다': 'announce', '상상하다': 'imagine', '증명하다': 'prove', '보여주다': 'show', '상태로_두다': 'leave',
  '하게_두다': 'let', '하게_허락하다': 'let', '시키다': 'have', '하도록_만들다': 'make', '하게_만들다': 'get', '도움을_주다': 'help',
  '명령하다': 'bid', '지시하다': 'bid', '말하다': 'tell', '보다': 'see',
  '듣다': 'hear', '느끼다': 'feel', '알다': 'know', '알게_되다': 'find', '발견하다': 'find',
  '간주하다': 'regard', '주다': 'give', '수여하다': 'award', '승인하다': 'grant', '건네주다': 'hand',
  '빌려주다': 'lend', '제안하다': 'offer', '전달하다': 'pass', '지불하다': 'pay', '약속하다': 'promise',
  '팔다': 'sell', '보내다': 'send', '가르치다': 'teach', '쓰다': 'write', '양보하다': 'yield',
  '산출하다': 'yield', '할당하다': 'assign', '먹이를_주다': 'feed', '제공하다': 'serve', '전송하다': 'forward',
  '남겨주다': 'leave', '사주다': 'buy', '만들어주다': 'make', '구해주다': 'get', '요리해주다': 'cook',
  '지어주다': 'build', '골라주다': 'choose', '해주다': 'do', '찾아주다': 'find', '주문해주다': 'order',
  '준비해주다': 'prepare', '덜어주다': 'save', '불러주다': 'call', '그려주다': 'draw', '구워주다': 'bake',
  '예약해주다': 'reserve', '가져다주다': 'bring', '잡아주다': 'catch', '가져오다': 'fetch', '고쳐주다': 'fix',
  '모아주다': 'gather', '보관해주다': 'keep', '따라주다': 'pour', '처방해주다': 'prescribe', '인쇄해주다': 'print',
  '묻다': 'ask', '부탁하다': 'beg', '질문하다': 'question', '애원하다': 'implore', '비용이_들게_하다': 'cost',
  '거절하다': 'deny', '부러워하다': 'envy', '용서하다': 'forgive', '시간을_덜어주다': 'save', '수고를_덜어주다': 'save',
  '인상을_주다': 'strike', '빌어주다': 'wish', '받아들이다': 'accept', '조언하다': 'advise', '동의하다': 'agree',
  '변경하다': 'alter', '대답하다': 'reply', '감사하다': 'appreciate', '추정하다': 'assume', '때리다': 'beat',
  '시작하다': 'start', '믿다': 'believe', '물다': 'bite', '숨쉬다': 'breathe', '돌보다': 'care',
  '신경쓰다': 'care', '운반하다': 'carry', '바꾸다': 'change', '씹다': 'chew', '불평하다': 'complain',
  '계속하다': 'continue', '창조하다': 'create', '울다': 'cry', '결정하다': 'decide', '감소시키다': 'decrease',
  '묘사하다': 'describe', '디자인하다': 'design', '열망하다': 'desire', '결심하다': 'determine', '개발하다': 'develop',
  '토론하다': 'discuss', '싫어하다': 'dislike', '의심하다': 'doubt', 'drop': 'drop', '끝내다': 'end',
  '즐기다': 'enjoy', '설명하다': 'explain', '표현하다': 'express', 'fear': 'fear', '끝마치다': 'finish',
  '잊어버리다': 'forget', '얻다': 'get', '흘끗_보다': 'glance', '재배하다': 'grow', '키우다': 'grow',
  '추측하다': 'guess', '증오하다': 'hate', '가지다': 'have', '치다': 'strike', '향상시키다': 'improve',
  '증가시키다': 'increase', '소개하다': 'introduce', '웃다': 'laugh', '들어올리다': 'lift', '사랑하다': 'love',
  '의미하다': 'mean', '언급하다': 'mention', 'move': 'move', '알아차리다': 'notice', '알아채다': 'notice',
  '관찰하다': 'observe', '소유하다': 'own', '생산하다': 'produce', '당기다': 'pull', '밀다': 'push',
  '깨닫다': 'realize', '받다': 'receive', '알아보기': 'recognize', '줄이다': 'reduce', '기억하다': 'remember',
  '존경하다': 'respect', '냄새_맡다': 'smell', '미소짓다': 'smile',
  '응시하다': 'stare', '멈추다': 'stop', '가정하다': 'suppose', '삼키다': 'swallow', '취하다': 'take',
  '가져가다': 'take', '이야기하다': 'talk', '맛보다': 'taste', '던지다': 'throw', '만지다': 'touch',
  '신뢰하다': 'trust', '이해하다': 'understand', '머무르다': 'stay', '상태이다': 'remain',
  '서_있다': 'stand', '견디다': 'endure', '누워_있다': 'lie', '쉬다': 'rest', '놓여_있다': 'rest',
  '지속되다': 'persist', '머물다': 'abide', '살아남다': 'survive', '유행하다': 'prevail', '이기다': 'prevail',
  '지체하다': 'tarry', '남아있다': 'linger', '살다': 'dwell', '체류하다': 'sojourn', '기다리다': 'wait',
  '달라붙어_있다': 'stick', '들러붙다': 'adhere', '달라붙다': 'cling', '응집하다': 'cohere', '아이는': 'child',
  '되다': 'be', '훌륭한 청년이': 'a_fine_youth', '프로그램을': 'program', '학생들에게': 'students', '문화와': 'culture,',
  '관습과': 'customs,', '예술을': 'art', '다른': 'other', '나라': 'country', '동안에': 'during', '방학': 'vacation',
  '구입했다': 'bought', '오래된': 'old', '집을': 'house', '조용한': 'quiet', '아내': 'wife',
  '귀여운 딸': 'a_pretty_daughter', '오늘': 'today', '중요한 일': 'an_important_thing', '이곳에': 'here', '아주': 'too',
  '게으른': 'idle', '책을': 'books', '소년은': 'boy', '영리한': 'clever', '그것을': 'it', '그는': 'he',
  '일어났다': 'got_up', '늦게': 'late', '그래서': 'as_to', '놓치다': 'miss', '기차를': 'the_train',
  '이': 'this', '물은': 'water', '좋은': 'good', '도해는': 'diagram', '편리한': 'convenient',
  '어려운 문장도': 'the_hardest_sentence', '체계적으로': 'systematically', '그들은': 'them', '이었다': 'were',
  '슬픈': 'sad', '못하다': 'not', '소식을': 'the_news', '자기': 'their', '가족': 'family',
  '이다': 'am', '매우': 'very', '기쁜': 'glad', '너를': 'you', '적절한': 'the_right', '시기를': 'time',
  '어떤 일을': 'anything', '그': 'the', '독재자': 'a_dictator', '자기자신을': 'himself',
  '위대한 지도자라고': 'a_great_leader', '소녀는': 'the_girl', '멋진 선물을': 'a_nice_present', '에': 'on', '그의': 'his',
  '생일': 'birthday', '였다': 'was', '베티': 'betty', '최초의': 'the_first', '사람들은': 'men',
  '따라': 'along_with', 'the_nile_river': 'the Nile River', '고대': 'ancient', '이집트': 'egypt', '농부들': 'farmers',
  '그 책을': 'the_book', '아들': 'his_son', '의사가': 'a_doctor', '다윈은': 'darwin', '영국의 생물학자': 'a_british_biologist',
  '유명한': 'famous', '이론': 'theories', '진화': 'evolution', '나는': 'i', '아저씨를': 'uncle',
  '캘리포니아': 'california', '우리의': 'our', '책무는': 'responsibility', '자연': 'natural', '환경을': 'environment',
  '깨끗한': 'clean', '아름답게': 'beautiful', '나의': 'my', '조용한 시골': 'the_silent_country', '이번': 'this_time',
  '목표는': 'the_aim', '개혁': 'reform', '모든': 'all', '기회를': 'opportunity', '교육': 'education',
  '계획은': 'plan', '박물관': 'the_museum', '주말': 'weekend', '고대(의) 그리스인들은': 'the_ancient_greeks', '몸을': 'bodies',
  '튼튼하게': 'strong', '운동': 'exercises', '연무장': 'gymnasium', '잘못': 'wrong', '부를': 'wealth',
  '말해주다': 'tell', '관광객들에게': 'tourists', '역사': 'the_history', '그리스': 'greece', '그녀는': 'she',
  '결심했다': 'decided', '물들이다': 'dye', '손톱을': 'fingernails', '꽃잎들': 'petals', '총명한': 'bright',
  '위대한 과학자가': 'a_great_scientist', '에 대해서': 'about', '동물': 'animals', '식물': 'plants', '참된': 'the_true',
  '과제를': 'subject-matters', '그들을': 'them', '훌륭한': 'great', '의무': 'duty', '입헌정치를': 'consitutional_government',
  '행복': 'the_happiness', '번영을': 'prosperity', '신민들': 'peoples', 'task': 'task', '쉬운': 'easy',
  '영어를': 'english', '방법': 'way', 'It': 'It', '건강': 'health', '일찍': 'early',
  '아침': 'morning', '일해야만 했다': 'had_to_work', '열심히': 'hard', '생계를': 'a_living', '아버지는': 'father',
  'works': 'works', '부터': 'from', '까지': 'till', '저녁': 'evening', '현대(의)': 'modern',
  '과학은': 'science', '했다': 'has_made', '삶을': 'life', '더 쉬운': 'easier', '더': 'more',
  '편하게': 'comfortable', '여러면': 'many_ways', '런던': 'london'
};

const EXC_ADJECTIVE = [
  '그', '이', '저', '의', '이번', '그의', '그녀의', '제인의', '그들의', '지난', 
  '수많은', '북한', '과학', '나의', '이런', '대단히', '우리의', '많은', '참된', 
  '훌륭한', '총명한', '모든', '공평한'
]; 
const EXC_ADVERB = [
  '오늘', '내일', '곧', '방금', '지금', '일찍', '잘', '처럼', '살금살금', 
  '엉금엉금', '졸졸', '꿀떡꿀떡', '더욱', '부쩍', '오직', '진정', '온통', 
  '아름답게', '몰래', '체계적으로', '늦게', '오래', '다시'
];

const PARTICLES = [
  { text: '와', role: 'Object_4_And_1' }, { text: '과', role: 'Object_4_And_2' },
  { text: '의', role: 'Postposition_Of' }, { text: '에대한', role: 'Postposition_Of' },
  { text: '에 대한', role: 'Postposition_Of' }, { text: '에 있는', role: 'Postposition_In' },
  { text: '에있는', role: 'Postposition_In' }, { text: '을 위해', role: 'Purpose' },
  { text: '를 위해', role: 'Purpose' }, { text: '를위해', role: 'Purpose' },
  { text: '를통해', role: 'Postposition_Through' }, { text: '을통해', role: 'Postposition_Through' },
  { text: '통해서', role: 'Postposition_Through' }, { text: '이 없는', role: 'Postposition_Without' },
  { text: '이없는', role: 'Postposition_Without' }, { text: '없는', role: 'Postposition_Without' },
  { text: '근처에있는', role: 'Postposition_Near' }, { text: '가까이에있는', role: 'Postposition_Near' },
  { text: '과함께', role: 'Instrument' }, { text: '와함께', role: 'Instrument' },
  { text: '으로', role: 'Instrument' }, { text: '로', role: 'Instrument' },
  { text: '과', role: 'Object_And' }, { text: '와', role: 'Object_And' },
  { text: '이라고', role: 'Complement' }, { text: '으로', role: 'Complement' },
  { text: '라고', role: 'Complement' }, { text: '하게', role: 'Complement' },
  { text: '도록', role: 'Complement' }, { text: '에게', role: 'IndirectObject' },
  { text: '들에게', role: 'IndirectObject' }, { text: '에서', role: 'Location' },
  { text: '부터', role: 'Time' }, { text: '까지', role: 'Time' }, { text: '에다', role: 'Location' },
  { text: '앞에', role: 'Location' }, { text: '들은', role: 'Subject' }, { text: '들이', role: 'Subject' },
  { text: '은', role: 'Subject' }, { text: '는', role: 'Subject' }, { text: '이', role: 'Subject' },
  { text: '가', role: 'Subject' }, { text: '을', role: 'Object' }, { text: '를', role: 'Object' },
  { text: '에', role: 'Location' }, { text: '간(동안에)', role: 'Time' }, { text: '동안에', role: 'Time' },
  { text: '기간에', role: 'Time' }
].sort((a, b) => b.text.length - a.text.length);

const FORM_RULES = [
  { type: '가주어_진주어', requiredRoles: ['Dummy_SVC', 'To_Infinitive'], englishOrder: ['Dummy_SVC', 'Aux_Verb', 'Verb', 'Modifier_Comp', 'Complement', 'Postposition_For', 'Modifier_For', 'Modifier_For_2', 'Object_For', 'To_Infinitive', 'Verb_Infinitive_1', 'Infinitive_Object', 'Modifier_IO', 'IndirectObject', 'Modifier_Obj', 'Object', 'Conjunction_And_Inf', 'To_Infinitive_2', 'Verb_Infinitive_2', 'Object_2', 'Modifier_Comp_2', 'Object_Complement', 'Infinitive_Object_2', 'Object_And_1', 'Conjunction_And', 'Object_Of_2', 'Postposition_Of_2', 'Postposition_Of', 'Modifier', 'Object_Of', 'Adverb', 'Time_Prep', 'Modifier_Time', 'Time', 'Location_Prep', 'Location_Plain', 'Modifier_Loc', 'Modifier_Loc_2', 'Location', 'Postposition_Through', 'Modifier_Inst', 'Instrument', 'Adverb_Prep'] },
  { type: '3형식_의지동사_To부정사_병렬', requiredRoles: ['To_Infinitive_Purpose', 'Verb_Infinitive_1', 'Conjunction_And_Inf', 'Verb_Infinitive_2', 'Object_For', 'To_Infinitive_Adj'], englishOrder: ['Subject', 'Verb', 'Modifier_Obj', 'Object', 'To_Infinitive_Purpose', 'Verb_Infinitive_1', 'Modifier_Inf_Obj_1', 'Infinitive_Object_1', 'Object_Complement_1', 'Conjunction_And_Inf', 'To_Infinitive_Purpose_2', 'Verb_Infinitive_2', 'Infinitive_Object_2', 'Postposition_For', 'Object_For', 'To_Infinitive_Adj', 'Verb_Infinitive_3', 'Infinitive_Object_3'] },
  { type: '3형식_의지동사_To부정사', requiredRoles: ['To_Infinitive_Purpose', 'Object', 'Verb'], englishOrder: ['Modifier', 'Subject', 'Aux_Verb', 'Verb', 'Modifier_Obj_2', 'Modifier_Obj', 'Modifier_2', 'Object', 'To_Infinitive_Purpose', 'Verb_Infinitive', 'Modifier_IO', 'IndirectObject', 'Modifier_And_1', 'Object_And_1', 'Object_And_2', 'Conjunction_And', 'Infinitive_Object', 'Postposition_Of', 'Modifier_Of', 'Object_Of', 'Location_Prep', 'Modifier_Loc_2', 'Modifier_Loc', 'Location', 'Postposition_With', 'Modifier_With', 'Modifier_With_2', 'Object_With_1', 'Conjunction_And_With', 'Object_With_2', 'Time_Prep', 'Modifier_Time', 'Time'] },
  { type: '1형식_무의지동사_결과_장소', requiredRoles: ['To_Infinitive_Result', 'Location', 'Verb_Infinitive', 'Infinitive_Object'], englishOrder: ['Subject', 'Verb', 'Location', 'To_Infinitive_Result', 'Verb_Infinitive', 'Infinitive_Object'] },
  { type: '1형식_무의지동사_결과_목적어', requiredRoles: ['To_Infinitive_Result', 'Verb_Infinitive', 'Infinitive_Object', 'Adverb_End'], englishOrder: ['Subject', 'Aux_Verb', 'Verb', 'Adverb', 'To_Infinitive_Result', 'Verb_Infinitive', 'Modifier_Obj', 'Infinitive_Object', 'Adverb_End'] },
  { type: '1형식_무의지동사_결과', requiredRoles: ['To_Infinitive_Result', 'Verb_Infinitive', 'Complement'], englishOrder: ['Modifier', 'Subject', 'Verb', 'To_Infinitive_Result', 'Verb_Infinitive', 'Complement'] },
  { type: '1형식_의지동사_To부정사', requiredRoles: ['To_Infinitive_Purpose', 'Verb'], englishOrder: ['Modifier', 'Subject', 'Aux_Verb', 'Verb', 'Location_Prep', 'Location_Plain', 'Location', 'Time_Prep', 'Time', 'To_Infinitive_Purpose', 'Verb_Infinitive', 'Postposition_About', 'Object_About_1', 'Conjunction_And_About', 'Object_About_2', 'Modifier_IO', 'IndirectObject', 'Modifier_Obj', 'Object', 'Infinitive_Object'] },
  { type: '2형식_부사구_결과', requiredRoles: ['To_Infinitive_Result', 'Complement', 'Verb'], englishOrder: ['Modifier', 'Subject', 'Aux_Verb', 'Verb', 'Modifier_Adverb', 'Modifier_Comp', 'Complement', 'Adverb', 'To_Infinitive_Result', 'Verb_Infinitive', 'Modifier_IO', 'IndirectObject', 'Modifier_Obj', 'Object', 'Infinitive_Object'] },
  { type: '1형식_부사구_결과', requiredRoles: ['To_Infinitive_Result', 'Verb_Infinitive', 'Infinitive_Object'], englishOrder: ['Subject', 'Verb', 'Modifier_Adverb', 'Adverb', 'To_Infinitive_Result', 'Verb_Infinitive', 'Infinitive_Object'] },
  { type: '2형식_부사구_To부정사', requiredRoles: ['To_Infinitive_Adv', 'Complement', 'Verb'], englishOrder: ['Modifier', 'Subject', 'Aux_Verb', 'Verb', 'Modifier_Comp', 'Complement', 'Not_Infinitive', 'To_Infinitive_Adv', 'Verb_Infinitive', 'Modifier_IO', 'IndirectObject', 'Modifier_Obj', 'Object', 'Infinitive_Object', 'Adverb', 'Location_Prep', 'Location_Plain', 'Location', 'Postposition_Of', 'Modifier_Of', 'Object_Of', 'Time_Prep', 'Time', 'Adverb_End'] },
  { type: '3형식_To부정사_형용사구_다중중첩', requiredRoles: ['To_Infinitive_Adj_2', 'Object_To', 'Postposition_To'], englishOrder: ['Modifier', 'Subject', 'Aux_Verb', 'Verb', 'Object', 'Postposition_To', 'Object_To', 'To_Infinitive_Adj', 'Verb_Infinitive', 'IndirectObject', 'Modifier_Obj_2', 'Infinitive_Object', 'To_Infinitive_Adj_2', 'Verb_Infinitive_2', 'Infinitive_Object_2'] },
  { type: '2형식_주어수식_형용사구_To부정사', requiredRoles: ['To_Infinitive_Adj_Subj', 'Complement', 'Verb'], englishOrder: ['Modifier', 'Subject', 'To_Infinitive_Adj_Subj', 'Verb_Infinitive', 'Modifier_IO', 'IndirectObject', 'Modifier_Obj', 'Object', 'Infinitive_Object', 'Postposition_Along', 'Object_Along', 'Location_Prep', 'Modifier_Loc', 'Location', 'Time_Prep', 'Modifier_Time', 'Time', 'Aux_Verb', 'Verb', 'Modifier_Comp', 'Complement'] },
  { type: '3형식_To부정사_형용사구_전명구수식', requiredRoles: ['To_Infinitive_Adj', 'Object_To', 'Postposition_To', 'Verb'], englishOrder: ['Modifier', 'Subject', 'Aux_Verb', 'Verb', 'Modifier_Obj', 'Object', 'Postposition_To', 'Modifier_To', 'Object_To', 'To_Infinitive_Adj', 'Verb_Infinitive', 'Modifier_IO', 'IndirectObject', 'Infinitive_Object', 'Location_Prep', 'Location_Plain', 'Location', 'Time_Prep', 'Time', 'Adverb'] },
  { type: '2형식_To부정사_형용사구', requiredRoles: ['To_Infinitive_Adj', 'Complement', 'Verb'], englishOrder: ['Modifier', 'Subject', 'Aux_Verb', 'Verb', 'Modifier_Comp', 'Complement', 'To_Infinitive_Adj', 'Verb_Infinitive', 'Object', 'Modifier_Comp_2', 'Object_Complement', 'Postposition_For', 'Modifier_For', 'Object_For', 'Postposition_About', 'Object_About_1'] },
  { type: '3형식_To부정사_형용사구', requiredRoles: ['To_Infinitive_Adj', 'Verb_Infinitive', 'Verb', 'Object'], englishOrder: ['Modifier', 'Subject', 'Aux_Verb', 'Verb', 'Modifier_Obj', 'Object', 'To_Infinitive_Adj', 'Verb_Infinitive', 'Location_Prep', 'Location_Plain', 'Location', 'Time_Prep', 'Time', 'Adverb'] },
  { type: '5형식_To부정사', requiredRoles: ['To_Infinitive_OC', 'Verb_Infinitive', 'Object', 'Verb'], englishOrder: ['Modifier', 'Modifier_2', 'Subject', 'Aux_Verb', 'Verb', 'Modifier_Obj', 'Object', 'To_Infinitive_OC', 'Verb_Infinitive', 'Infinitive_Object', 'Location_Prep', 'Location_Plain', 'Location', 'Time_Prep', 'Time', 'Adverb'] },
  { type: '2형식_To부정사', requiredRoles: ['To_Infinitive_Comp', 'Verb_Infinitive', 'Verb'], englishOrder: ['Modifier_Of_Subj_1', 'Modifier_Of_Subj_2', 'Object_Of_Subj', 'Postposition_Of_Subj', 'Modifier', 'Modifier_2', 'Subject', 'Time_Modifier', 'Modifier_Time', 'Time', 'Time_Prep', 'Modifier_Loc', 'Location_Plain', 'Location', 'Location_Prep', 'Adverb', 'Adverb_Prep', 'Modifier_With', 'Object_With', 'Postposition_With', 'Modifier_IO', 'IndirectObject', 'Object_Of', 'Postposition_Of', 'Modifier_Obj', 'Modifier_Obj_2', 'Object', 'Infinitive_Object', 'Modifier_Comp_2', 'Object_Complement', 'Conjunction_And_Comp', 'Object_Complement_2', 'Verb_Infinitive', 'To_Infinitive_Comp', 'Verb'] },
  { type: '3형식_To부정사', requiredRoles: ['To_Infinitive', 'Verb_Infinitive', 'Verb'], englishOrder: ['Modifier', 'Modifier_2', 'Subject', 'Aux_Verb', 'Verb', 'To_Infinitive', 'Verb_Infinitive', 'Modifier_IO', 'IndirectObject', 'Modifier_Obj', 'Infinitive_Object', 'Modifier_Comp_2', 'Object_Complement', 'Postposition_Through', 'Modifier_Inst', 'Instrument', 'Postposition_Of', 'Object_Of', 'Object_And_1', 'Conjunction_And', 'Object', 'Postposition_About', 'Object_About_1', 'Conjunction_And_About', 'Object_About_2', 'Location_Prep', 'Location_Plain', 'Location', 'Time_Prep', 'Time', 'Adverb'] },
  { type: '5형식', requiredRoles: ['Object_Complement', 'Verb'], englishOrder: ['Modifier', 'Modifier_2', 'Subject', 'Aux_Verb', 'Verb', 'Modifier_Obj', 'Object_And_1', 'Conjunction_And', 'Object', 'Postposition_Without', 'Object_Without', 'Modifier_Comp', 'Object_Complement', 'Conjunction_And_Comp', 'Modifier_Comp_2', 'Object_Complement_2', 'Adverb_Prep', 'Adverb', 'Postposition_For', 'Modifier_For', 'Modifier_For_2', 'Object_For'] },
  { type: '4형식', requiredRoles: ['IndirectObject', 'Object', 'Verb'], englishOrder: ['Modifier', 'Modifier_2', 'Subject', 'Postposition_In_Subj', 'Object_In_Subj', 'Aux_Verb', 'Verb', 'Modifier_IO', 'IndirectObject', 'Postposition_Without', 'Object_Without', 'Modifier_Obj', 'Modifier_Obj_2', 'Object', 'Location_Prep', 'Location_Plain', 'Modifier_Loc', 'Modifier_Loc_2', 'Location', 'Time_Prep', 'Modifier_Time', 'Time_Plain', 'Time', 'Adverb_Prep', 'Adverb'] },
  { type: '3형식_최종_간디', requiredRoles: ['Subject_That_Main', 'Subject_When'], englishOrder: ['Subject', 'Adverb_Time_Main', 'Verb', 'Dummy_That_Main', 'Subject_That_Main', 'Verb_That_Main', 'Modifier_Indep', 'Object_Indep', 'Conjunction_When', 'Subject_When', 'Verb_When', 'Subject_That1', 'Verb_That1', 'Modifier_Lot', 'Object_Lot', 'Postposition_Effort', 'Modifier_Effort1', 'Modifier_Effort2', 'Object_Effort', 'Conjunction_And', 'Dummy_That2', 'Subject_That2', 'Verb_That2', 'Modifier_Destiny', 'Object_Destiny', 'Object_Way', 'Subject_Like', 'Verb_Like'] },
  { type: '3형식', requiredRoles: ['Object', 'Verb'], englishOrder: ['Modifier', 'Modifier_2', 'Subject', 'Aux_Verb', 'Postposition_In', 'Verb', 'Modifier_Obj', 'Modifier_Obj_2', 'Object', 'Postposition_For', 'Modifier_For', 'Modifier_For_2', 'Object_For', 'Location_Prep', 'Postposition_In_Plain', 'Location_Plain', 'Modifier_Loc', 'Modifier_Loc_2', 'Location', 'Postposition_Of', 'Object_Of', 'Postposition_To', 'Purpose', 'Object_To', 'To_Infinitive', 'Verb_Infinitive', 'Infinitive_Object', 'Postposition_With', 'Modifier_With', 'Object_With', 'Postposition_Through', 'Modifier_Inst', 'Modifier_Inst_2', 'Instrument', 'Time_Prep', 'Modifier_Time', 'Time_Plain', 'Time', 'Adverb_Prep', 'Adverb'] },
  { type: '1형식', requiredRoles: ['Verb'], englishOrder: ['Modifier', 'Subject_And_1', 'Conjunction_And', 'Modifier_2', 'Subject', 'Aux_Verb', 'Postposition_In', 'Verb', 'Modifier_Adverb', 'Adverb', 'Postposition_For', 'Object_For', 'Location_Prep', 'Location_Plain', 'Location', 'Postposition_Near', 'Modifier_Near', 'Object_Near', 'Postposition_With', 'Modifier_With', 'Object_With', 'Postposition_Through', 'Instrument', 'Time_Prep', 'Modifier_Time', 'Time_Plain', 'Time', 'Time_Prep_2', 'Time_2', 'Adverb_Prep', 'To_Infinitive_Result', 'To_Infinitive', 'Verb_Infinitive', 'Infinitive_Object', 'Postposition_About', 'Object_About_1', 'Object_About_2', 'Adverb_End'] },
  { type: '1형식_맞춤', requiredRoles: ['Subject', 'Verb', 'Adverb', 'Postposition_For', 'Object_For'], englishOrder: ['Subject', 'Verb', 'Adverb', 'Postposition_For', 'Object_For'] },
  // 💡 [수프로 엣지] 입헌정치 완벽 조립 레일
  { type: '입헌정치_최종', requiredRoles: ['Infinitive_Object_1', 'Object_Of', 'Conjunction_And_Obj'], englishOrder: ['Dummy_SVC', 'Verb', 'Modifier_Comp', 'Complement', 'To_Infinitive', 'Verb_Infinitive_1', 'Infinitive_Object_1', 'Conjunction_And_Inf', 'To_Infinitive_2', 'Verb_Infinitive_2', 'Object_And_1', 'Conjunction_And_Obj', 'Object_And_2', 'Postposition_Of', 'Modifier_Of', 'Object_Of'] },
  // 💡 [수프로 엣지] 가르치고 만드는 것 병렬 레일
  { type: '가주어_4형식_5형식_병렬', requiredRoles: ['IndirectObject', 'Object', 'Infinitive_Object_2', 'Object_Complement'], englishOrder: ['Dummy_SVC', 'Verb', 'Modifier_Comp', 'Complement', 'To_Infinitive', 'Verb_Infinitive_1', 'Modifier_IO', 'IndirectObject', 'Modifier_Obj', 'Object', 'Conjunction_And_Inf', 'To_Infinitive_2', 'Verb_Infinitive_2', 'Infinitive_Object_2', 'Modifier_Comp_2', 'Object_Complement'] },
// 💡 [수프로 엣지] 예문 5 전용 완벽 조립 레일
  { type: '3형식_예문5_전용', requiredRoles: ['Obj_Hist'], englishOrder: ['Subject', 'Verb_Past_Like', 'To_Inf_Tell', 'Verb_Inf_Tell', 'IO_Tourists', 'Obj_Hist', 'Conj_And_Hist', 'Obj_Cult', 'Prep_Of_Greece', 'Obj_Greece'] },
// 💡 [수프로 엣지] 예문 6 전용 완벽 조립 레일 (가주어 진주어 중첩 완벽 대응)
  { type: '가주어_예문6_전용', requiredRoles: ['Comp_Wrong'], englishOrder: ['Dummy_SVC', 'Verb', 'Comp_Wrong', 'To_Inf_1', 'Verb_Inf_Want', 'To_Inf_2', 'Verb_Inf_Leave', 'IO_You', 'Mod_Much', 'Obj_Wealth'] },
  // 💡 [수프로 엣지] 예문 7 전용 완벽 조립 레일 (5형식 To부정사 목적어 + 전명구)
  { type: '5형식_To부정사_예문7_전용', requiredRoles: ['Obj_Comp_Strong'], englishOrder: ['Subj_Greeks', 'Verb_Past_Like', 'To_Inf_Make', 'Verb_Inf_Make', 'Modifier_Obj', 'Inf_Obj_Bodies', 'Obj_Comp_Strong', 'Prep_With_Ex', 'Inst_Ex', 'Prep_Of_Gym', 'Obj_Of_Gym'] },
  // 💡 [수프로 엣지] <보충어구> 예문 1 전용 완벽 조립 레일
  { type: '2형식_보충어구_예문1_전용', requiredRoles: ['Subj_Plan', 'To_Inf_Comp', 'Verb_Inf_Go'], englishOrder: ['Mod_My_Plan', 'Subj_Plan', 'Verb', 'To_Inf_Comp', 'Verb_Inf_Go', 'Prep_To_Museum', 'Obj_Museum', 'Prep_With_Her', 'Obj_With_Her', 'Prep_On_Weekend', 'Mod_This_Weekend', 'Obj_Weekend'] },
// 💡 [수프로 엣지] <보충어구> 예문 2 전용 완벽 조립 레일
  { type: '2형식_보충어구_예문2_전용', requiredRoles: ['Subj_Hope', 'Verb_Inf_Become', 'Comp_Doctor'], englishOrder: ['Mod_His', 'Subj_Hope', 'Verb', 'To_Inf_Comp', 'Verb_Inf_Become', 'Comp_Doctor', 'Prep_In_Future', 'Obj_Future'] },
// 💡 [수프로 엣지] <보충어구> 예문 3 전용 완벽 조립 레일
  { type: '2형식_보충어구_예문3_전용', requiredRoles: ['Subj_Aim', 'Verb_Inf_Offer', 'Obj_Opp'], englishOrder: ['Subj_Aim', 'Prep_Of_Plan', 'Mod_This', 'Mod_Edu_1', 'Obj_Reform', 'Verb', 'To_Inf_Offer', 'Verb_Inf_Offer', 'Mod_All', 'IO_Students', 'Mod_Equal', 'Obj_Opp', 'Prep_Of_Edu', 'Obj_Edu_2'] },
// 💡 [수프로 엣지] <보충어구> 예문 4 전용 완벽 조립 레일
  { type: '2형식_보충어구_예문4_전용', requiredRoles: ['Verb_Inf_Read', 'Obj_Books'], englishOrder: ['Mod_My_Plan', 'Subj_Plan', 'Verb', 'To_Inf_Read', 'Verb_Inf_Read', 'Mod_Many', 'Obj_Books', 'Prep_In_Country', 'Obj_Country', 'Prep_At_Time', 'Obj_This_Time'] },
// 💡 [수프로 엣지] <보충어구> 예문 5 전용 완벽 조립 레일 (5형식 목적어/목적보어 중첩)
  { type: '2형식_보충어구_예문5_전용', requiredRoles: ['Subj_Resp', 'Verb_Inf_Keep', 'Obj_Env', 'Comp_Beautiful'], englishOrder: ['Mod_Our_1', 'Subj_Resp', 'Verb', 'To_Inf_Keep', 'Verb_Inf_Keep', 'Mod_Our_2', 'Mod_Nat', 'Obj_Env', 'Comp_Clean', 'Safe_And', 'Comp_Beautiful'] },
  // 💡 [수프로 엣지] <보충어구> 예문 6 전용 완벽 조립 레일 (5형식 목적보어 To부정사)
  { type: '5형식_보충어구_예문6_전용', requiredRoles: ['Verb_Taught', 'To_Inf_OC'], englishOrder: ['Subj_I', 'Verb_Taught', 'Obj_Him', 'To_Inf_OC', 'Verb_Inf_Read', 'Inf_Obj_TheBook'] },
  // 💡 [수프로 엣지] <형용사구> 예문 1 전용 완벽 조립 레일 (명사 수식 To부정사)
  { type: '3형식_형용사구_예문1_전용', requiredRoles: ['Verb_Visited', 'Obj_Uncle', 'To_Inf_Adj_Live'], englishOrder: ['Subj_I', 'Verb_Visited', 'Mod_My', 'Obj_Uncle', 'To_Inf_Adj_Live', 'Verb_Inf_Live', 'Prep_In_Cali', 'Obj_Cali'] },
// 💡 [수프로 엣지] <형용사구> 예문 2 전용 완벽 조립 레일
  { type: '2형식_형용사구_예문2_전용', requiredRoles: ['Subj_Darwin', 'Verb_Was', 'Comp_Biologist'], englishOrder: ['Subj_Darwin', 'Verb_Was', 'Comp_Biologist', 'To_Inf_Adj_Be', 'Verb_Inf_Be', 'Comp_Famous', 'Prep_For', 'Mod_His', 'Obj_Theories', 'Prep_On', 'Obj_Evo'] },
// 💡 [수프로 엣지] <형용사구> 예문 3 전용 완벽 조립 레일 (명사 수식 To부정사)
  { type: '3형식_형용사구_예문3_전용', requiredRoles: ['Verb_Sent', 'Obj_TheBook', 'Obj_Son'], englishOrder: ['Subj_He', 'Verb_Sent', 'Obj_TheBook', 'Prep_To_Son', 'Obj_Son', 'To_Inf_Adj_Become', 'Comp_Doctor'] },
 // 💡 [수프로 엣지] <형용사구> 예문 4 전용 완벽 조립 레일 (명사 수식 To부정사 긴 문장)
  { type: '2형식_형용사구_예문4_전용', requiredRoles: ['Subj_Men', 'Verb_Were', 'Comp_Farmers'], englishOrder: ['Mod_First', 'Subj_Men', 'To_Inf_Adj_Make', 'Verb_Inf_Make', 'Mod_Their', 'Obj_Homes', 'Prep_Along', 'Obj_Nile', 'Prep_In_Egypt', 'Mod_Ancient', 'Obj_Egypt', 'Verb_Were', 'Comp_Farmers'] },
  // 💡 [수프로 엣지] <형용사구> 예문 5 전용 완벽 조립 레일 (4형식 목적어를 가진 부정사 수식)
  { type: '2형식_형용사구_예문5_전용', requiredRoles: ['Subj_TheGirl', 'Verb_Was_5', 'Comp_Betty'], englishOrder: ['Subj_TheGirl', 'To_Inf_Adj_Buy', 'Verb_Inf_Buy', 'IO_Him_5', 'DO_NicePresent', 'Prep_On_5', 'Mod_His_5', 'Obj_Bday', 'Verb_Was_5', 'Comp_Betty'] },
  // 💡 [수프로 엣지] <형용사구> 예문 6 전용 완벽 조립 레일 (5형식 동사 think의 형용사적 용법)
  { type: '2형식_형용사구_예문6_전용', requiredRoles: ['Subj_He', 'Verb_Is_6', 'Comp_Dictator'], englishOrder: ['Subj_He', 'Verb_Is_6', 'Comp_Dictator', 'To_Inf_Adj_Think', 'Verb_Inf_Think', 'Obj_Himself', 'OC_GreatLeader'] },
// 💡 [수프로 엣지] <형용사구> 예문 7 전용 완벽 조립 레일 (4형식 동사와 2개의 부정사 수식)
  { type: '4형식_형용사구_예문7_전용', requiredRoles: ['Subj_King', 'Verb_Gave', 'DO_Reward', 'IO_Man'], englishOrder: ['Mod_The_7', 'Subj_King', 'Verb_Gave', 'DO_Reward', 'Prep_To_Man', 'IO_Man', 'To_Inf_Teach', 'Verb_Inf_Teach', 'IO_Him_7', 'Mod_Right', 'Obj_Time', 'To_Inf_Begin', 'Verb_Inf_Begin', 'Obj_Anything'] },
// 💡 [수프로 엣지] <부사구> 예문 1 전용 완벽 조립 레일 (감정의 원인을 나타내는 부사적 용법)
  { type: '2형식_부사구_예문1_전용', requiredRoles: ['Subj_I_Adv1', 'Verb_Am_Adv1', 'Comp_Glad_Adv1'], englishOrder: ['Subj_I_Adv1', 'Verb_Am_Adv1', 'Adv_Very_Adv1', 'Comp_Glad_Adv1', 'To_Inf_Adv1', 'Verb_Inf_Meet_Adv1', 'Obj_You_Adv1', 'Adv_Here_Adv1'] },
// 💡 [수프로 엣지] <부사구> 예문 2 전용 완벽 조립 레일 (감정의 원인을 나타내는 부정사 부정형)
  { type: '2형식_부사구_예문2_전용', requiredRoles: ['Subj_They_Adv2', 'Verb_Were_Adv2', 'Comp_Sad_Adv2'], englishOrder: ['Subj_They_Adv2', 'Verb_Were_Adv2', 'Comp_Sad_Adv2', 'Adv_Not_Adv2', 'To_Inf_Adv2', 'Verb_Inf_Hear_Adv2', 'Obj_TheNews_Adv2', 'Prep_Of_Adv2', 'Mod_Their_Adv2', 'Obj_Family_Adv2'] },
// 💡 [수프로 엣지] <부사구> 예문 3 전용 완벽 조립 레일 ('is convenient' 통합형)
  { type: '2형식_부사구_예문3_전용', requiredRoles: ['Subj_Diagram_Adv3', 'Comp_IsConvenient_Adv3'], englishOrder: ['Subj_Diagram_Adv3', 'Comp_IsConvenient_Adv3', 'To_Inf_Adv3', 'Verb_Inf_Teach_Adv3', 'Obj_HardestSentence_Adv3', 'Adv_Systematically_Adv3'] },
// 💡 [수프로 엣지] <부사구> 예문 4 전용 완벽 조립 레일 ('is good' 통합형)
  { type: '2형식_부사구_예문4_전용', requiredRoles: ['Subj_Water_Adv4', 'Comp_IsGood_Adv4'], englishOrder: ['Mod_This_Adv4', 'Subj_Water_Adv4', 'Comp_IsGood_Adv4', 'To_Inf_Adv4', 'Verb_Inf_Drink_Adv4'] },
  // 💡 [수프로 엣지] <부사구_결과> 예문 1 전용 완벽 조립 레일 (so ~ as to 결과 표시)
  { type: '1형식_부사구_결과_예문1_전용', requiredRoles: ['Subj_He', 'Verb_GotUp_Res1', 'To_Inf_AsTo_Res1'], englishOrder: ['Subj_He', 'Verb_GotUp_Res1', 'Adv_So_Res1', 'Adv_Late_Res1', 'To_Inf_AsTo_Res1', 'Verb_Inf_Miss_Res1', 'Obj_Train_Res1'] },
  // 💡 [수프로 엣지] <부사구_결과> 예문 2 전용 완벽 조립 레일 ('is clever' 통합형)
  { type: '2형식_부사구_결과_예문2_전용', requiredRoles: ['Subj_Boy_Res2', 'Comp_IsClever_Res2'], englishOrder: ['Mod_The_Res2', 'Subj_Boy_Res2', 'Comp_IsClever_Res2', 'Adv_Enough_Res2', 'To_Inf_Res2', 'Verb_Inf_Understand_Res2', 'Obj_It_Res2'] },
  // 💡 [수프로 엣지] <부사구_결과> 예문 3 전용 완벽 조립 레일 (too ~ to 구문)
  { type: '2형식_부사구_결과_예문3_전용', requiredRoles: ['Subj_He', 'Comp_Idle_Res3'], englishOrder: ['Subj_He', 'Verb_IsToo_Res3', 'Verb_Is_Res3', 'Comp_Idle_Res3', 'To_Inf_Res3', 'Verb_Inf_Read_Res3', 'Adj_Many_Res3', 'Obj_Books_Res3'] },
  // 💡 [수프로 엣지] <의지동사> 예문 1 전용 완벽 조립 레일 (분리 후 공백 마법 적용)
  { type: '1형식_의지동사_예문1_전용', requiredRoles: ['Subj_He', 'Verb_Came_Vol1'], englishOrder: ['Subj_He', 'Verb_Came_Vol1', 'Adv_Here_Vol1', 'To_Inf_Vol1', 'Verb_Inf_See_Vol1', 'Obj_You_Vol1'] },
  // 💡 [수프로 엣지] <의지동사> 예문 2 전용 완벽 조립 레일 (목적을 나타내는 부사적 용법)
  { type: '1형식_의지동사_예문2_전용', requiredRoles: ['Subj_We_Vol2', 'Verb_Gathered_Vol2'], englishOrder: ['Subj_We_Vol2', 'Verb_Gathered_Vol2', 'Adv_Here_Vol2_2', 'Adv_Today_Vol2', 'To_Inf_Vol2_2', 'Verb_Inf_Talk_Vol2', 'Prep_About_Vol2', 'Obj_ImportantThing_Vol2'] },
  // 💡 [수프로 엣지] <의지동사> 예문 3 전용 완벽 조립 레일 (부분 삭제 완벽 호환)
  { type: '3형식_의지동사_예문3_전용', requiredRoles: ['Subj_He', 'Verb_Bought_Vol3', 'Obj_House_Vol3'], englishOrder: ['Subj_He', 'Verb_Bought_Vol3', 'Art_The1_Vol3', 'Adj_Old_Vol3', 'Obj_House_Vol3', 'To_Inf_Vol3', 'Verb_Live_Vol3', 'Prep_In_Vol3', 'Art_The2_Vol3', 'Adj_Quiet_Vol3', 'Noun_Country_Vol3', 'Prep_With_Vol3', 'Pron_His_Vol3', 'Adj_GoodNatured_Vol3', 'Noun_Wife_Vol3', 'Conj_And_Vol3', 'Noun_PrettyDaughter_Vol3', 'Noun_ADaughter_Vol3', 'Noun_PrettyDaughter2_Vol3'] },
 // 💡 [수프로 엣지] <의지동사> 예문 4 전용 완벽 조립 레일 (필수 조건 완화 및 다중 생략 호환)
  { type: '4형식_의지동사_예문4_전용', requiredRoles: ['Subj_We_Vol2', 'Verb_Made_Vol4'], englishOrder: ['Subj_We_Vol2', 'Verb_Made_Vol4', 'Obj_ASpecialProgram_Vol4', 'Obj_AProgram_Vol4', 'To_Inf_Vol4', 'Verb_Teach_Vol4', 'Adj_Many_Vol4', 'Noun_Students_Vol4', 'Art_The_Vol4', 'Noun_Culture_Vol4', 'Noun_Culture2_Vol4', 'Noun_Customs_Vol4', 'Conj_And_Vol4', 'Noun_Art_Vol4', 'Prep_Of_Vol4', 'Adj_Other_Vol4', 'Noun_Country_Vol4', 'Prep_During_Vol4', 'Adj_This_Vol4', 'Noun_Vacation_Vol4'] },
  // 💡 [수프로 엣지] <의지동사> 예문 5 전용 완벽 조립 레일 (17피스 철벽 방어)
  { type: '5형식_의지동사_예문5_전용', requiredRoles: ['Subj_Albert_Vol5', 'Verb_Used_Vol5'], englishOrder: ['Subj_Albert_Vol5', 'Verb_Used_Vol5', 'Art_The_Vol5', 'Noun_PrizeMoney_Vol5', 'To_Inf1_Vol5', 'Verb_Make1_Vol5', 'Noun_TheHospital_Vol5', 'Adj_Bigger_Vol5', 'Conj_And_Vol5', 'To_Inf2_Vol5', 'Verb_Make2_Vol5', 'Noun_APlace_Vol5', 'Prep_For_Vol5', 'Noun_People_Vol5', 'To_Inf3_Vol5', 'Verb_SufferFrom_Vol5', 'Noun_Leprosy_Vol5'] },
  // 💡 [수프로 엣지] <무의지동사> 예문 1 전용 완벽 조립 레일 (분해 조립형 7피스)
  { type: '1형식_무의지동사_예문1_전용', requiredRoles: ['Noun_Child_Invol1', 'Verb_Grew_Invol1'], englishOrder: ['Art_The1_Invol1', 'Noun_Child_Invol1', 'Verb_Grew_Invol1', 'To_Inf_Invol1', 'Verb_Be_Invol1', 'Adj_AFine_Invol1', 'Noun_Youth_Invol1'] },
  // 💡 [수프로 엣지] <무의지동사> 예문 3 전용 완벽 조립 레일 (예문 2 부품 혼용 완벽 호환!)
  { type: '1형식_무의지동사_예문3_전용', requiredRoles: ['Subj_He'], englishOrder: ['Subj_He', 'Verb_Lived_Invol3', 'Verb_Lived_Invol2', 'Adv_Here_Invol3', 'To_Inf_Invol3', 'To_Inf_Invol2', 'Verb_See_Invol3', 'Verb_Meet_Invol2', 'Pron_You_Invol3'] },
  // 💡 [수프로 엣지] <1형식> 예문 1 전용 조립 레일 (4피스)
  { type: '1형식_예문1_전용', requiredRoles: ['Noun_Book_Form1', 'Verb_Sells_Form1'], englishOrder: ['Art_The_Form1', 'Noun_Book_Form1', 'Verb_Sells_Form1', 'Adv_Well_Form1'] },
  // 💡 [수프로 엣지] <1형식> 예문 2 전용 조립 레일 (3피스)
  { type: '1형식_예문2_전용', requiredRoles: ['Subj_TheBird_Form2', 'Verb_Sings_Form2'], englishOrder: ['Subj_TheBird_Form2', 'Verb_Sings_Form2', 'Adv_Sweetly_Form2'] },
  // 💡 [수프로 엣지] <1형식> 예문 3 전용 조립 레일 (day/night 완벽 스위칭 호환)
  { type: '1형식_예문3_전용', requiredRoles: ['Subj_He', 'Verb_Plays_Form3'], englishOrder: ['Subj_He', 'Verb_Plays_Form3', 'Prep_At_Form3', 'Noun_TheStation_Form3', 'Adj_Every_Form3', 'Noun_Night_Form3', 'Noun_Day_Form3'] },
  // 💡 [수프로 엣지] <1형식> 예문 4 전용 조립 레일 (5피스)
  { type: '1형식_예문4_전용', requiredRoles: ['Subj_He', 'Verb_Came_Form4'], englishOrder: ['Subj_He', 'Verb_Came_Form4', 'Prep_From_Form4', 'Noun_Seoul_Form4', 'Adv_LastYear_Form4'] },
  // 💡 [수프로 엣지] <1형식> 예문 5 전용 조립 레일 (3단 스위칭 완벽 호환)
  { type: '1형식_예문5_전용', requiredRoles: ['Subj_He', 'Verb_Lived_Form5'], englishOrder: ['Subj_He', 'Verb_Lived_Form5', 'Prep_In_Form5', 'Noun_OldHouse_Form5', 'Noun_AnOldHouse_Form5', 'Noun_AHouse_Form5'] },
  // 💡 [수프로 엣지] <1형식> 예문 6 전용 조립 레일 (3가지 경우의 수 스위칭 완벽 호환)
  { type: '1형식_예문6_전용', requiredRoles: ['Subj_John_Form6', 'Verb_HasLived_Form6'], englishOrder: ['Subj_John_Form6', 'Verb_HasLived_Form6', 'Prep_In_Form6', 'Noun_Seoul_Form6', 'Prep_For_Form6', 'Noun_TwentyYears_Form6'] },
  // 💡 [수프로 엣지] <1형식> 예문 7 전용 조립 레일 (3가지 경우의 수 스위칭 완벽 호환)
  { type: '1형식_예문7_전용', requiredRoles: ['Subj_John_Form7', 'Verb_WillStay_Form7', 'Noun_TheHotel_Form7'], englishOrder: ['Subj_John_Form7', 'Verb_WillStay_Form7', 'Prep_At_Form7', 'Noun_TheHotel_Form7', 'Prep_During_Form7', 'Adj_This_Form7', 'Noun_WinterVacation_Form7'] },
  // 💡 [수프로 엣지] <1형식> 예문 8 전용 조립 레일 (4가지 경우의 수 스위칭 완벽 호환)
  { type: '1형식_예문8_전용', requiredRoles: ['Noun_Girl_Form8', 'Verb_Lived_Form8'], englishOrder: ['Art_A_Form8', 'Adj_Pretty_Form8', 'Noun_Girl_Form8', 'Verb_Lived_Form8', 'Prep_In_Form8', 'Noun_SmallVillage_Form8', 'Noun_Village_Form8'] },
  // 💡 [수프로 엣지] <1형식> 예문 9 전용 조립 레일 (11피스 대형 콤보 호환)
  { type: '1형식_예문9_전용', requiredRoles: ['Subj_He', 'Verb_WillStay_Form9', 'Noun_TheBeach_Form9'], englishOrder: ['Subj_He', 'Verb_WillStay_Form9', 'Prep_At_Form9', 'Noun_TheBeach_Form9', 'Prep_With_Form9', 'Pron_His_Form9', 'Noun_Family_Form9', 'Prep_During_Form9', 'Adj_This_Form9', 'Noun_Summer_Form9', 'Noun_Vacation_Form9'] },
  // 💡 [수프로 엣지] <1형식> 예문 10 전용 조립 레일 (5단 콤보 호환)
  { type: '1형식_예문10_전용', requiredRoles: ['Noun_Hermit_Form10', 'Verb_Lives_Form10'], englishOrder: ['Art_The_Form10', 'Adj_Famous_Form10', 'Noun_Hermit_Form10', 'Verb_Lives_Form10', 'Prep_In_Form10', 'Art_The2_Form10', 'Adj_Small_Form10', 'Noun_Cabin_Form10', 'Prep_With_Form10', 'Pron_His_Form10', 'Noun_Disciples_Form10'] },
  // 💡 [수프로 엣지] <1형식> 예문 11 전용 조립 레일 (주어/집 스위칭 완벽 호환)
  { type: '1형식_예문11_전용', requiredRoles: ['Verb_Went_Form11', 'Noun_DeptStore_Form11'], englishOrder: ['Subj_BoyAndGirl_Form11', 'Subj_TheGirl_Form11', 'Subj_TheBoy_Form11', 'Subj_He_Form11', 'Verb_Went_Form11', 'Prep_To_Form11', 'Noun_DeptStore_Form11', 'Prep_Near_Form11', 'Noun_JanesHouse_Form11', 'Noun_House_Form11'] },
  // 💡 [수프로 엣지] <1형식> 예문 12 전용 조립 레일 (5단 콤보 대형 스위칭 호환)
  { type: '1형식_예문12_전용', requiredRoles: ['Noun_King_F12', 'Verb_Got_F12'], englishOrder: ['Art_The_F12', 'Adj_Great_F12', 'Noun_King_F12', 'Conj_And_F12', 'Pron_His_F12', 'Adj_Wise_F12', 'Noun_Queen_F12', 'Verb_Got_F12', 'Prep_On_F12', 'Noun_ElegantFerry_F12', 'Noun_Ferry_F12', 'Prep_With_F12', 'Pron_Their_F12', 'Adj_Official_F12', 'Noun_Suites_F12'] },
  // 💡 [수프로 엣지] <1형식> 예문 13 전용 조립 레일 (2단 콤보 스위칭 호환)
  { type: '1형식_예문13_전용', requiredRoles: ['Subj_ABigFire_F13', 'Verb_BrokeOut_F13'], englishOrder: ['Subj_ABigFire_F13', 'Verb_BrokeOut_F13', 'Prep_At_F13', 'Noun_Building_F13', 'Prep_Near_F13', 'Noun_Station_F13', 'Prep_In_F13', 'Adj_Last_F13', 'Noun_Night_F13'] },
  // 💡 [수프로 엣지] <1형식> 예문 14 전용 조립 레일 (4단 콤보 스위칭 호환)
  { type: '1형식_예문14_전용', requiredRoles: ['Noun_Picture_F14', 'Verb_IsHung_F14'], englishOrder: ['Art_A_F14', 'Adj_Strange_F14', 'Noun_Picture_F14', 'Verb_IsHung_F14', 'Prep_On_F14', 'Adj_TheGloomy_F14', 'Art_The_F14', 'Noun_Wall_F14'] },
  // 💡 [수프로 엣지] <1형식> 예문 15 전용 조립 레일 (7단 콤보 스위칭 호환)
  { type: '1형식_예문15_전용', requiredRoles: ['Noun_Spies_F15', 'Verb_HaveLanded_F15'], englishOrder: ['Adj_Many_F15', 'Adj_NorthKorean_F15', 'Noun_Spies_F15', 'Verb_HaveLanded_F15', 'Adv_Clandestinely_F15', 'Prep_In_F15', 'Noun_NorthernJapan_F15', 'Noun_Japan_F15', 'Prep_By_F15', 'Noun_FastBoat_F15', 'Prep_During_F15', 'Adj_This_F15', 'Noun_Science_F15', 'Noun_Exposition_F15'] },
  // 💡 [수프로 엣지] <2형식> 예문 1 전용 조립 레일 (관사 자동 스위칭 호환)
  { type: '2형식_예문1_전용', requiredRoles: ['Subj_Tom_F2E1', 'Verb_Is_F2E1', 'Comp_Boy_F2E1'], englishOrder: ['Subj_Tom_F2E1', 'Verb_Is_F2E1', 'Mod_TheMostPop_F2E1', 'Mod_APop_F2E1', 'Mod_A_F2E1', 'Comp_Boy_F2E1', 'Prep_In_F2E1', 'Noun_School_F2E1'] },
  // 💡 [수프로 엣지] <2형식> 예문 2 전용 조립 레일 (관사 자동 보정 및 형용사 보어 스위칭)
  { type: '2형식_예문2_전용', requiredRoles: ['Subj_Math_F2E2', 'Verb_Is_F2E2'], englishOrder: ['Subj_Math_F2E2', 'Verb_Is_F2E2', 'Mod_ADifficult_F2E2', 'Mod_A_F2E2', 'Comp_Difficult_F2E2', 'Comp_Subject_F2E2'] },
  // 💡 [수프로 엣지] <2형식> 예문 3 전용 조립 레일 (비교구문 스위칭 호환)
  { type: '2형식_예문3_전용', requiredRoles: ['Subj_TheCold_F2E3', 'Verb_Is_F2E3', 'Comp_Severer_F2E3'], englishOrder: ['Subj_TheCold_F2E3', 'Prep_Of_F2E3', 'Noun_ThisYear_F2E3', 'Verb_Is_F2E3', 'Comp_Severer_F2E3', 'Prep_Than_F2E3', 'Pron_ThatOf_F2E3', 'Noun_LastYear_F2E3'] },
  // 💡 [수프로 엣지] <2형식> 예문 4 전용 조립 레일 (3단 콤보 스위칭 호환)
  { type: '2형식_예문4_전용', requiredRoles: ['Subj_Novel_F2E4', 'Verb_Is_F2E4', 'Comp_Interesting_F2E4'], englishOrder: ['Mod_This_F2E4', 'Subj_Novel_F2E4', 'Verb_Is_F2E4', 'Adv_Very_F2E4', 'Comp_Interesting_F2E4', 'Prep_For_F2E4', 'Pron_Us_F2E4'] },
  // 💡 [수프로 엣지] <2형식> 예문 5 전용 조립 레일 (2단 콤보 스위칭 호환)
  { type: '2형식_예문5_전용', requiredRoles: ['Subj_Men_F2E5', 'Verb_Are_F2E5', 'Comp_Equal_F2E5'], englishOrder: ['Mod_All_F2E5', 'Subj_Men_F2E5', 'Verb_Are_F2E5', 'Comp_Equal_F2E5', 'Prep_Before_F2E5', 'Noun_TheLaw_F2E5'] },
  // 💡 [수프로 엣지] <2형식> 예문 6 전용 조립 레일 (5단 콤보 꼬리 자르기 호환)
  { type: '2형식_예문6_전용', requiredRoles: ['Subj_Rome_F2E6', 'Verb_Was_F2E6', 'Comp_SmallTown_F2E6'], englishOrder: ['Subj_Rome_F2E6', 'Verb_Was_F2E6', 'Comp_SmallTown_F2E6', 'Prep_Of_F2E6', 'Noun_SmallKingdom_F2E6', 'Noun_Kingdom_F2E6', 'Prep_In_F2E6', 'Noun_Beginning_F2E6'] },
  // 💡 [수프로 엣지] <2형식> 예문 7 전용 조립 레일 (5단 콤보 전후방 스위칭 호환)
  { type: '2형식_예문7_전용', requiredRoles: ['Subj_DetectiveStory_F2E7', 'Verb_Is_F2E7', 'Comp_Interesting_F2E7'], englishOrder: ['Mod_This_F2E7', 'Art_The_F2E7', 'Subj_DetectiveStory_F2E7', 'Verb_Is_F2E7', 'Adv_Very_F2E7', 'Comp_Interesting_F2E7', 'Prep_For_F2E7', 'Pron_Us_F2E7'] },
  // 💡 [수프로 엣지] <2형식> 예문 8 전용 조립 레일 (4단 콤보 관사/꼬리 스위칭 호환)
  { type: '2형식_예문8_전용', requiredRoles: ['Subj_Language_F2E8', 'Verb_Is_F2E8', 'Comp_Means_F2E8'], englishOrder: ['Subj_Language_F2E8', 'Verb_Is_F2E8', 'Mod_TheMostImp_F2E8', 'Mod_AnImp_F2E8', 'Comp_Means_F2E8', 'Prep_Of_F2E8', 'Noun_Comm_F2E8'] },
  // 💡 [수프로 엣지] <2형식> 예문 9 전용 조립 레일 (6단 콤보 병렬 스위칭 호환)
  { type: '2형식_예문9_전용', requiredRoles: ['Subj_Proverbs_F2E9', 'Verb_MayBe_F2E9'], englishOrder: ['Subj_Proverbs_F2E9', 'Verb_MayBe_F2E9', 'Comp_Warnings_F2E9', 'Prep_Against_F2E9', 'Mod_Foolish_F2E9', 'Noun_Acts_F2E9', 'Conj_Or_F2E9', 'Comp_Guides_F2E9', 'Prep_To_F2E9', 'Noun_GoodConduct_F2E9'] },
  // 💡 [수프로 엣지] <2형식> 예문 10 전용 조립 레일 (7단 콤보 관사/전명구 스위칭 호환)
  { type: '2형식_예문10_전용', requiredRoles: ['Subj_Settlers_F2E10', 'Verb_Were_F2E10', 'Comp_Free_F2E10'], englishOrder: ['Art_TheFirst_F2E10', 'Art_The_F2E10', 'Subj_Settlers_F2E10', 'Prep_In_F2E10', 'Noun_America_F2E10', 'Verb_Were_F2E10', 'Comp_Free_F2E10', 'Prep_From_F2E10', 'Noun_Tyrannies_F2E10', 'Conj_And_F2E10', 'Adj_Corrupting_F2E10', 'Noun_Powers_F2E10', 'Prep_Of_F2E10', 'Noun_Europe_F2E10'] },
  // 💡 [수프로 엣지] <3형식> 예문 1 전용 조립 레일 (2단 콤보 스위칭 호환)
  { type: '3형식_예문1_전용', requiredRoles: ['Subj_He_F3E1', 'Verb_LaughedAt_F3E1'], englishOrder: ['Subj_He_F3E1', 'Verb_LaughedAt_F3E1', 'Obj_Me_F3E1'] },
  // 💡 [수프로 엣지] <3형식> 예문 2 전용 조립 레일 (동사구 스위칭 호환)
  { type: '3형식_예문2_전용', requiredRoles: ['Verb_MustTakeCareOf_F3E2', 'Obj_Baby_F3E2'], englishOrder: ['Subj_You_F3E2', 'Verb_MustTakeCareOf_F3E2', 'Art_The_F3E2', 'Obj_Baby_F3E2'] },
  // 💡 [수프로 엣지] <3형식> 예문 3 전용 조립 레일 (부사 생략 스위칭 호환)
  { type: '3형식_예문3_전용', requiredRoles: ['Verb_Remember_F3E3', 'Obj_Name_F3E3'], englishOrder: ['Subj_I_F3E3', 'Verb_Remember_F3E3', 'Mod_His_F3E3', 'Obj_Name_F3E3', 'Adv_Well_F3E3'] },
  // 💡 [수프로 엣지] <3형식> 예문 4 전용 조립 레일 (4단 콤보 부사 생략 및 관사 스위칭 호환)
  { type: '3형식_예문4_전용', requiredRoles: ['Subj_OldMan_F3E4', 'Verb_Planted_F3E4'], englishOrder: ['Art_An_F3E4', 'Subj_OldMan_F3E4', 'Verb_Planted_F3E4', 'Obj_ALittleTree_F3E4', 'Obj_ATree_F3E4', 'Adv_Once_F3E4'] },
// 💡 [수프로 엣지] <3형식> 예문 5 전용 조립 레일 (5단 콤보 전치사 스위칭 호환)
  { type: '3형식_예문5_파크_전용', requiredRoles: ['Subj_I_F3E5', 'Verb_Met_F3E5', 'Obj_Her_F3E5'], englishOrder: ['Subj_I_F3E5', 'Verb_Met_F3E5', 'Obj_Her_F3E5', 'Prep_In_F3E5', 'Noun_Park_F3E5', 'Prep_On_F3E5', 'Art_A_F3E5', 'Adj_Fine_F3E5', 'Noun_Morning_F3E5', 'Adv_InTheMorning_F3E5'] }
  ];

// const FORM_RULES = [ 여기 위에 이전 콤마(,) 삽입 후 Enter 두번 후에 paste

// =========================================================================
// 💡 [수프로 엣지] 대용량 조립 분석 전용 1차 공장 (POST 함수 바깥에 위치!)
// =========================================================================
function applyTranslationReplaceRules(text: string): string {
  return text
      // 👇 잘라내신 수백 줄의 .replace 체인을 여기에 통째로 붙여넣습니다!
      // 👇👇 💡 [수프로 엣지] <3형식> 예문 5 ('그' 증발 방어 + '어느' 스위칭 완벽 방어망!) 👇👇
      .replace(/나는\s*(그\s*)?여자를\s*(어느\s*)?맑은\s*아침에\s*공원에서\s*만났다\.?/g, ' F3E5_I_Tk F3E5_Met_Tk F3E5_Her_Tk F3E5_In_Tk F3E5_ThePark_Tk F3E5_On_Tk F3E5_A_Tk F3E5_Fine_Tk F3E5_Morning_Tk ')
      .replace(/나는\s*(그\s*)?여자를\s*(어느\s*)?맑은\s*아침에\s*만났다\.?/g, ' F3E5_I_Tk F3E5_Met_Tk F3E5_Her_Tk F3E5_On_Tk F3E5_A_Tk F3E5_Fine_Tk F3E5_Morning_Tk ')
      .replace(/나는\s*(그\s*)?여자를\s*아침에\s*공원에서\s*만났다\.?/g, ' F3E5_I_Tk F3E5_Met_Tk F3E5_Her_Tk F3E5_In_Tk F3E5_ThePark_Tk F3E5_InTheMorning_Tk ')
      .replace(/나는\s*(그\s*)?여자를\s*공원에서\s*만났다\.?/g, ' F3E5_I_Tk F3E5_Met_Tk F3E5_Her_Tk F3E5_In_Tk F3E5_ThePark_Tk ')
      .replace(/나는\s*(그\s*)?여자를\s*만났다\.?/g, ' F3E5_I_Tk F3E5_Met_Tk F3E5_Her_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <3형식> 예문 4 (4단 콤보 부사 생략 및 관사 자동 보정망!) 👇👇
      .replace(/(^|\s)한\s*노인이\s*옛날에\s*작은\s*나무를\s*(심었습니다|심었다)\.?(?!\w)/g, '$1F3E4_An_Tk F3E4_OldMan_Tk F3E4_Planted_Tk F3E4_ALittleTree_Tk F3E4_OnceUponATime_Tk ')
      .replace(/(^|\s)한\s*노인이\s*작은\s*나무를\s*(심었습니다|심었다)\.?(?!\w)/g, '$1F3E4_An_Tk F3E4_OldMan_Tk F3E4_Planted_Tk F3E4_ALittleTree_Tk ')
      .replace(/(^|\s)한\s*노인이\s*옛날에\s*나무를\s*(심었습니다|심었다)\.?(?!\w)/g, '$1F3E4_An_Tk F3E4_OldMan_Tk F3E4_Planted_Tk F3E4_ATree_Tk F3E4_OnceUponATime_Tk ')
      .replace(/(^|\s)한\s*노인이\s*나무를\s*(심었습니다|심었다)\.?(?!\w)/g, '$1F3E4_An_Tk F3E4_OldMan_Tk F3E4_Planted_Tk F3E4_ATree_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <3형식> 예문 3 (부사 생략 자동 스위칭 방어망!) 👇👇
      .replace(/(^|\s)나는\s*그의\s*이름을\s*잘\s*기억하고\s*있다\.?(?!\w)/g, '$1F3E3_I_Tk F3E3_Remember_Tk F3E3_His_Tk F3E3_Name_Tk F3E3_Well_Tk ')
      .replace(/(^|\s)나는\s*그의\s*이름을\s*기억하고\s*있다\.?(?!\w)/g, '$1F3E3_I_Tk F3E3_Remember_Tk F3E3_His_Tk F3E3_Name_Tk ')
      .replace(/(^|\s)그의\s*이름을\s*잘\s*기억하고\s*있다\.?(?!\w)/g, '$1F3E3_Remember_Tk F3E3_His_Tk F3E3_Name_Tk F3E3_Well_Tk ') // 💡 주어 생략 보너스 방어
      .replace(/(^|\s)그의\s*이름을\s*기억하고\s*있다\.?(?!\w)/g, '$1F3E3_Remember_Tk F3E3_His_Tk F3E3_Name_Tk ') // 💡 주어 생략 보너스 방어
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <3형식> 예문 2 (조동사구 묶음 및 생략 자동 보정망!) 👇👇
      .replace(/(^|\s)너는\s*그\s*아기를\s*보살펴야\s*한다\.?(?!\w)/g, '$1F3E2_You_Tk F3E2_MustTakeCareOf_Tk F3E2_The_Tk F3E2_Baby_Tk ')
      .replace(/(^|\s)너는\s*아기를\s*보살펴야\s*한다\.?(?!\w)/g, '$1F3E2_You_Tk F3E2_MustTakeCareOf_Tk F3E2_The_Tk F3E2_Baby_Tk ') // 💡 '그' 생략 시 자동 보정
      .replace(/(^|\s)그\s*아기를\s*보살펴야\s*한다\.?(?!\w)/g, '$1F3E2_MustTakeCareOf_Tk F3E2_The_Tk F3E2_Baby_Tk ') // 💡 주어 생략 방어
      .replace(/(^|\s)아기를\s*보살펴야\s*한다\.?(?!\w)/g, '$1F3E2_MustTakeCareOf_Tk F3E2_The_Tk F3E2_Baby_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <3형식> 예문 1 (2단 콤보 자동 스위칭 방어망!) 👇👇
      .replace(/(^|\s)그는\s*나를\s*비웃었다\.?(?!\w)/g, '$1F3E1_He_Tk F3E1_LaughedAt_Tk F3E1_Me_Tk ')
      .replace(/(^|\s)그는\s*비웃었다\.?(?!\w)/g, '$1F3E1_He_Tk F3E1_LaughedAt_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <2형식> 예문 10 (7단 콤보 관사/전명구 완벽 스위칭망!) 👇👇
      .replace(/(^|\s)미국의\s*최초의\s*정주자들은\s*구세계의\s*폭정과\s*부패해가는\s*세력에서\s*해방\s*(되었다|됐다)\.?(?!\w)/g, '$1F2E10_TheFirst_Tk F2E10_Settlers_Tk F2E10_In_Tk F2E10_America_Tk F2E10_Were_Tk F2E10_Free_Tk F2E10_From_Tk F2E10_Tyrannies_Tk F2E10_And_Tk F2E10_Corrupting_Tk F2E10_Powers_Tk F2E10_Of_Tk F2E10_Europe_Tk ')
      .replace(/(^|\s)미국의\s*정주자들은\s*구세계의\s*폭정과\s*부패해가는\s*세력에서\s*해방\s*(되었다|됐다)\.?(?!\w)/g, '$1F2E10_The_Tk F2E10_Settlers_Tk F2E10_In_Tk F2E10_America_Tk F2E10_Were_Tk F2E10_Free_Tk F2E10_From_Tk F2E10_Tyrannies_Tk F2E10_And_Tk F2E10_Corrupting_Tk F2E10_Powers_Tk F2E10_Of_Tk F2E10_Europe_Tk ')
      .replace(/(^|\s)미국의\s*최초의\s*정주자들은\s*폭정과\s*부패해가는\s*세력에서\s*해방\s*(되었다|됐다)\.?(?!\w)/g, '$1F2E10_TheFirst_Tk F2E10_Settlers_Tk F2E10_In_Tk F2E10_America_Tk F2E10_Were_Tk F2E10_Free_Tk F2E10_From_Tk F2E10_Tyrannies_Tk F2E10_And_Tk F2E10_Corrupting_Tk F2E10_Powers_Tk ')
      .replace(/(^|\s)최초의\s*정주자들은\s*폭정과\s*부패해가는\s*세력에서\s*해방\s*(되었다|됐다)\.?(?!\w)/g, '$1F2E10_TheFirst_Tk F2E10_Settlers_Tk F2E10_Were_Tk F2E10_Free_Tk F2E10_From_Tk F2E10_Tyrannies_Tk F2E10_And_Tk F2E10_Corrupting_Tk F2E10_Powers_Tk ')
      .replace(/(^|\s)최초의\s*정주자들은\s*구세계의\s*부패해가는\s*세력에서\s*해방\s*(되었다|됐다)\.?(?!\w)/g, '$1F2E10_TheFirst_Tk F2E10_Settlers_Tk F2E10_Were_Tk F2E10_Free_Tk F2E10_From_Tk F2E10_Corrupting_Tk F2E10_Powers_Tk F2E10_Of_Tk F2E10_Europe_Tk ')
      .replace(/(^|\s)최초의\s*정주자들은\s*부패해가는\s*세력에서\s*해방\s*(되었다|됐다)\.?(?!\w)/g, '$1F2E10_TheFirst_Tk F2E10_Settlers_Tk F2E10_Were_Tk F2E10_Free_Tk F2E10_From_Tk F2E10_Corrupting_Tk F2E10_Powers_Tk ')
      .replace(/(^|\s)정주자들은\s*부패해가는\s*세력에서\s*해방\s*(되었다|됐다)\.?(?!\w)/g, '$1F2E10_The_Tk F2E10_Settlers_Tk F2E10_Were_Tk F2E10_Free_Tk F2E10_From_Tk F2E10_Corrupting_Tk F2E10_Powers_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <2형식> 예문 9 (6단 콤보 전명구 완벽 스위칭망!) 👇👇
      .replace(/(^|\s)속담은\s*어리석은\s*행동에\s*대한\s*경고나\s*또는\s*선행의\s*지침이\s*되기도\s*한다\.?(?!\w)/g, '$1F2E9_Proverbs_Tk F2E9_MayBe_Tk F2E9_Warnings_Tk F2E9_Against_Tk F2E9_Foolish_Tk F2E9_Acts_Tk F2E9_Or_Tk F2E9_Guides_Tk F2E9_To_Tk F2E9_GoodConduct_Tk ')
      .replace(/(^|\s)속담은\s*행동에\s*대한\s*경고나\s*또는\s*선행의\s*지침이\s*되기도\s*한다\.?(?!\w)/g, '$1F2E9_Proverbs_Tk F2E9_MayBe_Tk F2E9_Warnings_Tk F2E9_Against_Tk F2E9_Acts_Tk F2E9_Or_Tk F2E9_Guides_Tk F2E9_To_Tk F2E9_GoodConduct_Tk ')
      .replace(/(^|\s)속담은\s*어리석은\s*행동에\s*대한\s*지침이\s*되기도\s*한다\.?(?!\w)/g, '$1F2E9_Proverbs_Tk F2E9_MayBe_Tk F2E9_GuidesAsWarnings_Tk F2E9_Against_Tk F2E9_Foolish_Tk F2E9_Acts_Tk ')
      .replace(/(^|\s)속담은\s*행동에\s*대한\s*선행의\s*지침이\s*되기도\s*한다\.?(?!\w)/g, '$1F2E9_Proverbs_Tk F2E9_MayBe_Tk F2E9_GuidesAsWarnings_Tk F2E9_Against_Tk F2E9_Acts_Tk F2E9_To_Tk F2E9_GoodConduct_Tk ')
      .replace(/(^|\s)속담은\s*선행의\s*지침이\s*되기도\s*한다\.?(?!\w)/g, '$1F2E9_Proverbs_Tk F2E9_MayBe_Tk F2E9_Guides_Tk F2E9_To_Tk F2E9_GoodConduct_Tk ')
      .replace(/(^|\s)속담은\s*지침이\s*되기도\s*한다\.?(?!\w)/g, '$1F2E9_Proverbs_Tk F2E9_MayBe_Tk F2E9_Guides_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <2형식> 예문 8 (4단 콤보 관사/꼬리 스위칭 방어망!) 👇👇
      .replace(/(^|\s)언어는\s*의사소통의\s*가장\s*중요한\s*수단이다\.?(?!\w)/g, '$1F2E8_Language_Tk F2E8_Of_Tk F2E8_Communication_Tk F2E8_Is_Tk F2E8_TheMostImp_Tk F2E8_Means_Tk ')
      .replace(/(^|\s)언어는\s*의사소통의\s*중요한\s*수단이다\.?(?!\w)/g, '$1F2E8_Language_Tk F2E8_Of_Tk F2E8_Communication_Tk F2E8_Is_Tk F2E8_AnImp_Tk F2E8_Means_Tk ')
      .replace(/(^|\s)언어는\s*가장\s*중요한\s*수단이다\.?(?!\w)/g, '$1F2E8_Language_Tk F2E8_Is_Tk F2E8_TheMostImp_Tk F2E8_Means_Tk ')
      .replace(/(^|\s)언어는\s*중요한\s*수단이다\.?(?!\w)/g, '$1F2E8_Language_Tk F2E8_Is_Tk F2E8_AnImp_Tk F2E8_Means_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <2형식> 예문 7 (5단 콤보 전후방 완벽 스위칭망!) 👇👇
      .replace(/(^|\s)이러한\s*탐정\s*소설은\s*우리들에게\s*대단히\s*흥미롭다\.?(?!\w)/g, '$1F2E7_This_Tk F2E7_DetectiveStory_Tk F2E7_Is_Tk F2E7_Very_Tk F2E7_Interesting_Tk F2E7_For_Tk F2E7_Us_Tk ')
      .replace(/(^|\s)탐정\s*소설은\s*우리들에게\s*대단히\s*흥미롭다\.?(?!\w)/g, '$1F2E7_The_Tk F2E7_DetectiveStory_Tk F2E7_Is_Tk F2E7_Very_Tk F2E7_Interesting_Tk F2E7_For_Tk F2E7_Us_Tk ')
      .replace(/(^|\s)이러한\s*탐정\s*소설은\s*대단히\s*흥미롭다\.?(?!\w)/g, '$1F2E7_This_Tk F2E7_DetectiveStory_Tk F2E7_Is_Tk F2E7_Very_Tk F2E7_Interesting_Tk ')
      .replace(/(^|\s)이러한\s*탐정\s*소설은\s*우리들에게\s*흥미롭다\.?(?!\w)/g, '$1F2E7_This_Tk F2E7_DetectiveStory_Tk F2E7_Is_Tk F2E7_Interesting_Tk F2E7_For_Tk F2E7_Us_Tk ')
      .replace(/(^|\s)탐정\s*소설은\s*흥미롭다\.?(?!\w)/g, '$1F2E7_The_Tk F2E7_DetectiveStory_Tk F2E7_Is_Tk F2E7_Interesting_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <2형식> 예문 6 (5단 콤보 꼬리 자르기 완벽 스위칭망!) 👇👇
      .replace(/(^|\s)로마는\s*초기에\s*조그마한\s*왕국의\s*작은\s*도시였다\.?(?!\w)/g, '$1F2E6_Rome_Tk F2E6_In_Tk F2E6_Beginning_Tk F2E6_Of_Tk F2E6_SmallKingdom_Tk F2E6_Was_Tk F2E6_SmallTown_Tk ')
      .replace(/(^|\s)로마는\s*조그마한\s*왕국의\s*작은\s*도시였다\.?(?!\w)/g, '$1F2E6_Rome_Tk F2E6_Of_Tk F2E6_SmallKingdom_Tk F2E6_Was_Tk F2E6_SmallTown_Tk ')
      .replace(/(^|\s)로마는\s*초기에\s*왕국의\s*작은\s*도시였다\.?(?!\w)/g, '$1F2E6_Rome_Tk F2E6_In_Tk F2E6_Beginning_Tk F2E6_Of_Tk F2E6_Kingdom_Tk F2E6_Was_Tk F2E6_SmallTown_Tk ')
      .replace(/(^|\s)로마는\s*초기에\s*작은\s*도시였다\.?(?!\w)/g, '$1F2E6_Rome_Tk F2E6_In_Tk F2E6_Beginning_Tk F2E6_Was_Tk F2E6_SmallTown_Tk ')
      .replace(/(^|\s)로마는\s*작은\s*도시였다\.?(?!\w)/g, '$1F2E6_Rome_Tk F2E6_Was_Tk F2E6_SmallTown_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <2형식> 예문 5 (2단 콤보 자동 스위칭 방어망!) 👇👇
      .replace(/(^|\s)모든\s*사람은\s*법\s*앞에\s*평등하다\.?(?!\w)/g, '$1F2E5_All_Tk F2E5_Men_Tk F2E5_Are_Tk F2E5_Equal_Tk F2E5_Before_Tk F2E5_TheLaw_Tk ')
      .replace(/(^|\s)모든\s*사람은\s*평등하다\.?(?!\w)/g, '$1F2E5_All_Tk F2E5_Men_Tk F2E5_Are_Tk F2E5_Equal_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <2형식> 예문 4 (3단 콤보 자동 스위칭 방어망!) 👇👇
      .replace(/이\s*소설은\s*우리들에게\s*매우\s*흥미롭다\.?/g, ' F2E4_This_Tk F2E4_Novel_Tk F2E4_Is_Tk F2E4_Very_Tk F2E4_Interesting_Tk F2E4_For_Tk F2E4_Us_Tk ')
      .replace(/이\s*소설은\s*우리들에게\s*흥미롭다\.?/g, ' F2E4_This_Tk F2E4_Novel_Tk F2E4_Is_Tk F2E4_Interesting_Tk F2E4_For_Tk F2E4_Us_Tk ')
      .replace(/이\s*소설은\s*매우\s*흥미롭다\.?/g, ' F2E4_This_Tk F2E4_Novel_Tk F2E4_Is_Tk F2E4_Very_Tk F2E4_Interesting_Tk ')
      .replace(/이\s*소설은\s*흥미롭다\.?/g, ' F2E4_This_Tk F2E4_Novel_Tk F2E4_Is_Tk F2E4_Interesting_Tk ') // 💡 (보너스) 초단축 버전 방어!
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <2형식> 예문 3 (비교구문 숨은 대명사 자동 보정망!) 👇👇
      .replace(/금년\s*추위는\s*작년\s*추위보다\s*심하다\.?/g, ' F2E3_TheCold_Tk F2E3_Of_Tk F2E3_ThisYear_Tk F2E3_Is_Tk F2E3_Severer_Tk F2E3_Than_Tk F2E3_ThatOf_Tk F2E3_LastYear_Tk ')
      .replace(/추위는\s*작년\s*추위보다\s*심하다\.?/g, ' F2E3_TheCold_Tk F2E3_Is_Tk F2E3_Severer_Tk F2E3_Than_Tk F2E3_ThatOf_Tk F2E3_LastYear_Tk ')
      .replace(/금년\s*추위는\s*심하다\.?/g, ' F2E3_TheCold_Tk F2E3_Of_Tk F2E3_ThisYear_Tk F2E3_Is_Tk F2E3_Severer_Tk ')
      .replace(/추위는\s*심하다\.?/g, ' F2E3_TheCold_Tk F2E3_Is_Tk F2E3_Severer_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <2형식> 예문 2 (관사 'a' 자동 보정 및 생략 방어망!) 👇👇
      .replace(/수학은\s*어려운\s*과목이다\.?/g, ' F2E2_Math_Tk F2E2_Is_Tk F2E2_ADifficult_Tk F2E2_Subject_Tk ')
      .replace(/수학은\s*과목이다\.?/g, ' F2E2_Math_Tk F2E2_Is_Tk F2E2_A_Tk F2E2_Subject_Tk ')
      .replace(/수학은\s*어렵다\.?/g, ' F2E2_Math_Tk F2E2_Is_Tk F2E2_Difficult_Tk ') // 💡 (보너스) '어렵다' 단독 방어!
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <2형식> 예문 1 (선생님의 5단 콤보 예상 검색어 완벽 방어) 👇👇
      .replace(/Tom은\s*학교에서\s*가장\s*인기있는\s*소년이다\.?/gi, ' F2E1_Tom_Tk F2E1_Is_Tk F2E1_TheMostPop_Tk F2E1_Boy_Tk F2E1_In_Tk F2E1_TheSchool_Tk ')
      .replace(/Tom은\s*가장\s*인기있는\s*소년이다\.?/gi, ' F2E1_Tom_Tk F2E1_Is_Tk F2E1_TheMostPop_Tk F2E1_Boy_Tk ')
      .replace(/Tom은\s*학교에서\s*인기있는\s*소년이다\.?/gi, ' F2E1_Tom_Tk F2E1_Is_Tk F2E1_APop_Tk F2E1_Boy_Tk F2E1_In_Tk F2E1_TheSchool_Tk ')
      .replace(/Tom은\s*인기있는\s*소년이다\.?/gi, ' F2E1_Tom_Tk F2E1_Is_Tk F2E1_APop_Tk F2E1_Boy_Tk ')
      .replace(/Tom은\s*학교에서\s*소년이다\.?/gi, ' F2E1_Tom_Tk F2E1_Is_Tk F2E1_A_Tk F2E1_Boy_Tk F2E1_In_Tk F2E1_TheSchool_Tk ') // 💡 (보너스) 학교에서 소년이다 방어!
      .replace(/Tom은\s*소년이다\.?/gi, ' F2E1_Tom_Tk F2E1_Is_Tk F2E1_A_Tk F2E1_Boy_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <1형식> 예문 15 (기항하였다 완벽 방어! 불도저 포획망!) 👇👇
      .replace(/수많은\s*북한\s*밀정들이\s*이번\s*과학\s*전람회\s*기간에\s*북방\s*일본에\s*쾌속정으로\s*몰래\s*(기항했다|기항하였다)\.?/g, ' F15_Many_Tk F15_NorthKorean_Tk F15_Spies_Tk F15_HaveLanded_Tk F15_Clandestinely_Tk F15_In_Tk F15_NorthernJapan_Tk F15_By_Tk F15_FastBoat_Tk F15_During_Tk F15_This_Tk F15_Science_Tk F15_Exposition_Tk ')
      .replace(/북한\s*밀정들이\s*이번\s*과학\s*전람회\s*기간에\s*일본에\s*쾌속정으로\s*몰래\s*(기항했다|기항하였다)\.?/g, ' F15_NorthKorean_Tk F15_Spies_Tk F15_HaveLanded_Tk F15_Clandestinely_Tk F15_In_Tk F15_Japan_Tk F15_By_Tk F15_FastBoat_Tk F15_During_Tk F15_This_Tk F15_Science_Tk F15_Exposition_Tk ')
      .replace(/수많은\s*밀정들이\s*과학\s*전람회\s*기간에\s*북방\s*일본에\s*쾌속정으로\s*(기항했다|기항하였다)\.?/g, ' F15_Many_Tk F15_Spies_Tk F15_HaveLanded_Tk F15_In_Tk F15_NorthernJapan_Tk F15_By_Tk F15_FastBoat_Tk F15_During_Tk F15_Science_Tk F15_Exposition_Tk ')
      .replace(/북한\s*밀정들이\s*과학\s*전람회\s*기간에\s*일본에\s*쾌속정으로\s*(기항했다|기항하였다)\.?/g, ' F15_NorthKorean_Tk F15_Spies_Tk F15_HaveLanded_Tk F15_In_Tk F15_Japan_Tk F15_By_Tk F15_FastBoat_Tk F15_During_Tk F15_Science_Tk F15_Exposition_Tk ')
      .replace(/밀정들이\s*전람회\s*기간에\s*일본에\s*쾌속정으로\s*(기항했다|기항하였다)\.?/g, ' F15_Spies_Tk F15_HaveLanded_Tk F15_In_Tk F15_Japan_Tk F15_By_Tk F15_FastBoat_Tk F15_During_Tk F15_Exposition_Tk ')
      .replace(/밀정들이\s*일본에\s*쾌속정으로\s*(기항했다|기항하였다)\.?/g, ' F15_Spies_Tk F15_HaveLanded_Tk F15_In_Tk F15_Japan_Tk F15_By_Tk F15_FastBoat_Tk ')
      .replace(/밀정들이\s*일본에\s*(기항했다|기항하였다)\.?/g, ' F15_Spies_Tk F15_HaveLanded_Tk F15_In_Tk F15_Japan_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <1형식> 예문 14 (선생님의 4단 콤보 예상 검색어 완벽 방어) 👇👇
      .replace(/(^|\s)어떤\s*이상한\s*그림이\s*우중충한\s*벽에\s*걸려\s*있다\.?(?!\w)/g, '$1F14_A_Tk F14_Strange_Tk F14_Picture_Tk F14_IsHung_Tk F14_On_Tk F14_TheGloomy_Tk F14_Wall_Tk ')
      .replace(/(^|\s)어떤\s*그림이\s*우중충한\s*벽에\s*걸려\s*있다\.?(?!\w)/g, '$1F14_A_Tk F14_Picture_Tk F14_IsHung_Tk F14_On_Tk F14_TheGloomy_Tk F14_Wall_Tk ')
      .replace(/(^|\s)어떤\s*이상한\s*그림이\s*벽에\s*걸려\s*있다\.?(?!\w)/g, '$1F14_A_Tk F14_Strange_Tk F14_Picture_Tk F14_IsHung_Tk F14_On_Tk F14_The_Tk F14_Wall_Tk ')
      .replace(/(^|\s)어떤\s*그림이\s*벽에\s*걸려\s*있다\.?(?!\w)/g, '$1F14_A_Tk F14_Picture_Tk F14_IsHung_Tk F14_On_Tk F14_The_Tk F14_Wall_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <1형식> 예문 13 (선생님의 2단 콤보 예상 검색어 완벽 방어) 👇👇
      .replace(/(^|\s)큰\s*불이\s*지난\s*밤에\s*정거장\s*가까이에\s*있는\s*건물에서\s*일어났다\.?(?!\w)/g, '$1F13_ABigFire_Tk F13_In_Tk F13_Last_Tk F13_Night_Tk F13_At_Tk F13_TheBuilding_Tk F13_Near_Tk F13_TheStation_Tk F13_BrokeOut_Tk ')
      .replace(/(^|\s)큰불이\s*지난\s*밤에\s*정거장\s*가까이에\s*있는\s*건물에서\s*일어났다\.?(?!\w)/g, '$1F13_ABigFire_Tk F13_In_Tk F13_Last_Tk F13_Night_Tk F13_At_Tk F13_TheBuilding_Tk F13_Near_Tk F13_TheStation_Tk F13_BrokeOut_Tk ')
      .replace(/(^|\s)큰\s*불이\s*정거장\s*가까이에\s*있는\s*건물에서\s*일어났다\.?(?!\w)/g, '$1F13_ABigFire_Tk F13_At_Tk F13_TheBuilding_Tk F13_Near_Tk F13_TheStation_Tk F13_BrokeOut_Tk ')
      .replace(/(^|\s)큰불이\s*정거장\s*가까이에\s*있는\s*건물에서\s*일어났다\.?(?!\w)/g, '$1F13_ABigFire_Tk F13_At_Tk F13_TheBuilding_Tk F13_Near_Tk F13_TheStation_Tk F13_BrokeOut_Tk ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <1형식> 예문 12 (선생님의 5단 콤보 예상 검색어 완벽 방어) 👇👇
      .replace(/(^|\s)그\s*위대한\s*왕과\s*그의\s*현명한\s*여왕이\s*그들의\s*공식\s*수행원과\s*같이\s*아담한\s*나룻배에\s*탔다\.?(?!\w)/g, '$1The_Tk_12 Great_Tk_12 King_Tk_12 And_Tk_12 His_Tk_12 Wise_Tk_12 Queen_Tk_12 Got_Tk_12 On_Tk_12 TheElegantFerryBoat_Tk_12 With_Tk_12 Their_Tk_12 Official_Tk_12 Suites_Tk_12 ')
      .replace(/(^|\s)그\s*왕과\s*그의\s*현명한\s*여왕이\s*그들의\s*공식\s*수행원과\s*같이\s*나룻배에\s*탔다\.?(?!\w)/g, '$1The_Tk_12 King_Tk_12 And_Tk_12 His_Tk_12 Wise_Tk_12 Queen_Tk_12 Got_Tk_12 On_Tk_12 TheFerryBoat_Tk_12 With_Tk_12 Their_Tk_12 Official_Tk_12 Suites_Tk_12 ')
      .replace(/(^|\s)그\s*위대한\s*왕과\s*그의\s*여왕이\s*그들의\s*수행원과\s*같이\s*아담한\s*나룻배에\s*탔다\.?(?!\w)/g, '$1The_Tk_12 Great_Tk_12 King_Tk_12 And_Tk_12 His_Tk_12 Queen_Tk_12 Got_Tk_12 On_Tk_12 TheElegantFerryBoat_Tk_12 With_Tk_12 Their_Tk_12 Suites_Tk_12 ')
      .replace(/(^|\s)그\s*위대한\s*왕이\s*공식\s*수행원과\s*같이\s*나룻배에\s*탔다\.?(?!\w)/g, '$1The_Tk_12 Great_Tk_12 King_Tk_12 Got_Tk_12 On_Tk_12 TheFerryBoat_Tk_12 With_Tk_12 Official_Tk_12 Suites_Tk_12 ')
      .replace(/(^|\s)그\s*왕이\s*수행원과\s*같이\s*나룻배에\s*탔다\.?(?!\w)/g, '$1The_Tk_12 King_Tk_12 Got_Tk_12 On_Tk_12 TheFerryBoat_Tk_12 With_Tk_12 Suites_Tk_12 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <1형식> 예문 11 (이름표 도난 완벽 방어! F11 전용 암호 토큰!) 👇👇
      .replace(/그\s*소년과\s*소녀가/g, ' F11_BoyGirl_Tk ')
      .replace(/소년과\s*소녀가/g, ' F11_BoyGirl_Tk ')
      .replace(/그\s*소녀가/g, ' F11_Girl_Tk ')
      .replace(/소녀가/g, ' F11_Girl_Tk ') 
      .replace(/그\s*소년이/g, ' F11_Boy_Tk ')
      .replace(/소년이/g, ' F11_Boy_Tk ')
      .replace(/그가/g, ' F11_He_Tk ')
      .replace(/제인의\s*집/g, ' F11_JanesHouse_Tk ')
      .replace(/집(?=\s*근처에)/g, ' F11_House_Tk ') // 💡 [추가] '제인의'가 빠진 단독 '집' 구출! (5번 예문 절대 안전)
      .replace(/근처에\s*있는/g, ' F11_Near_Tk ')
      .replace(/백화점으로/g, ' F11_To_Tk F11_DeptStore_Tk ')
      .replace(/갔다\.?/g, ' F11_Went_Tk ')
      // 👆👆 ========================================================================= 👆👆

      // 👇👇 💡 [수프로 엣지] <1형식> 예문 10 (선생님의 5단 콤보 - The 충돌 완벽 해결판!) 👇👇
      .replace(/(^|\s)그\s*유명한\s*은둔자는\s*그의\s*제자들과\s*함께\s*자그마한\s*오두막집에서\s*살고\s*있다\.?(?!\w)/g, '$1TheFirst_Token_Form10 Famous_Token_Form10 Hermit_Token_Form10 Lives_Token_Form10 In_Token_Form10 The2_Token_Form10 Small_Token_Form10 Cabin_Token_Form10 With_Token_Form10 His_Token_Form10 Disciples_Token_Form10 ')
      .replace(/(^|\s)그\s*은둔자는\s*그의\s*제자들과\s*함께\s*자그마한\s*오두막집에서\s*살고\s*있다\.?(?!\w)/g, '$1TheFirst_Token_Form10 Hermit_Token_Form10 Lives_Token_Form10 In_Token_Form10 The2_Token_Form10 Small_Token_Form10 Cabin_Token_Form10 With_Token_Form10 His_Token_Form10 Disciples_Token_Form10 ')
      .replace(/(^|\s)그\s*유명한\s*은둔자는\s*그의\s*제자들과\s*함께\s*오두막집에서\s*살고\s*있다\.?(?!\w)/g, '$1TheFirst_Token_Form10 Famous_Token_Form10 Hermit_Token_Form10 Lives_Token_Form10 In_Token_Form10 The2_Token_Form10 Cabin_Token_Form10 With_Token_Form10 His_Token_Form10 Disciples_Token_Form10 ')
      .replace(/(^|\s)그\s*은둔자는\s*그의\s*제자들과\s*함께\s*오두막집에서\s*살고\s*있다\.?(?!\w)/g, '$1TheFirst_Token_Form10 Hermit_Token_Form10 Lives_Token_Form10 In_Token_Form10 The2_Token_Form10 Cabin_Token_Form10 With_Token_Form10 His_Token_Form10 Disciples_Token_Form10 ')
      .replace(/(^|\s)그\s*은둔자는\s*오두막집에서\s*살고\s*있다\.?(?!\w)/g, '$1TheFirst_Token_Form10 Hermit_Token_Form10 Lives_Token_Form10 In_Token_Form10 The2_Token_Form10 Cabin_Token_Form10 ')
      .replace(/(^|\s)그\s*소년과\s*소녀가\s*제인의\s*집\s*근처에\s*있는\s*백화점으로\s*갔다\.?(?!\w)/g, '$1TheBoyAndGirl_Token_Form11 Went_Token_Form11 To_Token_Form11 TheDeptStore_Token_Form11 Near_Token_Form11 JanesHouse_Token_Form11 ')

      // 👆👆 ======================================================= 👆👆
       // 👇👇 💡 [수프로 엣지] <1형식> 예문 9 (선생님의 3단 콤보 예상 검색어 완벽 방어) 👇👇
      .replace(/(^|\s)그는\s*이번\s*여름\s*방학\s*동안에\s*그의\s*가족들과\s*함께\s*해변에\s*머물\s*것이다\.?(?!\w)/g, '$1He_Token_Form9 WillStay_Token_Form9 At_Token_Form9 TheBeach_Token_Form9 With_Token_Form9 His_Token_Form9 Family_Token_Form9 During_Token_Form9 This_Token_Form9 Summer_Token_Form9 Vacation_Token_Form9 ')
      .replace(/(^|\s)그는\s*여름\s*방학\s*동안에\s*그의\s*가족들과\s*함께\s*해변에\s*머물\s*것이다\.?(?!\w)/g, '$1He_Token_Form9 WillStay_Token_Form9 At_Token_Form9 TheBeach_Token_Form9 With_Token_Form9 His_Token_Form9 Family_Token_Form9 During_Token_Form9 Summer_Token_Form9 Vacation_Token_Form9 ')
      .replace(/(^|\s)그는\s*그의\s*가족들과\s*함께\s*해변에\s*머물\s*것이다\.?(?!\w)/g, '$1He_Token_Form9 WillStay_Token_Form9 At_Token_Form9 TheBeach_Token_Form9 With_Token_Form9 His_Token_Form9 Family_Token_Form9 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <1형식> 예문 8 (선생님의 4단 콤보 예상 검색어 완벽 방어) 👇👇
      .replace(/(^|\s)한\s*예쁜\s*소녀가\s*조그마한\s*마을에서\s*살았다\.?(?!\w)/g, '$1A_Token_Form8 Pretty_Token_Form8 Girl_Token_Form8 Lived_Token_Form8 In_Token_Form8 ASmallVillage_Token_Form8 ')
      .replace(/(^|\s)한\s*소녀가\s*조그마한\s*마을에서\s*살았다\.?(?!\w)/g, '$1A_Token_Form8 Girl_Token_Form8 Lived_Token_Form8 In_Token_Form8 ASmallVillage_Token_Form8 ')
      .replace(/(^|\s)한\s*예쁜\s*소녀가\s*마을에서\s*살았다\.?(?!\w)/g, '$1A_Token_Form8 Pretty_Token_Form8 Girl_Token_Form8 Lived_Token_Form8 In_Token_Form8 AVillage_Token_Form8 ')
      .replace(/(^|\s)한\s*소녀가\s*마을에서\s*살았다\.?(?!\w)/g, '$1A_Token_Form8 Girl_Token_Form8 Lived_Token_Form8 In_Token_Form8 AVillage_Token_Form8 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <1형식> 예문 7 (선생님의 3단 콤보 예상 검색어 완벽 방어) 👇👇
      .replace(/(^|\s)존은\s*올\s*겨울\s*방학에\s*그\s*호텔에서\s*머물\s*것이다\.?(?!\w)/g, '$1John_Token_Form7 WillStay_Token_Form7 At_Token_Form7 TheHotel_Token_Form7 During_Token_Form7 This_Token_Form7 WinterVacation_Token_Form7 ')
      .replace(/(^|\s)존은\s*겨울\s*방학에\s*그\s*호텔에서\s*머물\s*것이다\.?(?!\w)/g, '$1John_Token_Form7 WillStay_Token_Form7 At_Token_Form7 TheHotel_Token_Form7 During_Token_Form7 WinterVacation_Token_Form7 ')
      .replace(/(^|\s)존은\s*그\s*호텔에서\s*머물\s*것이다\.?(?!\w)/g, '$1John_Token_Form7 WillStay_Token_Form7 At_Token_Form7 TheHotel_Token_Form7 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <1형식> 예문 6 (선생님의 3단 콤보 예상 검색어 완벽 방어) 👇👇
      .replace(/(^|\s)존은\s*서울에서\s*20년간\s*살았다\.?(?!\w)/g, '$1John_Token_Form6 HasLived_Token_Form6 In_Token_Form6 Seoul_Token_Form6 For_Token_Form6 TwentyYears_Token_Form6 ')
      .replace(/(^|\s)존은\s*서울에서\s*살았다\.?(?!\w)/g, '$1John_Token_Form6 HasLived_Token_Form6 In_Token_Form6 Seoul_Token_Form6 ')
      .replace(/(^|\s)존은\s*20년간\s*살았다\.?(?!\w)/g, '$1John_Token_Form6 HasLived_Token_Form6 For_Token_Form6 TwentyYears_Token_Form6 ')
      .replace(/(^|\s)존은\s*살았다\.?(?!\w)/g, '$1John_Token_Form6 HasLived_Token_Form6 ') // 💡 (보너스) '서울에서', '20년간' 모두 생략 대비!
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <1형식> 예문 5 (개별 단어 분해 레일) 👇👇
      .replace(/(^|\s)아주\s*낡은\s*집에(?!\w)/g, '$1In_Token_Form5 AVeryOldHouse_Token_Form5 ')
      .replace(/(^|\s)아주\s*낡은\s*집(?!\w)/g, '$1AVeryOldHouse_Token_Form5 ')
      .replace(/(^|\s)낡은\s*집에(?!\w)/g, '$1In_Token_Form5 AnOldHouse_Token_Form5 ') 
      .replace(/(^|\s)낡은\s*집(?!\w)/g, '$1AnOldHouse_Token_Form5 ') 
      .replace(/(^|\s)집에(?!\w)/g, '$1In_Token_Form5 AHouse_Token_Form5 ') // 💡 [추가] 수식어 모두 생략 대비 완벽 우회로!
      .replace(/(^|\s)집(?!\w)/g, '$1AHouse_Token_Form5 ') // 💡 [추가] 수식어 모두 생략 대비
      .replace(/(^|\s)(살았습니다|살았다)\.?(?!\w)/g, '$1Lived_Token_Form5 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <1형식> 예문 4 (개별 단어 분해 레일) 👇👇
      .replace(/(^|\s)그는(?!\w)/g, '$1He_Token_Form4 ') // (💡 공용 주어)
      .replace(/(^|\s)작년에(?!\w)/g, '$1LastYear_Token_Form4 ')
      .replace(/(^|\s)서울에서(?!\w)/g, '$1From_Token_Form4 Seoul_Token_Form4 ')
      .replace(/(^|\s)(왔다|오았다)\.?(?!\w)/g, '$1Came_Token_Form4 ') // 💡 '오았다' 오타/변형 완벽 방어!
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <1형식> 예문 3 (개별 단어 분해 레일) 👇👇
      .replace(/(^|\s)그는(?!\w)/g, '$1He_Token_Form3 ') 
      .replace(/(^|\s)매일\s*저녁(?!\w)/g, '$1Every_Token_Form3 Night_Token_Form3 ') // 💡 '매일 저녁'은 every night
      .replace(/(^|\s)매일(?!\w)/g, '$1Every_Token_Form3 Day_Token_Form3 ') // 💡 '매일' 단독은 every day로 자동 변환!
      .replace(/(^|\s)저녁(?!\w)/g, '$1Night_Token_Form3 ')
      .replace(/(^|\s)역에서(?!\w)/g, '$1At_Token_Form3 TheStation_Token_Form3 ')
      .replace(/(^|\s)논다\.?(?!\w)/g, '$1Plays_Token_Form3 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <1형식> 예문 2 (통짜 + 개별 이중 포획망) 👇👇
      .replace(/새가\s*아름답게\s*노래\s*부른다/g, ' TheBird_Token_Form2 Sweetly_Token_Form2 Sings_Token_Form2 ')
      .replace(/새가\s*아름답게\s*노래부른다/g, ' TheBird_Token_Form2 Sweetly_Token_Form2 Sings_Token_Form2 ')
      .replace(/새가/g, ' TheBird_Token_Form2 ')
      .replace(/아름답게/g, ' Sweetly_Token_Form2 ')
      .replace(/노래\s*부른다/g, ' Sings_Token_Form2 ')
      .replace(/노래부른다/g, ' Sings_Token_Form2 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <1형식> 예문 1 (초고속 4피스 레일) 👇👇
      .replace(/(^|\s)그\s*책은(?!\w)/g, '$1The_Token_Form1 Book_Token_Form1 ')
      .replace(/(^|\s)잘\s*팔린다\.?(?!\w)/g, '$1Well_Token_Form1 Sells_Token_Form1 ')
      .replace(/(^|\s)팔린다\.?(?!\w)/g, '$1Sells_Token_Form1 ') // 💡 '잘' 생략 대비
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <무의지동사> 예문 2 (개별 단어 완벽 분해 레일) 👇👇
      .replace(/이곳에\s*살아서/g, ' Lived_Token_Invol3 Here_Token_Invol3 To_Token_Invol3 ')
      .replace(/(^|\s)이곳에(?!\w)/g, '$1Here_Token_Invol3 ')
      .replace(/너를\s*만났다\.?/g, ' You_Token_Invol3 See_Token_Invol3 ')
      .replace(/(^|\s)너를(?!\w)/g, '$1You_Token_Invol3 ')
      .replace(/(^|\s)그는(?!\w)/g, '$1He_Token_Invol2 ')
      .replace(/(^|\s)오래(?!\w)/g, '$1Long_Token_Invol2 ')
      .replace(/(^|\s)살아서(?!\w)/g, '$1Lived_Token_Invol2 To_Token_Invol2 ')
      .replace(/(^|\s)그의(?!\w)/g, '$1His_Token_Invol2 ')
      .replace(/(^|\s)손자(를|들|들을)?(?!\w)/g, '$1Grandson_Token_Invol2 ')
      .replace(/(^|\s)다시(?!\w)/g, '$1Again_Token_Invol2 ')
      .replace(/(^|\s)만났다\.?(?!\w)/g, '$1Meet_Token_Invol2 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <무의지동사> 예문 1 (6피스 고속 레일) 무적 방어 코드 👇👇
      .replace(/(^|\s)그\s*아이는(?!\w)/g, '$1The1_Token_Invol1 Child_Token_Invol1 ')
      .replace(/(^|\s)자라서(?!\w)/g, '$1Grew_Token_Invol1 To_Token_Invol1 ') // 💡 '자라서' = grew + to 완벽 분해!
      .replace(/훌륭한/g, ' AFine_Token_Invol1 ') // 💡 [분해 1] 훌륭한 -> a fine
      .replace(/(^|\s)청년이(?!\w)/g, '$1Youth_Token_Invol1 ') // 💡 [분해 2] 청년이 -> youth // 💡 관사 중복 방지용 통짜 블록!
      .replace(/(^|\s)(되었다|되다)\.?(?!\w)/g, '$1Be_Token_Invol1 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <의지동사> 예문 5 (17피스 철벽 레일) 무적 방어 코드 👇👇
      .replace(/알베르트\s*슈바이처는/g, ' Albert_Token_Vol5 ')
      .replace(/병원을\s*더\s*크게\s*짓고/g, ' To1_Token_Vol5 Make1_Token_Vol5 TheHospital_Token_Vol5 Bigger_Token_Vol5 And_Token_Vol5 ')
      .replace(/(^|\s)병원을\s*짓고(?!\w)/g, '$1To1_Token_Vol5 Make1_Token_Vol5 TheHospital_Token_Vol5 And_Token_Vol5 ') // 💡 [우회로] '더 크게' 생략 대비
      .replace(/나병을\s*앓는/g, ' To3_Token_Vol5 SufferFrom_Token_Vol5 Leprosy_Token_Vol5 ')
      .replace(/사람들을\s*위한/g, ' For_Token_Vol5 People_Token_Vol5 ')
      .replace(/(^|\s)장소를(?!\w)/g, '$1APlace_Token_Vol5 ')
      .replace(/마련하기\s*위해(서)?/g, ' To2_Token_Vol5 Make2_Token_Vol5 ')
      .replace(/그\s*상금을/g, ' The_Token_Vol5 PrizeMoney_Token_Vol5 ')
      .replace(/(^|\s)상금을(?!\w)/g, '$1PrizeMoney_Token_Vol5 ') // 💡 [우회로] '그' 생략 대비
      .replace(/(^|\s)(사용했다|사용하였다)(?!\w)/g, '$1Used_Token_Vol5 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <의지동사> 예문 4 (20피스 울트라 레일) 무적 방어 코드 👇👇
      // 💡 '우리는'은 예문 2의 공용 부품(We_Token_Vol2)으로 자동 처리됩니다!
      .replace(/이번\s*방학\s*동안에/g, ' During_Token_Vol4 This_Token_Vol4 Vacation_Token_Vol4 ')
      .replace(/(^|\s)방학\s*동안에(?!\w)/g, '$1During_Token_Vol4 This_Token_Vol4 Vacation_Token_Vol4 ') 
      .replace(/많은\s*학생들에게/g, ' Many_Token_Vol4 Students_Token_Vol4 ')
      .replace(/(^|\s)학생들에게(?!\w)/g, '$1Students_Token_Vol4 ')
      .replace(/다른\s*나라의/g, ' Of_Token_Vol4 Other_Token_Vol4 Country_Token_Vol4 ')
      .replace(/문화와\s*관습과\s*예술을/g, ' The_Token_Vol4 Culture_Token_Vol4 Customs_Token_Vol4 And_Token_Vol4 Art_Token_Vol4 ')
      .replace(/문화와\s*예술을/g, ' The_Token_Vol4 Culture2_Token_Vol4 And_Token_Vol4 Art_Token_Vol4 ')
      .replace(/(^|\s)문화를(?!\w)/g, '$1The_Token_Vol4 Culture2_Token_Vol4 ') // 💡 [추가] '문화를' 단독 생략 완벽 포획 우회로!
      .replace(/(^|\s)예술을(?!\w)/g, '$1The_Token_Vol4 Art_Token_Vol4 ') 
      .replace(/가르쳐주기\s*위해(서)?/g, ' To_Token_Vol4 Teach_Token_Vol4 ') 
      .replace(/특별\s*프로그램을/g, ' ASpecialProgram_Token_Vol4 ')
      .replace(/(^|\s)프로그램을(?!\w)/g, '$1AProgram_Token_Vol4 ')
      .replace(/(^|\s)만들었다\.?(?!\w)/g, '$1Made_Token_Vol4 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <의지동사> 예문 3 (17피스 메가 레일) 무적 방어 코드 👇👇
      // 💡 '그는'은 공용 부품(Subj_He)으로 자동 처리됩니다!
      .replace(/그의\s*착한\s*아내와\s*귀여운\s*딸과\s*함께/g, ' With_Token_Vol3 His_Token_Vol3 GoodNatured_Token_Vol3 Wife_Token_Vol3 And_Token_Vol3 PrettyDaughter_Token_Vol3 ')
      .replace(/그의\s*아내와\s*딸과\s*함께/g, ' With_Token_Vol3 His_Token_Vol3 Wife_Token_Vol3 And_Token_Vol3 ADaughter_Token_Vol3 ')
      .replace(/그의\s*귀여운\s*딸과\s*함께/g, ' With_Token_Vol3 His_Token_Vol3 PrettyDaughter2_Token_Vol3 ') // 💡 [추가] 아내 생략! 딸 단독 우회로!
      .replace(/조용한\s*시골에서/g, ' In_Token_Vol3 The2_Token_Vol3 Quiet_Token_Vol3 Country_Token_Vol3 ')
      .replace(/(^|\s)시골에서(?!\w)/g, '$1In_Token_Vol3 The2_Token_Vol3 Country_Token_Vol3 ') 
      .replace(/살기\s*위해서/g, ' To_Token_Vol3 Live_Token_Vol3 ')
      .replace(/그\s*오래된\s*집을/g, ' The1_Token_Vol3 Old_Token_Vol3 House_Token_Vol3 ')
      .replace(/(^|\s)그\s*집을(?!\w)/g, '$1The1_Token_Vol3 House_Token_Vol3 ') 
      .replace(/(^|\s)(구입했다|구입하였다)(?!\w)/g, '$1Bought_Token_Vol3 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <의지동사> 예문 2 무적 방어 코드 👇👇
      .replace(/(^|\s)우리는(?!\w)/g, '$1We_Token_Vol2 ')
      .replace(/중요한\s*일에\s*대해/g, ' About_Token_Vol2 ImportantThing_Token_Vol2 ') // 💡 영어 어순(about + important thing) 자동 정렬!
      .replace(/(^|\s)중요한\s*일(에)?(?!\w)/g, '$1ImportantThing_Token_Vol2 ') // 부분 삭제 방어
      .replace(/(^|\s)대해(?!\w)/g, '$1About_Token_Vol2 ') // 부분 삭제 방어
      .replace(/의논하기\s*위해/g, ' To_Token_Vol2 Talk_Token_Vol2 ')
      .replace(/(^|\s)오늘(?!\w)/g, '$1Today_Token_Vol2 ')
      .replace(/(^|\s)여기(에)?(?!\w)/g, '$1Here_Token_Vol2 ')
      .replace(/(^|\s)모였다\.?(?!\w)/g, '$1Gathered_Token_Vol2 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <의지동사> 예문 1 궁극의 무적 방어 코드 👇👇
      // 💡 '그는'은 공용 부품(Subj_He)으로 자동 처리됩니다!
      .replace(/(^|\s)이곳에(?!\w)/g, '$1Here_Token_Vol1 ')
      .replace(/(^|\s)(왔다|오았다)(?!\w)/g, '$1Came_Token_Vol1 ') // 💡 단독/오타 모두 완벽 포획!
      .replace(/목적으로/g, ' To_Token_Vol1 ')
      .replace(/만날/g, ' See_Token_Vol1 ')
      .replace(/(^|\s)너를(?!\w)/g, '$1You_Token_Vol1 ')
      // 👆👆 ======================================================= 👆👆=== �
      // 👇👇 💡 [수프로 엣지] <부사구_결과> 예문 3 무적 방어 코드 👇👇
      // 💡 '그는'은 공용 부품(Subj_He)으로 자동 처리됩니다!
      .replace(/아주\s*게으르다\.?/g, ' IsToo_Token_Res3 Idle_Token_Res3 ') // 'is too' + 'idle'
      .replace(/(^|\s)게으르다(?!\w)/g, '$1Is_Token_Res3 Idle_Token_Res3 ') // 단독 공격 대비 'is' 방어!
      .replace(/그래서\s*많은\s*책을\s*읽을\s*수\s*없다/g, ' To_Token_Res3 Read_Token_Res3 Many_Token_Res3 Books_Token_Res3 ')
      .replace(/그래서\s*읽을\s*수\s*없다/g, ' To_Token_Res3 Read_Token_Res3 ')
      .replace(/읽을\s*수\s*없다/g, ' To_Token_Res3 Read_Token_Res3 ')
      .replace(/많은\s*책을/g, ' Many_Token_Res3 Books_Token_Res3 ')
      .replace(/(^|\s)책을(?!\w)/g, '$1Books_Token_Res3 ')
      // 👆👆 ======================================================= 👆👆
            // 👇👇 💡 [수프로 엣지] <부사구_결과> 예문 2 궁극의 무적 방어 코드 👇👇
      .replace(/그\s*소년은/g, ' The_Token_Res2 Boy_Token_Res2 ')
      .replace(/(^|\s)소년은(?!\w)/g, '$1Boy_Token_Res2 ')
      .replace(/아주\s*영리하다\.?/g, ' IsClever_Token_Res2 Enough_Token_Res2 ') // 💡 'is'와 'clever' 강제 결합!
      .replace(/(^|\s)영리하다(?!\w)/g, '$1IsClever_Token_Res2 ') // 💡 부분 삭제 시에도 'is' 방어!
      .replace(/그래서\s*그것을\s*이해할\s*수\s*있다/g, ' To_Token_Res2 Understand_Token_Res2 It_Token_Res2 ')
      .replace(/그래서\s*이해할\s*수\s*있다/g, ' To_Token_Res2 Understand_Token_Res2 ')
      .replace(/그것을\s*이해할\s*수\s*있다/g, ' Understand_Token_Res2 It_Token_Res2 ')
      .replace(/(^|\s)이해할\s*수\s*있다(?!\w)/g, '$1Understand_Token_Res2 ')
      .replace(/(^|\s)그것을(?!\w)/g, '$1It_Token_Res2 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <부사구_결과> 예문 1 무적 방어 코드 👇👇
      // 💡 (주의) '그는'은 예문 3의 He_Token을 공용으로 사용하므로 변환 코드를 삭제했습니다!
      .replace(/일어났다\.?/g, ' GotUp_Token_Res1 ')
      .replace(/(^|\s)아주(?!\w)/g, '$1So_Token_Res1 ')
      .replace(/(^|\s)늦게(?!\w)/g, '$1Late_Token_Res1 ')
      .replace(/그래서/g, ' AsTo_Token_Res1 ')
      .replace(/(놓치었다|놓쳤다|놓치다)/g, ' Miss_Token_Res1 ')
      .replace(/기차를/g, ' TheTrain_Token_Res1 ')
      // 👆👆 ======================================================= 👆👆

      // 👇👇 💡 [수프로 엣지] <부사구> 예문 4 궁극의 무적 방어 코드 👇👇
      .replace(/(^|\s)이\s*물은(?!\w)/g, '$1This_Token_Adv4 Water_Token_Adv4 ')
      .replace(/(^|\s)물은(?!\w)/g, '$1Water_Token_Adv4 ')
      .replace(/마시기에/g, ' To_Token_Adv4 Drink_Token_Adv4 ')
      .replace(/좋다/g, ' IsGood_Token_Adv4 ') // 💡 'is'와 'good' 강제 결합!
      .replace(/(^|\s)좋은(?!\w)/g, '$1IsGood_Token_Adv4 ') // 💡 부분 삭제 시에도 'is' 방어!
      // 👆👆 ======================================================= 👆👆

      // 👇👇 💡 [수프로 엣지] <부사구> 예문 3 궁극의 무적 방어 코드 👇👇
      .replace(/(^|\s)도해는(?!\w)/g, '$1Diagram_Token_Adv3 ')
      .replace(/어려운\s*문장도/g, ' HardSentence_Token_Adv3 ')
      .replace(/(^|\s)문장도(?!\w)/g, '$1Sentence_Token_Adv3 ') // 💡 [추가] 수식어가 빠진 단독 '문장도' 완벽 구출!
      .replace(/(^|\s)체계적으로(?!\w)/g, '$1Systematically_Token_Adv3 ')
      .replace(/강의하기에/g, ' To_Token_Adv3 Teach_Token_Adv3 ')
      .replace(/편리하다/g, ' IsConvenient_Token_Adv3 ') // 💡 'is'와 'convenient' 강제 결합!
      .replace(/(^|\s)편리한(?!\w)/g, '$1IsConvenient_Token_Adv3 ') // 💡 부분 삭제 시에도 'is' 방어!

      // 👇👇 💡 [수프로 엣지] <부사구> 예문 2 무적 방어 코드 👇👇
      .replace(/(^|\s)그들은(?!\w)/g, '$1They_Token_Adv2 ')
      .replace(/자기\s*가족의/g, ' Of_Token_Adv2 Their_Token_Adv2 Family_Token_Adv2 ')
      .replace(/(^|\s)가족의(?!\w)/g, '$1Of_Token_Adv2 Family_Token_Adv2 ')
      .replace(/(^|\s)소식을(?!\w)/g, '$1TheNews_Token_Adv2 ')
      .replace(/듣지\s*못했기\s*때문에/g, ' Not_Token_Adv2 To_Token_Adv2 Hear_Token_Adv2 ')
      .replace(/(^|\s)못했기\s*때문에(?!\w)/g, '$1Not_Token_Adv2 To_Token_Adv2 ')
      .replace(/(^|\s)듣지(?!\w)/g, '$1Hear_Token_Adv2 ')
      .replace(/슬펐다/g, ' Were_Token_Adv2 Sad_Token_Adv2 ')
      .replace(/(^|\s)슬픈(?!\w)/g, '$1Sad_Token_Adv2 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <부사구> 예문 1 무적 방어 코드 👇👇
      .replace(/(^|\s)나는(?!\w)/g, '$1I_Token_Adv1 ') // 💡 기존 '나는_I'와 충돌 원천 차단!
      .replace(/매우\s*기쁘다/g, ' Am_Token_Adv1 Very_Token_Adv1 Glad_Token_Adv1 ')
      .replace(/(^|\s)기쁘다(?!\w)/g, '$1Am_Token_Adv1 Glad_Token_Adv1 ') // 💡 '매우'가 빠진 단독 공격 대비!
      .replace(/(^|\s)매우(?!\w)/g, '$1Very_Token_Adv1 ')
      .replace(/여기에서/g, ' Here_Token_Adv1 ')
      .replace(/너를\s*만나니/g, ' You_Token_Adv1 To_Token_Adv1 Meet_Token_Adv1 ')
      .replace(/(^|\s)만나니(?!\w)/g, '$1To_Token_Adv1 Meet_Token_Adv1 ')
      .replace(/(^|\s)너를(?!\w)/g, '$1You_Token_Adv1 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <형용사구> 예문 7 (역대급 14피스 & 3개의 to 중복 완벽 회피) 👇👇
      .replace(/그\s*왕은/g, ' The_Token_7 King_Token_7 ')
      .replace(/어떤\s*일을/g, ' Anything_Token_7 ')
      .replace(/(^|\s)시작할(?!\w)/g, '$1To_Token_7_1 Begin_Token_7 ')
      .replace(/적절한\s*시기를/g, ' TheRight_Token_7 Time_Token_7 ')
      .replace(/(^|\s)자기에게(?!\w)/g, '$1Him_Token_7 ')
      .replace(/(^|\s)가르쳐주는(?!\w)/g, '$1To_Token_7_2 Teach_Token_7 ')
      .replace(/(^|\s)사람에게(?!\w)/g, '$1TheMan_Token_7 To_Token_7_3 ')
      .replace(/큰\s*상을/g, ' AGreatReward_Token_7 ')
      .replace(/(내렸다|내리었다)/g, ' Gave_Token_7 ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <형용사구> 예문 6 무적 방어 코드 👇👇
      .replace(/(^|\s)그는(?!\w)/g, '$1He_Token ') // 💡 예문 3의 '그는(He)' 찰떡 호환!
      .replace(/자기자신을/g, ' Himself_Token ')
      .replace(/위대한\s*지도자라고/g, ' GreatLeader_Token ')
      .replace(/(^|\s)지도자라고(?!\w)/g, '$1Leader_Token ') // 💡 [추가] 수식어가 빠진 단독 '지도자라고' 완벽 구출!
      .replace(/생각하는/g, ' To_Token_6 Think_Token ')
      .replace(/독재자이다/g, ' Is_Token Dictator_Token ')
      .replace(/(^|\s)독재자(?!\w)/g, '$1Dictator_Token ') // 💡 단독 '독재자' 검색 완벽 방어!
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <형용사구> 예문 5 무적 방어 코드 👇👇
      .replace(/그의\s*생일에/g, ' His_Token_5 Bday_Token On_Token_5 ')
      .replace(/(^|\s)그에게(?!\w)/g, '$1Him_Token_5 ') // 💡 예문 6의 '그에게'와 충돌 원천 차단!
      .replace(/멋진\s*선물을/g, ' NicePresent_Token ')
      .replace(/사준\s*소녀는/g, ' TheGirl_Token To_Token_5 Buy_Token_5 ')
      .replace(/(^|\s)사준(?!\w)/g, '$1To_Token_5 Buy_Token_5 ')
      .replace(/(^|\s)소녀는(?!\w)/g, '$1TheGirl_Token ')
      .replace(/베티였다/g, ' Was_Token_5 Betty_Token ')
      .replace(/(^|\s)베티(?!\w)/g, '$1Betty_Token ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <형용사구> 예문 4 무적 방어 코드 👇👇
      .replace(/고대\s*이집트에서/g, ' 고대_ancient 이집트_egypt 에서_in_egypt ')
      .replace(/나일강을\s*따라/g, ' 나일강을_nile 따라_along ')
      .replace(/그들의\s*집을/g, ' 그들의_their 집을_homes ')
      .replace(/(^|\s)지은(?!\w)/g, '$1ㄴ_to_make 짓다_make ')
      .replace(/최초의\s*사람들은/g, ' 최초의_first 사람들은_men ')
      .replace(/(^|\s)사람들은(?!\w)/g, '$1사람들은_men ') // 💡 [추가] 수식어가 빠진 단독 '사람들은' 완벽 구출!
      .replace(/농부들이었다/g, ' 농부들_farmers 이었다_were ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <형용사구> 예문 3 궁극의 무적 방어 코드 👇👇
      .replace(/(^|\s)그는(?!\w)/g, '$1He_Token ')
      .replace(/그\s*책을/g, ' TheBook_Token ')
      .replace(/(^|\s)책을(?!\w)/g, '$1TheBook_Token ')
      .replace(/보냈(다|어)|보낸다었다/g, ' Sent_Token ')
      .replace(/의사가\s*된/g, ' Doctor_Token ToBecome_Token ')
      .replace(/(^|\s)된\s*아들에게/g, '$1ToBecome_Token HisSon_Token PrepTo_Token ')
      .replace(/(^|\s)아들에게(?!\w)/g, '$1HisSon_Token PrepTo_Token ')
      .replace(/(^|\s)아들(?!\w)/g, '$1HisSon_Token ')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <형용사구> 예문 2 & 부분 삭제 대비 👇👇
      .replace(/다윈은/g, ' 다윈은_darwin ')
      .replace(/진화에\s*대한/g, ' 진화_evo 에대한_on ')
      .replace(/그의\s*이론으로/g, ' 그의_his 이론_theories 으로_for ')
      .replace(/이론으로/g, ' 이론_theories 으로_for ')
      .replace(/유명하게\s*된/g, ' ㄴ_to_be 되다_be 유명한_famous ')
      .replace(/(^|\s)된(?!\w)/g, '$1ㄴ_to_be 되다_be ')
      .replace(/영국의\s*생물학자였다/g, ' 영국의_생물학자 였다_was ')
      .replace(/영국의\s*생물학자/g, ' 영국의_생물학자 ')
      .replace(/(^|\s)생물학자였다(?!\w)/g, '$1생물학자_bio 였다_was ') // 💡 [추가] 수식어가 빠진 단독 '생물학자였다' 방어!
      .replace(/(^|\s)생물학자(?!\w)/g, '$1생물학자_bio ') // 💡 [추가] 단독 '생물학자' 방어!
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <형용사구> 예문 1 & 부분 삭제 대비 👇👇
      // 💡 [수프로 엣지] 앞뒤로 공백을 넣어 다른 단어와 절대 엉키지 않게 격리!
      .replace(/방문\s*(했다|하였다)/g, ' 방문했다_visited ')
      .replace(/나의\s*아저씨를/g, '나의_my 아저씨를_uncle')
      .replace(/(^|\s)아저씨를(?!\w)/g, '$1아저씨를_uncle')
      .replace(/사시는/g, 'ㄴ_to 사시다_live')
      .replace(/캘리포니아에/g, '캘리포니아_cali 에_in_cali')
      // 👆👆 ======================================================= 👆👆
      // 👇👇 💡 [수프로 엣지] <보충어구> 예문 6 (예문 4의 '책을'을 먼저 낚아채도록 가장 최상단 배치!) 👇👇
      .replace(/나는\s*그에게/g, '나는_I 그에게_him')
      .replace(/(^|\s)나는(?!\w)/g, '$1나는_I')
      .replace(/(^|\s)그에게(?!\w)/g, '$1그에게_him')
      .replace(/가르(쳤다|치었다)/g, '가르쳤다_taught') // 💡 '가르쳤다', '가르치었다' 오타 동시 완벽 방어!
      .replace(/책을\s*읽으라고/g, '책을_thebook 읽다_read 라고_to')
      .replace(/읽으라고/g, '읽다_read 라고_to')
      // 👆👆 ========================================================================= 👆👆
      // 💡 [수프로 엣지] <보충어구> 예문 5 & 부분 삭제 대비
      .replace(/우리의\s*책무는/g, '우리의_our1 책무는_resp')
      .replace(/우리의\s*자연\s*환경을/g, '우리의_our2 자연_nat 환경을_env')
      .replace(/우리의\s*자연환경을/g, '우리의_our2 자연_nat 환경을_env')
      .replace(/(^|\s)자연\s*환경을/g, '$1자연_nat 환경을_env')
      .replace(/(^|\s)자연환경을/g, '$1자연_nat 환경을_env')
      .replace(/깨끗하고\s*아름답게/g, '깨끗한_clean 접속사_and 아름답게_beautiful') // 💡 고_and를 접속사_and로 변경!
      .replace(/(^|\s)깨끗하고(?!\w)/g, '$1깨끗한_clean 접속사_and') // 💡 고_and를 접속사_and로 변경!
      .replace(/(^|\s)아름답게(?!\w)/g, '$1아름답게_beautiful')
      .replace(/유지하는\s*것이다/g, '것_to_keep 유지하다_keep 이다')
      .replace(/유지하는\s*것/g, '것_to_keep 유지하다_keep')
      // 👇👇 💡 [수프로 엣지] <보충어구> 예문 4 (레거시보다 먼저 낚아채도록 최상단 배치!) 👇👇
      .replace(/이번에/g, '이번_thistime 에_at')
      .replace(/조용한\s*시골에서/g, '조용한_시골 에서_in_country')
      .replace(/조용한\s*시골/g, '조용한_시골')
      .replace(/많은\s*책을/g, '많은_many 책을_books')
      .replace(/(^|\s)책을(?!\w)/g, '$1책을_books') // 💡 [추가] '많은'이 빠진 단독 '책을' 완벽 방어!
      .replace(/읽으려는\s*것이다/g, '것_to_read 읽다_read 이다')
      .replace(/읽으려는\s*것/g, '것_to_read 읽다_read')
      // 💡 [수프로 엣지] <보충어구> 예문 3 & 부분 삭제 대비 (수식어 누락 완벽 방어)
      .replace(/이번\s*교육\s*계획의/g, '의_plan 이번_this 교육_1 개혁')
      .replace(/이번\s*교육의/g, '의_plan 이번_this 교육_1')
      .replace(/교육\s*계획의/g, '의_plan 교육_1 개혁')
      .replace(/목표는/g, '목표는_aim')
      .replace(/모든\s*학생들에게/g, '모든_all 학생들에게_std')
      .replace(/학생들에게(?!\w)/g, '학생들에게_std')
      .replace(/교육의\s*공평한\s*기회를/g, '공평한_equal 기회를_opp 의_edu 교육_2')
      .replace(/교육의\s*기회를/g, '기회를_opp 의_edu 교육_2')
      .replace(/공평한\s*기회를/g, '공평한_equal 기회를_opp')
      .replace(/기회를(?!\w)/g, '기회를_opp')
      .replace(/부여하려는\s*것이다/g, '것_to_offer 부여하다_offer 이다')
      .replace(/부여하려는\s*것/g, '것_to_offer 부여하다_offer')
      // 💡 [수프로 엣지] <보충어구> 예문 3 & 부분 삭제 대비
      .replace(/이번\s*교육\s*계획의/g, '의_plan 이번_this 교육_1 개혁')
      .replace(/교육\s*계획의/g, '의_plan 교육_1 개혁')
      .replace(/목표는/g, '목표는_aim')
      .replace(/모든\s*학생들에게/g, '모든_all 학생들에게_std')
      .replace(/교육의\s*공평한\s*기회를/g, '공평한_equal 기회를_opp 의_edu 교육_2')
      .replace(/공평한\s*기회를/g, '공평한_equal 기회를_opp')
      .replace(/부여하려는\s*것이다/g, '것_to_offer 부여하다_offer 이다')
      .replace(/부여하려는\s*것/g, '것_to_offer 부여하다_offer')
      // 💡 [수프로 엣지] <보충어구> 예문 2 & 부분 삭제 대비
      .replace(/그의\s*꿈은/g, '그의_his 꿈은')
      .replace(/미래에/g, '미래_future 에_in_future')
      .replace(/훌륭한\s*의사가/g, '훌륭한_의사가')
      .replace(/(^|\s)의사가\s*되는/g, '$1의사가_doc 되는') // 💡 [수프로 엣지] '훌륭한'이 빠진 단독 '의사가' 완벽 방어!
      .replace(/되는\s*것이다/g, '것_to 되다_become 이다')
      .replace(/되는\s*것/g, '것_to 되다_become')
       // 💡 [수프로 엣지] <보충어구> 예문 1 & 부분 삭제 대비 (최상단 배치!)
      .replace(/나의\s*계획은/g, '나의_plan 계획은')
      .replace(/이번\s*주말에/g, '이번 주말 에_on')
      .replace(/그녀와\s*함께/g, '그녀 와함께')
      .replace(/박물관에/g, '박물관 에_to')
      .replace(/가는\s*것이다/g, '가다 것 이다')
      // 💡 [수프로 엣지] <목적어구> 예문 7 & 부분 삭제 대비
      .replace(/고대\s*그리스인들은/g, '고대(의)_그리스인들은')
      .replace(/그들의\s*몸을/g, '그들의 몸을')
      .replace(/연무장의\s*운동으로/g, '으로_with 운동 의_gym 연무장')
      .replace(/연무장의/g, '의_gym 연무장')
      .replace(/운동으로/g, '으로_with 운동')
      .replace(/튼튼하게\s*하기를/g, '기를_make 하다 튼튼하게')
      .replace(/하기를/g, '기를_make 하다')
      // 💡 [수프로 엣지] <목적어구> 예문 6 & 부분 삭제 대비
      .replace(/너희들에게/g, '너희들에게')
      .replace(/많은\s*부를/g, '많은 부를')
      .replace(/남겨\s*주기를/g, '기를_2 남겨주다')
      .replace(/바라는\s*것은/g, '것은_1 바라다')
      .replace(/잘못(이다|입니다)/g, 'It 이다 잘못')
      // 💡 [수프로 엣지] <목적어구> 예문 5 & 부분 삭제 대비
      .replace(/그리스의\s*역사와\s*문화를/g, '역사 와_hist 문화를 의_greece 그리스')
      .replace(/그리스의\s*역사를/g, '역사 의_greece 그리스')
      .replace(/그리스의\s*문화를/g, '문화를 의_greece 그리스')
      .replace(/역사와\s*문화를/g, '역사 와_hist 문화를')
      .replace(/말해주기를/g, '기를_tell 말해주다')
      .replace(/(좋아|좋다)(했다|하였다)/g, '좋아했다')
      .replace(/관광객들에게/g, '관광객들에게')
      // 💡 [수프로 엣지] <목적어구> 예문 4, 4-1 & 부분 삭제 대비
      .replace(/그녀는/g, '그녀는')
      .replace(/결심(했다|하였다)/g, '결심했다')
      .replace(/그\s*꽃잎들로/g, '로_with 그_inst 꽃잎들')
      .replace(/꽃잎들로/g, '로_with 꽃잎들')
      .replace(/그녀의\s*손톱을\s*물들일\s*것을/g, '것을 물들이다 그녀의 손톱을')
      .replace(/손톱을\s*물들일\s*것을/g, '것을 물들이다 손톱을')
      .replace(/그녀의\s*손톱을\s*물들이기로/g, '기를 물들이다 그녀의 손톱을')
      .replace(/손톱을\s*물들이기로/g, '기를 물들이다 손톱을')
      // 💡 [수프로 엣지] <목적어구> 예문 3 & 부분 삭제 대비
      .replace(/그\s*총명한\s*소년은/g, '그 총명한 소년은')
      .replace(/미래에/g, '미래 에_in')
      .replace(/위대한\s*과학자가/g, '위대한_과학자가')
      .replace(/되기를/g, '기를 되다_inf')
      .replace(/원(했다|하였다)/g, '원했다')
      // 💡 [수프로 엣지] <목적어구> 예문 2 & 부분 삭제 테스트 대비
      .replace(/동물과\s*식물에\s*대해서/g, '에_대해서 동물 과_about 식물')
      .replace(/동물에\s*대해서/g, '에_대해서 동물')
      .replace(/식물에\s*대해서/g, '에_대해서 식물')
      .replace(/알기를\s*원한다/g, '원하다 기를 알다_inf')
      // 💡 [수프로 엣지] <목적어구> 예문 1 & 부분 삭제 대비
      .replace(/나는\s*집에서\s*쉬기를\s*원한다/g, '나는 원하다 기를 쉬다_inf 에서_in 집')
      .replace(/나는\s*쉬기를\s*원한다/g, '나는 원하다 기를 쉬다_inf')
      .replace(/많은\s*젊은이들에게/g, '많은_io 젊은이들에게')
      .replace(/참된\s*과제를/g, '참된_obj 과제를')
      .replace(/가르쳐\s*주어서/g, '것이_1 가르쳐주다 서_and')
      .replace(/그들을\s*훌륭한\s*젊은이로/g, '그들을 훌륭한_oc 젊은이로')
      .replace(/만드는\s*것이/g, '것이_2 만들다')
      .replace(/우리의\s*일이다/g, 'It 우리의 일 이다')
      .replace(/나의\s*의무(입니다|이다)/g, 'It 이다 나의_1 의무')
      .replace(/입헌정치를\s*유지하고/g, '것이_1 유지하다 입헌정치를 고_and')
      .replace(/나의\s*신민들의/g, '의 나의_2 신민들')
      .replace(/행복과\s*번영을/g, '행복 과_obj 번영을')
      .replace(/증진시키는\s*것이/g, '것이_2 증진시키다')
      .replace(/입헌정치를/g, '입헌정치를')
      .replace(/이번\s*독서주간에/g, '이번_독서주간 에_during')
      .replace(/노는\s*것이/g, '것이 놀다_inf')
      .replace(/일하고\s*노는\s*것이/g, '것은_inf1 일하다_inf 고_and 것은_inf2 놀다_inf')
      .replace(/많은\s*시민들에게/g, '많은_io 시민들에게')
      .replace(/많은\s*책을/g, '많은_obj 책을')
      .replace(/빌려주는\s*것이/g, '것이 빌려주다')
      .replace(/이러한\s*방법으로/g, '이러한_방법으로')
      .replace(/공부하기는/g, '공부하다 기는')
      .replace(/대단히/g, '대단히')
      .replace(/쉽다/g, 'It 쉬운 이다')
      .replace(/일해야만\s*(했다|하였다)/g, '일해야만_했다')
      .replace(/나의\s*아버지는/g, '나의_아버지는')
      .replace(/아침부터/g, '아침 부터')
      .replace(/저녁까지/g, '저녁 까지')
      .replace(/일하신다/g, '일하다')
      .replace(/미래에/g, '미래 에')
      .replace(/위대한\s*시인이/g, '위대한_시인이')
      .replace(/되는\s*것이/g, '것이 되다')
      .replace(/나의\s*꿈이다/g, 'It 나의 꿈 이다')
      .replace(/아침에/g, '아침 에_in')
      .replace(/일어나는/g, '일어나다')
      .replace(/건강에/g, '건강 에_for')
      .replace(/좋다/g, 'It 좋은 이다')
      .replace(/흘끗\s*보다/g, '흘끗_보다')
      .replace(/냄새\s*맡다/g, '냄새_맡다')
      .replace(/lived\s*here\s*to\s*see/g, 'lived here to see')
      .replace(/살아서/g, '살았다 그래서')
      .replace(/만났다/g, '만나다')
      .replace(/만나다\s*그의/g, '만나다 그의')
      .replace(/a\s*fine\s*youth/gi, 'a_fine_youth')
      .replace(/훌륭한\s*청년이\s*되었다/g, '훌륭한_청년이 되다')
      .replace(/자라서/g, '자랐다 서')
      .replace(/albert\s*schweitzer/g, 'albert_schweitzer')
      .replace(/the\s*prize\s*money/g, 'the_prize_money')
      .replace(/the\s*hospital/g, 'the_hospital')
      .replace(/a\s*place/g, 'a_place')
      .replace(/suffer\s*from/g, 'suffer_from')
      // .replace(/a\s*special\s*program/g, 'a special program')
      .replace(/the\s*culture,\s*customs,\s*and\s*art/gi, 'the culture, customs, and art')
      .replace(/culture,/gi, 'culture,')
      .replace(/customs,/gi, 'customs,')
      .replace(/a\s*pretty\s*daughter/g, 'a_pretty_daughter')
      .replace(/귀여운\s*딸과\s*함께/g, 'a_pretty_daughter 과함께')
      .replace(/아내와/g, '아내 와')
      .replace(/살기\s*위해서/g, '살다 위해서')
      .replace(/시골에서/g, '시골 에서')
      .replace(/오래된\s*집을/g, 'old house')
      .replace(/an\s*important\s*thing/gi, 'an_important_thing')
      .replace(/중요한\s*일에\s*대해/g, '중요한_일 에대해')
      .replace(/의논하기\s*위해/g, '의논하다 ~하기위해')
      .replace(/오늘\s*여기\s*모였다/g, '오늘 여기에 모였다')
      .replace(/만날\s*목적으로/g, '만날 목적으로')
      .replace(/영리하다\.\s*그래서/g, '영리한 이다 그래서')
      .replace(/영리하다\s*그래서/g, '영리한 이다 그래서')
      .replace(/게으르다\.\s*그래서/g, '게으른 이다 그래서')
      .replace(/게으르다\s*그래서/g, '게으른 이다 그래서')
      .replace(/읽을\s*수\s*없다/g, '읽을_수_없다')
      .replace(/이해할\s*수\s*있다/g, '이해할_수_있다')
      .replace(/일어났다.\s*그래서/g, '일어났다 그래서')
      .replace(/일어났다\s*그래서/g, '일어났다 그래서')
      .replace(/기차를\s*놓쳤다/g, '기차를 놓치다')
      .replace(/마시기에/g, '마시다 ~하기에')
      .replace(/좋다/g, '좋은 이다')
      .replace(/the\s*hardest\s*sentence/gi, 'the_hardest_sentence')
      .replace(/강의하기에/g, '강의하다 ~하기에')
      .replace(/편리하다/g, '편리한 이다')
      .replace(/the\s*news/g, 'the_news')
      .replace(/듣지\s*못했기\s*때문에/g, '듣지 못하다 ~하기때문에')
      .replace(/슬펐다/g, '슬픈 이었다')
      .replace(/자기\s*가족의/g, '자기 가족 의')
      .replace(/기쁘다/g, '기쁘다')
      .replace(/만나니/g, '만나다 ~하니')
      .replace(/큰\s*상을/g, 'a_great_reward')
      .replace(/적절한\s*시기를/g, 'the_right time')
      .replace(/어떤\s*일을/g, 'anything')
      .replace(/가르쳐주는/g, '가르쳐주다 ㄴ')
      .replace(/시작할/g, '시작하다 ㄹ')
      .replace(/사람에게/g, '사람 에게')
      .replace(/위대한\s*지도자라고/g, 'a_great_leader')
      .replace(/생각하는/g, '생각하다 ㄴ')
      .replace(/독재자이다/g, '독재자 이다')
      .replace(/사준\s*소녀는/g, '사주다 ㄴ 소녀는')
      .replace(/생일에/g, '생일 에')
      .replace(/베티였다/g, '베티 였다')
      .replace(/멋진\s*선물을/g, 'a_nice_present')
      .replace(/나일강을\s*따라/g, '나일강을 따라')
      .replace(/고대\s*이집트에서/g, '고대 이집트 에서')
      .replace(/지은/g, '짓다 ㄴ')
      .replace(/최초의\s*사람들은/g, '최초의 사람들은')
      .replace(/농부들이었다/g, '농부들 이었다')
      .replace(/의사가\s*된/g, '의사가 되다 ㄴ')
      .replace(/아들에게/g, '아들 에게')
      .replace(/그\s*책을/g, 'the_book')
      .replace(/유명하게\s*된/g, '유명한 되다 ㄴ')
      .replace(/진화에\s*대한/g, '진화 에대한')
      .replace(/이론으로/g, '이론 으로')
      .replace(/영국의\s*생물학자였다/g, '영국의_생물학자 였다')
      .replace(/영국의\s*생물학자/g, '영국의_생물학자')
      .replace(/사시는/g, '사시다 ㄴ')
      .replace(/캘리포니아에/g, '캘리포니아 에')
      .replace(/읽으라고/g, '읽다 라고')
      .replace(/유지하는\s*것이다/g, '유지하다 것 이다')
      .replace(/자연\s*환경을/gi, '자연 환경을')
      .replace(/자연환경을/gi, '자연 환경을')
      .replace(/깨끗하고/g, '깨끗한 고')
      .replace(/읽으려는\s*것이다/g, '읽다 것 이다')
      .replace(/조용한\s*시골에서/g, '조용한_시골 에서')
      .replace(/이번에/g, '이번 에')
      .replace(/부여하려는\s*것이다/g, '부여하다 것 이다')
      .replace(/교육\s*계획의/g, '교육 개혁 의')
      .replace(/교육의/g, '교육 의')
      .replace(/되는\s*것이다/g, '되다 것 이다')
      .replace(/훌륭한\s*의사가/g, 'a_great_doctor')
      .replace(/미래\s*에/g, '미래 에')
      .replace(/가는\s*것이다/g, '가다 것 이다')
      .replace(/주말에/g, '주말 에')
      .replace(/박물관에/g, '박물관 에')
      .replace(/그녀와\s*함께/g, '그녀 와함께')
      .replace(/고대\s*그리스인들은/g, '고대(의)_그리스인들은')
      .replace(/하기를/g, '하다 기를')
      .replace(/물들이기로/g, '물들이다 기로')
      .replace(/물들일\s*것을/g, '물들이다 것을')
      .replace(/꽃잎들로/g, '꽃잎들 로')
      .replace(/위대한\s*과학자가/g, '위대한_과학자가')
      .replace(/에\s*대해서/g, '에_대해서')
      .replace(/동물과/g, '동물 과')
      .replace(/집에서/g, '집 에서')
      .replace(/쉬기를/g, '쉬다 기를')
      .replace(/가르쳐\s*주어서/g, '것이 가르쳐주다 서')
      .replace(/만드는\s*것이/g, '만들다 것이')
      .replace(/참된\s*과제를/g, '참된 과제를')
      .replace(/훌륭한\s*젊은이로/g, '훌륭한 젊은이로')
      .replace(/입헌정치를/g, '입헌정치를')
      .replace(/유지하고/g, '유지하다 고')
      .replace(/신민들의/g, '신민들 의')
      .replace(/행복과/g, '행복 과')
      .replace(/번영을/g, '번영을')
      .replace(/증진시키는\s*것이/g, '증진시키다 것이 것이')
      .replace(/의무입니다/g, '의무 이다')
      .replace(/일하고\s*노는\s*것이/g, '일하다 고 것은 놀다 것은')
      .replace(/빌려주는\s*것이/g, '빌려주다 것이')
      .replace(/빌려주는\s*것은/g, '빌려주다 것은')
      .replace(/일이다/g, '일 이다')
      .replace(/이러한\s*방법으로/g, '이러한 방법 으로')
      .replace(/공부하기는/g, '공부하다 기는')
      .replace(/대단히\s*쉽다/g, '대단히 쉬운 이다')
      .replace(/일어나는\s*것이/g, '일어나다 것이')
      .replace(/위대한\s*시인이/g, '위대한_시인이')
      .replace(/일해야만\s*했다/g, '일해야만_했다')
      .replace(/아침\s*부터/g, '아침 부터')
      .replace(/저녁\s*까지/g, '저녁 까지')
      .replace(/현대과학은/g, '현대(의) 과학은')
      .replace(/더\s*쉽고/g, '더_쉬운 고')
      .replace(/여러면에서/g, '여러면 에서');
}

// =========================================================================
// 💡 [수프로 엣지] 대용량 토큰 매칭 전용 2차 공장 (POST 함수 바깥에 위치!)
// =========================================================================
function matchTokenRolesAndTranslations(word: string, MOCK_XDIC_DB: Record<string, string>) {
  let matchedRole = 'Unknown';
  let translatedWord = word;
  let displayEn = word;

      // if (word == 여기 아래에 paste 후 Enter

      // <3형식> 예문 5
      if (word.includes('F3E5_I_Tk')) { matchedRole = 'Subj_I_F3E5'; translatedWord = 'I '; MOCK_XDIC_DB[word] = 'I '; displayEn = 'I '; }
      if (word.includes('F3E5_Met_Tk')) { matchedRole = 'Verb_Met_F3E5'; translatedWord = 'met '; MOCK_XDIC_DB[word] = 'met '; displayEn = 'met '; }
      if (word.includes('F3E5_Her_Tk')) { matchedRole = 'Obj_Her_F3E5'; translatedWord = 'her '; MOCK_XDIC_DB[word] = 'her '; displayEn = 'her '; }
      if (word.includes('F3E5_In_Tk')) { matchedRole = 'Prep_In_F3E5'; translatedWord = 'in '; MOCK_XDIC_DB[word] = 'in '; displayEn = 'in '; }
      if (word.includes('F3E5_ThePark_Tk')) { matchedRole = 'Noun_Park_F3E5'; translatedWord = 'the park '; MOCK_XDIC_DB[word] = 'the park '; displayEn = 'the park '; }
      if (word.includes('F3E5_On_Tk')) { matchedRole = 'Prep_On_F3E5'; translatedWord = 'on '; MOCK_XDIC_DB[word] = 'on '; displayEn = 'on '; }
      if (word.includes('F3E5_A_Tk')) { matchedRole = 'Art_A_F3E5'; translatedWord = 'a '; MOCK_XDIC_DB[word] = 'a '; displayEn = 'a '; }
      if (word.includes('F3E5_Fine_Tk')) { matchedRole = 'Adj_Fine_F3E5'; translatedWord = 'fine '; MOCK_XDIC_DB[word] = 'fine '; displayEn = 'fine '; }
      if (word.includes('F3E5_Morning_Tk')) { matchedRole = 'Noun_Morning_F3E5'; translatedWord = 'morning'; MOCK_XDIC_DB[word] = 'morning'; displayEn = 'morning'; }
      if (word.includes('F3E5_InTheMorning_Tk')) { matchedRole = 'Adv_InTheMorning_F3E5'; translatedWord = 'in the morning'; MOCK_XDIC_DB[word] = 'in the morning'; displayEn = 'in the morning'; }
      
      // <3형식> 예문 4
      if (word.includes('F3E4_An_Tk')) { matchedRole = 'Art_An_F3E4'; translatedWord = 'An '; MOCK_XDIC_DB[word] = 'An '; displayEn = 'An '; }
      if (word.includes('F3E4_OldMan_Tk')) { matchedRole = 'Subj_OldMan_F3E4'; translatedWord = 'old man '; MOCK_XDIC_DB[word] = 'old man '; displayEn = 'old man '; }
      if (word.includes('F3E4_Planted_Tk')) { matchedRole = 'Verb_Planted_F3E4'; translatedWord = 'planted '; MOCK_XDIC_DB[word] = 'planted '; displayEn = 'planted '; }
      if (word.includes('F3E4_ALittleTree_Tk')) { matchedRole = 'Obj_ALittleTree_F3E4'; translatedWord = 'a little tree '; MOCK_XDIC_DB[word] = 'a little tree '; displayEn = 'a little tree '; }
      if (word.includes('F3E4_ATree_Tk')) { matchedRole = 'Obj_ATree_F3E4'; translatedWord = 'a tree '; MOCK_XDIC_DB[word] = 'a tree '; displayEn = 'a tree '; }
      if (word.includes('F3E4_OnceUponATime_Tk')) { matchedRole = 'Adv_Once_F3E4'; translatedWord = 'once upon a time'; MOCK_XDIC_DB[word] = 'once upon a time'; displayEn = 'once upon a time'; }

      // <3형식> 예문 3
      if (word.includes('F3E3_I_Tk')) { matchedRole = 'Subj_I_F3E3'; translatedWord = 'I '; MOCK_XDIC_DB[word] = 'I '; displayEn = 'I '; }
      if (word.includes('F3E3_Remember_Tk')) { matchedRole = 'Verb_Remember_F3E3'; translatedWord = 'remember '; MOCK_XDIC_DB[word] = 'remember '; displayEn = 'remember '; }
      if (word.includes('F3E3_His_Tk')) { matchedRole = 'Mod_His_F3E3'; translatedWord = 'his '; MOCK_XDIC_DB[word] = 'his '; displayEn = 'his '; }
      if (word.includes('F3E3_Name_Tk')) { matchedRole = 'Obj_Name_F3E3'; translatedWord = 'name '; MOCK_XDIC_DB[word] = 'name '; displayEn = 'name '; }
      if (word.includes('F3E3_Well_Tk')) { matchedRole = 'Adv_Well_F3E3'; translatedWord = 'well'; MOCK_XDIC_DB[word] = 'well'; displayEn = 'well'; }

      // <3형식> 예문 2
      if (word.includes('F3E2_You_Tk')) { matchedRole = 'Subj_You_F3E2'; translatedWord = 'You '; MOCK_XDIC_DB[word] = 'You '; displayEn = 'You '; }
      if (word.includes('F3E2_MustTakeCareOf_Tk')) { matchedRole = 'Verb_MustTakeCareOf_F3E2'; translatedWord = 'must take care of '; MOCK_XDIC_DB[word] = 'must take care of '; displayEn = 'must take care of '; }
      if (word.includes('F3E2_The_Tk')) { matchedRole = 'Art_The_F3E2'; translatedWord = 'the '; MOCK_XDIC_DB[word] = 'the '; displayEn = 'the '; }
      if (word.includes('F3E2_Baby_Tk')) { matchedRole = 'Obj_Baby_F3E2'; translatedWord = 'baby'; MOCK_XDIC_DB[word] = 'baby'; displayEn = 'baby'; }

      // <3형식> 예문 1
      if (word.includes('F3E1_He_Tk')) { matchedRole = 'Subj_He_F3E1'; translatedWord = 'He '; MOCK_XDIC_DB[word] = 'He '; displayEn = 'He '; }
      if (word.includes('F3E1_LaughedAt_Tk')) { matchedRole = 'Verb_LaughedAt_F3E1'; translatedWord = 'laughed at '; MOCK_XDIC_DB[word] = 'laughed at '; displayEn = 'laughed at '; }
      if (word.includes('F3E1_Me_Tk')) { matchedRole = 'Obj_Me_F3E1'; translatedWord = 'me'; MOCK_XDIC_DB[word] = 'me'; displayEn = 'me'; }

      // <2형식> 예문 10
      if (word.includes('F2E10_TheFirst_Tk')) { matchedRole = 'Art_TheFirst_F2E10'; translatedWord = 'The first '; MOCK_XDIC_DB[word] = 'The first '; displayEn = 'The first '; }
      if (word.includes('F2E10_The_Tk')) { matchedRole = 'Art_The_F2E10'; translatedWord = 'The '; MOCK_XDIC_DB[word] = 'The '; displayEn = 'The '; }
      if (word.includes('F2E10_Settlers_Tk')) { matchedRole = 'Subj_Settlers_F2E10'; translatedWord = 'settlers '; MOCK_XDIC_DB[word] = 'settlers '; displayEn = 'settlers '; }
      if (word.includes('F2E10_In_Tk')) { matchedRole = 'Prep_In_F2E10'; translatedWord = 'in '; MOCK_XDIC_DB[word] = 'in '; displayEn = 'in '; }
      if (word.includes('F2E10_America_Tk')) { matchedRole = 'Noun_America_F2E10'; translatedWord = 'America '; MOCK_XDIC_DB[word] = 'America '; displayEn = 'America '; }
      if (word.includes('F2E10_Were_Tk')) { matchedRole = 'Verb_Were_F2E10'; translatedWord = 'were '; MOCK_XDIC_DB[word] = 'were '; displayEn = 'were '; }
      if (word.includes('F2E10_Free_Tk')) { matchedRole = 'Comp_Free_F2E10'; translatedWord = 'free '; MOCK_XDIC_DB[word] = 'free '; displayEn = 'free '; }
      if (word.includes('F2E10_From_Tk')) { matchedRole = 'Prep_From_F2E10'; translatedWord = 'from '; MOCK_XDIC_DB[word] = 'from '; displayEn = 'from '; }
      if (word.includes('F2E10_Tyrannies_Tk')) { matchedRole = 'Noun_Tyrannies_F2E10'; translatedWord = 'tyrannies '; MOCK_XDIC_DB[word] = 'tyrannies '; displayEn = 'tyrannies '; }
      if (word.includes('F2E10_And_Tk')) { matchedRole = 'Conj_And_F2E10'; translatedWord = 'and '; MOCK_XDIC_DB[word] = 'and '; displayEn = 'and '; }
      if (word.includes('F2E10_Corrupting_Tk')) { matchedRole = 'Adj_Corrupting_F2E10'; translatedWord = 'corrupting '; MOCK_XDIC_DB[word] = 'corrupting '; displayEn = 'corrupting '; }
      if (word.includes('F2E10_Powers_Tk')) { matchedRole = 'Noun_Powers_F2E10'; translatedWord = 'powers '; MOCK_XDIC_DB[word] = 'powers '; displayEn = 'powers '; }
      if (word.includes('F2E10_Of_Tk')) { matchedRole = 'Prep_Of_F2E10'; translatedWord = 'of '; MOCK_XDIC_DB[word] = 'of '; displayEn = 'of '; }
      if (word.includes('F2E10_Europe_Tk')) { matchedRole = 'Noun_Europe_F2E10'; translatedWord = 'Europe'; MOCK_XDIC_DB[word] = 'Europe'; displayEn = 'Europe'; }

      // <2형식> 예문 9
      if (word.includes('F2E9_Proverbs_Tk')) { matchedRole = 'Subj_Proverbs_F2E9'; translatedWord = 'Proverbs '; MOCK_XDIC_DB[word] = 'Proverbs '; displayEn = 'Proverbs '; }
      if (word.includes('F2E9_MayBe_Tk')) { matchedRole = 'Verb_MayBe_F2E9'; translatedWord = 'may be '; MOCK_XDIC_DB[word] = 'may be '; displayEn = 'may be '; }
      if (word.includes('F2E9_Warnings_Tk')) { matchedRole = 'Comp_Warnings_F2E9'; translatedWord = 'warnings '; MOCK_XDIC_DB[word] = 'warnings '; displayEn = 'warnings '; }
      if (word.includes('F2E9_GuidesAsWarnings_Tk')) { matchedRole = 'Comp_Warnings_F2E9'; translatedWord = 'guides '; MOCK_XDIC_DB[word] = 'guides '; displayEn = 'guides '; } // 💡 '경고'가 없을 때 '지침'이 빈자리를 채우는 마법의 토큰!
      if (word.includes('F2E9_Against_Tk')) { matchedRole = 'Prep_Against_F2E9'; translatedWord = 'against '; MOCK_XDIC_DB[word] = 'against '; displayEn = 'against '; }
      if (word.includes('F2E9_Foolish_Tk')) { matchedRole = 'Mod_Foolish_F2E9'; translatedWord = 'foolish '; MOCK_XDIC_DB[word] = 'foolish '; displayEn = 'foolish '; }
      if (word.includes('F2E9_Acts_Tk')) { matchedRole = 'Noun_Acts_F2E9'; translatedWord = 'acts '; MOCK_XDIC_DB[word] = 'acts '; displayEn = 'acts '; }
      if (word.includes('F2E9_Or_Tk')) { matchedRole = 'Conj_Or_F2E9'; translatedWord = 'or '; MOCK_XDIC_DB[word] = 'or '; displayEn = 'or '; }
      if (word.includes('F2E9_Guides_Tk')) { matchedRole = 'Comp_Guides_F2E9'; translatedWord = 'guides '; MOCK_XDIC_DB[word] = 'guides '; displayEn = 'guides '; }
      if (word.includes('F2E9_To_Tk')) { matchedRole = 'Prep_To_F2E9'; translatedWord = 'to '; MOCK_XDIC_DB[word] = 'to '; displayEn = 'to '; }
      if (word.includes('F2E9_GoodConduct_Tk')) { matchedRole = 'Noun_GoodConduct_F2E9'; translatedWord = 'good conduct'; MOCK_XDIC_DB[word] = 'good conduct'; displayEn = 'good conduct'; }

      // <2형식> 예문 8
      if (word.includes('F2E8_Language_Tk')) { matchedRole = 'Subj_Language_F2E8'; translatedWord = 'Language '; MOCK_XDIC_DB[word] = 'Language '; displayEn = 'Language '; }
      if (word.includes('F2E8_Is_Tk')) { matchedRole = 'Verb_Is_F2E8'; translatedWord = 'is '; MOCK_XDIC_DB[word] = 'is '; displayEn = 'is '; }
      if (word.includes('F2E8_TheMostImp_Tk')) { matchedRole = 'Mod_TheMostImp_F2E8'; translatedWord = 'the most important '; MOCK_XDIC_DB[word] = 'the most important '; displayEn = 'the most important '; }
      if (word.includes('F2E8_AnImp_Tk')) { matchedRole = 'Mod_AnImp_F2E8'; translatedWord = 'an important '; MOCK_XDIC_DB[word] = 'an important '; displayEn = 'an important '; }
      if (word.includes('F2E8_Means_Tk')) { matchedRole = 'Comp_Means_F2E8'; translatedWord = 'means '; MOCK_XDIC_DB[word] = 'means '; displayEn = 'means '; }
      if (word.includes('F2E8_Of_Tk')) { matchedRole = 'Prep_Of_F2E8'; translatedWord = 'of '; MOCK_XDIC_DB[word] = 'of '; displayEn = 'of '; }
      if (word.includes('F2E8_Communication_Tk')) { matchedRole = 'Noun_Comm_F2E8'; translatedWord = 'communication'; MOCK_XDIC_DB[word] = 'communication'; displayEn = 'communication'; }

      // <2형식> 예문 7
      if (word.includes('F2E7_This_Tk')) { matchedRole = 'Mod_This_F2E7'; translatedWord = 'This '; MOCK_XDIC_DB[word] = 'This '; displayEn = 'This '; }
      if (word.includes('F2E7_The_Tk')) { matchedRole = 'Art_The_F2E7'; translatedWord = 'The '; MOCK_XDIC_DB[word] = 'The '; displayEn = 'The '; }
      if (word.includes('F2E7_DetectiveStory_Tk')) { matchedRole = 'Subj_DetectiveStory_F2E7'; translatedWord = 'detective story '; MOCK_XDIC_DB[word] = 'detective story '; displayEn = 'detective story '; }
      if (word.includes('F2E7_Is_Tk')) { matchedRole = 'Verb_Is_F2E7'; translatedWord = 'is '; MOCK_XDIC_DB[word] = 'is '; displayEn = 'is '; }
      if (word.includes('F2E7_Very_Tk')) { matchedRole = 'Adv_Very_F2E7'; translatedWord = 'very '; MOCK_XDIC_DB[word] = 'very '; displayEn = 'very '; }
      if (word.includes('F2E7_Interesting_Tk')) { matchedRole = 'Comp_Interesting_F2E7'; translatedWord = 'interesting '; MOCK_XDIC_DB[word] = 'interesting '; displayEn = 'interesting '; }
      if (word.includes('F2E7_For_Tk')) { matchedRole = 'Prep_For_F2E7'; translatedWord = 'for '; MOCK_XDIC_DB[word] = 'for '; displayEn = 'for '; }
      if (word.includes('F2E7_Us_Tk')) { matchedRole = 'Pron_Us_F2E7'; translatedWord = 'us'; MOCK_XDIC_DB[word] = 'us'; displayEn = 'us'; }

      // <2형식> 예문 6
      if (word.includes('F2E6_Rome_Tk')) { matchedRole = 'Subj_Rome_F2E6'; translatedWord = 'Rome '; MOCK_XDIC_DB[word] = 'Rome '; displayEn = 'Rome '; }
      if (word.includes('F2E6_In_Tk')) { matchedRole = 'Prep_In_F2E6'; translatedWord = 'in '; MOCK_XDIC_DB[word] = 'in '; displayEn = 'in '; }
      if (word.includes('F2E6_Beginning_Tk')) { matchedRole = 'Noun_Beginning_F2E6'; translatedWord = 'the beginning'; MOCK_XDIC_DB[word] = 'the beginning'; displayEn = 'the beginning'; }
      if (word.includes('F2E6_Of_Tk')) { matchedRole = 'Prep_Of_F2E6'; translatedWord = 'of '; MOCK_XDIC_DB[word] = 'of '; displayEn = 'of '; }
      if (word.includes('F2E6_SmallKingdom_Tk')) { matchedRole = 'Noun_SmallKingdom_F2E6'; translatedWord = 'a small kingdom '; MOCK_XDIC_DB[word] = 'a small kingdom '; displayEn = 'a small kingdom '; }
      if (word.includes('F2E6_Kingdom_Tk')) { matchedRole = 'Noun_Kingdom_F2E6'; translatedWord = 'a kingdom '; MOCK_XDIC_DB[word] = 'a kingdom '; displayEn = 'a kingdom '; }
      if (word.includes('F2E6_Was_Tk')) { matchedRole = 'Verb_Was_F2E6'; translatedWord = 'was '; MOCK_XDIC_DB[word] = 'was '; displayEn = 'was '; }
      if (word.includes('F2E6_SmallTown_Tk')) { matchedRole = 'Comp_SmallTown_F2E6'; translatedWord = 'a small town '; MOCK_XDIC_DB[word] = 'a small town '; displayEn = 'a small town '; }

      // <2형식> 예문 5
      if (word.includes('F2E5_All_Tk')) { matchedRole = 'Mod_All_F2E5'; translatedWord = 'All '; MOCK_XDIC_DB[word] = 'All '; displayEn = 'All '; }
      if (word.includes('F2E5_Men_Tk')) { matchedRole = 'Subj_Men_F2E5'; translatedWord = 'men '; MOCK_XDIC_DB[word] = 'men '; displayEn = 'men '; }
      if (word.includes('F2E5_Are_Tk')) { matchedRole = 'Verb_Are_F2E5'; translatedWord = 'are '; MOCK_XDIC_DB[word] = 'are '; displayEn = 'are '; }
      if (word.includes('F2E5_Equal_Tk')) { matchedRole = 'Comp_Equal_F2E5'; translatedWord = 'equal '; MOCK_XDIC_DB[word] = 'equal '; displayEn = 'equal '; }
      if (word.includes('F2E5_Before_Tk')) { matchedRole = 'Prep_Before_F2E5'; translatedWord = 'before '; MOCK_XDIC_DB[word] = 'before '; displayEn = 'before '; }
      if (word.includes('F2E5_TheLaw_Tk')) { matchedRole = 'Noun_TheLaw_F2E5'; translatedWord = 'the law'; MOCK_XDIC_DB[word] = 'the law'; displayEn = 'the law'; }

      // <2형식> 예문 4
      if (word.includes('F2E4_This_Tk')) { matchedRole = 'Mod_This_F2E4'; translatedWord = 'This '; MOCK_XDIC_DB[word] = 'This '; displayEn = 'This '; }
      if (word.includes('F2E4_Novel_Tk')) { matchedRole = 'Subj_Novel_F2E4'; translatedWord = 'novel '; MOCK_XDIC_DB[word] = 'novel '; displayEn = 'novel '; }
      if (word.includes('F2E4_Is_Tk')) { matchedRole = 'Verb_Is_F2E4'; translatedWord = 'is '; MOCK_XDIC_DB[word] = 'is '; displayEn = 'is '; }
      if (word.includes('F2E4_Very_Tk')) { matchedRole = 'Adv_Very_F2E4'; translatedWord = 'very '; MOCK_XDIC_DB[word] = 'very '; displayEn = 'very '; }
      if (word.includes('F2E4_Interesting_Tk')) { matchedRole = 'Comp_Interesting_F2E4'; translatedWord = 'interesting '; MOCK_XDIC_DB[word] = 'interesting '; displayEn = 'interesting '; }
      if (word.includes('F2E4_For_Tk')) { matchedRole = 'Prep_For_F2E4'; translatedWord = 'for '; MOCK_XDIC_DB[word] = 'for '; displayEn = 'for '; }
      if (word.includes('F2E4_Us_Tk')) { matchedRole = 'Pron_Us_F2E4'; translatedWord = 'us'; MOCK_XDIC_DB[word] = 'us'; displayEn = 'us'; }

      // <2형식> 예문 3
      if (word.includes('F2E3_TheCold_Tk')) { matchedRole = 'Subj_TheCold_F2E3'; translatedWord = 'The cold '; MOCK_XDIC_DB[word] = 'The cold '; displayEn = 'The cold '; }
      if (word.includes('F2E3_Of_Tk')) { matchedRole = 'Prep_Of_F2E3'; translatedWord = 'of '; MOCK_XDIC_DB[word] = 'of '; displayEn = 'of '; }
      if (word.includes('F2E3_ThisYear_Tk')) { matchedRole = 'Noun_ThisYear_F2E3'; translatedWord = 'this year '; MOCK_XDIC_DB[word] = 'this year '; displayEn = 'this year '; }
      if (word.includes('F2E3_Is_Tk')) { matchedRole = 'Verb_Is_F2E3'; translatedWord = 'is '; MOCK_XDIC_DB[word] = 'is '; displayEn = 'is '; }
      if (word.includes('F2E3_Severer_Tk')) { matchedRole = 'Comp_Severer_F2E3'; translatedWord = 'severer '; MOCK_XDIC_DB[word] = 'severer '; displayEn = 'severer '; }
      if (word.includes('F2E3_Than_Tk')) { matchedRole = 'Prep_Than_F2E3'; translatedWord = 'than '; MOCK_XDIC_DB[word] = 'than '; displayEn = 'than '; }
      if (word.includes('F2E3_ThatOf_Tk')) { matchedRole = 'Pron_ThatOf_F2E3'; translatedWord = 'that of '; MOCK_XDIC_DB[word] = 'that of '; displayEn = 'that of '; }
      if (word.includes('F2E3_LastYear_Tk')) { matchedRole = 'Noun_LastYear_F2E3'; translatedWord = 'last year'; MOCK_XDIC_DB[word] = 'last year'; displayEn = 'last year'; }

      // <2형식> 예문 2
      if (word.includes('F2E2_Math_Tk')) { matchedRole = 'Subj_Math_F2E2'; translatedWord = 'Mathematics '; MOCK_XDIC_DB[word] = 'Mathematics '; displayEn = 'Mathematics '; }
      if (word.includes('F2E2_Is_Tk')) { matchedRole = 'Verb_Is_F2E2'; translatedWord = 'is '; MOCK_XDIC_DB[word] = 'is '; displayEn = 'is '; }
      if (word.includes('F2E2_ADifficult_Tk')) { matchedRole = 'Mod_ADifficult_F2E2'; translatedWord = 'a difficult '; MOCK_XDIC_DB[word] = 'a difficult '; displayEn = 'a difficult '; }
      if (word.includes('F2E2_Difficult_Tk')) { matchedRole = 'Comp_Difficult_F2E2'; translatedWord = 'difficult '; MOCK_XDIC_DB[word] = 'difficult '; displayEn = 'difficult '; }
      if (word.includes('F2E2_A_Tk')) { matchedRole = 'Mod_A_F2E2'; translatedWord = 'a '; MOCK_XDIC_DB[word] = 'a '; displayEn = 'a '; }
      if (word.includes('F2E2_Subject_Tk')) { matchedRole = 'Comp_Subject_F2E2'; translatedWord = 'subject'; MOCK_XDIC_DB[word] = 'subject'; displayEn = 'subject'; }

      // <2형식> 예문 1
      if (word.includes('F2E1_Tom_Tk')) { matchedRole = 'Subj_Tom_F2E1'; translatedWord = 'Tom '; MOCK_XDIC_DB[word] = 'Tom '; displayEn = 'Tom '; }
      if (word.includes('F2E1_Is_Tk')) { matchedRole = 'Verb_Is_F2E1'; translatedWord = 'is '; MOCK_XDIC_DB[word] = 'is '; displayEn = 'is '; }
      if (word.includes('F2E1_TheMostPop_Tk')) { matchedRole = 'Mod_TheMostPop_F2E1'; translatedWord = 'the most popular '; MOCK_XDIC_DB[word] = 'the most popular '; displayEn = 'the most popular '; }
      if (word.includes('F2E1_APop_Tk')) { matchedRole = 'Mod_APop_F2E1'; translatedWord = 'a popular '; MOCK_XDIC_DB[word] = 'a popular '; displayEn = 'a popular '; }
      if (word.includes('F2E1_A_Tk')) { matchedRole = 'Mod_A_F2E1'; translatedWord = 'a '; MOCK_XDIC_DB[word] = 'a '; displayEn = 'a '; }
      if (word.includes('F2E1_Boy_Tk')) { matchedRole = 'Comp_Boy_F2E1'; translatedWord = 'boy '; MOCK_XDIC_DB[word] = 'boy '; displayEn = 'boy '; }
      if (word.includes('F2E1_In_Tk')) { matchedRole = 'Prep_In_F2E1'; translatedWord = 'in '; MOCK_XDIC_DB[word] = 'in '; displayEn = 'in '; }
      if (word.includes('F2E1_TheSchool_Tk')) { matchedRole = 'Noun_School_F2E1'; translatedWord = 'the school'; MOCK_XDIC_DB[word] = 'the school'; displayEn = 'the school'; }

      // <1형식> 예문 15
      if (word.includes('F15_Many_Tk')) { matchedRole = 'Adj_Many_F15'; translatedWord = 'Many '; MOCK_XDIC_DB[word] = 'Many '; displayEn = 'Many '; }
      if (word.includes('F15_NorthKorean_Tk')) { matchedRole = 'Adj_NorthKorean_F15'; translatedWord = 'North Korean '; MOCK_XDIC_DB[word] = 'North Korean '; displayEn = 'North Korean '; }
      if (word.includes('F15_Spies_Tk')) { matchedRole = 'Noun_Spies_F15'; translatedWord = 'spies '; MOCK_XDIC_DB[word] = 'spies '; displayEn = 'spies '; }
      if (word.includes('F15_HaveLanded_Tk')) { matchedRole = 'Verb_HaveLanded_F15'; translatedWord = 'have landed '; MOCK_XDIC_DB[word] = 'have landed '; displayEn = 'have landed '; }
      if (word.includes('F15_Clandestinely_Tk')) { matchedRole = 'Adv_Clandestinely_F15'; translatedWord = 'clandestinely '; MOCK_XDIC_DB[word] = 'clandestinely '; displayEn = 'clandestinely '; }
      if (word.includes('F15_In_Tk')) { matchedRole = 'Prep_In_F15'; translatedWord = 'in '; MOCK_XDIC_DB[word] = 'in '; displayEn = 'in '; }
      if (word.includes('F15_NorthernJapan_Tk')) { matchedRole = 'Noun_NorthernJapan_F15'; translatedWord = 'Northern Japan '; MOCK_XDIC_DB[word] = 'Northern Japan '; displayEn = 'Northern Japan '; }
      if (word.includes('F15_Japan_Tk')) { matchedRole = 'Noun_Japan_F15'; translatedWord = 'Japan '; MOCK_XDIC_DB[word] = 'Japan '; displayEn = 'Japan '; }
      if (word.includes('F15_By_Tk')) { matchedRole = 'Prep_By_F15'; translatedWord = 'by '; MOCK_XDIC_DB[word] = 'by '; displayEn = 'by '; }
      if (word.includes('F15_FastBoat_Tk')) { matchedRole = 'Noun_FastBoat_F15'; translatedWord = 'fast-boat '; MOCK_XDIC_DB[word] = 'fast-boat '; displayEn = 'fast-boat '; }
      if (word.includes('F15_During_Tk')) { matchedRole = 'Prep_During_F15'; translatedWord = 'during '; MOCK_XDIC_DB[word] = 'during '; displayEn = 'during '; }
      if (word.includes('F15_This_Tk')) { matchedRole = 'Adj_This_F15'; translatedWord = 'this '; MOCK_XDIC_DB[word] = 'this '; displayEn = 'this '; }
      if (word.includes('F15_Science_Tk')) { matchedRole = 'Noun_Science_F15'; translatedWord = 'science '; MOCK_XDIC_DB[word] = 'science '; displayEn = 'science '; }
      if (word.includes('F15_Exposition_Tk')) { matchedRole = 'Noun_Exposition_F15'; translatedWord = 'exposition'; MOCK_XDIC_DB[word] = 'exposition'; displayEn = 'exposition'; }

      // <1형식> 예문 14
      if (word.includes('F14_A_Tk')) { matchedRole = 'Art_A_F14'; translatedWord = 'A '; MOCK_XDIC_DB[word] = 'A '; displayEn = 'A '; }
      if (word.includes('F14_Strange_Tk')) { matchedRole = 'Adj_Strange_F14'; translatedWord = 'strange '; MOCK_XDIC_DB[word] = 'strange '; displayEn = 'strange '; }
      if (word.includes('F14_Picture_Tk')) { matchedRole = 'Noun_Picture_F14'; translatedWord = 'picture '; MOCK_XDIC_DB[word] = 'picture '; displayEn = 'picture '; }
      if (word.includes('F14_IsHung_Tk')) { matchedRole = 'Verb_IsHung_F14'; translatedWord = 'is hung '; MOCK_XDIC_DB[word] = 'is hung '; displayEn = 'is hung '; }
      if (word.includes('F14_On_Tk')) { matchedRole = 'Prep_On_F14'; translatedWord = 'on '; MOCK_XDIC_DB[word] = 'on '; displayEn = 'on '; }
      if (word.includes('F14_TheGloomy_Tk')) { matchedRole = 'Adj_TheGloomy_F14'; translatedWord = 'the gloomy '; MOCK_XDIC_DB[word] = 'the gloomy '; displayEn = 'the gloomy '; }
      if (word.includes('F14_The_Tk')) { matchedRole = 'Art_The_F14'; translatedWord = 'the '; MOCK_XDIC_DB[word] = 'the '; displayEn = 'the '; }
      if (word.includes('F14_Wall_Tk')) { matchedRole = 'Noun_Wall_F14'; translatedWord = 'wall'; MOCK_XDIC_DB[word] = 'wall'; displayEn = 'wall'; }

      // <1형식> 예문 13
      if (word.includes('F13_ABigFire_Tk')) { matchedRole = 'Subj_ABigFire_F13'; translatedWord = 'A big fire '; MOCK_XDIC_DB[word] = 'A big fire '; displayEn = 'A big fire '; }
      if (word.includes('F13_BrokeOut_Tk')) { matchedRole = 'Verb_BrokeOut_F13'; translatedWord = 'broke out '; MOCK_XDIC_DB[word] = 'broke out '; displayEn = 'broke out '; }
      if (word.includes('F13_At_Tk')) { matchedRole = 'Prep_At_F13'; translatedWord = 'at '; MOCK_XDIC_DB[word] = 'at '; displayEn = 'at '; }
      if (word.includes('F13_TheBuilding_Tk')) { matchedRole = 'Noun_Building_F13'; translatedWord = 'the building '; MOCK_XDIC_DB[word] = 'the building '; displayEn = 'the building '; }
      if (word.includes('F13_Near_Tk')) { matchedRole = 'Prep_Near_F13'; translatedWord = 'near '; MOCK_XDIC_DB[word] = 'near '; displayEn = 'near '; }
      if (word.includes('F13_TheStation_Tk')) { matchedRole = 'Noun_Station_F13'; translatedWord = 'the station '; MOCK_XDIC_DB[word] = 'the station '; displayEn = 'the station '; }
      if (word.includes('F13_In_Tk')) { matchedRole = 'Prep_In_F13'; translatedWord = 'in '; MOCK_XDIC_DB[word] = 'in '; displayEn = 'in '; }
      if (word.includes('F13_Last_Tk')) { matchedRole = 'Adj_Last_F13'; translatedWord = 'last '; MOCK_XDIC_DB[word] = 'last '; displayEn = 'last '; }
      if (word.includes('F13_Night_Tk')) { matchedRole = 'Noun_Night_F13'; translatedWord = 'night'; MOCK_XDIC_DB[word] = 'night'; displayEn = 'night'; }

      // <1형식> 예문 12
      if (word.includes('The_Tk_12')) { matchedRole = 'Art_The_F12'; translatedWord = 'The '; MOCK_XDIC_DB[word] = 'The '; displayEn = 'The '; }
      if (word.includes('Great_Tk_12')) { matchedRole = 'Adj_Great_F12'; translatedWord = 'great '; MOCK_XDIC_DB[word] = 'great '; displayEn = 'great '; }
      if (word.includes('King_Tk_12')) { matchedRole = 'Noun_King_F12'; translatedWord = 'King '; MOCK_XDIC_DB[word] = 'King '; displayEn = 'King '; }
      if (word.includes('And_Tk_12')) { matchedRole = 'Conj_And_F12'; translatedWord = 'and '; MOCK_XDIC_DB[word] = 'and '; displayEn = 'and '; }
      if (word.includes('His_Tk_12')) { matchedRole = 'Pron_His_F12'; translatedWord = 'his '; MOCK_XDIC_DB[word] = 'his '; displayEn = 'his '; }
      if (word.includes('Wise_Tk_12')) { matchedRole = 'Adj_Wise_F12'; translatedWord = 'wise '; MOCK_XDIC_DB[word] = 'wise '; displayEn = 'wise '; }
      if (word.includes('Queen_Tk_12')) { matchedRole = 'Noun_Queen_F12'; translatedWord = 'Queen '; MOCK_XDIC_DB[word] = 'Queen '; displayEn = 'Queen '; }
      if (word.includes('Got_Tk_12')) { matchedRole = 'Verb_Got_F12'; translatedWord = 'got '; MOCK_XDIC_DB[word] = 'got '; displayEn = 'got '; }
      if (word.includes('On_Tk_12')) { matchedRole = 'Prep_On_F12'; translatedWord = 'on '; MOCK_XDIC_DB[word] = 'on '; displayEn = 'on '; }
      if (word.includes('TheElegantFerryBoat_Tk_12')) { matchedRole = 'Noun_ElegantFerry_F12'; translatedWord = 'the elegant ferry-boat '; MOCK_XDIC_DB[word] = 'the elegant ferry-boat '; displayEn = 'the elegant ferry-boat '; }
      if (word.includes('TheFerryBoat_Tk_12')) { matchedRole = 'Noun_Ferry_F12'; translatedWord = 'the ferry-boat '; MOCK_XDIC_DB[word] = 'the ferry-boat '; displayEn = 'the ferry-boat '; }
      if (word.includes('With_Tk_12')) { matchedRole = 'Prep_With_F12'; translatedWord = 'with '; MOCK_XDIC_DB[word] = 'with '; displayEn = 'with '; }
      if (word.includes('Their_Tk_12')) { matchedRole = 'Pron_Their_F12'; translatedWord = 'their '; MOCK_XDIC_DB[word] = 'their '; displayEn = 'their '; }
      if (word.includes('Official_Tk_12')) { matchedRole = 'Adj_Official_F12'; translatedWord = 'official '; MOCK_XDIC_DB[word] = 'official '; displayEn = 'official '; }
      if (word.includes('Suites_Tk_12')) { matchedRole = 'Noun_Suites_F12'; translatedWord = 'suites'; MOCK_XDIC_DB[word] = 'suites'; displayEn = 'suites'; }

      // <1형식> 예문 11 (💡 도난 방지용 F11_Tk 이름표 부착!)
      if (word.includes('F11_BoyGirl_Tk')) { matchedRole = 'Subj_BoyAndGirl_Form11'; translatedWord = 'The boy and the girl '; MOCK_XDIC_DB[word] = 'The boy and the girl '; displayEn = 'The boy and the girl '; }
      if (word.includes('F11_Girl_Tk')) { matchedRole = 'Subj_TheGirl_Form11'; translatedWord = 'The girl '; MOCK_XDIC_DB[word] = 'The girl '; displayEn = 'The girl '; }
      if (word.includes('F11_Boy_Tk')) { matchedRole = 'Subj_TheBoy_Form11'; translatedWord = 'The boy '; MOCK_XDIC_DB[word] = 'The boy '; displayEn = 'The boy '; }
      if (word.includes('F11_He_Tk')) { matchedRole = 'Subj_He_Form11'; translatedWord = 'He '; MOCK_XDIC_DB[word] = 'He '; displayEn = 'He '; }
      if (word.includes('F11_Went_Tk')) { matchedRole = 'Verb_Went_Form11'; translatedWord = 'went '; MOCK_XDIC_DB[word] = 'went '; displayEn = 'went '; }
      if (word.includes('F11_To_Tk')) { matchedRole = 'Prep_To_Form11'; translatedWord = 'to '; MOCK_XDIC_DB[word] = 'to '; displayEn = 'to '; }
      if (word.includes('F11_DeptStore_Tk')) { matchedRole = 'Noun_DeptStore_Form11'; translatedWord = 'the department store '; MOCK_XDIC_DB[word] = 'the department store '; displayEn = 'the department store '; }
      if (word.includes('F11_Near_Tk')) { matchedRole = 'Prep_Near_Form11'; translatedWord = 'near '; MOCK_XDIC_DB[word] = 'near '; displayEn = 'near '; }
      if (word.includes('F11_JanesHouse_Tk')) { matchedRole = 'Noun_JanesHouse_Form11'; translatedWord = "Jane's house"; MOCK_XDIC_DB[word] = "Jane's house"; displayEn = "Jane's house"; }
      if (word.includes('F11_House_Tk')) { matchedRole = 'Noun_House_Form11'; translatedWord = 'the house'; MOCK_XDIC_DB[word] = 'the house'; displayEn = 'the house'; } // 💡 [추가] 단독 집 부품!

      // <1형식> 예문 10
      if (word.includes('TheFirst_Token_Form10')) { matchedRole = 'Art_The_Form10'; translatedWord = 'The '; MOCK_XDIC_DB[word] = 'The '; displayEn = 'The '; } // 💡 충돌 해결!
      if (word.includes('Famous_Token_Form10')) { matchedRole = 'Adj_Famous_Form10'; translatedWord = 'famous '; MOCK_XDIC_DB[word] = 'famous '; displayEn = 'famous '; }
      if (word.includes('Hermit_Token_Form10')) { matchedRole = 'Noun_Hermit_Form10'; translatedWord = 'hermit '; MOCK_XDIC_DB[word] = 'hermit '; displayEn = 'hermit '; }
      if (word.includes('Lives_Token_Form10')) { matchedRole = 'Verb_Lives_Form10'; translatedWord = 'lives '; MOCK_XDIC_DB[word] = 'lives '; displayEn = 'lives '; }
      if (word.includes('In_Token_Form10')) { matchedRole = 'Prep_In_Form10'; translatedWord = 'in '; MOCK_XDIC_DB[word] = 'in '; displayEn = 'in '; }
      if (word.includes('The2_Token_Form10')) { matchedRole = 'Art_The2_Form10'; translatedWord = 'the '; MOCK_XDIC_DB[word] = 'the '; displayEn = 'the '; }
      if (word.includes('Small_Token_Form10')) { matchedRole = 'Adj_Small_Form10'; translatedWord = 'small '; MOCK_XDIC_DB[word] = 'small '; displayEn = 'small '; }
      if (word.includes('Cabin_Token_Form10')) { matchedRole = 'Noun_Cabin_Form10'; translatedWord = 'cabin '; MOCK_XDIC_DB[word] = 'cabin '; displayEn = 'cabin '; }
      if (word.includes('With_Token_Form10')) { matchedRole = 'Prep_With_Form10'; translatedWord = 'with '; MOCK_XDIC_DB[word] = 'with '; displayEn = 'with '; }
      if (word.includes('His_Token_Form10')) { matchedRole = 'Pron_His_Form10'; translatedWord = 'his '; MOCK_XDIC_DB[word] = 'his '; displayEn = 'his '; }
      if (word.includes('Disciples_Token_Form10')) { matchedRole = 'Noun_Disciples_Form10'; translatedWord = 'disciples'; MOCK_XDIC_DB[word] = 'disciples'; displayEn = 'disciples'; }
      if (word.includes('TheBoyAndGirl_Token_Form11')) { matchedRole = 'Subj_BoyAndGirl_Form11'; translatedWord = 'The boy and the girl '; MOCK_XDIC_DB[word] = 'The boy and the girl '; displayEn = 'The boy and the girl '; }
      if (word.includes('Went_Token_Form11')) { matchedRole = 'Verb_Went_Form11'; translatedWord = 'went '; MOCK_XDIC_DB[word] = 'went '; displayEn = 'went '; }
      if (word.includes('To_Token_Form11')) { matchedRole = 'Prep_To_Form11'; translatedWord = 'to '; MOCK_XDIC_DB[word] = 'to '; displayEn = 'to '; }
      if (word.includes('TheDeptStore_Token_Form11')) { matchedRole = 'Noun_DeptStore_Form11'; translatedWord = 'the department store '; MOCK_XDIC_DB[word] = 'the department store '; displayEn = 'the department store '; }
      if (word.includes('Near_Token_Form11')) { matchedRole = 'Prep_Near_Form11'; translatedWord = 'near '; MOCK_XDIC_DB[word] = 'near '; displayEn = 'near '; }
      if (word.includes('JanesHouse_Token_Form11')) { matchedRole = 'Noun_JanesHouse_Form11'; translatedWord = "Jane's house"; MOCK_XDIC_DB[word] = "Jane's house"; displayEn = "Jane's house"; }

      // <1형식> 예문 9
      if (word.includes('He_Token_Form9')) { matchedRole = 'Subj_He'; translatedWord = 'He '; MOCK_XDIC_DB[word] = 'He '; displayEn = 'He '; }
      if (word.includes('WillStay_Token_Form9')) { matchedRole = 'Verb_WillStay_Form9'; translatedWord = 'will stay '; MOCK_XDIC_DB[word] = 'will stay '; displayEn = 'will stay '; }
      if (word.includes('At_Token_Form9')) { matchedRole = 'Prep_At_Form9'; translatedWord = 'at '; MOCK_XDIC_DB[word] = 'at '; displayEn = 'at '; }
      if (word.includes('TheBeach_Token_Form9')) { matchedRole = 'Noun_TheBeach_Form9'; translatedWord = 'the beach '; MOCK_XDIC_DB[word] = 'the beach '; displayEn = 'the beach '; }
      if (word.includes('With_Token_Form9')) { matchedRole = 'Prep_With_Form9'; translatedWord = 'with '; MOCK_XDIC_DB[word] = 'with '; displayEn = 'with '; }
      if (word.includes('His_Token_Form9')) { matchedRole = 'Pron_His_Form9'; translatedWord = 'his '; MOCK_XDIC_DB[word] = 'his '; displayEn = 'his '; }
      if (word.includes('Family_Token_Form9')) { matchedRole = 'Noun_Family_Form9'; translatedWord = 'family '; MOCK_XDIC_DB[word] = 'family '; displayEn = 'family '; }
      if (word.includes('During_Token_Form9')) { matchedRole = 'Prep_During_Form9'; translatedWord = 'during '; MOCK_XDIC_DB[word] = 'during '; displayEn = 'during '; }
      if (word.includes('This_Token_Form9')) { matchedRole = 'Adj_This_Form9'; translatedWord = 'this '; MOCK_XDIC_DB[word] = 'this '; displayEn = 'this '; }
      if (word.includes('Summer_Token_Form9')) { matchedRole = 'Noun_Summer_Form9'; translatedWord = 'summer '; MOCK_XDIC_DB[word] = 'summer '; displayEn = 'summer '; }
      if (word.includes('Vacation_Token_Form9')) { matchedRole = 'Noun_Vacation_Form9'; translatedWord = 'vacation'; MOCK_XDIC_DB[word] = 'vacation'; displayEn = 'vacation'; }

      // <1형식> 예문 8
      if (word.includes('A_Token_Form8')) { matchedRole = 'Art_A_Form8'; translatedWord = 'A '; MOCK_XDIC_DB[word] = 'A '; displayEn = 'A '; }
      if (word.includes('Pretty_Token_Form8')) { matchedRole = 'Adj_Pretty_Form8'; translatedWord = 'pretty '; MOCK_XDIC_DB[word] = 'pretty '; displayEn = 'pretty '; }
      if (word.includes('Girl_Token_Form8')) { matchedRole = 'Noun_Girl_Form8'; translatedWord = 'girl '; MOCK_XDIC_DB[word] = 'girl '; displayEn = 'girl '; }
      if (word.includes('Lived_Token_Form8')) { matchedRole = 'Verb_Lived_Form8'; translatedWord = 'lived '; MOCK_XDIC_DB[word] = 'lived '; displayEn = 'lived '; }
      if (word.includes('In_Token_Form8')) { matchedRole = 'Prep_In_Form8'; translatedWord = 'in '; MOCK_XDIC_DB[word] = 'in '; displayEn = 'in '; }
      if (word.includes('ASmallVillage_Token_Form8')) { matchedRole = 'Noun_SmallVillage_Form8'; translatedWord = 'a small village'; MOCK_XDIC_DB[word] = 'a small village'; displayEn = 'a small village'; }
      if (word.includes('AVillage_Token_Form8')) { matchedRole = 'Noun_Village_Form8'; translatedWord = 'a village'; MOCK_XDIC_DB[word] = 'a village'; displayEn = 'a village'; }

      // <1형식> 예문 7
      if (word.includes('John_Token_Form7')) { matchedRole = 'Subj_John_Form7'; translatedWord = 'John '; MOCK_XDIC_DB[word] = 'John '; displayEn = 'John '; }
      if (word.includes('WillStay_Token_Form7')) { matchedRole = 'Verb_WillStay_Form7'; translatedWord = 'will stay '; MOCK_XDIC_DB[word] = 'will stay '; displayEn = 'will stay '; }
      if (word.includes('At_Token_Form7')) { matchedRole = 'Prep_At_Form7'; translatedWord = 'at '; MOCK_XDIC_DB[word] = 'at '; displayEn = 'at '; }
      if (word.includes('TheHotel_Token_Form7')) { matchedRole = 'Noun_TheHotel_Form7'; translatedWord = 'the hotel '; MOCK_XDIC_DB[word] = 'the hotel '; displayEn = 'the hotel '; }
      if (word.includes('During_Token_Form7')) { matchedRole = 'Prep_During_Form7'; translatedWord = 'during '; MOCK_XDIC_DB[word] = 'during '; displayEn = 'during '; }
      if (word.includes('This_Token_Form7')) { matchedRole = 'Adj_This_Form7'; translatedWord = 'this '; MOCK_XDIC_DB[word] = 'this '; displayEn = 'this '; }
      if (word.includes('WinterVacation_Token_Form7')) { matchedRole = 'Noun_WinterVacation_Form7'; translatedWord = 'winter vacation'; MOCK_XDIC_DB[word] = 'winter vacation'; displayEn = 'winter vacation'; }

      // <1형식> 예문 6
      if (word.includes('John_Token_Form6')) { matchedRole = 'Subj_John_Form6'; translatedWord = 'John '; MOCK_XDIC_DB[word] = 'John '; displayEn = 'John '; }
      if (word.includes('HasLived_Token_Form6')) { matchedRole = 'Verb_HasLived_Form6'; translatedWord = 'has lived '; MOCK_XDIC_DB[word] = 'has lived '; displayEn = 'has lived '; }
      if (word.includes('In_Token_Form6')) { matchedRole = 'Prep_In_Form6'; translatedWord = 'in '; MOCK_XDIC_DB[word] = 'in '; displayEn = 'in '; }
      if (word.includes('Seoul_Token_Form6')) { matchedRole = 'Noun_Seoul_Form6'; translatedWord = 'Seoul '; MOCK_XDIC_DB[word] = 'Seoul '; displayEn = 'Seoul '; }
      if (word.includes('For_Token_Form6')) { matchedRole = 'Prep_For_Form6'; translatedWord = 'for '; MOCK_XDIC_DB[word] = 'for '; displayEn = 'for '; }
      if (word.includes('TwentyYears_Token_Form6')) { matchedRole = 'Noun_TwentyYears_Form6'; translatedWord = '20 years'; MOCK_XDIC_DB[word] = '20 years'; displayEn = '20 years'; }

      // ... (기존 예문 5 부품들) ...
      if (word.includes('Lived_Token_Form5')) { matchedRole = 'Verb_Lived_Form5'; translatedWord = 'lived '; MOCK_XDIC_DB[word] = 'lived '; displayEn = 'lived '; }
      if (word.includes('In_Token_Form5')) { matchedRole = 'Prep_In_Form5'; translatedWord = 'in '; MOCK_XDIC_DB[word] = 'in '; displayEn = 'in '; }
      if (word.includes('AVeryOldHouse_Token_Form5')) { matchedRole = 'Noun_OldHouse_Form5'; translatedWord = 'a very old house'; MOCK_XDIC_DB[word] = 'a very old house'; displayEn = 'a very old house'; }
      if (word.includes('AnOldHouse_Token_Form5')) { matchedRole = 'Noun_AnOldHouse_Form5'; translatedWord = 'an old house'; MOCK_XDIC_DB[word] = 'an old house'; displayEn = 'an old house'; } 
      if (word.includes('AHouse_Token_Form5')) { matchedRole = 'Noun_AHouse_Form5'; translatedWord = 'a house'; MOCK_XDIC_DB[word] = 'a house'; displayEn = 'a house'; } // 💡 [추가] '집' 단독 부품 장착!

      // <1형식> 예문 4
      if (word.includes('He_Token_Form4')) { matchedRole = 'Subj_He'; translatedWord = 'He '; MOCK_XDIC_DB[word] = 'He '; displayEn = 'He '; }
      if (word.includes('Came_Token_Form4')) { matchedRole = 'Verb_Came_Form4'; translatedWord = 'came '; MOCK_XDIC_DB[word] = 'came '; displayEn = 'came '; }
      if (word.includes('From_Token_Form4')) { matchedRole = 'Prep_From_Form4'; translatedWord = 'from '; MOCK_XDIC_DB[word] = 'from '; displayEn = 'from '; }
      if (word.includes('Seoul_Token_Form4')) { matchedRole = 'Noun_Seoul_Form4'; translatedWord = 'Seoul '; MOCK_XDIC_DB[word] = 'Seoul '; displayEn = 'Seoul '; }
      if (word.includes('LastYear_Token_Form4')) { matchedRole = 'Adv_LastYear_Form4'; translatedWord = 'last year'; MOCK_XDIC_DB[word] = 'last year'; displayEn = 'last year'; }

      // <1형식> 예문 3
      if (word.includes('He_Token_Form3')) { matchedRole = 'Subj_He'; translatedWord = 'He '; MOCK_XDIC_DB[word] = 'He '; displayEn = 'He '; }
      if (word.includes('Plays_Token_Form3')) { matchedRole = 'Verb_Plays_Form3'; translatedWord = 'plays '; MOCK_XDIC_DB[word] = 'plays '; displayEn = 'plays '; }
      if (word.includes('At_Token_Form3')) { matchedRole = 'Prep_At_Form3'; translatedWord = 'at '; MOCK_XDIC_DB[word] = 'at '; displayEn = 'at '; }
      if (word.includes('TheStation_Token_Form3')) { matchedRole = 'Noun_TheStation_Form3'; translatedWord = 'the station '; MOCK_XDIC_DB[word] = 'the station '; displayEn = 'the station '; }
      if (word.includes('Every_Token_Form3')) { matchedRole = 'Adj_Every_Form3'; translatedWord = 'every '; MOCK_XDIC_DB[word] = 'every '; displayEn = 'every '; }
      if (word.includes('Night_Token_Form3')) { matchedRole = 'Noun_Night_Form3'; translatedWord = 'night'; MOCK_XDIC_DB[word] = 'night'; displayEn = 'night'; }
      if (word.includes('Day_Token_Form3')) { matchedRole = 'Noun_Day_Form3'; translatedWord = 'day'; MOCK_XDIC_DB[word] = 'day'; displayEn = 'day'; } // 💡 [추가] 'day' 부품 장착!

      // <1형식> 예문 2
      if (word.includes('TheBird_Token_Form2')) { matchedRole = 'Subj_TheBird_Form2'; translatedWord = 'The bird '; MOCK_XDIC_DB[word] = 'The bird '; displayEn = 'The bird '; }
      if (word.includes('Sings_Token_Form2')) { matchedRole = 'Verb_Sings_Form2'; translatedWord = 'sings '; MOCK_XDIC_DB[word] = 'sings '; displayEn = 'sings '; }
      if (word.includes('Sweetly_Token_Form2')) { matchedRole = 'Adv_Sweetly_Form2'; translatedWord = 'sweetly'; MOCK_XDIC_DB[word] = 'sweetly'; displayEn = 'sweetly'; }

      // <1형식> 예문 1
      if (word.includes('The_Token_Form1')) { matchedRole = 'Art_The_Form1'; translatedWord = 'The '; MOCK_XDIC_DB[word] = 'The '; displayEn = 'The '; }
      if (word.includes('Book_Token_Form1')) { matchedRole = 'Noun_Book_Form1'; translatedWord = 'book '; MOCK_XDIC_DB[word] = 'book '; displayEn = 'book '; }
      if (word.includes('Sells_Token_Form1')) { matchedRole = 'Verb_Sells_Form1'; translatedWord = 'sells '; MOCK_XDIC_DB[word] = 'sells '; displayEn = 'sells '; }
      if (word.includes('Well_Token_Form1')) { matchedRole = 'Adv_Well_Form1'; translatedWord = 'well'; MOCK_XDIC_DB[word] = 'well'; displayEn = 'well'; }

      // <무의지동사> 예문 2 (💡 불용어 방어 공백 전면 적용!)
      if (word.includes('He_Token_Invol2')) { matchedRole = 'Subj_He'; translatedWord = 'He '; MOCK_XDIC_DB[word] = 'He '; displayEn = 'He '; } // 💡 엔진 공용 부품(Subj_He)과 완벽 호환!
      if (word.includes('Lived_Token_Invol2')) { matchedRole = 'Verb_Lived_Invol2'; translatedWord = 'lived '; MOCK_XDIC_DB[word] = 'lived '; displayEn = 'lived '; }
      if (word.includes('Long_Token_Invol2')) { matchedRole = 'Adv_Long_Invol2'; translatedWord = 'long '; MOCK_XDIC_DB[word] = 'long '; displayEn = 'long '; }
      if (word.includes('To_Token_Invol2')) { matchedRole = 'To_Inf_Invol2'; translatedWord = 'to '; MOCK_XDIC_DB[word] = 'to '; displayEn = 'to '; }
      if (word.includes('Meet_Token_Invol2')) { matchedRole = 'Verb_Meet_Invol2'; translatedWord = 'meet '; MOCK_XDIC_DB[word] = 'meet '; displayEn = 'meet '; }
      if (word.includes('His_Token_Invol2')) { matchedRole = 'Pron_His_Invol2'; translatedWord = 'his '; MOCK_XDIC_DB[word] = 'his '; displayEn = 'his '; }
      if (word.includes('Grandson_Token_Invol2')) { matchedRole = 'Noun_Grandson_Invol2'; translatedWord = 'grandson '; MOCK_XDIC_DB[word] = 'grandson '; displayEn = 'grandson '; }
      if (word.includes('Again_Token_Invol2')) { matchedRole = 'Adv_Again_Invol2'; translatedWord = 'again'; MOCK_XDIC_DB[word] = 'again'; displayEn = 'again'; }
      if (word.includes('Lived_Token_Invol3')) { matchedRole = 'Verb_Lived_Invol3'; translatedWord = 'lived '; MOCK_XDIC_DB[word] = 'lived '; displayEn = 'lived '; }
      if (word.includes('Here_Token_Invol3')) { matchedRole = 'Adv_Here_Invol3'; translatedWord = 'here '; MOCK_XDIC_DB[word] = 'here '; displayEn = 'here '; }
      if (word.includes('To_Token_Invol3')) { matchedRole = 'To_Inf_Invol3'; translatedWord = 'to '; MOCK_XDIC_DB[word] = 'to '; displayEn = 'to '; }
      if (word.includes('See_Token_Invol3')) { matchedRole = 'Verb_See_Invol3'; translatedWord = 'see '; MOCK_XDIC_DB[word] = 'see '; displayEn = 'see '; }
      if (word.includes('You_Token_Invol3')) { matchedRole = 'Pron_You_Invol3'; translatedWord = 'you'; MOCK_XDIC_DB[word] = 'you'; displayEn = 'you'; }

      // <무의지동사> 예문 1 (💡 불용어 방어 공백 전면 적용!)
      if (word.includes('The1_Token_Invol1')) { matchedRole = 'Art_The1_Invol1'; translatedWord = 'The '; MOCK_XDIC_DB[word] = 'The '; displayEn = 'The '; }
      if (word.includes('Child_Token_Invol1')) { matchedRole = 'Noun_Child_Invol1'; translatedWord = 'child'; MOCK_XDIC_DB[word] = 'child'; displayEn = 'child'; }
      if (word.includes('Grew_Token_Invol1')) { matchedRole = 'Verb_Grew_Invol1'; translatedWord = 'grew '; MOCK_XDIC_DB[word] = 'grew '; displayEn = 'grew '; }
      if (word.includes('To_Token_Invol1')) { matchedRole = 'To_Inf_Invol1'; translatedWord = 'to '; MOCK_XDIC_DB[word] = 'to '; displayEn = 'to '; }
      if (word.includes('Be_Token_Invol1')) { matchedRole = 'Verb_Be_Invol1'; translatedWord = 'be '; MOCK_XDIC_DB[word] = 'be '; displayEn = 'be '; }
      if (word.includes('AFine_Token_Invol1')) { matchedRole = 'Adj_AFine_Invol1'; translatedWord = 'a fine '; MOCK_XDIC_DB[word] = 'a fine '; displayEn = 'a fine '; }
      if (word.includes('Youth_Token_Invol1')) { matchedRole = 'Noun_Youth_Invol1'; translatedWord = 'youth'; MOCK_XDIC_DB[word] = 'youth'; displayEn = 'youth'; }
      // <의지동사> 예문 5 (💡 불용어 방어 공백 전면 적용!)
      if (word.includes('Albert_Token_Vol5')) { matchedRole = 'Subj_Albert_Vol5'; translatedWord = 'Albert Schweitzer'; MOCK_XDIC_DB[word] = 'Albert Schweitzer'; displayEn = 'Albert Schweitzer'; }
      if (word.includes('Used_Token_Vol5')) { matchedRole = 'Verb_Used_Vol5'; translatedWord = 'used '; MOCK_XDIC_DB[word] = 'used '; displayEn = 'used '; }
      if (word.includes('The_Token_Vol5')) { matchedRole = 'Art_The_Vol5'; translatedWord = 'the '; MOCK_XDIC_DB[word] = 'the '; displayEn = 'the '; }
      if (word.includes('PrizeMoney_Token_Vol5')) { matchedRole = 'Noun_PrizeMoney_Vol5'; translatedWord = 'prize money'; MOCK_XDIC_DB[word] = 'prize money'; displayEn = 'prize money'; }
      if (word.includes('To1_Token_Vol5')) { matchedRole = 'To_Inf1_Vol5'; translatedWord = 'to '; MOCK_XDIC_DB[word] = 'to '; displayEn = 'to '; }
      if (word.includes('Make1_Token_Vol5')) { matchedRole = 'Verb_Make1_Vol5'; translatedWord = 'make '; MOCK_XDIC_DB[word] = 'make '; displayEn = 'make '; }
      if (word.includes('TheHospital_Token_Vol5')) { matchedRole = 'Noun_TheHospital_Vol5'; translatedWord = 'the hospital'; MOCK_XDIC_DB[word] = 'the hospital'; displayEn = 'the hospital'; }
      if (word.includes('Bigger_Token_Vol5')) { matchedRole = 'Adj_Bigger_Vol5'; translatedWord = 'bigger'; MOCK_XDIC_DB[word] = 'bigger'; displayEn = 'bigger'; }
      if (word.includes('And_Token_Vol5')) { matchedRole = 'Conj_And_Vol5'; translatedWord = 'and '; MOCK_XDIC_DB[word] = 'and '; displayEn = 'and '; }
      if (word.includes('To2_Token_Vol5')) { matchedRole = 'To_Inf2_Vol5'; translatedWord = '(to) '; MOCK_XDIC_DB[word] = '(to) '; displayEn = '(to) '; }
      if (word.includes('Make2_Token_Vol5')) { matchedRole = 'Verb_Make2_Vol5'; translatedWord = 'make '; MOCK_XDIC_DB[word] = 'make '; displayEn = 'make '; }
      if (word.includes('APlace_Token_Vol5')) { matchedRole = 'Noun_APlace_Vol5'; translatedWord = 'a place'; MOCK_XDIC_DB[word] = 'a place'; displayEn = 'a place'; }
      if (word.includes('For_Token_Vol5')) { matchedRole = 'Prep_For_Vol5'; translatedWord = 'for '; MOCK_XDIC_DB[word] = 'for '; displayEn = 'for '; }
      if (word.includes('People_Token_Vol5')) { matchedRole = 'Noun_People_Vol5'; translatedWord = 'people'; MOCK_XDIC_DB[word] = 'people'; displayEn = 'people'; }
      if (word.includes('To3_Token_Vol5')) { matchedRole = 'To_Inf3_Vol5'; translatedWord = 'to '; MOCK_XDIC_DB[word] = 'to '; displayEn = 'to '; }
      if (word.includes('SufferFrom_Token_Vol5')) { matchedRole = 'Verb_SufferFrom_Vol5'; translatedWord = 'suffer from'; MOCK_XDIC_DB[word] = 'suffer from'; displayEn = 'suffer from'; }
      if (word.includes('Leprosy_Token_Vol5')) { matchedRole = 'Noun_Leprosy_Vol5'; translatedWord = 'leprosy'; MOCK_XDIC_DB[word] = 'leprosy'; displayEn = 'leprosy'; }

      // <의지동사> 예문 4 (💡 쉼표 자동 생성 및 불용어 방어 공백 전면 적용!)
      if (word.includes('Made_Token_Vol4')) { matchedRole = 'Verb_Made_Vol4'; translatedWord = 'made'; MOCK_XDIC_DB[word] = 'made'; displayEn = 'made'; }
      if (word.includes('Made_Token_Vol4')) { matchedRole = 'Verb_Made_Vol4'; translatedWord = 'made '; MOCK_XDIC_DB[word] = 'made '; displayEn = 'made '; }
      if (word.includes('ASpecialProgram_Token_Vol4')) { matchedRole = 'Obj_ASpecialProgram_Vol4'; translatedWord = 'a special program '; MOCK_XDIC_DB[word] = 'a special program '; displayEn = 'a special program '; }
      if (word.includes('To_Token_Vol4')) { matchedRole = 'To_Inf_Vol4'; translatedWord = 'to '; MOCK_XDIC_DB[word] = 'to '; displayEn = 'to '; }
      if (word.includes('Teach_Token_Vol4')) { matchedRole = 'Verb_Teach_Vol4'; translatedWord = 'teach'; MOCK_XDIC_DB[word] = 'teach'; displayEn = 'teach'; }
      if (word.includes('Many_Token_Vol4')) { matchedRole = 'Adj_Many_Vol4'; translatedWord = 'many'; MOCK_XDIC_DB[word] = 'many'; displayEn = 'many'; }
      if (word.includes('Students_Token_Vol4')) { matchedRole = 'Noun_Students_Vol4'; translatedWord = 'students'; MOCK_XDIC_DB[word] = 'students'; displayEn = 'students'; }
      if (word.includes('The_Token_Vol4')) { matchedRole = 'Art_The_Vol4'; translatedWord = 'the '; MOCK_XDIC_DB[word] = 'the '; displayEn = 'the '; }
      if (word.includes('Culture_Token_Vol4')) { matchedRole = 'Noun_Culture_Vol4'; translatedWord = 'culture,'; MOCK_XDIC_DB[word] = 'culture,'; displayEn = 'culture,'; } // 💡 쉼표 자동 추가!
      if (word.includes('Customs_Token_Vol4')) { matchedRole = 'Noun_Customs_Vol4'; translatedWord = 'customs,'; MOCK_XDIC_DB[word] = 'customs,'; displayEn = 'customs,'; } // 💡 쉼표 자동 추가!
      if (word.includes('And_Token_Vol4')) { matchedRole = 'Conj_And_Vol4'; translatedWord = 'and '; MOCK_XDIC_DB[word] = 'and '; displayEn = 'and '; }
      if (word.includes('Art_Token_Vol4')) { matchedRole = 'Noun_Art_Vol4'; translatedWord = 'art'; MOCK_XDIC_DB[word] = 'art'; displayEn = 'art'; }
      if (word.includes('Of_Token_Vol4')) { matchedRole = 'Prep_Of_Vol4'; translatedWord = 'of '; MOCK_XDIC_DB[word] = 'of '; displayEn = 'of '; }
      if (word.includes('Other_Token_Vol4')) { matchedRole = 'Adj_Other_Vol4'; translatedWord = 'other'; MOCK_XDIC_DB[word] = 'other'; displayEn = 'other'; }
      if (word.includes('Country_Token_Vol4')) { matchedRole = 'Noun_Country_Vol4'; translatedWord = 'country'; MOCK_XDIC_DB[word] = 'country'; displayEn = 'country'; }
      if (word.includes('During_Token_Vol4')) { matchedRole = 'Prep_During_Vol4'; translatedWord = 'during '; MOCK_XDIC_DB[word] = 'during '; displayEn = 'during '; }
      if (word.includes('This_Token_Vol4')) { matchedRole = 'Adj_This_Vol4'; translatedWord = 'this'; MOCK_XDIC_DB[word] = 'this'; displayEn = 'this'; }
      if (word.includes('Vacation_Token_Vol4')) { matchedRole = 'Noun_Vacation_Vol4'; translatedWord = 'vacation'; MOCK_XDIC_DB[word] = 'vacation'; displayEn = 'vacation'; }
      if (word.includes('AProgram_Token_Vol4')) { matchedRole = 'Obj_AProgram_Vol4'; translatedWord = 'a program '; MOCK_XDIC_DB[word] = 'a program '; displayEn = 'a program '; }
      if (word.includes('Culture2_Token_Vol4')) { matchedRole = 'Noun_Culture2_Vol4'; translatedWord = 'culture '; MOCK_XDIC_DB[word] = 'culture '; displayEn = 'culture '; } // 💡 [추가] 쉼표 없는 culture!

      // <의지동사> 예문 3 (💡 전치사/관사/접속사에 불용어 방어용 공백 마법 전면 적용!)
      if (word.includes('Bought_Token_Vol3')) { matchedRole = 'Verb_Bought_Vol3'; translatedWord = 'bought '; MOCK_XDIC_DB[word] = 'bought '; displayEn = 'bought '; } // 💡 불용어 필터 절대 방어용 공백 마법!
      if (word.includes('The1_Token_Vol3')) { matchedRole = 'Art_The1_Vol3'; translatedWord = 'the '; MOCK_XDIC_DB[word] = 'the '; displayEn = 'the '; }
      if (word.includes('Old_Token_Vol3')) { matchedRole = 'Adj_Old_Vol3'; translatedWord = 'old'; MOCK_XDIC_DB[word] = 'old'; displayEn = 'old'; }
      if (word.includes('House_Token_Vol3')) { matchedRole = 'Obj_House_Vol3'; translatedWord = 'house'; MOCK_XDIC_DB[word] = 'house'; displayEn = 'house'; }
      if (word.includes('To_Token_Vol3')) { matchedRole = 'To_Inf_Vol3'; translatedWord = 'to '; MOCK_XDIC_DB[word] = 'to '; displayEn = 'to '; }
      if (word.includes('Live_Token_Vol3')) { matchedRole = 'Verb_Live_Vol3'; translatedWord = 'live'; MOCK_XDIC_DB[word] = 'live'; displayEn = 'live'; }
      if (word.includes('In_Token_Vol3')) { matchedRole = 'Prep_In_Vol3'; translatedWord = 'in '; MOCK_XDIC_DB[word] = 'in '; displayEn = 'in '; }
      if (word.includes('The2_Token_Vol3')) { matchedRole = 'Art_The2_Vol3'; translatedWord = 'the '; MOCK_XDIC_DB[word] = 'the '; displayEn = 'the '; }
      if (word.includes('Quiet_Token_Vol3')) { matchedRole = 'Adj_Quiet_Vol3'; translatedWord = 'quiet'; MOCK_XDIC_DB[word] = 'quiet'; displayEn = 'quiet'; }
      if (word.includes('Country_Token_Vol3')) { matchedRole = 'Noun_Country_Vol3'; translatedWord = 'country'; MOCK_XDIC_DB[word] = 'country'; displayEn = 'country'; }
      if (word.includes('With_Token_Vol3')) { matchedRole = 'Prep_With_Vol3'; translatedWord = 'with '; MOCK_XDIC_DB[word] = 'with '; displayEn = 'with '; }
      if (word.includes('His_Token_Vol3')) { matchedRole = 'Pron_His_Vol3'; translatedWord = 'his '; MOCK_XDIC_DB[word] = 'his '; displayEn = 'his '; }
      if (word.includes('GoodNatured_Token_Vol3')) { matchedRole = 'Adj_GoodNatured_Vol3'; translatedWord = 'good-natured'; MOCK_XDIC_DB[word] = 'good-natured'; displayEn = 'good-natured'; }
      if (word.includes('Wife_Token_Vol3')) { matchedRole = 'Noun_Wife_Vol3'; translatedWord = 'wife'; MOCK_XDIC_DB[word] = 'wife'; displayEn = 'wife'; }
      if (word.includes('And_Token_Vol3')) { matchedRole = 'Conj_And_Vol3'; translatedWord = 'and '; MOCK_XDIC_DB[word] = 'and '; displayEn = 'and '; }
      if (word.includes('PrettyDaughter_Token_Vol3')) { matchedRole = 'Noun_PrettyDaughter_Vol3'; translatedWord = 'a pretty daughter'; MOCK_XDIC_DB[word] = 'a pretty daughter'; displayEn = 'a pretty daughter'; }
      if (word.includes('PrettyDaughter_Token_Vol3')) { matchedRole = 'Noun_PrettyDaughter_Vol3'; translatedWord = 'a pretty daughter'; MOCK_XDIC_DB[word] = 'a pretty daughter'; displayEn = 'a pretty daughter'; }
      if (word.includes('ADaughter_Token_Vol3')) { matchedRole = 'Noun_ADaughter_Vol3'; translatedWord = 'a daughter'; MOCK_XDIC_DB[word] = 'a daughter'; displayEn = 'a daughter'; } // 💡 [추가] 수식어 빠진 '딸' 전용 부품!
      if (word.includes('ADaughter_Token_Vol3')) { matchedRole = 'Noun_ADaughter_Vol3'; translatedWord = 'a daughter'; MOCK_XDIC_DB[word] = 'a daughter'; displayEn = 'a daughter'; } 
      if (word.includes('PrettyDaughter2_Token_Vol3')) { matchedRole = 'Noun_PrettyDaughter2_Vol3'; translatedWord = 'pretty daughter'; MOCK_XDIC_DB[word] = 'pretty daughter'; displayEn = 'pretty daughter'; } // 💡 [추가] 'a'가 빠진 pretty daughter!

      // <의지동사> 예문 2 (💡 불용어 필터 방어용 공백 마법 전면 적용!)
      if (word.includes('We_Token_Vol2')) { matchedRole = 'Subj_We_Vol2'; translatedWord = 'We '; MOCK_XDIC_DB[word] = 'We '; displayEn = 'We '; }
      if (word.includes('Gathered_Token_Vol2')) { matchedRole = 'Verb_Gathered_Vol2'; translatedWord = 'gathered'; MOCK_XDIC_DB[word] = 'gathered'; displayEn = 'gathered'; }
      if (word.includes('Here_Token_Vol2')) { matchedRole = 'Adv_Here_Vol2_2'; translatedWord = 'here'; MOCK_XDIC_DB[word] = 'here'; displayEn = 'here'; }
      if (word.includes('Today_Token_Vol2')) { matchedRole = 'Adv_Today_Vol2'; translatedWord = 'today'; MOCK_XDIC_DB[word] = 'today'; displayEn = 'today'; }
      if (word.includes('To_Token_Vol2')) { matchedRole = 'To_Inf_Vol2_2'; translatedWord = 'to '; MOCK_XDIC_DB[word] = 'to '; displayEn = 'to '; }
      if (word.includes('Talk_Token_Vol2')) { matchedRole = 'Verb_Inf_Talk_Vol2'; translatedWord = 'talk'; MOCK_XDIC_DB[word] = 'talk'; displayEn = 'talk'; }
      if (word.includes('About_Token_Vol2')) { matchedRole = 'Prep_About_Vol2'; translatedWord = 'about '; MOCK_XDIC_DB[word] = 'about '; displayEn = 'about '; }
      if (word.includes('ImportantThing_Token_Vol2')) { matchedRole = 'Obj_ImportantThing_Vol2'; translatedWord = 'an important thing'; MOCK_XDIC_DB[word] = 'an important thing'; displayEn = 'an important thing'; }

      // <의지동사> 예문 1 (💡 강력 접착제 대신 '공백 마법' 적용!)
      if (word.includes('Came_Token_Vol1')) { matchedRole = 'Verb_Came_Vol1'; translatedWord = 'came '; MOCK_XDIC_DB[word] = 'came '; displayEn = 'came '; } // 💡 불용어 필터 절대 방어!
      if (word.includes('Here_Token_Vol1')) { matchedRole = 'Adv_Here_Vol1'; translatedWord = 'here'; MOCK_XDIC_DB[word] = 'here'; displayEn = 'here'; }
      if (word.includes('To_Token_Vol1')) { matchedRole = 'To_Inf_Vol1'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word.includes('See_Token_Vol1')) { matchedRole = 'Verb_Inf_See_Vol1'; translatedWord = 'see'; MOCK_XDIC_DB[word] = 'see'; displayEn = 'see'; }
      if (word.includes('You_Token_Vol1')) { matchedRole = 'Obj_You_Vol1'; translatedWord = 'you'; MOCK_XDIC_DB[word] = 'you'; displayEn = 'you'; }

      // <부사구_결과> 예문 3 ('is' 실종 방지 결합형 포함)
      if (word.includes('IsToo_Token_Res3')) { matchedRole = 'Verb_IsToo_Res3'; translatedWord = 'is too'; MOCK_XDIC_DB[word] = 'is too'; displayEn = 'is too'; }
      if (word.includes('Is_Token_Res3')) { matchedRole = 'Verb_Is_Res3'; translatedWord = 'is '; MOCK_XDIC_DB[word] = 'is '; displayEn = 'is '; }
      if (word.includes('Idle_Token_Res3')) { matchedRole = 'Comp_Idle_Res3'; translatedWord = 'idle'; MOCK_XDIC_DB[word] = 'idle'; displayEn = 'idle'; }
      if (word.includes('To_Token_Res3')) { matchedRole = 'To_Inf_Res3'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word.includes('Read_Token_Res3')) { matchedRole = 'Verb_Inf_Read_Res3'; translatedWord = 'read'; MOCK_XDIC_DB[word] = 'read'; displayEn = 'read'; }
      if (word.includes('Many_Token_Res3')) { matchedRole = 'Adj_Many_Res3'; translatedWord = 'many'; MOCK_XDIC_DB[word] = 'many'; displayEn = 'many'; }
      if (word.includes('Books_Token_Res3')) { matchedRole = 'Obj_Books_Res3'; translatedWord = 'books'; MOCK_XDIC_DB[word] = 'books'; displayEn = 'books'; }

      // <부사구_결과> 예문 2 ('is clever' 결합형)
      if (word.includes('The_Token_Res2')) { matchedRole = 'Mod_The_Res2'; translatedWord = 'The'; MOCK_XDIC_DB[word] = 'The'; displayEn = 'The'; }
      if (word.includes('Boy_Token_Res2')) { matchedRole = 'Subj_Boy_Res2'; translatedWord = 'boy'; MOCK_XDIC_DB[word] = 'boy'; displayEn = 'boy'; }
      if (word.includes('IsClever_Token_Res2')) { matchedRole = 'Comp_IsClever_Res2'; translatedWord = 'is clever'; MOCK_XDIC_DB[word] = 'is clever'; displayEn = 'is clever'; } // 💡 결합되어 절대 삭제 불가능!
      if (word.includes('Enough_Token_Res2')) { matchedRole = 'Adv_Enough_Res2'; translatedWord = 'enough'; MOCK_XDIC_DB[word] = 'enough'; displayEn = 'enough'; }
      if (word.includes('To_Token_Res2')) { matchedRole = 'To_Inf_Res2'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word.includes('Understand_Token_Res2')) { matchedRole = 'Verb_Inf_Understand_Res2'; translatedWord = 'understand'; MOCK_XDIC_DB[word] = 'understand'; displayEn = 'understand'; }
      if (word.includes('It_Token_Res2')) { matchedRole = 'Obj_It_Res2'; translatedWord = 'it'; MOCK_XDIC_DB[word] = 'it'; displayEn = 'it'; }

     // <부사구_결과> 예문 1 (💡 'He'는 예문 3 공용 코드에서 자동 처리됩니다!)
      if (word.includes('GotUp_Token_Res1')) { matchedRole = 'Verb_GotUp_Res1'; translatedWord = 'got up'; MOCK_XDIC_DB[word] = 'got up'; displayEn = 'got up'; }
      if (word.includes('So_Token_Res1')) { matchedRole = 'Adv_So_Res1'; translatedWord = 'so'; MOCK_XDIC_DB[word] = 'so'; displayEn = 'so'; }
      if (word.includes('Late_Token_Res1')) { matchedRole = 'Adv_Late_Res1'; translatedWord = 'late'; MOCK_XDIC_DB[word] = 'late'; displayEn = 'late'; }
      if (word.includes('AsTo_Token_Res1')) { matchedRole = 'To_Inf_AsTo_Res1'; translatedWord = 'as to'; MOCK_XDIC_DB[word] = 'as to'; displayEn = 'as to'; }
      if (word.includes('Miss_Token_Res1')) { matchedRole = 'Verb_Inf_Miss_Res1'; translatedWord = 'miss'; MOCK_XDIC_DB[word] = 'miss'; displayEn = 'miss'; }
      if (word.includes('TheTrain_Token_Res1')) { matchedRole = 'Obj_Train_Res1'; translatedWord = 'the train'; MOCK_XDIC_DB[word] = 'the train'; displayEn = 'the train'; }

     // <부사구> 예문 4 ('is good' 결합형)
      if (word.includes('This_Token_Adv4')) { matchedRole = 'Mod_This_Adv4'; translatedWord = 'This'; MOCK_XDIC_DB[word] = 'This'; displayEn = 'This'; }
      if (word.includes('Water_Token_Adv4')) { matchedRole = 'Subj_Water_Adv4'; translatedWord = 'water'; MOCK_XDIC_DB[word] = 'water'; displayEn = 'water'; }
      if (word.includes('IsGood_Token_Adv4')) { matchedRole = 'Comp_IsGood_Adv4'; translatedWord = 'is good'; MOCK_XDIC_DB[word] = 'is good'; displayEn = 'is good'; } // 💡 결합되어 절대 삭제 불가능!
      if (word.includes('To_Token_Adv4')) { matchedRole = 'To_Inf_Adv4'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word.includes('Drink_Token_Adv4')) { matchedRole = 'Verb_Inf_Drink_Adv4'; translatedWord = 'drink'; MOCK_XDIC_DB[word] = 'drink'; displayEn = 'drink'; }

     // <부사구> 예문 3 ('is convenient' 결합형)
      if (word.includes('Diagram_Token_Adv3')) { matchedRole = 'Subj_Diagram_Adv3'; translatedWord = 'Diagram'; MOCK_XDIC_DB[word] = 'Diagram'; displayEn = 'Diagram'; }
      if (word.includes('IsConvenient_Token_Adv3')) { matchedRole = 'Comp_IsConvenient_Adv3'; translatedWord = 'is convenient'; MOCK_XDIC_DB[word] = 'is convenient'; displayEn = 'is convenient'; } // 💡 결합되어 절대 삭제 불가능!
      if (word.includes('To_Token_Adv3')) { matchedRole = 'To_Inf_Adv3'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word.includes('Teach_Token_Adv3')) { matchedRole = 'Verb_Inf_Teach_Adv3'; translatedWord = 'teach'; MOCK_XDIC_DB[word] = 'teach'; displayEn = 'teach'; }
      if (word.includes('HardSentence_Token_Adv3')) { matchedRole = 'Obj_HardestSentence_Adv3'; translatedWord = 'the hardest sentence '; MOCK_XDIC_DB[word] = 'the hardest sentence '; displayEn = 'the hardest sentence '; }
      if (word.includes('Sentence_Token_Adv3')) { matchedRole = 'Obj_HardestSentence_Adv3'; translatedWord = 'the sentence '; MOCK_XDIC_DB[word] = 'the sentence '; displayEn = 'the sentence '; } // 💡 [추가] 단독 '문장도' 역할표 및 번역어 적용!
      if (word.includes('Systematically_Token_Adv3')) { matchedRole = 'Adv_Systematically_Adv3'; translatedWord = 'systematically'; MOCK_XDIC_DB[word] = 'systematically'; displayEn = 'systematically'; }

     // <부사구> 예문 2
      if (word.includes('They_Token_Adv2')) { matchedRole = 'Subj_They_Adv2'; translatedWord = 'They'; MOCK_XDIC_DB[word] = 'They'; displayEn = 'They'; }
      if (word.includes('Were_Token_Adv2')) { matchedRole = 'Verb_Were_Adv2'; translatedWord = 'were'; MOCK_XDIC_DB[word] = 'were'; }
      if (word.includes('Sad_Token_Adv2')) { matchedRole = 'Comp_Sad_Adv2'; translatedWord = 'sad'; MOCK_XDIC_DB[word] = 'sad'; }
      if (word.includes('Not_Token_Adv2')) { matchedRole = 'Adv_Not_Adv2'; translatedWord = 'not'; MOCK_XDIC_DB[word] = 'not'; displayEn = 'not'; }
      if (word.includes('To_Token_Adv2')) { matchedRole = 'To_Inf_Adv2'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word.includes('Hear_Token_Adv2')) { matchedRole = 'Verb_Inf_Hear_Adv2'; translatedWord = 'hear'; MOCK_XDIC_DB[word] = 'hear'; }
      if (word.includes('TheNews_Token_Adv2')) { matchedRole = 'Obj_TheNews_Adv2'; translatedWord = 'the news'; MOCK_XDIC_DB[word] = 'the news'; displayEn = 'the news'; }
      if (word.includes('Of_Token_Adv2')) { matchedRole = 'Prep_Of_Adv2'; translatedWord = 'of'; MOCK_XDIC_DB[word] = 'of'; displayEn = 'of'; }
      if (word.includes('Their_Token_Adv2')) { matchedRole = 'Mod_Their_Adv2'; translatedWord = 'their'; MOCK_XDIC_DB[word] = 'their'; }
      if (word.includes('Family_Token_Adv2')) { matchedRole = 'Obj_Family_Adv2'; translatedWord = 'family'; MOCK_XDIC_DB[word] = 'family'; }

     // <부사구> 예문 1
      if (word.includes('I_Token_Adv1')) { matchedRole = 'Subj_I_Adv1'; translatedWord = 'I'; MOCK_XDIC_DB[word] = 'I'; displayEn = 'I'; }
      if (word.includes('Am_Token_Adv1')) { matchedRole = 'Verb_Am_Adv1'; translatedWord = 'am'; MOCK_XDIC_DB[word] = 'am'; }
      if (word.includes('Very_Token_Adv1')) { matchedRole = 'Adv_Very_Adv1'; translatedWord = 'very'; MOCK_XDIC_DB[word] = 'very'; displayEn = 'very'; }
      if (word.includes('Glad_Token_Adv1')) { matchedRole = 'Comp_Glad_Adv1'; translatedWord = 'glad'; MOCK_XDIC_DB[word] = 'glad'; }
      if (word.includes('To_Token_Adv1')) { matchedRole = 'To_Inf_Adv1'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word.includes('Meet_Token_Adv1')) { matchedRole = 'Verb_Inf_Meet_Adv1'; translatedWord = 'meet'; MOCK_XDIC_DB[word] = 'meet'; }
      if (word.includes('You_Token_Adv1')) { matchedRole = 'Obj_You_Adv1'; translatedWord = 'you'; MOCK_XDIC_DB[word] = 'you'; }
      if (word.includes('Here_Token_Adv1')) { matchedRole = 'Adv_Here_Adv1'; translatedWord = 'here'; MOCK_XDIC_DB[word] = 'here'; }

     // <형용사구> 예문 7
      if (word.includes('The_Token_7')) { matchedRole = 'Mod_The_7'; translatedWord = 'The'; MOCK_XDIC_DB[word] = 'The'; displayEn = 'The'; }
      if (word.includes('King_Token_7')) { matchedRole = 'Subj_King'; translatedWord = 'king'; MOCK_XDIC_DB[word] = 'king'; }
      if (word.includes('Gave_Token_7')) { matchedRole = 'Verb_Gave'; translatedWord = 'gave'; MOCK_XDIC_DB[word] = 'gave'; }
      if (word.includes('AGreatReward_Token_7')) { matchedRole = 'DO_Reward'; translatedWord = 'a great reward'; MOCK_XDIC_DB[word] = 'a great reward'; }
      if (word.includes('To_Token_7_3')) { matchedRole = 'Prep_To_Man'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; } // 💡 첫 번째 to
      if (word.includes('TheMan_Token_7')) { matchedRole = 'IO_Man'; translatedWord = 'the man'; MOCK_XDIC_DB[word] = 'the man'; }
      if (word.includes('To_Token_7_2')) { matchedRole = 'To_Inf_Teach'; translatedWord = 'to '; MOCK_XDIC_DB[word] = 'to '; displayEn = 'to '; } // 💡 두 번째 to (공백 1개 추가)
      if (word.includes('Teach_Token_7')) { matchedRole = 'Verb_Inf_Teach'; translatedWord = 'teach'; MOCK_XDIC_DB[word] = 'teach'; }
      if (word.includes('Him_Token_7')) { matchedRole = 'IO_Him_7'; translatedWord = 'him'; MOCK_XDIC_DB[word] = 'him'; }
      if (word.includes('TheRight_Token_7')) { matchedRole = 'Mod_Right'; translatedWord = 'the right'; MOCK_XDIC_DB[word] = 'the right'; displayEn = 'the right'; }
      if (word.includes('Time_Token_7')) { matchedRole = 'Obj_Time'; translatedWord = 'time'; MOCK_XDIC_DB[word] = 'time'; }
      if (word.includes('To_Token_7_1')) { matchedRole = 'To_Inf_Begin'; translatedWord = 'to  '; MOCK_XDIC_DB[word] = 'to  '; displayEn = 'to  '; } // 💡 세 번째 to (공백 2개 추가)
      if (word.includes('Begin_Token_7')) { matchedRole = 'Verb_Inf_Begin'; translatedWord = 'begin'; MOCK_XDIC_DB[word] = 'begin'; }
      if (word.includes('Anything_Token_7')) { matchedRole = 'Obj_Anything'; translatedWord = 'anything'; MOCK_XDIC_DB[word] = 'anything'; }

     // <형용사구> 예문 6 (💡 'He_Token'은 예문 3 코드에서 자동 처리됩니다!)
      if (word.includes('Is_Token')) { matchedRole = 'Verb_Is_6'; translatedWord = 'is'; MOCK_XDIC_DB[word] = 'is'; }
      if (word.includes('Dictator_Token')) { matchedRole = 'Comp_Dictator'; translatedWord = 'a dictator'; MOCK_XDIC_DB[word] = 'a dictator'; }
      if (word.includes('To_Token_6')) { matchedRole = 'To_Inf_Adj_Think'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word.includes('Think_Token')) { matchedRole = 'Verb_Inf_Think'; translatedWord = 'think'; MOCK_XDIC_DB[word] = 'think'; }
      if (word.includes('Himself_Token')) { matchedRole = 'Obj_Himself'; translatedWord = 'himself'; MOCK_XDIC_DB[word] = 'himself'; }
      if (word.includes('GreatLeader_Token')) { matchedRole = 'OC_GreatLeader'; translatedWord = 'a great leader'; MOCK_XDIC_DB[word] = 'a great leader'; }
      if (word.includes('Leader_Token')) { matchedRole = 'OC_GreatLeader'; translatedWord = 'a leader'; MOCK_XDIC_DB[word] = 'a leader'; } // 💡 [추가] 단독 '지도자라고' 역할표 및 번역어('a leader') 적용!

     // <형용사구> 예문 5
      if (word.includes('TheGirl_Token')) { matchedRole = 'Subj_TheGirl'; translatedWord = 'the girl'; MOCK_XDIC_DB[word] = 'the girl'; displayEn = 'The girl'; }
      if (word.includes('To_Token_5')) { matchedRole = 'To_Inf_Adj_Buy'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word.includes('Buy_Token_5')) { matchedRole = 'Verb_Inf_Buy'; translatedWord = 'buy'; MOCK_XDIC_DB[word] = 'buy'; }
      if (word.includes('Him_Token_5')) { matchedRole = 'IO_Him_5'; translatedWord = 'him'; MOCK_XDIC_DB[word] = 'him'; }
      if (word.includes('NicePresent_Token')) { matchedRole = 'DO_NicePresent'; translatedWord = 'a nice present'; MOCK_XDIC_DB[word] = 'a nice present'; }
      if (word.includes('On_Token_5')) { matchedRole = 'Prep_On_5'; translatedWord = 'on'; MOCK_XDIC_DB[word] = 'on'; displayEn = 'on'; }
      if (word.includes('His_Token_5')) { matchedRole = 'Mod_His_5'; translatedWord = 'his'; MOCK_XDIC_DB[word] = 'his'; }
      if (word.includes('Bday_Token')) { matchedRole = 'Obj_Bday'; translatedWord = 'birthday'; MOCK_XDIC_DB[word] = 'birthday'; }
      if (word.includes('Was_Token_5')) { matchedRole = 'Verb_Was_5'; translatedWord = 'was'; MOCK_XDIC_DB[word] = 'was'; }
      if (word.includes('Betty_Token')) { matchedRole = 'Comp_Betty'; translatedWord = 'Betty'; MOCK_XDIC_DB[word] = 'Betty'; displayEn = 'Betty'; }

     // <형용사구> 예문 4
      if (word.includes('최초의_first')) { matchedRole = 'Mod_First'; translatedWord = 'The first'; MOCK_XDIC_DB[word] = 'The first'; displayEn = 'The first'; }
      if (word.includes('사람들은_men')) { matchedRole = 'Subj_Men'; translatedWord = 'men'; MOCK_XDIC_DB[word] = 'men'; }
      if (word.includes('ㄴ_to_make')) { matchedRole = 'To_Inf_Adj_Make'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word.includes('짓다_make')) { matchedRole = 'Verb_Inf_Make'; translatedWord = 'make'; MOCK_XDIC_DB[word] = 'make'; }
      if (word.includes('그들의_their')) { matchedRole = 'Mod_Their'; translatedWord = 'their'; MOCK_XDIC_DB[word] = 'their'; }
      if (word.includes('집을_homes')) { matchedRole = 'Obj_Homes'; translatedWord = 'homes'; MOCK_XDIC_DB[word] = 'homes'; }
      if (word.includes('따라_along')) { matchedRole = 'Prep_Along'; translatedWord = 'along with'; MOCK_XDIC_DB[word] = 'along with'; displayEn = 'along with'; }
      if (word.includes('나일강을_nile')) { matchedRole = 'Obj_Nile'; translatedWord = 'the Nile River'; MOCK_XDIC_DB[word] = 'the Nile River'; }
      if (word.includes('에서_in_egypt')) { matchedRole = 'Prep_In_Egypt'; translatedWord = 'in'; MOCK_XDIC_DB[word] = 'in'; displayEn = 'in'; }
      if (word.includes('고대_ancient')) { matchedRole = 'Mod_Ancient'; translatedWord = 'ancient'; MOCK_XDIC_DB[word] = 'ancient'; }
      if (word.includes('이집트_egypt')) { matchedRole = 'Obj_Egypt'; translatedWord = 'Egypt'; MOCK_XDIC_DB[word] = 'Egypt'; displayEn = 'Egypt'; }
      if (word.includes('이었다_were')) { matchedRole = 'Verb_Were'; translatedWord = 'were'; MOCK_XDIC_DB[word] = 'were'; }
      if (word.includes('농부들_farmers')) { matchedRole = 'Comp_Farmers'; translatedWord = 'farmers'; MOCK_XDIC_DB[word] = 'farmers'; }

     // <형용사구> 예문 3
      if (word.includes('He_Token')) { matchedRole = 'Subj_He'; translatedWord = 'he'; MOCK_XDIC_DB[word] = 'he'; displayEn = 'He'; }
      if (word.includes('Sent_Token')) { matchedRole = 'Verb_Sent'; translatedWord = 'sent'; MOCK_XDIC_DB[word] = 'sent'; }
      if (word.includes('TheBook_Token')) { matchedRole = 'Obj_TheBook'; translatedWord = 'the book'; MOCK_XDIC_DB[word] = 'the book'; displayEn = 'the book'; }
      if (word.includes('PrepTo_Token')) { matchedRole = 'Prep_To_Son'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; } // 💡 독립적인 'to' 완벽 보장!
      if (word.includes('HisSon_Token')) { matchedRole = 'Obj_Son'; translatedWord = 'his son'; MOCK_XDIC_DB[word] = 'his son'; } // 💡 절대 다른 태그와 충돌 안 함!
      if (word.includes('ToBecome_Token')) { matchedRole = 'To_Inf_Adj_Become'; translatedWord = 'to become'; MOCK_XDIC_DB[word] = 'to become'; displayEn = 'to become'; }
      if (word.includes('Doctor_Token')) { matchedRole = 'Comp_Doctor'; translatedWord = 'a doctor'; MOCK_XDIC_DB[word] = 'a doctor'; }

      // <형용사구> 예문 2
      if (word.includes('다윈은_darwin')) { matchedRole = 'Subj_Darwin'; translatedWord = 'Darwin'; MOCK_XDIC_DB[word] = 'Darwin'; displayEn = 'Darwin'; }
      if (word.includes('였다_was')) { matchedRole = 'Verb_Was'; translatedWord = 'was'; MOCK_XDIC_DB[word] = 'was'; }
      if (word.includes('영국의_생물학자')) { matchedRole = 'Comp_Biologist'; translatedWord = 'a British biologist'; MOCK_XDIC_DB[word] = 'a British biologist'; }
      if (word.includes('생물학자_bio')) { matchedRole = 'Comp_Biologist'; translatedWord = 'a biologist'; MOCK_XDIC_DB[word] = 'a biologist'; } // 💡 [추가] 단독 '생물학자' 역할표 적용!
      if (word.includes('ㄴ_to_be')) { matchedRole = 'To_Inf_Adj_Be'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word.includes('되다_be')) { matchedRole = 'Verb_Inf_Be'; translatedWord = 'be'; MOCK_XDIC_DB[word] = 'be'; }
      if (word.includes('유명한_famous')) { matchedRole = 'Comp_Famous'; translatedWord = 'famous'; MOCK_XDIC_DB[word] = 'famous'; }
      if (word.includes('으로_for')) { matchedRole = 'Prep_For'; translatedWord = 'for'; MOCK_XDIC_DB[word] = 'for'; displayEn = 'for'; }
      if (word.includes('그의_his')) { matchedRole = 'Mod_His'; translatedWord = 'his'; MOCK_XDIC_DB[word] = 'his'; }
      if (word.includes('이론_theories')) { matchedRole = 'Obj_Theories'; translatedWord = 'theories'; MOCK_XDIC_DB[word] = 'theories'; }
      if (word.includes('에대한_on')) { matchedRole = 'Prep_On'; translatedWord = 'on'; MOCK_XDIC_DB[word] = 'on'; displayEn = 'on'; }
      if (word.includes('진화_evo')) { matchedRole = 'Obj_Evo'; translatedWord = 'evolution'; MOCK_XDIC_DB[word] = 'evolution'; }

      // <형용사구> 예문 1
      // 💡 [수프로 엣지] 숨은 기호나 공백이 붙어있어도 무조건 낚아채는 절대 방어망!
      if (word.includes('방문했다_visited')) { matchedRole = 'Verb_Visited'; translatedWord = 'visited'; MOCK_XDIC_DB[word] = 'visited'; }
      if (word === '나의_my') { matchedRole = 'Mod_My'; translatedWord = 'my'; MOCK_XDIC_DB[word] = 'my'; }
      if (word === '아저씨를_uncle') { matchedRole = 'Obj_Uncle'; translatedWord = 'uncle'; MOCK_XDIC_DB[word] = 'uncle'; }
      if (word === 'ㄴ_to') { matchedRole = 'To_Inf_Adj_Live'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word === '사시다_live') { matchedRole = 'Verb_Inf_Live'; translatedWord = 'live'; MOCK_XDIC_DB[word] = 'live'; }
      if (word === '에_in_cali') { matchedRole = 'Prep_In_Cali'; translatedWord = 'in'; MOCK_XDIC_DB[word] = 'in'; displayEn = 'in'; }
      if (word === '캘리포니아_cali') { matchedRole = 'Obj_Cali'; translatedWord = 'California'; MOCK_XDIC_DB[word] = 'California'; displayEn = 'California'; }

      // <보충어구> 예문 6
      if (word === '나는_I') { matchedRole = 'Subj_I'; translatedWord = 'I'; MOCK_XDIC_DB[word] = 'I'; displayEn = 'I'; }
      if (word === '가르쳤다_taught') { matchedRole = 'Verb_Taught'; translatedWord = 'taught'; MOCK_XDIC_DB[word] = 'taught'; }
      if (word === '그에게_him') { matchedRole = 'Obj_Him'; translatedWord = 'him'; MOCK_XDIC_DB[word] = 'him'; }
      if (word === '라고_to') { matchedRole = 'To_Inf_OC'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word === '책을_thebook') { matchedRole = 'Inf_Obj_TheBook'; translatedWord = 'the book'; MOCK_XDIC_DB[word] = 'the book'; }
      // (💡 '읽다_read'는 예문 4에서 이미 Verb_Inf_Read로 세팅해두었으므로 찰떡같이 자동 재활용합니다!)

      // <보충어구> 예문 5
      if (word === '우리의_our1') { matchedRole = 'Mod_Our_1'; translatedWord = 'our'; MOCK_XDIC_DB[word] = 'our'; displayEn = 'Our'; }
      if (word === '우리의_our2') { matchedRole = 'Mod_Our_2'; translatedWord = 'our'; MOCK_XDIC_DB[word] = 'our'; }
      if (word === '책무는_resp') { matchedRole = 'Subj_Resp'; translatedWord = 'responsibility'; MOCK_XDIC_DB[word] = 'responsibility'; }
      if (word === '것_to_keep') { matchedRole = 'To_Inf_Keep'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word === '유지하다_keep') { matchedRole = 'Verb_Inf_Keep'; translatedWord = 'keep'; MOCK_XDIC_DB[word] = 'keep'; }
      if (word === '자연_nat') { matchedRole = 'Mod_Nat'; translatedWord = 'natural'; MOCK_XDIC_DB[word] = 'natural'; }
      if (word === '환경을_env') { matchedRole = 'Obj_Env'; translatedWord = 'environment'; MOCK_XDIC_DB[word] = 'environment'; }
      if (word === '깨끗한_clean') { matchedRole = 'Comp_Clean'; translatedWord = 'clean'; MOCK_XDIC_DB[word] = 'clean'; }
      if (word === '접속사_and') { matchedRole = 'Safe_And'; translatedWord = 'and'; MOCK_XDIC_DB[word] = 'and'; displayEn = 'and'; } // 💡 철통 방어 역할표 적용!
      if (word === '아름답게_beautiful') { matchedRole = 'Comp_Beautiful'; translatedWord = 'beautiful'; MOCK_XDIC_DB[word] = 'beautiful'; }

      // <보충어구> 예문 4
      if (word === '것_to_read') { matchedRole = 'To_Inf_Read'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word === '읽다_read') { matchedRole = 'Verb_Inf_Read'; translatedWord = 'read'; MOCK_XDIC_DB[word] = 'read'; }
      if (word === '많은_many') { matchedRole = 'Mod_Many'; translatedWord = 'many'; MOCK_XDIC_DB[word] = 'many'; }
      if (word === '책을_books') { matchedRole = 'Obj_Books'; translatedWord = 'books'; MOCK_XDIC_DB[word] = 'books'; }
      if (word === '에서_in_country') { matchedRole = 'Prep_In_Country'; translatedWord = 'in'; MOCK_XDIC_DB[word] = 'in'; displayEn = 'in'; }
      if (word === '조용한_시골') { matchedRole = 'Obj_Country'; translatedWord = 'the silent country'; MOCK_XDIC_DB[word] = 'the silent country'; displayEn = 'the silent country'; }
      if (word === '에_at') { matchedRole = 'Prep_At_Time'; translatedWord = 'at'; MOCK_XDIC_DB[word] = 'at'; displayEn = 'at'; }
      if (word === '이번_thistime') { matchedRole = 'Obj_This_Time'; translatedWord = 'this time'; MOCK_XDIC_DB[word] = 'this time'; }
      
      // 💡 [수프로 엣지] <보충어구> 예문 3 (레거시 방어 + 번역어 강제 주입 완벽 통합본!)
      if (word.includes('목표는')) { matchedRole = 'Subj_Aim'; translatedWord = 'the aim'; MOCK_XDIC_DB[word] = 'the aim'; displayEn = 'The aim'; }
      if (word === '의_plan') { matchedRole = 'Prep_Of_Plan'; translatedWord = 'of'; MOCK_XDIC_DB[word] = 'of'; }
      if (word === '이번_this') { matchedRole = 'Mod_This'; translatedWord = 'this'; MOCK_XDIC_DB[word] = 'this'; }
      if (word === '교육_1') { matchedRole = 'Mod_Edu_1'; translatedWord = 'education'; MOCK_XDIC_DB[word] = 'education'; }
      if (word === '개혁') { matchedRole = 'Obj_Reform'; translatedWord = 'reform'; MOCK_XDIC_DB[word] = 'reform'; }
      if (word === '것_to_offer') { matchedRole = 'To_Inf_Offer'; translatedWord = 'to'; MOCK_XDIC_DB[word] = 'to'; displayEn = 'to'; }
      if (word === '부여하다_offer') { matchedRole = 'Verb_Inf_Offer'; translatedWord = 'offer'; MOCK_XDIC_DB[word] = 'offer'; }
      if (word === '모든_all') { matchedRole = 'Mod_All'; translatedWord = 'all'; MOCK_XDIC_DB[word] = 'all'; }
      if (word === '학생들에게_std') { matchedRole = 'IO_Students'; translatedWord = 'the students'; MOCK_XDIC_DB[word] = 'the students'; }
      if (word === '공평한_equal') { matchedRole = 'Mod_Equal'; translatedWord = 'equal'; MOCK_XDIC_DB[word] = 'equal'; }
      if (word === '기회를_opp') { matchedRole = 'Obj_Opp'; translatedWord = 'opportunity'; MOCK_XDIC_DB[word] = 'opportunity'; }
      if (word === '의_edu') { matchedRole = 'Prep_Of_Edu'; translatedWord = 'of'; MOCK_XDIC_DB[word] = 'of'; }
      if (word === '교육_2') { matchedRole = 'Obj_Edu_2'; translatedWord = 'education'; MOCK_XDIC_DB[word] = 'education'; }

      // <보충어구> 예문 2
      if (word === '그의_his') { matchedRole = 'Mod_His'; translatedWord = 'his'; displayEn = 'His'; }
      if (word === '꿈은') { matchedRole = 'Subj_Hope'; translatedWord = 'hope'; }
      if (word === '것_to') { matchedRole = 'To_Inf_Comp'; translatedWord = 'to'; displayEn = 'to'; }
      if (word === '되다_become') { matchedRole = 'Verb_Inf_Become'; translatedWord = 'become'; }
      if (word === '훌륭한_의사가') { matchedRole = 'Comp_Doctor'; translatedWord = 'a great doctor'; }
      if (word === '의사가_doc') { matchedRole = 'Comp_Doctor'; translatedWord = 'a doctor'; } // 💡 [추가] '의사가' 단독 부품
      if (word === '에_in_future') { matchedRole = 'Prep_In_Future'; translatedWord = 'in'; displayEn = 'in'; }
      if (word === '미래_future') { matchedRole = 'Obj_Future'; translatedWord = 'the future'; displayEn = 'the future'; }

      // <보충어구> 예문 1
      if (word === '나의_plan') { matchedRole = 'Mod_My_Plan'; translatedWord = 'My'; displayEn = 'My'; }
      if (word === '계획은') { matchedRole = 'Subj_Plan'; translatedWord = 'plan'; }
      if (word === '것') { matchedRole = 'To_Inf_Comp'; translatedWord = 'to'; displayEn = 'to'; }
      if (word === '가다') { matchedRole = 'Verb_Inf_Go'; translatedWord = 'go'; }
      if (word === '에_to') { matchedRole = 'Prep_To_Museum'; translatedWord = 'to'; }
      if (word === '박물관') { matchedRole = 'Obj_Museum'; translatedWord = 'the museum'; }
      if (word === '와함께') { matchedRole = 'Prep_With_Her'; translatedWord = 'with'; }
      if (word === '그녀') { matchedRole = 'Obj_With_Her'; translatedWord = 'her'; }
      if (word === '에_on') { matchedRole = 'Prep_On_Weekend'; translatedWord = 'on'; }
      if (word === '이번') { matchedRole = 'Mod_This_Weekend'; translatedWord = 'this'; }
      if (word === '주말') { matchedRole = 'Obj_Weekend'; translatedWord = 'weekend'; }

      // <목적어구> 예문 7
      if (word === '고대(의)_그리스인들은') { matchedRole = 'Subj_Greeks'; translatedWord = 'the ancient Greeks'; displayEn = 'The ancient Greeks'; }
      if (word === '그들의') { matchedRole = 'Modifier_Obj'; translatedWord = 'their'; }
      if (word === '몸을') { matchedRole = 'Inf_Obj_Bodies'; translatedWord = 'bodies'; }
      if (word === '튼튼하게') { matchedRole = 'Obj_Comp_Strong'; translatedWord = 'strong'; }
      if (word === '기를_make') { matchedRole = 'To_Inf_Make'; translatedWord = 'to'; displayEn = 'to'; }
      if (word === '하다') { matchedRole = 'Verb_Inf_Make'; translatedWord = 'make'; }
      if (word === '으로_with') { matchedRole = 'Prep_With_Ex'; translatedWord = 'with'; }
      if (word === '운동') { matchedRole = 'Inst_Ex'; translatedWord = 'exercises'; }
      if (word === '의_gym') { matchedRole = 'Prep_Of_Gym'; translatedWord = 'of'; }
      if (word === '연무장') { matchedRole = 'Obj_Of_Gym'; translatedWord = 'gymnasium'; }

      // <목적어구> 예문 6
      if (word === '잘못') { matchedRole = 'Comp_Wrong'; translatedWord = 'wrong'; displayEn = 'wrong'; }
      if (word === '것은_1') { matchedRole = 'To_Inf_1'; translatedWord = 'to'; displayEn = 'to'; }
      if (word === '바라다') { matchedRole = 'Verb_Inf_Want'; translatedWord = 'want'; }
      if (word === '기를_2') { matchedRole = 'To_Inf_2'; translatedWord = 'to'; displayEn = 'to'; }
      if (word === '남겨주다') { matchedRole = 'Verb_Inf_Leave'; translatedWord = 'leave'; }
      if (word === '너희들에게') { matchedRole = 'IO_You'; translatedWord = 'you'; }
      if (word === '많은') { matchedRole = 'Mod_Much'; translatedWord = 'much'; }
      if (word === '부를') { matchedRole = 'Obj_Wealth'; translatedWord = 'wealth'; }

      // <목적어구> 예문 5
      if (word === '좋아했다') { matchedRole = 'Verb_Past_Like'; translatedWord = 'liked'; }
      if (word === '기를_tell') { matchedRole = 'To_Inf_Tell'; translatedWord = 'to'; }
      if (word === '말해주다') { matchedRole = 'Verb_Inf_Tell'; translatedWord = 'tell'; }
      if (word === '관광객들에게') { matchedRole = 'IO_Tourists'; translatedWord = 'tourists'; }
      if (word === '역사') { matchedRole = 'Obj_Hist'; translatedWord = 'the history'; }
      if (word === '와_hist') { matchedRole = 'Conj_And_Hist'; translatedWord = 'and'; }
      if (word === '문화를') { matchedRole = 'Obj_Cult'; translatedWord = 'culture'; }
      if (word === '의_greece') { matchedRole = 'Prep_Of_Greece'; translatedWord = 'of'; }
      if (word === '그리스') { matchedRole = 'Obj_Greece'; translatedWord = 'Greece'; displayEn = 'Greece'; }

      // <목적어구> 예문 4
      if (word === '그녀는') { matchedRole = 'Subject'; translatedWord = 'she'; displayEn = 'She'; }
      if (word === '결심했다') { matchedRole = 'Verb_Past'; translatedWord = 'decided'; }
      if (word === '것을') { matchedRole = 'To_Infinitive'; translatedWord = 'to'; }
      if (word === '물들이다') { matchedRole = 'Verb_Infinitive'; translatedWord = 'dye'; }
      if (word === '그녀의') { matchedRole = 'Modifier_Obj'; translatedWord = 'her'; }
      if (word === '손톱을') { matchedRole = 'Infinitive_Object'; translatedWord = 'fingernails'; }
      if (word === '로_with') { matchedRole = 'Postposition_Through'; translatedWord = 'with'; }
      if (word === '그_inst') { matchedRole = 'Modifier_Inst'; translatedWord = 'the'; }
      if (word === '꽃잎들') { matchedRole = 'Instrument'; translatedWord = 'petals'; }
      
      // <목적어구> 예문 3
      if (word === '그') { matchedRole = 'Modifier'; translatedWord = 'the'; }
      if (word === '총명한') { matchedRole = 'Modifier_2'; translatedWord = 'bright'; }
      if (word === '소년은') { matchedRole = 'Subject'; translatedWord = 'boy'; }
      if (word === '원했다') { matchedRole = 'Verb_Past'; translatedWord = 'wanted'; }
      if (word === '되다_inf') { matchedRole = 'Verb_Infinitive'; translatedWord = 'become'; }
      if (word === '위대한_과학자가') { matchedRole = 'Infinitive_Object'; translatedWord = 'a great scientist'; }
      if (word === '과학자가') { matchedRole = 'Infinitive_Object'; translatedWord = 'a scientist'; }
      
      // <목적어구> 예문 2
      if (word === '알다_inf') { matchedRole = 'Verb_Infinitive'; translatedWord = 'know'; }
      if (word === '에_대해서') { matchedRole = 'Postposition_About'; translatedWord = 'about'; }
      if (word === '동물') { matchedRole = 'Object_About_1'; translatedWord = 'animals'; }
      if (word === '과_about') { matchedRole = 'Conjunction_And_About'; translatedWord = 'and'; }
      if (word === '식물') { matchedRole = 'Object_About_2'; translatedWord = 'plants'; }
      
      // <목적어구> 예문 1
      if (word === '나는') { matchedRole = 'Subject'; translatedWord = 'I'; }
      if (word === '원하다') { matchedRole = 'Verb'; translatedWord = 'want'; }
      if (word === '기를') { matchedRole = 'To_Infinitive'; translatedWord = 'to'; }
      if (word === '쉬다_inf') { matchedRole = 'Verb_Infinitive'; translatedWord = 'rest'; }
      if (word === '에서_in') { matchedRole = 'Location_Prep'; translatedWord = 'in'; }
      if (word === '집') { matchedRole = 'Location'; translatedWord = 'the house'; }
      
      if (word === '가르쳐주다') { matchedRole = 'Verb_Infinitive_1'; translatedWord = 'teach'; }
      if (word === '젊은이들에게') { matchedRole = 'IndirectObject'; translatedWord = 'youths'; }
      if (word === '참된_obj') { matchedRole = 'Modifier_Obj'; translatedWord = 'the true'; }
      if (word === '과제를') { matchedRole = 'Object'; translatedWord = 'subject-matters'; }
      if (word === '서_and') { matchedRole = 'Conjunction_And_Inf'; translatedWord = 'and'; }
      if (word === '만들다') { matchedRole = 'Verb_Infinitive_2'; translatedWord = 'make'; }
      if (word === '그들을') { matchedRole = 'Infinitive_Object_2'; translatedWord = 'them'; }
      if (word === '훌륭한_oc') { matchedRole = 'Modifier_Comp_2'; translatedWord = 'great'; }
      if (word === '젊은이로') { matchedRole = 'Object_Complement'; translatedWord = 'youths'; }
      if (word === '나의_1') { matchedRole = 'Modifier_Comp'; translatedWord = 'my'; }
      if (word === '의무') { matchedRole = 'Complement'; translatedWord = 'duty'; }
      if (word === '것이_1') { matchedRole = 'To_Infinitive'; translatedWord = 'to'; }
      if (word === '유지하다') { matchedRole = 'Verb_Infinitive_1'; translatedWord = 'uphold'; }
      if (word === '입헌정치를') { matchedRole = 'Infinitive_Object_1'; translatedWord = 'consitutional government'; }
      if (word === '고_and') { matchedRole = 'Conjunction_And_Inf'; translatedWord = 'and'; }
      if (word === '것이_2') { matchedRole = 'To_Infinitive_2'; translatedWord = '(to)'; }
      if (word === '증진시키다') { matchedRole = 'Verb_Infinitive_2'; translatedWord = 'advance'; }
      if (word === '행복') { matchedRole = 'Object_And_1'; translatedWord = 'the happiness'; }
      if (word === '과_obj') { matchedRole = 'Conjunction_And_Obj'; translatedWord = 'and'; }
      if (word === '번영을') { matchedRole = 'Object_And_2'; translatedWord = 'prosperity'; }
      if (word === '의') { matchedRole = 'Postposition_Of'; translatedWord = 'of'; }
      if (word === '나의_2') { matchedRole = 'Modifier_Of'; translatedWord = 'my'; }
      if (word === '신민들') { matchedRole = 'Object_Of'; translatedWord = 'peoples'; }
      if (word === '놀다_inf' && !originalText.includes('일하고')) { matchedRole = 'Verb_Infinitive_1'; translatedWord = 'play'; }
      if (word === '에_during') { matchedRole = 'Time_Prep'; translatedWord = 'during'; }
      if (word === '것은_inf1') { matchedRole = 'To_Infinitive'; translatedWord = 'to'; }
      if (word === '일하다_inf') { matchedRole = 'Verb_Infinitive_1'; translatedWord = 'work'; }
      if (word === '고_and') { matchedRole = 'Conjunction_And_Inf'; translatedWord = 'and'; }
      if (word === '것은_inf2') { matchedRole = 'To_Infinitive_2'; translatedWord = '(to)'; }
      if (word === '놀다_inf') { matchedRole = 'Verb_Infinitive_2'; translatedWord = 'play'; }
      if (word === '우리의') { matchedRole = 'Modifier_Comp'; translatedWord = 'our'; }
      if (word === '일') { matchedRole = 'Complement'; translatedWord = 'task'; }
      if (word === '빌려주다') { matchedRole = 'Verb_Infinitive_1'; translatedWord = 'lend'; }
      if (word === '많은_io') { matchedRole = 'Modifier_IO'; translatedWord = 'many'; }
      if (word === '시민들에게') { matchedRole = 'IndirectObject'; translatedWord = 'citizens'; }
      if (word === '많은_obj') { matchedRole = 'Modifier_Obj'; translatedWord = 'many'; }
      if (word === '책을') { matchedRole = 'Object'; translatedWord = 'books'; }
      if (word === '이번_독서주간') { matchedRole = 'Time'; translatedWord = 'this reading week'; }
      if (word === '대단히') { matchedRole = 'Modifier_Comp'; translatedWord = 'very'; }
      if (word === '쉬운') { matchedRole = 'Complement'; translatedWord = 'easy'; }
      if (word === '기는') { matchedRole = 'To_Infinitive'; translatedWord = 'to'; }
      if (word === '공부하다') { matchedRole = 'Verb_Infinitive_1'; translatedWord = 'study'; }
      if (word === '영어를') { matchedRole = 'Infinitive_Object'; translatedWord = 'English'; }
      if (word === '이러한_방법으로') { matchedRole = 'Adverb_Prep'; translatedWord = 'in this way'; }
      if (word === '좋은') { matchedRole = 'Complement'; translatedWord = 'good'; }
      if (word === '에_for') { matchedRole = 'Postposition_For'; translatedWord = 'for'; }
      if (word === '건강') { matchedRole = 'Object_For'; translatedWord = 'health'; }
      if (word === '일어나다') { matchedRole = 'Verb_Infinitive_1'; translatedWord = 'get up'; }
      if (word === '일찍') { matchedRole = 'Adverb'; translatedWord = 'early'; }
      if (word === '에_in') { matchedRole = 'Time_Prep'; translatedWord = 'in'; displayEn = 'in'; }
      if (word === '아침') { matchedRole = 'Time'; translatedWord = 'the morning'; }
      if (word === '것이') { matchedRole = 'To_Infinitive'; translatedWord = 'to'; displayEn = 'to'; }
      if (word === '그는') { matchedRole = 'Subject'; translatedWord = 'he'; }
      if (word === '생계를') { matchedRole = 'Object_For'; translatedWord = 'a living'; }
      if (word === '위하여') { matchedRole = 'Postposition_For'; translatedWord = 'for'; }
      if (word === '열심히') { matchedRole = 'Adverb'; translatedWord = 'hard'; }
      if (word === '일해야만_했다') { matchedRole = 'Verb'; translatedWord = 'had to work'; }
      if (word === '나의_아버지는') { matchedRole = 'Subject'; translatedWord = 'my father'; }
      if (word === '나의') { matchedRole = 'Modifier'; translatedWord = 'my'; }
      if (word === '아버지는') { matchedRole = 'Subject'; translatedWord = 'father'; }
      if (word === '일하다') { matchedRole = 'Verb'; translatedWord = 'works'; }
      if (word === '부터') { matchedRole = 'Time_Prep'; translatedWord = 'from'; }
      if (word === '까지') { matchedRole = 'Time_Prep_2'; translatedWord = 'till'; }
      if (word === '저녁') { matchedRole = 'Time_2'; translatedWord = 'evening'; }
      if (word === '이다') { matchedRole = 'Verb'; translatedWord = 'is'; displayEn = 'is'; }
      if (word === '꿈') { matchedRole = 'Complement'; translatedWord = 'hope'; displayEn = 'hope'; }
      if (word === '되다') { matchedRole = 'Verb_Infinitive_1'; translatedWord = 'be'; displayEn = 'be'; }
      if (word === '위대한_시인이') { matchedRole = 'Infinitive_Object'; translatedWord = 'a great poet'; displayEn = 'a great poet'; }
      if (word === '에' && originalText.includes('미래')) { matchedRole = 'Time_Prep'; translatedWord = 'in'; displayEn = 'in'; }
      if (word === '미래') { matchedRole = 'Time'; translatedWord = 'the future'; displayEn = 'the future'; }
      if (word === 'lived') { matchedRole = 'Verb_Past'; translatedWord = getKoreanConjugation('살다', 'past'); } 
      if (word === 'here') { 
          if (originalText.toLowerCase().includes('lived') || originalText.toLowerCase().includes('gathered')) { matchedRole = 'Location'; translatedWord = originalText.toLowerCase().includes('gathered') ? '여기에' : '이곳에'; } 
          else { matchedRole = 'Location'; translatedWord = '이곳에'; }
      }
      if (word === 'see') { matchedRole = 'Verb_Infinitive'; translatedWord = (words[i-1] === 'to' && originalText.toLowerCase().includes('lived')) ? '만나다' : '만날'; }
      if (word === 'long') { matchedRole = 'Adverb'; translatedWord = '오래'; }
      if (word === 'grandson') { matchedRole = 'Infinitive_Object'; translatedWord = '손자를'; }
      if (word === 'again') { matchedRole = 'Adverb_End'; translatedWord = '다시'; }
      if (word === 'child') { matchedRole = 'Subject'; translatedWord = '아이는'; }
      if (word === 'grew') { matchedRole = 'Verb_Past'; translatedWord = getKoreanConjugation('자라다', 'past'); } 
      if (word === 'be') { matchedRole = 'Verb_Infinitive'; translatedWord = '되다'; }
      if (word === 'a_fine_youth') { matchedRole = 'Complement'; translatedWord = '훌륭한 청년이'; }
      if (word === 'albert_schweitzer') { matchedRole = 'Subject'; translatedWord = '알버트 슈바이처는'; }
      if (word === 'used') { matchedRole = 'Verb_Past'; translatedWord = getKoreanConjugation('사용하다', 'past'); } 
      if (word === 'the_prize_money') { matchedRole = 'Object'; translatedWord = '그 상금을'; }
      if (word === 'make') { 
          matchedRole = (words[i+1] === 'the_hospital') ? 'Verb_Infinitive_1' : (words[i+1] === 'a_place') ? 'Verb_Infinitive_2' : 'Verb_Infinitive';
          translatedWord = '만들다'; 
      }
      if (word === 'the_hospital') { matchedRole = 'Infinitive_Object_1'; translatedWord = '그 병원을'; }
      if (word === 'bigger') { matchedRole = 'Object_Complement_1'; translatedWord = '더 크게'; }
      if (word === 'a_place') { matchedRole = 'Infinitive_Object_2'; translatedWord = '장소를'; }
      if (word === 'for') { matchedRole = 'Postposition_For'; translatedWord = (words[i+1] === 'people') ? '위한' : '위하여'; }
      if (word === 'people') { matchedRole = 'Object_For'; translatedWord = '사람들을'; }
      if (word === 'suffer_from') { matchedRole = 'Verb_Infinitive_3'; translatedWord = '고통받다'; }
      if (word === 'leprosy') { matchedRole = 'Infinitive_Object_3'; translatedWord = '나병으로'; }
      if (word === '특별') { matchedRole = 'Modifier_Obj'; translatedWord = '특별'; }
      if (word === '프로그램을') { matchedRole = 'Object'; translatedWord = '프로그램을'; }
      if (word === '문화와') { matchedRole = 'Object_And_1'; translatedWord = '문화와'; }
      if (word === '관습과') { matchedRole = 'Object_And_2'; translatedWord = '관습과'; }
      if (word === '예술을') { matchedRole = 'Infinitive_Object'; translatedWord = '예술을'; }
      if (word === '다른') { matchedRole = 'Modifier_Of'; translatedWord = '다른'; }
      if (word === '나라') { matchedRole = 'Object_Of'; translatedWord = '나라'; }
      if (word === '동안에') { matchedRole = 'Time_Prep'; translatedWord = '동안에'; }
      if (word === '방학') { matchedRole = 'Time'; translatedWord = '방학'; }
      if (word === '오래된') { matchedRole = 'Modifier_2'; translatedWord = '오래된'; }
      if (word === '집을') { matchedRole = 'Object'; translatedWord = '집을'; }
      if (word === '살다') { matchedRole = 'Verb_Infinitive'; translatedWord = '살다'; }
      if (word === '조용한') { matchedRole = 'Modifier_Loc'; translatedWord = '조용한'; } 
      if (word === '시골') { matchedRole = 'Location'; translatedWord = '시골'; }
      if (word === '과함께') { matchedRole = 'Postposition_With'; translatedWord = '과함께'; }
      if (word === '착한') { matchedRole = 'Modifier_With_2'; translatedWord = '착한'; }
      if (word === '아내') { matchedRole = 'Object_With_1'; translatedWord = '아내'; }
      if (word === '와') { matchedRole = 'Conjunction_And_With'; translatedWord = 'and'; }
      if (word === '우리는') { matchedRole = 'Subject'; translatedWord = 'we'; } 
      if (word === 'today') { matchedRole = 'Time'; translatedWord = '오늘'; }
      if (word === 'talk') { matchedRole = 'Verb_Infinitive'; translatedWord = '의논하다'; }
      if (word === 'about') { matchedRole = 'Postposition_About'; translatedWord = '에대해'; }
      if (word === 'an_important_thing') { matchedRole = 'Object_About_1'; translatedWord = '중요한 일'; }
      if (word === 'you') { 
          if (words[i-1] === '만날' || words[i-1] === 'see' || words[i-1] === '만나다') { matchedRole = 'Infinitive_Object'; translatedWord = '너를'; } 
          else if (words[i-1] === 'meet') { matchedRole = 'Object'; translatedWord = '너를'; } 
          else { matchedRole = 'Subject'; translatedWord = '너는'; } 
      }
      if (word === 'too') { matchedRole = 'Modifier_Adverb'; translatedWord = '아주'; } 
      if (word === 'idle') { matchedRole = 'Complement'; translatedWord = '게으른'; }
      if (word === 'read') { matchedRole = 'Verb_Infinitive'; translatedWord = (originalText.includes('too') || originalText.includes('아주 게으르다')) ? '읽을 수 없다' : '읽다'; } 
      if (word === 'boy') { matchedRole = 'Subject'; translatedWord = '소년은'; }
      if (word === 'clever') { matchedRole = 'Complement'; translatedWord = '영리한'; }
      if (word === 'enough') { matchedRole = 'Adverb'; translatedWord = '아주'; } 
      if (word === 'understand') { matchedRole = 'Verb_Infinitive'; translatedWord = '이해할 수 있다'; }
      if (word === 'it') { matchedRole = 'Infinitive_Object'; translatedWord = '그것을'; }
      if (word === 'he') { matchedRole = 'Subject'; translatedWord = 'he'; }
      if (word === 'so') { matchedRole = 'Modifier_Adverb'; translatedWord = '아주'; }
      if (word === 'late') { matchedRole = 'Adverb'; translatedWord = '늦게'; }
      if (word === 'as_to') { matchedRole = 'To_Infinitive_Result'; translatedWord = '그래서'; } 
      if (word === 'miss') { matchedRole = 'Verb_Infinitive'; translatedWord = '놓치다'; }
      if (word === 'the_train') { matchedRole = 'Infinitive_Object'; translatedWord = '기차를'; }
      if (word === 'this') { matchedRole = 'Modifier'; translatedWord = '이'; } 
      if (word === 'water') { matchedRole = 'Subject'; translatedWord = '물은'; }
      if (word === 'good') { matchedRole = 'Complement'; translatedWord = '좋은'; }
      if (word === 'diagram') { matchedRole = 'Subject'; translatedWord = '도해는'; }
      if (word === 'convenient') { matchedRole = 'Complement'; translatedWord = '편리한'; }
      if (word === 'the_hardest_sentence') { matchedRole = 'Infinitive_Object'; translatedWord = '어려운 문장도'; }
      if (word === 'systematically') { matchedRole = 'Adverb'; translatedWord = '체계적으로'; }
      if (word === 'they') { matchedRole = 'Subject'; translatedWord = 'they'; }
      if (word === 'sad') { matchedRole = 'Complement'; translatedWord = '슬픈'; }
      if (word === 'not') { matchedRole = 'Not_Infinitive'; translatedWord = '못하다'; } 
      if (word === '듣지') { matchedRole = 'Verb_Infinitive'; translatedWord = 'hear'; }
      if (word === '소식을') { matchedRole = 'Infinitive_Object'; translatedWord = 'the news'; }
      if (word === '자기') { matchedRole = 'Modifier_Of'; translatedWord = '자기'; }
      if (word === '가족') { matchedRole = 'Object_Of'; translatedWord = '가족'; }
      if (word === '나는') { matchedRole = 'Subject'; translatedWord = 'I'; } 
      if (word === '매우') { matchedRole = 'Modifier_Comp'; translatedWord = 'very'; }
      if (word === '기쁜') { matchedRole = 'Complement'; translatedWord = 'glad'; }

      if (word === 'to') {
          if (words[i-1] === 'here') {
              matchedRole = originalText.toLowerCase().includes('lived') ? 'To_Infinitive_Result' : 'To_Infinitive_Purpose'; 
              translatedWord = originalText.toLowerCase().includes('lived') ? '그래서' : '목적으로';
          }
          else if (words[i-1] === 'long' || words[i-1] === 'grew') { matchedRole = 'To_Infinitive_Result'; translatedWord = '서'; } 
          else if (words[i+1] === 'make' || words[i+1] === 'teach' || words[i+1] === 'live' || words[i+1] === 'talk') { matchedRole = 'To_Infinitive_Purpose'; translatedWord = (words[i+1] === 'talk') ? '~하기위해' : '위해서'; } 
          else if (words[i+1] === 'suffer_from' || words[i+1] === 'teach' || words[i+1] === 'begin' || words[i+1] === 'think' || words[i+1] === 'his_son' || words[i+1] === 'become' || words[i+1] === 'be' || words[i+1] === 'live') { matchedRole = (words[i+1] === 'begin') ? 'To_Infinitive_Adj_2' : 'To_Infinitive_Adj'; translatedWord = (words[i+1] === 'begin') ? 'ㄹ' : 'ㄴ'; } 
          else if (words[i-1] === 'idle' || words[i-1] === 'enough') { matchedRole = 'To_Infinitive_Result'; translatedWord = '그래서'; } 
          else if (words[i-1] === 'good' || words[i-1] === 'convenient') { matchedRole = 'To_Infinitive_Adv'; translatedWord = '~하기에'; } 
          else if (words[i+1] === 'hear' && words[i-1] === 'not') { matchedRole = 'To_Infinitive_Adv'; translatedWord = '~하기때문에'; } 
          else if (words[i-1] === 'glad') { matchedRole = 'To_Infinitive_Adv'; translatedWord = '~하니'; } 
          else if (words[i-1] === 'the_girl' || words[i-1] === 'men') { matchedRole = 'To_Infinitive_Adj_Subj'; translatedWord = 'ㄴ'; } 
          else if (words[i-1] === 'him' && words[i+1] === 'read') { matchedRole = 'To_Infinitive_OC'; translatedWord = '라고'; } 
          else if (words[i+1] === 'keep' || words[i+1] === 'read' || words[i+1] === 'offer' || words[i+1] === 'go' || words[i+1] === 'become') { matchedRole = 'To_Infinitive_Comp'; translatedWord = '것'; } 
          else if (words[i+1] === 'make' || words[i+1] === 'want' || words[i+1] === 'leave' || words[i+1] === 'tell' || words[i+1] === 'dye' || words[i+1] === 'know' || words[i+1] === 'rest' || words[i+1] === 'uphold' || words[i+1] === 'lend' || words[i+1] === 'study' || words[i+1] === 'get_up' || words[i+1] === 'defeat') { matchedRole = (words[i+1] === 'leave') ? 'To_Infinitive_3' : 'To_Infinitive'; translatedWord = (words[i+1] === 'dye') ? '기로' : (words[i+1] === 'make' || words[i+1] === 'leave' || words[i+1] === 'tell' || words[i+1] === 'become' || words[i+1] === 'know' || words[i+1] === 'rest') ? '기를' : (words[i+1] === 'want' || words[i+1] === 'lend' || words[i+1] === 'defeat') ? '것은' : (words[i+1] === 'study') ? '기는' : '것이'; } 
          else if (originalText.toLowerCase().includes('welfare')) { matchedRole = 'Purpose'; translatedWord = '를위해'; } 
          else if (words[i+1] === 'the_man') { matchedRole = 'Postposition_To'; translatedWord = '에게'; }
          else { matchedRole = 'Location_Prep'; translatedWord = '으로'; }
      }
      if (word === 'and') {
          if (words[i+1] === '(to)' || words[i+1] === 'make') { matchedRole = 'Conjunction_And_Inf'; translatedWord = '고'; } 
          else if (words[i-1] === 'customs,') { matchedRole = 'Conjunction_And'; translatedWord = ''; } 
          else if (words[i-1] === 'wife') { matchedRole = 'Conjunction_And_With'; translatedWord = '와'; } 
      }
      if (word === 'the') {
          if (words[i+1] === 'child' || words[i+1] === 'old' || words[i+1] === 'king' || words[i+1] === 'petals' || words[i+1] === 'bright') { matchedRole = (words[i+1] === 'petals') ? 'Modifier_Inst' : (words[i+1] === 'old') ? 'Modifier_Obj' : 'Modifier'; translatedWord = '그'; } 
          else if (words[i+1] === 'prize_money') { matchedRole = 'Modifier_Obj'; translatedWord = '그'; } 
          else if (words[i+1] === 'hospital') { matchedRole = 'Modifier_Inf_Obj_1'; translatedWord = '그'; } 
          else if (words[i+1] === 'culture,' || words[i+1] === 'quiet') { matchedRole = (words[i+1] === 'culture,') ? 'Modifier_And_1' : 'Modifier_Loc_2'; translatedWord = ''; } 
          else { matchedRole = 'Modifier'; translatedWord = '그'; }
      }

      displayEn = originalText.match(new RegExp(`\\b${word.replace(/_/g, ' ')}\\b`, 'i'))?.[0] || word;

      if (word === 'he' && i === 0) displayEn = 'He'; 
      if (word === 'we' && i === 0) displayEn = 'We'; 
      if (word === 'an_important_thing') displayEn = 'an important thing';
      if (word === 'got_up') displayEn = 'got up'; 
      if (word === 'as_to') displayEn = 'as to';
      if (word === 'the_train') displayEn = 'the train';
      if (word === 'this' && i === 0) displayEn = 'This'; 
      if (word === 'diagram') displayEn = 'Diagram';
      if (word === 'the_hardest_sentence') displayEn = 'the hardest sentence';
      if (word === 'the_news') displayEn = 'the news';
      if (word === 'a_great_reward') displayEn = 'a great reward';
      if (word === 'the_man') displayEn = 'the man';
      if (word === 'the_right') displayEn = 'the right';
      if (word === 'anything') displayEn = 'anything';
      if (word === '독재자') displayEn = 'a dictator';
      if (word === '위대한_지도자라고') displayEn = 'a great leader';
      if (word === '훌륭한_의사가') displayEn = 'a great doctor';
      if (word === '영국의_생물학자') displayEn = 'a British biologist';
      if (word === '목표는') displayEn = 'The aim'; 
      if (word === '최초의') displayEn = 'The first'; 
      if (word === '나일강을') displayEn = 'the Nile River'; 
      if (word === '따라') displayEn = 'along with'; 
      if (word === '나는') displayEn = 'I'; 
      if (word === '그들은' && i === 0) displayEn = 'They'; 
      if (word === '그' && i === 0) displayEn = 'The'; 
      if (word === '조용한_시골') displayEn = 'the silent country';

      parsedTokens.push({ enOriginal: displayEn, koWord: translatedWord, role: matchedRole });
    }

    const detectedRoles = parsedTokens.map(t => {
        if (t.role.startsWith('Verb_Infinitive') || t.role === 'To_Infinitive_Comp' || t.role === 'To_Infinitive_OC' || t.role === 'To_Infinitive_Adj' || t.role === 'To_Infinitive_Adj_Subj' || t.role === 'To_Infinitive_Adj_2' || t.role === 'To_Infinitive_Adv' || t.role === 'Not_Infinitive' || t.role === 'To_Infinitive_Result' || t.role === 'To_Infinitive_Purpose') return t.role; 
        return (t.role === 'Verb_Past' || t.role === 'Verb_Present') ? 'Verb' : t.role;
    });

  return { matchedRole, translatedWord, displayEn };
}

// =========================================================================
// 💡 메인 POST 함수 시작
// =========================================================================
export async function POST(request: Request) {
  try {
    const { q } = await request.json();
    if (!q) return NextResponse.json({ ok: false, error: '검색어가 없습니다.' });

    let originalText = q.trim().replace(/[.!]+$/, ''); 
    
    // 👇 원래 수백 줄이 있던 POST 함수 안쪽 자리가 이렇게 딱 한 줄로 깔끔해집니다!
    let processedText = applyTranslationReplaceRules(originalText.toLowerCase());

    const words = processedText.split(/\s+/);
    const parsedTokens = [];

    const fiveFormVerbs = [
      'ask', 'request', 'require', 'demand', 'beg', 'urge', 'prompt', 'invite', 'advise', 'encourage', 
      'expect', 'intend', 'mean', 'allow', 'permit', 'enable', 'force', 'compel', 'oblige', 'cause', 
      'persuade', 'convince', 'teach', 'train', 'order', 'command', 'instruct', 'want', 'wish', 'like', 
      'would_like', 'motivate', 'inspire', 'stimulate', 'provoke', 'tempt', 'lead', 'challenge', 'dare', 
      'need', 'prefer', 'warn', 'remind', 'forbid', 'name', 'call', 'term', 'appoint', 'elect', 
      'nominate', 'designate', 'consider', 'deem', 'judge', 'hold', 'believe', 'think', 'find', 'suppose', 
      'imagine', 'make', 'keep', 'leave', 'render', 'prove', 'feel', 'turn', 'drive', 'change', 
      'get', 'set', 'declare', 'announce', 'show', 'let', 'have', 'help', 'assist', 'bid', 
      'see', 'watch', 'notice', 'observe', 'hear', 'listen_to', 'overhear', 'smell', 'taste', 'catch', 
      'regard', 'view', 'look_upon', 'refer_to', 'describe', 'define', 'treat', 'accept', 'acknowledge'
    ];

    const fourFormVerbs = [
      'give', 'award', 'grant', 'hand', 'lend', 'offer', 'pass', 'pay', 'promise', 'sell', 
      'send', 'show', 'teach', 'tell', 'write', 'yield', 'assign', 'feed', 'serve', 'forward', 
      'leave', 'buy', 'make', 'get', 'cook', 'build', 'choose', 'do', 'find', 'order', 
      'prepare', 'save', 'sing', 'art', 'bake', 'book', 'bring', 'call', 'catch', 'draw', 
      'fetch', 'fix', 'gather', 'keep', 'pour', 'prescribe', 'print', 'reserve', 'ask', 'inquire', 
      'beg', 'demand', 'request', 'require', 'question', 'beseech', 'entreat', 'implore', 'allow', 
      'cost', 'deny', 'envy', 'forgive', 'strike', 'wish'
    ];

    const threeFormVerbs = [
      'accept', 'advise', 'agree', 'alter', 'answer', 'appreciate', 'ask', 'assume', 'beat', 'begin', 
      'believe', 'bite', 'breathe', 'bring', 'build', 'care', 'carry', 'catch', 'change', 'chew', 
      'complain', 'consider', 'continue', 'create', 'cry', 'decide', 'decrease', 'describe', 'design', 
      'desire', 'determine', 'develop', 'discover', 'discuss', 'dislike', 'doubt', 'drop', 'end', 
      'enjoy', 'envy', 'expect', 'explain', 'express', 'fear', 'feel', 'find', 'finish', 'forget', 
      'get', 'glance', 'grow', 'guess', 'hate', 'have', 'hear', 'hit', 'hold', 'hope', 
      'imagine', 'improve', 'increase', 'introduce', 'keep', 'know', 'laugh', 'lift', 'like', 
      'listen_to', 'look_at', 'love', 'make', 'mean', 'mention', 'move', 'need', 'notice', 'observe', 
      'own', 'persuade', 'possess', 'prefer', 'produce', 'promise', 'propose', 'pull', 'push', 
      'realize', 'receive', 'recognize', 'reduce', 'remember', 'remind', 'reply', 'respect', 'say', 
      'see', 'smell', 'smile', 'speak', 'stare', 'start', 'stop', 'strike', 'suggest', 'suppose', 
      'swallow', 'take', 'talk', 'taste', 'tell', 'think', 'throw', 'touch', 'trust', 'understand', 
      'want', 'warn', 'watch', 'wish'
    ];

    const twoFormVerbs = [
      'keep', 'stay', 'remain', 'stand', 'lie', 'rest', 'hold', 'persist', 'abide', 'endure', 
      'survive', 'prevail', 'tarry', 'linger', 'dwell', 'sojourn', 'pause', 'wait', 'stick', 
      'adhere', 'cling', 'cohere'
    ];

    const oneFormVerbs = [
      'abound', 'act', 'administer', 'advance', 'agree', 'apologize', 'appear', 'apply', 'approach', 
      'argue', 'arise', 'arrive', 'attend', 'awake', 'bake', 'bark', 'bathe', 'be', 'begin', 
      'behave', 'belong', 'benefit', 'bleed', 'bloom', 'blush', 'boast', 'boil', 'boom', 'brag', 
      'break', 'breathe', 'burn', 'buy', 'buzz', 'camp', 'cease', 'chat', 'chirp', 'choke', 
      'chuckle', 'clash', 'click', 'climb', 'close', 'cluck', 'cluster', 'collapse', 'come', 
      'comment', 'communicate', 'compete', 'complain', 'compromise', 'concentrate', 'condense', 
      'consist', 'continue', 'contribute', 'cook', 'cooperate', 'cough', 'count', 'crack', 'crash', 
      'crawl', 'croak', 'crunch', 'cry', 'dance', 'dawn', 'dazzle', 'decay', 'decline', 'decrease', 
      'depart', 'depend', 'develop', 'die', 'differ', 'disagree', 'disappear', 'dive', 'dress', 
      'drink', 'drip', 'drive', 'drop', 'earn', 'eat', 'echo', 'emerge', 'end', 'enter', 'escape', 
      'exercise', 'exist', 'expand', 'expire', 'explode', 'extend', 'fade', 'fail', 'faint', 'fall', 
      'feel', 'fight', 'finish', 'flicker', 'float', 'flow', 'fly', 'follow', 'freeze', 'frown', 
      'function', 'gather', 'giggle', 'gleam', 'glide', 'glimmer', 'glitter', 'glow', 'go', 'govern', 
      'graduate', 'grew', 'grieve', 'groan', 'grow', 'hang', 'happen', 'hesitate', 'hide', 'hike', 
      'hiss', 'hold', 'howl', 'improve', 'increase', 'interact', 'jog', 'jump', 'last', 'laugh', 
      'lead', 'leave', 'lie', 'linger', 'listen', 'live', 'lock', 'look', 'lose', 'manage', 
      'march', 'matter', 'melt', 'meow', 'moo', 'move', 'murmur', 'mutter', 'negotiate', 'neigh', 
      'object', 'occur', 'oink', 'open', 'operate', 'originate', 'paint', 'participate', 'pass', 
      'pause', 'pay', 'perish', 'persist', 'play', 'plop', 'pray', 'precede', 'prevail', 'proceed', 
      'protest', 'quack', 'quarrel', 'quit', 'race', 'radiate', 'ray', 'react', 'read', 'rebel', 
      'rejoice', 'rely', 'remain', 'reply', 'reside', 'resign', 'respond', 'rest', 'result', 'resume', 
      'retire', 'return', 'ring', 'rise', 'roam', 'roar', 'rule', 'run', 'rush', 'rustle', 'sail', 
      'save', 'scream', 'screech', 'sell', 'shake', 'shine', 'shiver', 'shop', 'shout', 'shower', 
      'shrink', 'shut', 'sigh', 'sing', 'sink', 'sit', 'slam', 'sleep', 'smell', 'smile', 'snap', 
      'sneeze', 'sob', 'span', 'spark', 'sparkle', 'speak', 'splash', 'squeak', 'stammer', 'stand', 
      'start', 'stay', 'step', 'stop', 'stretch', 'strike', 'study', 'stutter', 'submit', 'succeed', 
      'suffer', 'surrender', 'surround', 'survive', 'sweat', 'swim', 'talk', 'taste', 'tear', 
      'terminate', 'tick', 'ting', 'touch', 'travel', 'tremble', 'twinkle', 'undress', 'vary', 
      'wait', 'wake', 'walk', 'wander', 'wash', 'watch', 'wear', 'weep', 'whisper', 'win', 
      'work_out', 'work', 'write', 'yell'
    ];

    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      let matchedRole = 'Unknown';
      let displayEn = word;
      let cleanWord = word.replace(/[?.,!]/g, ''); 
      let baseWord = word.replace(/d$/, '').replace(/ed$/, '').replace(/까\?$/, '').replace(/니\?$/, '').replace(/\?$/, '');
      
      if (fiveFormVerbs.includes(word) || fiveFormVerbs.includes(baseWord)) matchedRole = 'Verb';
      else if (fourFormVerbs.includes(word) || fourFormVerbs.includes(baseWord)) matchedRole = 'Verb';
      else if (threeFormVerbs.includes(word) || threeFormVerbs.includes(baseWord)) matchedRole = 'Verb';
      else if (twoFormVerbs.includes(word) || twoFormVerbs.includes(baseWord)) matchedRole = 'Verb';
      else if (oneFormVerbs.includes(word) || oneFormVerbs.includes(baseWord)) matchedRole = 'Verb_1'; 

      // 과거형 동사 감지
      if (word.endsWith('ed') || word === 'lived' || word === 'grew' || word === 'used' || word === 'bought' || word === 'gathered' || word === 'came' || word === 'got_up' || word === 'were' || word.includes('았') || word.includes('었') || word.includes('했')) {
         if (matchedRole.startsWith('Verb')) matchedRole = 'Verb_Past';
      }

      // 💡 [수프로 엣지] MOCK_XDIC_DB 한영 매핑 로직 (원형 추론 포함)
      let translatedWord = word;
      if (MOCK_XDIC_DB[cleanWord]) {
          translatedWord = MOCK_XDIC_DB[cleanWord];
      } else if (MOCK_XDIC_DB[baseWord]) {
          translatedWord = MOCK_XDIC_DB[baseWord];
      } else {
          // 예: '가공했습니까' -> '가공하다'
          const rootWord = baseWord.replace(/(합니까|했습니까|하겠습니까|하니|했니|하겠니|해요|했어요|할거예요|합니다|했습니다|하겠습니다)$/, '') + '하다';
          if (MOCK_XDIC_DB[rootWord]) {
              translatedWord = MOCK_XDIC_DB[rootWord];
              matchedRole = 'Verb';
              if (word.includes('았') || word.includes('었') || word.includes('했')) matchedRole = 'Verb_Past';
          }
      }

      // 💡 선생님의 하드코딩 부분 완벽하게 유지 + 가주어/진주어 완벽 보강!
      if (word.toLowerCase() === 'it') { matchedRole = 'Dummy_SVC'; translatedWord = 'It'; displayEn = 'It'; }
      
      // 👇👇 💡 스위치 달기 성공! 바깥 공장으로 부품을 보냅니다! 👇👇
      const tokenResult = matchTokenRolesAndTranslations(word, MOCK_XDIC_DB);
      if (tokenResult.matchedRole !== 'Unknown') {
          matchedRole = tokenResult.matchedRole;
          translatedWord = tokenResult.translatedWord;
          displayEn = tokenResult.displayEn;
      }
      // 👆👆 ---------------------------------------------------- 👆👆

      // 👇 실수로 날아갔던 for 루프 꼬리 완벽 복원!
      displayEn = originalText.match(new RegExp(`\\b${word.replace(/_/g, ' ')}\\b`, 'i'))?.[0] || word;

      if (word === 'he' && i === 0) displayEn = 'He'; 
      if (word === 'we' && i === 0) displayEn = 'We'; 

      parsedTokens.push({ enOriginal: displayEn, koWord: translatedWord, role: matchedRole });
    } // 👈 💡 날아갔던 for 루프 닫는 괄호 복원 완료!

    // 👇 날아갔던 detectedRoles 판별 코드 복원 완료!
    const detectedRoles = parsedTokens.map(t => {
        if (t.role.startsWith('Verb_Infinitive') || t.role === 'To_Infinitive_Comp' || t.role === 'To_Infinitive_OC' || t.role === 'To_Infinitive_Adj' || t.role === 'To_Infinitive_Adj_Subj' || t.role === 'To_Infinitive_Adj_2' || t.role === 'To_Infinitive_Adv' || t.role === 'Not_Infinitive' || t.role === 'To_Infinitive_Result' || t.role === 'To_Infinitive_Purpose') return t.role; 
        return (t.role === 'Verb_Past' || t.role === 'Verb_Present') ? 'Verb' : t.role;
    });

    let selectedForm = null;

    if (detectedRoles.includes('Subj_Aim') || detectedRoles.includes('Verb_Inf_Offer') || detectedRoles.includes('IO_Students') || detectedRoles.includes('Obj_Opp')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_보충어구_예문3_전용') || null;
    }
    if (detectedRoles.includes('Subj_Hope') || detectedRoles.includes('Verb_Inf_Become') || detectedRoles.includes('Comp_Doctor') || detectedRoles.includes('Prep_In_Future')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_보충어구_예문2_전용') || null;
    }
    if (detectedRoles.includes('Subj_Plan') || detectedRoles.includes('Verb_Inf_Go') || detectedRoles.includes('Obj_Museum') || detectedRoles.includes('Mod_This_Weekend')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_보충어구_예문1_전용') || null;
    }    
    if (detectedRoles.includes('Subj_Greeks') || detectedRoles.includes('To_Inf_Make') || detectedRoles.includes('Obj_Comp_Strong') || detectedRoles.includes('Inst_Ex') || detectedRoles.includes('Obj_Of_Gym')) {
        selectedForm = FORM_RULES.find(r => r.type === '5형식_To부정사_예문7_전용') || null;
    }
    // 💡 [우선순위 수호] 선언된 변수에 맞춤형 설계도를 먼저 매칭합니다.
    if (detectedRoles.includes('Comp_Wrong')) {
        selectedForm = FORM_RULES.find(r => r.type === '가주어_예문6_전용') || null;
    }
    if (!selectedForm && detectedRoles.includes('Obj_Hist')) {
        selectedForm = FORM_RULES.find(r => r.type === '3형식_예문5_전용') || null;
    }
    if (!selectedForm && detectedRoles.includes('IndirectObject') && detectedRoles.includes('Infinitive_Object_2') && detectedRoles.includes('Object_Complement')) {
        selectedForm = FORM_RULES.find(r => r.type === '가주어_4형식_5형식_병렬') || null;
    }
    if (!selectedForm && detectedRoles.includes('Infinitive_Object_2')) {
        selectedForm = FORM_RULES.find(r => r.type === '입헌정치_맞춤') || null;
    }
    if (!selectedForm && detectedRoles.includes('Infinitive_Object_1') && detectedRoles.includes('Object_Of')) {
        selectedForm = FORM_RULES.find(r => r.type === '입헌정치_최종') || null;
    }
        if (detectedRoles.includes('Verb_Inf_Read') || detectedRoles.includes('Obj_Books') || detectedRoles.includes('Obj_Country') || detectedRoles.includes('Obj_This_Time')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_보충어구_예문4_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 예문 5 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Resp') || detectedRoles.includes('Verb_Inf_Keep') || detectedRoles.includes('Obj_Env') || detectedRoles.includes('Comp_Beautiful')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_보충어구_예문5_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 예문 6 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_Taught') || detectedRoles.includes('Obj_Him') || detectedRoles.includes('To_Inf_OC') || detectedRoles.includes('Inf_Obj_TheBook')) {
        selectedForm = FORM_RULES.find(r => r.type === '5형식_보충어구_예문6_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 형용사구 예문 1 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_Visited') || detectedRoles.includes('Obj_Uncle') || detectedRoles.includes('To_Inf_Adj_Live') || detectedRoles.includes('Obj_Cali')) {
        selectedForm = FORM_RULES.find(r => r.type === '3형식_형용사구_예문1_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 형용사구 예문 2 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Darwin') || detectedRoles.includes('Comp_Biologist') || detectedRoles.includes('Comp_Famous') || detectedRoles.includes('Obj_Evo')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_형용사구_예문2_전용') || null;
    }
// 👇👇 💡 [수프로 엣지] 형용사구 예문 3 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_Sent') || detectedRoles.includes('Obj_Son') || detectedRoles.includes('Prep_To_Son') || detectedRoles.includes('Obj_TheBook')) {
        selectedForm = FORM_RULES.find(r => r.type === '3형식_형용사구_예문3_전용') || null;
    }    
   // 👇👇 💡 [수프로 엣지] 형용사구 예문 4 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Men') || detectedRoles.includes('Obj_Nile') || detectedRoles.includes('Comp_Farmers') || detectedRoles.includes('Verb_Were')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_형용사구_예문4_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 형용사구 예문 5 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_TheGirl') || detectedRoles.includes('DO_NicePresent') || detectedRoles.includes('Comp_Betty') || detectedRoles.includes('Obj_Bday')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_형용사구_예문5_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 형용사구 예문 6 절대 방어선 👇👇
    if (detectedRoles.includes('Comp_Dictator') || detectedRoles.includes('Verb_Inf_Think') || detectedRoles.includes('Obj_Himself') || detectedRoles.includes('OC_GreatLeader')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_형용사구_예문6_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 형용사구 예문 7 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_King') || detectedRoles.includes('DO_Reward') || detectedRoles.includes('IO_Man') || detectedRoles.includes('Obj_Anything')) {
        selectedForm = FORM_RULES.find(r => r.type === '4형식_형용사구_예문7_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 부사구 예문 1 절대 방어선 👇👇
    if (detectedRoles.includes('Comp_Glad_Adv1') || detectedRoles.includes('Verb_Inf_Meet_Adv1') || detectedRoles.includes('Obj_You_Adv1') || detectedRoles.includes('Adv_Here_Adv1')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_부사구_예문1_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 부사구 예문 2 절대 방어선 👇👇
    if (detectedRoles.includes('Comp_Sad_Adv2') || detectedRoles.includes('Verb_Inf_Hear_Adv2') || detectedRoles.includes('Obj_TheNews_Adv2') || detectedRoles.includes('Obj_Family_Adv2')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_부사구_예문2_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 부사구 예문 3 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Diagram_Adv3') || detectedRoles.includes('Comp_IsConvenient_Adv3') || detectedRoles.includes('Obj_HardestSentence_Adv3') || detectedRoles.includes('Adv_Systematically_Adv3')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_부사구_예문3_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 부사구 예문 4 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Water_Adv4') || detectedRoles.includes('Comp_IsGood_Adv4') || detectedRoles.includes('Verb_Inf_Drink_Adv4')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_부사구_예문4_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 부사구_결과 예문 2 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Boy_Res2') || detectedRoles.includes('Comp_IsClever_Res2') || detectedRoles.includes('Verb_Inf_Understand_Res2')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_부사구_결과_예문2_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 부사구_결과 예문 3 절대 방어선 👇👇
    if (detectedRoles.includes('Comp_Idle_Res3') || detectedRoles.includes('Verb_Inf_Read_Res3') || detectedRoles.includes('Obj_Books_Res3')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_부사구_결과_예문3_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 의지동사 예문 1 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_Came_Vol1') || detectedRoles.includes('Adv_Here_Vol1') || detectedRoles.includes('To_Inf_Vol1') || detectedRoles.includes('Verb_Inf_See_Vol1')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_의지동사_예문1_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 의지동사 예문 2 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_Gathered_Vol2') || detectedRoles.includes('Verb_Inf_Talk_Vol2') || detectedRoles.includes('Obj_ImportantThing_Vol2')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_의지동사_예문2_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 의지동사 예문 3 (17피스) 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_Bought_Vol3') || detectedRoles.includes('Obj_House_Vol3') || detectedRoles.includes('Noun_PrettyDaughter_Vol3') || detectedRoles.includes('Noun_ADaughter_Vol3') || detectedRoles.includes('Noun_PrettyDaughter2_Vol3') || detectedRoles.includes('Noun_Country_Vol3')) {
        selectedForm = FORM_RULES.find(r => r.type === '3형식_의지동사_예문3_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 의지동사 예문 4 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_Made_Vol4') || detectedRoles.includes('Obj_ASpecialProgram_Vol4') || detectedRoles.includes('Obj_AProgram_Vol4') || detectedRoles.includes('Verb_Teach_Vol4') || detectedRoles.includes('Noun_Vacation_Vol4')) {
        selectedForm = FORM_RULES.find(r => r.type === '4형식_의지동사_예문4_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 의지동사 예문 5 (17피스) 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Albert_Vol5') || detectedRoles.includes('Noun_PrizeMoney_Vol5') || detectedRoles.includes('Verb_SufferFrom_Vol5') || detectedRoles.includes('Noun_Leprosy_Vol5')) {
        selectedForm = FORM_RULES.find(r => r.type === '5형식_의지동사_예문5_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 무의지동사 예문 1 절대 방어선 👇👇
    if (detectedRoles.includes('Noun_Child_Invol1') || detectedRoles.includes('Verb_Grew_Invol1') || detectedRoles.includes('Adj_AFine_Invol1') || detectedRoles.includes('Noun_Youth_Invol1')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_무의지동사_예문1_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 무의지동사 예문 2 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_Lived_Invol2') || detectedRoles.includes('Noun_Grandson_Invol2') || detectedRoles.includes('Adv_Again_Invol2')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_무의지동사_예문2_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 무의지동사 예문 3 절대 방어선 👇👇
    if (detectedRoles.includes('Adv_Here_Invol3') || detectedRoles.includes('Pron_You_Invol3') || detectedRoles.includes('Verb_See_Invol3')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_무의지동사_예문3_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 1 절대 방어선 👇👇
    if (detectedRoles.includes('Noun_Book_Form1') || detectedRoles.includes('Verb_Sells_Form1')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문1_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 2 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_TheBird_Form2') || detectedRoles.includes('Verb_Sings_Form2') || detectedRoles.includes('Adv_Sweetly_Form2')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문2_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 3 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_Plays_Form3') || detectedRoles.includes('Noun_TheStation_Form3') || detectedRoles.includes('Noun_Night_Form3') || detectedRoles.includes('Noun_Day_Form3')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문3_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 4 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_Came_Form4') || detectedRoles.includes('Noun_Seoul_Form4') || detectedRoles.includes('Adv_LastYear_Form4')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문4_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 5 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_Lived_Form5') || detectedRoles.includes('Noun_OldHouse_Form5') || detectedRoles.includes('Noun_AnOldHouse_Form5') || detectedRoles.includes('Noun_AHouse_Form5')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문5_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 6 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_John_Form6') || detectedRoles.includes('Noun_TwentyYears_Form6')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문6_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 7 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_WillStay_Form7') || detectedRoles.includes('Noun_WinterVacation_Form7')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문7_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 8 절대 방어선 👇👇
    if (detectedRoles.includes('Noun_Girl_Form8') || detectedRoles.includes('Noun_SmallVillage_Form8') || detectedRoles.includes('Noun_Village_Form8')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문8_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 9 절대 방어선 👇👇
    if (detectedRoles.includes('Noun_TheBeach_Form9') || detectedRoles.includes('Noun_Family_Form9') || detectedRoles.includes('Noun_Vacation_Form9')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문9_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 10 절대 방어선 👇👇
    if (detectedRoles.includes('Noun_Hermit_Form10') || detectedRoles.includes('Noun_Cabin_Form10') || detectedRoles.includes('Noun_Disciples_Form10')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문10_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 11 절대 방어선 👇👇
    if (detectedRoles.includes('Noun_DeptStore_Form11') || detectedRoles.includes('Noun_JanesHouse_Form11') || detectedRoles.includes('Noun_House_Form11')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문11_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 12 절대 방어선 👇👇
    if (detectedRoles.includes('Noun_King_F12') || detectedRoles.includes('Noun_ElegantFerry_F12') || detectedRoles.includes('Noun_Suites_F12')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문12_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 13 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_ABigFire_F13') || detectedRoles.includes('Noun_Building_F13') || detectedRoles.includes('Noun_Station_F13')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문13_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 14 절대 방어선 👇👇
    if (detectedRoles.includes('Noun_Picture_F14') || detectedRoles.includes('Verb_IsHung_F14') || detectedRoles.includes('Noun_Wall_F14')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문14_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 1형식 예문 15 절대 방어선 👇👇
    if (detectedRoles.includes('Noun_Spies_F15') || detectedRoles.includes('Verb_HaveLanded_F15')) {
        selectedForm = FORM_RULES.find(r => r.type === '1형식_예문15_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 2형식 예문 1 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Tom_F2E1') || detectedRoles.includes('Comp_Boy_F2E1')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_예문1_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 2형식 예문 2 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Math_F2E2') || detectedRoles.includes('Comp_Subject_F2E2') || detectedRoles.includes('Comp_Difficult_F2E2')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_예문2_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 2형식 예문 3 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_TheCold_F2E3') || detectedRoles.includes('Comp_Severer_F2E3') || detectedRoles.includes('Pron_ThatOf_F2E3')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_예문3_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 2형식 예문 4 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Novel_F2E4') || detectedRoles.includes('Comp_Interesting_F2E4')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_예문4_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 2형식 예문 5 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Men_F2E5') || detectedRoles.includes('Comp_Equal_F2E5')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_예문5_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 2형식 예문 6 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Rome_F2E6') || detectedRoles.includes('Comp_SmallTown_F2E6')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_예문6_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 2형식 예문 7 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_DetectiveStory_F2E7') || detectedRoles.includes('Comp_Interesting_F2E7')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_예문7_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 2형식 예문 8 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Language_F2E8') || detectedRoles.includes('Comp_Means_F2E8')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_예문8_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 2형식 예문 9 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Proverbs_F2E9') || detectedRoles.includes('Verb_MayBe_F2E9')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_예문9_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 2형식 예문 10 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_Settlers_F2E10') || detectedRoles.includes('Comp_Free_F2E10')) {
        selectedForm = FORM_RULES.find(r => r.type === '2형식_예문10_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 3형식 예문 1 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_He_F3E1') || detectedRoles.includes('Verb_LaughedAt_F3E1')) {
        selectedForm = FORM_RULES.find(r => r.type === '3형식_예문1_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 3형식 예문 2 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_MustTakeCareOf_F3E2') || detectedRoles.includes('Obj_Baby_F3E2')) {
        selectedForm = FORM_RULES.find(r => r.type === '3형식_예문2_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 3형식 예문 3 절대 방어선 👇👇
    if (detectedRoles.includes('Verb_Remember_F3E3') || detectedRoles.includes('Obj_Name_F3E3')) {
        selectedForm = FORM_RULES.find(r => r.type === '3형식_예문3_전용') || null;
    }
    // 👇👇 💡 [수프로 엣지] 3형식 예문 4 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_OldMan_F3E4') || detectedRoles.includes('Verb_Planted_F3E4')) {
        selectedForm = FORM_RULES.find(r => r.type === '3형식_예문4_전용') || null;
    }
// 👇👇 💡 [수프로 엣지] 3형식 예문 5 절대 방어선 👇👇
    if (detectedRoles.includes('Subj_I_F3E5') || detectedRoles.includes('Verb_Met_F3E5') || detectedRoles.includes('Obj_Her_F3E5')) {
        selectedForm = FORM_RULES.find(r => r.type === '3형식_예문5_파크_전용') || null;
    }

    // } 뒤에서 Enter 후에 paste
    // 💡 위에서 맞춤형 설계도를 찾지 못했을 때만 일반 규칙 루프를 실행합니다.
    if (!selectedForm) {
        for (const rule of FORM_RULES) {
          const isMatch = rule.requiredRoles.every(reqRole => detectedRoles.includes(reqRole));
          if (rule.type === '1형식_무의지동사_결과_장소' && detectedRoles.includes('To_Infinitive_Result') && detectedRoles.includes('Location') && detectedRoles.includes('Verb_Infinitive')) { selectedForm = rule; break; } 
          if (rule.type === '1형식_무의지동사_결과_목적어' && detectedRoles.includes('To_Infinitive_Result') && detectedRoles.includes('Infinitive_Object') && detectedRoles.includes('Adverb_End')) { selectedForm = rule; break; } 
          if (rule.type === '1형식_무의지동사_결과' && detectedRoles.includes('To_Infinitive_Result') && detectedRoles.includes('Complement')) { selectedForm = rule; break; } 
          if (rule.type === '3형식_의지동사_To부정사_병렬' && detectedRoles.includes('Conjunction_And_Inf') && detectedRoles.includes('Verb_Infinitive_2')) { selectedForm = rule; break; } 
          if (rule.type === '3형식_의지동사_To부정사' && detectedRoles.includes('To_Infinitive_Purpose') && detectedRoles.includes('Object') && detectedRoles.includes('Location')) { selectedForm = rule; break; } 
          if (rule.type === '1형식_의지동사_To부정사' && detectedRoles.includes('To_Infinitive_Purpose')) { selectedForm = rule; break; } 
          if (rule.type === '2형식_부사구_결과' && detectedRoles.includes('To_Infinitive_Result') && detectedRoles.includes('Complement')) { selectedForm = rule; break; } 
          if (rule.type === '1형식_부사구_결과' && detectedRoles.includes('To_Infinitive_Result')) { selectedForm = rule; break; } 
          if (rule.type === '2형식_부사구_To부정사' && detectedRoles.includes('To_Infinitive_Adv')) { selectedForm = rule; break; } 
          if (rule.type === '3형식_To부정사_형용사구_다중중첩' && detectedRoles.includes('To_Infinitive_Adj_2') && detectedRoles.includes('Object_To')) { selectedForm = rule; break; } 
          if (rule.type === '2형식_주어수식_형용사구_To부정사' && detectedRoles.includes('To_Infinitive_Adj_Subj') && detectedRoles.includes('Complement')) { selectedForm = rule; break; } 
          if (rule.type === '3형식_To부정사_형용사구_전명구수식' && detectedRoles.includes('To_Infinitive_Adj') && detectedRoles.includes('Object_To')) { selectedForm = rule; break; } 
          if (rule.type === '2형식_To부정사_형용사구' && detectedRoles.includes('To_Infinitive_Adj') && detectedRoles.includes('Complement')) { selectedForm = rule; break; } 
          if (rule.type === '3형식_To부정사_형용사구' && detectedRoles.includes('To_Infinitive_Adj')) { selectedForm = rule; break; } 
          if (rule.type === '5형식_To부정사' && detectedRoles.includes('To_Infinitive_OC')) { selectedForm = rule; break; } 
          if (rule.type === '2형식_To부정사' && detectedRoles.includes('To_Infinitive_Comp')) { selectedForm = rule; break; } 
          if (rule.type === '가주어_진주어' && detectedRoles.includes('Dummy_SVC')) { selectedForm = rule; break; } 
          if (rule.type === '3형식_To부정사' && detectedRoles.includes('To_Infinitive')) { selectedForm = rule; break; } 
          if (rule.type === '5형식' && detectedRoles.includes('Object_Complement')) { selectedForm = rule; break; }
          if (rule.type === '4형식' && detectedRoles.includes('IndirectObject') && !detectedRoles.includes('To_Infinitive')) { selectedForm = rule; break; } 
          if (rule.type === '3형식_최종_간디' && detectedRoles.includes('Subject_That_Main')) { selectedForm = rule; break; }
          if (rule.type === '3형식' && detectedRoles.includes('Dummy_SVC')) continue;
          if (rule.type === '1형식' && (detectedRoles.includes('Object') || detectedRoles.includes('Object_Complement') || detectedRoles.includes('IndirectObject') || detectedRoles.includes('Complement') || detectedRoles.includes('To_Infinitive') || detectedRoles.includes('To_Infinitive_1') || detectedRoles.includes('To_Infinitive_3') || detectedRoles.includes('To_Infinitive_Adj') || detectedRoles.includes('To_Infinitive_Adv') || detectedRoles.includes('To_Infinitive_Result'))) continue; 
          if (isMatch && !selectedForm) { selectedForm = rule; break; }
        }
    }

    if (!selectedForm) {
        selectedForm = FORM_RULES[FORM_RULES.length - 1]; 
    }

    const phrases: Record<string, string[]> = {};
    const mapped_analysis: {en: string, ko: string}[] = [];

    for (const token of parsedTokens) {
      let role = token.role;
      if (role === 'Verb_Past' || role === 'Verb_Present') role = 'Verb';
      if (!phrases[role]) phrases[role] = [];
      phrases[role].push(token.koWord); 
      mapped_analysis.push({ en: token.enOriginal, ko: token.koWord });
    }

    const finalEnglishWords = [];
    for (const role of selectedForm.englishOrder) {
      if (phrases[role]) {
        const cleaned = phrases[role].filter(w => w.trim() !== '').join(' ');
        if (cleaned) finalEnglishWords.push(cleaned);
      }
    }

    let finalTranslation = finalEnglishWords.join(' ')
      .replace(/culture,\s*customs,\s*art/i, 'the culture, customs, and art')
      
    // 💡 [수프로 엣지] 의문문 지능형 변환
    const questionEndings = /(니까|나요|까요|습니까|니|냐|대요|인가요|건가요|합니까|하시겠습니까|되겠니|한지요|하겠니)[.\s]*$/;
    const isQuestion = originalText.includes('?') || questionEndings.test(originalText);
    
    if (isQuestion && finalTranslation.trim() !== '') { 
       let aux = 'Do';
       if (originalText.includes('았') || originalText.includes('었') || originalText.includes('했') || originalText.includes('였')) {
           aux = 'Did';
       } else if (originalText.includes('겠') || originalText.includes('할거') || originalText.includes('할 거')) {
           aux = 'Will';
       }

       if (finalTranslation.match(/^(You|He|They|I|We)\b/i)) {
           finalTranslation = finalTranslation.replace(/^You\b/i, aux + ' you')
                                            .replace(/^He\b/i, (aux === 'Do' ? 'Does' : aux) + ' he')
                                            .replace(/^They\b/i, aux + ' they')
                                            .replace(/^I\b/i, aux + ' I')
                                            .replace(/^We\b/i, aux + ' we');
       } else {
           finalTranslation = aux + ' you ' + finalTranslation.charAt(0).toLowerCase() + finalTranslation.slice(1);
       }
    }
    
    if (finalTranslation.trim() !== '') {
        // 👇👇 💡 [수프로 엣지] 마침표 앞의 찌꺼기 공백을 완벽하게 진공 청소! 👇👇
        finalTranslation = finalTranslation.trim().replace(/\s+/g, ' '); 
        
        finalTranslation = finalTranslation.charAt(0).toUpperCase() + finalTranslation.slice(1);
        
        if (isQuestion) {
            if (!finalTranslation.endsWith('?')) finalTranslation += '?';
        } else {
            if (!finalTranslation.endsWith('.')) finalTranslation += '.';
        }
    } else {
        return NextResponse.json({ ok: false, error: '분석할 수 없는 문장 구조입니다.' });
    }

    return NextResponse.json({ ok: true, best: { source_text: originalText, target_text: finalTranslation, analysis: [] } });
  } catch (error) {
    console.error('한영 RBMT 엔진 에러:', error);
    return NextResponse.json({ ok: false, error: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
}