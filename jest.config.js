module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|react-(native|universal|navigation)-(.*)|@jest|@react-native|@react-native-community/(.*)|@react-navigation/(.*)|bs-platform|(@[a-zA-Z]+/)?(bs|reason|rescript)-(.*)+)",
  ],
};
