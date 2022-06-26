import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useClientParams() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const authorize = useCallback(
    function authorize() {
      if (
        (state as Record<string, string>)?.clientId &&
        (state as Record<string, string>)?.redirectURI
      ) {
        const { clientId, redirectURI } = state as Record<string, string>;
        navigate(`/authorize?clientId=${clientId}&redirectURI=${redirectURI}`);
        return;
      }
      navigate('/dashboard');
    },
    [navigate, state]
  );

  return { authorize };
}
