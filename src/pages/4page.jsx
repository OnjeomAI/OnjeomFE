import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const FourPage = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', padding: '30px', backgroundColor: '#f9f9f7', minHeight: '100vh' }}>
      
      {/* 왼쪽: 지문 영역 (스크롤 가능하게 설정) */}
      <Card style={{ height: 'fit-content' }}>
        <div style={{ padding: '40px', lineHeight: '1.8', color: '#333' }}>
          <div style={{ borderLeft: '4px solid #d4b483', paddingLeft: '15px', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>디지털 시대의 아카이브: 기억의 보존과 알고리즘</h1>
          </div>
          <p style={{ marginBottom: '20px' }}>디지털 기술의 발전은 인류가 정보를 기록하고 저장하는 방식을 근본적으로 변화시켰다. 과거의 아카이브가 물리적 공간의 제약을 받는 종이 문서와 유물 위주였다면, 현대의 디지털 아카이브는 방대한 데이터를 빛의 속도로 복제하고 공유한다.</p>
          <p style={{ marginBottom: '20px' }}>이제는 무엇을 남기고 삭제할지 결정하는 <span style={{ backgroundColor: '#fff3cd', padding: '2px 4px' }}>주체로서의 인공지능과 알고리즘</span>의 역할이 부각되고 있다. 과거에는 전문 사서가 가치 판단의 주체였다면, 이제는 이용자의 데이터 패턴을 분석하여 '중요도'를 할당하는 수치적 모델이 그 자리를 대신하고 있다.</p>
          <p style={{ backgroundColor: '#eef7ff', padding: '15px', borderRadius: '8px' }}>이 지점에서 우리는 질문을 던져야 한다. 알고리즘이 선택한 기억은 객관적인가? 혹은 우리가 미래에 보게 될 역사를 편향적으로 재구성하고 있지는 않은가?</p>
        </div>
      </Card>

      {/* 오른쪽: 문제 및 AI 보조 영역 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 문제 제출 카드 */}
        <Card>
          <div style={{ padding: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px' }}>
              <span style={{ backgroundColor: '#2c2621', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Q1</span>
              <strong style={{ fontSize: '15px', lineHeight: '1.5' }}>작가가 주장하는 '디지털 아카이브의 주체성 변화'가 미래 역사관에 미칠 수 있는 영향에 대해 서술하시오.</strong>
            </div>
            <textarea 
              placeholder="지문의 내용을 바탕으로 답변을 작성해주세요" 
              style={{ width: '100%', height: '140px', padding: '15px', borderRadius: '8px', border: '1px solid #eee', backgroundColor: '#fafafa', resize: 'none', marginBottom: '15px', fontSize: '13px' }}
            />
            <Button style={{ width: '100%', backgroundColor: '#2c2621', color: '#fff' }}>정답 제출하기</Button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#d4b483', marginTop: '15px', cursor: 'pointer' }}>💡 AI에게 힌트 얻기</p>
          </div>
        </Card>

        {/* AI 채팅 피드백 카드 */}
        <Card>
          <div style={{ padding: '20px', backgroundColor: '#f4f1ea', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
              <span>✨</span>
              <strong style={{ fontSize: '14px' }}>인공지능 연구 보조</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ alignSelf: 'flex-end', backgroundColor: '#2c2621', color: '#fff', padding: '10px 12px', borderRadius: '12px 12px 0 12px', fontSize: '12px', maxWidth: '80%' }}>
                "데이터 패턴 분석"이 정확히 뭔가요?
              </div>
              <div style={{ alignSelf: 'flex-start', backgroundColor: '#fff', padding: '10px 12px', borderRadius: '0 12px 12px 12px', fontSize: '12px', border: '1px solid #e9e4d9', lineHeight: '1.5', maxWidth: '80%' }}>
                알고리즘이 사용자의 이용 기록을 수집해 '가치'를 스스로 판단하는 과정을 말합니다.
              </div>
            </div>
            <div style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '20px', padding: '8px 15px', border: '1px solid #ddd' }}>
              <input placeholder="추가 질문을 입력하세요..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: '12px' }} />
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🚀</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FourPage;