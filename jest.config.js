module.exports = {
  preset: '@testing-library/react-native',
  // moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // transformIgnorePatterns: [
  //   'node_modules/(?!(jest-)?react-native|react-(native|universal|navigation)-(.*)|@jest|@react-native|@react-native-community/(.*)|@react-navigation/(.*)|bs-platform|(@[a-zA-Z]+/)?(bs|reason|rescript)-(.*)+)'
  // ],
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\\/]+$'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect']
  // setupFiles: ['node_modules/react-native-gesture-handler/jestSetup.js']
}
