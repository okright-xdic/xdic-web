import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | X-DIC',
  description: '엑스딕(X-DIC) 개인정보처리방침입니다.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 shadow-sm rounded-xl border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b border-gray-200 pb-4">
          개인정보처리방침
        </h1>
        
        <p className="text-gray-700 mb-8 leading-relaxed">
          <strong className="text-blue-600">x-dic.com</strong>은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」을 준수합니다.
        </p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          {/* 1조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full inline-flex justify-center items-center text-sm mr-2">1</span>
              수집하는 개인정보 항목
            </h2>
            <p className="mb-2 pl-8">사이트는 회원가입 없이 서비스를 제공하며, 다음 정보만을 수집할 수 있습니다.</p>
            <ul className="list-disc pl-14 space-y-1 mb-2 text-gray-600">
              <li>검색어 기록 (통계 목적)</li>
              <li>접속 IP, 브라우저 정보 (로그 분석 목적)</li>
            </ul>
            <p className="text-sm text-red-500 pl-8 font-medium">※ 개인을 식별할 수 있는 정보는 수집하지 않습니다.</p>
          </section>

          {/* 2조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full inline-flex justify-center items-center text-sm mr-2">2</span>
              개인정보 수집 및 이용 목적
            </h2>
            <ul className="list-disc pl-14 space-y-1 text-gray-600">
              <li>서비스 품질 개선</li>
              <li>인기 검색어 통계 분석</li>
              <li>비정상적 이용 방지</li>
            </ul>
          </section>

          {/* 3조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full inline-flex justify-center items-center text-sm mr-2">3</span>
              개인정보 보유 및 이용 기간
            </h2>
            <p className="pl-8 text-gray-600">수집된 정보는 목적 달성 후 지체 없이 파기합니다.</p>
          </section>

          {/* 4조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full inline-flex justify-center items-center text-sm mr-2">4</span>
              개인정보의 제3자 제공
            </h2>
            <p className="pl-8 text-gray-600">사이트는 이용자의 개인정보를 외부에 제공하지 않습니다.</p>
          </section>

          {/* 5조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full inline-flex justify-center items-center text-sm mr-2">5</span>
              쿠키(Cookie)의 사용
            </h2>
            <p className="pl-8 text-gray-600">사이트는 서비스 개선을 위해 쿠키를 사용할 수 있으며, 이용자는 브라우저 설정을 통해 거부할 수 있습니다.</p>
          </section>

          {/* 6조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full inline-flex justify-center items-center text-sm mr-2">6</span>
              개인정보 보호를 위한 조치
            </h2>
            <p className="pl-8 text-gray-600">사이트는 개인정보의 안전성을 확보하기 위해 합리적인 기술적·관리적 보호조치를 취합니다.</p>
          </section>

          {/* 7조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full inline-flex justify-center items-center text-sm mr-2">7</span>
              개인정보 보호책임자
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg ml-8 text-gray-600 border border-gray-200">
              <p><strong>책임자:</strong> 사이트 운영자</p>
              <p><strong>문의:</strong> <a href="mailto:zzangth@gmail.com" className="text-blue-600 hover:underline">zzangth@gmail.com</a></p>
            </div>
          </section>

          {/* 8조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full inline-flex justify-center items-center text-sm mr-2">8</span>
              정책 변경
            </h2>
            <p className="pl-8 text-gray-600">본 개인정보처리방침은 법령 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시 사이트에 공지합니다.</p>
          </section>
        </div>
      </div>
    </main>
  );
}