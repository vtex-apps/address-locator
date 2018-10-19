import ContentLoader from 'react-content-loader'

const Loader = props => (
  <ContentLoader
    height={150}
    width={288}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="2" ry="2" width="144" height="20" />
    <rect x="0" y="28" rx="2" ry="2" width="288" height="54" />
    <rect x="0" y="94" rx="8" ry="8" width="288" height="54" />
  </ContentLoader>
)

export default Loader
