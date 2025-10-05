import { renderHook, act } from '@testing-library/react-native';
import { useAdsViewModel } from './view-model';

// Mock do useNavigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('useAdsViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useAdsViewModel());

    expect(result.current.avatarIsLoading).toBe(true);
    expect(typeof result.current.handleNavigateToAdDetails).toBe('function');
    expect(typeof result.current.handleAvatarLoading).toBe('function');
  });

  it('should handle avatar loading state changes', () => {
    const { result } = renderHook(() => useAdsViewModel());

    // Initially loading
    expect(result.current.avatarIsLoading).toBe(true);

    // Set loading to false
    act(() => {
      result.current.handleAvatarLoading(false);
    });

    expect(result.current.avatarIsLoading).toBe(false);

    // Set loading to true again
    act(() => {
      result.current.handleAvatarLoading(true);
    });

    expect(result.current.avatarIsLoading).toBe(true);
  });

  it('should navigate to ad details with correct id', () => {
    const { result } = renderHook(() => useAdsViewModel());
    const testId = 'product-123';

    act(() => {
      result.current.handleNavigateToAdDetails(testId);
    });

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('adDetails', { id: testId });
  });

  it('should navigate with different product ids', () => {
    const { result } = renderHook(() => useAdsViewModel());

    // Test with different IDs
    const ids = ['product-1', 'product-2', 'product-abc'];

    ids.forEach((id) => {
      act(() => {
        result.current.handleNavigateToAdDetails(id);
      });

      expect(mockNavigate).toHaveBeenCalledWith('adDetails', { id });
    });

    expect(mockNavigate).toHaveBeenCalledTimes(ids.length);
  });

  it('should handle navigation with empty string id', () => {
    const { result } = renderHook(() => useAdsViewModel());

    act(() => {
      result.current.handleNavigateToAdDetails('');
    });

    expect(mockNavigate).toHaveBeenCalledWith('adDetails', { id: '' });
  });

  it('should handle navigation with numeric string id', () => {
    const { result } = renderHook(() => useAdsViewModel());

    act(() => {
      result.current.handleNavigateToAdDetails('123');
    });

    expect(mockNavigate).toHaveBeenCalledWith('adDetails', { id: '123' });
  });

  it('should maintain state independence between hook instances', () => {
    const { result: result1 } = renderHook(() => useAdsViewModel());
    const { result: result2 } = renderHook(() => useAdsViewModel());

    // Both should start with loading true
    expect(result1.current.avatarIsLoading).toBe(true);
    expect(result2.current.avatarIsLoading).toBe(true);

    // Change loading state in first instance
    act(() => {
      result1.current.handleAvatarLoading(false);
    });

    // First instance should be false, second should still be true
    expect(result1.current.avatarIsLoading).toBe(false);
    expect(result2.current.avatarIsLoading).toBe(true);

    // Change loading state in second instance
    act(() => {
      result2.current.handleAvatarLoading(false);
    });

    // Both should now be false
    expect(result1.current.avatarIsLoading).toBe(false);
    expect(result2.current.avatarIsLoading).toBe(false);
  });

  it('should handle multiple rapid state changes', () => {
    const { result } = renderHook(() => useAdsViewModel());

    // Rapid state changes
    act(() => {
      result.current.handleAvatarLoading(false);
      result.current.handleAvatarLoading(true);
      result.current.handleAvatarLoading(false);
      result.current.handleAvatarLoading(true);
    });

    expect(result.current.avatarIsLoading).toBe(true);
  });

  it('should handle multiple navigation calls', () => {
    const { result } = renderHook(() => useAdsViewModel());

    act(() => {
      result.current.handleNavigateToAdDetails('id1');
      result.current.handleNavigateToAdDetails('id2');
      result.current.handleNavigateToAdDetails('id3');
    });

    expect(mockNavigate).toHaveBeenCalledTimes(3);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, 'adDetails', { id: 'id1' });
    expect(mockNavigate).toHaveBeenNthCalledWith(2, 'adDetails', { id: 'id2' });
    expect(mockNavigate).toHaveBeenNthCalledWith(3, 'adDetails', { id: 'id3' });
  });

  it('should return correct interface structure', () => {
    const { result } = renderHook(() => useAdsViewModel());

    expect(result.current).toHaveProperty('avatarIsLoading');
    expect(result.current).toHaveProperty('handleNavigateToAdDetails');
    expect(result.current).toHaveProperty('handleAvatarLoading');

    expect(typeof result.current.avatarIsLoading).toBe('boolean');
    expect(typeof result.current.handleNavigateToAdDetails).toBe('function');
    expect(typeof result.current.handleAvatarLoading).toBe('function');
  });
});
