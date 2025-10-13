import { toast } from 'react-toastify';

export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showWarning = (message) => {
  toast.warn(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showInfo = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showLoading = (message = "Loading...") => {
  return toast.loading(message, {
    position: "top-right",
  });
};

export const updateToast = (toastId, type, message) => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: 3000,
    closeOnClick: true,
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};