import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { apiService, WorkoutPostResponse, WorkoutPostsResponse, WorkoutPostCreateRequest, WorkoutPostUpdateRequest } from '../services/api';

export type FeedType = 'personal' | 'public' | 'combined';

interface FeedState {
  personalFeed: WorkoutPostResponse[];
  publicFeed: WorkoutPostResponse[];
  combinedFeed: WorkoutPostResponse[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentFeedType: FeedType;
}

interface FeedContextType extends FeedState {
  // Feed operations
  loadFeed: (feedType: FeedType, refresh?: boolean) => Promise<void>;
  loadMorePosts: () => Promise<void>;
  refreshFeed: () => Promise<void>;
  setCurrentFeedType: (feedType: FeedType) => void;
  
  // Post operations
  createPost: (postData: WorkoutPostCreateRequest) => Promise<void>;
  updatePost: (postId: string, postData: WorkoutPostUpdateRequest) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  
  // Utility functions
  getCurrentFeed: () => WorkoutPostResponse[];
  clearError: () => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

interface FeedProviderProps {
  children: ReactNode;
}

export function FeedProvider({ children }: FeedProviderProps) {
  const [state, setState] = useState<FeedState>({
    personalFeed: [],
    publicFeed: [],
    combinedFeed: [],
    isLoading: false,
    error: null,
    hasMore: true,
    currentFeedType: 'personal',
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const setCurrentFeedType = useCallback((feedType: FeedType) => {
    setState(prev => ({ ...prev, currentFeedType: feedType }));
  }, []);

  const getCurrentFeedForType = useCallback((feedType: FeedType): WorkoutPostResponse[] => {
    switch (feedType) {
      case 'personal':
        return state.personalFeed;
      case 'public':
        return state.publicFeed;
      case 'combined':
        return state.combinedFeed;
      default:
        return state.personalFeed;
    }
  }, [state.personalFeed, state.publicFeed, state.combinedFeed]);

  const getCurrentFeed = useCallback((): WorkoutPostResponse[] => {
    switch (state.currentFeedType) {
      case 'personal':
        return state.personalFeed;
      case 'public':
        return state.publicFeed;
      case 'combined':
        return state.combinedFeed;
      default:
        return state.personalFeed;
    }
  }, [state.personalFeed, state.publicFeed, state.combinedFeed, state.currentFeedType]);

  const loadFeed = useCallback(async (feedType: FeedType, refresh: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentFeed = getCurrentFeedForType(feedType);
      const skip = refresh ? 0 : currentFeed.length;
      
      let response: WorkoutPostsResponse;
      
      switch (feedType) {
        case 'personal':
          response = await apiService.getPersonalFeed(skip, 20);
          break;
        case 'public':
          response = await apiService.getPublicFeed(skip, 20);
          break;
        case 'combined':
          response = await apiService.getFeed('combined', skip, 20);
          break;
        default:
          response = await apiService.getPersonalFeed(skip, 20);
      }

      setState(prev => {
        const newState = { ...prev };
        const feedKey = `${feedType}Feed` as keyof Pick<FeedState, 'personalFeed' | 'publicFeed' | 'combinedFeed'>;
        
        if (refresh) {
          newState[feedKey] = response.data;
        } else {
          newState[feedKey] = [...prev[feedKey], ...response.data];
        }
        
        newState.hasMore = response.data.length === 20; // Assume no more if less than requested
        return newState;
      });
    } catch (error) {
      console.error('Error loading feed:', error);
      setError(error instanceof Error ? error.message : 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, [getCurrentFeedForType, setLoading, setError]);

  const loadMorePosts = useCallback(async () => {
    if (!state.hasMore || state.isLoading) return;
    await loadFeed(state.currentFeedType, false);
  }, [state.hasMore, state.isLoading, state.currentFeedType, loadFeed]);

  const refreshFeed = useCallback(async () => {
    await loadFeed(state.currentFeedType, true);
  }, [state.currentFeedType, loadFeed]);

  const createPost = useCallback(async (postData: WorkoutPostCreateRequest) => {
    try {
      setLoading(true);
      setError(null);

      const newPost = await apiService.createWorkoutPost(postData);
      
      // Add the new post to the beginning of relevant feeds
      setState(prev => ({
        ...prev,
        personalFeed: [newPost, ...prev.personalFeed],
        combinedFeed: [newPost, ...prev.combinedFeed],
        // Add to public feed only if it's a public post
        publicFeed: newPost.is_public ? [newPost, ...prev.publicFeed] : prev.publicFeed,
      }));
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error instanceof Error ? error.message : 'Failed to create post');
      throw error; // Re-throw so the UI can handle it
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (postId: string, postData: WorkoutPostUpdateRequest) => {
    // Store the original post data for potential restoration
    let originalPost: WorkoutPostResponse | null = null;
    let previousState: FeedState | null = null;

    try {
      setError(null);

      // Store current state and find the post to update
      setState(prev => {
        previousState = { ...prev };
        originalPost = prev.personalFeed.find(post => post.id === postId) ||
                      prev.publicFeed.find(post => post.id === postId) ||
                      prev.combinedFeed.find(post => post.id === postId) ||
                      null;

        if (!originalPost) {
          return prev; // Post not found, no optimistic update
        }

        // Create optimistically updated post
        const updatedPost: WorkoutPostResponse = {
          ...originalPost,
          ...postData,
          updated_at: new Date().toISOString(),
        };

        // Optimistic update: Update the post immediately in all relevant feeds
        const updatePostInFeed = (feed: WorkoutPostResponse[]) =>
          feed.map(post => post.id === postId ? updatedPost : post);

        return {
          ...prev,
          personalFeed: updatePostInFeed(prev.personalFeed),
          publicFeed: updatePostInFeed(prev.publicFeed),
          combinedFeed: updatePostInFeed(prev.combinedFeed),
        };
      });

      // Attempt to update the post on the server
      const serverUpdatedPost = await apiService.updateWorkoutPost(postId, postData);
      
      // Success - update with server response to ensure consistency
      setState(prev => {
        const updatePostInFeed = (feed: WorkoutPostResponse[]) =>
          feed.map(post => post.id === postId ? serverUpdatedPost : post);

        return {
          ...prev,
          personalFeed: updatePostInFeed(prev.personalFeed),
          publicFeed: updatePostInFeed(prev.publicFeed),
          combinedFeed: updatePostInFeed(prev.combinedFeed),
        };
      });
      
    } catch (error) {
      console.error('Error updating post:', error);
      
      // Restore the post to its previous state if update failed
      if (previousState) {
        setState(previousState);
      }
      
      setError(error instanceof Error ? error.message : 'Failed to update post');
      throw error;
    }
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    console.log('FeedContext deletePost called with postId:', postId);
    
    // Store the post data for potential restoration
    let deletedPost: WorkoutPostResponse | null = null;
    let previousState: FeedState | null = null;

    try {
      setError(null);
      console.log('Starting delete process...');

      // Store current state and find the post to delete
      setState(prev => {
        previousState = { ...prev };
        deletedPost = prev.personalFeed.find(post => post.id === postId) ||
                     prev.publicFeed.find(post => post.id === postId) ||
                     prev.combinedFeed.find(post => post.id === postId) ||
                     null;

        console.log('Found post to delete:', deletedPost);
        console.log('Personal feed length before:', prev.personalFeed.length);
        console.log('Public feed length before:', prev.publicFeed.length);
        console.log('Combined feed length before:', prev.combinedFeed.length);

        // Optimistic update: Remove the post immediately from all feeds
        const newState = {
          ...prev,
          personalFeed: prev.personalFeed.filter(post => post.id !== postId),
          publicFeed: prev.publicFeed.filter(post => post.id !== postId),
          combinedFeed: prev.combinedFeed.filter(post => post.id !== postId),
        };

        console.log('Personal feed length after:', newState.personalFeed.length);
        console.log('Public feed length after:', newState.publicFeed.length);
        console.log('Combined feed length after:', newState.combinedFeed.length);

        return newState;
      });

      console.log('Making API call to delete post...');
      // Attempt to delete the post on the server
      await apiService.deleteWorkoutPost(postId);
      console.log('API call successful - post deleted');
      
      // Success - the optimistic update stands
    } catch (error) {
      console.error('Error deleting post:', error);
      
      // Restore the post to its previous position if deletion failed
      if (previousState && deletedPost) {
        console.log('Restoring previous state due to error');
        setState(previousState);
      }
      
      setError(error instanceof Error ? error.message : 'Failed to delete post');
      throw error;
    }
  }, []);

  const contextValue: FeedContextType = {
    ...state,
    loadFeed,
    loadMorePosts,
    refreshFeed,
    setCurrentFeedType,
    createPost,
    updatePost,
    deletePost,
    getCurrentFeed,
    clearError,
  };

  return (
    <FeedContext.Provider value={contextValue}>
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
}