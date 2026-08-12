'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ComputerTerm = {
  label: string;
  query: string;
};

type ComputerTopicGroup = {
  id: string;
  icon: string;
  title: string;
  description: string;
  terms: ComputerTerm[];
};

export default function ComputerPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [myHistory, setMyHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('xdic_computer_treasure');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setMyHistory(
            parsed
              .filter((item): item is string => typeof item === 'string')
              .slice(0, 20)
          );
        }
      } catch {
        localStorage.removeItem('xdic_computer_treasure');
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    const updatedHistory = [
      trimmed,
      ...myHistory.filter((item) => item !== trimmed),
    ].slice(0, 20);

    setMyHistory(updatedHistory);
    localStorage.setItem(
      'xdic_computer_treasure',
      JSON.stringify(updatedHistory)
    );

    // 기존 X-DIC 메인 검색 결과로 연결합니다.
    router.push(`/?q=${encodeURIComponent(trimmed)}`);
  };

  const recommendedTerms: ComputerTerm[] = [
    { label: 'operating system · 운영체제', query: 'operating system' },
    { label: 'application software · 응용 소프트웨어', query: 'application software' },
    { label: 'source code · 소스 코드', query: 'source code' },
    { label: 'compiler · 컴파일러', query: 'compiler' },
    { label: 'runtime · 런타임', query: 'runtime' },
    { label: 'API · 응용 프로그램 인터페이스', query: 'application programming interface' },
    { label: 'framework · 프레임워크', query: 'framework' },
    { label: 'library · 라이브러리', query: 'software library' },

    { label: 'server · 서버', query: 'server' },
    { label: 'client · 클라이언트', query: 'client' },
    { label: 'virtual machine · 가상 머신', query: 'virtual machine' },
    { label: 'container · 컨테이너', query: 'container computing' },
    { label: 'cloud computing · 클라우드 컴퓨팅', query: 'cloud computing' },
    { label: 'load balancing · 부하 분산', query: 'load balancing' },
    { label: 'cache · 캐시', query: 'cache' },
    { label: 'backup · 백업', query: 'backup' },

    { label: 'network · 네트워크', query: 'computer network' },
    { label: 'IP address · IP 주소', query: 'IP address' },
    { label: 'DNS · 도메인 이름 시스템', query: 'domain name system' },
    { label: 'HTTP · 하이퍼텍스트 전송 프로토콜', query: 'HTTP' },
    { label: 'bandwidth · 대역폭', query: 'bandwidth' },
    { label: 'latency · 지연시간', query: 'latency' },
    { label: 'packet · 패킷', query: 'packet' },
    { label: 'router · 라우터', query: 'router' },

    { label: 'database · 데이터베이스', query: 'database' },
    { label: 'DBMS · 데이터베이스 관리 시스템', query: 'database management system' },
    { label: 'SQL · 구조화 질의 언어', query: 'SQL' },
    { label: 'query · 질의', query: 'database query' },
    { label: 'index · 인덱스', query: 'database index' },
    { label: 'transaction · 트랜잭션', query: 'database transaction' },
    { label: 'JSON · JSON', query: 'JSON' },
    { label: 'data structure · 자료구조', query: 'data structure' },

    { label: 'authentication · 인증', query: 'authentication' },
    { label: 'authorization · 권한 부여', query: 'authorization' },
    { label: 'encryption · 암호화', query: 'encryption' },
    { label: 'firewall · 방화벽', query: 'firewall' },
  ];

  const topicGroups: ComputerTopicGroup[] = [
    {
      id: 'software-web',
      icon: '🧩',
      title: '소프트웨어·웹 검색 예시',
      description:
        '프로그램 개발과 웹 서비스에서 자주 접하는 기본 소프트웨어 용어를 검색해 보세요.',
      terms: [
        { label: 'operating system · 운영체제', query: 'operating system' },
        { label: 'source code · 소스 코드', query: 'source code' },
        { label: 'compiler · 컴파일러', query: 'compiler' },
        { label: 'API', query: 'application programming interface' },
        { label: 'framework · 프레임워크', query: 'framework' },
        { label: 'library · 라이브러리', query: 'software library' },
      ],
    },
    {
      id: 'systems-cloud',
      icon: '🖥️',
      title: '시스템·클라우드 검색 예시',
      description:
        '서버, 가상화, 캐시와 클라우드 운영에서 자주 등장하는 용어를 확인합니다.',
      terms: [
        { label: 'server · 서버', query: 'server' },
        { label: 'client · 클라이언트', query: 'client' },
        { label: 'virtual machine · 가상 머신', query: 'virtual machine' },
        { label: 'container · 컨테이너', query: 'container computing' },
        { label: 'cloud computing · 클라우드 컴퓨팅', query: 'cloud computing' },
        { label: 'cache · 캐시', query: 'cache' },
      ],
    },
    {
      id: 'network-internet',
      icon: '🌐',
      title: '네트워크·인터넷 검색 예시',
      description:
        '주소, 이름 해석, 전송, 성능과 관련된 대표 네트워크 용어를 탐색합니다.',
      terms: [
        { label: 'IP address · IP 주소', query: 'IP address' },
        { label: 'DNS', query: 'domain name system' },
        { label: 'HTTP', query: 'HTTP' },
        { label: 'packet · 패킷', query: 'packet' },
        { label: 'bandwidth · 대역폭', query: 'bandwidth' },
        { label: 'latency · 지연시간', query: 'latency' },
      ],
    },
    {
      id: 'data-database',
      icon: '🗄️',
      title: '데이터·데이터베이스 검색 예시',
      description:
        '데이터 저장·조회·처리 과정에서 자주 쓰이는 데이터베이스 용어를 살펴봅니다.',
      terms: [
        { label: 'database · 데이터베이스', query: 'database' },
        { label: 'DBMS', query: 'database management system' },
        { label: 'SQL', query: 'SQL' },
        { label: 'query · 질의', query: 'database query' },
        { label: 'index · 인덱스', query: 'database index' },
        { label: 'transaction · 트랜잭션', query: 'database transaction' },
      ],
    },
  ];

  const readingNotes = [
    {
      icon: '🧩',
      title: 'software와 program은 문맥 범위를 확인',
      text:
        'software는 프로그램과 관련 데이터·구성요소를 넓게 가리킬 수 있고, program은 특정 작업을 수행하는 프로그램 자체를 가리키는 경우가 많습니다. 실제 문서에서는 application, system software 같은 주변 표현과 함께 확인하세요.',
    },
    {
      icon: '🖥️',
      title: 'client와 server는 역할을 기준으로 구분',
      text:
        'client는 서비스를 요청하거나 이용하는 쪽, server는 요청을 받아 기능이나 데이터를 제공하는 쪽을 나타내는 경우가 많습니다. 하나의 장치가 상황에 따라 다른 역할을 맡을 수도 있으므로 문맥이 중요합니다.',
    },
    {
      icon: '🌐',
      title: 'bandwidth와 latency는 같은 성능 지표가 아님',
      text:
        'bandwidth는 일정 시간 동안 전달할 수 있는 데이터 양과 관련되고, latency는 요청이나 데이터가 전달되는 데 걸리는 지연과 관련됩니다. 네트워크 속도를 설명할 때 두 개념을 구분해서 보는 것이 좋습니다.',
    },
    {
      icon: '📦',
      title: 'protocol과 data format을 구분해서 보기',
      text:
        'HTTP처럼 통신 규칙을 나타내는 표현과 JSON처럼 데이터를 표현하는 형식은 서로 역할이 다릅니다. 웹 문서에서는 함께 나타날 수 있지만 같은 종류의 개념은 아닙니다.',
    },
  ];

  const miniGlossary = [
    {
      term: 'operating system',
      ko: '운영체제',
      query: 'operating system',
      note:
        '컴퓨터의 하드웨어 자원을 관리하고 응용 프로그램이 동작할 수 있는 기본 환경을 제공하는 시스템 소프트웨어를 가리키는 표현입니다.',
    },
    {
      term: 'API',
      ko: '응용 프로그램 인터페이스',
      query: 'application programming interface',
      note:
        '서로 다른 소프트웨어 구성요소가 정해진 방식으로 기능이나 데이터를 주고받을 수 있도록 제공하는 인터페이스를 가리키는 용어입니다.',
    },
    {
      term: 'server',
      ko: '서버',
      query: 'server',
      note:
        '네트워크에서 다른 프로그램이나 장치의 요청을 받아 데이터나 기능을 제공하는 역할을 나타내는 용어입니다. 문맥에 따라 서버 프로그램과 서버 컴퓨터를 모두 가리킬 수 있습니다.',
    },
    {
      term: 'cache',
      ko: '캐시',
      query: 'cache',
      note:
        '자주 사용하는 데이터나 계산 결과를 더 빠르게 다시 이용하기 위해 임시로 저장하는 구조나 저장 영역을 가리키는 표현입니다.',
    },
    {
      term: 'DNS',
      ko: '도메인 이름 시스템',
      query: 'domain name system',
      note:
        '사람이 읽기 쉬운 도메인 이름과 네트워크 주소 정보를 연결해 찾을 수 있도록 하는 인터넷의 이름 체계입니다.',
    },
    {
      term: 'latency',
      ko: '지연시간',
      query: 'latency',
      note:
        '요청이나 데이터가 전달되고 처리되는 과정에서 발생하는 시간 지연을 나타내는 성능 관련 용어입니다.',
    },
    {
      term: 'database',
      ko: '데이터베이스',
      query: 'database',
      note:
        '일정한 구조와 목적에 따라 데이터를 저장하고 관리할 수 있도록 구성한 데이터의 집합을 가리키는 기본 용어입니다.',
    },
    {
      term: 'transaction',
      ko: '트랜잭션',
      query: 'database transaction',
      note:
        '데이터베이스에서 하나의 논리적인 작업 단위로 처리되는 일련의 연산을 가리키는 표현입니다. 저장·갱신·일관성 문맥과 함께 나타날 수 있습니다.',
    },
  ];

  const webRequestFlow = [
    {
      step: '01',
      title: '사용자·클라이언트',
      description: '브라우저나 앱에서 주소를 입력하거나 기능을 실행하면서 요청이 시작됩니다.',
      terms: [
        { label: 'browser', query: 'web browser' },
        { label: 'client', query: 'client' },
        { label: 'URL', query: 'URL' },
      ],
    },
    {
      step: '02',
      title: '이름과 주소 확인',
      description: '도메인 이름과 네트워크 주소를 연결하는 과정에서 관련 용어가 등장합니다.',
      terms: [
        { label: 'domain name', query: 'domain name' },
        { label: 'DNS', query: 'domain name system' },
        { label: 'IP address', query: 'IP address' },
      ],
    },
    {
      step: '03',
      title: '네트워크 전송',
      description: '요청과 응답 데이터가 네트워크를 통해 이동할 때 전송 관련 개념을 확인할 수 있습니다.',
      terms: [
        { label: 'HTTP', query: 'HTTP' },
        { label: 'packet', query: 'packet' },
        { label: 'router', query: 'router' },
      ],
    },
    {
      step: '04',
      title: '서버·애플리케이션 처리',
      description: '서버가 요청을 받아 프로그램이나 API를 통해 필요한 기능을 처리합니다.',
      terms: [
        { label: 'server', query: 'server' },
        { label: 'application', query: 'application software' },
        { label: 'API', query: 'application programming interface' },
      ],
    },
    {
      step: '05',
      title: '데이터 조회·저장',
      description: '필요한 데이터가 데이터베이스나 캐시에서 조회되거나 저장될 수 있습니다.',
      terms: [
        { label: 'database', query: 'database' },
        { label: 'query', query: 'database query' },
        { label: 'cache', query: 'cache' },
      ],
    },
    {
      step: '06',
      title: '응답·화면 표시',
      description: '처리된 결과가 응답으로 돌아와 브라우저나 앱 화면에 표시됩니다.',
      terms: [
        { label: 'response', query: 'response computing' },
        { label: 'JSON', query: 'JSON' },
        { label: 'rendering', query: 'rendering computing' },
      ],
    },
  ];

  const pairedTerms = [
    {
      left: 'client',
      right: 'server',
      leftKo: '클라이언트',
      rightKo: '서버',
      leftQuery: 'client',
      rightQuery: 'server',
    },
    {
      left: 'frontend',
      right: 'backend',
      leftKo: '프런트엔드',
      rightKo: '백엔드',
      leftQuery: 'frontend',
      rightQuery: 'backend',
    },
    {
      left: 'upload',
      right: 'download',
      leftKo: '업로드',
      rightKo: '다운로드',
      leftQuery: 'upload',
      rightQuery: 'download',
    },
    {
      left: 'authentication',
      right: 'authorization',
      leftKo: '인증',
      rightKo: '권한 부여',
      leftQuery: 'authentication',
      rightQuery: 'authorization',
    },
  ];

  const searchPaths = [
    {
      title: '웹 서비스 기본 흐름',
      description:
        '클라이언트의 요청이 서버와 API를 거쳐 데이터에 접근하는 흐름을 따라가 봅니다.',
      terms: [
        { label: 'client', query: 'client' },
        { label: 'server', query: 'server' },
        { label: 'API', query: 'application programming interface' },
        { label: 'database', query: 'database' },
      ],
    },
    {
      title: '네트워크 주소·전송',
      description:
        '도메인 이름에서 주소 확인과 데이터 전송으로 이어지는 대표 용어를 연결합니다.',
      terms: [
        { label: 'domain name', query: 'domain name' },
        { label: 'DNS', query: 'domain name system' },
        { label: 'IP address', query: 'IP address' },
        { label: 'HTTP', query: 'HTTP' },
      ],
    },
    {
      title: '데이터베이스 조회',
      description:
        '데이터 저장 구조와 조회 성능에서 함께 검토되는 기본 용어를 이어서 검색합니다.',
      terms: [
        { label: 'database', query: 'database' },
        { label: 'SQL', query: 'SQL' },
        { label: 'query', query: 'database query' },
        { label: 'index', query: 'database index' },
      ],
    },
    {
      title: '시스템 운영·성능',
      description:
        '서버 운영과 응답 성능을 설명할 때 자주 함께 보는 개념을 비교합니다.',
      terms: [
        { label: 'server', query: 'server' },
        { label: 'cache', query: 'cache' },
        { label: 'load balancing', query: 'load balancing' },
        { label: 'latency', query: 'latency' },
      ],
    },
  ];

  const contextualComputerTerms = [
    {
      word: 'port',
      general: '항구',
      computer: '포트',
      query: 'port computer',
      note:
        '컴퓨터 문맥의 port는 네트워크 통신의 논리적 접점이나 장치 연결 단자를 가리킬 수 있습니다. 항구라는 일반 의미와 구분해 앞뒤 기술 문맥을 함께 확인하는 것이 좋습니다.',
    },
    {
      word: 'thread',
      general: '실',
      computer: '스레드',
      query: 'thread computing',
      note:
        '컴퓨터 문맥에서는 프로그램 실행 흐름의 한 단위를 가리키는 용어로 쓰입니다. 운영체제·동시성·병렬 처리 문맥에서 자주 나타납니다.',
    },
    {
      word: 'process',
      general: '과정',
      computer: '프로세스',
      query: 'process computing',
      note:
        '일반적으로는 과정이라는 뜻이지만 운영체제 문맥에서는 실행 중인 프로그램의 작업 단위를 가리키는 기술용어로 쓰일 수 있습니다.',
    },
    {
      word: 'cookie',
      general: '과자',
      computer: '쿠키',
      query: 'cookie web',
      note:
        '웹 문맥에서는 브라우저와 웹사이트가 상태나 식별 정보를 저장·전달하는 데 사용하는 작은 데이터와 관련된 용어입니다.',
    },
    {
      word: 'driver',
      general: '운전기사',
      computer: '드라이버',
      query: 'device driver',
      note:
        '컴퓨터 문맥에서는 운영체제와 하드웨어 장치 사이의 동작을 지원하는 소프트웨어를 가리키는 device driver의 의미로 자주 쓰입니다.',
    },
    {
      word: 'memory',
      general: '기억',
      computer: '메모리',
      query: 'computer memory',
      note:
        '컴퓨터 문맥에서는 프로그램과 데이터를 저장하거나 처리하는 기억장치·저장 영역을 가리키는 기술용어로 사용됩니다.',
    },
    {
      word: 'shell',
      general: '껍데기',
      computer: '셸',
      query: 'shell computing',
      note:
        '운영체제 문맥에서는 사용자의 명령을 받아 해석하고 실행 환경과 연결하는 인터페이스나 명령 해석기를 가리킬 수 있습니다.',
    },
    {
      word: 'host',
      general: '주최자',
      computer: '호스트',
      query: 'host computer',
      note:
        '네트워크 문맥에서는 네트워크에 연결되어 주소를 가지고 통신하거나 서비스를 제공하는 시스템을 가리키는 표현으로 쓰일 수 있습니다.',
    },
  ];

  const developmentFlow = [
    {
      step: '01',
      title: '소스 작성',
      description: '프로그램의 동작을 코드로 작성하는 단계에서 기본 개발 용어가 등장합니다.',
      terms: [
        { label: 'source code', query: 'source code' },
        { label: 'programming language', query: 'programming language' },
        { label: 'editor', query: 'code editor' },
      ],
    },
    {
      step: '02',
      title: '버전 관리',
      description: '코드 변경 이력과 여러 작업 버전을 관리할 때 관련 용어를 확인합니다.',
      terms: [
        { label: 'version control', query: 'version control' },
        { label: 'repository', query: 'repository software' },
        { label: 'branch', query: 'branch version control' },
      ],
    },
    {
      step: '03',
      title: '빌드·변환',
      description: '작성한 코드를 실행 가능한 형태로 준비하는 과정에서 빌드 관련 용어가 쓰입니다.',
      terms: [
        { label: 'compiler', query: 'compiler' },
        { label: 'build', query: 'software build' },
        { label: 'dependency', query: 'software dependency' },
      ],
    },
    {
      step: '04',
      title: '테스트',
      description: '기능과 오류를 확인하고 예상한 동작을 검증하는 단계입니다.',
      terms: [
        { label: 'test case', query: 'test case software' },
        { label: 'debugging', query: 'debugging' },
        { label: 'bug', query: 'software bug' },
      ],
    },
    {
      step: '05',
      title: '배포',
      description: '완성된 프로그램이나 서비스를 사용 환경에 올리는 단계의 용어를 살펴봅니다.',
      terms: [
        { label: 'deployment', query: 'software deployment' },
        { label: 'release', query: 'software release' },
        { label: 'production', query: 'production environment software' },
      ],
    },
    {
      step: '06',
      title: '운영·관찰',
      description: '배포 뒤 서비스 상태와 오류를 관찰하고 유지보수할 때 관련 용어가 이어집니다.',
      terms: [
        { label: 'monitoring', query: 'system monitoring' },
        { label: 'log', query: 'computer log' },
        { label: 'maintenance', query: 'software maintenance' },
      ],
    },
  ];

  const securityGuide = [
    {
      icon: '🔐',
      term: 'authentication',
      ko: '인증',
      query: 'authentication',
      note:
        '사용자나 시스템이 누구인지 확인하는 절차를 가리키는 보안 용어입니다. 로그인, 계정, 자격 증명 문맥에서 자주 사용됩니다.',
    },
    {
      icon: '🪪',
      term: 'authorization',
      ko: '권한 부여',
      query: 'authorization',
      note:
        '인증된 사용자나 시스템이 어떤 자원이나 기능을 사용할 수 있는지 결정하는 개념입니다. authentication과 역할이 다릅니다.',
    },
    {
      icon: '🔒',
      term: 'encryption',
      ko: '암호화',
      query: 'encryption',
      note:
        '데이터를 허가되지 않은 사람이 바로 읽기 어렵도록 변환하는 보안 기술을 가리키는 용어입니다. 전송·저장 데이터 보호 문맥에서 사용됩니다.',
    },
    {
      icon: '🧱',
      term: 'firewall',
      ko: '방화벽',
      query: 'firewall',
      note:
        '정해진 정책에 따라 네트워크 트래픽의 통과 여부를 제어하는 보안 장치나 기능을 가리키는 용어입니다.',
    },
    {
      icon: '🗝️',
      term: 'credential',
      ko: '자격 증명',
      query: 'credential computing',
      note:
        '사용자나 시스템의 신원을 확인할 때 사용하는 정보와 관련된 용어입니다. 계정·토큰·인증서 등 다양한 문맥에서 나타날 수 있습니다.',
    },
    {
      icon: '📜',
      term: 'certificate',
      ko: '인증서',
      query: 'digital certificate',
      note:
        '디지털 통신 문맥에서는 신원이나 공개키 정보와 연결된 전자 인증 정보를 가리키는 용어로 쓰일 수 있습니다.',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-700 transition-colors font-bold text-[11px] md:text-xs bg-slate-50 hover:bg-emerald-50 px-2.5 py-1 rounded-full"
          >
            <span>←</span> 메인으로 <span className="text-slate-400 font-semibold">· Home</span>
          </Link>

          <div className="text-[12px] md:text-[13px] font-black text-slate-800 tracking-tighter">
            <span className="text-emerald-600">X</span>-DIC
            <span className="text-slate-400 ml-1">COMPUTER</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-16 md:pt-20 pb-20">
        <section className="text-center mb-4 md:mb-5 animate-in fade-in slide-in-from-top-4 duration-500">
          <p className="text-[9px] md:text-[10px] font-extrabold tracking-[0.12em] text-emerald-600 uppercase mb-1">
            X-DIC Computer Terminology
          </p>

          <h1 className="text-[24px] md:text-[30px] font-black text-slate-900 leading-tight tracking-tight">
            컴퓨터 전문 검색
            <span className="ml-1.5 text-[11px] md:text-[13px] font-bold text-emerald-600 align-middle">
              Computer
            </span>
          </h1>

          <p className="mt-1.5 text-[10px] md:text-[12px] font-bold tracking-tight">
            <span className="text-blue-600">Ko-En</span><span className="text-slate-400"> / </span><span className="text-emerald-600">En-Ko</span><span className="text-slate-500"> Terminology</span>
          </p>

          <p className="max-w-3xl mx-auto mt-2 text-[11px] md:text-[12.5px] text-slate-500 leading-5 md:leading-[1.65] break-keep">
            X-DIC 컴퓨터 허브는 소프트웨어·웹, 시스템·클라우드, 네트워크·인터넷,
            데이터·데이터베이스 분야에서 접하는 영어·한국어 전문용어를 한영·영한 사전 데이터와 연결해
            탐색할 수 있도록 구성했습니다. 용어를 선택하면 X-DIC 메인 검색 결과에서 관련 전문용어와
            병렬 데이터를 이어서 확인할 수 있습니다.
          </p>
        </section>

        <section aria-labelledby="computer-search-title" className="mb-5 md:mb-6">
          <h2 id="computer-search-title" className="sr-only">
            컴퓨터 용어 한영·영한 검색
          </h2>

          <div className="relative max-w-2xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full h-12 md:h-14 bg-white rounded-xl border border-emerald-300 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-emerald-100 transition-all"
            >
              <div className="pl-4 md:pl-5 text-emerald-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-5 md:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="예: API / 데이터베이스 / latency"
                className="flex-grow min-w-0 h-full px-3 md:px-4 text-sm md:text-base outline-none font-medium text-slate-800"
                autoComplete="off"
              />

              <button
                type="submit"
                className="h-full px-5 md:px-6 bg-emerald-600 text-white font-black text-sm md:text-base hover:bg-emerald-700 transition-colors"
              >
                검색
              </button>
            </form>

            <p className="mt-1.5 text-center text-[10px] md:text-[11px] text-slate-400 font-medium">
              검색어는 이 브라우저의 ‘나만의 컴퓨터 용어 보물창고’에 저장됩니다.
            </p>
          </div>
        </section>

        <section aria-labelledby="computer-guide-title" className="mb-8 md:mb-10">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:p-6">
            <div className="mb-4">
              <p className="text-[11px] md:text-xs font-bold text-emerald-600 mb-1">
                Computer Terminology Guide
              </p>
              <h2
                id="computer-guide-title"
                className="text-lg md:text-2xl font-black text-slate-900"
              >
                X-DIC에서 컴퓨터 용어를 찾는 방법
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <article className="rounded-xl bg-white border border-slate-200 p-4">
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base mb-2">
                  ① 한글·영어 전문용어 검색
                </h3>
                <p className="text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                  소프트웨어, 서버, 네트워크, 데이터베이스 등 컴퓨터 분야 용어를 한글 또는 영어로 입력하면
                  X-DIC 메인 검색 결과에서 관련 한영·영한 데이터를 확인할 수 있습니다.
                </p>
              </article>

              <article className="rounded-xl bg-white border border-slate-200 p-4">
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base mb-2">
                  ② 약어와 전체 표현을 함께 확인
                </h3>
                <p className="text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                  API, DNS, DBMS처럼 약어가 널리 쓰이는 용어는 약어와 전체 영어 표현을 함께 검색하면
                  용어의 범위와 실제 사용 표현을 비교하기 쉽습니다.
                </p>
              </article>

              <article className="rounded-xl bg-white border border-slate-200 p-4">
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base mb-2">
                  ③ 역할·흐름으로 연관 용어 탐색
                </h3>
                <p className="text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                  client → server → API → database처럼 시스템에서 서로 연결되는 역할을 따라가며 주변 용어를 함께 탐색할 수 있습니다.
                </p>
              </article>

              <article className="rounded-xl bg-white border border-slate-200 p-4">
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base mb-2">
                  ④ 개인 검색 기록 활용
                </h3>
                <p className="text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                  이 페이지에서 직접 검색한 최근 컴퓨터 용어는 현재 브라우저에 저장되어 다시 찾아보기 쉽도록 도와줍니다.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section aria-labelledby="computer-fields-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-emerald-600 mb-1">
              Explore by field
            </p>
            <h2
              id="computer-fields-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              대표 컴퓨터 용어 분야
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
            {[
              ['🧩', '소프트웨어·웹', '운영체제, 소스 코드, API, 프레임워크 등', '#software-web'],
              ['🖥️', '시스템·클라우드', '서버, 가상 머신, 컨테이너, 캐시 등', '#systems-cloud'],
              ['🌐', '네트워크·인터넷', 'IP 주소, DNS, HTTP, 대역폭 등', '#network-internet'],
              ['🗄️', '데이터·DB', '데이터베이스, SQL, 질의, 인덱스 등', '#data-database'],
            ].map(([icon, title, desc, href]) => (
              <a
                key={title}
                href={href}
                className="group rounded-xl border border-slate-200 bg-white p-3.5 md:p-4 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors"
              >
                <div className="text-xl mb-2" aria-hidden="true">{icon}</div>
                <h3 className="font-extrabold text-slate-900 text-sm mb-1 group-hover:text-emerald-700 transition-colors">
                  {title}
                </h3>
                <p className="text-[11px] md:text-[12px] text-slate-500 leading-relaxed">{desc}</p>
                <p className="mt-2 text-[10px] md:text-[11px] font-bold text-emerald-600">
                  대표 검색어 보기 ↓
                </p>
              </a>
            ))}
          </div>
        </section>

        <section aria-labelledby="computer-topic-terms-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-indigo-600 mb-1">
              Browse Computer Search Examples
            </p>
            <h2
              id="computer-topic-terms-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              분야별 대표 검색어
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed">
              아래 용어를 누르면 X-DIC 메인 검색 결과로 이동합니다.
              실제 보유 전문용어와 병렬 결과를 확인하면서 주변 컴퓨터 개념까지 이어서 탐색할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {topicGroups.map((group) => (
              <article
                key={group.id}
                id={group.id}
                className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl" aria-hidden="true">{group.icon}</div>
                  <div className="min-w-0">
                    <h3 className="text-sm md:text-base font-extrabold text-slate-900">
                      {group.title}
                    </h3>
                    <p className="mt-1 text-[11px] md:text-[12px] text-slate-500 leading-relaxed">
                      {group.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {group.terms.map((term) => (
                    <Link
                      key={`${group.id}-${term.label}`}
                      href={`/?q=${encodeURIComponent(term.query)}`}
                      className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[11px] md:text-[12px] font-bold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      {term.label}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="computer-reading-notes-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-violet-600 mb-1">
              Computer Terminology Notes
            </p>
            <h2
              id="computer-reading-notes-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              컴퓨터 용어를 읽을 때 함께 보면 좋은 기준
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              컴퓨터 용어는 같은 단어라도 소프트웨어, 시스템, 네트워크 문맥에 따라 역할이 달라질 수 있습니다.
              X-DIC 검색 결과를 비교할 때 아래 기준을 함께 참고해 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {readingNotes.map((note) => (
              <article
                key={note.title}
                className="rounded-2xl border border-slate-200 bg-slate-50/45 p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl" aria-hidden="true">{note.icon}</div>
                  <div>
                    <h3 className="text-[13px] md:text-[15px] font-extrabold text-slate-900">
                      {note.title}
                    </h3>
                    <p className="mt-1.5 text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
                      {note.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="computer-context-meaning-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-orange-600 mb-1">
              Contextual Computer Meanings
            </p>
            <h2
              id="computer-context-meaning-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              일상어와 다른 컴퓨터 문맥의 뜻
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              컴퓨터 분야에는 일상 영어와 같은 철자를 쓰지만 기술 문맥에서 전혀 다른 뜻으로 사용되는 단어가 많습니다.
              X-DIC에서 짧은 단어를 검색할 때는 아래처럼 문맥별 의미를 구분해 보는 것이 중요합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {contextualComputerTerms.map((item) => (
              <article
                key={item.word}
                className="rounded-2xl border border-orange-100 bg-orange-50/20 p-4 md:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[14px] md:text-[16px] font-black text-slate-900">
                      {item.word}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] md:text-[12px]">
                      <span className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-slate-500 font-bold">
                        일반: {item.general}
                      </span>
                      <span className="text-slate-300" aria-hidden="true">→</span>
                      <span className="rounded-full bg-orange-50 border border-orange-200 px-2.5 py-1 text-orange-700 font-extrabold">
                        컴퓨터: {item.computer}
                      </span>
                    </div>

                    <p className="mt-2.5 text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
                      {item.note}
                    </p>
                  </div>

                  <Link
                    href={`/?q=${encodeURIComponent(item.query)}`}
                    className="shrink-0 px-2.5 py-1 rounded-full border border-orange-200 bg-white text-[10px] md:text-[11px] font-bold text-orange-700 hover:bg-orange-50 transition-colors"
                  >
                    검색 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="computer-mini-glossary-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-emerald-600 mb-1">
              Computer Mini Glossary
            </p>
            <h2
              id="computer-mini-glossary-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              핵심 컴퓨터 용어 미니 해설
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              대표 컴퓨터 용어의 기본 개념을 짧게 확인한 뒤, 검색 버튼을 눌러 X-DIC의 실제 한영·영한 결과와 비교해 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {miniGlossary.map((item) => (
              <article
                key={item.term}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/25 p-4 md:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[13px] md:text-[15px] font-extrabold text-slate-900">
                      {item.term}
                      <span className="ml-2 text-slate-500 font-bold">
                        · {item.ko}
                      </span>
                    </h3>

                    <p className="mt-1.5 text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
                      {item.note}
                    </p>
                  </div>

                  <Link
                    href={`/?q=${encodeURIComponent(item.query)}`}
                    className="shrink-0 px-2.5 py-1 rounded-full border border-emerald-200 bg-white text-[10px] md:text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    검색 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="web-request-flow-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-blue-600 mb-1">
              Web Request Flow
            </p>
            <h2
              id="web-request-flow-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              웹 요청 흐름으로 컴퓨터 용어를 연결해 보세요
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              웹 서비스를 예로 들면 여러 컴퓨터 용어가 하나의 처리 흐름 안에서 서로 연결됩니다.
              아래 단계는 개념을 이해하기 위한 간단한 흐름이며, 각 용어는 X-DIC 검색으로 이어집니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {webRequestFlow.map((item) => (
              <article
                key={item.step}
                className="rounded-2xl border border-blue-100 bg-blue-50/25 p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">
                    {item.step}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[13px] md:text-[15px] font-extrabold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[11px] md:text-[12px] text-slate-500 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.terms.map((term) => (
                        <Link
                          key={`${item.step}-${term.label}`}
                          href={`/?q=${encodeURIComponent(term.query)}`}
                          className="px-2.5 py-1 rounded-full border border-blue-100 bg-white text-[11px] md:text-[12px] font-bold text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          {term.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="development-flow-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-cyan-600 mb-1">
              Software Development Flow
            </p>
            <h2
              id="development-flow-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              개발에서 배포까지 용어를 흐름으로 확인해 보세요
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              개발 문서의 용어는 서로 독립되어 있지 않고 작업 단계에 따라 연결되는 경우가 많습니다.
              아래는 일반적인 개념 흐름을 단순화한 것으로, 각 항목을 눌러 X-DIC 검색 결과와 비교할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {developmentFlow.map((item) => (
              <article
                key={item.step}
                className="rounded-2xl border border-cyan-100 bg-cyan-50/25 p-4 md:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[11px] font-black">
                    {item.step}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[13px] md:text-[15px] font-extrabold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[11px] md:text-[12px] text-slate-500 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.terms.map((term) => (
                        <Link
                          key={`${item.step}-${term.label}`}
                          href={`/?q=${encodeURIComponent(term.query)}`}
                          className="px-2.5 py-1 rounded-full border border-cyan-100 bg-white text-[11px] md:text-[12px] font-bold text-cyan-700 hover:border-cyan-300 hover:bg-cyan-50 transition-colors"
                        >
                          {term.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="computer-paired-terms-title" className="mb-8 md:mb-10">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/55 p-4 md:p-6">
            <div className="mb-4">
              <p className="text-[11px] md:text-xs font-bold text-slate-500 mb-1">
                Paired Computer Terms
              </p>
              <h2
                id="computer-paired-terms-title"
                className="text-lg md:text-xl font-black text-slate-900"
              >
                함께 보면 구분하기 쉬운 컴퓨터 용어
              </h2>
              <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
                역할이 서로 대응되거나 자주 혼동되는 용어는 짝으로 비교하면 의미 차이를 이해하기 쉽습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pairedTerms.map((pair) => (
                <article
                  key={`${pair.left}-${pair.right}`}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-center gap-3 md:gap-4">
                    <Link
                      href={`/?q=${encodeURIComponent(pair.leftQuery)}`}
                      className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-center hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors"
                    >
                      <div className="text-[12px] md:text-[13px] font-extrabold text-slate-900">
                        {pair.left}
                      </div>
                      <div className="mt-0.5 text-[11px] md:text-[12px] text-slate-500">
                        {pair.leftKo}
                      </div>
                    </Link>

                    <span className="text-slate-300 font-black" aria-hidden="true">
                      ↔
                    </span>

                    <Link
                      href={`/?q=${encodeURIComponent(pair.rightQuery)}`}
                      className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-center hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors"
                    >
                      <div className="text-[12px] md:text-[13px] font-extrabold text-slate-900">
                        {pair.right}
                      </div>
                      <div className="mt-0.5 text-[11px] md:text-[12px] text-slate-500">
                        {pair.rightKo}
                      </div>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="computer-security-guide-title" className="mb-8 md:mb-10">
          <div className="mb-4">
            <p className="text-[11px] md:text-xs font-bold text-red-600 mb-1">
              Security &amp; Access Terms
            </p>
            <h2
              id="computer-security-guide-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              보안·접근 제어에서 자주 보는 기본 용어
            </h2>
            <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
              보안 문서에서는 비슷해 보이는 단어가 서로 다른 역할을 나타내는 경우가 많습니다.
              기본 개념을 짧게 확인한 뒤 X-DIC의 실제 전문용어와 병렬 결과를 이어서 살펴보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {securityGuide.map((item) => (
              <article
                key={item.term}
                className="rounded-2xl border border-red-100 bg-red-50/20 p-4 md:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg" aria-hidden="true">{item.icon}</span>
                      <h3 className="text-[13px] md:text-[15px] font-extrabold text-slate-900">
                        {item.term}
                        <span className="ml-2 text-slate-500 font-bold">
                          · {item.ko}
                        </span>
                      </h3>
                    </div>

                    <p className="mt-1.5 text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
                      {item.note}
                    </p>
                  </div>

                  <Link
                    href={`/?q=${encodeURIComponent(item.query)}`}
                    className="shrink-0 px-2.5 py-1 rounded-full border border-red-200 bg-white text-[10px] md:text-[11px] font-bold text-red-700 hover:bg-red-50 transition-colors"
                  >
                    검색 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="computer-search-paths-title" className="mb-8 md:mb-10">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/35 p-4 md:p-6">
            <div className="mb-4">
              <p className="text-[11px] md:text-xs font-bold text-emerald-600 mb-1">
                Related Search Paths
              </p>
              <h2
                id="computer-search-paths-title"
                className="text-lg md:text-xl font-black text-slate-900"
              >
                연관 컴퓨터 용어를 이어서 검색해 보세요
              </h2>
              <p className="mt-1.5 text-[12px] md:text-[13px] text-slate-500 leading-relaxed break-keep">
                한 용어에서 시작해 같은 시스템·네트워크·데이터 흐름에서 함께 검토되는 주변 개념으로 이동할 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchPaths.map((path) => (
                <article
                  key={path.title}
                  className="rounded-xl border border-white/80 bg-white p-4 shadow-sm"
                >
                  <h3 className="text-[13px] md:text-sm font-extrabold text-slate-900">
                    {path.title}
                  </h3>
                  <p className="mt-1 text-[11px] md:text-[12px] text-slate-500 leading-relaxed">
                    {path.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {path.terms.map((term, index) => (
                      <React.Fragment key={`${path.title}-${term.label}`}>
                        {index > 0 && (
                          <span className="text-slate-300 text-[11px]" aria-hidden="true">
                            →
                          </span>
                        )}
                        <Link
                          href={`/?q=${encodeURIComponent(term.query)}`}
                          className="px-2.5 py-1 rounded-full border border-emerald-100 bg-emerald-50/60 text-[11px] md:text-[12px] font-bold text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100 transition-colors"
                        >
                          {term.label}
                        </Link>
                      </React.Fragment>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-7 md:gap-8">
          <section aria-labelledby="computer-treasure-title" className="animate-in fade-in duration-700">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2
                id="computer-treasure-title"
                className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2"
              >
                <span className="text-xl">🎁</span> 나만의 컴퓨터 용어 보물창고
              </h2>

              {myHistory.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('보물창고를 비울까요?')) {
                      setMyHistory([]);
                      localStorage.removeItem('xdic_computer_treasure');
                    }
                  }}
                  className="text-slate-400 hover:text-red-500 text-[11px] font-bold"
                >
                  비우기
                </button>
              )}
            </div>

            <div className="bg-emerald-50/40 rounded-2xl p-4 md:p-5 border border-emerald-100 min-h-[82px]">
              {myHistory.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {myHistory.map((item, index) => (
                    <Link
                      key={`${item}-${index}`}
                      href={`/?q=${encodeURIComponent(item)}`}
                      className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-[12px] md:text-sm font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center text-slate-400 text-[12px] md:text-sm italic py-3">
                  아직 저장된 검색어가 없습니다. 위 검색창에서 컴퓨터 용어를 찾아보세요.
                </div>
              )}
            </div>
          </section>

          <section aria-labelledby="recommended-computer-terms-title">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-3">
              <div>
                <p className="text-[11px] md:text-xs font-bold text-emerald-600 mb-1">
                  Recommended Computer Terms
                </p>
                <h2
                  id="recommended-computer-terms-title"
                  className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2"
                >
                  <span className="text-xl">💻</span> 추천 컴퓨터 용어
                </h2>
              </div>

              <p className="text-[11px] md:text-xs text-slate-400">
                대표 용어를 누르면 X-DIC 검색 결과로 이동합니다.
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-4 md:p-5 border border-slate-200">
              <div className="flex flex-wrap gap-2">
                {recommendedTerms.map((term) => (
                  <Link
                    key={term.label}
                    href={`/?q=${encodeURIComponent(term.query)}`}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[11px] md:text-[12px] font-bold rounded-full hover:border-emerald-300 hover:text-emerald-700 transition-all"
                  >
                    # {term.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section aria-labelledby="computer-faq-title" className="mt-8 md:mt-10">
          <div className="mb-3">
            <p className="text-[11px] md:text-xs font-bold text-emerald-600 mb-1">
              Computer Search FAQ
            </p>
            <h2
              id="computer-faq-title"
              className="text-lg md:text-xl font-black text-slate-900"
            >
              컴퓨터 용어 검색 FAQ
            </h2>
          </div>

          <div className="space-y-2.5">
            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                한글과 영어 컴퓨터 용어를 모두 검색할 수 있나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                네. 한글 또는 영어 용어를 입력하면 X-DIC 메인 검색 결과로 이동하여
                관련 한영·영한 전문용어와 병렬 결과를 확인할 수 있습니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                port, thread, process처럼 일반 영어와 컴퓨터 뜻이 다른 단어는 어떻게 봐야 하나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                단어 하나만으로 뜻을 결정하기보다 operating system, network, web 같은 주변 문맥을 함께 확인하는 것이 좋습니다.
                이 페이지의 ‘일상어와 다른 컴퓨터 문맥의 뜻’ 영역에서 대표적인 다의어를 먼저 비교한 뒤 X-DIC 검색 결과를 이어서 확인해 보세요.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                API, DNS, DBMS 같은 약어는 어떻게 검색하는 것이 좋나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                약어만 검색한 뒤 전체 영어 표현도 함께 확인하는 것이 좋습니다.
                약어는 분야에 따라 다른 뜻을 가질 수 있으므로 주변 용어와 검색 결과의 문맥을 함께 비교하세요.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                client와 server처럼 역할이 다른 용어는 어떻게 이해하나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                한 단어의 한국어 대응만 보기보다 시스템에서 어떤 역할을 하는지 함께 보는 것이 좋습니다.
                이 페이지의 웹 요청 흐름과 짝으로 비교하는 용어를 이용하면 관련 개념을 이어서 확인할 수 있습니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                미니 해설과 실제 X-DIC 검색 결과는 어떤 차이가 있나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                미니 해설은 대표 용어의 기본 개념을 빠르게 이해하기 위한 안내입니다.
                실제 번역어 선택은 X-DIC 검색 결과의 전문용어·병렬 데이터와 사용하려는 기술문서의 문맥을 함께 확인해 결정하는 것이 좋습니다.
              </p>
            </details>

            <details className="group rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-extrabold text-[13px] md:text-sm text-slate-900">
                실제 개발 문서에 검색 결과를 그대로 사용해도 되나요?
              </summary>
              <p className="mt-2 text-[12px] md:text-[13px] text-slate-600 leading-relaxed">
                X-DIC은 전문용어와 번역 표현을 탐색하기 위한 사전 서비스입니다.
                실제 개발·운영 문서에서는 사용하는 제품, 플랫폼, 프로토콜, 기술 문서의 공식 용어와 함께 확인해 주세요.
              </p>
            </details>
          </div>
        </section>

        <section
          aria-labelledby="computer-search-notice-title"
          className="mt-8 md:mt-10 rounded-2xl border border-emerald-100 bg-emerald-50/35 p-4 md:p-5"
        >
          <h2
            id="computer-search-notice-title"
            className="text-sm md:text-base font-extrabold text-slate-900 mb-2"
          >
            X-DIC 컴퓨터 용어 검색 이용 안내
          </h2>

          <p className="text-[11px] md:text-[13px] text-slate-600 leading-relaxed break-keep">
            X-DIC의 컴퓨터 용어 검색은 전문용어와 번역 표현을 탐색하기 위한 사전 서비스입니다.
            소프트웨어와 컴퓨터 기술은 제품·플랫폼·버전에 따라 용어와 사용 방식이 달라질 수 있으므로,
            실제 개발·운영 작업에서는 해당 기술의 공식 문서와 최신 사양을 함께 확인해 주세요.
          </p>
        </section>
      </main>
    </div>
  );
}
