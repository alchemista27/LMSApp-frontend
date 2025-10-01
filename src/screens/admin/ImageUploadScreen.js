// src/screens/admin/ImageUploadScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import * as DocumentPicker from 'react-native-document-picker';
import * as ImagePicker from 'react-native-image-picker';
import { 
  ChevronLeftIcon, 
  CloudUploadIcon, 
  CheckCircleIcon,
  CameraIcon,
  PhotoIcon 
} from 'react-native-heroicons/outline';
import UploadService from '../../services/uploadService';

export default function ImageUploadScreen({ navigation, route }) {
  const { course } = route.params || {};
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1200,
      });

      if (result.assets && result.assets[0]) {
        const image = result.assets[0];
        handleImageSelection(image);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1200,
      });

      if (result.assets && result.assets[0]) {
        const image = result.assets[0];
        handleImageSelection(image);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const pickImageFromFiles = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      const file = result[0];
      handleImageSelection(file);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled
      } else {
        Alert.alert('Error', 'Failed to pick image file');
      }
    }
  };

  const handleImageSelection = (image) => {
    const validation = UploadService.validateImage(image);
    if (!validation.valid) {
      Alert.alert('Error', validation.error);
      return;
    }

    setSelectedImage({
      ...image,
      sizeFormatted: UploadService.formatFileSize(image.fileSize || image.size),
      uri: image.uri || image.uri
    });
    setUploadedImage(null);
    setProgress(0);
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setUploading(true);
    setProgress(0);

    const result = await UploadService.uploadImage(
      selectedImage, 
      (progress) => setProgress(progress)
    );

    setUploading(false);

    if (result.success) {
      setUploadedImage(result.data);
      Alert.alert(
        'Success', 
        'Image uploaded successfully!',
        [
          { 
            text: 'Use as Course Thumbnail', 
            onPress: () => {
              if (course) {
                // Update course with new image URL
                navigation.navigate('EditCourse', { 
                  course: {
                    ...course,
                    course_img: result.data.url
                  }
                });
              } else {
                // Navigate to add course with pre-filled image
                navigation.navigate('AddCourse', { 
                  prefill: {
                    course_img: result.data.url
                  }
                });
              }
            }
          },
          {
            text: 'Just Upload',
            style: 'cancel'
          }
        ]
      );
    } else {
      Alert.alert('Upload Failed', result.error);
    }
  };

  const ImagePreview = ({ image }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-200">
      <Text className="font-semibold text-gray-800 mb-3">Selected Image</Text>
      <View className="flex-row">
        <Image 
          source={{ uri: image.uri }} 
          className="w-24 h-24 rounded-xl mr-4"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="font-medium text-gray-800" numberOfLines={1}>
            {image.fileName || image.name}
          </Text>
          <Text className="text-gray-600 text-sm mt-1">{image.sizeFormatted}</Text>
          <Text className="text-gray-500 text-xs mt-1">
            Dimensions: {image.width || 'Unknown'} × {image.height || 'Unknown'}
          </Text>
        </View>
      </View>
    </View>
  );

  const ProgressBar = ({ progress }) => (
    <View className="mb-4">
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-700 font-medium">Upload Progress</Text>
        <Text className="text-gray-600">{progress}%</Text>
      </View>
      <View className="w-full bg-gray-200 rounded-full h-3">
        <View 
          className="bg-primary-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <ChevronLeftIcon size={24} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-800">Upload Image</Text>
            <Text className="text-gray-500">
              {course?.course_name || 'Course Thumbnail'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="px-6 pt-6">
          {/* Upload Container */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <Text className="text-lg font-bold text-gray-800 mb-2">Upload Course Image</Text>
            <Text className="text-gray-600 mb-6">
              Choose a thumbnail image for your course. Recommended: 16:9 aspect ratio, at least 800×450 pixels.
            </Text>

            {/* Image Selection Options */}
            <View className="flex-row space-x-3 mb-6">
              <TouchableOpacity
                className="flex-1 bg-primary-50 rounded-xl p-4 items-center border border-primary-200"
                onPress={pickImageFromGallery}
                disabled={uploading}
              >
                <PhotoIcon size={32} color="#3b82f6" />
                <Text className="text-primary-600 font-medium mt-2 text-center">
                  Gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-success-50 rounded-xl p-4 items-center border border-success-200"
                onPress={takePhoto}
                disabled={uploading}
              >
                <CameraIcon size={32} color="#10b981" />
                <Text className="text-success-600 font-medium mt-2 text-center">
                  Camera
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-warning-50 rounded-xl p-4 items-center border border-warning-200"
                onPress={pickImageFromFiles}
                disabled={uploading}
              >
                <CloudUploadIcon size={32} color="#f59e0b" />
                <Text className="text-warning-600 font-medium mt-2 text-center">
                  Files
                </Text>
              </TouchableOpacity>
            </View>

            {/* Selected Image Preview */}
            {selectedImage && <ImagePreview image={selectedImage} />}

            {/* Upload Progress */}
            {uploading && <ProgressBar progress={progress} />}

            {/* Uploaded Image Info */}
            {uploadedImage && (
              <View className="bg-success-50 rounded-xl p-4 mb-4">
                <View className="flex-row items-center">
                  <CheckCircleIcon size={24} color="#10b981" />
                  <View className="ml-3 flex-1">
                    <Text className="font-semibold text-success-700">Upload Complete!</Text>
                    <Text className="text-success-600 text-sm" numberOfLines={1}>
                      URL: {uploadedImage.url}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-4 flex-row justify-center items-center"
                onPress={() => navigation.goBack()}
                disabled={uploading}
              >
                <Text className="text-gray-700 font-semibold text-lg">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className={`flex-1 bg-primary-600 rounded-xl py-4 flex-row justify-center items-center ${
                  !selectedImage || uploading ? 'opacity-50' : ''
                }`}
                onPress={uploadImage}
                disabled={!selectedImage || uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <CloudUploadIcon size={20} color="white" />
                    <Text className="text-white font-semibold text-lg ml-2">
                      Upload Image
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Image Guidelines */}
            <View className="mt-6 p-4 bg-blue-50 rounded-xl">
              <Text className="text-primary-700 font-semibold mb-2">Image Guidelines:</Text>
              <Text className="text-primary-600 text-sm">• Recommended size: 800×450 pixels (16:9 ratio)</Text>
              <Text className="text-primary-600 text-sm">• Maximum file size: 10MB</Text>
              <Text className="text-primary-600 text-sm">• Supported formats: JPEG, PNG, GIF, WebP</Text>
              <Text className="text-primary-600 text-sm">• Use high-quality, relevant images</Text>
              <Text className="text-primary-600 text-sm">• Avoid text-heavy images for thumbnails</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}