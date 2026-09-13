/* eslint-disable @next/next/no-img-element */
// The harness tests React lifecycle in isolation; production tests use next/image.
export default function Image(props) {
  return <img src={`/_next/image?url=${encodeURIComponent(props.src)}&w=1080&q=75`} alt={props.alt} className={props.className} onLoad={props.onLoad} onError={props.onError}
    loading={props.loading} fetchPriority={props.fetchPriority}
    style={props.fill ? { position: 'absolute', inset: 0, height: '100%', width: '100%' } : undefined} />;
}
