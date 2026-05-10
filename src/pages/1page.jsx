import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const OnePage = () => {
  return (
    <div style={{ backgroundColor: '#f9f9f7', minHeight: '100vh', fontFamily: 'serif' }}>
      {/* 1. 헤더 부분  */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 50px', alignItems: 'center' }}>
        <h2 style={{ color: '#4a3f35' }}>온점(.)</h2>
        <nav>
          <Button style={{ background: 'transparent', color: '#000' }}>로그인</Button>
          <Button style={{ background: '#4a3f35', color: '#fff', marginLeft: '10px' }}>시작하기</Button>
        </nav>
      </header>

      {/* 2. 메인 비주얼 (Hero Section) */}
      <section style={{ display: 'flex', padding: '100px 50px', alignItems: 'center', gap: '50px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: '#c4a484', fontWeight: 'bold' }}>학습 가이드의 마침표</p>
          <h1 style={{ fontSize: '3rem', margin: '20px 0', color: '#222' }}>
            지혜의 아카이브,<br /> 당신만을 위한 AI 학습 가이드.
          </h1>
          <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '30px' }}>
            단순한 오답 노트를 넘어, 당신의 사고 과정을 이해하고 최적의 학습 경로를 제안합니다.
          </p>
          <Button style={{ background: '#222', color: '#fff', padding: '15px 30px' }}>지금 시작하기</Button>
        </div>
        <div style={{ flex: 1 }}>
          {/* 책 이미지나 일러스트가 들어갈 자리 */}
          <img src="https://via.placeholder.com/500x400" alt="main" style={{ width: '100%', borderRadius: '10px' }} />
        </div>
      </section>

      {/* 3. 기능 설명 (Features Section) */}
      <section style={{ padding: '80px 50px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '50px' }}>기능 그 이상의 가치</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <Card>
            <div style={{ padding: '30px', textAlign: 'left' }}>
              <h3>AI 자동 채점</h3>
              <p>작성한 답변을 AI가 분석하여 즉시 피드백을 제공합니다.</p>
            </div>
          </Card>
          <Card style={{ backgroundColor: '#2e2620', color: '#fff' }}>
            <div style={{ padding: '30px', textAlign: 'left' }}>
              <h3>답변 변화 추적</h3>
              <p>시간에 따른 당신의 사고 성장을 한눈에 확인하세요.</p>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. 하단 배너 */}
      <section style={{ backgroundColor: '#f0ece2', padding: '100px 0', textAlign: 'center' }}>
        <h2>당신의 지적 성장에 온점(.)을 찍으세요.</h2>
        <div style={{ marginTop: '30px' }}>
          <Button style={{ background: '#7a5c33', color: '#fff', marginRight: '10px' }}>지금 시작하기</Button>
          <Button>도움말 보기</Button>
        </div>
      </section>

      {/* 5. 푸터 */}
      <footer style={{ padding: '50px', backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
        <p>© 2026 Onjeom. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default OnePage;