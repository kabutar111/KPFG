interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <span className="text-red-500 text-xs ml-2">
    {message}
  </span>
);
