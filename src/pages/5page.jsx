import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const FivePage = () => {
  return (
    <div style={{ padding: '30px', backgroundColor: '#f9f9f7', minHeight: '100vh' }}>
      {/* 상단 헤더 섹션 */}
      <div style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '12px', color: '#d4b483', marginBottom: '5px' }}>성취도 분석</p>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>답변 변화 추적</h2>
      </div>

      {/* 상단 지문 카드 */}
      <Card style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '30px' }}>
          <div>
            <span style={{ backgroundColor: '#fdf6e3', color: '#d4b483', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>최근 읽기</span>
            <h1 style={{ fontSize: '28px', marginTop: '15px', color: '#2c2621' }}>19세기 영국 산업 자동화의 사회경제적 영향에 대하여</h1>
          </div>
          <div style={{ width: '120px', height: '120px', backgroundColor: '#eee', borderRadius: '8px' }}>
             {/* 이미지 영역 */}
          </div>
        </div>
      </Card>

      {/* 중간: 그래프와 요약 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <Card>
          <div style={{ padding: '25px' }}>
            <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>성취도 변화 곡선</h3>
            <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 40px', position: 'relative' }}>
              {/* 단순 그래프 시각화 (막대/선 대용) */}
              <div style={{ textAlign: 'center' }}><div style={{ width: '10px', height: '40px', backgroundColor: '#d4b483', margin: '0 auto' }}></div><p style={{ fontSize: '11px', marginTop: '10px' }}>1회차</p></div>
              <div style={{ textAlign: 'center' }}><div style={{ width: '10px', height: '70px', backgroundColor: '#d4b483', margin: '0 auto' }}></div><p style={{ fontSize: '11px', marginTop: '10px' }}>2회차</p></div>
              <div style={{ textAlign: 'center' }}><div style={{ width: '10px', height: '120px', backgroundColor: '#d4b483', margin: '0 auto' }}></div><p style={{ fontSize: '11px', marginTop: '10px' }}>3회차</p></div>
              <div style={{ textAlign: 'center' }}><div style={{ width: '10px', height: '160px', backgroundColor: '#7a5c33', margin: '0 auto' }}></div><p style={{ fontSize: '11px', marginTop: '10px', fontWeight: 'bold' }}>최근</p></div>
              {/* 선 연결 느낌 */}
              <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', borderTop: '1px dashed #ddd', zIndex: 0 }}></div>
            </div>
          </div>
        </Card>

        <div style={{ backgroundColor: '#fdf1ba', padding: '25px', borderRadius: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>✨</div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>지속적인 진화</h3>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#555' }}>
            "핵심 키워드를 2개 더 포함했습니다. 점수가 15점 올랐어요! 👏"
          </p>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '15px' }}>세 번째 문단의 논리적 연결성이 개선되었습니다.</p>
        </div>
      </div>

      {/* 하단: 제출 기록 아카이브 */}
      <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#888' }}>제출 기록 아카이브</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* 현재 제출분 */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 50px', alignItems: 'center', backgroundColor: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #d4b483' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7a5c33', textAlign: 'center' }}>92</div>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>현재 제출분</h4>
            <p style={{ fontSize: '12px', color: '#aaa' }}>2026.05.10 · 14:20 PM</p>
            <p style={{ fontSize: '13px', color: '#555', marginTop: '5px' }}>"기술 발전과 노동력 대체 사이의 미묘한 관계를 시사하며..."</p>
          </div>
          <div style={{ textAlign: 'right', cursor: 'pointer' }}>〉</div>
        </div>

        {/* 이전 기록들 */}
        {[
          { score: 77, title: '3회차 제출', date: '2026.04.25', text: '영국의 산업 자동화는 노동 시장의 급격한 변화를 가져왔으며...' },
          { score: 62, title: '2회차 제출', date: '2026.04.10', text: '당시 숙련된 장인들에게 있어 가장 큰 영향은 일자리의 상실이었습니다...' }
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 50px', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: '12px', padding: '20px', opacity: 0.7 }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#888', textAlign: 'center' }}>{item.score}</div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.title}</h4>
              <p style={{ fontSize: '11px', color: '#aaa' }}>{item.date}</p>
              <p style={{ fontSize: '12px', color: '#777', marginTop: '5px' }}>"{item.text}"</p>
            </div>
            <div style={{ textAlign: 'right', cursor: 'pointer' }}>〉</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Button style={{ backgroundColor: '#7a5c33', color: '#fff', padding: '15px 40px' }}>새로운 시도 시작하기 📝</Button>
      </div>
    </div>
  );
};

export default FivePage;