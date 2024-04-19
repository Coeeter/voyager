import { useRouter } from '@tanstack/react-router';
import { useHistory } from './useHistory';

export const useNavigateToFilepath = () => {
  const router = useRouter();
  const updateHistory = useHistory(state => state.updateHistory);

  return (filepath: string, replace?: boolean) => {
    updateHistory(filepath, replace);

    router.navigate({
      to: '/$filepath',
      params: { filepath },
    });
  };
};
