export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
       <div className="flex flex-col items-center">
         {/* 로고 */}
         <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-8">
            <span className="text-blue-500">X</span>-DIC
         </h1>

         {/* 스피너 */}
         <div className="relative w-20 h-20 mb-8">
           <div className="absolute w-full h-full border-4 border-slate-100 rounded-full"></div>
           <div className="absolute w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
         </div>

         {/* 텍스트 */}
         <p className="text-lg font-bold text-slate-700 animate-pulse">
           데이터를 불러오고 있습니다...
         </p>
         <p className="text-sm text-slate-400 mt-2">
           전문 용어 사전 준비 중
         </p>
       </div>
    </div>
  );
}