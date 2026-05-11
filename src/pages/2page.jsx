import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const TwoPage = () => {
  return (
    <div style={{ padding: '40px', backgroundColor: '#fdfbf7', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ border: '1px solid #d4b483', color: '#d4b483', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>분석 완료</span>
        <h1 style={{ fontSize: '32px', marginTop: '10px' }}>진단이 완료되었습니다!</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        <Card>
          <div style={{ padding: '30px', textAlign: 'center' }}>
            <div style={{ width: '200px', height: '200px', margin: '0 auto', backgroundColor: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>[그래프 영역]</p>
            </div>
            <h2 style={{ marginTop: '20px' }}>중급 <span style={{ fontSize: '14px', color: '#999' }}>LEVEL 03</span></h2>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #d4b483' }}>
            <strong>추론적 독해</strong>
            <p>문맥을 통해 정보를 유추하는 능력이 뛰어납니다.</p>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #c0392b' }}>
            <strong>비판적 사고</strong>
            <p>비판적 시각에서의 평가 능력을 보완해야 합니다.</p>
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Button style={{ backgroundColor: '#7a5c33', color: '#fff', padding: '15px 60px' }}>학습 시작하기</Button>
      </div>
    </div>
  );
};

export default TwoPage;