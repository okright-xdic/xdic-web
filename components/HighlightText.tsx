'use client';

const CATEGORY_NAMES: { [key: number]: string } = {
  1: '기본영어', 2: '인문사회용어', 3: '기계_전기_전자용어', 4: '교육_종교_예체능용어', 
  5: '무역경제용어', 6: '자동차_환경용어', 7: '물리_화학용어', 8: '컴퓨터용어', 
  9: '의학용어', 10: '인문사회기타용어', 11: '과학기술기타용어', 12: '기타'
};

export default function HighlightText({ text, search, category }: { text: string; search: string; category: number }) {
  if (!text) return null;

  const parts = text.split(new RegExp(`(${search})`, 'gi'));
  const catName = CATEGORY_NAMES[category] || '기타';

  return (
    <div className="flex justify-between items-start w-full gap-4">
      <div className="text-[1.05rem] leading-snug text-slate-800 break-words flex-1">
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() 
            ? <span key={i} className="text-orange-500 font-bold">{part}</span> 
            : <span key={i} className="font-medium">{part}</span>
        )}
      </div>
      <span className="text-[0.8rem] font-bold text-blue-500 whitespace-nowrap pt-1">
        [{catName}]
      </span>
    </div>
  );
}