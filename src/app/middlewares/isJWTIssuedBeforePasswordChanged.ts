const isJWTIssuedBeforePasswordChanged = (
  passwordChangedAt: Date,
  jwtIssuedAt: number,
): boolean => {
  const passwordChangedTimestamp = Math.floor(
    passwordChangedAt.getTime() / 1000,
  ); // Convert to seconds
  return jwtIssuedAt < passwordChangedTimestamp;
};

export default isJWTIssuedBeforePasswordChanged;
