import { useAppContext } from '../context/AppContext';

const Toast = () => {
  const { toast } = useAppContext();

  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type}`}>
        {toast.message}
      </div>
    </div>
  );
};

export default Toast;
