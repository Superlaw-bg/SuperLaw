import toast from 'react-hot-toast';

const showSuccess = (message: string) => {
    toast.success(message, { duration: 5000 });
}

const showError = (error: string) => {
    toast.error(error, { duration: 5000 });
}

const toastService = {
    showSuccess,
    showError
};

export default toastService;