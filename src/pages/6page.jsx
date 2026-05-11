import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const SixPage = () => {
  return (
    <div style={{ padding: '30px', backgroundColor: '#f9f9f7', minHeight: '100vh' }}>
      {/* 상단 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <span style={{ cursor: 'pointer' }}>←</span>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>학습 세션 채점: 기술 경제학</h2>
      </div>

      {/* 점수 섹션 */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '12px', color: '#888' }}>최종 평가</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <h1 style={{ fontSize: '64px', fontWeight: 'bold', margin: 0 }}>78 <small style={{ fontSize: '24px', color: '#ccc' }}>/ 100</small></h1>
          <span style={{ backgroundColor: '#fdf1ba', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>보완 필요</span>
        </div>
        <p style={{ fontSize: '12px', color: '#aaa', marginTop: '10px' }}>✨ AI 채점 완료 (2.3초)</p>
      </div>

      {/* 답변 비교 섹션 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <div>
          <h3 style={{ fontSize: '14px', marginBottom: '15px' }}>● 나의 답변</h3>
          <Card>
            <div style={{ padding: '20px', fontSize: '14px', lineHeight: '1.8', color: '#555' }}>
              이 정책을 선택하는 데 따른 근본적인 <span style={{ backgroundColor: '#e1f5fe' }}>기회비용</span>은 높습니다. 한계 효용은 언뜻 보기에 긍정적으로 보이지만, 균형 이동에 대한 고리가 부족하여 예측이 불안정합니다. 또한 <span style={{ backgroundColor: '#e8f5e9' }}>공급망</span>에 미치는 영향도 살펴봐야 합니다.
            </div>
          </Card>
        </div>
        <div>
          <h3 style={{ fontSize: '14px', marginBottom: '15px' }}>● 모범 답안</h3>
          <Card>
            <div style={{ padding: '20px', fontSize: '14px', lineHeight: '1.8', color: '#555', backgroundColor: '#fafafa' }}>
              효과적인 분석을 위해서는 <span style={{ backgroundColor: '#e1f5fe' }}>기회비용</span>과 희소성의 원칙 사이의 균형이 필요합니다. 자원의 한계 효용을 분석함으로써 공급망 내의 균형 이동을 예측하고 장기적인 생산 안정성을 보장할 수 있습니다.
            </div>
          </Card>
        </div>
      </div>

      {/* 상세 분석 섹션 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>왜 이런 점수가 나왔나요?</h3>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '10px' }}>키워드 통합 및 개념적 깊이에 대한 상세 분석입니다.</p>
          
          <Card>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <span style={{ color: '#27ae60' }}>✔</span>
                <div>
                  <strong style={{ fontSize: '14px' }}>기회비용 (OPPORTUNITY COST)</strong>
                  <p style={{ fontSize: '12px', color: '#777', marginTop: '5px' }}>완벽하게 적용되었습니다. 모든 선택에는 상충 관계가 있음을 정확히 식별했습니다.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <span style={{ color: '#e74c3c' }}>✘</span>
                <div>
                  <strong style={{ fontSize: '14px' }}>균형 이동 (EQUILIBRIUM SHIFTS)</strong>
                  <p style={{ fontSize: '12px', color: '#777', marginTop: '5px' }}>언급은 되었으나 설명이 부족합니다. 수요-공급 균형이 실제 어떻게 변하는지 누락되었습니다.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 오른쪽 사이드바 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Card style={{ backgroundColor: '#f8f8f8' }}>
            <div style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>💡 AI 전문가 인사이트</h4>
              <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#666' }}>
                "전체적으로 용어 이해도는 높으나, 인과 관계를 설명하는 '연결 고리'가 부족합니다. 미시경제학적 흐름에 집중해 보시길 권장합니다."
              </p>
              <Button style={{ width: '100%', marginTop: '15px', backgroundColor: '#7a5c33', color: '#fff', fontSize: '12px' }}>개념 복습하기 ↗</Button>
            </div>
          </Card>
          <Button style={{ backgroundColor: '#2c2621', color: '#fff', padding: '15px' }}>다음 문제 풀기 (#2)</Button>
          <Button style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '15px' }}>대시보드로 돌아가기</Button>
        </div>
      </div>
    </div>
  );
};

export default SixPage;