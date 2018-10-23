import ContentLoader from 'react-content-loader'

const Loader = props => (
  <ContentLoader
    height={60}
    width={100}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="1" ry="1" width="50" height="10" />
    <rect x="0" y="15" rx="1" ry="1" width="100" height="20" />
    <rect x="0" y="40" rx="1" ry="1" width="100" height="20" />
  </ContentLoader>
)

export default Loader
