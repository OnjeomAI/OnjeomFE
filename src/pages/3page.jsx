import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const ThreePage = () => {
  return (
    <div style={{ padding: '30px', backgroundColor: '#f9f9f7', minHeight: '100vh' }}>
      {/* 상단 제목 섹션 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>학습 현황 개요</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', color: '#888' }}>
          <span>🔔</span> <span>👤</span> <span>||| #2841</span>
        </div>
      </div>

      {/* 상단 요약 카드 3개 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <Card>
          <div style={{ padding: '20px' }}>
            <p style={{ fontSize: '12px', color: '#888' }}>목표 달성률</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>7 <small style={{ fontSize: '14px', color: '#aaa' }}>/ 10</small></span>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid #7a5c33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>70%</div>
            </div>
            <p style={{ fontSize: '11px', color: '#d4b483', marginTop: '5px' }}>완료한 문항 수</p>
          </div>
        </Card>
        <Card>
          <div style={{ padding: '20px' }}>
            <p style={{ fontSize: '12px', color: '#888' }}>학습 시간</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>32 <small style={{ fontSize: '14px' }}>분</small></span>
              <span style={{ fontSize: '24px' }}>🕒</span>
            </div>
            <p style={{ fontSize: '11px', color: '#888', marginTop: '5px' }}>어제 대비 -12%</p>
          </div>
        </Card>
        <Card>
          <div style={{ padding: '20px' }}>
            <p style={{ fontSize: '12px', color: '#888' }}>평균 점수</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>74 <small style={{ fontSize: '14px' }}>점</small></span>
              <span style={{ fontSize: '24px' }}>📊</span>
            </div>
            <p style={{ fontSize: '11px', color: '#27ae60', marginTop: '5px' }}>안정적인 추세</p>
          </div>
        </Card>
      </div>

      {/* 중간 섹션: 그래프와 분석 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <Card>
          <div style={{ padding: '25px', textAlign: 'center', height: '350px' }}>
            <h3 style={{ textAlign: 'left', fontSize: '16px', marginBottom: '20px' }}>영역별 숙련도</h3>
            <div style={{ width: '180px', height: '180px', backgroundColor: '#7a5c33', margin: '0 auto', clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', opacity: 0.7 }}></div>
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>추론적 독해 / 문맥 파악 / 어휘력 / 비판적 사고 / 정보 확인</div>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card>
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>취약점 분석</h3>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span>추론적 독해</span><span style={{ color: '#e74c3c' }}>42%</span></div>
                <div style={{ height: '4px', backgroundColor: '#eee', marginTop: '5px' }}><div style={{ width: '42%', height: '100%', backgroundColor: '#e74c3c' }}></div></div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}><span>문맥 파악</span><span style={{ color: '#e74c3c' }}>58%</span></div>
                <div style={{ height: '4px', backgroundColor: '#eee', marginTop: '5px' }}><div style={{ width: '58%', height: '100%', backgroundColor: '#e74c3c' }}></div></div>
              </div>
            </div>
          </Card>
          <div style={{ backgroundColor: '#2c2621', color: '#fff', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '8px' }}>복습이 필요한 3개의 항목</h3>
            <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '15px' }}>기억 보유량이 62% 수준입니다.</p>
            <Button style={{ width: '100%', backgroundColor: '#7a5c33', color: '#fff', border: 'none' }}>지금 풀기</Button>
          </div>
        </div>
      </div>

      {/* 하단 섹션: 학습 기록 */}
      <Card>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '16px' }}>최근 학습 기록</h3>
            <span style={{ fontSize: '12px', color: '#d4b483', cursor: 'pointer' }}>전체 보기</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left', color: '#888' }}>
                <th style={{ padding: '10px 0' }}>학습 문항</th>
                <th>완료일</th>
                <th>점수</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f9f9f9' }}>
                <td style={{ padding: '15px 0' }}>고전 문학: 이상의 '날개' 분석</td>
                <td>2026.05.10</td>
                <td><span style={{ color: '#27ae60', fontWeight: 'bold' }}>88 점</span></td>
                <td>다시 풀기 ↻</td>
              </tr>
              <tr>
                <td style={{ padding: '15px 0' }}>사설: AI 큐레이션의 윤리적 쟁점</td>
                <td>2026.05.09</td>
                <td><span style={{ color: '#e74c3c', fontWeight: 'bold' }}>54 점</span></td>
                <td>다시 풀기 ↻</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ThreePage;