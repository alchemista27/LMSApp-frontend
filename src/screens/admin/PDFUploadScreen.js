// src/screens/admin/PDFUploadScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as DocumentPicker from 'react-native-document-picker';
import { ChevronLeftIcon, DocumentTextIcon, CloudUploadIcon, CheckCircleIcon } from 'react-native-heroicons/outline';
import UploadService from '../../services/uploadService';

export default function PDFUploadScreen({ navigation, route }) {
  const { course, section, material } = route.params || {};
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      const file = result[0];
      
      // Validate file
      const validation = UploadService.validateFile(file, 'pdf');
      if (!validation.valid) {
        Alert.alert('Error', validation.error);
        return;
      }

      setSelectedFile({
        ...file,
        sizeFormatted: UploadService.formatFileSize(file.size)
      });
      setUploadedFile(null);
      setProgress(0);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
      } else {
        Alert.alert('Error', 'Failed to pick PDF file');
      }
    }
  };

  const uploadPDF = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a PDF file first');
      return;
    }

    setUploading(true);
    setProgress(0);

    const result = await UploadService.uploadFile(
      selectedFile, 
      'pdf', 
      (progress) => setProgress(progress)
    );

    setUploading(false);

    if (result.success) {
      setUploadedFile(result.data);
      Alert.alert(
        'Success', 
        'PDF uploaded successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              if (material) {
                // Update existing material with new URL
                navigation.navigate('EditMaterial', { 
                  course, 
                  section, 
                  material: {
                    ...material,
                    material_url: result.data.url
                  }
                });
              } else {
                // Navigate to add material with pre-filled URL
                navigation.navigate('AddMaterial', { 
                  course, 
                  section,
                  prefill: {
                    material_url: result.data.url,
                    material_type: 'pdf'
                  }
                });
              }
            }
          }
        ]
      );
    } else {
      Alert.alert('Upload Failed', result.error);
    }
  };

  const FileInfo = ({ file }) => (
    <View className="bg-green-50 rounded-xl p-4 mb-4">
      <View className="flex-row items-center">
        <DocumentTextIcon size={24} color="#10b981" />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-gray-800" numberOfLines={1}>
            {file.name}
          </Text>
          <Text className="text-gray-600 text-sm">{file.sizeFormatted}</Text>
          <Text className="text-gray-500 text-xs">
            Type: PDF • Pages: Unknown
          </Text>
        </View>
        <CheckCircleIcon size={20} color="#10b981" />
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
            <Text className="text-2xl font-bold text-gray-800">Upload PDF</Text>
            <Text className="text-gray-500">
              {course?.course_name} {section && `• ${section.section_name}`}
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
            <Text className="text-lg font-bold text-gray-800 mb-2">Upload PDF Document</Text>
            <Text className="text-gray-600 mb-6">
              Select a PDF file from your device to upload. Make sure the PDF is readable and properly formatted.
            </Text>

            {/* File Selection */}
            <TouchableOpacity
              className="border-2 border-dashed border-primary-300 rounded-2xl p-8 items-center bg-primary-50 mb-6"
              onPress={pickPDF}
              disabled={uploading}
            >
              <CloudUploadIcon size={48} color="#3b82f6" />
              <Text className="text-primary-600 font-semibold text-lg mt-4">
                {selectedFile ? 'Change PDF File' : 'Select PDF File'}
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Tap to choose a PDF file from your device
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                Max file size: 50MB
              </Text>
            </TouchableOpacity>

            {/* Selected File Info */}
            {selectedFile && <FileInfo file={selectedFile} />}

            {/* Upload Progress */}
            {uploading && <ProgressBar progress={progress} />}

            {/* Uploaded File Info */}
            {uploadedFile && (
              <View className="bg-success-50 rounded-xl p-4 mb-4">
                <View className="flex-row items-center">
                  <CheckCircleIcon size={24} color="#10b981" />
                  <View className="ml-3 flex-1">
                    <Text className="font-semibold text-success-700">Upload Complete!</Text>
                    <Text className="text-success-600 text-sm" numberOfLines={1}>
                      URL: {uploadedFile.url}
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
                  !selectedFile || uploading ? 'opacity-50' : ''
                }`}
                onPress={uploadPDF}
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <CloudUploadIcon size={20} color="white" />
                    <Text className="text-white font-semibold text-lg ml-2">
                      Upload PDF
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Upload Guidelines */}
            <View className="mt-6 p-4 bg-blue-50 rounded-xl">
              <Text className="text-primary-700 font-semibold mb-2">PDF Upload Guidelines:</Text>
              <Text className="text-primary-600 text-sm">• Only PDF files are supported</Text>
              <Text className="text-primary-600 text-sm">• Maximum file size: 50MB</Text>
              <Text className="text-primary-600 text-sm">• Ensure text is selectable (not scanned images)</Text>
              <Text className="text-primary-600 text-sm">• Use clear, readable fonts</Text>
              <Text className="text-primary-600 text-sm">• Optimize file size for faster loading</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}