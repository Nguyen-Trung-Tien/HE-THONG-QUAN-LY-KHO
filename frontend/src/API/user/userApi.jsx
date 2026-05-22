import axiosInstance from "../utils/axiosInstance";

const SignInUser = async (userEmail, userPassword) => {
  try {
    const response = await axiosInstance.post(
      `/user/login-user`,
      {
        email: userEmail,
        password: userPassword,
      }
    );

    const { user, access_token, errCode, message, requires2FA, requiresPIN, email } = response.data;

    // Only save to localStorage if login is complete (not waiting for 2FA or PIN)
    if (errCode === 0 && !requires2FA && !requiresPIN) {
      const userData = {
        ...user,
        access_token,
      };
      localStorage.setItem("user", JSON.stringify(userData));
    }

    return {
      user,
      access_token,
      errCode,
      message,
      requires2FA,
      requiresPIN,
      email
    };
  } catch (e) {
    console.error("SignInUser failed:", e);
    throw e;
  }
};

const SignUpUser = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/user/create-new-user`,
      data
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const GetDetailUser = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/user/get-all-user?id=${userId}`
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const DeleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/user/delete-user`, {
      data: { id: userId },
    });
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const UpdateDetailUser = async (data) => {
  try {
    const response = await axiosInstance.put(
      `/user/update-user`,
      data
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const UserLogout = async () => {
  try {
    const response = await axiosInstance.post(`/user/logout`);
    localStorage.removeItem("user");
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const RefreshToken = async () => {
  try {
    const response = await axiosInstance.post(
      `/user/refresh-token`
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const ChangePassword = async (data) => {
  try {
    const response = await axiosInstance.put(
      `/user/change-password`,
      data
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const UpdatePreferences = async (data) => {
  try {
    const response = await axiosInstance.put(
      `/user/update-preferences`,
      data
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export {
  SignInUser,
  SignUpUser,
  RefreshToken,
  UserLogout,
  GetDetailUser,
  DeleteUser,
  UpdateDetailUser,
  ChangePassword,
  UpdatePreferences,
};
