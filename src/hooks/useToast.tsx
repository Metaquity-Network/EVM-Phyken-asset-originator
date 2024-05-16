import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultToastOptions: ToastOptions = {
  autoClose: 5000, // 5 seconds
  position: 'top-right',
  theme: 'light',
  pauseOnHover: true,
  draggable: false,
  closeOnClick: true,
};

let toastId = 0;

export function useToast() {
  const showToast = (message: string, options?: ToastOptions) => {
    const toastOptions: ToastOptions = { ...defaultToastOptions, ...options };
    toastId += 1;
    toast(message, { ...toastOptions, toastId });
  };

  return { showToast };
}
