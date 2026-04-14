const [r1, sr1] = useState(50);

  return (
    <div className="p-6">
      <div style={{ height: 300, overflow: 'hidden' }}>
        diff 3 translate
        <input
          type="range"
          value={r1}
          min={0}
          max={100}
          onInput={(e) => {
            sr1(Number(e.currentTarget.value));
          }}
        />
        <div
          style={{
            position: 'relative',
            height: 300
          }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              transform: `translateX(${r1 - 100}%)`
            }}>
            <img
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translateX(${100 - r1}%)`
              }}
              src="https://pic.rmb.bdstatic.com/bjh/ce14020c09cd67d9f0121bc0eb5bff372120.jpeg@h_1280"
              alt=""
            />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              transform: `translateX(${r1}%)`
            }}>
            <img
              style={{
                position: 'absolute',
                inset: 0,
                filter: 'grayscale(1)',
                transform: `translateX(${-1 * r1}%)`
              }}
              src="https://pic.rmb.bdstatic.com/bjh/ce14020c09cd67d9f0121bc0eb5bff372120.jpeg@h_1280"
              alt=""
            />
          </div>
        </div>
      </div>
      <div style={{ height: 300, overflow: 'hidden' }}>
        diff 2 clip
        <div
          style={{
            position: 'relative'
          }}>
          <img
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `inset(0 ${100 - r1}% 0 0)`
            }}
            src="https://pic.rmb.bdstatic.com/bjh/ce14020c09cd67d9f0121bc0eb5bff372120.jpeg@h_1280"
            alt=""
          />
          <img
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `inset(0 0 0 ${r1}%)`,
              filter: 'grayscale(1)'
            }}
            src="https://pic.rmb.bdstatic.com/bjh/ce14020c09cd67d9f0121bc0eb5bff372120.jpeg@h_1280"
            alt=""
          />
        </div>
      </div>
      <div style={{ height: 300, overflow: 'hidden' }}>
        diff 1 mask
        <div
          style={{
            position: 'relative'
          }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              maskImage: 'linear-gradient(#000, #000)',
              maskPosition: '0 0',
              maskSize: `${r1}% 100%`,
              maskRepeat: 'no-repeat',
              background:
                'url("https://pic.rmb.bdstatic.com/bjh/ce14020c09cd67d9f0121bc0eb5bff372120.jpeg@h_1280") no-repeat 0 0 / cover'
            }}
          />
          <img
            style={{
              // clipPath: 'inset(10px 20px 30px 40px)'
              filter: 'grayscale(1)'
            }}
            src="https://pic.rmb.bdstatic.com/bjh/ce14020c09cd67d9f0121bc0eb5bff372120.jpeg@h_1280"
            alt=""
          />
        </div>
      </div>