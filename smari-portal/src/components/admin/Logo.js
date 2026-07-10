export default function Logo({ height = 40, style }) {
  return (
    <img
      src="/smari-logo.svg"
      alt="SMARI Institute"
      style={{
        height,
        width: 'auto',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
