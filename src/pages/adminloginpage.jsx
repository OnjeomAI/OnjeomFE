import { useState } from 'react';
import Button from '../components/common/Button'; 

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('관리자 로그인 요청:', { email, password });
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* 왼쪽: 브랜드 섹션 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', padding: '60px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <span>●</span>
            <span style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px' }}>온점</span>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '500', lineHeight: '1.4', marginBottom: '20px', wordBreak: 'keep-all' }}>
            디지털 시대에 보존하는 지혜의 가치.
          </h1>
          <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '60px' }}>
            온점 콘텐츠 관리자 시스템(CMS)입니다.<br />
            등록된 관리자 계정으로 로그인해 주세요.
          </p>
          <div style={{ fontSize: '13px', display: 'inline-block', paddingBottom: '4px' }}>
            디지털 기록가
          </div>
        </div>
      </div>

      {/* 오른쪽: 관리자 로그인 폼  */}
      <div style={{ width: '550px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 'bold' }}>관리자 로그인</h2>
          <p style={{ fontSize: '14px', marginBottom: '40px' }}>학문적 탐구를 관리하고 기록을 보존합니다.</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* 이메일 입력창 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold' }}>이메일 주소</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@onjeom.ai"
                style={{ padding: '16px', borderRadius: '4px', fontSize: '15px' }}
                required
              />
            </div>

            {/* 비밀번호 입력창 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold' }}>비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ padding: '16px', borderRadius: '4px', fontSize: '15px' }}
                required
              />
            </div>

            {/* 로그인 버튼 */}
            <Button type="submit" style={{ width: '100%', padding: '16px', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', marginTop: '12px' }}>
              관리자 시스템 로그인
            </Button>

          </form>
        </div>
      </div>

    </div>
  );
};

export default AdminLoginPage;