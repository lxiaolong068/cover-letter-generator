import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'AI Cover Letter Generator - Create Professional Cover Letters with AI';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            padding: '60px',
            margin: '40px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              marginBottom: '20px',
            }}
          >
            🤖✍️
          </div>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '20px',
              lineHeight: '1.1',
            }}
          >
            AI Cover Letter Generator
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#6b7280',
              marginBottom: '30px',
              maxWidth: '800px',
              lineHeight: '1.3',
            }}
          >
            Create Professional, ATS-Optimized Cover Letters in Minutes
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              fontSize: '24px',
              color: '#4b5563',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>⚡</span>
              <span>Instant Generation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🎯</span>
              <span>ATS Optimized</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📄</span>
              <span>Multiple Templates</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
