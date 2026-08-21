import { ImageResponse } from 'next/og';

export const alt = 'Egyptian Society of Osteopathic Medicine';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          background: '#f8f4ec',
          color: '#082f49',
          padding: '72px 82px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '39%',
            background: '#001925',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 260,
              height: 260,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid #c9a84c',
              borderRadius: 999,
              color: '#f8f4ec',
              fontSize: 58,
              fontWeight: 700,
              letterSpacing: '-0.04em',
            }}
          >
            EGSOM
          </div>
        </div>

        <div
          style={{
            marginLeft: '43%',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 650,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              color: '#8f6f28',
              fontSize: 21,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: 58, height: 2, background: '#c9a84c' }} />
            Osteopathy in Egypt
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 34,
              fontSize: 58,
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
            }}
          >
            Egyptian Society of Osteopathic Medicine
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 34,
              color: '#52616b',
              fontSize: 25,
              lineHeight: 1.45,
            }}
          >
            Advancing osteopathic practice, education and standards
          </div>
        </div>
      </div>
    ),
    size,
  );
}
