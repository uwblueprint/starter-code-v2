import React, { useContext } from "react";
// graphql {
import { gql, useMutation } from "@apollo/client";
// } graphql
// rest {
import authAPIClient from "../../APIClients/AuthAPIClient";
// } rest
import AuthContext from "../../contexts/AuthContext";

// graphql {
const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!) {
    resetPassword(email: $email)
  }
`;

// } graphql
const ResetPassword = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);

  // graphql {
  const [resetPassword] = useMutation<{ resetPassword: boolean }>(
    RESET_PASSWORD,
  );

  // } graphql
  const onResetPasswordClick = async () => {
    // graphql {
    await resetPassword({ variables: { email: authenticatedUser?.email } });
    // } graphql
    // rest {
    await authAPIClient.resetPassword(authenticatedUser?.email);
    // } rest
  };

  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={onResetPasswordClick}
    >
      Reset Password
    </button>
  );
};

export default ResetPassword;
