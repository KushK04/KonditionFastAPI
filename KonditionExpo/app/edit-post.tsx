import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useFeed } from '../contexts/FeedContext';
import { WorkoutPostCreateRequest, WorkoutPostUpdateRequest } from '../services/api';
import { IconSymbol } from '../components/ui/IconSymbol';

const WORKOUT_TYPES = [
  'Running',
  'Cycling',
  'Swimming',
  'Strength Training',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Boxing',
  'Dancing',
  'Walking',
  'Hiking',
  'Other',
];

export default function EditPostScreen() {
  const { isLoading, updatePost: contextUpdatePost, deletePost: contextDeletePost } = useFeed();
  const params = useLocalSearchParams();
  
  const [formData, setFormData] = useState<WorkoutPostCreateRequest>({
    title: '',
    description: '',
    workout_type: 'Running',
    duration_minutes: 30,
    calories_burned: undefined,
    is_public: true,
  });

  const [showWorkoutTypes, setShowWorkoutTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper function to safely get string value from params
  const getStringParam = (param: string | string[] | undefined): string => {
    if (Array.isArray(param)) {
      return param[0] || '';
    }
    return param || '';
  };

  // Pre-populate form with existing post data
  useEffect(() => {
    if (params && params.postId) {
      const title = getStringParam(params.title);
      const description = getStringParam(params.description);
      const workout_type = getStringParam(params.workout_type) || 'Running';
      const duration_minutes = params.duration_minutes ? parseInt(getStringParam(params.duration_minutes)) : 30;
      const calories_burned = params.calories_burned ? parseInt(getStringParam(params.calories_burned)) : undefined;
      const is_public = params.is_public ? getStringParam(params.is_public) === 'true' : true;

      setFormData({
        title,
        description,
        workout_type,
        duration_minutes,
        calories_burned,
        is_public,
      });
    }
  }, [params.postId, params.title, params.description, params.workout_type, params.duration_minutes, params.calories_burned, params.is_public]);


  const handleSaveChanges = async () => {
    // Prevent multiple submissions
    if (isSubmitting || isLoading || isDeleting) {
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Error: Please enter a title for your workout');
      } else {
        Alert.alert('Error', 'Please enter a title for your workout');
      }
      return;
    }

    if (formData.duration_minutes <= 0) {
      if (Platform.OS === 'web') {
        window.alert('Error: Duration must be greater than 0');
      } else {
        Alert.alert('Error', 'Duration must be greater than 0');
      }
      return;
    }

    const postId = getStringParam(params.postId);
    if (!postId) {
      if (Platform.OS === 'web') {
        window.alert('Error: Post ID is missing');
      } else {
        Alert.alert('Error', 'Post ID is missing');
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert WorkoutPostCreateRequest to WorkoutPostUpdateRequest
      const updateData: WorkoutPostUpdateRequest = {
        title: formData.title,
        description: formData.description,
        workout_type: formData.workout_type,
        duration_minutes: formData.duration_minutes,
        calories_burned: formData.calories_burned,
        is_public: formData.is_public,
      };

      await contextUpdatePost(postId, updateData);
      
      // Success - navigate back immediately and show toast-like feedback
      router.back();
      
      // Show success message after navigation
      setTimeout(() => {
        if (Platform.OS === 'web') {
          window.alert('Success: Your workout post has been updated!');
        } else {
          Alert.alert('Success', 'Your workout post has been updated!');
        }
      }, 100);
      
    } catch (error) {
      console.error('Error updating post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update post. Please try again.';
      
      if (Platform.OS === 'web') {
        window.alert('Error: ' + errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
      setIsSubmitting(false); // Only reset on error, success navigates away
    }
  };

  const handleDeletePost = async () => {
    console.log('handleDeletePost called');
    console.log('Current state - isSubmitting:', isSubmitting, 'isLoading:', isLoading, 'isDeleting:', isDeleting);
    
    if (isSubmitting || isLoading || isDeleting) {
      console.log('Blocked due to loading state');
      return;
    }

    const postId = getStringParam(params.postId);
    console.log('Post ID:', postId);
    
    if (!postId) {
      if (Platform.OS === 'web') {
        window.alert('Error: Post ID is missing');
      } else {
        Alert.alert('Error', 'Post ID is missing');
      }
      return;
    }

    console.log('About to show confirmation dialog');
    
    // Use web-compatible confirmation for web platform
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
      if (confirmed) {
        console.log('Delete confirmed (web), starting deletion process');
        await performDelete(postId);
      } else {
        console.log('Delete cancelled (web)');
      }
    } else {
      // Use Alert.alert for mobile platforms
      Alert.alert(
        'Delete Post',
        'Are you sure you want to delete this post? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => console.log('Delete cancelled'),
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              console.log('Delete confirmed, starting deletion process');
              await performDelete(postId);
            },
          },
        ]
      );
    }
  };

  const performDelete = async (postId: string) => {
    setIsDeleting(true);

    try {
      console.log('Calling contextDeletePost with postId:', postId);
      await contextDeletePost(postId);
      console.log('Delete successful, navigating back');
      
      // Success - navigate back immediately and show toast-like feedback
      router.back();
      
      // Show success message after navigation
      setTimeout(() => {
        if (Platform.OS === 'web') {
          window.alert('Success: Your post has been deleted.');
        } else {
          Alert.alert('Success', 'Your post has been deleted.');
        }
      }, 100);
      
    } catch (error) {
      console.error('Error deleting post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete post. Please try again.';
      
      if (Platform.OS === 'web') {
        window.alert('Error: ' + errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
      setIsDeleting(false); // Only reset on error, success navigates away
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Post</Text>
        <TouchableOpacity
          onPress={handleSaveChanges}
          style={[
            styles.headerButton,
            styles.saveButton,
            (isLoading || isSubmitting || isDeleting) && { opacity: 0.6, backgroundColor: '#999' }
          ]}
          disabled={isLoading || isSubmitting || isDeleting}
        >
          <Text style={[styles.saveText, (isLoading || isSubmitting || isDeleting) && styles.disabledText]}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.title}
            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            placeholder="What did you do today?"
            maxLength={255}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            placeholder="Tell us about your workout..."
            multiline
            numberOfLines={4}
            maxLength={1000}
          />
        </View>

        {/* Workout Type */}
        <View style={styles.section}>
          <Text style={styles.label}>Workout Type *</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowWorkoutTypes(!showWorkoutTypes)}
          >
            <Text style={styles.dropdownText}>{formData.workout_type}</Text>
            <IconSymbol 
              name={showWorkoutTypes ? "chevron.up" : "chevron.down"} 
              size={16} 
              color="#666" 
            />
          </TouchableOpacity>
          
          {showWorkoutTypes && (
            <View style={styles.dropdownOptions}>
              {WORKOUT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setFormData(prev => ({ ...prev, workout_type: type }));
                    setShowWorkoutTypes(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    formData.workout_type === type && styles.selectedOption
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.label}>Duration (minutes) *</Text>
          <View style={styles.durationContainer}>
            <TextInput
              style={styles.numberInput}
              value={formData.duration_minutes.toString()}
              onChangeText={(text) => {
                const minutes = parseInt(text) || 0;
                setFormData(prev => ({ ...prev, duration_minutes: minutes }));
              }}
              keyboardType="numeric"
              placeholder="30"
            />
            <Text style={styles.durationDisplay}>
              = {formatDuration(formData.duration_minutes)}
            </Text>
          </View>
        </View>

        {/* Calories */}
        <View style={styles.section}>
          <Text style={styles.label}>Calories Burned</Text>
          <TextInput
            style={styles.numberInput}
            value={formData.calories_burned?.toString() || ''}
            onChangeText={(text) => {
              const calories = text ? parseInt(text) || undefined : undefined;
              setFormData(prev => ({ ...prev, calories_burned: calories }));
            }}
            keyboardType="numeric"
            placeholder="Optional"
          />
        </View>

        {/* Privacy Setting */}
        <View style={styles.section}>
          <View style={styles.privacyContainer}>
            <View style={styles.privacyInfo}>
              <Text style={styles.label}>Privacy Setting</Text>
              <Text style={styles.privacyDescription}>
                {formData.is_public 
                  ? "Public - Visible to everyone" 
                  : "Private - Only visible to mutual followers"
                }
              </Text>
            </View>
            <Switch
              value={formData.is_public}
              onValueChange={(value) => setFormData(prev => ({ ...prev, is_public: value }))}
              trackColor={{ false: '#FF9800', true: '#4CAF50' }}
              thumbColor="#fff"
            />
          </View>
          
          <View style={styles.privacyIndicator}>
            <IconSymbol 
              name={formData.is_public ? "globe" : "lock.fill"} 
              size={16} 
              color={formData.is_public ? "#4CAF50" : "#FF9800"} 
            />
            <Text style={[styles.privacyText, { color: formData.is_public ? "#4CAF50" : "#FF9800" }]}>
              {formData.is_public ? "Public Post" : "Private Post"}
            </Text>
          </View>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.label}>Preview</Text>
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>{formData.title || 'Your workout title'}</Text>
            {formData.description && (
              <Text style={styles.previewDescription}>{formData.description}</Text>
            )}
            <View style={styles.previewStats}>
              <Text style={styles.previewStat}>
                <Text>🏃‍♂️ {formData.workout_type}</Text>
              </Text>
              <Text style={styles.previewStat}>
                <Text>⏱️ {formatDuration(formData.duration_minutes)}</Text>
              </Text>
              {formData.calories_burned && (
                <Text style={styles.previewStat}>
                  <Text>🔥 {formData.calories_burned} cal</Text>
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Delete Button */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={handleDeletePost}
            style={[
              styles.deleteButton,
              (isLoading || isSubmitting || isDeleting) && { opacity: 0.6, backgroundColor: '#999' }
            ]}
            disabled={isLoading || isSubmitting || isDeleting}
          >
            <IconSymbol
              name="trash"
              size={16}
              color="#fff"
            />
            <Text style={styles.deleteButtonText}>
              {isDeleting ? 'Deleting...' : 'Delete Post'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 50, // Account for status bar
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledText: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 4,
    maxHeight: 200,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOption: {
    color: '#007AFF',
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    width: 100,
    marginRight: 12,
  },
  durationDisplay: {
    fontSize: 16,
    color: '#666',
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  privacyInfo: {
    flex: 1,
  },
  privacyDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  privacyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  privacyText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  preview: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  previewStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  previewStat: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});