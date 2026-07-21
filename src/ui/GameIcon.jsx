const ink = '#1C1410'
const peach = '#F4A87C'
const sky = '#A9D8F0'
const mint = '#8FD9B6'
const yellow = '#F7D26A'
const lavender = '#C9B6F0'

export default function GameIcon({ type }) {
  return (
    <svg viewBox="0 0 80 80" width="50" height="50" aria-hidden="true">
      <IconArtwork type={type} />
    </svg>
  )
}

function IconArtwork({ type }) {
  const stroke = { stroke: ink, strokeWidth: 4, strokeLinejoin: 'round', strokeLinecap: 'round' }
  switch (type) {
    case 'train':
      return <><rect x="14" y="25" width="43" height="30" rx="4" fill={sky} {...stroke} /><path d="M23 25V15h24l10 10" fill={peach} {...stroke} /><circle cx="24" cy="60" r="7" fill={yellow} {...stroke} /><circle cx="51" cy="60" r="7" fill={yellow} {...stroke} /><path d="M57 39h10v12H57M21 34h12v10H21" fill="white" {...stroke} /></>
    case 'shop':
    case 'market':
      return <><path d="M12 30l5-16h46l5 16z" fill={peach} {...stroke} /><rect x="18" y="30" width="44" height="34" rx="3" fill={sky} {...stroke} /><rect x="32" y="42" width="16" height="22" fill="white" {...stroke} /></>
    case 'playground':
      return <><path d="M18 66L38 18l22 48M27 45h25" fill="none" {...stroke} /><path d="M34 45v14M47 45v14" {...stroke} /><path d="M29 59h23" {...stroke} /><circle cx="58" cy="23" r="8" fill={yellow} {...stroke} /></>
    case 'picnic':
      return <><path d="M19 38h42l-5 28H24z" fill={peach} {...stroke} /><path d="M28 38c0-23 24-23 24 0" fill="none" {...stroke} /><path d="M25 49h32M36 39v27M47 39v27" {...stroke} /><circle cx="25" cy="24" r="7" fill={mint} {...stroke} /><circle cx="56" cy="22" r="7" fill={yellow} {...stroke} /></>
    case 'city':
      return <><rect x="12" y="30" width="18" height="36" fill={sky} {...stroke} /><rect x="30" y="17" width="22" height="49" fill={lavender} {...stroke} /><rect x="52" y="37" width="16" height="29" fill={peach} {...stroke} /><path d="M19 39h4m-4 10h4m18-22h4m-4 11h4m-4 11h4m17-3h3" {...stroke} /></>
    case 'camp':
      return <><path d="M13 62l27-45 27 45z" fill={yellow} {...stroke} /><path d="M40 17v45M40 62l13-20" {...stroke} /><path d="M18 68h44" {...stroke} /><circle cx="63" cy="18" r="7" fill={peach} {...stroke} /></>
    case 'ruler-chart':
      return <><rect x="12" y="48" width="54" height="14" rx="3" fill={yellow} {...stroke} /><path d="M21 48v7m10-7v5m10-5v7m10-7v5" {...stroke} /><path d="M17 38l11-13 11 8 20-18" fill="none" {...stroke} /><circle cx="59" cy="15" r="4" fill={mint} {...stroke} /></>
    case 'compass':
      return <><circle cx="40" cy="40" r="27" fill={sky} {...stroke} /><path d="M49 27L43 44 27 51l7-17z" fill={peach} {...stroke} /><circle cx="40" cy="40" r="4" fill={yellow} {...stroke} /></>
    case 'basket':
      return <><path d="M15 34h50L58 65H22z" fill={yellow} {...stroke} /><path d="M25 34c2-25 28-25 30 0M25 45h35M34 35v30M47 35v30" fill="none" {...stroke} /></>
    case 'flask-ruler':
      return <><path d="M29 14h22M34 14v19L20 61c-2 5 1 7 6 7h28c5 0 8-2 6-7L46 33V14" fill={sky} {...stroke} /><path d="M27 52h26" {...stroke} /><path d="M18 31h15M18 31v30" fill="none" {...stroke} /></>
    case 'bar-chart':
      return <><path d="M14 65V16M14 65h54" fill="none" {...stroke} /><rect x="22" y="44" width="10" height="21" fill={peach} {...stroke} /><rect x="38" y="31" width="10" height="34" fill={yellow} {...stroke} /><rect x="54" y="19" width="10" height="46" fill={mint} {...stroke} /></>
    case 'rocket':
      return <><path d="M40 12c15 11 18 29 8 43H32c-10-14-7-32 8-43z" fill={sky} {...stroke} /><circle cx="40" cy="32" r="7" fill={yellow} {...stroke} /><path d="M31 48L19 58l13 3M49 48l12 10-13 3M35 56l-4 14 9-7 9 7-4-14" fill={peach} {...stroke} /></>
    case 'kitchen':
      return <><path d="M16 39h48c0 18-9 28-24 28S16 57 16 39z" fill={peach} {...stroke} /><path d="M23 39c3-11 8-17 17-17s14 6 17 17" fill={yellow} {...stroke} /><path d="M40 13v21M32 16l8 8 8-8" fill="none" {...stroke} /></>
    case 'tools':
      return <><path d="M19 18l16 16-9 9-16-16z" fill={peach} {...stroke} /><path d="M31 39l29 29" {...stroke} /><path d="M55 13l12 12-35 35-12-12z" fill={yellow} {...stroke} /><path d="M50 25l5 5m-12 2 5 5m-12 2 5 5" {...stroke} /></>
    case 'line-chart':
      return <><path d="M13 65V15M13 65h54" fill="none" {...stroke} /><path d="M20 54l13-17 10 8 19-27" fill="none" {...stroke} /><circle cx="20" cy="54" r="4" fill={peach} {...stroke} /><circle cx="33" cy="37" r="4" fill={yellow} {...stroke} /><circle cx="43" cy="45" r="4" fill={lavender} {...stroke} /><circle cx="62" cy="18" r="4" fill={mint} {...stroke} /></>
    case 'globe-clock':
      return <><circle cx="34" cy="38" r="25" fill={sky} {...stroke} /><path d="M9 38h50M34 13c-12 13-12 37 0 50M34 13c12 13 12 37 0 50" fill="none" {...stroke} /><circle cx="57" cy="55" r="14" fill="white" {...stroke} /><path d="M57 55V45M57 55l7 4" {...stroke} /></>
    case 'cafe':
      return <><path d="M17 31h38v20c0 10-7 16-19 16S17 61 17 51z" fill={peach} {...stroke} /><path d="M55 37h8c9 0 9 14 0 14h-8M26 22c-5-6 5-7 0-13M40 22c-5-6 5-7 0-13" fill="none" {...stroke} /></>
    case 'magnifier-chart':
      return <><circle cx="34" cy="34" r="21" fill="white" {...stroke} /><path d="M49 49l18 18" {...stroke} /><path d="M23 44V32m9 12V24m9 20V17" {...stroke} /><path d="M19 47h26" {...stroke} /></>
    case 'blocks':
      return <><path d="M12 42l18-10 18 10-18 10z" fill={yellow} {...stroke} /><path d="M12 42v20l18 10V52M48 42v20L30 72" fill={peach} {...stroke} /><path d="M34 22l14-8 16 9-14 8z" fill={sky} {...stroke} /><path d="M34 22v13M64 23v18" fill="none" {...stroke} /></>
    case 'garden':
      return <><path d="M40 46v20" {...stroke} /><path d="M40 50C24 46 20 30 30 22c14 4 18 20 10 28zM40 42c16-4 20-20 10-28-14 4-18 20-10 28z" fill={mint} {...stroke} /><path d="M24 66h32l-4 8H28z" fill={peach} {...stroke} /></>
    case 'house':
      return <><path d="M12 38l28-24 28 24z" fill={peach} {...stroke} /><rect x="20" y="38" width="40" height="28" fill={sky} {...stroke} /><rect x="34" y="48" width="12" height="18" fill="white" {...stroke} /></>
    case 'pie-chart':
      return <><circle cx="40" cy="42" r="22" fill="white" {...stroke} /><path d="M40 42V20a22 22 0 0121 24z" fill={lavender} {...stroke} /><path d="M40 42l21 2a22 22 0 01-33 17z" fill={yellow} {...stroke} /></>
    default:
      return <><circle cx="40" cy="40" r="26" fill={yellow} {...stroke} /><path d="M28 40h24M40 28v24" {...stroke} /></>
  }
}
