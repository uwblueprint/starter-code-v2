import React from "react";

import authAPIClient from "../../APIClients/AuthAPIClient";

const ResetPassword = () => {
  const onResetPasswordClick = async () => {
    await authAPIClient.resetPassword("PLACEHOLDER");
  };

  return (
    <button type="button" onClick={onResetPasswordClick}>
      Reset Password
    </button>
  );
};

export default ResetPassword;
