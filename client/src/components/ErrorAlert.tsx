import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert = ({ message, onRetry }: ErrorAlertProps) => (
  <Alert
    severity="error"
    action={
      onRetry && (
        <Button color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      )
    }
  >
    {message}
  </Alert>
);
